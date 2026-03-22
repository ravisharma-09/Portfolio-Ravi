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
let isPanelOpen = false;
let nearObject = false ;
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
let typingSpeed = 40 ;
let typingEvent = null;
let terminalQueue = [];
let isTyping = false;
let projectCards = [];
let selectedProject = 0;

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
let projects = [
  {
    title: "Tip Calculator",
    image: "tip.png",
    demo: "https://tip-calculator-omega-two.vercel.app/",
    repo: "https://github.com/ravisharma-09/tip-calculator",
    desc: "A simple and responsive Tip Calculator built using HTML, CSS, and JavaScript Enter your bill amount and tip percentage, and get the tip value and total amount instantly. Designed for easy use on both desktop and mobile screens. Perfect for learning DOM manipulation and basic UI with frontend technologies."
  },
  {
    title: "Stone Paper Scissor",
    image: "stone.png",
    demo: "https://stone-paper-nine.vercel.app/",
    repo: "https://github.com/ravisharma-09/stone-paper",
    desc: "Stone-Paper Scissor is a fun beginner-level web game built with HTML, CSS, and JavaScript. It lets you play Rock-Paper-Scissors against the computer, showing emoji animations and the win/tie/lose result instantly. This project is great for learning DOM interaction and basic game logic in JavaScript"
  },
  {
    title: "Portfolio Ravi",
    image: "portfolio.png",
    demo: "https://sharmaravi.in",
    repo: "https://github.com/ravisharma-09/Portfolio-Ravi",
    desc: "Portfolio web game based you see this here only"
  },
  {
    title: "Weight Converter",
    image: "weight.png",
    demo: "https://weight-converter-nine.vercel.app/",
    repo: "https://github.com/ravisharma-09/weight-converter",
    desc: "This is a simple web project that converts pounds to kilograms. The user enters weight in pounds and the result in kilograms appears instantly."
  },
  {
    title: "Height Converter",
    image: "height.png",
    demo: "https://height-converter.vercel.app",
    repo: "https://github.com/ravisharma-09/height-converter",
    desc: "Height Converter is a simple web app that converts height from feet and inches into centimeters. It is built using HTML, CSS and JavaScript and helps users quickly calculate their height in different units."
  },
  {
    title: "Linkipin",
    image: "linkipin.png",
    demo: "https://linkipin.vercel.app/",
    repo: "https://github.com/ravisharma-09/linkipin",
    desc: "only ui based connection social media ui made to show how interactive social media shoul look"
  }
];

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
  for (let project of projects){
    this.load.image(
      project.title,
      "assets/projects/" + project.image
    );
  }
  this.load.audio("click", "assets/sounds/click.mp3");
  this.load.audio("hover", "assets/sounds/hover.mp3");
  this.load.audio("close", "assets/sounds/close.mp3");
  this.load.audio("notify", "assets/sounds/notify.mp3");
  this.load.audio("bg", "assets/sounds/bg.mp3");
  this.load.audio("type", "assets/sounds/type.mp3");
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

//soundsss
this.moveSoundCooldown = 0;
this.sounds ={
  click: this.sound.add("click", { volume: 0.2}),
  hover: this.sound.add("hover", { volume: 0.03 }),
  close: this.sound.add("close", { volume: 0.09 }),
  notify: this.sound.add("notify", { volume:0.03}),
  type: this.sound.add("type", { volume: 0.01 }),
};
this.bgMusic = this.sound.add("bg", { volume: 0.06, loop: true });
if(!this.bgMusic.isPlaying){
  this.bgMusic.play();
}
this.musicOn = true ;
this.speakerBtn = this.add.text(
  this.scale.width-30,
  30,
  "🔊",
  {fontSize: "50px"}
).setOrigin(1,0).setScrollFactor(0).setDepth(10).setInteractive({useHandCursor : true})
.on("pointerdown", () => {
  this.musicOn = !this.musicOn;
  if(this.musicOn){
    this.bgMusic.resume();
    this.speakerBtn.setText("🔊")
  }
  else{
    this.bgMusic.pause();
    this.speakerBtn.setText("🔇");
  }
});

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
  this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
 
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
  this.scale.height / 2-40,
  400,
  350,
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
achievementPanel.setDepth(6);
skillsPanel.setDepth(6);
contactPanel.setDepth(6);
doorPanel.setDepth(6);

