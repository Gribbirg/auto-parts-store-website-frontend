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
    setRemoveButtonsListeners();
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
            <p class="product_cost">${(product["cost"] * cartProduct["count"]).toLocaleString() + " ₽"}</p>    
            <p class="product_count">за ${cartProduct["count"]} шт.</p>
            <button class="arrow_button remove_button" id="${product.id}+remove_button">🗑</button>
        </div>`;
}

function setRemoveButtonsListeners() {
    document.querySelectorAll(".remove_button").forEach(function (button) {
        button.onclick = function () {
            let id = button.id.split("+")[0];
            removeFromCart(cart, id);
            document.getElementById(`${id}+div`).remove();
        }
    });
}