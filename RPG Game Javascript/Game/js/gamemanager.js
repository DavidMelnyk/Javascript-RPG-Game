/* David Melnyk Revised 2019/09/27
This module serves as the game manager for the program. It handles all of the
view in displaying information on the HTML page. This also selects what enemy the player will fight.  Some tools utilized 
in the rest of the program are also defined here.

Providing some resources for the icons and UI which while I had to piece together but I did not create:
https://game-icons.net/
https://icon-library.net/icon/skill-icon-25.html

*/

let GameManager = {
  // Function used for the initial creation of the player
  setGameStart: function(classType) {
      this.startPlayer(classType);
      this.drawPlayerHUD(classType);
      this.setPreFight();
  },

  /*
    Function that starts the battle. This calls on drawPlayerHUD with a classtype to initialize the correct image.
  */
  startBattle: function(classType) {
      this.drawPlayerHUD(classType);
      this.setPreFight();
      updateUI();
  },

  /*
    This function creates the player based upon their selection. (arg: classType, name, strength, agility, intellect, vitality )
  */
  startPlayer: function(classType) {
      switch (classType) {
          case 'Warrior':
              player = new Player(classType, name, 20, 16, 10, 25);
              break;
          case "Rogue":
              player = new Player(classType, name, 25, 20, 20, 20);
              var passive = passivesList();
              passiveSet(passive["greed"]);
              break;
          case "Mage":
              player = new Player(classType, name, 10, 16, 20, 15);
              break;
      }
  },

  /*
    One of the largest functions, this function creates the player's HUD ncluding the inventory, statsheet, skills, and action buttons. This function
    calls upon all of the update UI buttons at the very end to ensure the players UI is up to date.
  */
  drawPlayerHUD: function(classType) {
      $(".playerDisplayInterface").html( 
 `
 '<span id="inventory">
   <span class="equippedSlots">
      <span id="equiphelmet" class="equipSlot ">
      </span>
      <span id="equipamulet" class="equipSlot ">
      </span>
      <span id="equipshoulders" class="equipSlot ">
      </span>
      <span id="equipchest" class="equipSlot ">
      </span>
      <span id="equipbelt" class="equipSlot ">
      </span>
      <span id="equipring" class="equipSlot ">
      </span>
      <span id="equipgloves" class="equipSlot ">
      </span>
      <span id="equiplegs" class="equipSlot ">
      </span>
      <span id="equipboots" class="equipSlot ">
      </span>
      <span id="equipmainHand" class="equipSlot ">
      </span>
      <span id="equipoffHand" class="equipSlot ">
      </span>
      <span id="equiptrinket" class="equipSlot ">
      </span>
   </span>
  <span id="inventoryTable">
  <table>
     <tr>
       <td id="i1" class="slot "> </td>
       <td id="i2" class="slot "></td>
       <td id="i3" class="slot "></td>
       <td id="i4" class="slot "></td>
       <td id="i5" class="slot "></td>
       <td id="i6" class="slot "></td>
     </tr>
     <tr>
       <td id="i7" class="slot "></td>
       <td id="i8" class="slot "></td>
       <td id="i9" class="slot "></td>
       <td id="i10" class="slot "></td>
       <td id="i11" class="slot "></td>
       <td id="i12" class="slot "></td>
     </tr>
     <tr>
       <td id="i13" class="slot "></td>
       <td id="i14" class="slot "></td>
       <td id="i15" class="slot "></td>
       <td id="i16" class="slot "></td>
       <td id="i17" class="slot "></td>
       <td id="i18" class="slot "></td>
     <tr>
       <td id="i19" class="slot "></td>
       <td id="i20" class="slot "></td>
       <td id="i21" class="slot "></td>
       <td id="i22" class="slot "></td>
       <td id="i23" class="slot "></td>
       <td id="i24" class="slot "></td>
     </tr>
   </table>
  </span>
   <img src="js/miscImages/inventory.png">
   <span id="inventyButtonBox">
   </span>
 </span>` +
 '<span id="inventoryButtonSelection">' +
  `<button class ="inventoryButton" type="button" onclick="equipItem()"> Equip </button>
  <button class ="inventoryButton" type="button" onclick="unequipItem()"> Unequip </button>
  <button class ="inventoryButton" type="button" onclick="deleteItem()"> Delete </button> ` +
  '</span>' +
    // Creating the entirety of the Stat Panel including the visuals
  '<div id="statPanel">  <img class ="playerAvatar" src="img/avatars/' + player.classType.toLowerCase() + '.jpg">' +
    '<img id = "playerFrameHealthBar" src = "img/UI/playerFrameHealthBar.png">' +
    '<img id = "playerFrameManaBar" src = "img/UI/playerFrameManaBar.png"> ' +
    '<img id = "playerFrameExperienceBar" src = "img/UI/playerFrameExperienceBar.png">' +
    '<img class ="playerFrameSkeleton" src="img/UI/playerFrameSkeleton.png"> '+
    '<p class="playerFrameLevelNumber">' + player.level + ' </p>' +
    '<img id ="playerFrameLevelCircle" src="img/UI/playerFrameLevel.png">'  +
    '<h2 class="player-name">' + player.name + '</h2>' +
    '<h3 class="player-level"> Level: ' + player.level + " " + player.classType + '</h3>' +
    '<p class="player-health">Health: ' + player.health + '/' + player.maxHealth + '</p>' +
    '<p id="player-armor"> Armor: ' + player.armor + 'Combo Points ' + player.comboPoints + '</p>' +
    '<p id="player-experience"> Exp: ' + player.experience + '/' + player.reqExp + '  StatPoints: ' + player.statPoints + '</p>' +
    '<p id="player-vitality"> Vitality: ' + player.vitality + '</p>' +
    '<p id="player-strength">Strength: ' + player.strength + '</p>' +
    '<p id="player-agility">Agility: ' + player.agility + '</p>' +
    '<p id="player-intellect">Intellect: ' + player.intellect + '</p>' +
    '<p id="player-gold">Gold: ' + player.gold + '</p>' +
      // Creating the + symbols to increase the player stats 
    `<button class ="inventoryButton" id ="increaseVitalityButton" type="button" onclick="player.statIncrease('vitality')"> + </button>
      <button class ="inventoryButton" id ="increaseStrengthButton" type="button" onclick="player.statIncrease('strength')"> + </button>
      <button class ="inventoryButton" id ="increaseAgilityButton" type="button" onclick="player.statIncrease('agility')"> + </button>
      <button class ="inventoryButton" id ="increaseIntellectButton" type="button" onclick="player.statIncrease('intellect')"> + </button>` +
  '</div>' +
  `<span id = "abilityPane"> +
    '<p id="abilityPointPane"> Ability Points:` + player.abilityPoints + `</p>' +
  </span>' <span id = "passivesSlot"> </span>`
  // Creating the actionbar slots for abilities
  +
  `<span class="skillIconSlot" id="ActionBarSlot1" onclick="player.playerattack(playerspells.basicAttack)"> </span>
  <span class="skillIconSlot" id="ActionBarSlot2" onclick="player.playerattack(playerspells.backstab)"> </span>
  <span class="skillIconSlot" id="ActionBarSlot3" onclick="player.playerattack(playerspells.eviscerate)"> </span>
  <span class="skillIconSlot" id="ActionBarSlot4" onclick="player.playerattack(playerspells.poison)"> </span>
  <span class="skillIconSlot" id="ActionBarSlot5" onclick="player.playerattack(playerspells.preparation)"> </span>
  <span class="skillIconSlot" id="ActionBarSlot6" onclick="player.playerattack(playerspells.cunning)"> </span>` +
  // Creating the 'increase' button for abilities
  `<button class ="inventoryButton" id ="increaseBackstabButton" type="button" onclick="player.spellIncrease('backstab')"> + </button>
  <button class ="inventoryButton" id ="increaseEviscerateButton" type="button" onclick="player.spellIncrease('eviscerate')"> + </button>
  <button class ="inventoryButton" id ="increasePoisonButton" type="button" onclick="player.spellIncrease('poison')"> + </button>
  <button class ="inventoryButton" id ="increasePreparationButton" type="button" onclick="player.spellIncrease('preparation')"> + </button>
  <button class ="inventoryButton" id ="increaseCunningButton" type="button" onclick="player.spellIncrease('cunning')"> + </button>
  ` +
  `<div id='combatLog'>  </div>` );

      // Setting up PLAYER UI to fight with buttons.
      // All the update functions are called here to update the player status, skills, equipment and the like.
      updateUI();
      updateInventory();
      updateEquipment();
      spells();
      updateSkills();
  },


  /*
    This page creates the 'find enemy page' before or after a fight. This allows the player access to the find an emey, heal, fight the boss, and purchase a potions button.
  */
  setPreFight: function() {
      $("#header").html('<p> Task: Find an enemy! </p>');
      $(".actionButton").html('<a href="#" class="btn-prefight" onclick="GameManager.setFight(player.location)"> Find an enemy! </a>' +
                              '<a href="#" class="btn-prefight" onclick="player.playerHeal()"> Heal! </a>' +
                              '<a href="#" class="btn-prefight" onclick="GameManager.setFight(player.location + 1)"> Fight the Boss </a>' +
                              '<a href="#" class="btn-prefight" onclick="player.buyPotion()"> Purchase a Potion (10g) </a>');
  },

  /* 
    This function sets the fight up by creating an enemy 
  */
  setFight: function(bossFight) {
      let getHeader = document.querySelector('#header');
      let getEnemy = document.querySelector('#enemyDisplay');
      $(".actionButton").html('<span id="btn-potion" onclick="player.usePotion()">' + player.potions + '</span>');
      player.location = bossFight;
      // Creating monsters to fight. (enemyType, level, strength, agility, intellect, vitality, expGive, gold)
      // The Forest
      let enemy00 = new Enemy("Gnoll", random(1, 3), 10, 10, 4, 7, 6, 4);
      let enemy01 = new Enemy("Rat", random(1, 3), 5, 10, 4, 8, 7, 2);
      let enemy02 = new Enemy("Goblin", random(1, 4), 10, 5, 5, 10, 8, 5);
      let enemy03 = new Enemy("Bandit", random(1, 4), 10, 15, 5, 10, 8, 9);
      let enemy04 = new Enemy("Bear", random(1, 5), 15, 5, 4, 15, 15, 5);
      let boss01 = new Enemy("Forest Troll", 7, 25, 25, 15, 20, 40, 19);
      // The Mountains
      let enemy05 = new Enemy("Escaped Convinct", random(3, 6), 15, 10, 10, 15, 17, 4);
      let enemy06 = new Enemy("Alzahz Assassin", random(4, 6), 20, 10, 15, 8, 20, 2);
      let enemy07 = new Enemy("Mountain Scorpion", random(5, 8), 13, 5, 5, 10, 22, 5);
      let enemy08 = new Enemy("Alzahz Myrmidon", random(7, 9), 30, 15, 5, 10, 27, 9);
      let enemy09 = new Enemy("The Unhinged", random(5, 10), 15, 5, 20, 20, 30, 5);
      let boss02 = new Enemy("Syzzlac, The Gatekeeper", 15, 30, 15, 30, 50, 85, 19);
      // The Monastery
      let enemy10 = new Enemy("Summoned Horror", random(5, 10), 10, 10, 15, 7, 24, 4);
      let enemy11 = new Enemy("Alzahz Priest", random(6, 15), 5, 10, 20, 8, 53, 2);
      let enemy12 = new Enemy("Alzahz Warrior", random(9, 15), 10, 5, 5, 10, 65, 5);
      let enemy13 = new Enemy("Dreadhound", random(15, 19), 10, 15, 5, 10, 76, 9);
      let enemy14 = new Enemy("Alzahz Royal Guard", random(18, 22), 15, 20, 30, 15, 95, 5);
      let boss03 = new Enemy("Dakkanar, The Crypt Dread", 25, 25, 20, 40, 10, 200, 19);
      let chooseRandomEnemy = Math.floor(Math.random() * Math.floor(5));
      if (player.location == 0) {
          switch (chooseRandomEnemy) {
              case 0:
                  enemy = enemy00;
                  break;
              case 1:
                  enemy = enemy01;
                  break;
              case 2:
                  enemy = enemy02;
                  break;
              case 3:
                  enemy = enemy03;
                  break;
              case 4:
                  enemy = enemy04;
                  break;
          }
      }
      if (player.location == 2) {
          switch (chooseRandomEnemy) {
              case 0:
                  enemy = enemy05;
                  break;
              case 1:
                  enemy = enemy06;
                  break;
              case 2:
                  enemy = enemy07;
                  break;
              case 3:
                  enemy = enemy08;
                  break;
              case 4:
                  enemy = enemy09;
                  break;
          }
      }
      if (player.location == 4) {
          switch (chooseRandomEnemy) {
              case 0:
                  enemy = enemy10;
                  break;
              case 1:
                  enemy = enemy11;
                  break;
              case 2:
                  enemy = enemy12;
                  break;
              case 3:
                  enemy = enemy13;
                  break;
              case 4:
                  enemy = enemy14;
                  break;
          }
      }
      if (player.location == 1) {
          enemy = boss01;
          player.location += 1;
      }
      if (player.location == 3) {
          enemy = boss02;
          player.location += 1;
      }
      if (player.location == 5) {
          enemy = boss03;
          player.location += 1;
      }

      // The simple HEADER for the page.
      getHeader.innerHTML = '<p> Location: The Forest </p>';

      // Setting up ENEMY STATSHEET
      getEnemy.innerHTML = '<div id="enemyStatPanel"> <img class ="playerAvatar" src="img/avatars/enemyAvatar/' + enemy.enemyType.toLowerCase() + '.jpg"> <img id ="playerFrameLevelCircle" src="img/UI/playerFrameLevel.png"> <img id = "enemyVisualHealthBar" src = "img/UI/playerFrameHealthBar.png"> <img class ="playerFrameSkeleton" src="img/UI/playerFrameSkeleton.png">' + '<img id = "enemyVisualManaBar" src = "img/UI/playerFrameManaBar.png">' + '<p class="playerFrameLevelNumber">' + enemy.level + ' </p> <h3>' + enemy.enemyType + '</h3><p class="enemy-health"> Health: ' + enemy.health + '/' + enemy.maxHealth + ' Mana: ' + enemy.mana + '/' + enemy.maxMana + ' </p>  <p>Strength: ' + enemy.strength + '</p> <p>Agility: ' + enemy.agility + '</p> <p>Intellect: ' + enemy.intellect + '</p> <p>Speed: ' + enemy.speed + '</p> </div>';
  },
};

  /*
    This function is used to update the players UI and statsheet.
  */
