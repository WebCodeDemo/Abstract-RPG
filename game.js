// Player stats
let player = {
    lootHolding: 0,
    lootStorage: 0,
    gold: 100,
    health: 100,
    maxHealth: 100,
    maxInventorySpace: 20
};

// Constants
const QUEST_LOOT_GAIN_MIN = 2;
const QUEST_LOOT_GAIN_MAX = 5;
const QUEST_HEALTH_LOSS_MIN = 10;
const QUEST_HEALTH_LOSS_MAX = 30;
const UNLOAD_GOLD_PER_ITEM_MIN = 8;
const UNLOAD_GOLD_PER_ITEM_MAX = 12;
const BUY_ITEM_COUNT_MIN = 3;
const BUY_ITEM_COUNT_MAX = 5;
const BUY_ITEM_COST_PER_ITEM_MIN = 5;
const BUY_ITEM_COST_PER_ITEM_MAX = 8;
const REST_COST = 20;
const REST_HEALTH_GAIN_MIN = 20;
const REST_HEALTH_GAIN_MAX = 40;

// DOM elements
const lootHoldingEl = document.getElementById('loot-holding');
const maxInventoryEl = document.getElementById('max-inventory');
const lootStorageEl = document.getElementById('loot-storage');
const goldEl = document.getElementById('gold');
const healthEl = document.getElementById('health');
const levelEl = document.getElementById('level');
const logEl = document.getElementById('log');
const inventoryMeterEl = document.getElementById('inventory-meter');
const healthMeterEl = document.getElementById('health-meter');

// Action buttons
document.getElementById('quest').addEventListener('click', goOnQuest);
document.getElementById('unload').addEventListener('click', unloadLoot);
document.getElementById('buy').addEventListener('click', buyNewLoot);
document.getElementById('rest').addEventListener('click', rest);

// Helper function for random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update display
function updateDisplay() {
    lootHoldingEl.textContent = player.lootHolding;
    maxInventoryEl.textContent = player.maxInventorySpace;
    lootStorageEl.textContent = player.lootStorage;
    goldEl.textContent = player.gold;
    healthEl.textContent = player.health;
    levelEl.textContent = calculateLevel();

    const inventoryPercentage = (player.lootHolding / player.maxInventorySpace) * 100;
    inventoryMeterEl.style.width = `${inventoryPercentage}%`;

    const healthPercentage = (player.health / player.maxHealth) * 100;
    healthMeterEl.style.width = `${healthPercentage}%`;
    
    if (healthPercentage > 50) {
        healthMeterEl.style.backgroundColor = `hsl(${healthPercentage}, 100%, 40%)`;
    } else {
        healthMeterEl.style.backgroundColor = `hsl(0, 100%, ${50 - (50 - healthPercentage) / 2}%)`;
    }
}

// Calculate level
function calculateLevel() {
    return Math.round((player.lootHolding + player.lootStorage) / 7);
}

// Log message
function logMessage(message) {
    logEl.innerHTML = `<p>${message}</p>` + logEl.innerHTML;
}

// Quest flavor texts
const questFlavors = [
    "You ventured into the Dark Forest and battled vicious werewolves.",
    "You explored the abandoned mines, fighting off swarms of cave spiders.",
    "You sailed to the Misty Isles and faced off against ghostly pirates.",
    "You climbed the Frostpeak Mountains and outsmarted a cunning ice dragon.",
    "You delved into the Sunken Temple and solved ancient, deadly puzzles.",
    "You infiltrated the Goblin King's underground palace and emerged victorious."
];

// Go on a quest
function goOnQuest() {
    const lootGain = randomInt(QUEST_LOOT_GAIN_MIN, QUEST_LOOT_GAIN_MAX);
    const healthLoss = randomInt(QUEST_HEALTH_LOSS_MIN, QUEST_HEALTH_LOSS_MAX);

    if (player.lootHolding + lootGain <= player.maxInventorySpace) {
        player.lootHolding += lootGain;
        player.health -= healthLoss;

        const flavorText = questFlavors[Math.floor(Math.random() * questFlavors.length)];
        logMessage(`${flavorText} You gained ${lootGain} loot and lost ${healthLoss} health!`);
        
        if (player.health <= 0) {
            playerPassOut();
        }
    } else {
        logMessage("Your bags are too full for another quest. Try unloading some loot first!");
    }
    updateDisplay();
}

