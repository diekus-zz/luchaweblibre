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
 state = null,
 logo = null;

 /* FUNCTIONS */

function init(){
    stage = new Container();
    renderer = autoDetectRenderer(window.innerWidth, window.innerHeight,
    {transparent:true});
    renderer.autoResize = true;
    document.body.appendChild(renderer.view);

    // window.addEventListener("resize", event => {  scaleToWindow(renderer.view); });

        
    loadAssets();    
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
    stage.addChild(logo);
    logo.position.set(150, 150);
    logo.anchor.set(.5, .5);
    logo.scale.set(.5, .5);

    let su = new SpriteUtilities(PIXI, renderer);
    let pWalkTextures = [resources['img/panda.json'].textures['spWalk1.png'], resources['img/panda.json'].textures['spWalk2.png']];
    let pWalk = new MovieClip(pWalkTextures);
    pWalk.position.set(250, 250);
    pWalk.anchor.set(.5,.5);
    pWalk.play();
    pWalk.animationSpeed = .1;
    stage.addChild(pWalk);

    let phead = new Sprite(resources['img/panda.json'].textures['spHead.png']);
    phead.anchor.set(.5,.5);
    phead.position.set(250, 190);
    stage.addChild(phead);



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
    
}

function end(){

}