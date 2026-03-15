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
let contactText;    
let terminalContainer;
let terminalLogs = [];
let terminalMaxLogs = 6;
let typingSpeed = 60 ;
let typingEvent = null;
let terminalQueue = [];
let isTyping = false;
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
        fill: "#ffffff",
        backgroundColor : "black",
      }
    ).setOrigin(0.5);

  let startText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 20,
  "[ Press <_ENTER_> to Start ▶️ ]",
  {
    fontSize: "30px",
    fill: "red",
    backgroundColor : "rgba(0, 0, 0, 0.9)",
  }
).setOrigin(0.5);
this.tweens.add({
  targets: startText,
  alpha: 0,
  duration: 700,
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
  this.load.image("profile", "assets/profile.png");
}

// hi---------------------------------------------------------------------------------

 create() {
  
 room = this.add.image(0, 0, "room");
room.setOrigin(0);
this.cameras.main.fadeIn(600, 0, 0, 0);
this.cameras.main.setZoom(1.2);
this.tweens.add({
  targets: this.cameras.main,
  zoom: 1,
  duration: 800,
  ease: "Sine.easeOut"
});
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
this.tweens.add({
  targets: interactText,
  y: "+=6",
  duration: 700,
  yoyo: true,
  repeat: -1,
  ease: "Sine.easeInOut"
});

interactText.setOrigin(0.5);

// about 
aboutPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  550,
  500,
  0x000000,
  0.65
);

aboutPanel.setVisible(false);
aboutText = this.add.text(
  this.scale.width / 2 - 80,
  this.scale.height / 2 - 10
  ,
  "👋 Hi, I'm Ravi Sharma\n\n" +
  "18-year-old developer\n\n" +
  "ABOUT\n" +
  "I enjoy building interactive projects\n" +
  "and experimenting with JavaScript.\n\n" +
  "INTERESTS\n" +
  "• Coding\n" +
  "• Game Development\n" +
  "• Sleeping (professional level 😴)\n\n" +
  "HOBBIES\n" +
  "• Swimming 🏊\n" +
  "• Gaming\n" +
  "• Learning new tech",
  {
    fontSize: "22px",
    fill: "#ffffff",
    align: "left",
    wordWrap: { width: 380 }
  }
);

aboutText.setOrigin(0.5);
aboutText.setVisible(false);

this.profileImage = this.add.image(
   this.scale.width / 2 + 170,
  this.scale.height / 2 - 60,
  "profile"
);


this.profileImage.setScale(0.17);
this.profileImage.setVisible(false);
this.profileImage.setScrollFactor(0);
this.profileImage.setDepth(8);

projectPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  500,
  350,
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
  400,
  0x000000,
  0.8
);

skillsPanel.setVisible(false);
skillsPanel.setScrollFactor(0);

skillsText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2.3
  ,
  "Skills:\n\nJavaScript\n\nHTML,CSS\n\nPhaser.js\n\nPython,c++",
  {
    fontSize: "28px",
    fill: "#ffffff",
    align: "center",
    

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
  aboutPanel.setDepth(6);
projectPanel.setDepth(6);
achievementPanel.setDepth(6);
skillsPanel.setDepth(6);
contactPanel.setDepth(6);
doorPanel.setDepth(6);

aboutText.setDepth(7);
projectText.setDepth(7);
achievementText.setDepth(7);
skillsText.setDepth(7);
contactText.setDepth(7);
doorText.setDepth(7);


this.panelOverlay = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  this.scale.width,
  this.scale.height,
  0x000000,
  0
);
this.panelOverlay.setScrollFactor(0);
this.panelOverlay.setDepth(5);
this.panelOverlay.setVisible(false);






closeHint = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 -300,
  "Press ESC to close",
  {
    fontSize: "25px",
    fill: "white",
    backgroundColor :"gray"
  }

);

closeHint.setOrigin(0.5);
closeHint.setVisible(false);
closeHint.setScrollFactor(0);

aboutText.setOrigin(0.5);
aboutText.setVisible(false);
aboutPanel.setScrollFactor(0);
aboutText.setScrollFactor(0);

closeHint.setDepth(7);
terminalLogs = [];
terminalQueue = [];
isTyping = false;



terminalContainer = this.add.container(20, this.scale.height - 150);
terminalContainer.setScrollFactor(0);
terminalContainer.setDepth(10);

let bg = this.add.rectangle(
  0,
  0,
  520,
  140,
  0x000000,
  0.7
).setOrigin(0);

terminalContainer.add(bg);



const startupLogs = [
  "System booting...",
  "Entering portfolio room...",
  "Use WASD or Arrow keys to move",
  
];

startupLogs.forEach(msg => this.addTerminalMessage(msg));


this.cameras.main.setZoom(1.05);

