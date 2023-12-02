"use strict"

function authPrompt() {
    let name = prompt("Кто ты?");

    if (!name)
        alert("Отменено")
    else if (name === "Админ")
        passwordPrompt()
    else
        alert("Я вас не знаю")
}

function passwordPrompt() {
    let pass = prompt("Введите пароль");

    if (!pass)
        alert("Отменено");
    else if (pass === "Я главный")
        alert("Здравствуйте!");
    else
        alert("Неверный пароль");
}


document.getElementById("reg_form").onsubmit = function () {
    let enter = document.getElementById("reg_ans").value;
    if (enter === "Да")
        document.getElementById("reg_ans_label").innerHTML = "Круто!";
    else if (enter === "Админ")
        authPrompt();
    else
        document.getElementById("reg_ans_label").innerHTML = "Попробуй ещё раз ";
}

function heartButtonOnClickEvent(button) {
    if (button.style.color === "black") {
        button.style.backgroundColor = "#ffdad6";
        button.style.color = "#ba1a1a";
        button.style.setProperty("--color", "#ba1a1a");
        startSpawnHearts();
    } else {
        button.style.backgroundColor = "white";
        button.style.color = "black";
        button.style.setProperty("--color", "black");
    }
}

function startSpawnHearts() {
    window.onmousemove = e => spawnHeart(e);
    spawnHearts = false;
    window.onclick = checkHeartsNeeded;
}

function spawnHeart(e) {
    let heart = document.createElement("a");

    heart.style.position = 'absolute';
    heart.style.left = e.pageX.toString() + "px";
    heart.style.top = e.pageY.toString() + "px";
    heart.innerHTML = "❤";
    heart.style.zIndex = "7";
    heart.style.color = "#03c700"
    heart.style.pointerEvents = "none"

    document.body.appendChild(heart);

}

function checkHeartsNeeded() {
    if (!spawnHearts) {
        spawnHearts = true;
    } else {
        window.onmousemove = null;
        spawnHearts = false;
        window.onclick = null;
    }
}

let spawnHearts = false;

for (let button of document.querySelectorAll('#pic_div > div > button')) {
    button.style.color = "black";
    button.onclick = function () {
        heartButtonOnClickEvent(button);
    }
}

function isEmpty(object) {
    return Object.keys(object).length === 0;
}

function getRandomString(maxLen) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let counter = 0;
    while (counter < maxLen) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return result;
}

function GetRandomSumObject() {
    let first = Math.floor(Math.random() * 100);
    let second = Math.floor(Math.random() * 100);
    return {
        text: first.toString() + " + " + second.toString() + " = ",
        answer: first + second
    }
}

function CreateCaptcha() {
    return {
        state: 0,
        [Symbol.for("captcha_text")]: getRandomString(5),
        [Symbol.for("captcha_sum")]: new GetRandomSumObject(),
        form: document.getElementById("captcha"),
        hint: document.querySelector("#captcha > p"),
        input: document.getElementById("captcha_input"),
        check: function () {
            if (this.state === 0) {
                this.state++;
                this.setValue(this[Symbol.for("captcha_text")]);
                this.hint.innerHTML = "Введите текст ниже:";
                return;
            }

            let valueObj = {}
            if (this.input.value.length !== 0)
                valueObj.value = this.input.value;

            if (isEmpty(valueObj)) {
                alert("Введите значение!");
                return;
            }

            if (this.state === 1) {
                if (valueObj.value === this[Symbol.for("captcha_text")]) {
                    this.close();
                } else {
                    this.state++;
                    this.setValue(this[Symbol.for("captcha_sum")].text);
                    this.hint.innerHTML = "Вычислите выражение:";
                }
            } else if (this.state === 2) {
                if (Number(valueObj.value) === this[Symbol.for("captcha_sum")].answer) {
                    this.close();
                } else {
                    this.loose();
                }
            }
        },
        setValue: function (labelText) {
            document.querySelector("& label[for=\"captcha_input\"]").innerHTML = labelText;
            this.input.value = "";
        },
        close: function () {
            this.state = -1;
            this.form.style.opacity = "0";
            this.form.style.pointerEvents = "none";
            let enterStyle = document.getElementById("enter_form").style;
            let regStyle = document.getElementById("reg_form").style;
            enterStyle.opacity = "1";
            regStyle.opacity = "1";
            enterStyle.filter = "blur()";
            regStyle.filter = "blur()";
            enterStyle.pointerEvents = "initial";
            regStyle.pointerEvents = "initial";
        },
        loose: function () {
            this.state = -1;
            this.setValue("Вы робот!");
            this.input.blur();
            this.hint.innerHTML = "Вы робот!";
            this.form.style.pointerEvents = "none";
            this.form.style.filter = "brightness(60%)";
            alert("Вы робот! Вам тут не рады...");
        }
    }
}

