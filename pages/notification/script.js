'use strict'

function showNotification(options) {
    let notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = options;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}