this.cameras.main.fadeIn(500);

this.tweens.add({
  targets: this.cameras.main,
  zoom: 1,
  duration: 600,
  ease: "Sine.easeOut"
});

};
addTerminalMessage(message){

  terminalQueue.push(message);

  if(!isTyping){
    this.processTerminalQueue();
  }

}
processTerminalQueue(){

  if(terminalQueue.length === 0){
    isTyping = false;
    return;
  }

  isTyping = true;

  let message = terminalQueue.shift();
  let time = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
  message = "[" + time + "] " + message;

  for(let l of terminalLogs){
    l.y -= 22;
  }

  let log = this.add.text(
    10,
    110,
    "",
    {
      fontSize: "18px",
      fill: "#00ff88"
    }
  );

  terminalContainer.add(log);
  terminalLogs.push(log);

  let index = 0;

  this.time.addEvent({
    delay: typingSpeed,
    repeat: message.length - 1,
    callback: () => {

    log.text = message.slice(0, index) + "_";
      index++;

      if(index === message.length){
         log.text =  message;
        this.processTerminalQueue();
      }

    }
  });

  if(terminalLogs.length > terminalMaxLogs){
    let old = terminalLogs.shift();
    old.destroy();
  }

}
transitionTo(sceneKey){

  let fade = this.add.rectangle(
    this.scale.width / 2,
    this.scale.height / 2,
    this.scale.width,
    this.scale.height,
    0x000000
  ).setScrollFactor(0).setDepth(20);

  fade.setAlpha(0);


  this.tweens.add({
    targets: this.cameras.main,
    zoom: 1.05,
    duration: 200,
    ease: "Sine.easeInOut"
  });


  this.tweens.add({
    targets: fade,
    alpha: 1,
    duration: 350,
    delay: 100,
    onComplete: () => {
      this.scene.start(sceneKey);
    }
  });

}



// hi ---------------------------------------------------------------------------------

update(){

if(aboutPanel.visible || projectPanel.visible || achievementPanel.visible || skillsPanel.visible || contactPanel.visible ){
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
    this.profileImage.setVisible(false);
    terminalContainer.setVisible(true);
    this.tweens.add({
      targets: this.panelOverlay,
      alpha: 0,
      duration: 150,
    onComplete: () => {
  this.panelOverlay.setVisible(false);}
});
    
    interacted = false;
  }

  return;
}
if(doorPanel.visible){
  interactText.setVisible(false);

  if(Phaser.Input.Keyboard.JustDown(closeKey)){
    doorPanel.setVisible(false);
    doorText.setVisible(false);
    closeHint.setVisible(false);
  }
if(Phaser.Input.Keyboard.JustDown(this.key1)){
  this.transitionTo("StartScene");
}

if(Phaser.Input.Keyboard.JustDown(this.key2)){
  this.transitionTo("MiniGameScene");
}

  return;
}
let speed = 400;
let delta = this.game.loop.delta / 1000;

if(cursors.left.isDown || keys.A.isDown){
  player.x -= speed * delta;
}

if(cursors.right.isDown || keys.D.isDown){

  player.x += speed * delta;
}

if(cursors.up.isDown || keys.W.isDown){
  player.y -= speed * delta;
}

