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
