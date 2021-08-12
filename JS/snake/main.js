//canvas
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

let size = 25;
canvas.width = window.innerWidth = size*40;
canvas.height = window.innerHeight = size*16;


//-----------------------------------------------------------------------------------------------------------------

//variables
let theEnd = false;
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGame');
const joinGameBtn = document.getElementById('joinGame');
const gameCodeInput = document.getElementById('gameCodeInput');
let world = setWorldState( size, 'dir', [ {x: 400, y: 100 } ], numberBTWLimits( 0, canvas.width - size ), numberBTWLimits( 0, canvas.height - size ) );
let restartButton = {
    x: size,
    y: size,
    width: size*7,
    height: size*3,
    text: 'reiniciar',
}
//images
let snakeEyesRight = new Image();
snakeEyesRight.src = `../../images/snake/snake-eyes-right.png`;
let snakeEyesLeft = new Image();
snakeEyesLeft.src = `../../images/snake/snake-eyes-left.png`;
let snakeEyesUp = new Image();
snakeEyesUp.src = `../../images/snake/snake-eyes-up.png`;
let snakeEyesDown = new Image();
snakeEyesDown.src = `../../images/snake/snake-eyes-down.png`;
let snakeEyes = new Image();

//sounds
let eat = new Audio('../../music/snake/eat.mp3');
let punch = new Audio('../../music/snake/punch.mp3');
let rollOver = new Audio(`../../music/geometric-shapes/rollover-sound-effect.mp3`);
let postClick = new Audio(`../../music/geometric-shapes/post-click sound effect.mp3`);
let postClicked = true;

//-----------------------------------------------------------------------------------------------------------------

//functions

/**
 * Sets the world state in game.
 * @param {Number} size 
 * @param {String} snakeDir 
 * @param {Array} snakeBody 
 * @param {Number} foodX 
 * @param {Number} foodY 
 * @returns 
 */
function setWorldState( size, snakeDir, snakeBody, foodX, foodY ){
    let world = {
        snake: { 
                size: size, 
                dir: snakeDir, 
                body: snakeBody 
            },
        food: { x: foodX, 
                y: foodY, 
                size: size
            }
    }
    return world;
}

/**
 * Starts the snake's movements.
 * @param {Object} world 
 */
function moveSnake(world){
    let eatfood = setInterval(() => {
        if(overlapsRect(world.snake.body[0], world.food)){
            let back = world.snake.body[ world.snake.body.length - 1 ];
            world.snake.body.push( { x: back.x, y: back.y } );
            let newFoodX = numberBTWLimits( 0, canvas.width - size );
            let newFoodY = numberBTWLimits( 0, canvas.height - size );
            for( let i = 0; i < world.snake.body.length; i++){
                if(overlapsRect( { x: newFoodX, y: newFoodY }, world.snake.body[i] )){
                    newFoodX = numberBTWLimits( 0, canvas.width - size );
                    newFoodY = numberBTWLimits( 0, canvas.height - size );
                    i = 0;
                }
            }
            world.food.x = newFoodX;
            world.food.y = newFoodY;
            eat.currentTime = 0;
            eat.play();
            draw();
        }
    }, '0000');
    let move = setInterval(() => {    
        for( let i = world.snake.body.length-1; i > 0; i-- ){
            world.snake.body[i].x = world.snake.body[i-1].x;
            world.snake.body[i].y = world.snake.body[i-1].y;
        }
        if(world.snake.dir == 'up'){
            world.snake.body[0].y -= world.snake.size;
        }
        if(world.snake.dir == 'down'){
            world.snake.body[0].y += world.snake.size;
        }
        if(world.snake.dir == 'left'){
            world.snake.body[0].x -= world.snake.size;
        }
        if(world.snake.dir == 'right'){
            world.snake.body[0].x += world.snake.size;
        }
        if(isDead()){            
            clearInterval(move);
            clearInterval(eatfood);
            return ending();
        }
        draw();
    }, '0100');
    eatfood;
    move;
}

