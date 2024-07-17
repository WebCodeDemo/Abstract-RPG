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
    "You infiltrated the Goblin King's underground palace and emerged victorious.",
    "You helped smuggle refugees through enemy lines in the ongoing civil war.",
    "You recovered a powerful artifact from a Daedric shrine.",
    "You cleared out a bandit hideout, disrupting their supply lines to the rebel forces.",
    "You navigated the treacherous Planes of Oblivion and survived.",
    "You investigated a series of mysterious disappearances in a small village.",
    "You competed in and won a grand tourney, gaining fame and fortune.",
    "You assassinated a high-ranking official, changing the tide of the civil war.",
    "You defended a small town from an invading orc warband.",
    "You gathered rare alchemical ingredients from the deadly Blackmarsh.",
    "You negotiated a temporary truce between warring factions.",
    "You escaped from a prison caravan and reclaimed your stolen gear.",
    "You lifted an ancient curse from a noble family, earning their gratitude.",
    "You explored an otherworldly Dwemer ruin, battling mechanical constructs.",
    "You survived a night in the haunted Barrow Downs, facing restless draugr.",
    "You retrieved a stolen Elder Scroll from a gang of master thieves.",
    "You quelled a rebellion in a remote mining colony.",
    "You participated in a dangerous ritual to bind a powerful demon.",
    "You protected a caravan of war supplies through bandit-infested territory.",
    "You infiltrated an enemy camp and stole valuable military intelligence.",
    "You survived a deadly game of cat and mouse with a legendary assassin.",
    "You brokered a deal with a dragon, securing its aid in the civil war.",
    "You uncovered a plot to poison a city's water supply and stopped it just in time.",
    "You led a daring raid on an enemy stronghold, capturing a strategic position.",
    "You closed several dangerous Oblivion gates threatening nearby settlements.",
    "You recovered the lost crown of a fallen kingdom, potentially shifting the balance of power.",
    "You navigated the perilous Underdark, battling drow and mind flayers.",
    "You secured an alliance with a tribe of giants, bolstering your faction's forces.",
    "You participated in a heist to steal war funds from a heavily guarded treasury.",
    "You rescued prisoners of war from a notorious labor camp.",
    "You quested into the Feywild, navigating its whimsical and dangerous nature.",
    "You solved a series of riddles to gain entry to an ancient elven library.",
    "You survived a volcanic eruption while battling cultists of an evil fire god.",
    "You protected a sacred grove from corruption spreading from the Shadowfell.",
    "You infiltrated a Thalmor Embassy, uncovering their secret plans.",
    "You battled through hordes of undead to reach a powerful necromancer's lair.",
    "You competed in the Thieves Guild's ultimate heist challenge.",
    "You brokered peace between warring tribes of centaurs and satyrs.",
    "You delved into a mind-bending dungeon created by a mad mage.",
    "You recovered pieces of a powerful artifact from across the planes of existence.",
    "You led a naval battle against a fleet of pirates and sea monsters.",
    "You survived a deadly game orchestrated by the Daedric Prince of Madness.",
    "You uncovered a conspiracy within your own faction and rooted out the traitors.",
    "You protected a remote village from attacks by frost giants.",
    "You navigated the ever-shifting halls of a sentient, living dungeon.",
    "You recovered a powerful weapon from the depths of a dormant volcano.",
    "You infiltrated a secret meeting of the enemy's war council.",
    "You helped a master blacksmith forge a legendary weapon for your cause.",
    "You survived a harrowing journey through the soul-stealing mists of Ravenloft.",
    "You recovered ancient texts detailing forgotten magic to aid your war effort.",
    "You freed enslaved miners from a ruthless operation deep in the mountains.",
    "You protected a group of scholars as they uncovered ancient prophecies about the war.",
    "You won a high-stakes game of chance against a powerful noble, gaining valuable assets.",
    "You survived a treacherous journey across the Sea of Ghosts.",
    "You recovered a powerful magic item from the lair of a beholder.",
    "You infiltrated and sabotaged an enemy's secret weapon development facility.",
    "You helped establish a new settlement for refugees displaced by the war.",
    "You battled through a planar rift, closing it before more otherworldly beings could invade.",
    "You recovered vital intelligence from a downed spy blimp in enemy territory.",
    "You protected a powerful mage as they performed a ritual to weaken the enemy's defenses.",
    "You solved the riddles of an ancient Dwemer puzzle box, revealing crucial war secrets.",
    "You survived a deadly game of cat and mouse in the sewers with a legendary assassin.",
    "You recovered a cache of powerful soul gems to fuel your faction's magical defenses.",
    "You led a covert operation to rescue a captured spy with vital information.",
    "You navigated the treacherous politics of a neutral city to gain their support in the war."
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
    "A traveling wizard purchased some of your magical artifacts.",
    "The Gilded Griffin Inn's keeper traded rooms for your valuable trinkets.",
    "Madam Zara, the mysterious fortune teller, exchanged gold for your curiosities.",
    "The Dwarven Forge master offered a king's ransom for your rare metals.",
    "Captain Stormwind of the Skyship 'Cloudrider' bartered supplies for your exotic goods.",
    "The Elvish Enclave eagerly acquired your forest-found treasures.",
    "Master Thief Shadowfoot offered a hefty sum for your lockpicking tools.",
    "The Royal Artificer purchased your clockwork contraptions for the palace.",
    "High Priestess Lumina traded sacred relics for your holy artifacts.",
    "The Beastmaster's Emporium bought your monster parts for a tidy profit.",
    "Lady Moonglow, the noble alchemist, exchanged potions for your rare ingredients.",
    "The Whispering Willow Druid Circle bartered for your nature-infused items.",
    "Grizzled Prospector Old Pete swapped gold nuggets for your mining equipment.",
    "The Arcane Academy's bursar offered scholarships in exchange for your magical tomes.",
    "Captain Redbeard of the 'Salty Serpent' traded doubloons for your nautical charts.",
    "The Featherlight Courier Company bought your swift-travel gear.",
    "Madame Mystique's Curio Shop eagerly acquired your oddities and curiosities.",
    "The Ironclad Mercenary Company purchased your surplus weapons and armor.",
    "Elder Sage Whitebeard exchanged ancient knowledge for your historical artifacts.",
    "The Shadowmere Thieves' Guild fenced your ill-gotten gains for a premium.",
    "The Royal Menagerie keeper traded exotic beasts for your creature-taming equipment.",
    "Grandmaster Chen of the Jade Temple bartered spiritual teachings for your Eastern relics.",
    "The Astral Observatory's scholars bought your star charts and celestial instruments.",
    "Sir Galahad the Dragonslayer traded his family heirlooms for your monster-hunting gear.",
    "The Verdant Grove's dryads exchanged enchanted seeds for your nature-blessed items.",
    "Keeper of Keys Ironheart swapped rare locks and keys for your security devices.",
    "The Chronomancer's Consortium traded temporal anomalies for your time-touched artifacts.",
    "Madame Zephyr's Airship Emporium bartered cloud essences for your flying contraptions.",
    "The Undercity's Shadow Market offered night coins for your stealth equipment.",
    "High Sorcerer Flameheart of the Crimson Tower exchanged spells for your magical foci.",
    "The Frost Giant Jarl Icefist traded mammoth tusks for your cold-resistant gear.",
    "Master Bowyer Oakenheart crafted bows in exchange for your rare wood samples.",
    "The Siren's Lagoon merfolk swapped sunken treasures for your underwater exploration gear.",
    "Tinkerer Cogsworth of the Clockwork Citadel bartered gears for your mechanical marvels.",
    "The Spectral Librarians traded knowledge crystals for your ghostly manuscripts.",
    "Beastmaster Thorngrowl of the Wilderkin Clan exchanged totems for your animal companions.",
    "The Sand Strider Nomads bartered desert glass for your heat-resistant equipment.",
    "Potion Master Bubblebrook traded elixirs for your alchemical ingredients.",
    "The Monk of a Thousand Fists exchanged chi-infused relics for your martial arts scrolls.",
    "Witch Doctor Boneclaw of the Misty Swamp traded hexes for your voodoo dolls.",
    "The Aetherian Skyforge smiths bartered starmetal for your celestial ores.",
    "Lady Moonwhisper of the Fae Court exchanged glamours for your enchanted trinkets.",
    "The Stone Giant quarry master traded gem-encrusted boulders for your mining equipment.",
    "Harbourmaster Tideturner swapped exotic fish for your deep-sea diving apparatus.",
    "The Whispering Winds Trading Company bartered cloud cotton for your weather prediction tools.",
    "Archdruid Oakenbeard exchanged nature's blessings for your seeds of extinct plants.",
    "The Infernal Counsel traded soul shards for your demon-binding artifacts.",
    "Skymarshal Windchaser of the Griffin Riders bartered aerial maps for your flight gear.",
    "The Evernight Vampire Coven exchanged blood rubies for your sunlight-protection devices.",
    "Golemancer Stoneheart traded animated constructs for your rare magical crystals.",
    "The Laughing Jester, the royal fool, swapped court secrets for your pranking devices.",
    "Spymaster Shadowcloak of the Whisper Network bartered information for your espionage tools.",
    "The Radiant Dawn Paladins exchanged holy relics for your demon-slaying weapons.",
    "Brewmaster Honeymead of the Drunken Dragon Inn traded rare spirits for your exotic ingredients.",
    "The Runestone Dwarves bartered enchanted gems for your mineral samples.",
    "Bard College Headmaster Lyresong exchanged musical instruments for your storytelling artifacts.",
    "The Mirrormere Naiads traded water-breathing pearls for your aquatic treasures.",
    "Falconer Skydancer of the Mountain Eyrie bartered trained birds for your creature-handling gear.",
    "The Sandstorm Djinn exchanged wishes for your sand-touched relics.",
    "Battlemage Commander Stormcaller traded war golems for your combat enchantments.",
    "The Whispering Woods spirits bartered nature's secrets for your forest-found curiosities.",
    "Artificer Sparkspring of the Tinker's Guild exchanged inventions for your creative contraptions.",
    "The Abyssal Merfolk Consortium traded deep-sea pearls for your pressure-resistant equipment.",
    "Dreamweaver Starwhisper of the Lunar Conclave bartered visions for your sleep-inducing artifacts.",
    "The Earthshaker Tribe's shaman traded geodes for your stone-shaping tools.",
    "Cryptkeeper Dustbeard of the Ancient Tombs exchanged burial treasures for your excavation gear.",
    "The Sunfire Phoenix Cult traded rebirth ashes for your heat-resistant equipment."
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
