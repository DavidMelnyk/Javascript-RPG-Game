/** David Melnyk Revised 2019/09/27
This module serves as the host for the enemy class and many related functions. Here you will find the
enemies attributes, and the method that uses the enemies spellbook to do damage.
**/
let enemy;
// Creating the enemy class.
class Enemy {
    constructor(enemyType, level, strength, agility, intellect, vitality, expGive, gold) {
        this.enemyType = enemyType;
        this.level = level;
        // Defining the the primary stats. These stats will modify the secondary stats.
        this.strength = Math.floor(strength + (this.level * 1.1 * strength / 8));
        this.agility = Math.floor(agility + (this.level * 1.1 * agility / 8));
        this.intellect = Math.floor(intellect + (this.level * 1.1 * intellect / 8));
        this.vitality = Math.floor(vitality + (this.level * 1.1 * vitality / 8));
        // Defining the secondary stats. These values are modified by the first.
        this.health = 5 * this.vitality;
        this.maxHealth = this.health;
        this.mana = 5 * intellect;
        this.maxMana = this.mana;
        this.speed = agility * 2;
        this.armor = 50;
        this.defense = this.armor + (this.agility / 10);
        // Misc stats for the Enemy
        this.expGive = expGive;
        this.gold = gold;
    }
    attack(spell) {
        enemySpells();
        let getActions = document.querySelector('.actionButton');
        if (this.mana >= 0) {
            if (spell.damage > 0) {
                this.criticalStrikeChance = 15 + (this.agility / 5);
                var critical = Math.floor(random(1, 100));
                if (this.criticalStrikeChance > critical) {
                    spell.damage = Math.floor(spell.damage * 1.5);
                    $("#combatLog").prepend('<p class="combatLogText"> Their ' + spell.name + ' strikes you for ' + Math.floor(spell.damage * (500/(500 + player.armor))) + '</p>');
                } else {
                    $("#combatLog").prepend('<p class="combatLogText"> Their ' + spell.name + ' strikes you for ' + Math.floor(spell.damage * (500/(500 + player.armor))) + '</p>');
                }
                console.log(spell.damage * (500/(500 + player.armor)));
                player.health -= Math.floor(spell.damage * (500/(500 + player.armor)));
            }
            if (spell.resourceCost > 0) {
                this.mana -= spell.resourceCost;
            }
        } else {
            alert("You don't have enough mana!");
        }

        if (player.health <= 0) {
            player.health = 0;
            alert("You have died!");
            GameManager.setGameStart();
        }

        this.mana += 10;
        if (this.mana > this.maxMana) {
            this.mana = this.maxMana;
        }
        updateUI();
    }
}

/* 
     This object takes a spell object in as a parameter. This object then uses that spell object to do things to the enemy dependant upon the attributes
     of the spell called. 
 */
function enemySpells() {
    enemyspells = {
        basicAttack: {
            name: "Basic Attack",
            nameid: "#basicAttack",
            damage: Math.floor(5 + (enemy.agility / 4) + (enemy.strength / 4)),
        },

        maul: {
            name: "maul",
            nameid: "#backstab",
            damage: Math.floor(5 + (enemy.agility / 4) + (enemy.strength / 4)),
            resourceCost: 25,
        },

        bludgeon: {
            name: "eviscerate",
            nameid: "#eviscerate",
            damage: enemy.agility,
            resourceCost: 40,
            comboCost: 1,
        },

        rupture: {
            name: "rupture",
            nameid: "#rupture",
            damage: 5,
            resourceCost: 25,
        },
    };
    return enemyspells;
}