/**
 * Checks if the snake is dead
 * @returns {Boolean}
 */
function isDead(){
    let block = world.snake.body[0];
    for(let k = 1; k < world.snake.body.length; k++){
        let block2 = world.snake.body[k];
        if(overlapsRect(block, block2)){
            return true;
        }
    }
    if( block.x > (canvas.width - size) || block.x < 0 || block.y < 0 || block.y > (canvas.height - size) ){
        return true;
    }
    return false;
}

/**
 * Draws the ending of game.
 */
function ending(){
    punch.currentTime = 0;
    punch.play();
    theEnd = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = '#73b6ee';
    let width = 200;
    let height = 200;
    let boxX = canvas.width/2 - width/2;
    let boxY = canvas.height/2 - height/2;
    ctx.fillRect(boxX, boxY, width, height);
    ctx.strokeStyle = '#021941';
    ctx.lineWidth = 10;
    ctx.strokeRect(boxX, boxY, width, height);
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    let text = 'Perdiste';
    let textX = boxX + (width/2) - (ctx.measureText(text).width/2);
    let textY = boxY + (height/2) + (getTextHeight(text)/2);
    ctx.fillText(text, textX, textY);
    drawRestart('#014efc');
}

/**
 * Draws the world
 */
function draw(){
    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //food
    ctx.beginPath();
    ctx.font = '25px Arial'
    ctx.fillStyle = 'whiteSmoke';
    ctx.fillText(`Puntuación: ${world.snake.body.length-1}`, size/2, size*1.1);
    ctx.beginPath();
    ctx.fillStyle = '#fe7b00';
    ctx.rect(world.food.x , world.food.y, world.food.size, world.food.size);
    ctx.fill();
    ctx.stroke();
    //snake
    ctx.beginPath();
    ctx.fillStyle = '#AEFF40';
    for( let i = 0; i < world.snake.body.length; i++ ){
        ctx.rect(world.snake.body[i].x, world.snake.body[i].y, world.snake.size, world.snake.size);
        ctx.fill();   
    }
    ctx.stroke();
    //snake-eyes
    ctx.beginPath();
    snakeEyes = snakeEyesDown;
    if(world.snake.dir == 'right') snakeEyes = snakeEyesRight;
    if(world.snake.dir == 'left') snakeEyes = snakeEyesLeft;
    if(world.snake.dir == 'down') snakeEyes = snakeEyesDown;
    if(world.snake.dir == 'up') snakeEyes = snakeEyesUp;
    ctx.drawImage(snakeEyes, world.snake.body[0].x, world.snake.body[0].y, world.snake.size, world.snake.size)
    //border
    ctx.beginPath()
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
}

function restart(){
    theEnd = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = setWorldState( size, 'dir', [ {x: 400, y: 100 } ], numberBTWLimits( 0, canvas.width - size ), numberBTWLimits( 0, canvas.height - size ) );
    moveSnake(world);
}

/**
 * Draws the restart button.
 * @param {String} color 
 */
function drawRestart(color){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#018dfc'
    ctx.lineWidth = 5;
    ctx.fillRect(restartButton.x, restartButton.y, restartButton.width - size*2, restartButton.height - size);
    ctx.strokeRect(restartButton.x, restartButton.y, restartButton.width - size*2, restartButton.height - size);
    ctx.fillStyle = 'white'
    ctx.font = '25px Arial';
    ctx.fillText(restartButton.text, restartButton.x + (restartButton.width/2) - (ctx.measureText(restartButton.text).width/2) - size, 
    restartButton.y + (restartButton.height/2) + (getTextHeight(restartButton.text)/2) - size/2);
}

/**
 * This gets the height of a text.
 * @param {string} text
 * @returns {number}
 */
 let getTextHeight = ( text ) => {
	let metrics = ctx.measureText(text);
	let actualheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	return actualheight;
};

