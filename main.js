let player;
let cursors;
let keys;
let computer;
let interactText;
// hi---------------------------------------------------------------------------------

function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("room", "assets/room.png");
  this.load.image("computer", "assets/computer.png");
}

// hi---------------------------------------------------------------------------------

function create() {

  let centerX = this.cameras.main.width / 2;
  let centerY = this.cameras.main.height / 2;

  let room = this.add.image(centerX, centerY, "room");
  room.setDisplaySize(window.innerWidth,window.innerHeight);

  player = this.add.sprite(300,200,"player");
  player.setScale(0.2);

  computer = this.add.sprite(500,250,"computer");
  computer.setScale(0.3);
  
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
interactText = this.add.text(30, 30, "", {
  fontSize: "28px",
  fill: "#ffffff"
});
}

// hi ---------------------------------------------------------------------------------

function update(){

   if(cursors.left.isDown || keys.A.isDown){
    player.x -= 2
  }

  if(cursors.right.isDown || keys.D.isDown){
    player.x += 2
  }

  if(cursors.up.isDown || keys.W.isDown){
    player.y -= 2     
  }

  if(cursors.down.isDown || keys.S.isDown){
    player.y += 2
  }
  player.x = Phaser.Math.Clamp(player.x, 0, this.cameras.main.width);
  player.y = Phaser.Math.Clamp(player.y, 0, this.cameras.main.height);
let distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  computer.x,
  computer.y
);

if(distance < 120){
  interactText.setText("Press E to Interact");
}else{
  interactText.setText("");
}
}

// hi ---------------------------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  width:window.innerWidth,
  height:window.innerHeight,
  parent: "game-container",
  backgroundColor: "#0f172a",
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}




const game = new Phaser.Game(config);