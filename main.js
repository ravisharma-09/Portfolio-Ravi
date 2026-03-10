let player;
let cursors;
let keys;


function preload() {
  this.load.image("player", "assets/player.png");
}

function create() { 
    player = this.add.sprite(400,300,"player")
keys = this.input.keyboard.addKeys("W,A,S,D");
  cursors = this.input.keyboard.createCursorKeys()
}
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


}

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 900,
  parent: "game-container",
  backgroundColor: "#0f172a",
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}





const game = new Phaser.Game(config);