function updateUI() {
  $("#playerFrameLevelCircle").html("<p id='visualPlayerLevel'>" + player.level + "</p>");
  $("#playerFrameHealthBar").css("width", (player.health / player.maxHealth) * 209);
  $("#playerFrameManaBar").css("width", (player.mana / player.maxMana) * 209);
  $("#playerFrameExperienceBar").css("width", (player.experience / player.reqExp) * 209);
  player.maxHealth = 5 * player.vitality;
  player.maxMana = 5 * player.intellect;
  $(".player-health").html('Health: ' + player.health + '/' + player.maxHealth + '          Mana: ' + player.mana + '/' + player.maxMana);
  $("#player-armor").html('Armor: ' + player.armor + '    ' + 'Combo Points: ' + player.comboPoints);
  $("#player-experience").html('Exp: ' + player.experience + '/' + player.reqExp + '  StatPoints: ' + player.statPoints);
  $("#player-strength").html('Strength: ' + player.strength);
  $("#player-vitality").html('Vitality: ' + player.vitality);
  $("#player-agility").html('Agility: ' + player.agility);
  $("#player-intellect").html('Intellect: ' + player.intellect);
  $(".player-level").html('Level ' + player.level + " " + player.classType + ' ');
  $("#btn-potion").html(player.potions);
  $("#player-gold").html("Gold: " + player.gold);
  $("#abilityPointPane").html('Ability Points: ' + player.abilityPoints);
  if (enemy) {
      $("#enemyVisualManaBar").css("width", (enemy.mana / enemy.maxMana) * 209);
      $(".enemy-health").html('Health: ' + enemy.health + '/' + enemy.maxHealth + '          Mana: ' + enemy.mana + '/' + enemy.maxMana);
      $("#enemyVisualHealthBar").css("width", (enemy.health / enemy.maxHealth) * 209);
      enemy.maxHealth = 5 * enemy.vitality;
      enemy.maxMana = 5 * enemy.intellect;
      if (enemy.health <= 0) {
          $(".enemy-health").html('Health: 0');
      }
  }
}

  /*
    This function is used to update the players Equipment and add tooltips.
  */
