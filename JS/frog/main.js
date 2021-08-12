
//Classes - animation
class Pond{
    
    constructor(x, y){
        this._x = x;
        this._y = y;
    }
    
    get x(){
        return this._x;
    }

    set x(x){
        this._x = x;
    }

    get y(){
        return this._y;
    }

    set y(y){
        this._y = y
    }

}

//----------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------

//canvas
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Variables - animation
let frogg = { x: 10, y: 300 }; //{ x: 10, y: 350 } Initial state
let frog = document.getElementsByTagName('img')[0];
let body = document.getElementById('body');
let ponds = document.getElementById('pond');
let locations = {
    'p1': { x: 300, y: 440 },
    'p2': { x: 490, y: 290 },
    'p3': { x: 670, y: 390 },
    'p4': { x: 820, y: 260 },
    'p5': { x: 1040, y: 360 },
    'p6': { x: 1150, y: 210 }
}
let p1 = makePond(300, 120);
let p2 = makePond(330, 280);
let p3 = makePond(350, 180);
let p4 = makePond(340, 310);
let p5 = makePond(400, 210);
let p6 = makePond(350, 360);

//variables - canvas
let titleContent = `       Ayuda a Jelly!`;
let boxesSize = 100;
let titleX = (canvas.width/2) - (ctx.measureText(titleContent).width) - (boxesSize);
let titleY = (canvas.height/2) - (canvas.height/2)*0.75;
let spaceBtwBoxes = boxesSize + 25;
let boxesX = (canvas.width/2) - (ctx.measureText(titleContent).width) + (boxesSize / 2);
let boxesY = canvas.height- canvas.height*0.2;
let diffSize = 10;
let emptyBoxesSize = boxesSize + diffSize;
let emptyBoxesY = boxesY - 150;
let imagesX = (canvas.width/2) - 100; //100 because the area of images are 200x200px.
let imagesY = (canvas.height/2) - 100 - spaceBtwBoxes/2 - boxesSize/4; 
let beginning = true;
let exitBtn = document.getElementById('exit');

//array of boxes
let boxes = [];
let undraggableBoxes = [];

//Sounds effects
let rightAnswer = new Audio('../../music/frog/Correct Answer - Sound Effect.mp3');
let wrongAnswer = new Audio('../../music/frog/Wrong Clakson Sound Effect.mp3');
let victory = new Audio('../../music/frog/applause3.mp3');
let frogSound = new Audio("../../music/frog/Frog Sound Effect.mp3");
let pondSound = new Audio("../../music/frog/sound-effect-pond-water.mp3");
let prettyGood = new Audio("../../music/frog/very-good.mp3");
let rollOver = new Audio(`../../music/frog/rollover-sound-effect.mp3`);
let postClick = new Audio(`../../music/frog/post-click sound effect.mp3`);
let postClicked = true;

//----------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------

//functions

/**
 * Displays in screen a pond
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Pond}
 */

function makePond(x, y){
    let p = new Pond(x, y);
    let foo = document.createElement('img');
    foo.id = `pond`;
    foo.src = `../../images/frog/pond.png`;
    foo.style.left = `${p.x}px`;
    foo.style.bottom = `${p.y}px`;
    body.appendChild(foo);
    return p;
}

/**
 * Draws the frog in screen
 */

function drawFrog(){
    frog.remove();
    frog = document.createElement('img');
    frog.id = `frog`;
    frog.src = `../../images/frog/frog.gif`;
    frog.style.left = `${frogg.x}px`;
    frog.style.top = `${frogg.y}px`;
    body.appendChild(frog);
}

/**
 * Sets an animation to the frog
 * @param {Number} speedX 
 * @param {Number} speedY 
 * @param {Number} toX 
 * @param {Number} toY 
 */

//toX = 1; frogX = 10; moves to left => while frog > toX: frogX -= posX;
//toX = 100; frogX = 10; moves to right => while frogX < toX: frogX += posX;
//toY = 1; frogY = 10; moves to up => while frogY > toY: frogY -= posY;
//toY = 100; frogY = 10; moves to down => while frogY < toY: frogY += posY;

