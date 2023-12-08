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
        Курсовая работа
        <p><abbr title="Российский технологический университет МИРЭА">РТУ МИРЭА</abbr></p>
        <p>Студент: Грибков Александр Сергеевич</p>
        <p>Группа: ИКБО-16-22</p>
    </div>
    <img src="/AutoPartsStoreWebsiteFrontend/images/animation/car.png" alt="Машинка" id="footer_anim_car">
    </footer>
`

import { animate } from "/AutoPartsStoreWebsiteFrontend/pages/animate.js"

carAnimation();
setInterval(carAnimation, 30000);

function carAnimation() {
    animate({
        duration: 30000,
        timing(timeFraction) {
            return timeFraction;
        },
        draw(progress) {
            if (progress < 0.5) {
                carFromLeftToRight(progress * 2);
            } else {
                carFromRightToLeft((progress - 0.5) * 2)
            }
        }
    })
}


function carFromLeftToRight(progress) {
    let car = document.getElementById("footer_anim_car")
    car.style.left = progress * (document.querySelector("footer").clientWidth - car.offsetWidth) + "px";
}

function carFromRightToLeft(progress) {
    let car = document.getElementById("footer_anim_car")
    car.style.left = (1 - progress) * (document.querySelector("footer").clientWidth - car.offsetWidth) + "px";
}