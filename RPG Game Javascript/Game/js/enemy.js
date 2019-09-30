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
        this.dead = false;
    }
    attack(spell) {
        enemySpells();
        let getActions = document.querySelector('.actionButton');
        if (this.mana >= 0) {
            if (spell.damage > 0) {
                spell.damage = Math.floor(spell.damage * (500/(500 + player.armor)));
                this.criticalStrikeChance = 15 + (this.agility / 5);
                var critical = Math.floor(random(1, 100));
                if (this.criticalStrikeChance > critical) {
                    spell.damage = Math.floor(spell.damage * 1.5);
                    $("#combatLog").prepend('<p class="combatLogText"> Their ' + spell.name + ' strikes you for ' + spell.damage + '</p>');
                } else {
                    $("#combatLog").prepend('<p class="combatLogText"> Their ' + spell.name + ' strikes you for ' + spell.damage + '</p>');
                }
                player.health -= spell.damage;
            }
            if (spell.resourceCost > 0) {
                this.mana -= spell.resourceCost;
            }
            if (spell.armorIncrease > 0) {
                this.armor += spell.armorIncrease
                $("#combatLog").prepend('<p class="combatLogText"> The enemy raises their armor by ' + spell.armorIncrease + '</p>');
            }
            if (spell.heal > 0) {
                this.health += spell.heal
                $("#combatLog").prepend('<p class="combatLogText"> The enemy uses a potion for ' + spell.heal + '</p>');
            }

        } 
        if (player.health <= 0) {
            player.health = 0;
            alert("You have died!");
            location.reload();
        }

        this.mana += 10;
        if (this.mana > this.maxMana) {
            this.mana = this.maxMana;
        }
        updateUI();
    }

    enemyAI() {
        var enemyspells = enemySpells();
        var randomDecision = random(1, 100);
        var decision;
        var stopPotion = false;
        decision = "basicAttack";
        if (randomDecision > 70 && this.mana >= 25) {
            decision = "maul";
        }
        if(this.health/this.maxHealth < 0.2 && randomDecision > 90) {
            decision = "potion";
        }
        if(this.health/this.maxHealth >= 0.5 && this.mana >= 10 && randomDecision > 60) {
            decision = "defend";
        } 
        console.log(decision);
        enemy.attack(enemyspells[decision]);
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
            damage: Math.floor(3 + (enemy.agility / 4) + (enemy.strength / 4)),
        },

        maul: {
            name: "Maul",
            nameid: "#Maul",
            damage: Math.floor(8 + (enemy.agility / 4) + (enemy.strength / 4)),
            resourceCost: 25,
        },

        defend: {
            name: "Defend",
            nameid: "#Defend",
            armorIncrease: 50,
            resourceCost: 25,
        },
        rage: {
            name: "Rage",
            nameid: "#Rage",
            damage: Math.floor(5 + (enemy.agility / 4) + (enemy.strength / 4)),
            selfDamage: 10,
            resourceCost: 25,
        },
        exposearmor: {
            name: "Rage",
            nameid: "#Rage",
            armorDestroy: 20 * player.level,
            selfDamage: 10,
            resourceCost: 25,
        },
        potion: {
            name: "potion",
            nameid: "#potion",
            heal: 30,
        },
        flamestrike: {
            name: "flamestrike",
            nameid: "#flamestrike",
            heal: 50,
            resourceCost: 50,
        }
    };
    return enemyspells;
}