function animationFrog(speedX, speedY, toX, toY){
    let stopX = false;
    let stopY = false;
    let posX = Math.abs(speedX);
    let posY = Math.abs(speedY);
    let animationLocal = () => {
        
        if(frogg.x < toX){
            frogg.x += posX;    
        }
        else{
            if(frogg.x > toX){
                frogg.x -= posX;
            }
            else{ stopX = true; }
        }
        if(frogg.y < toY ){
            frogg.y += posY;   
        }
        else{
            if(frogg.y > toY ){
                frogg.y -= posY;   
            }
            else{ stopY = true; }
        }
        
        if( stopX && stopY ) return;
        
        drawFrog();
        requestAnimationFrame(animationLocal);
    }
    animationLocal();
};

/**
 * Moves the frog according to the score
 * @param {Number} score 
 */

function moveFrog( score ){
    body.style.display = `block`;
    canvas.style.display = `none`;
    let p = locations[`p${score}`];
    animationFrog(1, 1, p.x, p.y );
}

/**
 * waits until frog arrives to one pond. must be executed after moveFrog();
 */

function waitFrog(){
    let frogArrived = frogg.x == locations[`p${score}`].x && frogg.y == locations[`p${score}`].y;
    if(!frogArrived){
        setTimeout(() => {
            waitFrog();
        }, 2000);
    }
    else{
        body.style.display = `none`;
        canvas.style.display = `block`;
        frogSound.pause();
        frogSound.currentTime = 0;
        pondSound.pause();
        pondSound.currentTime = 0;
        restart();
    }
}

//functions -----------------------------------------------------------------------------------------------------------


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
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke === 'undefined') {
	  stroke = true;
	}
	if (typeof radius === 'undefined') {
	  radius = 5;
	}
	if (typeof radius === 'number') {
	  radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
	  var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	  for (var side in defaultRadius) {
		radius[side] = radius[side] || defaultRadius[side];
	  }
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
	  ctx.fill();
	}
	if (stroke) {
	  ctx.stroke();
	}

}

/**
 * Make an array of boxes.
 * @param {string} text 
 * @param {number} size 
 * @param {number} x 
 * @param {number} y 
 * @param {number} fillBox 
 * @param {number} fillLetter 
 * @param {number} draggable 
 */

function makeBoxes( text, size, x, y, fillBox, fillLetter, draggable ){
	Box.counter2 = text.length;
	Box.boxesCounter = 0;
	Box.word = text;
    let isFocusable = (text) => {
        if(text == ' '){
            return true;
        }
        else{
            return false;
        }
    }
	let box = ''; 
	x = centerBoxesInX(Box.counter2);
    if(!draggable){
        for( let n1 = 0, n2 = 1; n2 <= text.length; n1++, n2++ ){
            if(Box.boxesCounter === 0 ){
                box = new Box(text.slice(n1, n2), size, x, y, fillBox, fillLetter, null, null, false, null, isFocusable(text.slice(n1, n2)));
                undraggableBoxes.push( box );
                Box.boxesCounter++;
            }
            else{
                x += (spaceBtwBoxes);
                box = new Box(text.slice(n1, n2), size, x, y, fillBox, fillLetter, null, null, false, null, isFocusable(text.slice(n1, n2)));
                undraggableBoxes.push( box );
                Box.boxesCounter++;
            }
        }
    }
    else{
        x = centerBoxesInX(answersArray.length);
        for( let i = 0; i < answersArray.length; i++ ){
            if(Box.boxesCounter === 0 ){
                box = new Box(answersArray[i], size, x, y, fillBox, fillLetter);
                boxes.push( box );
                Box.boxesCounter++;
            }
            else{
                x += (spaceBtwBoxes);
                box = new Box(answersArray[i], size, x, y, fillBox, fillLetter);
                boxes.push( box );
                Box.boxesCounter++;
            }
        }
    }
}

/**
 * Draws the quantity of boxes required according to the word
 * @param {string} text
 */

