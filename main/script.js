'use strict'

for (let p of document.querySelectorAll("#blur_card_div > div > p, #anim_line_div > div > div > p, #glassmorphism_cards_div > div > div > p")) {
    p.innerHTML = truncate(p.innerHTML, 170);
}

function truncate(str, maxlength) {
    return (str.length <= maxlength) ? str : str.slice(0, maxlength - 3) + "...";
}
