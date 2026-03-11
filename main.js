let player;
let cursors;
let keys;
let computer;
let interactText;
let interactKey ;
let interacted = false;
let aboutPanel;
let aboutText;
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
  player.setScale(0.1);

  computer = {
  x: 500,
  y: 340
  };
  
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  interactKey = this.input.keyboard.addKey("E");
interactText = this.add.text(computer.x, computer.y - 80, "", {
  fontSize: "32px",
  fill: "#ffffff",   
  backgroundColor: "#6e6a6a"
});

interactText.setOrigin(0.5);
aboutPanel = this.add.rectangle(
  this.cameras.main.width / 2,
  this.cameras.main.height / 2,
  500,
  300,
  0x000000,
  0.8
);

aboutPanel.setVisible(false);

aboutText = this.add.text(
  this.cameras.main.width / 2,
  this.cameras.main.height / 2,
  "Hi, I'm Ravi 👋\n\nI build interactive projects\nand love coding.",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);

aboutText.setOrigin(0.5);
aboutText.setVisible(false);

interactText.setOrigin(0.5);
};



// hi ---------------------------------------------------------------------------------

function update(){

   if(cursors.left.isDown || keys.A.isDown){
    player.x -= 3
  }

  if(cursors.right.isDown || keys.D.isDown){
    player.x += 3
  }

  if(cursors.up.isDown || keys.W.isDown){
    player.y -= 3    
  }

  if(cursors.down.isDown || keys.S.isDown){
    player.y += 3
  }
  player.x = Phaser.Math.Clamp(player.x, 0, this.cameras.main.width);
  player.y = Phaser.Math.Clamp(player.y, 0, this.cameras.main.height);
let distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  computer.x,
  computer.y
);

if(distance < 100){

  if(!interacted){
    interactText.setText("Press E to Interact");
  }

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    interacted = true;
  aboutPanel.setVisible(true);
  aboutText.setVisible(true);
  }
}
else{
  interactText.setText("");
  interacted = false;
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