function drawBoxes( boxs, fill, stroke ){
	//------------------------------------------------------------------------------------------
	for( i in boxs ){
		if(i === 0 ){
			ctx.fillStyle = boxs[i].fillBox;
			if(boxs[i].fillStroke != null){
				ctx.strokeStyle = boxs[i].fillStroke;
				ctx.lineWidth = '5';
				stroke = true;
			}
			else{ 
				stroke = false; 
			};
            if(boxs[i].focusable) ctx.fillStyle = `#8cccf6`;
			roundRect(ctx, boxs[i].x, boxs[i].y, boxs[i].size, boxs[i].size, 30, fill, stroke);
			ctx.fillStyle = boxs[i].fillLetter;
			ctx.font = '30px Arial';
			ctx.fillText( boxs[i].text, boxs[i].x + (boxs[i].size/2) - (ctx.measureText(boxs[i].text).width / 2), boxs[i].y + (boxs[i].size/2) + (getTextHeight(boxs[i].text) / 2));
		}
		else{
			ctx.fillStyle = boxs[i].fillBox;
			if(boxs[i].fillStroke != null){
				ctx.strokeStyle = boxs[i].fillStroke;
				ctx.lineWidth = '5';
				stroke = true;
			}
			else{ 
				stroke = false;
			};
            if(boxs[i].focusable) ctx.fillStyle = `#8cccf6`;
			roundRect(ctx, boxs[i].x, boxs[i].y, boxs[i].size, boxs[i].size, 30, fill, stroke);
			ctx.fillStyle = boxs[i].fillLetter;
			ctx.font = '30px Arial';
			ctx.fillText( boxs[i].text, boxs[i].x + (boxs[i].size/2) - (ctx.measureText(boxs[i].text).width / 2), boxs[i].y + (boxs[i].size/2) + (getTextHeight(boxs[i].text) / 2));
		}
	//------------------------------------------------------------------------------------------
	}
}

/**
 * checks if a rect is overlaped with another.
 * @param {Box} r1 
 * @param {Box} r2 
 * @returns 
 */

function overlapsRect( r1, r2 ){
	let rect1 = { x: r1.x, y: r1.y, width: r1.size, height: r1.size }
	let rect2 = { x: r2.x, y: r2.y, width: r2.size, height: r2.size }
	
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
	let rect = { x: r1.x, y: r1.y, width: r1.size, height: r1.size };
	if(r1.isRectangle){
		rect = { x: r1.x, y: r1.y, width: r1.width, height: r1.height };
	}

	if(rect.x < event.clientX 
		&& (rect.width + rect.x > event.clientX)
		&& rect.y < event.clientY 
		&& (rect.height + rect.y > event.clientY))
		return true;
	return false;
}

/**
 * With this function, it's possible to center the amount of boxes.
 * @returns {number} The middle of the boxes width;
 */

let centerBoxesInX = (boxesQuantity) => {
	let middleOfWidthBoxesMinusPosFirstBox = () => {
		let x = boxesX;
		if( boxesQuantity === 1 ) return 0;
		else{
			let positionFirstBox = x;
			let widthOfBoxes = x + (spaceBtwBoxes * (boxesQuantity-1) ) + boxesSize; 
			let diffBtwBoxes = ( widthOfBoxes - ( ( widthOfBoxes - positionFirstBox ) / 2 ) );
			return diffBtwBoxes - positionFirstBox - (boxesSize/2); 
		}
	}
	return boxesX - middleOfWidthBoxesMinusPosFirstBox();
}

/**
 * returns a number bewteen a and b;
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */

