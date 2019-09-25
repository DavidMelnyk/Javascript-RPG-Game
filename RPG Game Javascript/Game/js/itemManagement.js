/** David Melnyk Revised 2019/08/06
This module serves as the host for all item related functions. This includes creating the item for generation,
equipping the item, unequipping the item, and the inventory highlighting and sectioning functions.
This module is related closely to itemReferences.
**/

// ||||||| This Function creates an item to be added to the players inventory |||||||||
function createItem() {
    var randomSlot = Math.floor(Math.random() * Math.floor(12));
    var itemQuality = Math.floor(Math.random() * Math.floor(1000));
    var actualQuality;
    var affixSlots;
    // Determining the item slot and icon name. The difference between these two is lower case.
    itemName = slotIconNamesList[randomSlot];
    itemIconName = slotIconNamesList[randomSlot]; // || THIS WAS CHANGED
    // Determining the item Rarity and Affix Slots (Regular, Uncommon, Rare, Epic, Legendary)
    if (itemQuality <= 300) {
        actualQuality = rarities[0];
        affixSlots = 0;
    } else if (itemQuality >= 300 && itemQuality <= 500) {
        actualQuality = rarities[1];
        affixSlots = 1;
    } else if (itemQuality >= 501 && itemQuality <= 600) {
        actualQuality = rarities[2];
        affixSlots = 2;
    } else if (itemQuality >= 600 && itemQuality <= 900) {
        actualQuality = rarities[3];
        affixSlots = 3;
    } else if (itemQuality >= 901 && itemQuality <= 1000) {
        actualQuality = rarities[4];
        affixSlots = 4;
    }

    let possibleAffixes = [
     {name: "Strength", value: random(Math.floor(1 + enemy.level/2), enemy.level*2)},
     {name: "Agility", value: random(Math.floor(1 + enemy.level/2), enemy.level*2) },
     {name: "Vitality", value: random(Math.floor(1 + enemy.level/2), enemy.level*2) },
     {name: "Intellect", value: random(Math.floor(1 + enemy.level/2), enemy.level*2)},
    ];

    // Attributes of the object
    item = {}; // Blank Item
    item.type = itemIconName; // Item Type
    // Determining which affixes to add for weapons and armor
    if (item.type == "mainHand" || item.type == "offHand") {
        item.damageMin = 1 + Math.floor(Math.random() * Math.floor(2)) * player.level;
        item.damageMax = item.damageMin + 2 + Math.floor(Math.random() * Math.floor(5));
    }
    if (item.type != "mainHand" && item.type != "offHand" && item.type != "amulet" && item.type != "ring" && item.type != "trinket" && item.type) {
        item.armor = 1 + Math.floor(Math.random() * Math.floor(5)) * player.level;
    }
    item.affixes = [];
    item.reqStrength = 0;
    item.reqIntellect = 0;
    item.reqAgility = 0;
    item.quality = actualQuality;
    item.value = 50;

    // For Loop to generate and append affixes onto the object
    for (var i = 0; i < affixSlots; i++) {
        randomAffix = Math.floor(random(0, 3));
        item.affixes.push(possibleAffixes[randomAffix]);
    }
    // For loop to iterate through the inventory and add it to a
    // blank inventory slot. HTML is also done here for the items icon.
    for (var g = 1; g < 27; g++) {
        var inventorySpace = "i" + g;
        if (jQuery.isEmptyObject(inventory[inventorySpace])) {
            imageIcon = item.type.toLowerCase() + item.quality; // The Lower case for image.png
            inventory[inventorySpace] = item;
            // Adding the item to the slots.
            document.getElementById("i" + g).style.backgroundImage = 'url(itemIcons/' + item.type + '/' + imageIcon + '.png)';
            // Adding the tooltip onto the inventory slot
            updateInventory();
            break;
        }
    }
}

