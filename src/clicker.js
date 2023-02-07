const { dialog } = require("electron");
const { readFileSync, writeFileSync } = require("original-fs");
const path = require("path");

let stats;
try {
    stats = JSON.parse(readFileSync(path.join(__dirname, 'stats.json'), 'utf8'));
} catch (err) {
  alert('Error reading file:', err);
}

var game = {
    turtles: 0,
    turtlesReached: 0,
    clickincome: 0,
    multiplier: 1,
    globalincome: 0,
    turtletype: "default",
    intervalTime: 1000,

    addTurtles: function(amount) {
        this.turtles += this.clickincome + (amount * this.multiplier);
        this.turtlesReached += this.clickincome + (amount * this.multiplier);
        display.updateScore();
    },

    addSecondaryTurtles: function(amount) {
        this.turtles += amount;
        this.turtlesReached += amount;
        display.updateScore();
    }
};

var items = {
    name: [
        "Cursor",
        "Caretaker"
    ],
    image: [
        "img/cursor.webp",
        "img/caretaker.webp"
    ],
    count: [
        0,
        0
    ],
    income: [
        1,
        0
    ],
    multi: [
        0,
        1
    ],
    cost: [
        15,
        45
    ],

    defcost: [
        15,
        45
    ],
    defcount: [
        0,
        0
    ],

    purchase: function(index) {
        if (game.turtles >= this.cost[index]) {
            game.turtles -= this.cost[index];
            this.count[index] += 1;
            game.multiplier += this.multi[index];
            game.globalincome += this.income[index];
            this.cost[index] = Math.ceil(this.cost[index] * 1.3);
            display.updateScore()
            display.updateShoppe();
        }
    }

};

var upgrade = {
    name: [
        "Hardened Shell I",
        "Hardened Shell II",
        "Hardened Shell III",
        "Top Hat",
        "Ascension",
        "Stronger Cursor I",
        "Stronger Cursor II",
        "Stronger Cursor III"
    ],
    description: [
        "+20 Turtles on each click.",
        "+20 Turtles on each click.",
        "+20 Turtles on each click.",
        "Fancy, +8% Multiplier.",
        "What",
        "Cursor Upgrade! +2 Each Cursor Click.",
        "Cursor Upgrade! +4 Each Cursor Click.",
        "Cursor Upgrade! +6 Each Cursor Click."
    ],
    image: [
        "img/hshell1.webp",
        "img/hshell2.webp",
        "img/hshell3.webp",
        "img/hat.webp",
        "img/what.webp",
        "img/ecursor1.webp",
        "img/ecursor2.webp",
        "img/ecursor3.webp"
    ],
    type: [
        "income",
        "income",
        "income",
        "comsetic",
        "cosmetic",
        "item",
        "item",
        "item"
    ],
    cost: [
        6000,
        10000,
        18000,
        1400,
        20000,
        1000,
        4000,
        7000
    ],
    requirement: [
        3000,
        7000,
        12000,
        12,
        42,
        30,
        60,
        90
    ],
    bonus: [
        20,
        20,
        20,
        8,
        42,
        2,
        4,
        6
    ],
    affectItem: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    purchased: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],

    purchase: function(index) {
        if (!this.purchased[index] && game.turtles >= this.cost[index]) {
            if (this.type[index] == "income" && game.turtlesReached >= this.requirement[index]) {
                game.turtles -= this.cost[index];
                game.clickincome += this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
            } else if (this.type[index] == "cosmetic" && game.multiplier >= this.requirement[index]) {
                game.turtles -= this.cost[index];
                game.multiplier += this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
                if (this.name[index] == "Top Hat") {
                    game.turtletype == "hatted"
                } else if (this.name[index] == "Ascension") {
                    game.turtletype == "what"
                }
            } else if (this.type[index] == "item" && items.count[this.affectItem] >= this.requirement[index]) {
                game.turtles -= this.cost[index];
                items.income[this.affectItem] += this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
            }
        }
    }

};