if(cursors.down.isDown || keys.S.isDown){
  player.y += speed * delta;
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
   this.panelOverlay.setVisible(true);

this.tweens.add({
  targets: this.panelOverlay,
  alpha: 0.75,
  duration: 200
});
aboutPanel.setScale(0.85);
aboutPanel.setAlpha(0);
aboutPanel.setVisible(true);


aboutText.setAlpha(0);
aboutText.setVisible(true);
this.profileImage.setVisible(true);
terminalContainer.setVisible(false);
this.tweens.add({
  targets: [aboutPanel, aboutText],
  scale: 1,
  alpha: 1,
  duration: 700,
  ease: "Back.out"
});
closeHint.setVisible(true);
    this.addTerminalMessage("System:Opening about panel...");
  }

}
else if(trophyDistance < trophyRange){
  interactText.setVisible(true);
  interactText.setPosition(trophyShelf.x, trophyShelf.y - 90);
  interactText.setText("Press E to view achievements");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){

  this.panelOverlay.setVisible(true);

  this.tweens.add({
    targets: this.panelOverlay,
    alpha: 0.75,
    duration: 200
  });

  achievementPanel.setScale(0.85);
  achievementPanel.setAlpha(0);
  achievementPanel.setVisible(true);

  achievementText.setAlpha(0);
  achievementText.setVisible(true);

  this.tweens.add({
    targets: [achievementPanel, achievementText],
    scale: 1,
    alpha: 1,
    duration: 600,
    ease: "Back.out"
  });

  closeHint.setVisible(true);

  this.addTerminalMessage("System:Opening achievements");

}

}
else if(projectDistance < projectRange){
  interactText.setVisible(true);
  interactText.setPosition(photoFrame.x + 60, photoFrame.y - 120);
  interactText.setText("Press E to view projects");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){

  this.panelOverlay.setVisible(true);

  this.tweens.add({
    targets: this.panelOverlay,
    alpha: 0.75,
    duration: 200
  });

  projectPanel.setScale(0.85);
  projectPanel.setAlpha(0);
  projectPanel.setVisible(true);

  projectText.setAlpha(0);
  projectText.setVisible(true);

  this.tweens.add({
    targets: [projectPanel, projectText],
    scale: 1,
    alpha: 1,
    duration: 600,
    ease: "Back.out"
  });

  closeHint.setVisible(true);

  this.addTerminalMessage("System:Opening projects panel...");

}
}
else if(skillsDistance < skillsRange){
  interactText.setVisible(true);
  interactText.setPosition(bookshelf.x - 70, bookshelf.y - 220);
  interactText.setText("Press E to view skills");

 if(Phaser.Input.Keyboard.JustDown(interactKey)){

  this.panelOverlay.setVisible(true);

  this.tweens.add({
    targets: this.panelOverlay,
    alpha: 0.75,
    duration: 200
  });

  skillsPanel.setScale(0.85);
  skillsPanel.setAlpha(0);
  skillsPanel.setVisible(true);

  skillsText.setAlpha(0);
  skillsText.setVisible(true);

  this.tweens.add({
    targets: [skillsPanel, skillsText],
    scale: 1,
    alpha: 1,
    duration: 600,
    ease: "Back.out"
  });

  closeHint.setVisible(true);

  this.addTerminalMessage("System:Viewing Skills...");

}

}
else if(mailDistance < mailRange){
  interactText.setVisible(true);
  interactText.setPosition(mailbox.x, mailbox.y - 140);
  interactText.setText("Press E to contact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){

  this.panelOverlay.setVisible(true);

  this.tweens.add({
    targets: this.panelOverlay,
    alpha: 0.75,
    duration: 200
  });

  contactPanel.setScale(0.85);
  contactPanel.setAlpha(0);
  contactPanel.setVisible(true);

  contactText.setAlpha(0);
  contactText.setVisible(true);

  this.tweens.add({
    targets: [contactPanel, contactText],
    scale: 1,
    alpha: 1,
    duration: 600,
    ease: "Back.out"
  });

  closeHint.setVisible(true);

  this.addTerminalMessage("System:Opening contact Info");

}
}
else if(doorDistance < doorRange){

  interactText.setVisible(true);
  interactText.setPosition(door.x, door.y - 200);
  interactText.setText("Press E to use door");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    this.panelOverlay.setVisible(true);

    this.tweens.add({
      targets: this.panelOverlay,
      alpha:0.75,
      duration:200
    });

    doorPanel.setScale(0.85);
    doorPanel.setAlpha(0);
    doorPanel.setVisible(true);

    doorText.setAlpha(0);
    doorText.setVisible(true);

    this.tweens.add({
      targets: [doorPanel, doorText],
      scale: 1,
      alpha: 1 ,
      duration: 600,
      ease: "Back.out"
    })
    closeHint.setVisible(true);
      this.addTerminalMessage("System:Using door...");
  }

}
}}



class MiniGameScene extends Phaser.Scene {
  constructor(){
    super("MiniGameScene");
  }
  create(){
    this.difficultySelected = false;
    this.realCoinsCount = 0;
    this.fakeCoinsCount = 0;
    this.infoText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2,
 "Collect yellow coins.\n\n Some coins are fake.('dont be greedy')\nYes they look identical.\n\nGood luck.\n\n1 Easy🫢  2 Medium😎  3 Hard🫡",
  {
    fontSize: "32px",
    fill: "#0fc236",
    align: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)"
  }
).setOrigin(0.5);
this.add.text(
  this.scale.width / 2,
  100,
  "Press ESC to return to portfolio",
  {
    fontSize: "20px",
    fill: "#aaaaaa"
  }
).setOrigin(0.5);
      this.key1 = this.input.keyboard.addKey("ONE");
this.key2 = this.input.keyboard.addKey("TWO");
this.key3 = this.input.keyboard.addKey("THREE");
   

   
  this.escKey = this.input.keyboard.addKey("ESC");
  this.input.keyboard.on("keydown-ESC", () => {
this.cameras.main.fadeOut(400);

this.time.delayedCall(400, () => {
  this.scene.start("GameScene");
});    });
 this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
    this.player.setVisible(false);
   this.restartKey = this.input.keyboard.addKey("R");

   
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
fontSize: "24px",
fill: "#ffffff",
backgroundColor: "rgba(0, 0, 0, 1)"
});
this.gameOver = false;