// ||||||| This Function serves as a means of equipping the players items. |||||||||
function equipItem() {
    var equipItem = inventory[clickedEventId]["type"];
    var item = inventory[clickedEventId];
    var imageIconEquip = inventory[clickedEventId].type + inventory[clickedEventId].quality; // The Lower case for image.png
    // Actually transfering the image. Assigning it to the right slot. Then removing it from the wrong Slot.
    // If the object is empty, add to playerSlot
    if (jQuery.isEmptyObject(player[equipItem])) {
        document.getElementById(clickedEventId).style.backgroundImage = "none";
        player[equipItem] = inventory[clickedEventId];
        inventory[clickedEventId] = {};
        if (item.armor) {
            player.armor += item.armor;
        }
        // Adding the affixes to the player stats
        for (var i = 0; i < item.affixes.length; i++) {
            var upperCase = item.affixes[i].name;
            var affix = upperCase.toLowerCase();
            player[affix] += item.affixes[i].value;
        }
        player.maxHealth = 5 * player.vitality;
    } else {
        player.transfer = inventory[clickedEventId];
        inventory[clickedEventId] = player[equipItem];
        player[equipItem] = player.transfer;
        updateUI();
        updateEquipment();
        updateInventory();
    }
    updateUI();
    updateEquipment();
    updateInventory();
}

// ||||||| This Function unequips an item from the player |||||||||
function unequipItem() {
    var unequipSlot = clickedEventId.replace('equip', '');
    player.armor -= player[unequipSlot].armor;
    // Finding an empty inventory slot
    for (var g = 1; g < 27; g++) {
        inventorySpace = "i" + g;
        if (jQuery.isEmptyObject(inventory[inventorySpace])) {
            // Removing Affixes
            for (var i = 0; i < item.affixes.length; i++) {
                var upperCase = item.affixes[i].name;
                var affix = upperCase.toLowerCase();
                player[affix] -= item.affixes[i].value;
            }
            inventory[inventorySpace] = player[unequipSlot];
            imageIcon = player[unequipSlot].type + player[unequipSlot].quality; // The Lower case for image.png
            document.getElementById(clickedEventId).style.backgroundImage = "none";
            document.getElementById(inventorySpace).style.backgroundImage = 'url(itemIcons/' + player[unequipSlot].type + '/' + imageIcon + '.png)';
            // Adding the tooltip onto the inventory slot
            $(inventorySpace).attr("title", "" + player[unequipSlot].quality + " " + player[unequipSlot].type + "\nArmor: " + player[unequipSlot].armor);
            player[unequipSlot] = {};
            break;
        }
    }
    updateUI();
    updateInventory();
    updateEquipment();
}

// ||||||| This Function serves as a means of deleting the item from the players inventory. |||||||||
function deleteItem() {
    inventory[clickedEventId] = {};
    player[clickedEventId] = {};
    document.getElementById(clickedEventId).style.backgroundImage = "none";
    updateUI();
    updateInventory();
    updateEquipment();
}

var clickedEventId = 0; // This variable just initializes the clickedEventID variable for use in selecting items.
// Clicking on the inventory. Assigns the element ID to a variable, and highlights the selected box.
$(document).on('click', '.slot', function() {
    $("#" + clickedEventId).css("border-color", "#BF942C");
    $("#" + clickedEventId).css("border-width", "1px");
    $("#" + clickedEventId).css("width", "52.5px");
    $("#" + clickedEventId).css("height", "52px");
    clickedEventId = this.id;
    $("#" + clickedEventId).css("width", "52.4px");
    $("#" + clickedEventId).css("height", "51.9px");
    $("#" + clickedEventId).css("border-color", "Red");
    $("#" + clickedEventId).css("border-width", "2px");
});

// Clicking on the equipment slots. These are different so it doesn't screw up the grid.
$(document).on('click', '.equipSlot', function() {
    $("#" + clickedEventId).css("border-color", "#BF942C");
    $("#" + clickedEventId).css("border-width", "1px");
    clickedEventId = this.id;
    $("#" + clickedEventId).css("border-style", "solid");
    $("#" + clickedEventId).css("border-color", "Red");
    $("#" + clickedEventId).css("border-width", "2px");
});

function firstUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
