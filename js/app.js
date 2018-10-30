//lane choices for bug postioning
const FIRSTLANESPAWN = 240;
const SECONDLANESPAWN = 160;
const THIRDLANESPAWN = 80;

const COLUMN_X_COORDINATES = [4, 90, 102, 160, 172, 258, 270, 310, 322, 402];

const offScreen = -60;

//bug skins
const blinkySkin = 'images/enemy-bug-blinky.png';
const clydeSkin = 'images/enemy-bug.png';
const inkySkin = 'images/enemy-bug-inky.png';
const pinkySkin = 'images/enemy-bug-pinky.png';

// Enemies our player must avoid
class Enemy {

  constructor(speed, lane, sprite = clydeSkin) {
    //speed
    this.speed = speed;
    this.offScreen = offScreen;
    this.currentlane = lane;

    //starting postion of enemy to be saved for later
    this.startingX = this.offScreen;

    //exact position of enemy, can be manipulated per instance
    this.x = this.offScreen;
    this.y = lane;

    //resets the postion of the bugs
    this.resetPosition = function() {
      this.x = offScreen;
    }
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
  }
  currentColumn() {
    let result = "";
    if(this.x >= COLUMN_X_COORDINATES[0] && this.x <= COLUMN_X_COORDINATES[1]){
      result = 'firstColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[2] && this.x <= COLUMN_X_COORDINATES[3]){
      result = 'secoundColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[4] && this.x <= COLUMN_X_COORDINATES[5]){
      result = 'thirdColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[6] && this.x <= COLUMN_X_COORDINATES[7]){
      result = 'fourthColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[8] && this.x <= COLUMN_X_COORDINATES[9]) {
      result = 'fithColumn';
    }
    return result
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
  update(dt) {

    //is enemey outside of boundary in other words reached its destination?
    if (this.x < 500) {
      this.x += this.speed * dt;
      //Reset position to start
    } else {
      this.resetPosition();
    }
  }

}

/*player class*/
class Character {
  // Init allEnemies array
  // For each enemy create and push new Enemy object into above array

  /*constructor*/
  constructor(sprite = boy) {
    //allows me to save postioning for latter
    this.startingX = 200;
    this.startingY = 400;
    this.x = this.startingX;
    this.y = this.startingY;

    //charts how many hearts the player has
    this.health = 4;
    this.stonesCollected = 0;

    // sprite
    this.sprite = sprite;
    /*methods*/
    //create character onscreen
  }
  currentColumn() {
    let result = "";
    if(this.x >= COLUMN_X_COORDINATES[0] && this.x <= COLUMN_X_COORDINATES[1]){
      result = 'firstColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[2] && this.x <= COLUMN_X_COORDINATES[3]){
      result = 'secoundColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[4] && this.x <= COLUMN_X_COORDINATES[5]){
      result = 'thirdColumn';
    } else if(this.x >= COLUMN_X_COORDINATES[6] && this.x <= COLUMN_X_COORDINATES[7]){
      result = 'fourthColumn';
    } else {
      result = 'fithColumn';
    }
    return result
  }

  takeDamage() {

    //lower health
    this.health -= 1;
    allHearts.pop();

    //on player death
    if (this.health <= 0) {
      headerText.textContent = "You Died";
      modal.style.display = "block";
    }
    this.respawn();
  }

