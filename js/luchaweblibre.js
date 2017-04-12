/********************* 

PLAYER CLASS

*********************/
function Player (game, x, y, resource, setKeys){
    Phaser.Sprite.call(this, game, x, y, resource);
    this.anchor.set(.5,.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    //animations
    this.animations.add('stop', [0]);
    this.animations.add('run', [1,2], 8, true); 
    this.animations.add('jump', [3]); 
    this.animations.add('fall', [4]);    

    this.keys = setKeys;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.constructor = Player;

Player.prototype.move = function(dir){
    const speed = 200;
    this.body.velocity.x = dir * speed;
    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }
    else if(this.body.velocity.x > 0)
    {
        this.scale.x = 1;
    }
};

Player.prototype.jump = function(){
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;
    if(canJump){
        this.body.velocity.y = -JUMP_SPEED;
    }
};

Player.prototype._getAnimationName = function(){
    let name = 'stop';
    //jump
    if(this.body.velocity.y < 0){
        name = 'jump';
    }
    else if(this.body.velocity.y > 0 && !this.body.touching.down){
        name = 'fall';
    }
    else if(this.body.velocity.x !== 0 && this.body.touching.down){
        name = 'run';
    }
    return name;
};

Player.prototype.update = function (){
    let animationName = this._getAnimationName();
    if(this.animations.name !== animationName){
        this.animations.play(animationName);
    }
};

/********************* 

GAME

*********************/

PlayState = {};

PlayState.init = function(){
    this.game.renderer.renderSession.roundPixels = true;
};

PlayState._createP1Keys = function(){
    var obj = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
    };
    return obj;
};

PlayState._createP2Keys = function(){
    var obj = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    return obj;
};

PlayState.preload = function () {
    //loads level graphics
    this.game.load.image('bg', 'img/bgxp.jpg');
    this.game.load.image('cloud:1', 'img/cloud_1.png');
    this.game.load.image('cloud:2', 'img/cloud_2.png');
    this.game.load.image('ground:green1', 'img/ground_green.png');
    //load characters
    this.game.load.spritesheet('panda','img/sp.png', 121, 166);
    this.game.load.spritesheet('fox', 'img/ff.png', 137, 167);
    //load level data
    this.game.load.json('level:1', 'data/level01.json');
    //load sounds
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
};

PlayState.create = function () {
    this.game.add.sprite(0,0, 'bg');
    this._loadLevel(this.game.cache.getJSON('level:1'));

    //create sound entities
    this.sfx = {
        jump:this.game.add.audio('sfx:jump')
    };
};

PlayState._loadLevel = function (data) {
    this.platforms = this.game.add.group();

    data.platforms.forEach(this._spawnPlatform, this);
    //create floor
    var ground = this.platforms.create(0, this.game.world.height - 20, 'ground:green1');
    ground.scale.setTo(200, 2);
    this.game.physics.enable(ground);
    ground.body.immovable = true;
    ground.body.allowGravity = false;


    this._spawnCharacters({p1: data.p1, p2:data.p2});
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState._spawnCharacters = function(data){
    this.p1 = new Player(this.game, data.p1.x, data.p1.y, 'panda', PlayState._createP1Keys());
    this.p2 = new Player(this.game, data.p2.x, data.p2.y, 'fox', PlayState._createP2Keys());


    this.game.add.existing(this.p1);
    this.game.add.existing(this.p2);
};

window.onload = function () {
    let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
    game.state.add('play', PlayState);
    game.state.start('play');
}

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
};

PlayState._handleCollisions = function(){
    this.game.physics.arcade.collide(this.p1, this.platforms);
    this.game.physics.arcade.collide(this.p2, this.platforms);
};

PlayState._handleInput = function(){
    if(PlayState.p1.keys.up.isDown){
        PlayState.p1.jump();
    } else if(PlayState.p1.keys.left.isDown){
        PlayState.p1.move(-1);
    } else if(PlayState.p1.keys.right.isDown){
        PlayState.p1.move(1);
    } else if(PlayState.p2.keys.up.isDown){
        PlayState.p2.jump();
    } else if(PlayState.p2.keys.left.isDown){
        PlayState.p2.move(-1);
    } else if(PlayState.p2.keys.right.isDown){
        PlayState.p2.move(1);
    } else {
        PlayState.p1.move(0);
        PlayState.p2.move(0);
    }
};