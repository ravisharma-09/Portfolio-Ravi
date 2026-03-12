let player;
let cursors;
let keys;
let desk;
let interactText;
let interactKey ;
let interacted = false;
let aboutPanel;    // desk interaction panel
let aboutText;  //  desk interaction text
let room;
let closeKey;      
let closeHint;  // closing with esc
let photoFrame;
let projectPanel; // for photo frame interaction
let projectText; // for photo frame interaction
const deskRange = 80;
const projectRange = 60;

const marginX = 80;
const marginTop = 80;
const marginBottom = 170;






class StartScene extends Phaser.Scene {
  constructor(){
    super("StartScene");
  }

  create(){

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      "Ravi Sharma Portfolio",
      {
        fontSize: "48px",
        fill: "#ffffff"
      }
    ).setOrigin(0.5);

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 20,
      "Press ENTER to Start",
      {
        fontSize: "24px",
        fill: "#aaaaaa"
      }
    ).setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("GameScene");
    });

  }
}




class GameScene extends Phaser.Scene {

constructor(){
  super("GameScene");
}




// hi---------------------------------------------------------------------------------

preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("room", "assets/room.png");

}

// hi---------------------------------------------------------------------------------

 create() {
  
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
photoFrame = {
  x: 780,
  y: 160
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
// about 
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


//for photo 
projectPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  300,
  0x000000,
  0.8
);

projectPanel.setVisible(false);
projectPanel.setScrollFactor(0);

projectText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Projects:  \n\n Portfolio Game  \n More coming soon!!!...\n\n😎",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);

projectText.setOrigin(0.5);
projectText.setVisible(false);
projectText.setScrollFactor(0);

// close hint
closeHint = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 100,
  "Press ESC to close",
  {
    fontSize: "25px",
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

 update(){
  if(aboutPanel.visible || projectPanel.visible){

  if(Phaser.Input.Keyboard.JustDown(closeKey)){
    aboutPanel.setVisible(false);
    aboutText.setVisible(false);

    projectPanel.setVisible(false);
    projectText.setVisible(false);

    closeHint.setVisible(false);

    interacted = false;
  }

  return;
}



   if(cursors.left.isDown || keys.A.isDown){
    player.x -= 3.5
  }

  if(cursors.right.isDown || keys.D.isDown){
    player.x += 3.5
  }

  if(cursors.up.isDown || keys.W.isDown){
    player.y -= 3.5    
  }

  if(cursors.down.isDown || keys.S.isDown){
    player.y += 3.5
  }


player.x = Phaser.Math.Clamp(player.x, marginX, room.width - marginX);
player.y = Phaser.Math.Clamp(player.y, marginTop, room.height - marginBottom);


let distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  desk.x,
  desk.y
);

let projectDistance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  photoFrame.x,
  photoFrame.y
);


interactText.setPosition(desk.x, desk.y - 100);



interactText.setText("");

if(distance < deskRange){

  interactText.setPosition(desk.x, desk.y - 100);
  interactText.setText("Press E to Interact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    aboutPanel.setVisible(true);
    aboutText.setVisible(true);
    closeHint.setVisible(true);
  }

}

else if(projectDistance < projectRange){

  interactText.setPosition(photoFrame.x + 60, photoFrame.y - 90);
  interactText.setText("Press E to view projects");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    projectPanel.setVisible(true);
    projectText.setVisible(true);
    closeHint.setVisible(true);
  }

}

}}
// hi ---------------------------------------------------------------------------------

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#0f172a",
  scene: [StartScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}



const game = new Phaser.Game(config);
