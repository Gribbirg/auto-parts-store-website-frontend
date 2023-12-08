function animate({timing, draw, duration}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {

        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

document.getElementById("left_logo").onclick = function () {
    animate({
        duration: 1000,
        timing(timeFraction) {
            return timeFraction;
        },
        draw(progress) {
            document.getElementById("left_logo").style.transform = `rotate(${progress}turn)`;
        }
    })
}

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