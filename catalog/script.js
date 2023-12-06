import data from '../data/categories.json' assert {type: 'json'};
// const response = await fetch('https://gribbirg.github.io/AutoPartsStoreWebsiteFrontend/data/categories.json');
// const data = await response.json();

function createCategory(category) {
    let section = document.createElement("section");
    document.getElementById("categories_div").appendChild(section);

    let head = document.createElement("h2");
    head.className = "part_name";
    head.textContent = category.name;
    section.appendChild(head);

    let img = document.createElement("img");
    img.src = `../images/products/${category["logo"]}`;
    section.appendChild(img);

    let ref = document.createElement("a");
    ref.href = `/AutoPartsStoreWebsiteFrontend/catalog/products/?type=${category.id}`;
    section.appendChild(ref);

    let list = document.createElement("ul");
    section.appendChild(list);

    for (let sub of category["subcategories"]) {
        let line = document.createElement("li");
        list.appendChild(line);

        let href = document.createElement("a");
        href.href = `/AutoPartsStoreWebsiteFrontend/catalog/products/?type=${category.id}&category=${sub.id}`
        href.textContent = sub.name;
        line.appendChild(href);
    }
}

for (let category of data) {
    createCategory(category);
}