const buttontarget = document.getElementById("donate");
const shelly = require('electron').shell;

function openPay() {
    shelly.openExternal("https://liberapay.com/avityred/donate");
}