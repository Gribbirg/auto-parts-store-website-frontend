document.body.innerHTML +=
    `<link rel="stylesheet" href="../pages/header/style.css">
    <header id="header">
        <img id="left_logo" src="../images/logo/logo_left.png" alt="Лучшая машина">
            <h1 id="header_head">Магазин автозапчастей</h1>

            <nav id="up_nav">
                <input type="checkbox" id="nav_menu_button"><label for="nav_menu_button"></label>
                    <ul class="nav_list">
                        <li><a href="../main/"><p>Главная</p></a></li>
                        <li><a href="../catalog/"><p>Каталог</p></a></li>
                        <li><a href="../cart/"><p>Корзина</p></a></li>
                        <li><a href="../products/"><p>FAQ</p></a></li>
                    </ul>
            </nav>
    </header>`