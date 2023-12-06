"use strict"

let content = [];

initProducts();

async function initProducts() {
    for (let cartProduct of cart) {
        let product = await getProduct(cartProduct);
        content.push(product);
        createCartElement(product, cartProduct);
    }
}

async function getProduct(cartProduct) {
    let response = await fetch(`../data/products/${cartProduct.type}/${cartProduct.category}.json`);
    return (await response.json()).find(function (item) {
        return item.id === cartProduct.id
    });
}

function createCartElement(product, cartProduct) {
    document.getElementById("cart_div").innerHTML += `
<div>
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p>${product["cost"] * cartProduct["count"]}</p>    
</div>`;
}