"use strict"

document.body.innerHTML +=
    `<header id="header">
        <img id="left_logo" src="/auto-parts-store-website-frontend/images/animation/wheel.png" height="60px" alt="Колесо">
            <h1 id="header_head">Магазин автозапчастей</h1>

            <nav id="up_nav">
                <input type="checkbox" id="nav_menu_button"><label for="nav_menu_button"></label>
                    <ul class="nav_list">
                        <li><a id="main_href" class="href" href="/auto-parts-store-website-frontend/main/"><p>Главная</p></a></li>
                        <li><a id="catalog_href" class="href" href="/auto-parts-store-website-frontend/catalog/"><p>Каталог</p></a></li>
                        <li><a id="cart_href" class="href" href="/auto-parts-store-website-frontend/cart/"><p>Корзина</p></a></li>
                    </ul>
            </nav>
    </header>`

activeNavHref(window.location);

function activeNavHref(location) {
    let spl = location.toString().split("/");
    let currentPosEl = spl.findIndex(function (item) {
        return item === "auto-parts-store-website-frontend";
    });
    if (spl.length === currentPosEl) window.location.href = "/auto-parts-store-website-frontend/main/"

    switch (spl[currentPosEl + 1]) {
        case "main":
        case "catalog":
        case "cart":
            document.getElementById(`${spl[currentPosEl + 1]}_href`).className = "active";
            break;
        default:
            window.location.href = "/auto-parts-store-website-frontend/main/"
    }
}