aboutText.setDepth(7);
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
aboutPanel.setVisible(false);
achievementPanel.setVisible(false);
skillsPanel.setVisible(false);
contactPanel.setVisible(false);

} 


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
      if(index % 3 === 0) this.sounds.type.play();
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
  
if(isPanelOpen){

 if(Phaser.Input.Keyboard.JustDown(closeKey)){
  this.sounds.close.play();
  isPanelOpen = false;
  closeHint.setVisible(false);
  this.time.delayedCall(80, () => {
    aboutPanel.setVisible(false);
    aboutText.setVisible(false);
    achievementPanel.setVisible(false);
    achievementText.setVisible(false);
    skillsPanel.setVisible(false);
    skillsText.setVisible(false);
    contactPanel.setVisible(false);
    contactText.setVisible(false);
    doorPanel.setVisible(false);
    doorText.setVisible(false);
    closeHint.setVisible(false);
    this.profileImage.setVisible(false);
    terminalContainer.setVisible(true);
    interacted = false;
    this.tweens.add({
      targets: this.panelOverlay,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.panelOverlay.setVisible(false);
      }
    });
  });
 }interactText.setVisible(false);
 return;
}



if(doorPanel.visible){


interactText.setVisible(false);


  if(Phaser.Input.Keyboard.JustDown(closeKey)){
    this.sounds.close.play();
    doorPanel.setVisible(false);
    doorText.setVisible(false);
    closeHint.setVisible(false);
    this.panelOverlay.setVisible(false);
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
  player.setFlipX(true);
}

if(cursors.right.isDown || keys.D.isDown){

  player.x += speed * delta;
    player.setFlipX(false);

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
let wasNear = nearObject;
nearObject = false;
if(distance < deskRange){
  nearObject = true ;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(desk.x+30, desk.y - 80);
  interactText.setText("Press E to Interact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    this.sounds.click.play();

    isPanelOpen = true;
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
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(trophyShelf.x, trophyShelf.y - 90);
  interactText.setText("Press E to view achievements");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    this.sounds.click.play();

isPanelOpen = true;
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
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(photoFrame.x + 60, photoFrame.y - 120);
  interactText.setText("Press E to view projects");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
this.sounds.click.play();
  this.panelOverlay.setVisible(true);

  this.tweens.add({
    targets: this.panelOverlay,
    alpha: 0.75,
    duration: 200
  });
this.transitionTo("ProjectScene");

  

  closeHint.setVisible(true);

  this.addTerminalMessage("System:Opening projects panel...");

}
}
else if(skillsDistance < skillsRange){
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(bookshelf.x - 70, bookshelf.y - 220);
  interactText.setText("Press E to view skills");

 if(Phaser.Input.Keyboard.JustDown(interactKey)){
  this.sounds.click.play();

  isPanelOpen = true;
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
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(mailbox.x, mailbox.y - 140);
  interactText.setText("Press E to contact");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    this.sounds.click.play();

    isPanelOpen = true;
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
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(door.x, door.y - 200);
  interactText.setText("Press E to use door");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){

    this.sounds.click.play();
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

class ProjectScene extends Phaser.Scene {
  constructor(){
    super("ProjectScene");
  }

  init(data){
    this.selectedProject = data?.index || 0 ;

  }

  preload() {
  for (let project of projects){
    this.load.image(project.title, "assets/projects/" + project.image);
  }
  this.load.audio("click", "assets/sounds/click.mp3");
  this.load.audio("close", "assets/sounds/close.mp3");
  this.load.audio("notify", "assets/sounds/notify.mp3");

}

create(){
  this.targetScrollY = 0;
  this.scrollY = 0;
this.scrollSpeed = 5;
    this.mode = "grid"; 

    this.sounds = {
      click: this.sound.add("click", { volume: 0.5}),
      close: this.sound.add("close", {volume: 0.4 }),
      notify: this.sound.add("notify", { volume: 0.3}),
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey("ENTER");
    this.escKey = this.input.keyboard.addKey("ESC");
this.bg = this.add.rectangle(640, 360, 1280, 720, 0x0d0d0d, 1);
this.bg.setDepth(0);

    this.title = this.add.text(40, 50, "PROJECTS", {
  fontSize: "40px",
  fill: "#ffffff"
})
.setOrigin(0,0)
.setDepth(10);

this.openHint = this.add.text(40, 95, "ENTER → Open Project", {
  fontSize:"18px",
  fill:"#aaaaaa"
}
).setOrigin(0, 0).setDepth(10).setScrollFactor(0);



this.gridContainer = this.add.container(0, 0);
this.gridContainer.setDepth(1);


this.cards = [];
let cols = 2;
let spacingX = 480;
let spacingY = 320;
      let totalWidth = cols * spacingX;
let startX = this.scale.width / 2 - totalWidth / 2 + spacingX / 2;
          let startY = 320 ;



for(let i = 0; i < projects.length; i++){

  let col = i % cols;
  let row = Math.floor(i / cols);

  let x = startX + col * spacingX;
  let y = startY + row * spacingY;

  let container = this.add.container(x, y);
  container.setSize(240,160);
let bg = this.add.rectangle(0, 0, 420, 270, 0x111111, 0.9);
bg.setStrokeStyle(2, 0xffffff, 0.2);

let img = this.add.image(0, -20, projects[i].title);
img.setDisplaySize(360, 200);
img.setOrigin(0.5);

let text = this.add.text(0, 120, projects[i].title, {
  fontSize: "18px",
  color: "#ffffff"
}).setOrigin(0.5);

container.add([bg, img, text]);
  this.gridContainer.add(container);
  this.cards.push(container);
}

let rows = Math.ceil(projects.length / 2);
let totalHeight = rows*320 ;

this.maxScroll = Math.max(0, totalHeight - this.scale.height + 200) ;


   this.detailImage = this.add.image(
  this.scale.width / 2,
  this.scale.height / 2 - 120,
  projects[0].title
)
.setDisplaySize(500, 260)
.setDepth(10)
.setScrollFactor(0)
.setVisible(false);

    this.detailText = this.add.text(
      this.scale.width /2,
      this.scale.height /2 + 100,
      "",
      {
        fontSize:"18px",
        fill:"#ffffff",
        align:"center",
        wordWrap:{width:700}
      }
    ).setOrigin(0.5).setDepth(10).setScrollFactor(0).setVisible(false);

    this.infoText = this.add.text(640, 650,
      "ENTER = Open Demo | R = Repo | ESC = Back",
      {
        fontSize: "23px",
        fill: "#F0F8FF"
      }
    ).setOrigin(0.5).setVisible(false);

    this.repoKey = this.input.keyboard.addKey("R");
 this.updateSelection();
    if (
  Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
  Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
  Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
  Phaser.Input.Keyboard.JustDown(this.cursors.down)
) {
  this.sound.play("hover", { volume: 0.2 });
}
    this.add.text(this.scale.width - 40, 40, "Exit", {
      fontSize: "20px",
      fill:"#F0F8FF"
    }).setOrigin(1,0);
    this.add.text(this.scale.width - 40, 70, "Press -> ESC", {
      fontSize: "16px",
      fill:"#666666"
    }).setOrigin(1,0);
 let topFade = this.add.rectangle(
      this.scale.width / 2,
      0,
      this.scale.width,  120,
      0x0d0d0d,
      1 ).setOrigin(0.5, 0).setAlpha(0.08).setDepth(5);


    topFade.setDepth(5);
    topFade.setScrollFactor(0);

    let bottomFade = this.add.rectangle(
    this.scale.width / 2,
    this.scale.height,
    this.scale.width,
    140,
    0x0d0d0d,
    1
    ).setOrigin(0.5, 1).setAlpha(0.25).setDepth(5);

bottomFade.setDepth(5);
bottomFade.setScrollFactor(0);
topFade.setAlpha(0.08);
bottomFade.setAlpha(0.08);

this.detailOverlay = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  this.scale.width,
  this.scale.height,
  0x000000,
  0.7
).setDepth(3).setScrollFactor(0).setVisible(false);

this.detailBox = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  800,
  500,
  0x111111,
  0.95
)
.setStrokeStyle(2, 0xffffff, 0.2)
.setDepth(9)
.setScrollFactor(0)
.setVisible(false);
   this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
  this.targetScrollY += deltaY * 0.5;
  this.targetScrollY = Phaser.Math.Clamp(this.targetScrollY, 0, this.maxScroll);
});


  }

  updateSelection(){
    for(let i = 0; i < this.cards.length; i++){

    if(i === this.selectedProject){

      this.cards[i].setScale(1.1);   
      this.cards[i].setDepth(10);    

    } else {

      this.cards[i].setScale(1);     
      this.cards[i].setDepth(1);

    }
  }
}

  openDetail(){
    this.sounds.click.play();
    this.detailOverlay.setVisible(true);

    let project = projects[this.selectedProject];

    this.mode = "detail";


    this.cards.forEach(c => c.setVisible(false));
    this.detailImage.setTexture(project.title);
    this.detailImage.setVisible(true);

    this.detailText.setText(project.title);
    this.detailText.setVisible(true);

    this.infoText.setVisible(true);

    this.detailText.setText(
      project.title +'\n\n'+project.desc
    );
  }

  closeDetail(){
    this.sounds.close.play();
    this.detailOverlay.setVisible(false);
    this.mode = "grid";
    this.cards.forEach(c => c.setVisible(true));


    this.detailImage.setVisible(false);
    this.detailText.setVisible(false);
    this.infoText.setVisible(false);
  }


 update(){

  if(this.mode === "grid"){
if(Phaser.Input.Keyboard.JustDown(this.escKey)){
  this.sounds.close.play();
  this.scene.start("GameScene");
}
    if(Phaser.Input.Keyboard.JustDown(this.enterKey)){
      this.openDetail();
    }
if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){this.selectedProject++ ; this.sounds.notify.play() ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.left)) {this.selectedProject-- ; this.sounds.notify.play() ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.down)) {this.selectedProject += 2 ; this.sounds.notify.play() ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.up)) {this.selectedProject -= 2 ; this.sounds.notify.play() ;} 

