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
    document.querySelector("#main_section > h2").textContent =  product.name;
    document.getElementById("logo").src = `/images/products/${product["img"]}`;
    document.getElementById("desc").textContent = product.description;
    document.getElementById("cost").textContent = `${product["cost"].toLocaleString()} ₽`
}