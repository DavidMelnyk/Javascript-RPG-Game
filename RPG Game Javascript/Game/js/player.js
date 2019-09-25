/** David Melnyk Revised 2019/08/06
This module serves as the host for the Player class and many related functions.
It has the PlayerClass, the attack method, the heal method, and stat statIncrease
methods.
**/
let player;
// Creating the player class.
class Player {
  constructor(classType, name, strength, agility, intellect, vitality) {
    this.classType = classType;
    this.name = name;
    // Defining the the primary stats. These stats will modify the secondary stats.
    this.strength = strength;
    this.agility = agility;
    this.intellect = intellect;
    this.vitality = vitality;

    // Defining the secondary stats. These values are modified by the first.
    this.health = 5 * this.vitality;
    this.maxHealth = 5 * this.vitality;
    this.mana = 5 * this.intellect;
    this.maxMana = 5 * this.intellect;
    this.speed = agility*2;
    this.armor = 0;
    this.defense = this.armor + (this.agility/10);
    this.hitRating = 75 + (this.agility/10);
    this.criticalStrikeChance = 15 + (this.agility/5);

    // Defining all variables for leveling the character up.
    this.level = 1;
    this.experience = 0;
    this.reqExp = 15;
    this.statPoints = 0;

    items: {

    }
    // Defining the variables that just don't fit in the rest.
    this.helmet = {};
    this.chest = {};
    this.shoulders = {};
    this.gloves = {};
    this.legs = {};
    this.boots = {};
    this.mainHand = {};
    this.offHand = {};
    this.ring = {};
    this.amulet = {};
    this.trinket = {};
    this.belt = {};
    this.transfer = {};

    this.gold = 10;
    this.potions = 0;
    this.location = 0;
  }
}
// ||||||| This Function gives the player experience and determines if the play should level up. |||||||||
function gainExp(expGive) {
  let modifyPlayerExp = document.querySelector('.player-exp');
  alert("You have gained " + expGive + " experience and " + enemy.gold + " gold!");
  player.experience += expGive;
  player.gold += enemy.gold;
  modifyPlayerExp.innerHTML = 'Exp:' + player.experience + '/' + player.reqExp + '';
  if (player.experience >= player.reqExp) {
     alert("You have leveled up!");
     player.level = player.level + 1;
     player.statPoints += 5;
     player.reqExp = Math.floor(player.reqExp * 2.2);
     let modifyPlayerLevel = document.querySelector('.player-level');
     modifyPlayerLevel.innerHTML = 'Level '+ player.level + " " + player.classType + ' ';
  }
}

// ||||||| This Function removes a statpoint whenever the player spends it |||||||||
function statIncrease(stat) {
  if(player.statPoints > 0) {
    player[stat] += 1;
    player.statPoints -= 1;
    updateUI();
  }
}

function buyPotion() {
  if(player.gold > 10) {
    alert("You have purchased a potion!");
    player.potions += 1;
    player.gold -= 10;
    updateUI();
  } else {
    alert("You do not have enough money!");
  }
}

function usePotion() {
  if (player.potions > 0) {
    player.potions -= 1;
    player.health += 25;
    if(player.health > player.maxHealth) {
      player.health = player.maxHealth;
    }
    updateUI();
  }
}

// ||||||| This Function serves as the players attack |||||||||
  let playerAttack = function() {
    let getActions = document.querySelector('.actionButton');
    let getPlayerSpeed = player.speed;
    let getEnemySpeed = enemy.speed;
    let playerBaseDamage = 0 + player.strength;
    if(player.mainHand) {
        let playerBaseDamage = player.mainHand.damage + player.strength;
    }
    var playerCriticalStrike = Math.floor(Math.random() * Math.floor(100)); // Critical Strike Value

    if (playerCriticalStrike <= player.criticalStrikeChance) {
       playerBaseDamage = player.strength * 2;
    }
  // A randomization offset
    let playerOffsetDamage = Math.floor(Math.random() * Math.floor(player.strength/5));
  // The actual damage
    let playerPrelimDamage = playerBaseDamage + playerOffsetDamage;
    let playerFinalDamage = Math.floor(playerBaseDamage / (0.002 * (500+enemy.defense)));
  // Number of hits
    let numberOfAttacks = Math.floor(Math.random() * Math.floor(player.agility/8) + 1);
    let finalOverallDamageArray = [playerFinalDamage, numberOfAttacks, playerCriticalStrike];
    return finalOverallDamageArray;
  };

  let playerHeal = function() {
    alert("You have been healed!");
    player.health = player.maxHealth;
    updateUI();
  };

// ||||||| This object serves as a means of damaging the enemy. |||||||||
      function playerattack(spell){
          if (spell.damage > 0) {
            enemy.health -= spell.damage;
          }
          if (spell.resourceCost > 0) {
            player.mana -= spell.resourceCost;
          }
        updateUI();
      }

      let PlayerSpells = {

        backstab: {
          name: "backstab",
          nameid: "#backstab",
          damage: 50 * player.agility,
          comboGeneration: 1,
          resourceCost: 25,
        },

        eviscerate: {
          name: "eviscerate",
          nameid: "#eviscerate",
          damage: 100,
          resourceCost: 15,
        },

        rupture: {
          name: "rupture",
          nameid: "#rupture",
          damage: 30,
          resourceCost: 25,
        },

        calcAttack: function() {
        // Calculating speed requirements between enemy and player.
          let getActions = document.querySelector('.actionButton');
          let getPlayerSpeed = player.speed;
          let getEnemySpeed = enemy.speed;
          let playerBaseDamage = player.strength;
        // PLAYER strikes the ENEMY
          if (getPlayerSpeed >= getEnemySpeed) {
            let playerAttackValues = playerAttack();
            let totalDamage = (playerAttackValues[0] * playerAttackValues[1]);
            let playerCriticalStrike = playerAttackValues[2];
            enemy.health = enemy.health - totalDamage;
            updateUI();
            if (playerCriticalStrike < player.criticalStrikeChance) {
              alert("You critically strike for " + playerAttackValues[0] + "x" + playerAttackValues[1]);
            } else {
            alert("You hit for " + playerAttackValues[0] + "x" + playerAttackValues[1]);
          }
        // If ENEMY dies Block
            if(enemy.health <= 0) {
              alert("You have won. Enemy has died");
              gainExp(enemy.expGive);
              createItem();
              updateUI();
              getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="GameManager.startBattle()"> Fight Again! </a>';
            } else {
        // ENEMY strikes the PLAYER
              let enemyAttackValues = enemyAttack();
              let totalDamage = enemyAttackValues[0] * enemyAttackValues[1];
              player.health = player.health - totalDamage;
              alert("They hit you for " + enemyAttackValues[0] + "x" + enemyAttackValues[1]);
              updateUI();
        // IF PLAYER DIES
              if(player.health <= 0) {
                alert("You have died!");
              }
            }
          }
        }
};
// ||||||| This Function gives the player their name. |||||||||
function getName() {
  var name = window.prompt("Enter your name: ");
  return name;
}
