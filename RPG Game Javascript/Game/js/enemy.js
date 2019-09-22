/** David Melnyk Revised 2019/08/06
This module serves as the host for the enemy class and many related functions. Here you will find the
enemies attributes and enemy attack.
**/

let enemy;
// Creating the enemy class.
function Enemy(enemyType, strength, agility, intellect, vitality, expGive, gold) {
    this.enemyType = enemyType;
    // Defining the the primary stats. These stats will modify the secondary stats.
    this.strength = strength;
    this.agility = agility;
    this.intellect = intellect;
    this.vitality = vitality;
    // Defining the secondary stats. These values are modified by the first.
    this.health = 5 * this.vitality;
    this.maxHealth = this.health;
    this.speed = agility*2;
    this.armor = 500;
    this.defense = this.armor + (this.agility/10);
    // Misc stats for the Monster
    this.expGive = expGive;
    this.gold = gold;
  }

// ||||||| This Function is the enemies attack towards the player |||||||||
    let enemyAttack = function() {
      let calcBaseDamage = enemy.strength;
    // A randomization offset
      let offsetDamage = Math.floor(Math.random() * Math.floor(2));
    // The actual damage
      let calcFinalDamage = calcBaseDamage + offsetDamage;
    // Number of hits
      let numberOfAttacks = Math.floor(Math.random() * Math.floor(enemy.agility/15) + 1);
      let finalOverallDamageArray = [calcFinalDamage, numberOfAttacks];
      return finalOverallDamageArray;
    };