/**
 * returns a number bewteen a and b;
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */

 function numberBTWLimits(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * checks if a rect is overlaped with another.
 * @param {Box} r1 
 * @param {Box} r2 
 * @returns 
 */

 function overlapsRect( r1, r2 ){
	let rect1 = { x: r1.x, y: r1.y, width: size, height: size }
	let rect2 = { x: r2.x, y: r2.y, width: size, height: size }
	
	if (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y) {
			return true;
	 }

	return false;
}

/**
 * Checks if a rectangle is overlapped with the cursor.
 * @param {Box} r1
 * @param {object} event 
 * @returns 
 */

 function cursorOverLapsRect( r1 , event ){
	let rect = { x: r1.x, y: r1.y, width: r1.width, height: r1.height }

	if(rect.x < event.clientX 
		&& (rect.width + rect.x > event.clientX)
		&& rect.y < event.clientY 
		&& (rect.height + rect.y > event.clientY))
		return true;
	return false;
}


//-----------------------------------------------------------------------------------------------------------------

//Listeners

document.body.addEventListener('keydown', ( event ) => {
    let overLapsWithABlock = function( potentialHead ){
        for( let i = 0; i < world.snake.body.length; i++){
            if(overlapsRect(potentialHead, world.snake.body[i])){
                return true;
            }
        }
        return false;
    }
    if( event.key == 'ArrowUp' && !overLapsWithABlock( { x: world.snake.body[0].x, y: world.snake.body[0].y - size } ) && world.snake.dir != 'down' ){
        world.snake.dir = 'up';
    }
    if( event.key == 'ArrowDown' && !overLapsWithABlock( { x: world.snake.body[0].x, y: world.snake.body[0].y + size } ) && world.snake.dir != 'up' ){
        world.snake.dir = 'down';
    }
    if( event.key == 'ArrowLeft' && !overLapsWithABlock( { x: world.snake.body[0].x - size, y: world.snake.body[0].y } ) && world.snake.dir != 'right' ){
        world.snake.dir = 'left';
    }
    if( event.key == 'ArrowRight' && !overLapsWithABlock( { x: world.snake.body[0].x + size, y: world.snake.body[0].y } ) && world.snake.dir != 'left' ){
        world.snake.dir = 'right';
    }
    //console.log(event.key);
    
})

document.body.addEventListener('mousedown', (event) => {
    console.log('1')
    if(theEnd){
        console.log('2')
        if(cursorOverLapsRect( restartButton, event )){
            console.log('3')
            restart();
        }
    }
})

document.body.addEventListener('mousemove', (event) => {
    if(theEnd){
        if(cursorOverLapsRect( restartButton, event )){
            drawRestart('#009fff');
        }
        else{
            drawRestart('#014efc');
        }
    }
})

let playBtn = document.getElementById('play-game-btn');
let instructions = document.getElementById('instructions');
let instructionsBkgd = document.getElementById('background');
let audioBackground = document.getElementById('audio-background');
let exitBtn = document.getElementById('exit');
playBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
exitBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
playBtn.addEventListener('mousedown', () => {
    if(postClicked){
        postClick.currentTime = 0;
        postClick.play();
        postClicked = false;
        setTimeout(() => {
            audioBackground.currentTime = 0;
            audioBackground.play();
            instructions.style.display = `none`;
            instructionsBkgd.style.display = `none`;
            canvas.style.display = `block`;
            exitBtn.style.top = '546px';
            exitBtn.style.left = '0%';
            exitBtn.style.width = `97.1%`;
            exitBtn.style.borderRadius = `0px`;
            exitBtn.style.padding = `17px 10px`;
            exitBtn.style.backgroundColor = ` #0044CC`;
			exitBtn.style.borderColor = `#002B80`;
			exitBtn.addEventListener('mouseover', () => { exitBtn.style.backgroundColor = ` #0073E6`; });
			exitBtn.addEventListener('mouseout', () => { exitBtn.style.backgroundColor = ` #0044CC`; });
            moveSnake(world);
        }, 1000);
    }
})