function numberBTWLimits(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

//adds this function to Array objects.
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function setUnOrderArray( array ){
    for( let i = 0; i < 50; i++ ){
        let random1 = numberBTWLimits(0, array.length-1);
        let random2 = numberBTWLimits(0, array.length-1);
        array.move(random1, random2);
    }
    return array;
}

/**
 * This function validates if there're boxes overlapped with empty boxes;
 */

function checkIfOverlapped(){
	if(actualObject != null){
		for(let i = 0; i < undraggableBoxes.length; i++){
			let box = undraggableBoxes[i];
			if(overlapsRect(actualObject, box) && box == theNearest(actualObject)){
				if(box._containsBox == null && box.focusable){
					actualObject.x = box.x + (diffSize / 2);
					actualObject.y = box.y + (diffSize / 2); 
					box.fillStroke = '#0554fa';
					box.containsBox = actualObject;
					checkIfComesOut();
					draw();
				}
				else{
					actualObject.x = beforeX;
					actualObject.y = beforeY;
					if(getOverlappedEmptyBox(actualObject)){
						let emptyBox = getOverlappedEmptyBox(actualObject);
						emptyBox.fillStroke = '#0554fa';
						emptyBox.containsBox = actualObject;
					}
					draw();
				}
			}
		}
	}
}


/**
 * Checks if a box contained comes out from an empty box;
 */

function checkIfComesOut(){
	if(actualObject != null){
		for( let i = 0; i < undraggableBoxes.length; i++ ){
			let box = undraggableBoxes[i];
			if(box._containsBox == actualObject && !overlapsRect(box, actualObject)){
				delete box._containsBox;
				delete box._fillStroke;
				draw();
			}
		}
	}
}

/**
 * Returns the distance between two points.
 * @param {object} object1 
 * @param {object} object2 
 * @returns {number}
 */

function distance( object1, object2 ){
	return Math.sqrt( ( object2.x - object1.x )**2 + ( object2.y - object1.y )**2 );
}

/**
 * Finds the distance between two rectangles.
 * @param {Box} rect1 
 * @param {Box} rect2 
 * @returns {Number}
 */

function distanceBtwRect( rect1, rect2 ){
	let midRect1 = { x: rect1.x + rect1.size/2 , y: rect1.y + rect1.size/2 };
	let midRect2 = { x: rect2.x + rect2.size/2 , y: rect2.y + rect2.size/2 };
	return distance(midRect1, midRect2);
}

/**
 * Returns the nearest empty box to the actual object if exist.
 * @param {Box} object 
 * @returns {Box}
 */

function getOverlappedEmptyBox( object ){
	for( i in undraggableBoxes ){
		if( overlapsRect( object, undraggableBoxes[i] ) ){
			return undraggableBoxes[i];
		}
	}
	return null;
}

/**
 * Returns the nearest empty box to the current object.
 * @param {Box} box 
 * @param {Box} currentObject 
 * @returns {Boolean}
 */

function theNearest( currentObject ){
	let nearest = undraggableBoxes[0];
	for( i in undraggableBoxes ){
		if( distanceBtwRect( undraggableBoxes[i], currentObject ) < distanceBtwRect( nearest, currentObject ) ){
			nearest = undraggableBoxes[i];
		}
	}
	return nearest;
}

/**
 * The function analyzes the message of the empty boxes;
 */

function finalMessage(){
	if(allEmptyBoxesContainsBoxes()){
		let finalMessage = '';
		for( i in undraggableBoxes ){
			finalMessage += undraggableBoxes[i]._containsBox.text;
		}
		return finalMessage;
	}
}

/**
 * checks if all empty boxes contain draggable boxes.
 * @returns {Boolean}
 */

function allEmptyBoxesContainsBoxes(){
	let counter = 0;
	for( i in undraggableBoxes ){
        let box = undraggableBoxes[i];
		if(box.containsBox != null && box.focusable){
			counter++;
		}
	}
	if(counter === Box.focusable && !beginning){
		return true;
	}
	return false;
}

/**
 * Checks if a number is a whole number
 * @param {Number} number 
 * @returns {Boolean}
 */

function isWholeNumber( number ){
	let num = number.toString();
	for( let i = 0; i < num.length; i++ ){
		if(num[i] == '.'){
			return false;
		}
	}
	return true;
}

/**
 * Checks if a number is natural
 * @param {Number} number 
 * @returns {Boolean}
 */

function isNaturalNumber( number ){
	if(number >= 0 && isWholeNumber(number)){
		return true;
	}
	return false;
}

/**
 * Selects a random arithmetic operator
 */

function pickOperator(){
    let random = numberBTWLimits(1, 4);
    if(random == 1){
        return '+';
    }
    if(random == 2){
        return '-';
    }
    if(random == 3){
        return 'x';
    }
	if(random == 4){
		return '/';
	}
}

/**
 * Sets the exercise sentence.
 */

function setExercise(){
    let operator = pickOperator();
    let number1 = numberBTWLimits(0, 9);
    let number2 = numberBTWLimits(0, 9);
	let operations = {
        '+': number1 + number2,
        '-': number1 - number2,
        '/': number1 / number2,
        'x': number1 * number2
    }
    if((operator == '/' && number2 == 0) || (number1 == 0 && operator == '/' && number2 == 0) || 
		!isNaturalNumber(operations[operator])){
        return setExercise();
    }
    let exercise = `${number1}${operator}${number2}`;
    return { exercise: exercise, number1: number1, number2: number2, operator: operator };
}

/**
 * Picks answers as options to choose
 */

function pickAnswers(){
    let operation = {
        '+': word.number1 + word.number2,
        '-': word.number1 - word.number2,
        '/': word.number1 / word.number2,
        'x': word.number1 * word.number2
    }
    let roundPerDigits = function(number, numberOfDigits){
        return Math.trunc( number * (10**numberOfDigits) ) / (10**numberOfDigits);
    }
    let thereisOneRepeated = function(){
        for( let i = 0; i < arguments.length; i++ ){
            let n1 = arguments[i];
            for(let u = i + 1; u < arguments.length; u++){
                let n2 = arguments[u];
                if(n1 == n2){
                    return true;
                }
            }
        }
        return false;
    }
    let number1 = roundPerDigits(operation[word.operator], 2);
    let number2 = roundPerDigits(numberBTWLimits(0, 9), 2);
    let number3 = roundPerDigits(numberBTWLimits(0, 9), 2);
    let number4 = roundPerDigits(numberBTWLimits(0, 9), 2);   
    while(thereisOneRepeated(number1, number2, number3, number4)){
        number2 = roundPerDigits(numberBTWLimits(0, 9), 2);
        number3 = roundPerDigits(numberBTWLimits(0, 9), 2);
        number4 = roundPerDigits(numberBTWLimits(0, 9), 2);
    }
    return `${number1}_${number2}_${number3}_${number4}`;
}

/**
 * Validates if the answer is right;
 * @returns {Boolean}
 */

function correctAnswer(){
    let operations = {
        '+': word.number1 + word.number2,
        '-': word.number1 - word.number2,
        '/': word.number1 / word.number2,
        'x': word.number1 * word.number2
    }
    let finalAnswer = () => {
        for( i in undraggableBoxes ){
            if(undraggableBoxes[i].containsBox != null && undraggableBoxes[i].focusable){
                return undraggableBoxes[i].containsBox.text;
            }
        }
    }
	if(finalAnswer() == operations[word.operator]){
		return true;
	}
	return false;
}

/**
 * paint a box in canvas.
 * @param {Box} box 
 * @param {Boolean} fill 
 * @param {Boolean} stroke 
 */

function drawBox( box, fill, stroke ){
	ctx.fillStyle = box.fillBox;
	ctx.strokeStyle = box.fillStroke;
	ctx.lineWidth = '5';
	roundRect(ctx, box.x, box.y, box.size, box.size, 30, fill, stroke);
	ctx.fillStyle = box.fillLetter;
	ctx.font = '30px Arial';
	ctx.fillText( box.text, box.x + (box.size/2) - (ctx.measureText(box.text).width / 2), box.y + (box.size/2) + (getTextHeight(box.text) / 2));
}

/**
 * The same as drawBox, but with the difference that this function counts the height;
 * @param {Box} box 
 * @param {Boolean} fill 
 * @param {Boolean} stroke 
 */

function drawRect( rect, fill, stroke ){
	ctx.fillStyle = rect.fillBox;
	ctx.strokeStyle = rect.fillStroke;
	ctx.lineWidth = '5';
	roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 30, fill, stroke);
	ctx.fillStyle = rect.fillLetter;
	ctx.font = '30px Arial';
	if(isWordIn(rect.text, '\n')){
		let lines = rect.text.split(' \n ');
		let spaceBtwLines = 40;
		let howManyBreaks = howManyWordsInText( rect.text, '\n' );
		let heightOfWords = () => {
			let counter = 0;
			for( let i = 0; i < lines.length; i++ ){
				counter += getTextHeight(lines[i]);
			}	
			return counter;
		}
		let wordsHeight = heightOfWords();
		let groupHeight = wordsHeight + ( spaceBtwLines * howManyBreaks );
		let actualheight =  rect.height - groupHeight;

		for( i in lines ){
			
			ctx.fillText( lines[i], rect.x + (rect.width/2) - (ctx.measureText(lines[i]).width / 2), rect.y + (rect.height/2) + (getTextHeight(lines[i]) / 2) + (spaceBtwLines*i) - actualheight);	
		}
	}
	else{ 
		ctx.fillText( rect.text, rect.x + (rect.width/2) - (ctx.measureText(rect.text).width / 2), rect.y + (rect.height/2) + (getTextHeight(rect.text) / 2));
	}
}

