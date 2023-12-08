"use strict"

document.body.innerHTML += `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <footer>
    <address>
        Контакты разработчика:
        <p><a href="tel:+79779456492">+7 (977) 945-64-92</a></p>
        <p>
            <a href="mailto:gribkovalexander@gmail.com?subject=Твои характеристики&body=Ты лучший!!! И я куплю тебе Москвич 3!!!">
            gribkovalexander@gmail.com</a>
        </p>
        <p><small>copyright 2023 Gribbirg</small></p>
    </address>
    <address>
        Наши социальные сети:
        <div>
            <div>
                <a href="https://vk.com/mirea_official" target="_blank" class="fa fa-vk"></a>
            </div>
            <div>
                <a href="https://www.youtube.com/@rtu_mirea" target="_blank" class="fa fa-youtube"></a>
            </div>
            <div>
                <a href="https://t.me/rtumirea_official" target="_blank" class="fa fa-telegram"></a>
            </div>
        </div>
    </address>
    <div>
        Выберите цветовую тему:
        <div>
            <div><input type="radio" name="theme_input" id="theme+theme_input" checked><label for="theme+theme_input">Как на устройстве</label></div>
            <div><input type="radio" name="theme_input" id="theme.light+theme_input"><label for="theme.light+theme_input">Светлая тема</label></div>
            <div><input type="radio" name="theme_input" id="theme.dark+theme_input"><label for="theme.dark+theme_input">Темная тема</label></div>
        </div>
    </div>
    <div>
        Курсовая работа
        <p><abbr title="Российский технологический университет МИРЭА">РТУ МИРЭА</abbr></p>
        <p>Студент: Грибков Александр Сергеевич</p>
        <p>Группа: ИКБО-16-22</p>
    </div>
    <img src="/AutoPartsStoreWebsiteFrontend/images/animation/car.png" alt="Машинка" id="footer_anim_car">
    </footer>
`

let theme = localStorage.getItem("theme");
if (!theme || theme === "") theme = "theme"
else document.getElementById(`${theme}+theme_input`).checked = true;
setTheme(theme);

document.querySelectorAll(`input[name="theme_input"]`).forEach(function (input) {
    input.onchange = function () {
        if (input.checked) {
            theme = input.id.split("+")[0];
            setTheme(theme);
        }
    }
});


function setTheme(theme) {
    document.getElementById("theme_link").href = `/AutoPartsStoreWebsiteFrontend/pages/colors/${theme}.css`;
    localStorage.setItem("theme", theme);
}