function updateEquipment() {
  for (var g = 0; g < slotIconNamesList.length; g++) {
      var equipSpace = "equip" + slotIconNamesList[g];
      var itemColor;
      if (!jQuery.isEmptyObject(player[slotIconNamesList[g]])) {
          imageIcon = player[slotIconNamesList[g]].type + player[slotIconNamesList[g]].quality;
          document.getElementById(equipSpace).style.backgroundImage = 'url(itemIcons/' + player[slotIconNamesList[g]].type + '/' + imageIcon + '.png)';
          // Adding tooltip
          if (!$("#equipTooltip" + slotIconNamesList[g]).length) {
              if (player[slotIconNamesList[g]].quality == "Regular") {
                  itemColor = "grey";
              } else if (player[slotIconNamesList[g]].quality == "Uncommon") {
                  itemColor = "green";
              } else if (player[slotIconNamesList[g]].quality == "Rare") {
                  itemColor = "blue";
              } else if (player[slotIconNamesList[g]].quality == "Epic") {
                  itemColor = "purple";
              } else if (player[slotIconNamesList[g]].quality == "Legendary") {
                  itemColor = "gold";
              }
              $("#" + equipSpace).append("<span id='equipTooltip" + slotIconNamesList[g] + "'> <h1 id='equiptoolTipTitle" + player[slotIconNamesList[g]].type + "'>" + player[slotIconNamesList[g]].quality + " " + firstUpperCase(player[slotIconNamesList[g]].type) + "</h1> </span>");
              $("#equiptoolTipTitle" + player[slotIconNamesList[g]].type).css("color", itemColor);
              if (player[slotIconNamesList[g]].armor) {
                  $("#equipTooltip" + slotIconNamesList[g]).append("<p> Armor: " + player[slotIconNamesList[g]].armor + "</p>");
              }
              if (player[slotIconNamesList[g]].damageMax) {
                  $("#equipTooltip" + slotIconNamesList[g]).append("<p> Damage: " + (player[slotIconNamesList[g]].damageMin) + "-" + player[slotIconNamesList[g]].damageMax + "</p>");
              }
              if (player[slotIconNamesList[g]].affixes.length != 0) {
                  for (i = 0; i < player[slotIconNamesList[g]].affixes.length; i++) {
                      $("#equipTooltip" + slotIconNamesList[g]).append("<p class='magic'> +" + player[slotIconNamesList[g]].affixes[i]["value"] + " " + player[slotIconNamesList[g]].affixes[i]["name"] + "</p>");
                  }
              }
          }
      }
      if (jQuery.isEmptyObject(player[slotIconNamesList[g]])) {
          $("#equip" + slotIconNamesList[g]).html(" ");
      }
  }
}

  /*
    This function is used to update the players Spell Tooltips. This calls upon 'spells()' to ensure the tooltips are accurate and not old data.
  */
 let passive;
