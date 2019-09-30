/* David Melnyk Revised 2019/09/27
    This module serves as the host for the Player class and many related functions.
    It has the PlayerClass, the attack method, the heal method, statIncrease method, ability increase and many other functions 
    related to the player.
*/
let player;
class Player {
    constructor(classType, name, strength, agility, intellect, vitality) {
        this.classType = classType;
        this.name = name;
        // Defining the the primary stats. These stats will modify the secondary stats.
        this.strength = strength;
        this.agility = agility;
        this.intellect = intellect;
        this.vitality = vitality;

        // Defining the secondary stats. Some of these values are modified by the first.
        this.health = 5 * this.vitality;
        this.maxHealth = 5 * this.vitality;
        this.mana = 5 * this.intellect;
        this.maxMana = 5 * this.intellect;
        this.speed = agility * 2;
        this.armor = 0;
        this.dodgeRating = 0;
        this.hitrating = 0;
        this.criticalstrike = 0;
        this.manaregen = 15;
        this.goldfind = 0;
        this.spelldamage = 0;
        this.physicaldamage = 1;

        if (this.classType == "Rogue") {
            this.comboPoints = 0;
        }
        this.damage = 0;
        this.addDamage = 0;
        // Defining all variables for leveling the character up.
        this.level = 1;
        this.experience = 0;
        this.reqExp = 15;
        this.statPoints = 0;
        this.abilityPoints = 1;

        // Ability variables
        this.basicAttack = 0;
        this.backstab = 1;
        this.eviscerate = 1;
        this.poison = 1;
        this.preparation = 1;
        this.cunning = 1;

        // Defining currently equipped items in code.
        this.helmet = {};
        this.chest = {};
        this.shoulders = {};
        this.gloves = {};
        this.legs = {};
        this.boots = {};
        this.mainHand = {
            damageMin: 2,
            damageMax: 5,
            quality: "Regular",
            type: "mainHand",
            affixes: {}
        };
        this.offHand = {};
        this.ring = {};
        this.amulet = {};
        this.trinket = {};
        this.belt = {};
        this.transfer = {};

        // Other variables that don't fit in with the rest.
        this.gold = 10;
        this.potions = 0;
        this.location = 0;
        this.passive = {};
    }

    /* 
        This Function gives the player experience and determines if the play should level up. It the player does
        level up it gives the player statpoints, ability points, and sets the new required experienced modifier.
    */
    gainExp(expGive) {
        $("#combatLog").prepend('<p class="combatLogText"> You have gained ' + expGive + ' experience and ' + enemy.gold + ' gold!');
        this.experience += expGive;
        this.gold += enemy.gold + this.goldfind;
        if (this.experience >= this.reqExp) {
            alert("You have leveled up!");
            this.level = this.level + 1;
            this.statPoints += 5;
            this.abilityPoints += 1;
            this.reqExp = Math.floor(this.reqExp * 1.6);
            this.experience = 0;
            updateUI();
        }
    }

    /* 
        This Function removes a statpoint whenever the player spends it and increases the selected stat by one.
    */
    statIncrease(stat) {
        if (this.statPoints > 0) {
            this[stat] += 1;
            this.statPoints -= 1;
            updateUI();
            updateSkills();
        } else {
            alert("You do not have any stat points!");
        }
    }

    /* 
        This function removes an ability point and increases the selected ability by one. It calls upon the relevant update functions.
    */
    spellIncrease(ability) {
        if (this.abilityPoints > 0) {
            alert("You have increased " + ability + " by one!");
            player[ability] += 1;
            this.abilityPoints -= 1;
            updateUI();
            updateSkills();
        } else {
            alert("You do not have any ability points!");
        }
    }

    /* 
        This function removes ten gold, and adds one potion to the player. It calls upon the relevant update functions.
    */
    buyPotion() {
        if (this.gold >= 10) {
            $("#combatLog").prepend('<p class="combatLogText"> You have purchased a potion!');
            this.potions += 1;
            this.gold -= 10;
            updateUI();
        } else {
            alert("You do not have enough money!");
        }
    }

    /* 
        This function removes a potion and adds 35 health to the player. It calls upon the relevant update functions.
    */
    usePotion() {
        if (this.potions > 0) {
            this.potions -= 1;
            this.health += 35;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
            updateUI();
        } else {
            alert("You don't have any potions!");
        }
    }

    /* 
        This function heals the player.
    */
    playerHeal() {
        $("#combatLog").prepend('<p class="combatLogText"> You have been healed!');
        this.health = this.maxHealth;
        updateUI();
    }

