"use strict"

function getCategory() {
    return (new URLSearchParams(window.location.search)).get("category");
}

function setCategoryName(name) {
    if (name) {
        document.title = name;
        document.body.querySelector("#products_section .part_name").innerHTML = name;
    }
}

function createProductDiv(product) {
    document.getElementById("products_div").innerHTML +=
        `<div class="product_div">
            <h3 class="product_head">${product.name}</h3>
            <div class="product_img_div">
                <img src=${"../../images/products/" + product["img"]} alt=${product.name}/>
            </div>
            <p class="product_desc">${product.description}</p>
            <p class="product_cost">${product["cost"].toLocaleString() + " ₽"}</p>
            <div class="product_div_button">
                <button class="product_buy_button arrow_button" id="${product.id}+buy_button">
                    Купить
                    <span></span>
                </button>
                <button class="product_basket_button arrow_button cart_sub_button" id="${product.id}+cart_sub_button">-</button>
                <a href="#cart_position"><button class="product_basket_button arrow_button cart_button" id="${product.id}+cart_button">
                    В корзине 1 шт
                    <span></span>
                </button></a>
                <button class="product_basket_button arrow_button cart_add_button" id="${product.id}+cart_add_button">+</button>
            </div>
        </div>`;
}

function setContent(content) {
    document.getElementById("products_div").innerHTML = "";
    if (content.length !== 0) {
        for (let product of content) {
            createProductDiv(product);
            let cartEl = cart.find(product.id);
            if (cartEl !== undefined) {
                setProductBuyButtonsState(product.id, true);
                setProductCartButtonText(product.id, cartEl.count);
            }
        }
        setProductsButtonsOnClick();
    } else {
        document.getElementById("products_div").innerHTML +=
            `
            <p>По заданным критериям ничего не найдено.</p>
            `;
    }
}

function findCategory(category) {
    return data.find(function (item) {
        return item.id === category;
    });
}

function addCategory(category) {
    let content = findCategory(category);
    setCategoryName(content.name);
    for (let product of content["products"]) {
        createProductDiv(product);
    }
}

function getFilterList(list, a, b) {
    return list.filter(function (item) {
        let cost = Number(item["cost"]);
        return (cost >= a && cost <= b);
    });
}

function offSortDivs(onDiv) {
    for (let div of document.querySelectorAll(".sort_divs")) {
        div.style.background = "#006877";
        if (div.id !== onDiv.id) {
            for (let input of document.querySelectorAll(`#${div.id} > div > input`)) {
                input.checked = false;
            }
        }
    }
}

function onIfOffDirInputs(div) {
    let list = document.querySelectorAll(`#${div.id} > div > input`);
    for (let input of list) {
        if (input.checked) return;
    }
    list[0].checked = true;
}

function sortContent(content, sortType, dir) {
    let mn;
    if (dir === "up") {
        mn = 1;
    } else {
        mn = -1;
    }
    content.sort(function (a, b) {
        if (a[sortType] > b[sortType]) return 1 * mn;
        if (a[sortType] === b[sortType]) return 0;
        if (a[sortType] < b[sortType]) return -1 * mn;
    });
}

function onSortDivClickListener(div) {
    offSortDivs(div);
    onIfOffDirInputs(div);
    div.style.background = "#026e00";
    for (let input of document.querySelectorAll(`#${div.id} > div > input`)) {
        if (input.checked) {
            sortContent(content, input.id.split("_")[0], input.id.split("_")[2]);
        }
    }
    setContent(content);
}

function getProduct(category, id) {
    return data.find(function (item) {
        return item.id === category;
    })["products"].find(function (item) {
        return item.id === id;
    });
}

function setProductBuyButtonsState(id, state) {
    if (document.getElementById(`${id}+buy_button`)) {
        if (state) {
            document.getElementById(`${id}+buy_button`).style.display = "none";
            document.getElementById(`${id}+cart_button`).style.display = "initial";
            document.getElementById(`${id}+cart_add_button`).style.display = "initial";
            document.getElementById(`${id}+cart_sub_button`).style.display = "initial";
        } else {
            document.getElementById(`${id}+buy_button`).style.display = "initial";
            document.getElementById(`${id}+cart_button`).style.display = "none";
            document.getElementById(`${id}+cart_add_button`).style.display = "none";
            document.getElementById(`${id}+cart_sub_button`).style.display = "none";
        }
    }
}

function setProductCartButtonText(id, count) {
    document.getElementById(`${id}+cart_button`).innerHTML = `<a href="#cart_position"></a>В корзине ${count} шт<span></span>`;
}

function subCount(cart, id) {
    let product = cart.find(id);
    product.count--;
    if (product.count !== 0) {
        setProductCartButtonText(id, product.count);
    } else {
        removeFromCart(cart, id);
        setProductBuyButtonsState(id, false);
    }
    setCart(cart);
}

