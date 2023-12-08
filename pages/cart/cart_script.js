let cart = getCart();
// setCart([])

function findInCart(cart, id) {
    return cart.find(function (item) {
        return item.id === id;
    });
}

function setProductBuyButtonsState(id, state) {
    if (document.getElementById(`${id}+buy_button`)) {
        if (state) {
            document.getElementById(`${id}+buy_button`).style.display = "none";
            document.getElementById(`${id}+cart_button`).style.display = "initial";
            document.getElementById(`${id}+cart_add_button`).style.display = "initial";
            document.getElementById(`${id}+cart_sub_button`).style.display = "initial";
        } else {
            document.getElementById(`${id}+buy_button`).style.display = "initial";
            document.getElementById(`${id}+cart_button`).style.display = "none";
            document.getElementById(`${id}+cart_add_button`).style.display = "none";
            document.getElementById(`${id}+cart_sub_button`).style.display = "none";
        }
    }
}

function setProductCartButtonText(id, count) {
    document.getElementById(`${id}+cart_button`).innerHTML = `<a href="/AutoPartsStoreWebsiteFrontend/cart/"></a>В корзине ${count} шт<span></span>`;
}

function subCount(cart, id) {
    let product = findInCart(cart, id);
    product.count--;
    if (product.count !== 0) {
        setProductCartButtonText(id, product.count);
    } else {
        removeFromCart(cart, id);
        setProductBuyButtonsState(id, false);
    }
    setCart(cart);
}

function addCount(cart, id) {
    let product = findInCart(cart, id);
    product.count++;
    setCart(cart);
    setProductCartButtonText(id, product.count);
}

function addToCart(cart, id, type, category) {
    cart.push({id: id, type: type, category: category, count: 1});
    setCart(cart);
    setProductBuyButtonsState(id, true);
    setProductCartButtonText(id, 1);
}

function addCountOrAddToCart(cart, id, type, category) {
    if (findInCart(cart, id)) addCount(cart, id);
    else addToCart(cart, id, type, category);
}

function setProductsButtonsOnClick(type, category) {
    for (let button of document.querySelectorAll(".product_buy_button")) {
        button.onclick = function () {
            addToCart(cart, button.id.split("+")[0], type, category);
        };
    }
    for (let button of document.querySelectorAll(".cart_add_button")) {
        button.onclick = function () {
            addCount(cart, button.id.split("+")[0]);
        }
    }

    for (let button of document.querySelectorAll(".cart_sub_button")) {
        button.onclick = function () {
            subCount(cart, button.id.split("+")[0]);
        }
    }
}

function setButtonsState(id) {
    let cartEl = findInCart(cart, id);
    if (cartEl !== undefined) {
        setProductBuyButtonsState(id, true);
        setProductCartButtonText(id, cartEl.count);
    } else {
        setProductBuyButtonsState(id, false);
    }
}

function removeFromCart(cart, id) {
    let pos = cart.findIndex(function (item) {
        return item.id === id;
    });
    cart.splice(pos, 1);
    setCart(cart);
}

function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart") ?? "[]");
    } catch (e) {
        console.log("Cart data", `reload because of ${e.text}`);
        setCart([]);
        return getCart();
    }
}