"use strict"

let content = [];

initProducts().then();

async function initProducts() {
    document.getElementById("cart_div").innerHTML = "";
    for (let cartProduct of cart) {
        let product = await getProduct(cartProduct);
        content.push(product);
        createCartElement(product, cartProduct);
    }
    setButtonsListeners();
}

async function getProduct(cartProduct) {
    let response = await fetch(`../data/products/${cartProduct.type}/${cartProduct.category}.json`);
    return (await response.json()).find(function (item) {
        return item.id === cartProduct.id
    });
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
    let productCost = content.find(function (item) { return item.id === product.id })["cost"];
    document.getElementById(`${product.id}+product_cost`).textContent = `${(productCost * product["count"]).toLocaleString()} ₽`;
}

function setButtonsListeners() {
    document.querySelectorAll(".remove_button").forEach(function (button) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            removeFromCart(cart, id);
            document.getElementById(`${id}+div`).remove();
        }
    });
    for (let button of document.querySelectorAll(".cart_add_button")) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            let product = findInCart(cart, id);
            product.count++;
            setCart(cart);
            setTextState(product);
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
            }
        }
    }
}