function addCount(cart, id) {
    let product = cart.find(cart, id);
    product.count++;
    setCart(cart);
    setProductCartButtonText(id, product.count);
}

function setProductsButtonsOnClick() {
    for (let button of document.querySelectorAll(".product_buy_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            cart.products.push({id: id, category: category, count: 1});
            setCart(cart);
            setProductBuyButtonsState(id, true);
            setProductCartButtonText(id, 1);
        };
    }
    for (let button of document.querySelectorAll(".cart_add_button")) {
        button.onclick = function () {
            addCount(cart, button.id.split("+")[0]);
        }
    }

    for (let button of document.querySelectorAll(".cart_sub_button")) {
        button.onclick = function () {
            subCount(cart, button.id.split("+")[0]);
        }
    }
}

function setCartElementButtonsOnClick() {
    for (let button of document.querySelectorAll(".cart_el_add_button")) {
        button.onclick = function () {
            addCount(cart, button.id.split("+")[0]);
        }
    }

    for (let button of document.querySelectorAll(".cart_el_sub_button")) {
        button.onclick = function () {
            subCount(cart, button.id.split("+")[0]);
        }
    }
    for (let button of document.querySelectorAll(".cart_el_del_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            removeFromCart(cart, id);
            setProductBuyButtonsState(id, false);
            setCart(cart);
        }
    }
}

function removeFromCart(cart, id) {
    let pos = cart.products.findIndex(function (item) {
        return item.id === id;
    });
    cart.products.splice(pos, 1);
}

function createCartElement(cartElement, product) {
    document.getElementById("cart_div").innerHTML +=
        `<div class="cart_element">
            <h3 class="product_head">${product.name}</h3>
            <p class="product_desc">${product.description}</p>
            <p class="product_cost">${(product["cost"] * cartElement["count"]).toLocaleString() + " ₽"}</p>
            <p class="cart_element_count">${cartElement.count} шт</p> 
            <div class="cart_element_div_button">
                <button class="cart_buy_button arrow_button cart_el_del_button" id="${product.id}+cart_el_del_button">Удалить<span></span></button>
                <button class="cart_basket_button arrow_button cart_el_sub_button" id="${product.id}+cart_el_sub_button">-</button>
                <button class="cart_basket_button arrow_button cart_el_add_button" id="${product.id}+cart_el_add_button">+</button>
            </div>
        </div>`
    ;
}

function setSumText(cart) {
    let sum = 0;
    cart.products.forEach(function (item) {
        sum += (getProduct(item["category"], item.id)["cost"] * item.count);
    });
    document.getElementById("sum_p").innerHTML = `Всего: ${sum.toLocaleString()} ₽`
}

function setCart(cart) {
    document.getElementById("cart_div").innerHTML = "";
    for (let element of cart) {
        createCartElement(element, getProduct(element.category, element.id));
    }
    setCartElementButtonsOnClick();
    setSumText(cart);
}

function CartProduct(id, category, count = 1) {
    this.id = id;
    this.category = category;
    this.count = count;
    this.add = function () {
        this.count++;
        return this.count;
    }
    this.mul = function () {
        this.count--;
        return this.count;
    }
    this.getFullCost = function () {
        return getProduct(this.category, this.id)["cost"] * this.count;
    }
    this.toString = function () {
        return `${id}+${category}+${count}`;
    }
}

function CartProductFromStr(str) {
    let values = str.split("+");
    return new CartProduct(values[0], values[1], Number(values[2]));
}

function Cart(str = null) {
    this.products = [];
    this.sum = 0;
    this.toString = function () {
        return this.products.join("*");
    }
    this.find = function (id) {
        return cart.products.find(function (item) {
            return item.id === id;
        });
    }

    if (str !== null && str !== "") {
        for (let s of str.split("*")) {
            let element = new CartProductFromStr(s)
            this.products.push(element);
            this.sum += element.getFullCost();
        }
    }
}

import data from '../../products/products.json' assert {type: 'json'};

let cart = new Cart(localStorage.getItem("cart"));
alert(cart.toString())
let category = getCategory();
addCategory(category);

let content = findCategory(category)["products"];
onSortDivClickListener(document.getElementById("cost_sort"));
setContent(content);

document.getElementById("confirm_filter_button").onclick = function () {
    content = findCategory(category)["products"];

    let costFrom = Number(document.getElementById("from_cost_filter").value);
    let costTo = Number(document.getElementById("to_cost_filter").value);
    if (costFrom && costTo) {
        content = getFilterList(content, costFrom, costTo);
    }

    setContent(content);
}

for (let div of document.querySelectorAll(".sort_divs")) {
    div.onclick = function () {
        onSortDivClickListener(div);
    };
}

document.getElementById("clear_button").onclick = function () {
    cart = new Cart();
    setCart(cart);
    setContent(content);
}

window.onbeforeunload = function () {
    localStorage.setItem("cart", cart);
}