/**
 * Removes an element from a list.
 * @param {object} list 
 * @param {*} element 
 * @returns {object}
 */

function eraseElement( list, element ){
	let result = [];
	let firstList = [];
	let secondList = [];
	for( i in list ){
		if( list[i] === element ){
			firstList = list.splice(0, i); //from start (0-index), removes i elements, also removes elements from list.
			secondList = list.splice(1, list.length-1); 
			result = firstList.concat(secondList);
			return result;
		}
	}
	return `element not found`;
}

/**
 * Checks if there's a word in a text.
 * @param {string} text 
 * @param {string} word 
 * @returns {boolean}
 */

function isWordIn( text, word ){
	let wordInText = '';
	for( i in text ){
		if(text[i] == ' '){
			if(wordInText == word){
				return true;
			}
			wordInText = '';
		}
		else wordInText += text[i];
		if( i == text.length-1 ){
			if(wordInText == word){
				return true;
			}
		}
	}
	return false;
}

/**
 * checks how many times is a word repeated in a text.
 * @param {string} text 
 * @param {string} word 
 * @returns {number}
 */

function howManyWordsInText( text, word ){
	let wordInText = '';
	let counter = 0;
	for( i in text ){
		if(text[i] == ' '){
			if(wordInText == word){
				counter++;
			}
			wordInText = '';
		}
		else wordInText += text[i];
		if( i == text.length-1 ){
			if(wordInText == word){
				counter++;
			}
		}
	}
	return counter;
}