function updateSkills() {
  spells();
  for (var g = 1; g < 7; g++) {
       $("#ActionBarSlot" + g).html("<span id='tooltipActionBar" + g + "'> <h2 id='toolTipTitle" + g + "'>" + firstUpperCase(actionBar[g]) + "</h2> <p id='levelReq" + g + "'> Level Requirement: " + playerspells[actionBar[g]].levelReq+" " + "</p> <p> Level: " + player[actionBar[g]] + "</p> <p id='description" + g + "'>  " + playerspells[actionBar[g]].description +"</p><p> Damage: " + playerspells[actionBar[g]].damage + "</p> <p id='toolTipMana" + g + "'> Mana: " + playerspells[actionBar[g]].resourceCost + " </p> </span>");
      $("#tooltipActionBar" + g).css("color", "Gold");
      $("#levelReq" + g ).css("color", "lightblue");
      $("#toolTipMana" + g).css("color", "lightblue");
      $("#description" + g).css("color", "green");
      if (player.level < playerspells[actionBar[g]].levelReq) {
        $("#tooltipActionBar" + g).css("color", "Red");
        $("#levelReq" + g).css("color", "Red");
    }
  }
  $("#passivesSlot").html("<span id='tooltipPassive'> <h3 id='tooltipTitle'> Passive: " + player.passive.name + "</h3> <p id='passiveDescriptionText'>" + player.passive.description + "</p>" + "<p id='selectPassive'> Select a new Passive </p> </span>");
  $("#passivesSlot").css("background-image", "url('img/icons/" + player.passive.name + ".png'");
  $("#tooltipTitle").css("color", "Gold");
  $("#selectPassive").css("color", "Red");
  $("#selectPassive").css("Border", "2px solid green");
  $("#passiveDescriptionText").css("color", "green");
  $("#selectPassive").html("Select a passive! <div id='passiveList'>" + constructPassivesList() + "</div>");
}

