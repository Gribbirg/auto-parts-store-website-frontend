"use strict"

let {type, category, id} = getCategory();

// const responseCategory = await fetch('https://gribbirg.github.io/AutoPartsStoreWebsiteFrontend/data/categories.json');
const responseCategory = await fetch('../../data/categories.json');
const typeData = (await responseCategory.json()).find(function (item) {
    return item.id === type;
});
if (!typeData)
    window.location.href = "/AutoPartsStoreWebsiteFrontend/catalog/";

const categoryData = typeData["subcategories"].find(function (item) {
    return item.id === category;
});
if (!categoryData)
    window.location.href = "/AutoPartsStoreWebsiteFrontend/catalog/";

// const response = await fetch(`https://gribbirg.github.io/AutoPartsStoreWebsiteFrontend/data/products/${type}/${category}.json`);
const response = await fetch(`../../data/products/${type}/${category}.json`);
const product = (await response.json()).find(function (item) {
    return item.id === id;
});
if (!product)
    window.location.href = "/AutoPartsStoreWebsiteFrontend/catalog/";

let cart = [];

setProductData(product);

function getCategory() {
    let search = new URLSearchParams(window.location.search)
    let type = search.get("type");
    let category = search.get("category");
    let id = search.get("product")
    if (!type || type === "null" || !category || category === "null" || !id || id === "null") {
        window.location.href = "/AutoPartsStoreWebsiteFrontend/catalog/";
    }
    return {type, category, id};
}

function setProductData(product) {
    document.title = product.name;
    document.querySelector("#main_section > h2").textContent =  product.name;
    document.getElementById("logo").src = `/AutoPartsStoreWebsiteFrontend/images/products/${product["img"]}`;
    document.getElementById("desc").textContent = product.description;
    document.getElementById("cost").textContent = `${product["cost"].toLocaleString()} ₽`;
    document.getElementById("buy_div").innerHTML += `
                 <div class="product_div_button">
                    <button class="product_buy_button arrow_button" id="${product.id}+buy_button">
                        Купить
                        <span></span>
                    </button>
                    <button class="product_basket_button arrow_button cart_sub_button" id="${product.id}+cart_sub_button">-</button>
                    <a href="/AutoPartsStoreWebsiteFrontend/cart"><button class="product_basket_button arrow_button cart_button" id="${product.id}+cart_button">
                        В корзине 1 шт
                        <span></span>
                    </button></a>
                    <button class="product_basket_button arrow_button cart_add_button" id="${product.id}+cart_add_button">+</button>
                </div>`;
    document.getElementById("similar_ref").href = `/AutoPartsStoreWebsiteFrontend/catalog/products/?type=${type}&category=${category}`
    setProductsButtonsOnClick(type, category);
    setButtonsState(product.id);
}