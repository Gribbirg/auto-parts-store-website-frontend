"use strict"

let content = [];
document.getElementById("clean_button").disabled = true;
document.getElementById("sub").disabled = true;

let captcha = CreateCaptcha();
captcha.check();

window.addEventListener("pageshow", function () {
    cart = getCart();
    initProducts().then();
});

document.getElementById("clean_button").onclick = function () {
    cart = [];
    setCart(cart);
    checkForNullCart();
    setSumValue();
}

document.getElementById("captcha_input").addEventListener("change", function (event) {
    captcha.check();
    event.stopPropagation();
});

document.getElementById("order_form").onsubmit = function () {
    if (cart.length === 0) {
        alert("Корзина пуста!");
    } else {
        showNotification(`<p>Заказ отправлен!</p><img height="100px" src="../images/logo/logo_big.png" alt="Логотип">`);
        cart = [];
        setCart(cart);
        initProducts().then();
        this.reset();
    }
}

document.getElementById("cart_div").onclick = confirmRef;
document.getElementById("header").onclick = confirmRef;

async function initProducts() {
    document.getElementById("cart_div").innerHTML = "";
    let sum = 0;
    for (let cartProduct of cart) {
        let product = await getProduct(cartProduct);
        sum += product["cost"] * cartProduct["count"];
        content.push(product);
        createCartElement(product, cartProduct);
    }
    document.getElementById("sum_text").textContent = `Всего: ${sum.toLocaleString()} ₽`;
    document.getElementById("sum_text").style.display = (sum === 0) ? "none" : "block";
    setButtonsListeners();
    checkForNullCart();
    setSumValue();
    setSelectListeners();
}

function setSelectListeners() {
    document.querySelectorAll(".cart_element_div").forEach(function (item) {
        item.onclick = function (event) {
            if (event.target.tagName === "A" || event.target.tagName === "BUTTON") return;

            item.onmousedown = function () {
                return false;
            };

            if (item.classList.contains("selected_cart_div")) {
                item.classList.remove("selected_cart_div");
            } else {
                if (!event.ctrlKey && !event.metaKey) {
                    document.querySelectorAll(".cart_element_div").forEach(function (item) {
                        item.classList.remove("selected_cart_div");
                    });
                }
                item.classList.add("selected_cart_div");
            }
            setDelButtonState();
        }
    });
}

function setDelButtonState() {
    let button = document.getElementById("clean_button");
    for (let div of document.querySelectorAll(".cart_element_div")) {
        if (div.classList.contains("selected_cart_div")) {

            button.innerHTML = "Удалить выбранное<span></span>";
            button.onclick = function () {
                for (let item of document.querySelectorAll(".cart_element_div")) {
                    if (item.classList.contains("selected_cart_div")) {
                        removeFromCart(cart, item.id.split("+")[0]);
                        item.remove();
                    }
                }
                checkForNullCart();
                setSumValue();
                setDelButtonState();
            }
            return;
        }
    }
    button.innerHTML = "Отчистить<span></span>";
    button.onclick = function () {
        cart = [];
        setCart(cart);
        checkForNullCart();
        setSumValue();
    }
}

async function getProduct(cartProduct) {
    let response = await fetch(`../data/products/${cartProduct.type}/${cartProduct.category}.json`);
    return (await response.json()).find(function (item) {
        return item.id === cartProduct.id
    });
}

function findProduct(id) {
    return content.find(function (item) {
        return item.id === id;
    });
}

function setSumValue() {
    let sum = 0;
    for (let cartProduct of cart) {
        let product = findProduct(cartProduct["id"]);
        sum += product["cost"] * cartProduct["count"];
    }
    document.getElementById("sum_text").textContent = `Всего: ${sum.toLocaleString()} ₽`;
    document.getElementById("sum_text").style.display = (sum === 0) ? "none" : "block";

}

function createCartElement(product, cartProduct) {
    document.getElementById("cart_div").innerHTML += `
        <div class="cart_element_div" id="${product.id}+div">
            <h3><a href="../catalog/product/?type=${cartProduct.type}&category=${cartProduct.category}&product=${product.id}">${product.name}</a></h3>
            <p class="product_desc"><a href="../catalog/product/?type=${cartProduct.type}&category=${cartProduct.category}&product=${product.id}">${product.description}</a></p>
            <p class="product_cost" id="${product.id}+product_cost">${(product["cost"] * cartProduct["count"]).toLocaleString()} ₽</p>    
            <p class="product_count" id="${product.id}+product_count">за ${cartProduct["count"]} шт.</p>
            <button class="arrow_button remove_button" id="${product.id}+remove_button">🗑</button>
            <div class="product_div_button">
                <button class="product_basket_button arrow_button cart_sub_button" id="${product.id}+cart_sub_button">-</button>
                <button class="product_basket_button arrow_button cart_add_button" id="${product.id}+cart_add_button">+</button>
            </div>
        </div>`;
}

