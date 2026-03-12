let player;
let cursors;
let keys;
let desk;
let interactText;
let interactKey ;
let interacted = false;
let aboutPanel;
let aboutText;
let room;
let closeKey;
let closehint;

const marginX = 80;
const marginTop = 80;
const marginBottom = 170;

// hi---------------------------------------------------------------------------------

function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("room", "assets/room.png");

}

// hi---------------------------------------------------------------------------------

function create() {
  
 room = this.add.image(0, 0, "room");
room.setOrigin(0);

  this.cameras.main.setBounds(0, 0, room.width, room.height);

  player = this.add.sprite(480,400,"player");
  player.setScale(0.1);

  this.cameras.main.startFollow(player);

desk = {
  x: 200,
  y: 250
};
  
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  interactKey = this.input.keyboard.addKey("E");
  closeKey = this.input.keyboard.addKey("ESC");
interactText = this.add.text(desk.x, desk.y - 80, "", {
  fontSize: "32px",
  fill: "#ffffff",   
  backgroundColor: "#6e6a6a"
});

interactText.setOrigin(0.5);

aboutPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  300,
  0x000000,
  0.8
);

aboutPanel.setVisible(false);

aboutText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Hi, I'm Ravi 👋\n\nI build interactive projects\nand love coding.",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);


closeHint = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 100,
  "Press ESC to close",
  {
    fontSize: "20px",
    fill: "#aaaaaa"
  }
);

closeHint.setOrigin(0.5);
closeHint.setVisible(false);
closeHint.setScrollFactor(0);

aboutText.setOrigin(0.5);
aboutText.setVisible(false);
aboutPanel.setScrollFactor(0);
aboutText.setScrollFactor(0);

};



// hi ---------------------------------------------------------------------------------

function update(){
  if(aboutPanel.visible){

  if(Phaser.Input.Keyboard.JustDown(closeKey)){
    aboutPanel.setVisible(false);
    aboutText.setVisible(false);
    closeHint.setVisible(false);
    interacted = false;
  }

  return;
}

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


player.x = Phaser.Math.Clamp(player.x, marginX, room.width - marginX);
player.y = Phaser.Math.Clamp(player.y, marginTop, room.height - marginBottom);


let distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  desk.x,
  desk.y
);

interactText.setPosition(desk.x, desk.y - 80);




if(distance < 100){

  if(!interacted){
    interactText.setText("Press E to Interact");
  }

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    interacted = true;
  aboutPanel.setVisible(true);
  aboutText.setVisible(true);
  closeHint.setVisible(true);
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
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#0f172a",
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}



const game = new Phaser.Game(config);