function constructPassivesList() {
  var arrayList = [];
  for(i=1; i < 4; i++) {
    a =  "<span id='" + roguePassiveList[i] + "Passive'> Test </span>";
    $("#" + roguePassiveList[i] + "Passive").html("<p>EGGGG </p>");
    arrayList.push(a);
  }
  return arrayList;
}
  /*
    This function is used to update the inventory pane.
  */
function updateInventory() {
  for (var g = 1; g < 27; g++) {
      var inventorySpace = "i" + g;
      var itemColor;
      if (!jQuery.isEmptyObject(inventory[inventorySpace])) {
          imageIcon = inventory[inventorySpace].type + inventory[inventorySpace].quality; // The Lower case for image.png
          // Adding the visual ico to the slots.
          document.getElementById("i" + g).style.backgroundImage = 'url(itemIcons/' + inventory[inventorySpace].type + '/' + imageIcon + '.png)';
          // Adding the tooltip onto the inventory slot
          if (!$("#tooltipI" + g).length) {
              if (inventory[inventorySpace].quality == "Regular") {
                  itemColor = "grey";
              } else if (inventory[inventorySpace].quality == "Uncommon") {
                  itemColor = "green";
              } else if (inventory[inventorySpace].quality == "Rare") {
                  itemColor = "blue";
              } else if (inventory[inventorySpace].quality == "Epic") {
                  itemColor = "purple";
              } else if (inventory[inventorySpace].quality == "Legendary") {
                  itemColor = "gold";
              }
              $("#i" + g).append("<span id='tooltipI" + g + "'> <h1 id='toolTipTitle" + g + "'>" + inventory[inventorySpace].quality + " " + firstUpperCase(inventory[inventorySpace].type) + "</h1> </span>");
              $("#toolTipTitle" + g).css("color", itemColor);
              if (inventory[inventorySpace].armor) {
                  $("#tooltipI" + g).append("<p> Armor: " + inventory[inventorySpace].armor + "</p>");
              }
              if (inventory[inventorySpace].damageMax) {
                  $("#tooltipI" + g).append("<p> Damage: " + (inventory[inventorySpace].damageMin) + "-" + inventory[inventorySpace].damageMax + "</p>");
              }
              if (inventory[inventorySpace].affixes.length != 0) {
                  for (i = 0; i < inventory[inventorySpace].affixes.length; i++) {
                      $("#tooltipI" + g).append("<p class='magic'> +" + inventory[inventorySpace].affixes[i]["value"] + " " + inventory[inventorySpace].affixes[i]["name"] + "</p>");
                  }
              }
          }
      }
      if (jQuery.isEmptyObject(inventory[inventorySpace])) {
          $("#i" + g).html(" ");
      }
  }
}

/*
  Takes a minimum and maximum argument to generate a random integer between the two.
*/
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
  Takes a string as an argument and slices the string to capitalize the first letter. Usually used to make the UI look nice with no lower case.
*/
function firstUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}