/**
 * restarts the game;
 */

function restart(){
	clickedValidator = false;
	if(score < maxScore){
        Box.focusable = 0;
		backgroundVoice = chooseSound('question');
        backgroundVoice.play();
		exitBtn.style.display = `block`;
		
		boxes.length = 0;
		undraggableBoxes.length = 0;

		word = setExercise();
        answers = pickAnswers();
        answersArray = setUnOrderArray((answers.split('_')));
		
		makeBoxes(answers, boxesSize, boxesX, boxesY, 'white', 'black', true);
	    makeBoxes(`${word.exercise}= `, emptyBoxesSize, boxesX, emptyBoxesY, 'white', 'black', false);
		draw();
	}
	else{
		ending();
	}
}

/**
 * restarts the whole game.
 */

function restartGame(){
	victory.pause();
	victory.currentTime = 0;
	theEnd = false;
	score = 0;
	frogg = { x: 10, y: 300 };
	body.style.display = `block`;
    canvas.style.display = `none`;
	let backgroundVoice = chooseSound('introduction');
    backgroundVoice.play();
    drawFrog();
    setTimeout(() => {
        body.style.display = `none`;
        canvas.style.display = `block`;
		restart();
    }, 2000);
}

/**
 * shows a popup window in ending game.
 */

function ending(){
	victory.play();
	theEnd = true;
	boxes.length = 0;
	undraggableBoxes.length = 0;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// pop-up window
	let popUpMessage = `Felicidades, me complace anunciar que \n ganaste, sigue practicando campeon@ \n BIEN HECHO!!`;
	let popUpWidth = 600;
	let popUpHeight = 200;
	let popUpX = (canvas.width/2) - (popUpWidth/2); 
	let popUpY = (canvas.height/2) + getTextHeight(popUpMessage)/8 - (popUpHeight/2);
	let popUpFillBox = 'whitesmoke';
	let popUpFillLetter = '#0554fa';
	let popUpFillStroke = '#0554fa';
	let popUpWindow = new Box(popUpMessage, popUpWidth, popUpX, popUpY, popUpFillBox, popUpFillLetter, popUpFillStroke, null, true, popUpHeight );
	
	let image = chooseImg('smile');
	image.onload = () => {
		ctx.drawImage( image, popUpY + imagesX, popUpY + imagesY, 50, 50 );
	}
	drawRect( restartButton, true, true );
	drawRect( popUpWindow, true, true );
}

/**
 * Selects the correct image acording to the displayed word.
 * @param {string} wordToCheck 
 * @returns {Image}
 */

 function chooseImg( wordToCheck ){
	let img = new Image();
	img.src = `../../images/frog/${wordToCheck}.png`;
	return img;
}

/**
 * Chooses the sound for the background voice.
 * @param {string} wordToCheck 
 * @returns {Audio}
 */

function chooseSound( wordToCheck ){
	let sound = new Audio();
	sound.src = `../../music/frog/${wordToCheck}.mp3`;
	return sound;
}


//------------------------------------------------------------------------------------------------------------------------------------------

//Classes - canvas
class Box{
	static boxesCounter = 0;
	static counter2 = 0;
    static focusable = 0; 
	static word = '';

	constructor( text, size, x, y, fillBox, fillLetter, fillStroke, containsBox, isRectangle, height, focusable){
		this._x = x;
		this._y = y;
		this._size = size;
		this._text = text;
		this._fillBox = fillBox;
		this._fillLetter = fillLetter;
		this._fillStroke = fillStroke;
		this._containsBox = containsBox;
		this._isRectangle = isRectangle;
        if(focusable){
            this._focusable = focusable;
            Box.focusable++;
        }
		if(isRectangle){
			this._width = size;
			this._height = height;
			this._containsBox = containsBox;
		}
	}

