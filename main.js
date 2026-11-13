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
let introBubbleDone = false ;
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
    title: "LessonLingo",
    image: "lessonlingo.webp",
    demo: "https://drive.google.com/file/d/19TnHx-6KQ2JV6Vs3LsIcdvp8Ti9OcrRN/view?usp=sharing",
    repo: "https://github.com/ravisharma-09/lessonlingo",
    desc: "Offline lecture translator (team project). Turns English lectures into Hindi and Kannada subtitles and dubbed audio, fully offline after the first model download. I built the step-by-step web interface, added automated tests, and made Markdown notes translate while keeping headings, tables and code blocks intact. Tech: Python, pytest."
  },
  {
    title: "Setu - Sign Language Bridge",
    image: "setu.webp",
    demo: "https://sih.geetanshgoyal.in/",
    repo: "https://github.com/geetxnshgoyal/sih/pulls?q=is:pr+author:ravisharma-09+is:merged",
    desc: "Smart India Hackathon 2026 team project. I fixed camera recognition of face-adjacent signs by capturing full body, hand and 48-point face trajectories, bundled the MediaPipe Holistic model for offline use with GPU-to-CPU fallback, and rebuilt sign playback as a 2D signer with a resumable dataset pipeline (4,384 clips). Tech: TypeScript, React, Python, MediaPipe."
  },
  {
    title: "Pathglass",
    image: "pathglass.webp",
    demo: "https://pathglass-ten.vercel.app/",
    repo: "https://github.com/ravisharma-09/Pathglass",
    desc: "A graph query engine built from scratch with lazy iterators for traversal, filter, take and unique queries, plus a visual app with a graph canvas, query builder, query-plan panel and step-by-step result replay. Tech: TypeScript, Node.js."
  },
  {
    title: "Portfolio Ravi",
    image: "portfolio.webp",
    demo: "https://sharmaravi.in",
    repo: "https://github.com/ravisharma-09/Portfolio-Ravi",
    desc: "This room! A 2D game portfolio: walk around a virtual room and interact with objects to discover my work. Custom animations, keyboard controls and optimised assets for fast loads, about 35 hours of work from scratch. Tech: JavaScript, Phaser.js, HTML5 Canvas, CSS."
  },
  {
    title: "Tic Tac Toe",
    image: "tictactoe.webp",
    demo: "https://tic-tac-toe-liart-five.vercel.app/",
    repo: "https://github.com/ravisharma-09/tic-tac-toe",
    desc: "Classic 2-player Xs and Os. Keeps score, picks winners, refuses to let you cheat."
  },
  {
    title: "Password Generator",
    image: "password.webp",
    demo: "https://password-genrator-murex.vercel.app/",
    repo: "https://github.com/ravisharma-09/password-genrator",
    desc: "Generate strong, random passwords instantly. Pick your length, mix in symbols, numbers, and cases — copy and go."
  },
  {
    title: "Calculator",
    image: "calculator.webp",
    demo: "https://calculator-mauve-ten-45.vercel.app/",
    repo: "https://github.com/ravisharma-09/Calculator",
    desc: "A clean, working calculator that handles your everyday math without the clutter. Buttons, screen, vibes."
  },
  {
    title: "Stone Paper Scissor",
    image: "stone.webp",
    demo: "https://stone-paper-nine.vercel.app/",
    repo: "https://github.com/ravisharma-09/stone-paper",
    desc: "Stone-Paper Scissor is a fun beginner-level web game built with HTML, CSS, and JavaScript. It lets you play Rock-Paper-Scissors against the computer, showing emoji animations and the win/tie/lose result instantly. This project is great for learning DOM interaction and basic game logic in JavaScript"
  }
];


let doorPanel;
let doorText;


class StartScene extends Phaser.Scene {
  constructor(){
    super("StartScene");
  }

