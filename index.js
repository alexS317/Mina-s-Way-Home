import Player from './Player.js';
import Fish from './Fish.js';
import Poison from './Poison.js';
import Platform from './Platform.js';
import Home from './Home.js';
import Water from './Water.js';
import Points from './Points.js';

// Global variables
let canvas;
let context;
let lastTickTimestamp = 0;
let gameObjects = [];
let collectibles = [];
let platforms = [];
let player;
let home;
let water;

// Score counter
let score;
let fishSymbol;
let collectedFish;

// Items
let poison;
let fish1;
let fish2;
let fish3;

// Platforms
let ground1;
let ground2;
let ground3;
let platform1;
let platform2;
let platform3;
let platform4;
let platform5;
let platform6;

const CONFIG = {
    width: 1200,
    height: 800,
}

let music = new Audio('./Assets/Netherplace_Looping.mp3');
let plop = new Audio('./Assets/Plop.mp3');


// Initializing, basic setup of game elements
const init = () => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    canvas.setAttribute('width', CONFIG.width);
    canvas.setAttribute('height', CONFIG.height);

    ground1 = new Platform(context, 0, 740, 700, 120, CONFIG);
    ground2 = new Platform(context, 700, 740, 180, 120, CONFIG);
    ground3 = new Platform(context, 1120, 740, 240, 120, CONFIG);

    platform1 = new Platform(context, 110, 200, 150, 30, CONFIG);
    platform2 = new Platform(context, 270, 310, 150, 30, CONFIG);
    platform3 = new Platform(context, 350, 600, 150, 30, CONFIG);
    platform4 = new Platform(context, 570, 460, 150, 30, CONFIG);
    platform5 = new Platform(context, 750, 570, 150, 30, CONFIG);
    platform6 = new Platform(context, 910, 380, 150, 30, CONFIG);

    platforms.push(ground1, ground2, ground3, platform1, platform2, platform3, platform4, platform5, platform6);

    home = new Home(context, 1165, 330, 75, 700, CONFIG);
    water = new Water(context, 895, 745, 208, 110, CONFIG);

    poison = new Poison(context, 750, 520, 60, 60, CONFIG);

    fish1 = new Fish(context, 110, 150, 60, 60, CONFIG);
    fish2 = new Fish(context, 350, 550, 60, 60, CONFIG);
    fish3 = new Fish(context, 910, 330, 60, 60, CONFIG);

    player = new Player(context, 100, 600, 130, 130, CONFIG);

    score = new Points(context, 85, 55);
    fishSymbol = new Fish(context, 40, 40, 50, 50, CONFIG);

    gameObjects.push(home, water, poison, fish1, fish2, fish3, player);
    collectibles.push(poison, fish1, fish2, fish3);

    music.play();
    music.loop = true;
    music.volume = 0.2;

    // call first iteration of the game loop
    lastTickTimestamp = performance.now();
    requestAnimationFrame(loop);
}


// Updating properties of game elements with every iteration
const update = (timePassedSinceLastRender) => {
    platforms.forEach((platform) => {
        platform.update(timePassedSinceLastRender);
    });

    gameObjects.forEach((gameObject) => {
        gameObject.update(timePassedSinceLastRender);

        // Death when falling into hole
        if(player.y >= CONFIG.height) {
            gameObjects.splice(gameObjects.indexOf(player), 1);
            canvas.style.position = 'relative';
            gameOverScreen.style.position = 'absolute';
            gameOverScreen.style.display = 'block';
        }

        // Win when reaching home
        if(checkCollisionBetweenObjects(player, home)) {
            gameObjects.splice(gameObjects.indexOf(player), 1);
            canvas.style.position = 'relative';
            winScreen.style.position = 'absolute';
            winScreen.style.display = 'block';
            pointsDisplay.textContent = collectedFish + '/3';
        }
    });

    // Collect items
    collectibles.forEach((collectible) => {
        if(checkCollisionBetweenObjects(player, collectible)) {
            collectibles.splice(collectibles.indexOf(collectible), 1);
            gameObjects.splice(gameObjects.indexOf(collectible), 1);
            collectedFish = score.increase();
            plop.play();

            // Death when collecting poison
            if(checkCollisionBetweenObjects(player, poison)) {
                gameObjects.splice(gameObjects.indexOf(player), 1);
                plop.volume = 0;
                canvas.style.position = 'relative';
                gameOverScreen.style.position = 'absolute';
                gameOverScreen.style.display = 'block';
            }

            
        }
        
    });

    // Collide with platforms
    platforms.forEach((platform) => {
        if(checkCollisionWithPlatforms(player, platform) === true) {
            player.grounded = true;
            player.dy = -player.gravity;
        }
    });


    
}


// Drawing game elements on the canvas
const render = () => {
    // clear previous drawings
    context.clearRect(0, 0, CONFIG.width, CONFIG.height);

    platforms.forEach((platform) => {
        platform.render();
    });

    gameObjects.forEach((gameObject) => {
        gameObject.render();
    });

    score.render();
    fishSymbol.render();
}


// Loop to repeat update and render
const loop = () => {
    // Calculate how much time passes between the iterations, value will be used as a constant to keep the game at the same speed on screens with different refresh rates
    let timePassedSinceLastRender = performance.now() - lastTickTimestamp;

    update(timePassedSinceLastRender);
    render();

    // Call the next iteration
    lastTickTimestamp = performance.now();
    requestAnimationFrame(loop);
}

// Check for collisions with collectibles
let checkCollisionBetweenObjects = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();
    if(
        bbA.x < bbB.x + bbB.w &&
        bbA.x + bbA.w > bbB.x &&
        bbA.y < bbB.y + bbB.h &&
        bbA.y + bbA.h > bbB.y
    ) {
        // collision happened
        return true;
    } else {
        return false;
    }
}

// Check for collisions with platforms
let checkCollisionWithPlatforms = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBoxPlayer();
    let bbB = gameObjectB.getBoundingBoxPlatform();
    if(
        bbA.x < bbB.x + bbB.w &&
        bbA.x + bbA.w > bbB.x &&
        bbA.y < bbB.y + bbB.h &&
        bbA.y + bbA.h > bbB.y
    ) {
        // collision happened
        return true;
    } else {
        return false;
    }
}


window.addEventListener('load', () => {
    init();
});



//DOM manipulations
let pointsDisplay = document.querySelector('#points');

let startScreen = document.querySelector('#start-screen');
let howToPlayScreen = document.querySelector('#how-to-play-screen');
let winScreen = document.querySelector('#win-screen');
let gameOverScreen = document.querySelector('#game-over-screen');

let start = document.querySelector('#start-button');
let howToPlay = document.querySelector('#how-to-play-button');
let back = document.querySelector('#back-button');
let winHomescreen = document.querySelector('.homescreen-button');
let gameOverHomescreen = document.querySelector('#back-to-homescreen');

// How to play
howToPlay.addEventListener('click', () => {
    startScreen.style.position = 'relative';
    howToPlayScreen.style.position = 'absolute';
    howToPlayScreen.style.display = 'block';
});

back.addEventListener('click', () => {
    howToPlayScreen.style.display = 'none';
});

// Start
start.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameObjects.splice(gameObjects.indexOf(player), 1);
    init();
});


// Win
winHomescreen.addEventListener('click', () => {
    document.location.reload(true);
});

// Game over
gameOverHomescreen.addEventListener('click', () => {
    document.location.reload(true);
});