    /* 
        This object takes a spell object in as a parameter. This object then uses that spell object to do things to the enemy dependant upon the attributes
        of the spell called. Multile calculations are done here including the players chance to hit, the critical strike rating.
    */
    playerattack(spell) {
        if (enemy) {
            let getActions = document.querySelector('.actionButton');
            let wpnDamage = 0;
            if (player.mainHand.damageMin) {
                wpnDamage = random(player.mainHand.damageMin, player.mainHand.damageMax) + this.addDamage;
            }
            player.damage = 0 + wpnDamage;
            spells();
            if(enemy.dead == false) {
            if (player.level >= spell.levelReq) {
                if (this.mana >= spell.resourceCost) {
                    if (spell.damage > 0) {
                        spell.damage = Math.floor(spell.damage * (500/(500 + enemy.armor)));
                        this.mana -= spell.resourceCost;
                        var hitRating = Math.floor(75 + player.hitrating);
                        var hitChance = Math.floor(random(1, 100));
                        if (hitRating > hitChance) {
                            var criticalStrikeChance = 15 + player.criticalstrike;
                            var critical = Math.floor(random(1, 100));
                            spell.damage = spell.damage * (player.physicaldamage)
                            if (criticalStrikeChance > critical) {
                                spell.damage = Math.floor(spell.damage * 1.5);
                                $("#combatLog").prepend('<p class="combatLogText"> Your ' + spell.name + ' critically strikes the target for ' + spell.damage + '</p>');
                            } else {
                                $("#combatLog").prepend('<p class="combatLogText"> Your ' + spell.name + ' strikes the target for ' + spell.damage + '</p>');
                            }
                            enemy.health -= spell.damage;
                     } else {
                        $("#combatLog").prepend('<p class="combatLogText"> Your ' + spell.name + ' missed! </p>');
                     }
                }
                    if (spell.comboGeneration) {
                        this.comboPoints += 1;
                    }
                    if (spell.comboCost) {
                        this.comboPoints = 0;
                    }
                    if (spell.returnMana) {
                        player.mana += spell.returnMana;
                    }
                    if (spell.addDamage) {
                        alert("It works?");
                        player.addDamage = spell.addDamage;
                    }
                } else {
                    alert("You don't have enough mana!");
                } 
            } else {
                alert("You aren't the right level for that!")
            }
            enemy.enemyAI();
            if (enemy.health <= 0 && enemy.dead == false) {
                enemy.dead = true;
                alert("You have won. Enemy has died");
                this.gainExp(enemy.expGive);
                createItem();
                player.comboPoints = 0;
                GameManager.drawPlayerHUD();
                getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="GameManager.startBattle()"> Fight Again! </a>';
            }
            this.mana += player.manaregen;
            if (this.mana > this.maxMana) {
                this.mana = this.maxMana;
            }
            updateUI();
            updateSkills();
        }else {
            alert("The target is dead!");
        }
    } 
   }

   playerPassive(passive){
        
   }
  }

// This variable exports the spells out of the function.
if (player) {
    var playerspells = spells();
}

function passivesList() {
    passives = {
        greed: {
            name: "Greed",
            nameid: "greed",
            levelReq: 1,
            manaRegen: 3,
            description: "You now restore an additional 3 mana at the end of every turn"
        },

        frugality: {
            name: "Frugality",
            nameid: "frugality",
            levelReq: 2,
            abilityReduction: 5,
            description: "Your backstab now costs 5 less energy"
        },

        helterskelter: {
            name: "Helter Skelter",
            nameid: "helterskelter",
            levelReq: 5,
            confusion: true,
            description: "Your enemies attacks have a 50% chance to hit himself."
        } 
    }
    return passives;
}

function passiveSet(passive) {
    player.passive = passive;
    if(passive.manaRegen > 0) {
        player.manaregen += 3;
    }
}

/* 
    This function uses object keys as a means to define spells. It is represented inside of a function to make it easier to update
    the spells values dynamically instead of having them be statically defined. Most spells have a defined damage which utilizes various player
    attributes to determine the actual damage. Some spells generate combo points and some spells utilize combo points. 
*/
function spells() {
    playerspells = {
        basicAttack: {
            name: "Basic Attack",
            nameid: "basicAttack",
            levelReq: 1,
            damage: Math.floor(player.damage + player.addDamage + (player.strength / 5) + (player.agility / 5)),
            description: "Basic attack that damages the target for " + Math.floor(player.damage + (player.strength / 5) + (player.agility / 5)),
            resourceCost: 5,
        },

        backstab: {
            name: "backstab",
            nameid: "backstab",
            levelReq: 1,
            description: "Backstabs the target for " + Math.floor(5 * player.backstab + player.damage + player.addDamage + (player.strength / 3) + (player.agility / 3)) + " generating 1 combo point",
            damage: Math.floor(5 * player.backstab + player.damage + player.addDamage + (player.strength / 3) + (player.agility / 3)),
            comboGeneration: 1,
            resourceCost: 30,
        },

        eviscerate: {
            name: "eviscerate",
            nameid: "eviscerate",
            levelReq: 3,
            description: "Eviscerates the target for " + Math.floor((10 * player.eviscerate + player.damage + player.addDamage + (player.strength / 5) + (player.agility / 5)) * player.comboPoints),
            damage: Math.floor((10 * player.eviscerate + player.damage + player.addDamage + (player.strength / 5) + (player.agility / 5)) * player.comboPoints),
            resourceCost: 40,
            comboCost: 1,
        },

        poison: {
            name: "poison",
            nameid: "poison",
            levelReq: 5,
            description: "Coats your weapons in poison causing " + Math.floor(5 * player.poison + (player.agility / 10)) + " extra damage",
            damage: 0,
            addDamage: Math.floor(5 * player.poison + (player.agility / 10)),
            resourceCost: 80,
        },
        preparation: {
            name: "preparation",
            nameid: "preparation",
            levelReq: 10,
            description: "Focus intently to restore your mana bar by " + (25 + (25 * player.preparation)),
            damage: 0,
            returnMana: 50 + (25 * player.preparation),
            resourceCost: 5,
        },
        cunning: {
            name: "cunning",
            nameid: "cunning",
            levelReq: 15,
            description: "Deplete your mana bar to increase your dodge",
            damage: 0,
            addDamage: Math.floor(5 + (player.agility / 4)),
            resourceCost: 100,
        }
    };
    return playerspells;
}

/* 
    This function gets the name when the time comes.
*/
function getName() {
    var name = window.prompt("Enter your name: ");
    return name;
}