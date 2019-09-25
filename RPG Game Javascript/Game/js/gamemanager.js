/** David Melnyk Revised 2019/08/06
This module serves as the game manager for the program. It handles all of the
view and related aspects for the player including finding an enemy and fighting
that enemy.
**/
let GameManager = {
    // Function used for the initial creation of the player
    setGameStart: function(classType) {
        this.startPlayer(classType);
        this.drawPlayerHUD(classType);
        this.setPreFight();
    },

    // Function that starts the battle.
    startBattle: function(classType) {
        this.drawPlayerHUD(classType);
        this.setPreFight();
        updateUI();
    },

    //  ||||| This function creates the player based upon their selection. (arg: classType, name, strength, agility, intellect, vitality ) |||||||||||||||
    startPlayer: function(classType) {
        switch (classType) {
            case 'Warrior':
                player = new Player(classType, name, 20, 16, 10, 20);
                break;
            case "Rogue":
                player = new Player(classType, name, 25, 20, 15, 15);
                break;
            case "Mage":
                player = new Player(classType, name, 10, 16, 20, 10);
                break;
        }
    },

    // ||||||||| This function draws the PLAYER STATSHEET. This includes Inventory, Name, Level, Class, stat values. ||||
    drawPlayerHUD: function(classType) {
        let getInterface = document.querySelector(".playerDisplayInterface");
        getInterface.innerHTML = `
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
   `<button class ="inventoryButton" type="button" onclick="equipItem()"> Equip </button>
   <button class ="inventoryButton" type="button" onclick="unequipItem()"> Unequip </button>
   <button class ="inventoryButton" type="button" onclick="deleteItem()"> Delete </button> ` +
            // Creating the entirety of the Stat Panel including the visuals
            ' <div id="statPanel">  <img class ="playerAvatar" src="img/avatars/' + player.classType.toLowerCase() + '.png"> <img id = "playerFrameHealthBar" src = "img/UI/playerFrameHealthBar.png">  <img id = "playerFrameManaBar" src = "img/UI/playerFrameManaBar.png"> <img id = "playerFrameExperienceBar" src = "img/UI/playerFrameExperienceBar.png">  <img class ="playerFrameSkeleton" src="img/UI/playerFrameSkeleton.png"> <p class="playerFrameLevelNumber">' + player.level + ' </p> <img id ="playerFrameLevelCircle" src="img/UI/playerFrameLevel.png"> <h2 class="player-name">' + player.name + '</h2> <h3 class="player-level"> Level ' + player.level + " " + player.classType + '</h3> <p class="player-health">Health: ' + player.health + '/' + player.maxHealth + '</p> <p id="player-armor"> Armor: ' + player.armor + ' </p> <p class="player-exp">Exp: ' + player.experience + '/' + player.reqExp + ' <p id="player-vitality"> Vitality: ' + player.vitality + '</p> <p id="player-strength">Strength: ' + player.strength + '</p> <p id="player-agility">Agility: ' + player.agility + '</p> <p id="player-intellect">Intellect: ' + player.intellect + '</p> <p id="player-gold">Gold: ' + player.gold + '</p>' +
            `<button class ="inventoryButton" id ="increaseVitalityButton" type="button" onclick="statIncrease('vitality')"> + </button>
                 <button class ="inventoryButton" id ="increaseStrengthButton" type="button" onclick="statIncrease('strength')"> + </button>
                 <button class ="inventoryButton" id ="increaseAgilityButton" type="button" onclick="statIncrease('agility')"> + </button>
                 <button class ="inventoryButton" id ="increaseIntellectButton" type="button" onclick="statIncrease('intellect')"> + </button>`
            +
            ' </div> <span id = "abilityPane"> <img src="img/UI/actionBar.png"> </span>';

        // |||||| VISUAL UPDATES FOR INVENTORY AND EQUIPMENT ||||||
        // The update UI Function is called.
        updateUI();
        updateInventory();
        updateEquipment();
    },


    // ||||| Creating the FIND ENEMY PAGE before the fight. ||||
    setPreFight: function() {
        let getHeader = document.querySelector("#header");
        let getActions = document.querySelector(".actionButton");
        let getArena = document.querySelector(".actionButton");
        getHeader.innerHTML = '<p> Task: Find an enemy! </p>';
        getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="GameManager.setFight(player.location)"> Find an enemy! </a>' +
        '<a href="#" class="btn-prefight" onclick="playerHeal()"> Heal! </a>' +
        '<a href="#" class="btn-prefight" onclick="GameManager.setFight(player.location + 1)"> Fight the Boss </a>' +
        '<a href="#" class="btn-prefight" onclick="buyPotion()"> Purchase a Potion </a>';
    },

    // ||||| Setting up the FIGHT MENU for the player after the find enemy button is clicked. |||||

    setFight: function(bossFight) {
        let getHeader = document.querySelector('#header');
        let getActions = document.querySelector('.actionButton');
        let getEnemy = document.querySelector('#enemyDisplay');
        player.location = bossFight;
        // Creating monsters to fight. (enemyType, level, strength, agility, intellect, vitality, expGive, gold)
        // The Forest
        let enemy00 = new Enemy("Gnoll", random(1, 3), 10, 10, 0, 7, 6, 4);
        let enemy01 = new Enemy("Wolf", random(1, 3), 5, 10, 0, 8, 7, 2);
        let enemy02 = new Enemy("Goblin", random(1, 4), 10, 5, 5, 10, 8, 5);
        let enemy03 = new Enemy("Bandit", random(1, 4), 10, 15, 5, 10, 8, 9);
        let enemy04 = new Enemy("Bear", random(1, 5), 15, 5, 0, 15, 15, 5);
        let boss01 = new Enemy("Forest Troll", 7, 25, 25, 0, 20, 35, 19);
        // The Mountains
        let enemy05 = new Enemy("Escaped Convinct", random(3, 6), 15, 10, 0, 15, 6, 4);
        let enemy06 = new Enemy("Alzahz Assassin", random(4, 6), 20, 10, 0, 8, 20, 2);
        let enemy07 = new Enemy("Mountain Scorpion", random(5, 8), 13, 5, 5, 10, 17, 5);
        let enemy08 = new Enemy("Alzahz Myrmidon", random(7, 9), 30, 15, 5, 10, 19, 9);
        let enemy09 = new Enemy("The Unhinged", random(5, 10), 15, 5, 0, 20, 15, 5);
        let boss02 = new Enemy("Syzzlac, The Gatekeeper", 15, 30, 15, 0, 50, 35, 19);
        // The Monastery
        let enemy10 = new Enemy("Summoned Horror", random(5, 10), 10, 10, 0, 7, 6, 4);
        let enemy11 = new Enemy("Alzahz Priest", random(6, 15), 5, 10, 0, 8, 7, 2);
        let enemy12 = new Enemy("Alzahz Warrior", random(9, 15), 10, 5, 5, 10, 8, 5);
        let enemy13 = new Enemy("Dreadhound", random(15, 19), 10, 15, 5, 10, 8, 9);
        let enemy14 = new Enemy("Alzahz Royal Guard", random(18, 22), 15, 5, 0, 15, 15, 5);
        let boss03 = new Enemy("Dakkanar, The Crypt Dread", 25, 25, 15, 0, 10, 35, 19);
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
        getHeader.innerHTML = '<p>Location: The Forest</p>';

        // Setting up PLAYER UI to fight with buttons.
        getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="PlayerSpells.calcAttack()"> Attack! </a>' +
                '<a href="#" id="btn-potion" onclick="usePotion()"> Use a potion! ' + player.potions + ' </a>';

        // Setting up ENEMY STATSHEET
        getEnemy.innerHTML = '<div id="enemyStatPanel"> <img class ="playerAvatar" src="img/avatars/enemyAvatar/' + enemy.enemyType.toLowerCase() + '.jpg"> <img id ="playerFrameLevelCircle" src="img/UI/playerFrameLevel.png"> <img id = "enemyVisualHealthBar" src = "img/UI/playerFrameHealthBar.png"> <img class ="playerFrameSkeleton" src="img/UI/playerFrameSkeleton.png"> <p class="playerFrameLevelNumber">' + enemy.level + ' </p> <h3>' + enemy.enemyType + '</h3><p class="enemy-health"> Health: ' + enemy.health + '/' + enemy.maxHealth + ' </p><p>Strength: ' + enemy.strength + '</p> <p>Agility: ' + enemy.agility + '</p> <p>Intellect: ' + enemy.intellect + '</p> <p>Speed: ' + enemy.speed + '</p> </div>';

    },
};

function tooltipAppend() {

}

// Function to update the UI Pane
function updateUI() {
    // UPDATING ALL FRAMES AND STATS
    $("#playerFrameLevelCircle").html("<p id='visualPlayerLevel'>" + player.level + "</p>");
    $("#playerFrameHealthBar").css("width", (player.health / player.maxHealth) * 209);
    $("#playerFrameExperienceBar").css("width", (player.experience / player.reqExp) * 209);
    player.maxHealth = 5 * player.vitality;
    $(".player-health").html('Health: ' + player.health + '/' + player.maxHealth + '          Mana: ' + player.mana + '/' + player.maxMana);
    $("#btn-potion").html('Use a potion! ' + player.potions);
    $("#player-armor").html('Armor: ' + player.armor);
    $("#player-strength").html('Strength: ' + player.strength);
    $("#player-vitality").html('Vitality: ' + player.vitality);
    $("#player-agility").html('Agility: ' + player.agility);
    $("#player-intellect").html('Intellect: ' + player.intellect);
    $("#player-gold").html("Gold: " + player.gold);
    if (enemy) {
    $("#playerFrameManaBar").css("width", (player.mana / player.maxMana) * 209);
        $(".enemy-health").html('Health: ' + enemy.health + '/' + enemy.maxHealth);
        $("#enemyVisualHealthBar").css("width", (enemy.health / enemy.maxHealth) * 209);
        if (enemy.health <= 0) {
            $(".enemy-health").html('Health: 0');
        }
    }
}

// Function to update Equipment Pane
function updateEquipment() {
    for (var g = 1; g < slotIconNamesList.length; g++) {
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
                if (player[slotIconNamesList[g]].damage) {
                    $("#equipTooltip" + slotIconNamesList[g]).append("<p> Damage: " + (player[slotIconNamesList[g]].damage - 5) + "-" + player[slotIconNamesList[g]].damage + "</p>");
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


// This function is used to update the inventory pane
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
                if (inventory[inventorySpace].damage) {
                    $("#tooltipI" + g).append("<p> Damage: " + (inventory[inventorySpace].damage - 5) + "-" + inventory[inventorySpace].damage + "</p>");
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
Used to generate random numbers within the program.
*/
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