	get text(){
		return this._text;
	}

	set text(text){
		this._text = text;
	}

	get size(){
		return this._size;
	}

	set size(size){
		this._size = size;
	}

	get x(){
		return this._x;
	}

	set x(x){
		this._x = x;
	}

	get y(){
		return this._y;
	}

	set y(y){
		this._y = y;
	}

	get fillBox(){
		return this._fillBox;
	}

	set fillBox(fillBox){
		this._fillBox = fillBox;
	}

	get fillLetter(){
		return this._fillLetter;
	}

	set fillLetter(fillLetter){
		this._fillLetter = fillLetter;
	}

	get fillStroke(){
		return this._fillStroke;
	}

	set fillStroke(fillStroke){
		this._fillStroke = fillStroke;
	}
	
	get containsBox(){
		return this._containsBox;
	}

	set containsBox(containsBox){
		this._containsBox = containsBox;
	}
	
	get width(){
		return this._width;
	}

	set width(width) {
		this._width = width;	
	}

	get height(){
		return this._height;
	}

	set height(height){
		this._height = height;
	}

    get focusable(){
        return this._focusable;
    }

    set focusable(focusable){
        this._focusable = focusable;
    }

	get isRectangle(){
		return this._isRectangle;
	}

	set isRectangle(isRectangle){
		this._isRectangle = isRectangle;
	}

}

//----------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------

//other variables
let firstX, firstY, beforeX, beforeY;
//validator button
let validatorWidth = 300;
let validatorHeight = 100;
let validatorText = 'Listo';
let validatorX = (canvas.width/2) - (validatorWidth/2) + (boxesSize / 4) - (ctx.measureText(validatorText).width);
let validatorY = canvas.height-(canvas.height*0.7);
let validator = new Box(validatorText, validatorWidth, validatorX, validatorY, '#0554fa', 'whitesmoke', 'whitesmoke', null, true, validatorHeight )
//restart button
let restartX = 50;
let restartY = canvas.height - 140;
let restartWidth = 300;
let restartHeigth = 100;
let restartFillBox = '#0554fa';
let restartStroke = 'whiteSmoke';
let restartFillLetter = 'whiteSmoke';
let restartText = `Reiniciar Juego`;
let restartButton = new Box(restartText, restartWidth, restartX, restartY, restartFillBox, restartFillLetter, restartStroke, null, true, restartHeigth);
let word = setExercise();
let answers = pickAnswers();
let answersArray = setUnOrderArray((answers.split('_')));
let theEnd = false;
let clickedValidator = false;
let maxScore = 6;
let score = 0;
let clickedRestart = true;

//For dragging squares;
let draw = () => {	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '40px Arial';
	ctx.fillText(titleContent, titleX, titleY);
	drawBoxes( undraggableBoxes, true, true );
	drawBoxes( boxes, true, false );
}, actualObject;

//----------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------

//Listeners

//The first status of game
window.addEventListener('load', () => {
    let playBtn = document.getElementById('play-game-btn');
	let instructions = document.getElementById('instructions');
	let insBackground = document.getElementById('background');
	let audioBackground = document.getElementById('audio');
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
				insBackground.style.display = `none`;
				instructions.style.display = `none`;
				exitBtn.style.display = `none`;
				body.style.display = `block`;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				let backgroundVoice = chooseSound('introduction');
				backgroundVoice.play();
				drawFrog();
				setTimeout(() => {
					body.style.display = `none`;
					canvas.style.display = `block`;
					exitBtn.style.backgroundColor = ` #3377FF`;
					exitBtn.style.borderColor = `#4D4DFF`;
					exitBtn.addEventListener('mouseover', () => { exitBtn.style.backgroundColor = ` #3399FF`; });
					exitBtn.addEventListener('mouseout', () => { exitBtn.style.backgroundColor = ` #3377FF`; });
					exitBtn.style.display = `block`;
					backgroundVoice = chooseSound('question');
					backgroundVoice.play();
				}, 2000);
				ctx.fillStyle = 'white';
				ctx.font = '40px Arial';
				ctx.fillText(titleContent, titleX, titleY);
				makeBoxes(answers, boxesSize, boxesX, boxesY, 'white', 'black', true);
				makeBoxes(`${word.exercise}= `, emptyBoxesSize, boxesX, emptyBoxesY, 'white', 'black', false);
				drawBoxes( boxes, true, false );
				drawBoxes( undraggableBoxes, true, false );
				setTimeout(() => { beginning = false; }, 1000);
			}, 1000);
		}
	})
})

