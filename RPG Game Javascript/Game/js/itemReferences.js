/** David Melnyk Revised 2019/08/06
This module serves as the reference for itemManagement. It holds values for the
minimum and maximum values an affix can take on an item, as well as all possible slot slotNames
and rarities of that item. The Inventory of the player is also located here.
**/

const possibleAffixes = [
 {name: "Strength", value: 5 + (Math.floor(Math.random() * Math.floor(12)))},
 {name: "Agility", value: 5 + (Math.floor(Math.random() * Math.floor(12)))},
 {name: "Vitality", value: 5 + (Math.floor(Math.random() * Math.floor(12)))},
 {name: "Intellect", value: 5 + (Math.floor(Math.random() * Math.floor(12)))},
];

// A list of possible rarities the item could be.
var rarities = ["Regular", "Uncommon", "Rare", "Epic", "Legendary"];

// A list of possible icon names
var slotIconNamesList = ["helmet", "chest", "shoulders", "gloves", "legs", "boots", "mainHand", "offHand", "ring", "amulet", "trinket", "belt"];

// The player's inventory represented in code
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
