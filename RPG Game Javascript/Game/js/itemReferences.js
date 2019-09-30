/** David Melnyk Revised 2019/09/27
This module serves as the reference for itemManagement. All possible slot slotNames
and rarities of that item. The Inventory of the player is also located here as well an actionBar UI
**/

// A list of possible rarities the item could be.
var rarities = ["Regular", "Uncommon", "Rare", "Epic", "Legendary"];

// A list of possible icon names
var slotIconNamesList = ["helmet", "chest", "shoulders", "gloves", "legs", "boots", "mainHand", "offHand", "ring", "amulet", "trinket", "belt"];

// The player's inventory represented in code.
var inventory = {
    i1: {},
    i2: {},
    i3: {},
    i4: {},
    i5: {},
    i6: {},
    i7: {},
    i8: {},
    i9: {},
    i10: {},
    i11: {},
    i12: {},
    i13: {},
    i14: {},
    i15: {},
    i16: {},
    i17: {},
    i18: {},
    i19: {},
    i20: {},
    i21: {},
    i22: {},
    i23: {},
    i24: {},
    i25: {},
    i26: {},
    i27: {},
};

// The actionbar represented by a single array. In the future when abilities are swapped and added it will use this array to perform the swaps.
var actionBar = [null, "basicAttack", "backstab", "eviscerate", "poison", "preparation", "cunning"];

var enemyBar = [null, "Basic Attack", "maul", ];

var roguePassiveList = [null, "greed", "frugality", "helterskelter"];