  create(){
this.cameras.main.fadeIn(400, 0, 0, 0);
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
  this.load.image("player", "assets/player.webp");
  this.load.image("room", "assets/room.webp");
  this.load.image("profile", "assets/profile.webp");
  for (let project of projects){
    this.load.image(
      project.title,
      "assets/projects/" + project.image
    );
  }
  this.load.audio("click", ["assets/sounds/click.ogg", "assets/sounds/click.ogg"] );
  this.load.audio("hover", ["assets/sounds/hover.ogg", "assets/sounds/hover.ogg"]);
  this.load.audio("close", ["assets/sounds/close.ogg", "assets/sounds/close.ogg"]);
  this.load.audio("notify", ["assets/sounds/notify.ogg", "assets/sounds/notify.ogg"]);
  this.load.audio("bg", ["assets/sounds/bg.ogg", "assets/sounds/bg.ogg"]);
  this.load.audio("type", ["assets/sounds/type.ogg", "assets/sounds/type.ogg"]);
  this.load.image("icon_github", "assets/icons/github.png");
  this.load.image("icon_linkedin", "assets/icons/linkedin.png");
  this.load.image("icon_instagram", "assets/icons/instagram.png");
  this.load.image("icon_globe", "assets/icons/globe.png");
  this.load.image("bubble", "assets/speech-bubble.webp");

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

  const spawn = takeSpawn("GameScene", { x: 480, y: 400 });
  player = this.add.sprite(spawn.x, spawn.y, "player");
  player.setScale(0.1);
this.bubble = this.add.image(0, 0, "bubble")
.setDisplaySize(260,150)
.setDepth(15)
.setVisible(false)
.setScrollFactor(0);


  this.bubbleText = this.add.text(0, 0, "",{
  fontSize: "17px",
  fill:"#1a1a1a",
  align: "center",
  fontFamily: "Georgia, serif",
  fontStyle: "italic",
  wordWrap:{ width: 210 },
  lineSpacing: 6
}).setOrigin(0.5).setDepth(16).setVisible(false).setScrollFactor(0);

this.bubbleTimer = null ;

this.showBubble = (msg, duration = 4000) => {
  this.bubble.setVisible(true);
  this.bubbleText.setText("").setVisible(true);
  if(this.bubbleTimer) this.bubbleTimer.remove();

  let index = 0;
  const typeEvent = this.time.addEvent({
    delay: 40,
    repeat: msg.length - 1,
    callback: () => {
      index++;
      this.bubbleText.setText(msg.slice(0, index));
    }
  });


  const totalDuration = duration + msg.length * 40;
  this.bubbleTimer = this.time.delayedCall(totalDuration, () => {
    this.bubble.setVisible(false);
    this.bubbleText.setVisible(false);
    typeEvent.remove();
  });
};
if(!introBubbleDone){
  this.bubbleFrozen = true;
  const startBubble = () => {
    introBubbleDone = true;
    this.showBubble("Hi! I'm Angel\nExplore this room to\nknow more about my Master'Ravi' 👋", 2000);
    this.time.delayedCall(4300, () => {
      this.bubbleFrozen = false;
    });
  };
  this.cameras.main.once("camerafadeincomplete", startBubble);
  this.time.delayedCall(700, () => {
    if(this.bubbleFrozen && !this.bubble.visible){
      startBubble();
    }
  });
} else {
  this.bubbleFrozen = false;
}

this.stillTimer = 0;
this.spamCount = 0;
this.lastSpamKey =0 ;
this.panelOpenCount ={};
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
this.sound.stopAll();
this.bgMusic = this.sound.add("bg", { volume: 0.06, loop: true});
this.input.once("pointerdown", () => {
  if(this.musicOn && !this.bgMusic.isPlaying){
    this.bgMusic.play();
  }
});
this.input.keyboard.once("keydown", () => {
  if(this.musicOn && !this.bgMusic.isPlaying){
    this.bgMusic.play();
}
});
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
  680,
  520,
  0x000000,
  0.65
);

aboutPanel.setVisible(false);
aboutText = this.add.text(
  this.scale.width / 2 - 320,
  this.scale.height / 2,
  "👋 Hi, I'm Ravi Sharma\n\n" +
  "CS student @ Newton School\n" +
  "of Technology (2025 - 2029)\n\n" +
  "ABOUT\n" +
  "I turn ideas into working\n" +
  "products: from a sign-language\n" +
  "translator to a graph query\n" +
  "engine built from scratch.\n\n" +
  "CURRENTLY\n" +
  "• Lead @ DevForge dev club\n" +
  "• openSUSE community member\n\n" +
  "OFF THE KEYBOARD\n" +
  "• Swimming 🏊 • Gaming 🎮\n" +
  "• Sleeping (pro level 😴)",
  {
    fontSize: "18px",
    fill: "#ffffff",
    align: "left",
    lineSpacing: 2
  }
);

aboutText.setOrigin(0, 0.5);
aboutText.setVisible(false);

this.profileImage = this.add.image(
   this.scale.width / 2 + 180,
  this.scale.height / 2 - 40,
  "profile"
);


this.profileImage.setScale(0.34); // profile.webp is half the old size
this.profileImage.setVisible(false);
this.profileImage.setScrollFactor(0);
this.profileImage.setDepth(8);




achievementPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  720,
  580,
  0x000000,
  0.8
);