let captcha = CreateCaptcha();
captcha.check();

document.getElementById("captcha").onsubmit = function () {
    captcha.check();
}

function Accumulator(startingValue) {
    setTrashOut(startingValue);

    this.value = startingValue;
    this.read = function () {
        this.value += Number(prompt("Сколько добавить?"));
        setTrashOut(this.value);
    };
}

function setTrashOut(value) {
    document.querySelector("#trash_div > p").innerHTML = `Сейчас в корзине: ${value}`;
}

let accumulator = new Accumulator(8);

document.querySelector("#trash_div > button").onclick = function () {
    accumulator.read();
}

function truncate(str, maxlength) {
    return (str.length <= maxlength) ? str : str.slice(0, maxlength - 3) + "...";
}

for (let p of document.querySelectorAll("#blur_card_div > div > p, #anim_line_div > div > div > p")) {
    p.innerHTML = truncate(p.innerHTML, 170);
}


function createNotification() {
    document.getElementById("notification_list").innerHTML += `<li><a>Пора купить новый Москвич!</a><button>✖</button></li>`
}

let notificationSpawnId;

function startNotificationSpawn() {
    createNotification();
    notificationSpawnId = setInterval(createNotification, 3000);
}

startNotificationSpawn();


function delay(fun, time) {
    return function () {
        setTimeout(() => fun(), time);
    };
}

let notificationSpawnDelay = delay(startNotificationSpawn, 10000);

function delayNotificationSpawn() {
    if (notificationSpawnId !== null) {
        clearInterval(notificationSpawnId);
        notificationSpawnDelay();
        notificationSpawnId = null;
    }
}

function createWish(text) {
    let li = document.createElement("li");
    li.textContent = text;
    document.querySelector("#wish_section > ul").appendChild(li);
}

document.getElementById("notification_menu_sym").onclick = delayNotificationSpawn;


document.getElementById("wish_add_button").onclick = function () {
    document.querySelector("#wish_section > ul").innerHTML = "";
    let text = prompt("Введите свой желаемый товар:");
    while (text) {
        createWish(text);
        text = prompt("Введите свой желаемый товар:");
    }
    showNotification()
}

// `<p>Добавлено!</p><img height="50px" src="../../images/logo/logo_big.png" alt="Логотип">`

function setMousePositionText(event) {
    let mousePositionText = document.getElementById("mouse_position_text")
    mousePositionText.textContent = `Клик мышки по координатам: ${event.clientX}:${event.clientY}`;
    mousePositionText.style.left = (mousePositionText.parentElement.clientWidth / 2 - mousePositionText.offsetWidth / 2) + "px";
}

function showNotification() {
    let notification = document.createElement("div");

    notification.className = "notification";
    notification.style.width = "1000px";
    notification.style.height = "600px";


    let image = document.createElement("img");

    image.height = 400;
    image.width = 630;
    image.src = "../../images/logo/logo_big.png";
    image.alt = "Логотип";
    image.style.position = "absolute";

    let buttonClose = document.createElement("button");
    buttonClose.textContent = "✖";
    buttonClose.onclick = function () {
        notification.remove();
        window.removeEventListener("click", setMousePositionText);
    }

    let mousePositionText = document.createElement("p");
    mousePositionText.id = "mouse_position_text";
    mousePositionText.style.position = "absolute";
    window.addEventListener("click", setMousePositionText);


    notification.appendChild(image);
    notification.appendChild(buttonClose);
    notification.appendChild(mousePositionText);
    document.body.appendChild(notification);

    notification.style.top = (document.documentElement.clientHeight / 2 - notification.offsetHeight / 2) + "px";
    notification.style.left = (document.documentElement.clientWidth / 2 - notification.offsetWidth / 2) + "px";
    image.style.top = (notification.clientHeight / 2 - image.offsetHeight / 2) + "px";
    image.style.left = (notification.clientWidth / 2 - image.offsetWidth / 2) + "px";
    buttonClose.style.right = "15px";
    buttonClose.style.top = "10px";
    mousePositionText.style.bottom = "15px";
    mousePositionText.style.left = (notification.clientWidth / 2 - mousePositionText.offsetWidth / 2) + "px";
}

document.getElementById("notification_list").onclick = function (event) {
    let target = event.target;

    if (target.tagName !== "BUTTON") return;

    target.parentElement.remove();
}

window.addEventListener("scroll", function () {
    document.body.style.backgroundPosition = "center " + (window.scrollY * 0.3) + "px";
});