function setTextState(product) {
    document.getElementById(`${product.id}+product_count`).textContent = `за ${product["count"]} шт.`;
    let productCost = content.find(function (item) {
        return item.id === product.id
    })["cost"];
    document.getElementById(`${product.id}+product_cost`).textContent = `${(productCost * product["count"]).toLocaleString()} ₽`;
}

function setButtonsListeners() {
    document.querySelectorAll(".remove_button").forEach(function (button) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            removeFromCart(cart, id);
            document.getElementById(`${id}+div`).remove();
            checkForNullCart();
            setSumValue();
        }
    });
    for (let button of document.querySelectorAll(".cart_add_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            let product = findInCart(cart, id);
            product.count++;
            setCart(cart);
            setTextState(product);
            setSumValue();
        }
    }

    for (let button of document.querySelectorAll(".cart_sub_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            let product = findInCart(cart, id);
            product.count--;
            setCart(cart);
            if (product.count !== 0) {
                setTextState(product);
            } else {
                removeFromCart(cart, id);
                document.getElementById(`${id}+div`).remove();
                checkForNullCart();
            }
            setSumValue();
        }
    }
}

function checkForNullCart() {
    if (cart.length === 0) {
        document.getElementById("cart_div").innerHTML = `<p>В корзине пусто!</p><a href="/AutoPartsStoreWebsiteFrontend/catalog/" class="arrow_button" id="to_catalog_href">Перейти в каталог<span></span></a>`;
        document.getElementById("clean_button").disabled = true;
    } else {
        document.getElementById("clean_button").disabled = false;
    }
}

function isEmpty(object) {
    return Object.keys(object).length === 0;
}

function getRandomString(maxLen) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let counter = 0;
    while (counter < maxLen) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return result;
}

function GetRandomSumObject() {
    let first = Math.floor(Math.random() * 100);
    let second = Math.floor(Math.random() * 100);
    return {
        text: first.toString() + " + " + second.toString() + " = ",
        answer: first + second
    }
}

function CreateCaptcha() {
    return {
        state: 0,
        [Symbol.for("captcha_text")]: getRandomString(5),
        [Symbol.for("captcha_sum")]: new GetRandomSumObject(),
        form: document.getElementById("captcha"),
        hint: document.querySelector("#captcha > p"),
        input: document.getElementById("captcha_input"),
        check: function () {
            if (this.state === 0) {
                this.state++;
                this.setValue(this[Symbol.for("captcha_text")]);
                this.hint.innerHTML = "Введите текст ниже:";
                return;
            }

            let valueObj = {}
            if (this.input.value.length !== 0)
                valueObj.value = this.input.value;

            if (isEmpty(valueObj)) {
                alert("Введите значение!");
                return;
            }

            if (this.state === 1) {
                if (valueObj.value === this[Symbol.for("captcha_text")]) {
                    this.close();
                } else {
                    this.state++;
                    this.setValue(this[Symbol.for("captcha_sum")].text);
                    this.hint.innerHTML = "Вычислите выражение:";
                }
            } else if (this.state === 2) {
                if (Number(valueObj.value) === this[Symbol.for("captcha_sum")].answer) {
                    this.close();
                } else {
                    this.loose();
                }
            }
        },
        setValue: function (labelText) {
            document.querySelector("& label[for=\"captcha_input\"]").innerHTML = labelText;
            this.input.value = "";
        },
        close: function () {
            this.state = -1;
            this.form.style.background = "var(--md-sys-color-tertiary-container)";
            this.form.style.border = "var(--md-sys-color-tertiary) 1px solid";
            this.form.firstElementChild.style.color = "var(--md-sys-color-on-tertiary-container)";
            this.form.style.pointerEvents = "none";
            this.form.style.filter = "brightness(60%)";
            this.setValue("Тестирование пройдено!");
            this.hint.innerHTML = "Тестирование пройдено!";
            this.input.blur();
            setTimeout(() => document.getElementById("sub").disabled = false, 100);
        },
        loose: function () {
            this.state = -1;
            this.setValue("Вы робот!");
            this.form.style.background = "var(--md-sys-color-error-container)";
            this.form.style.border = "var(--md-sys-color-error) 1px solid";
            this.form.firstElementChild.style.color = "var(--md-sys-color-on-error-container)";
            this.input.blur();
            this.hint.innerHTML = "Вы робот!";
            this.form.style.pointerEvents = "none";
            this.form.style.filter = "brightness(60%)";
            alert("Вы робот! Вам тут не рады...");
        }
    }
}

function checkForEnter () {
    for (let input of document.querySelectorAll("input[type=text], input[type=tel], input[type=email], input[type=datetime-local]")) {
        if (input.value && input.value !== "") {
            return true;
        }
    }
    return false;
}

function confirmRef(event) {
    return !event.target.closest("a") || !checkForEnter() || confirm("Вы уверены, что хотите покинуть страницу? Введенный текст пропадёт.")
}