this.selectedProject = Phaser.Math.Clamp(this.selectedProject, 0, projects.length - 1);
this.updateSelection();
if (this.cursors.down.isDown) {
  this.targetScrollY += 10;
}
if (this.cursors.up.isDown) {
  this.targetScrollY -= 10;
}
if (
  Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
  Phaser.Input.Keyboard.JustDown(this.cursors.up)
) {
  let row = Math.floor(this.selectedProject / 2);
  this.targetScrollY = row * 320;
}
this.targetScrollY = Phaser.Math.Clamp(this.targetScrollY, 0, this.maxScroll);
this.scrollY += (this.targetScrollY - this.scrollY) * 0.12;
this.gridContainer.y = -this.scrollY;
 } 


 else if(this.mode === "detail"){

    let project = projects[this.selectedProject];

    if(Phaser.Input.Keyboard.JustDown(this.enterKey)){
      window.open(project.demo, "_blank");
    }

    if(Phaser.Input.Keyboard.JustDown(this.repoKey)){
      window.open(project.repo, "_blank");
    }

    if(Phaser.Input.Keyboard.JustDown(this.escKey)){
      this.closeDetail();
    }
  }
}
}

class MiniGameScene extends Phaser.Scene {
  constructor(){
    super("MiniGameScene");

  }
preload(){
  this.load.audio("coin", "assets/sounds/coin.mp3");
  this.load.audio("gameover", "assets/sounds/gameover.mp3");
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
this.coins = [];
this.fakeCoins = [];

this.coinSound = this.sound.add("coin", {volume:0.5});
this.gameOverSound = this.sound.add("gameover", { volume: 0.5});
this.clickSound = this.sound.add("click", { volume: 0.5 });

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
    this.clickSound.play();
    this.realCoinsCount = 8;
    this.fakeCoinsCount = 2;
    this.startGame();
  }

  if(Phaser.Input.Keyboard.JustDown(this.key2)){

    this.clickSound.play();
    this.realCoinsCount = 6;
    this.fakeCoinsCount = 4;
    this.startGame();
  }

  if(Phaser.Input.Keyboard.JustDown(this.key3)){

    this.clickSound.play();
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
      this.coinSound.play();
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
  this.gameOverSound.play();
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
scene: [StartScene, GameScene, ProjectScene, MiniGameScene],  scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH
}
}
const game = new Phaser.Game(config);