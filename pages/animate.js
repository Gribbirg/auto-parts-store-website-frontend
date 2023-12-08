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
        duration: 5000,
        timing(timeFraction) {
            return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * 1.5 / 3 * timeFraction);
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
            return -Math.cos(timeFraction * 2 * Math.PI) / 2 + 0.5;
        },
        draw(progress) {
            carFromLeftToRight(progress);
        }
    })
}


function carFromLeftToRight(progress) {
    let car = document.getElementById("footer_anim_car")
    car.style.left = progress * (document.querySelector("footer").clientWidth - car.offsetWidth) + "px";
}