// Unload loot flavor texts
const unloadFlavors = [
    "The merchant was impressed by your rare finds.",
    "A noble passing by offered a premium for your exotic items.",
    "You haggled skillfully, getting a better price for your loot.",
    "The local guild bought some of your items for their collection.",
    "A traveling wizard purchased some of your magical artifacts."
];

// Unload loot
function unloadLoot() {
    if (player.lootHolding > 0) {
        const totalItems = player.lootHolding;
        const sellRatio = Math.random(); // Determines the split between selling and storing
        const soldItems = Math.round(totalItems * sellRatio);
        const storedItems = totalItems - soldItems;
        const goldPerItem = randomInt(UNLOAD_GOLD_PER_ITEM_MIN, UNLOAD_GOLD_PER_ITEM_MAX);
        
        player.gold += soldItems * goldPerItem;
        player.lootStorage += storedItems;
        player.lootHolding = 0;
        
        const flavorText = unloadFlavors[Math.floor(Math.random() * unloadFlavors.length)];
        logMessage(`${flavorText} You sold ${soldItems} items for ${goldPerItem} gold each and stored ${storedItems} items.`);
    } else {
        logMessage("Your bags are empty. Time for another adventure!");
    }
    updateDisplay();
}

// Buy loot flavor texts
const buyFlavors = [
    "The shopkeeper offered you a special discount on rare items.",
    "You stumbled upon a traveling merchant with exotic wares.",
    "A mysterious hooded figure sold you some intriguing artifacts.",
    "The local blacksmith showcased their finest crafted equipment.",
    "You discovered a hidden auction of valuable treasures."
];

// Buy new loot
function buyNewLoot() {
    const itemCount = randomInt(BUY_ITEM_COUNT_MIN, BUY_ITEM_COUNT_MAX);
    const itemCostEach = randomInt(BUY_ITEM_COST_PER_ITEM_MIN, BUY_ITEM_COST_PER_ITEM_MAX);
    const totalCost = itemCount * itemCostEach;

    if (player.gold >= totalCost && player.lootHolding + itemCount <= player.maxInventorySpace) {
        player.lootHolding += itemCount;
        player.gold -= totalCost;
        const flavorText = buyFlavors[Math.floor(Math.random() * buyFlavors.length)];
        logMessage(`${flavorText} You bought ${itemCount} new items for ${totalCost} gold!`);
    } else if (player.lootHolding + itemCount > player.maxInventorySpace) {
        logMessage(`You don't have enough space for ${itemCount} items. Try unloading some loot first!`);
    } else {
        logMessage(`You don't have enough gold to buy ${itemCount} items. Each item costs ${itemCostEach} gold.`);
    }
    updateDisplay();
}

// Rest flavor texts
const restFlavors = [
    "You enjoyed a hearty meal and a good night's sleep at the Prancing Pony Inn.",
    "You meditated in a serene elven glade, rejuvenating your spirit.",
    "A kind cleric offered to heal your wounds free of charge.",
    "You discovered a hidden hot spring with healing properties.",
    "You attended a local festival, boosting your morale and health."
];

// Rest
function rest() {
    if (player.gold >= REST_COST) {
        player.gold -= REST_COST;
        const healthGain = randomInt(REST_HEALTH_GAIN_MIN, REST_HEALTH_GAIN_MAX);
        player.health = Math.min(player.maxHealth, player.health + healthGain);
        const flavorText = restFlavors[Math.floor(Math.random() * restFlavors.length)];
        logMessage(`${flavorText} You recovered ${healthGain} health for ${REST_COST} gold.`);
    } else {
        logMessage("You don't have enough gold to rest comfortably. Perhaps sleep under the stars?");
    }
    updateDisplay();
}

// Player passes out
function playerPassOut() {
    player.lootHolding = Math.floor(player.lootHolding / 2);
    player.gold = Math.floor(player.gold / 2);
    player.health = Math.floor(player.maxHealth / 2);
    logMessage("You collapsed from exhaustion! You've lost half your loot and gold, but a kind stranger helped you to safety.");
}

// Initialize game
updateDisplay();
