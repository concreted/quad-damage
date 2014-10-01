var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var keys = {}

function preload() {

  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);
}

// Phaser.Sprite uses pseudoclassical inherit
var Baddie = function(game, x, y, key, frame) {
//  this.body.gravity.y = 1000;
  // this.animations.add('left', [0,1], 5, true);
  // this.animations.add('right', [2,3], 5, true);
  // this.animations.play('left');
  // this.facing = 'left';
  // this.body.velocity.x = -300;
  // this.body.collideWorldBounds = true;
}

Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;
Baddie.prototype.act = function() {
  if (this.body.velocity.x === 0) {
    if (this.body.facing === 'left') {
      this.body.facing = 'right';
      this.body.velocity.x = 300;
      this.animations.play('right');
    } else {
      this.body.facing = 'left';
      this.body.velocity.x = -300;
      this.animations.play('left');
    }
  }
}

var player;
var platforms;
var cursors;

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  var ledge = platforms.create(400, 450, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 350, 'ground');
  ledge.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  player.facing = 'right';

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0;
  player.body.gravity.y = 1000;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();
  keys.space = game.input.keyboard.addKey(32);
  keys.ctrl = game.input.keyboard.addKey(17);

  stars = game.add.group();
  
  stars.enableBody = true;
  
  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');
    
    //  Let gravity do its thing
    star.body.gravity.y = 20;

    
    
    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  enemies = game.add.group();

  enemies.enableBody = true;
  enemies.classType = Baddie;
  
  var enemy = enemies.create(500,300, 'enemy');

  // enemy.body.gravity.y = 1000;
  // enemy.animations.add('left', [0,1], 5, true);
  // enemy.animations.add('right', [2,3], 5, true);
  // enemy.animations.play('left');
  // enemy.facing = 'left';
  // enemy.body.velocity.x = -300;
  // enemy.body.collideWorldBounds = true;
  
  // enemy.act = function() {
  //   if (this.body.velocity.x === 0) {
  //     if (this.body.facing === 'left') {
  //       this.body.facing = 'right';
  //       this.body.velocity.x = 300;
  //       this.animations.play('right');
  //     } else {
  //       this.body.facing = 'left';
  //       this.body.velocity.x = -300;
  //       this.animations.play('left');
  //     }
  //   }
  // }

}

function update() {

  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  //game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(enemies, platforms);

  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.overlap(platforms, stars, explodeStar, null, this);

  game.physics.arcade.overlap(player, enemies, killPlayer, null, this);
  game.physics.arcade.overlap(stars, enemies, explodeBoth, null, this);
  //  Reset the players velocity (movement)
  //player.body.velocity.x = 0;

  //console.log(player.body.velocity.x);
  if (player.body.velocity.x > 0)
    player.body.velocity.x -= 25;
  if (player.body.velocity.x < 0)
    player.body.velocity.x += 25;


  if (cursors.up.isDown) {
    player.facing = 'up';
  } else if (cursors.down.isDown) {
    player.facing = 'down';
  } else if (cursors.right.isDown) {
    player.facing = 'right';
  } else if (cursors.left.isDown) {
    player.facing = 'left';
  }


  if (cursors.left.isDown)
  {
    //  Move to the left
    player.body.velocity.x = -250;

    player.animations.play('left');
    
  }
  else if (cursors.right.isDown)
  {
    //  Move to the right
    player.body.velocity.x = 250;
    
    player.animations.play('right');
    
  }
  else
  {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }


  //  Allow the player to jump if they are touching the ground.
  if (keys.ctrl.isDown && player.body.touching.down)
  {
    player.body.velocity.y = -500;
  }

  if (cursors.down.isDown && player.body.touching.down) {
    if (player.body.velocity.x > 0)
      player.body.velocity.x -= 10
    if (player.body.velocity.x < 0) 
      player.body.velocity.x += 10
  }

  //SHOOTING
  if ((keys.space.isDown)) {
    var star = stars.create(player.body.x+5, player.body.y+15 , 'star');
   
    if (cursors.right.isDown || player.facing === 'right')
      star.body.velocity.x = 500;
    else if (cursors.left.isDown || player.facing === 'left')
      star.body.velocity.x = -500;


    if (cursors.up.isDown || player.facing === 'up')
      star.body.velocity.y = -500;
    else if (cursors.down.isDown || player.facing === 'down')
      star.body.velocity.y = 500;

    

    //  if (player.facing === 'right')
  //     star.body.velocity.x = 500;
  //   else if (player.facing === 'left')
  //     star.body.velocity.x = -500;
  //   else if (player.facing === 'up')
  //     star.body.velocity.y = -500;
    
  //   if (player.facing === 'left' || player.facing === 'right') {
  //     star.body.velocity.y = Math.random() * 50;
  //     if (Math.random() > 0.5)
  //       star.body.velocity.y = -star.body.velocity.y;
  //   }
  //   else {
  //     star.body.velocity.x = Math.random() * 50;
  //     if (Math.random() > 0.5)
  //       star.body.velocity.x = -star.body.velocity.x;  
  //   }
  // }
  }


  enemies.callAll('act', null);
}


function collectStar(player, star) {
  //star.kill();
}

function explodeStar(platform, star) {
  star.kill();
}

function killPlayer(player, enemy) {
  player.kill();
}

function explodeBoth(star, enemy) {
  star.kill();
  enemy.kill();
}
