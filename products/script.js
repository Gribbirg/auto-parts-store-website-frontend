"use strict"

function getCategory() {
    return (new URLSearchParams(window.location.search)).get("category") ?? "tiers";
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
                <img src=${"https://gribbirg.github.io/AutoPartsStoreWebsiteFrontend/images/products/" + product["img"]} alt=${product.name}/>
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

function getCurrentProductsDisplayCount() {
    return document.querySelectorAll(".product_div").length;
}

function setContent(content) {
    document.getElementById("products_div").innerHTML = "";
    if (content.length !== 0) {
        for (let i = 0; i < Math.min(6, content.length); i++) {
            createProductDiv(content[i]);
            let cartEl = findInCart(cart, content[i].id);
            if (cartEl !== undefined) {
                setProductBuyButtonsState(content[i].id, true);
                setProductCartButtonText(content[i].id, cartEl.count);
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

function addProducts(content) {
    let count = getCurrentProductsDisplayCount();
    for (let i = count; i < Math.min(count + 2, content.length); i++) {
        createProductDiv(content[i]);
        let cartEl = findInCart(cart, content[i].id);
        if (cartEl !== undefined) {
            setProductBuyButtonsState(content[i].id, true);
            setProductCartButtonText(content[i].id, cartEl.count);
        }
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
        div.style.background = "var(--md-sys-color-primary-container)";
        div.style.borderColor = "var(--md-sys-color-primary)";
        div.firstElementChild.style.color = "var(--md-sys-color-on-primary-container)";
        document.querySelectorAll(`#${div.id} > div > label`).forEach(function (item) {
            item.style.color = "var(--md-sys-color-on-primary-container)";
        });
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
    div.style.background = "var(--md-sys-color-secondary-container)";
    div.style.borderColor = "var(--md-sys-color-secondary)";
    div.firstElementChild.style.color = "var(--md-sys-color-on-secondary-container)";
    document.querySelectorAll(`#${div.id} > div > label`).forEach(function (item) {
        item.style.color = "var(--md-sys-color-on-tertiary-container)";
    });
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

import data from '../data/products.json' assert {type: 'json'};

let cart = [];
let category = getCategory();
addCategory(category);

let content = findCategory(category)["products"];
onSortDivClickListener(document.getElementById("cost_sort"));

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
    div.addEventListener("click", function () {
        onSortDivClickListener(div);
    })
}

function findInCart(cart, id) {
    return cart.find(function (item) {
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
    let product = findInCart(cart, id);
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
    let product = findInCart(cart, id);
    product.count++;
    setCart(cart);
    setProductCartButtonText(id, product.count);
}

function setProductsButtonsOnClick() {
    for (let button of document.querySelectorAll(".product_buy_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            cart.push({id: id, category: category, count: 1});
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
    let pos = cart.findIndex(function (item) {
        return item.id === id;
    });
    cart.splice(pos, 1);
}

function setCart(cart) {
    // document.getElementById("cart_div").innerHTML = "";
    // for (let element of cart) {
    //     createCartElement(element, getProduct(element.category, element.id));
    // }
    // setCartElementButtonsOnClick();
    // setSumText(cart);
}

window.addEventListener("scroll", function () {
    if (document.documentElement.getBoundingClientRect().bottom <= document.documentElement.clientHeight + 50) {
        addProducts(content);
    }
});

window.addEventListener("touchmove", function () {
    if (document.documentElement.getBoundingClientRect().bottom <= document.documentElement.clientHeight + 50) {
        addProducts(content)
    }
});