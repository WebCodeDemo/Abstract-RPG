// Player stats
let player = {
    lootHolding: 0,
    lootStorage: 0,
    gold: 100,
    health: 100,
    maxHealth: 100,
    maxInventorySpace: 10
};

// Constants
const QUEST_LOOT_GAIN = 3;
const QUEST_HEALTH_LOSS = 20;
const UNLOAD_GOLD_PER_ITEM = 10;
const BUY_ITEM_COST = 15;
const REST_COST = 20;
const REST_HEALTH_GAIN = 30;

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

// Update display
function updateDisplay() {
    lootHoldingEl.textContent = player.lootHolding;
    maxInventoryEl.textContent = player.maxInventorySpace;
    lootStorageEl.textContent = player.lootStorage;
    goldEl.textContent = player.gold;
    healthEl.textContent = player.health;
    levelEl.textContent = calculateLevel();

    // Update inventory meter
    const inventoryPercentage = (player.lootHolding / player.maxInventorySpace) * 100;
    inventoryMeterEl.style.width = `${inventoryPercentage}%`;

    // Update health meter
    const healthPercentage = (player.health / player.maxHealth) * 100;
    healthMeterEl.style.width = `${healthPercentage}%`;
    
    // Change health meter color based on health percentage
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

// Go on a quest
function goOnQuest() {
    if (player.lootHolding + QUEST_LOOT_GAIN <= player.maxInventorySpace) {
        player.lootHolding += QUEST_LOOT_GAIN;
        player.health -= QUEST_HEALTH_LOSS;
        logMessage(`You went on a quest and gained ${QUEST_LOOT_GAIN} loot!`);
        
        if (player.health <= 0) {
            playerPassOut();
        }
    } else {
        logMessage("Not enough inventory space for a quest!");
    }
    updateDisplay();
}

// Unload loot
function unloadLoot() {
    if (player.lootHolding > 0) {
        const soldItems = Math.min(player.lootHolding, 5);
        const storedItems = player.lootHolding - soldItems;
        
        player.gold += soldItems * UNLOAD_GOLD_PER_ITEM;
        player.lootStorage += storedItems;
        player.lootHolding = 0;
        
        logMessage(`Sold ${soldItems} items and stored ${storedItems} items.`);
    } else {
        logMessage("No loot to unload!");
    }
    updateDisplay();
}

// Buy new loot
function buyNewLoot() {
    if (player.gold >= BUY_ITEM_COST && player.lootHolding < player.maxInventorySpace) {
        player.lootHolding++;
        player.gold -= BUY_ITEM_COST;
        logMessage("Bought a new item!");
    } else if (player.lootHolding >= player.maxInventorySpace) {
        logMessage("Inventory is full! Cannot buy more items.");
    } else {
        logMessage("Not enough gold to buy new loot!");
    }
    updateDisplay();
}

// Rest
function rest() {
    if (player.gold >= REST_COST) {
        player.gold -= REST_COST;
        player.health = Math.min(player.maxHealth, player.health + REST_HEALTH_GAIN);
        logMessage("You rested and recovered some health.");
    } else {
        logMessage("Not enough gold to rest!");
    }
    updateDisplay();
}

// Player passes out
function playerPassOut() {
    player.lootHolding = Math.floor(player.lootHolding / 2);
    player.gold = Math.floor(player.gold / 2);
    player.health = Math.floor(player.maxHealth / 2);
    logMessage("You passed out! Lost half your loot and gold.");
}

// Initialize game
updateDisplay();