this.scoreText.setShadow(0, 0, "#00ffff", 12, true, true);

  }
  startGame(){
    this.player.setVisible(true);

  this.difficultySelected = true;

  this.infoText.setText("");

  this.coins = [];
  for(let i = 0; i < this.realCoinsCount; i++){

  let coin = this.add.circle(
    Phaser.Math.Between(100,1180),
    Phaser.Math.Between(100,620),
    12,
    0xffff00
  );

  coin.collected = false;

  this.coins.push(coin);

  this.tweens.add({
    targets: coin,
    y: coin.y - 10,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

}
  this.fakeCoins = [];
for(let i = 0; i < this.fakeCoinsCount; i++){

  let fake = this.add.circle(
    Phaser.Math.Between(100,1180),
    Phaser.Math.Between(100,620),
    12,
    0xffff00
  );

  this.fakeCoins.push(fake);

  this.tweens.add({
    targets: fake,
    y: fake.y - 10,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

}

}


 update(){ /////////////////////////////////////////////////////////////////////
  if(!this.difficultySelected){

  if(Phaser.Input.Keyboard.JustDown(this.key1)){
    this.realCoinsCount = 8;
    this.fakeCoinsCount = 2;
    this.startGame();
  }

  if(Phaser.Input.Keyboard.JustDown(this.key2)){
    this.realCoinsCount = 6;
    this.fakeCoinsCount = 4;
    this.startGame();
  }

  if(Phaser.Input.Keyboard.JustDown(this.key3)){
    this.realCoinsCount = 4;
    this.fakeCoinsCount = 6;
    this.startGame();
  }

  return;
}
if(this.gameOver){

  if(Phaser.Input.Keyboard.JustDown(this.restartKey)){
    this.scene.restart();
  }
  return;
}
 let speed = 300;
let delta = this.game.loop.delta / 1000;

if(this.cursors.left.isDown || this.keys.A.isDown){
  this.player.x -= speed * delta;
}

if(this.cursors.right.isDown || this.keys.D.isDown){
  this.player.x += speed * delta;
}

if(this.cursors.up.isDown || this.keys.W.isDown){
  this.player.y -= speed * delta;
}

if(this.cursors.down.isDown || this.keys.S.isDown){
  this.player.y += speed * delta;
}


for(let coin of this.coins){

  let distance = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    coin.x,
    coin.y
  );if(distance < 30 && !coin.collected){

  coin.collected = true;

  this.tweens.add({
    targets: coin,
    scale: 1.8,
    duration: 80,
    yoyo: true,
    onComplete: () => {

      this.score += 1;
      this.scoreText.setText("Score: " + this.score);

      let plusText = this.add.text(
        coin.x,
        coin.y,
        "+1",
        {
          fontSize: "28px",
          fill: "#ffff00"
        }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: plusText,
        y: coin.y - 50,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          plusText.destroy();
        }
      });

      for(let c of this.coins){

  do{
    c.x = Phaser.Math.Between(100,1180);
    c.y = Phaser.Math.Between(100,620);
  }
  while(
    Phaser.Math.Distance.Between(
      c.x,
      c.y,
      this.player.x,
      this.player.y
    ) < 120
  );

}

for(let f of this.fakeCoins){

  do{
    f.x = Phaser.Math.Between(100,1180);
    f.y = Phaser.Math.Between(100,620);
  }
  while(
    Phaser.Math.Distance.Between(
      f.x,
      f.y,
      this.player.x,
      this.player.y
    ) < 120
  );

}

      coin.setScale(1);
      coin.setAlpha(1);
      coin.collected = false;

    }
  });



}
}

for(let fake of this.fakeCoins){

let fakeDistance = Phaser.Math.Distance.Between(
  this.player.x,
  this.player.y,
  fake.x,
  fake.y
);

if(fakeDistance < 30 && !this.gameOver){

  this.gameOver = true;
  for(let coin of this.coins){
  coin.setVisible(false);
}

for(let fake of this.fakeCoins){
  fake.setVisible(false);
}

  let gameOverText = this.add.text(
    this.scale.width / 2,
    this.scale.height / 2,
    "GAME OVER",
    {
      fontSize: "60px",
      fill: "#ff0000"
    }
  ).setOrigin(0.5);
  this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 80,
  "Press R to Restart",
  {
    fontSize: "24px",
    fill: "#ffffff"
  }
).setOrigin(0.5);

  this.tweens.add({
    targets: gameOverText,
    alpha: 0,
    duration: 500,
    yoyo: true,
    repeat: -1
  });

  this.player.setVisible(false);
}
 this.player.x = Phaser.Math.Clamp(this.player.x, 20, 1260);
this.player.y = Phaser.Math.Clamp(this.player.y, 20, 700);
  }
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
