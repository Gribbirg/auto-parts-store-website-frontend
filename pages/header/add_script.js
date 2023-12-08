"use strict"

document.body.innerHTML +=
    `<header id="header">
        <img id="left_logo" src="/AutoPartsStoreWebsiteFrontend/images/animation/wheel.png" alt="Колесо">
            <h1 id="header_head">Магазин автозапчастей</h1>

            <nav id="up_nav">
                <input type="checkbox" id="nav_menu_button"><label for="nav_menu_button"></label>
                    <ul class="nav_list">
                        <li><a id="main_href" class="href" href="/AutoPartsStoreWebsiteFrontend/main/"><p>Главная</p></a></li>
                        <li><a id="catalog_href" class="href" href="/AutoPartsStoreWebsiteFrontend/catalog/"><p>Каталог</p></a></li>
                        <li><a id="cart_href" class="href" href="/AutoPartsStoreWebsiteFrontend/cart/"><p>Корзина</p></a></li>
                    </ul>
            </nav>
    </header>`

activeNavHref(window.location);

function activeNavHref(location) {
    let spl = location.toString().split("/");
    let currentPosEl = spl.findIndex(function (item) {
        return item === "AutoPartsStoreWebsiteFrontend";
    });
    if (spl.length === currentPosEl) window.location.href = "/AutoPartsStoreWebsiteFrontend/main/"

    switch (spl[currentPosEl + 1]) {
        case "main":
        case "catalog":
        case "cart":
            document.getElementById(`${spl[currentPosEl + 1]}_href`).className = "active";
            break;
        default:
            window.location.href = "/AutoPartsStoreWebsiteFrontend/main/"
    }
}

