let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

let platforms;
let player1;
let player2;
let p1Atrib;
let p2Atrib;
let specialTimeoutp1 = 0;
let specialTimeoutp2 = 0;

function preload() {
    game.load.image('bg', 'img/bgxp.jpg');
    game.load.image('logo', 'img/logolwl.png');
    game.load.image('ground', 'img/ground.png');
    game.load.spritesheet('panda', 'img/pandaSprite.png',121, 166);
    game.load.spritesheet('clipster', 'img/clipsterSprite.png', 99, 162);
    //game.load.spritesheet('pandaRay', 'img/pandaRay.png', x, y);
    //game.load.spritesheet('staple', 'img/staples.png', x, y);
    game.load.image('clip_special', 'img/clipster_projectile.png');
    game.load.image('panda_special', 'img/panda_projectile.png');
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

    p1Movement = game.input.keyboard.createCursorKeys();
    p1Atk = createP1AttackKeys();

    p2Movement = createP2MoveKeys();
    p2Atk = createP2AttackKeys();

    addPlayers();
}

function update() {
    movePlayer1();
    movePlayer2();
    p1Attack();
    p2Attack();
}
    
function addPlayers(){
    //Player 1
    player1 = game.add.sprite(game.world.width - 64, game.world.height - 450, 'panda');
    game.physics.arcade.enable(player1);
    player1.body.bounce.y = 0.2;
    player1.body.gravity.y = 1000;
    player1.body.collideWorldBounds = true;

    player1.animations.add('left', [0, 1], 5, true);
    player1.animations.add('right', [3, 4], 5, true);    

    //get p1 attributes
    p1Atrib = getPandaAttributes();
    
    //Player 2
    player2 = game.add.sprite(32, game.world.height - 450, 'clipster');
    game.physics.arcade.enable(player2);
    player2.body.bounce.y = 0.2;
    player2.body.gravity.y = 1000;
    player2.body.collideWorldBounds = true;

    player2.animations.add('left', [1, 2], 5, true);
    player2.animations.add('right', [2, 1], 5, true);
    
    //get p2 attributes
    p2Atrib = getClipsterAttributes();
}

function movePlayer1(){
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player1, platforms);
    game.physics.arcade.collide(player1, player2);

    //  Reset the players velocity (movement)
    player1.body.velocity.x = 0;

    if (p1Movement.left.isDown){
        player1.body.velocity.x = -p1Atrib.moveSpeed;
        player1.animations.play('left');
        //alert('left');
    }
    else if (p1Movement.right.isDown){
        player1.body.velocity.x = p1Atrib.moveSpeed;
        player1.animations.play('right');
    }
    else{
        player1.animations.stop();
        player1.frame = 0;
    }
    if (p1Movement.up.isDown && player1.body.touching.down){
        player1.body.velocity.y = p1Atrib.jumpForce;    
    }
}

function movePlayer2(){
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player2, platforms);

    //  Reset the players velocit1y (movement)
    player2.body.velocity.x = 0;

    if (p2Movement.left.isDown){
        player2.body.velocity.x = -p2Atrib.moveSpeed;
        player2.animations.play('left');
        //alert('left');
    }
    else if (p2Movement.right.isDown){
        player2.body.velocity.x = p2Atrib.moveSpeed;
        player2.animations.play('right');
    }
    else{
        player2.animations.stop();
        player2.frame = 0;
    }
    if (p2Movement.up.isDown && player2.body.touching.down){
        player2.body.velocity.y = p2Atrib.jumpForce;    
    }
}

function getPandaAttributes(){
    var panda = {
        jumpForce: -250,
        moveSpeed: 250,
        punchStrength: 10,
        blockPower: 5,
        specialStrength: 2,
        specialSpeed: 300,
        specialDelay: 300,
    };
    return panda;
}

function getClipsterAttributes(){
    var clipster = {
        jumpForce: -350,
        moveSpeed: 350,
        strength: 7,
        blockPower: 2,
        specialStrength: 5,
        specialSpeed: 500,
        specialDelay: 500,
    };
    return clipster;
}

function createP2MoveKeys(){
    var obj = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    return obj;
}

function createP1AttackKeys(){
    var obj = {
        punch: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_7),
        special: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8),
    };
    return obj;
}

function createP2AttackKeys(){
    var obj = {
        punch: game.input.keyboard.addKey(Phaser.Keyboard.Y),
        special: game.input.keyboard.addKey(Phaser.Keyboard.U),
    };
    return obj;
}

function p1Attack(){
    if(p1Atk.punch.isDown){

    }
    else if(p1Atk.special.isDown && game.time.now > specialTimeoutp1){
       var special = game.add.sprite(player1.position.x + (player1.width *0.5), player1.position.y + (player1.height *0.5), 'panda_special');
       special.scale.setTo(.25,.25);
       game.physics.arcade.enable(special);
       special.body.gravity.y = 0;
       special.body.velocity.x = -p1Atrib.specialSpeed;

       specialTimeoutp1 = game.time.now + p1Atrib.specialDelay;
    }
}

function p2Attack(){
    if(p2Atk.punch.isDown){

    }
    else if(p2Atk.special.isDown && game.time.now > specialTimeoutp2){
       var special = game.add.sprite(player2.position.x + (player2.width *0.5), player2.position.y + (player2.height *0.5), 'clip_special');
       special.scale.setTo(.25,.25);
       game.physics.arcade.enable(special);
       special.body.gravity.y = 0;
       special.body.velocity.x = p2Atrib.specialSpeed;

       specialTimeoutp2 = game.time.now + p1Atrib.specialDelay;
    }
}