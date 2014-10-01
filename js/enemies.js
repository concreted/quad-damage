// enemies.js

// Phaser.Sprite uses pseudoclassical inherit
var Baddie = function(game, x, y, key, frame) {
	Phaser.Sprite.apply(this, arguments);
	game.physics.arcade.enable(this);
	this.body.gravity.y = 1000;
	this.animations.add('left', [0,1], 5, true);
	this.animations.add('right', [2,3], 5, true);
	this.animations.play('left');
	this.facing = 'left';
	this.body.velocity.x = -200;
	this.body.collideWorldBounds = true;
}

Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;
Baddie.prototype.act = function() {
  if (this.body.velocity.x === 0) {
    if (this.body.facing === 'left') {
      this.body.facing = 'right';
      this.body.velocity.x = 200;
      this.animations.play('right');
    } else {
      this.body.facing = 'left';
      this.body.velocity.x = -200;
      this.animations.play('left');
    }
  }
}