//mousedown listeners
document.body.addEventListener('mousedown', ( event ) => {
	if(!theEnd){
		for( i in boxes ){
			if(cursorOverLapsRect(boxes[i], event)){
				actualObject = boxes[i];
				firstX = event.clientX - boxes[i].x;
				firstY = event.clientY - boxes[i].y;
				beforeX = boxes[i].x;
				beforeY = boxes[i].y;
			}
		}
	}
})
document.body.addEventListener('mousedown', event => {
	if(!theEnd && !clickedValidator){
		if(allEmptyBoxesContainsBoxes()){
			if(cursorOverLapsRect( validator, event)){		
				if(correctAnswer()){
					score++;
					clickedValidator = true;
                    rightAnswer.currentTime = 0;
		            rightAnswer.play();
					prettyGood.currentTime = 0;
					prettyGood.play();
					for(let i = 0; i < undraggableBoxes.length; i++){
						undraggableBoxes[i].fillStroke = `#2BFF00`;
					}
					draw();
					setTimeout(() => {
					exitBtn.style.display = `none`;	
					frogSound.currentTime=0;
					frogSound.loop = true;
                    frogSound.play();
					pondSound.currentTime=0;
					pondSound.loop = true;
                    pondSound.play();
                    moveFrog(score);
                    waitFrog();
					}, 1000);
				}
				else{
					for( i in undraggableBoxes ){
						wrongAnswer.currentTime = 0;
						wrongAnswer.play();
                        if(undraggableBoxes[i].focusable){    
                            undraggableBoxes[i].fillStroke = '#FF3D3B'
                            draw();
                            setTimeout(() => {
                                for( i in undraggableBoxes ){
                                    if(undraggableBoxes[i].focusable){
                                        undraggableBoxes[i].fillStroke = '#0554fa';
                                        draw();
                                        drawRect( validator, true, true );
                                    }
                                }
                            }, 1000);
                        }
					}
				}
			}
		}
	}
})
document.body.addEventListener('mousedown', (event) => {
	if(theEnd){
		if(cursorOverLapsRect(restartButton, event)){
			restartGame();
		}
	}
})

//mousemove listeners
document.body.addEventListener('mousemove', (event) => {
	if(!theEnd){
		if(actualObject != null){
			actualObject.x = event.clientX - firstX;
			actualObject.y = event.clientY - firstY;
			draw();
		}
	}
});
document.body.addEventListener('mousemove', checkIfComesOut );
document.body.addEventListener('mousemove', event => {
	if(!theEnd){
		if(allEmptyBoxesContainsBoxes()){
			if(cursorOverLapsRect( validator, event )){		
				validator.fillStroke = '#0554fa';
				validator.fillBox = 'whitesmoke';
				validator.fillLetter = '#0554fa';
				drawRect( validator, true, true );
			}
			else{
				validator.fillStroke = 'whitesmoke';
				validator.fillBox = '#0554fa';
				validator.fillLetter = 'whitesmoke';
				drawRect( validator, true, true );
			}
		}
	}
});
document.body.addEventListener('mousemove', (event) => {
	if(theEnd){
		if(cursorOverLapsRect(restartButton, event)){
			restartButton.fillStroke = '#0554fa';
			restartButton.fillBox = 'whitesmoke';
			restartButton.fillLetter = '#0554fa';
			drawRect( restartButton, true, true );
		}
		else{
			restartButton.fillStroke = 'whitesmoke';
			restartButton.fillBox = '#0554fa';
			restartButton.fillLetter = 'whitesmoke';
			drawRect( restartButton, true, true );
		}
	}
});

//mouseup listeners
document.body.addEventListener('mouseup', checkIfOverlapped);

document.body.addEventListener('mouseup', event => {
	if(!theEnd){
		if(allEmptyBoxesContainsBoxes()){
			validator.fillStroke = 'whitesmoke';
			validator.fillBox = '#0554fa';
			validator.fillLetter = 'whitesmoke';
			drawRect( validator, true, true );
		}
	}
})

document.body.addEventListener('mouseup', event => {
	if(!theEnd){
		actualObject = null;
	}
});

//----------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------