  //reset position
  respawn() {
    this.x = this.startingX;
    this.y = this.startingY;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //movement
  handleInput(input) {
    //dead people dont move
    if (this.health > 0 && this.stonesCollected < 5) {
      let horizontalMovement = 98;
      let lateralMovement = 80;

      if (input === 'left') {
        if (this.x > 5) {
          this.x -= horizontalMovement;
        }
      } else if (input === 'up') {
        if (this.y > 5) {
          this.y -= lateralMovement;
        }
      } else if (input === 'right') {
        if (this.x < 350) {
          this.x += horizontalMovement;
        }
      } else if (input === 'down') {
        if (this.y < 400) {
          this.y += lateralMovement;
        }
      }
    }

    //stone collections
    if (this.x === stone.x && this.y === stone.y) {
      //makes it so the stone will be placed in random locations
      const xCoordinates = [4, 102, 298, 200, 396];
      stone.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];

      //change the location of the stone from on the river to on the grass
      stone.y = stone.y === 0 ? 320 : 0;

      //stone skins
      const red = 'images/Gem Red.png';
      const blue = 'images/Gem Blue.png';
      const orange = 'images/Gem Orange.png';
      const green = 'images/Gem Green.png';
      const purple = 'images/Gem Purple.png';

      //this needs to cyle through infintely
      //switches the color of the stone after collecting it
      switch (stone.sprite) {
        case blue:
          stone.sprite = red;
          this.stonesCollected += 1;
          break;
        case red:
          stone.sprite = orange;
          this.stonesCollected += 1;
          break;
        case orange:
          stone.sprite = green;
          this.stonesCollected += 1;
          break;
        case green:
          stone.sprite = purple;
          this.stonesCollected += 1;
          break;
        case purple:
          //on win
          this.stonesCollected += 1;
          stone.sprite = blue;
          stone.y = 0;
          //display modal
          modal.style.display = "block";
          headerText.textContent = "Congratulations You Win";
          //puts player back to start
          this.respawn();
      }
    }
  }

  //collision system for our bugs
      update() {
      for (let enemy of allEnemies) {

        if (enemy.y === this.y){
          if(enemy.currentColumn() === this.currentColumn()){
            this.takeDamage();
          }
        }
      }
    }
  }

//symbols that represent if a character takes takeDamage
class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


class Stone {
  constructor(x, y, sprite = blue) {
    this.x = x,
      this.y = y,
      this.sprite = sprite
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


//player skins
const boy = 'images/char-boy.png';
const girl = 'images/char-cat-girl.png';
const girlHorns = 'images/char-horn-girl.png';
const pinkGirl = 'images/char-pink-girl.png';
const girlPrincess = 'images/char-princess-girl.png';


//the goal is for the charicter to gather all of the stones in the river
// Now instantiate your objects.

// Place the player object in a variable called player
const playerInput = prompt("which character do you want to play as? , \n boy\n girl\n horn girl\n pink girl\n princess", "boy");
characterSelect = '';
if (playerInput === 'boy') {
  characterSelect = boy;
} else if (playerInput === 'girl') {
  characterSelect = girl;
} else if (playerInput === 'horn girl') {
  characterSelect = girlHorns;
} else if (playerInput === 'pink girl') {
  characterSelect = pinkGirl;
} else if (playerInput === 'princess') {
  characterSelect = girlPrincess;
} else {
  characterSelect = boy;
}
const character = new Character(characterSelect);

const allEnemies = [];
//red
const blinky = new Enemy(250, FIRSTLANESPAWN, blinkySkin);
allEnemies.push(blinky);
//orange
const clyde = new Enemy(300, SECONDLANESPAWN, clydeSkin);
allEnemies.push(clyde);
//blue
const inky = new Enemy(100, THIRDLANESPAWN, inkySkin);
inky.x = 180;
allEnemies.push(inky);
//pink
const pinky = new Enemy(90, THIRDLANESPAWN, pinkySkin);
allEnemies.push(pinky);

const stone = new Stone(4, 0, 'images/Gem Blue.png');

let stones = [];
stones.push(stone);

const heart1 = new Heart(-27, 455);
const heart2 = new Heart(25, 455);
const heart3 = new Heart(75, 455);
const heart4 = new Heart(127, 455);

let allHearts = [];

allHearts.push(heart1, heart2, heart3, heart4);

// This listens for key presses and sends the keys to your
// character.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

  var allowedKeys = {
    //qwerty
    87: 'up',
    65: 'left',
    68: 'right',
    83: 'down',
    //arrows
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',

  };

  character.handleInput(allowedKeys[e.keyCode]);
});
