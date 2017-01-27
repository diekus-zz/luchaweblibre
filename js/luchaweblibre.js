/* ALIASES */
let MovieClip = PIXI.extras.MovieClip,
Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
TextureCache = PIXI.utils.TextureCache;

/* GLOBAL VARIABLES */
let stage = null,
 renderer = null,
 state = null;

/* SPRITES */
 let logo = null,
 pWalk = null;

 /* FUNCTIONS */
function init(){
    stage = new Container();
    renderer = autoDetectRenderer(window.innerWidth, window.innerHeight,{transparent:true});
    renderer.autoResize = true;
    document.body.appendChild(renderer.view);

    // window.addEventListener("resize", event => {  scaleToWindow(renderer.view); });
    //sets keyboard event
    let upKey = keyboard(38);
    let downKey = keyboard(40);
    let leftKey = keyboard(37);
    let rightKey = keyboard(39);

    upKey.press = () => {};
    upKey.release = () => {};
    downKey.press = () => {};
    downKey.release = () => {};
    leftKey.press = () => {};
    leftKey.release = () => {};
    rightKey.press = () => {
        walk(pWalk, 'right', true);
    };
    rightKey.release = () => {
        walk(pWalk, 'right', false);
    };

        
    loadAssets();    
}

function walk(spr, dir, motion, speed){
    if(motion){
        spr.play();
        spr.vx = speed;
    }
    else{
        spr.stop();
        spr.vx = 0;
    }
}

function loadAssets(){
    loader.add([
        'img/luchaWebLibre.png',
        'img/panda.json'
    ]).load(setup);
}

function setup(){
    //manage assets
    logo = new Sprite(resources['img/luchaWebLibre.png'].texture);
    logo.position.set(150, 150);
    logo.anchor.set(.5, .5);
    logo.scale.set(.5, .5);
    stage.addChild(logo);

    let su = new SpriteUtilities(PIXI, renderer);
    let pWalkTextures = [resources['img/panda.json'].textures['spWalk1.png'], resources['img/panda.json'].textures['spWalk2.png']];
    pWalk = new MovieClip(pWalkTextures);
    pWalk.position.set(250, 250);
    pWalk.anchor.set(.5,.5);
    pWalk.animationSpeed = .1;
    stage.addChild(pWalk);
    pWalk.play();

    //set the game state
    state = play;
    //start the gameloop
    gameLoop();
}

function gameLoop(){
    requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);

}

function play(){
    //pWalk.x += pWalk.vx;
    //logo.x += 1;
}

function end(){

}