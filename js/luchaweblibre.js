let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

let platforms;

function preload() {
    game.load.image('bg', 'img/bgxp.jpg');
    game.load.image('logo', 'img/logolwl.png');
    game.load.image('ground', 'img/ground.png');
    game.load.atlas('panda', 'img/panda.png', 'img/panda.json');
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0, 'bg');
    let logo = game.add.sprite(25,25,'logo');
    logo.scale.setTo(.25,.25);

    platforms = game.add.group();
    platforms.enableBody = true;
    
    let ground = platforms.create(0, game.world.height - 70, 'ground');
    ground.scale.setTo(6, 2);
    ground.body.immovable = true;

    let ledge = platforms.create(200, 200, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 450, 'panda');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;

    player.animations.add('left', ['spWalkL1.png','spWalkL2.png'], 5, true);
    player.animations.add('right', ['spWalkR1.png','spWalkR2.png'], 5, true);
    

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown){
        player.body.velocity.x = -150;
        player.animations.play('left');
        //alert('left');
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 150;
       player.animations.play('right');
    }
    else{
        player.animations.stop();
        player.frame = 0;
    }
    if (cursors.up.isDown && player.body.touching.down){
        player.body.velocity.y = -350;
    }
    
    
}