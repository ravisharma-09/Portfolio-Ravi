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
let trophyShelf ; // for trophy 
let achievementPanel; // trophy interaction panel
let achievementText; // text inside trophy interaction panel
let bookshelf;
let skillsPanel;
let skillsText;
let mailbox;
let contactPanel;   
let contactText;    // 
const deskRange = 70;
const projectRange = 60;
const trophyRange = 85;
const skillsRange = 85;
const marginX = 80;
const marginTop = 80;
const marginBottom = 170;
const mailRange = 90;

let door;
const doorRange = 105;

let doorPanel;
let doorText;


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
        fontSize: "55px",
        fill: "#ffffff"
      }
    ).setOrigin(0.5);

  let startText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 20,
  "[ Press <_ENTER_> to Start ▶️ ]",
  {
    fontSize: "30px",
    fill: "#aaaaaa"
  }
).setOrigin(0.5);
this.tweens.add({
  targets: startText,
  alpha: 0,
  duration: 400,
  yoyo: true,
  repeat: -1
});
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

  this.cameras.main.startFollow(player, true, 0.08, 0.08);
  this.cameras.main.centerOn(room.width / 2, room.height / 2);

desk = {
  x: 180,
  y: 220
};
photoFrame = {
  x: 790,
  y: 160
};
trophyShelf = {
  x: 600,
  y: 130
};
bookshelf = {
  x: 1360,
  y: 260
};
mailbox = {
  x: 1340,
  y: 650
};
door = {
  x:1130,
  y: 230
};
  
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  interactKey = this.input.keyboard.addKey("E");
  closeKey = this.input.keyboard.addKey("ESC");
  this.key1 = this.input.keyboard.addKey("ONE");
this.key2 = this.input.keyboard.addKey("TWO");
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

achievementPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  300,
  0x000000,
  0.8
);

achievementPanel.setVisible(false);
achievementPanel.setScrollFactor(0);

achievementText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Achievements\n\n🏆 Hack Club Builder\n🏆 Portfolio Game Created\n🏆 Community Contributor",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);

achievementText.setOrigin(0.5);
achievementText.setVisible(false);
achievementText.setScrollFactor(0);

skillsPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  600,
  300,
  0x000000,
  0.8
);

skillsPanel.setVisible(false);
skillsPanel.setScrollFactor(0);

skillsText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Skills:\nJavaScript\nHTML\nCSS\nPhaser.js\nGit\nPython",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);

skillsText.setOrigin(0.5);
skillsText.setVisible(false);
skillsText.setScrollFactor(0);

contactPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  300,
  0x000000,
  0.8
);

contactPanel.setVisible(false);
contactPanel.setScrollFactor(0);

contactText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Contact\n\n📧 rravisharma817@gmail.com",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  }
);


contactText.setOrigin(0.5);
contactText.setVisible(false);
contactText.setScrollFactor(0);


doorPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  300,
  0x000000,
  0.8
); 
doorPanel.setVisible(false);
doorPanel.setScrollFactor(0);   
doorText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
  "Door🚪\n\n1 Exit Portfolio\n\n2 Play Mini Game",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center"
  } );
  doorText.setOrigin(0.5);
  doorText.setVisible(false);
  doorText.setScrollFactor(0);
  doorText.setDepth(1);







// close hint
closeHint = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 125,
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

if(aboutPanel.visible || projectPanel.visible || achievementPanel.visible || skillsPanel.visible || contactPanel.visible || doorPanel.visible){
  interactText.setVisible(false);
  if(Phaser.Input.Keyboard.JustDown(closeKey)){
    aboutPanel.setVisible(false);
    aboutText.setVisible(false);
    achievementPanel.setVisible(false);
    achievementText.setVisible(false);
    projectPanel.setVisible(false);
    projectText.setVisible(false);
    skillsPanel.setVisible(false);
    skillsText.setVisible(false);
    contactPanel.setVisible(false);
    contactText.setVisible(false);
    doorPanel.setVisible(false);
    doorText.setVisible(false);
    closeHint.setVisible(false);
    
    interacted = false;
  }

  return;
}
if(doorPanel.visible){
  interactText.setVisible(false);
  if(Phaser.Input.Keyboard.JustDown(this.key1)){
    this.scene.start("StartScene");
  }

  if(Phaser.Input.Keyboard.JustDown(this.key2)){
    this.scene.start("MiniGameScene");
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

let distance = Phaser.Math.Distance.Between(player.x,player.y,desk.x,desk.y);
let projectDistance = Phaser.Math.Distance.Between(player.x,player.y,photoFrame.x,photoFrame.y);
let trophyDistance = Phaser.Math.Distance.Between(player.x,player.y,trophyShelf.x,trophyShelf.y);
let skillsDistance = Phaser.Math.Distance.Between(player.x,player.y,bookshelf.x,bookshelf.y);

let mailDistance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  mailbox.x,
  mailbox.y);

let doorDistance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  door.x,
  door.y
);
interactText.setVisible(false);

if(distance < deskRange){
  interactText.setVisible(true);
  interactText.setPosition(desk.x+30, desk.y - 80);
  interactText.setText("Press E to Interact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    aboutPanel.setVisible(true);
    aboutText.setVisible(true);
    closeHint.setVisible(true);
  }

}
else if(trophyDistance < trophyRange){
  interactText.setVisible(true);
  interactText.setPosition(trophyShelf.x, trophyShelf.y - 90);
  interactText.setText("Press E to view achievements");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    achievementPanel.setVisible(true);
    achievementText.setVisible(true);
    closeHint.setVisible(true);
  }

}
else if(projectDistance < projectRange){
  interactText.setVisible(true);
  interactText.setPosition(photoFrame.x + 60, photoFrame.y - 120);
  interactText.setText("Press E to view projects");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    projectPanel.setVisible(true);
    projectText.setVisible(true);
    closeHint.setVisible(true);
  }
}
else if(skillsDistance < skillsRange){
  interactText.setVisible(true);
  interactText.setPosition(bookshelf.x - 70, bookshelf.y - 220);
  interactText.setText("Press E to view skills");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    skillsPanel.setVisible(true);
    skillsText.setVisible(true);
    closeHint.setVisible(true);
  }

}
else if(mailDistance < mailRange){
  interactText.setVisible(true);
  interactText.setPosition(mailbox.x, mailbox.y - 140);
  interactText.setText("Press E to contact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    contactPanel.setVisible(true);
    contactText.setVisible(true);
    closeHint.setVisible(true);
  }
}
else if(doorDistance < doorRange){

  interactText.setVisible(true);
  interactText.setPosition(door.x, door.y - 200);
  interactText.setText("Press E to use door");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    doorPanel.setVisible(true);
    doorText.setVisible(true);
    closeHint.setVisible(true);
  }

}
}}



class MiniGameScene extends Phaser.Scene {
  constructor(){
    super("MiniGameScene");
  }
  create(){
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Mini Game Coming Soon!!!\n\nStay Tuned 😎",
      {
        fontSize: "50px",
        fill: "#ffffff",
      }
    ).setOrigin(0.5);
   
      this.escKey = this.input.keyboard.addKey("ESC");








  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  transparent: true,
  scene: [StartScene, GameScene, MiniGameScene],
  scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH
}
}

const game = new Phaser.Game(config);