achievementPanel.setVisible(false);
achievementPanel.setScrollFactor(0);

achievementText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 - 245,
  "Achievements",
  {
    fontSize: "30px",
    fill: "#ffffff",
    align: "center",
    fontStyle:"bold"
  }
);

achievementText.setOrigin(0.5);
achievementText.setVisible(false);
achievementText.setScrollFactor(0);

this.icpcText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 25,
  "🏆  All India Rank 17 · Turing Cup 2k26\n" +
  "Competitive programming contest by Turing Hut (Mar 2026)\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "💻  ICPC Asia Amritapuri Regional 2025\n" +
  "Regional contest participant\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "🌏  openSUSE.Asia Summit 2026\n" +
  "Attended at Universitas Gadjah Mada, Indonesia (Oct 2026)\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "🎮  Organised Campfire Bengaluru (Hack Club)\n" +
  "Event coordination and community engagement\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "🛠️  Lead · DevForge, the college developer club\n" +
  "Coordinated club leads and organised technical events",
  {
    fontSize: "18px",
    fill: "#ffffff",
    align: "center",
    lineSpacing: 4
  }
).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(7);



skillsPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2 - 40,
  880,
  420,
  0x0a0a0a,
  0.95
);

skillsPanel.setVisible(false);
skillsPanel.setScrollFactor(0);

skillsText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 - 225,
"⚡ Skills",  {
    fontSize: "30px",
    fill: "#FFD700",
    align: "center",
    fontStyle:"bold"
  }
);

skillsText.setOrigin(0.5);
skillsText.setVisible(false);
skillsText.setScrollFactor(0);

