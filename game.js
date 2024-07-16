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

// ... (keep DOM elements and event listeners as before)

// Helper function for random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ... (keep updateDisplay, calculateLevel, and logMessage functions as before)

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

// ... (keep rest and playerPassOut functions as before)

// Initialize game
updateDisplay();