var display = {
    updateScore: function() {
        document.getElementById("clicks").innerText = shortenNumber(game.turtles);
        document.getElementById("clicks-per-sec").innerText = shortenNumber(game.globalincome);
        document.getElementById("multiplier").innerText = shortenNumber(percentage(game.multiplier, 100)) + "%";
        document.title = shortenNumber(game.turtles) + " - Turtle Clicker";
    
        if (game.turtletype === "hatted") {
            document.getElementById("turtleimg").src = "img/turtle_dapper.png";
        } else if (game.turtletype === "what") {
            document.getElementById("turtleimg").src = "img/what.webp";
        } else {
            document.getElementById("turtleimg").src = "img/turtle.png";
        }
    },

    updateShoppe: function() {
        document.getElementById("itemshop").innerHTML = "";
        for (i = 0; i < items.name.length; i++) {
            document.getElementById("itemshop").innerHTML += '<button class="purbutton" onclick="items.purchase('+i+')"><img src="'+items.image[i]+'" width="40px" height="40px" alt="a" />'+items.name[i]+' : <span>'+shortenNumber(items.count[i])+'</span><span class="costos" style="float: right; color: green;">'+shortenNumber(items.cost[i])+' T$</span></button>';
        }
    },

    updateUpgrades: function() {
        document.getElementById("upgradeshop").innerHTML = ""
        for (i = 0; i < upgrade.name.length; i++) {
            if (!upgrade.purchased[i]) {
                if (upgrade.type[i] == "income" && game.turtlesReached >= upgrade.requirement[i]) {
                    document.getElementById("upgradeshop").innerHTML += '<img class="imgbutton" onclick="upgrade.purchase('+i+')" src="'+upgrade.image[i]+'" title="'+upgrade.name[i]+' &#10; '+upgrade.description[i]+' &$10; '+shortenNumber(upgrade.cost[i])+' T$" width="80px" height="80px" />'
                }
                if (upgrade.type[i] == "cosmetic" && game.multiplier >= upgrade.requirement[i]) {
                    document.getElementById("upgradeshop").innerHTML += '<img class="imgbutton" onclick="upgrade.purchase('+i+')" src="'+upgrade.image[i]+'" title="'+upgrade.name[i]+' &#10; '+upgrade.description[i]+' &$10; '+shortenNumber(upgrade.cost[i])+' T$" width="80px" height="80px" />'
                }
                if (upgrade.type[i] == "item" && items.count[i.affectItem] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeshop").innerHTML += '<img class="imgbutton" onclick="upgrade.purchase('+i+')" src="'+upgrade.image[i]+'" title="'+upgrade.name[i]+' &#10; '+upgrade.description[i]+' &$10; '+shortenNumber(upgrade.cost[i])+' T$" width="80px" height="80px" />'
                }
            }
        }
    }

};

window.onload = function() {
    display.updateScore();
    display.updateUpgrades();
    display.updateShoppe();
};

loadStats();
display.updateScore();

setInterval(function() {
    game.addSecondaryTurtles(game.globalincome);
}, game.intervalTime);

setInterval(function() {
    display.updateScore();
    display.updateUpgrades();
    display.updateShoppe();
}, 1000);

setInterval(function() {
    saveStats();
}, 2000);

function saveStats() {
    stats.turtles = game.turtles;
    stats.turtlesReached = game.turtlesReached;
    stats.multiplier = game.multiplier;
    stats.globalincome = game.globalincome;
    stats.clickincome = game.clickincome;
    stats.turtletype = game.turtletype;
    stats.intervalTime = game.intervalTime;
    
    stats.items.count = items.count;
    stats.items.cost = items.cost;
    stats.items.income = items.income;
    stats.items.multiplier = items.multi;

    stats.upgrades.purchased = upgrade.purchased;
  
    writeFileSync(path.join(__dirname, 'stats.json'), JSON.stringify(stats));
}
  
function loadStats() {
    game.turtles = stats.turtles;
    game.turtlesReached = stats.turtlesReached;
    game.multiplier = stats.multiplier;
    game.globalincome = stats.globalincome;
    game.clickincome = stats.clickincome;
    game.turtletype = stats.turtletype;
    game.intervalTime = stats.intervalTime;
  
    items.cost = stats.items.cost;
    items.count = stats.items.count;
    items.income = stats.items.income;
    items.multi = stats.items.multiplier;

    upgrade.purchased = stats.upgrades.purchased;
}

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
} 

function shortenNumber(num) {
    if (num < 1000) {
      return num;
    }
    let suffixes = ['k', 'm', 'b', 't', 'q', 'Q', 's', 'S'];
    let suffixNum = Math.floor(('' + num).length / 3);
    let shortNum = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortNum = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(precision));
      let dotLessShortNum = (shortNum + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortNum.length <= 2) { break; }
    }
    if (shortNum % 1 !== 0) { shortNum = shortNum.toFixed(1); }
    return shortNum + suffixes[suffixNum - 1];
  }

function resetStats() {
    if (confirm("Are you sure? You won't be able to get your save back?")){
        confirm("Resetting data isn't supported yet")
        stats.turtles = 0;
        stats.turtlesReached = 0;
        stats.multiplier = 1;
        stats.globalincome = 0;
        stats.clickincome = 0;
        stats.turtletype = "default";
        stats.intervalTime = 1000;
        
        stats.items.count = items.defcount;
        stats.items.cost = items.defcost;

        stats.upgrade.purchased = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ];
        
        loadStats()
        location.reload();
    }
}