const skillGroups = [
  { name: "Languages", color: "#e34c26", items: ["C++", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { name: "Frameworks & Libraries", color: "#3178c6", items: ["React", "Next.js", "Tailwind CSS", "Node.js", "Express", "FastAPI", "Phaser.js"] },
  { name: "Tools", color: "#2e8b57", items: ["Git & GitHub", "Linux", "Bash", "Playwright", "pytest", "MediaPipe"] },
  { name: "Databases & Automation", color: "#8a5cf6", items: ["MySQL", "DBMS", "n8n"] },
];
// grouped skill chips (replaces the old % bars)
this.skillTags = [];
const tagLeft = this.scale.width / 2 - 400;
const tagRight = this.scale.width / 2 + 400;
let tagY = this.scale.height / 2 - 165;

skillGroups.forEach(group => {
  const heading = this.add.text(tagLeft, tagY, group.name, {
    fontSize: "18px", fill: "#aaaaaa", fontStyle: "bold"
  }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(7).setVisible(false);
  this.skillTags.push(heading);
  tagY += 34;

  let tagX = tagLeft;
  group.items.forEach(item => {
    const chip = this.add.text(tagX, tagY, item, {
      fontSize: "17px", fill: "#ffffff", backgroundColor: group.color,
      padding: { x: 12, y: 6 }
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(8).setVisible(false);
    if (tagX + chip.width > tagRight) {
      tagX = tagLeft;
      tagY += 40;
      chip.setPosition(tagX, tagY);
    }
    tagX += chip.width + 10;
    this.skillTags.push(chip);
  });
  tagY += 52;
});


contactPanel = this.add.rectangle(
  this.scale.width / 2,
  this.scale.height / 2,
  600,
  250,
  0x0a0a0a,
  0.95
);
 
contactPanel.setVisible(false);
contactPanel.setScrollFactor(0);

contactText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 - 80,
  "Ravi Sharma",
  {
    fontSize: "34px",
    fill: "#ffffff",
    fontStyle: "bold",
    align: "center"
  }
).setOrigin(0.5)
.setVisible(false)
.setScrollFactor(0);

this.contactEmail = this.add.text(
  this.scale.width / 2 ,
  this.scale.height / 2 - 20,
  "📩 rravisharma817@gmail.com",
  {
    fontSize: "20px",fill:"#aaaaaa",align:"center"
  }
).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(7);

const links =[
  { label: "GitHub",  icon:"icon_github", color: 0x333333, url:"https://github.com/ravisharma-09" },
  {label: "LinkedIn", icon:"icon_linkedin", color: 0x0077b5, url:"https://www.linkedin.com/in/ravi-sharma-10b1a1384/"},
  {label: "Instagram", icon:"icon_instagram", color:0xe1306c, url:"https://www.instagram.com/ravi._who_/"},
  {label:"Portfolio", icon:"icon_globe", color: 0x6c3483, url: "https://sharmaravi.in"},

]; 
this.contactButtons = [];
const btnW =130, btnH = 48, gap = 18 ;
const totalW = links.length*btnW + (links.length - 1)*gap;
const startX = this.scale.width / 2 - totalW / 2 + btnW / 2;
const btnY = this.scale.height / 2 + 50 ;

links.forEach((link, i) =>{
  const x =startX + i * (btnW + gap);

  const box = this.add.rectangle(x , btnY, btnW, btnH, link.color, 1)
  .setScrollFactor(0).setDepth(7).setVisible(false).setInteractive({ useHandCursor: true})
  .on("pointerover", () => { box.setAlpha(0.7);})
  .on("pointerout", () => {box.setAlpha(1);})
  .on("pointerdown", () => {
    this.sounds.click.play();
    window.open(link.url, "_blank");
  });

  const icon = this.add.image(x -50 ,btnY, link.icon)
  .setDisplaySize(22, 22)
  .setScrollFactor(0).setDepth(8).setVisible(false);

  const label = this.add.text(x+10, btnY, link.label,{
    fontSize:"16px", fill:"#ffffff" , fontStyle:"bold"
  }).setOrigin(0.5).setScrollFactor(0).setDepth(8).setVisible(false);
this.contactButtons.push(box, icon, label);
});


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
contactText.setDepth(7);
this.contactEmail.setDepth(7);
this.contactButtons.forEach(b => b.setDepth(8));
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

aboutText.setOrigin(0, 0.5);
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
    this.icpcText.setVisible(false);
    aboutPanel.setVisible(false);
    aboutText.setVisible(false);
    achievementPanel.setVisible(false);
    achievementText.setVisible(false);
    skillsPanel.setVisible(false);
    skillsText.setVisible(false);
    this.skillTags.forEach(t => t.setVisible(false));

    contactPanel.setVisible(false);
    contactText.setVisible(false);
    this.contactEmail.setVisible(false);
        this.contactButtons.forEach(b => b.setVisible(false));
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
const cam = this.cameras.main;
const screenX = player.x - cam.scrollX;
const screenY = player.y - cam.scrollY;
const bubbleOffsetX = screenX > this.scale.width - 300 ? -130 : 130;
const bubbleOffsetY = screenY < 200 ? 120 : -120;
this.bubble.setFlipX(screenX > this.scale.width - 300);
this.bubble.setFlipY(screenY < 200);
const bx = screenX + bubbleOffsetX;
const by = screenY + bubbleOffsetY;
const textOffsetY = bubbleOffsetY > 0 ? 15 : -15;
this.bubble.setPosition(bx, by);
this.bubbleText.setPosition(bx, by + textOffsetY);
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
if(this.bubbleFrozen) return;

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

const atWall = player.x <= marginX +5 || player.x >= room.width - marginX - 5;
const atceiling = player.y<=marginTop+5 ;
if(atWall || atceiling){
  
    const msg = atceiling ? "that's the ceiling 💀" : "that's a wall bro 🧱";
    if(!this.wallBubbleShown){
    this.wallBubbleShown = true ;
    this.showBubble(msg, 9999999);
  }else{
    this.bubbleText.setText(msg);
  }
}else{
  if(this.wallBubbleShown){
    this.wallBubbleShown = false ;
    this.bubble.setVisible(false);
    this.bubbleText.setVisible(false);
    if(this.bubbleTimer) this.bubbleTimer.remove()
  }
}

const isMoving = cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ||
  keys.A.isDown || keys.D.isDown || keys.W.isDown || keys.S.isDown ;

  if(!isMoving && !isPanelOpen){
    this.stillTimer += delta ;
    if(this.stillTimer > 7 && !this.stillBubbleShown){
  this.stillBubbleShown = true;
  this.showBubble("you gonna move or what? 🤨", 2500);
}
  }else{
    this.stillTimer = 0;
    this.stillBubbleShown = false ;
  }




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
     this.spamCount++;
    if(this.spamCount >= 5){
      this.spamCount = 0;
      this.bubbleFrozen = true;
      this.spamBlocked = true;
      this.showBubble("bro chill 💀\nstop spamming E", 2500);
      this.time.delayedCall(2500, () => {
        this.bubbleFrozen = false;
        this.spamBlocked = false;
      });
      return;
    }
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
    this.spamCount++;
    if(this.spamCount >= 5){
      this.spamCount = 0;
      this.bubbleFrozen = true;
      this.spamBlocked = true;
      this.showBubble("bro chill 💀\nstop spamming E", 2500);
      this.time.delayedCall(2500, () => {
        this.bubbleFrozen = false;
        this.spamBlocked = false;
      });
      return;
    }
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
  this.icpcText.setAlpha(0);
  this.icpcText.setVisible(true);
  this.tweens.add({
    targets: [achievementPanel, achievementText],
    scale: 1,
    alpha: 1,
    duration: 600,
    ease: "Back.out"
  });
  this.tweens.add({
    targets: this.icpcText ,
    alpha:1,
    duration:600,
    ease:"Back.out"

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
    this.spamCount++;
    if(this.spamCount >= 5){
      this.spamCount = 0;
      this.bubbleFrozen = true;
      this.spamBlocked = true;
      this.showBubble("bro chill 💀\nstop spamming E", 2500);
      this.time.delayedCall(2500, () => {
        this.bubbleFrozen = false;
        this.spamBlocked = false;
      });
      return;
    }
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
  interactText.setPosition(bookshelf.x - 130, bookshelf.y - 220);
  interactText.setText("Press E to view skills");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    this.sounds.click.play();
    this.spamCount++;
    if(this.spamCount >= 5){
      this.spamCount = 0;
      this.bubbleFrozen = true;
      this.spamBlocked = true;
      this.showBubble("bro chill 💀\nstop spamming E", 2500);
      this.time.delayedCall(2500, () => {
        this.bubbleFrozen = false;
        this.spamBlocked = false;
      });
      return;
    }
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

this.skillTags.forEach(t => t.setVisible(true).setAlpha(0));

this.tweens.add({
  targets: [skillsPanel, skillsText],
  scale: 1, alpha: 1,
  duration: 600, ease: "Back.out"
});

this.time.delayedCall(300, () => {
  this.skillTags.forEach((t, i) => {
    this.time.delayedCall(i * 40, () => {
      this.tweens.add({ targets: t, alpha: 1, duration: 300 });
    });
  });
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
    this.spamCount++;
    if(this.spamCount >= 5){
      this.spamCount = 0;
      this.bubbleFrozen = true;
      this.spamBlocked = true;
      this.showBubble("bro chill 💀\nstop spamming E", 2500);
      this.time.delayedCall(2500, () => {
        this.bubbleFrozen = false;
        this.spamBlocked = false;
      });
      return;
    }
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
this.contactEmail.setAlpha(0);
this.contactEmail.setVisible(true);
this.contactButtons.forEach(b => { b.setAlpha(0); b.setVisible(true); });

this.tweens.add({
  targets: [contactPanel, contactText],
  scale: 1,
  alpha: 1,
  duration: 600,
  ease: "Back.out"
});

this.tweens.add({
  targets: [this.contactEmail, ...this.contactButtons],
  alpha: 1,
  duration: 600,
  ease: "Back.out"
});
  closeHint.setVisible(true);

  this.addTerminalMessage("System:Opening contact Info");
    
}
}
else if(Math.abs(player.x - door.x) < 70 && player.y < 380){ // standing in the doorway
  nearObject = true;
if(!wasNear) this.sounds.notify.play();
  interactText.setVisible(true);
  interactText.setPosition(door.x, door.y - 200);
  interactText.setText("Press E to open the door");

  if(Phaser.Input.Keyboard.JustDown(interactKey)){
    // the door now leads to the hallway (see world.js)
    this.sounds.click.play();
    this.addTerminalMessage("System:Opening the door...");
    this.transitionTo("HallwayScene");
    return;
  }

}
}
}

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
  this.load.audio("click",["assets/sounds/click.ogg", "assets/sounds/click.ogg"]);
  this.load.audio("close", ["assets/sounds/close.ogg", "assets/sounds/close.ogg"]);
  this.load.audio("notify",["assets/sounds/notify.ogg", "assets/sounds/notify.ogg"]);

}

create(){
  this.targetScrollY = 0;
  this.scrollY = 0;
this.scrollSpeed = 5;
    this.mode = "grid"; 

   this.sounds = {
  click: this.sound.add("click", { volume: 0.2}),
  close: this.sound.add("close", { volume: 0.09}),
  notify: this.sound.add("notify", { volume: 0.03}),
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

this.openHint = this.add.text(40, 95, document.body.classList.contains("touch") ? "Tap a project to open it" : "ENTER or click → Open Project", {
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
  // touch/click: first tap selects a card, tapping the selected card opens it
  bg.setInteractive({ useHandCursor: true });
  bg.on("pointerup", (pointer) => {
    if (this.mode !== "grid" || this.dragMoved) return;
    if (this.selectedProject === i) this.openDetail();
    else { this.selectedProject = i; this.sounds.notify.play(); this.updateSelection(); }
  });
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

    this.infoText = this.add.text(this.scale.width / 2, 120,
      document.body.classList.contains("touch") ? "Tap a button below · ESC = Back" : "ENTER = Open Demo | R = Repo | ESC = Back",
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
    }).setOrigin(1,0).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => { if (this.mode === "grid") this.exitToRoom(); else this.closeDetail(); });
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
   // swipe / drag to scroll the grid on touch screens
   this.input.on("pointerdown", (p) => { this.dragStartY = p.y; this.dragStartScroll = this.targetScrollY; this.dragMoved = false; });
   this.input.on("pointermove", (p) => {
     if (!p.isDown || this.mode !== "grid") return;
     const dy = p.y - this.dragStartY;
     if (Math.abs(dy) > 12) this.dragMoved = true;
     if (this.dragMoved) this.targetScrollY = Phaser.Math.Clamp(this.dragStartScroll - dy, 0, this.maxScroll);
   });

   // Detail view buttons. Links open from the tap/keypress itself, because mobile
   // browsers block window.open() when it runs later from the game loop.
   const linkBtn = (x, label, color) => {
     const b = this.add.rectangle(x, 0, 230, 54, color).setStrokeStyle(2, 0xffffff, 0.4)
       .setDepth(11).setScrollFactor(0).setVisible(false).setInteractive({ useHandCursor: true });
     const t = this.add.text(x, 0, label, { fontSize: "20px", fill: "#ffffff", fontStyle: "bold" })
       .setOrigin(0.5).setDepth(12).setScrollFactor(0).setVisible(false);
     return { b, t };
   };
   const cx = this.scale.width / 2, by = this.scale.height / 2 + 215;
   this.demoBtn = linkBtn(cx - 125, "▶ Live demo", 0x1f6f4a);
   this.repoBtn = linkBtn(cx + 125, "</> Code", 0x333a55);
   [this.demoBtn, this.repoBtn].forEach(o => { o.b.y = by; o.t.y = by; });
   this.demoBtn.b.on("pointerdown", () => this.openLink("demo"));
   this.repoBtn.b.on("pointerdown", () => this.openLink("repo"));
   this.onNativeKey = (e) => {
     if (this.mode !== "detail") return;
     if (e.keyCode === 13) this.openLink("demo");
     if (e.keyCode === 82) this.openLink("repo");
   };
   window.addEventListener("keydown", this.onNativeKey);
   this.events.once("shutdown", () => window.removeEventListener("keydown", this.onNativeKey));

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
    [this.demoBtn, this.repoBtn].forEach(o => { o.b.setVisible(true); o.t.setVisible(true); });

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
    [this.demoBtn, this.repoBtn].forEach(o => { o.b.setVisible(false); o.t.setVisible(false); });
  }

  openLink(which) {
    const project = projects[this.selectedProject];
    const url = which === "demo" ? project.demo : project.repo;
    if (url) window.open(url, "_blank", "noopener");
  }

  exitToRoom() {
    if (this.exiting) return;
    this.exiting = true;
    this.sounds.close.play();
    this.time.delayedCall(150, () => this.scene.start("GameScene"));
  }


 update(){

  if(this.mode === "grid"){
if(Phaser.Input.Keyboard.JustDown(this.escKey)){
  this.exitToRoom();
}
    if(Phaser.Input.Keyboard.JustDown(this.enterKey)){
      this.openDetail();
    }
  let prevProject = this.selectedProject ;
if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){this.selectedProject++ ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.left)) {this.selectedProject-- ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.down)) {this.selectedProject += 2 ;} 
if(Phaser.Input.Keyboard.JustDown(this.cursors.up)) {this.selectedProject -= 2 ;} 

this.selectedProject = Phaser.Math.Clamp(this.selectedProject, 0, projects.length - 1);
if(this.selectedProject !== prevProject) this.sounds.notify.play() ;
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

    // ENTER / R are handled by onNativeKey so the browser treats the link as user-initiated
    Phaser.Input.Keyboard.JustDown(this.enterKey);
    Phaser.Input.Keyboard.JustDown(this.repoKey);

    if(Phaser.Input.Keyboard.JustDown(this.escKey)){
      this.closeDetail();
    }
  }
}
}

// MiniGameScene (Coin Rush) lives in arcade.js

const config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  parent: "game-container",
  transparent: true,
scene: [StartScene, GameScene, ProjectScene, MiniGameScene, HallwayScene, ArchiveScene, JourneyScene],  scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH
}
}
const game = new Phaser.Game(config);
// give the canvas a name for screen readers / Lighthouse
game.events.once("ready", () => {
  game.canvas.setAttribute("role", "img");
  game.canvas.setAttribute("aria-label", "Ravi Sharma's portfolio: a 2D room you explore with the arrow keys or WASD and E to interact. A text version is at /about/.");
});
