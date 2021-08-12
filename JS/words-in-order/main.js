//canvas
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

//Resizing
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//variables

let titleContent = `  Adivina las palabras!`;
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
let postClicked = true;

//array of words
let commonWords = ['Perro','Bus','Mamá','Papá','Banana','Gato', 'Limón', 'Escuela', 'Libro', 'Casa', 'Dinero',
'Hospital', 'Ciudad', 'Pista', 'Mano', 'Hermano', 'Hermana'];

//array of boxes
let boxes = [];
let undraggableBoxes = [];

//Sounds effects
let rightAnswer = new Audio('../../music/words-in-order/Correct Answer - Sound Effect.mp3');
let wrongAnswer = new Audio('../../music/words-in-order/Wrong Clakson Sound Effect.mp3');
let victory = new Audio('../../music/words-in-order/applause3.mp3');
let rollOver = new Audio(`../../music/geometric-shapes/rollover-sound-effect.mp3`);
let postClick = new Audio(`../../music/geometric-shapes/post-click sound effect.mp3`);

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
	let box = '';
	x = centerBoxesInX();
	for( let n1 = 0, n2 = 1; n2 <= text.length; n1++, n2++ ){
		if(Box.boxesCounter === 0 ){
			box = new Box(text.slice(n1, n2), size, x, y, fillBox, fillLetter);
			if (draggable) boxes.push( box );
			else undraggableBoxes.push( box );
			Box.boxesCounter++;
		}
		else{
			x += (spaceBtwBoxes);
			box = new Box(text.slice(n1, n2), size, x, y, fillBox, fillLetter);
			if (draggable) boxes.push( box );
			else undraggableBoxes.push( box );
			Box.boxesCounter++;
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

let centerBoxesInX = () => {
	let middleOfWidthBoxesMinusPosFirstBox = () => {
		let x = boxesX;
		if( Box.counter2 === 1 ) return 0;
		else{
			let positionFirstBox = x;
			let widthOfBoxes = x + (spaceBtwBoxes * (Box.counter2-1) ) + boxesSize; 
			let diffBtwBoxes = ( widthOfBoxes - ( ( widthOfBoxes - positionFirstBox ) / 2 ) );
			return diffBtwBoxes - positionFirstBox - (boxesSize/2); 
		}
	}
	return boxesX - middleOfWidthBoxesMinusPosFirstBox();
}

/**
 * returns a long empty string, for drawing some empty boxes.
 * @param {string} string 
 */

function emptyStringWithLength( string ){
	let emptyString = '';
	for( i in string ){
		emptyString += ' ';
	}
	return emptyString;
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

/**
 * puts a string in unorder.
 * @param {string} string 
 */

function setUnOrder( string ){
	let result = '';
	let random = numberBTWLimits(0, string.length-1);
	
	for( i in string ){
		result += string[random];
		string = string.replace( string[random], '' );
		random = numberBTWLimits(0, string.length-1);
	}

	return result;
}

/**
 * This function validates if there're boxes overlapped with empty boxes;
 */

function checkIfOverlapped(){
	if(actualObject != null){
		for(let i = 0; i < undraggableBoxes.length; i++){
			let box = undraggableBoxes[i];
			if(overlapsRect(actualObject, box) && box == theNearest(actualObject)){
				if(box._containsBox == null){
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
		if(undraggableBoxes[i]._containsBox != null){
			counter++;
		}
	}
	if(counter === Box.counter2 && !beginning){
		return true;
	}
	return false;
}
 
/**
 * returns a random word
 * @returns {number}
 */

function pickRandomWord(){
	let random = numberBTWLimits(0, commonWords.length-1);
	if(commonWords.length > 1) return commonWords[random];	
	return commonWords[0];
}

/**
 * Validates if the answer is right;
 * @returns {Boolean}
 */

function correctAnswer(){
	if(finalMessage() === word){
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
		console.log(actualheight)

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
		rightAnswer.currentTime = 0;
		rightAnswer.play();
		commonWords = eraseElement(commonWords, word);
		boxes.length = 0;
		undraggableBoxes.length = 0;

		word = pickRandomWord();
		image = chooseImg(word);
		
		backgroundVoice = chooseSound(word);
		
		makeBoxes(setUnOrder(word), boxesSize, boxesX, boxesY, 'white', 'black', true);
		makeBoxes(emptyStringWithLength(word), emptyBoxesSize, boxesX, emptyBoxesY, '#FFB366', 'none', false);
		draw();
		image.onload = () =>{
			ctx.drawImage( image, imagesX, imagesY );
		}
		ctx.drawImage( image, imagesX, imagesY );
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
	commonWords = ['Perro','Bus','Mamá','Papá','Banana','Gato', 'Limón', 'Escuela', 'Libro', 'Casa', 'Dinero',
	'Hospital', 'Ciudad', 'Pista', 'Mano', 'Hermano', 'Hermana'];
	theEnd = false;
	score = 0;
	n = 0;
	restart();
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
 * Draws the progress bar according to the score.
 * @param {Number} number 
 */

function drawProgressBar( number ){
	ctx.strokeStyle = '#E0E3F7'
	ctx.lineCap = 'round';
	ctx.lineWidth = progressBarSize;
	ctx.beginPath();
	ctx.moveTo(progressBarX1, progressBarY1);
	ctx.lineTo(progressBarX2, progressBarY2);
	ctx.stroke();
	ctx.strokeStyle = '#45D435'
	ctx.lineCap = 'round';
	ctx.lineWidth = progressBarSize;
	ctx.beginPath();
	ctx.moveTo(progressBarX1, progressBarY1);
	ctx.lineTo(progressBarX1 + (progressBarX2-progressBarX1)*(number/maxScore), progressBarY2);
	ctx.stroke();
}

/**
 * Draws the score
 */

function drawScore(){
	ctx.font = scoreFont;
	ctx.fillStyle = scoreFill;
	ctx.fillText(`Puntuación: ${score}`, scoreX, scoreY);
}

function animation(){
	let stopAnimation = false;
	let animationLocal = () => {
		if(n >= score) {
			return;
		}
		n += 0.01;
		drawProgressBar(n);
		requestAnimationFrame(animationLocal);
	}
	animationLocal();
	setTimeout(() => {
		stopAnimation = true;
	}, 1000);
	animationLocal();
}

/**
 * Selects the correct image acording to the displayed word.
 * @param {string} wordToCheck 
 * @returns {Image}
 */

function chooseImg( wordToCheck ){
	let img = new Image();
	img.src = `../../images/words-in-order/${wordToCheck}.png`;
	return img;
}

/**
 * Chooses the sound for the background voice.
 * @param {string} wordToCheck 
 * @returns {Audio}
 */

function chooseSound( wordToCheck ){
	let sound = new Audio();
	sound.src = `../../music/words-in-order/${wordToCheck}.mp3`;
	return sound;
}


//------------------------------------------------------------------------------------------------------------------------------------------
//Classes

class Box{
	static boxesCounter = 0;
	static counter2 = 0; 
	static restart = false;
	static word = '';

	constructor( text, size, x, y, fillBox, fillLetter, fillStroke, containsBox, isRectangle, height){
		this._x = x;
		this._y = y;
		this._size = size;
		this._text = text;
		this._fillBox = fillBox;
		this._fillLetter = fillLetter;
		this._fillStroke = fillStroke;
		this._containsBox = containsBox;
		this._isRectangle = isRectangle;
		if(isRectangle){
			this._x = x;
			this._y = y;
			this._width = size;
			this._height = height;
			this._text = text;
			this._fillBox = fillBox;
			this._fillLetter = fillLetter;
			this._fillStroke = fillStroke;
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

	get isRectangle(){
		return this._isRectangle;
	}

	set isRectangle(isRectangle){
		this._isRectangle = isRectangle;
	}

}

//------------------------------------------------------------------------------------------------------------------------------------------

//other variables
let firstX, firstY, beforeX, beforeY;
let validatorWidth = 300;
let validatorHeight = 100;
let validatorText = 'Listo';
let validatorX = (canvas.width/2) - (validatorWidth/2) + (boxesSize / 4) - (ctx.measureText(validatorText).width);
let validatorY = canvas.height-(canvas.height*0.2);
let validator = new Box(validatorText, validatorWidth, validatorX, validatorY, '#0554fa', 'whitesmoke', 'whitesmoke', null, true, validatorHeight );
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
let word = pickRandomWord();
let image = chooseImg(word);
let backgroundVoice = chooseSound(word);
let theEnd = false;
let clickedValidator = false;
let progressBarX1 = 100;
let progressBarY1 = titleY - getTextHeight(titleY)*2;
let progressBarX2 = 300;
let progressBarY2 = progressBarY1;
let progressBarSize = 25;
let maxScore = 7;
let score = 0;
let scoreText = `Puntuación: ${score}`;
let n = 0;
let scoreFont = '22px Arial';
let scoreFill = 'whitesmoke';
let scoreX = progressBarX1 - progressBarSize/2;
let scoreY = progressBarY2 - 25;

//For dragging squares;

let draw = () => {	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '40px Arial';
	ctx.fillText(titleContent, titleX, titleY);
	ctx.drawImage( image, imagesX, imagesY );
	drawProgressBar(score);
	drawScore();
	drawBoxes( undraggableBoxes, true, true );
	drawBoxes( boxes, true, false );
}, actualObject;

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
					animation();
					clickedValidator = true;
                    backgroundVoice.currentTime = 0;
					backgroundVoice.play()
					for(let i = 0; i < undraggableBoxes.length; i++){
						undraggableBoxes[i].fillStroke = '2BFF00';
					}
					draw();
					setTimeout(() => { 
						for(let i = 0; i < undraggableBoxes.length; i++){
							undraggableBoxes[i].fillStroke = '#0554fa';
						}
						draw();
						restart();
					}, 1000);
				}
				else{
					for( i in undraggableBoxes ){
						wrongAnswer.currentTime = 0;
						wrongAnswer.play();

                        backgroundVoice.currentTime = 0;
					    backgroundVoice.play()

						undraggableBoxes[i].fillStroke = '#FF3D3B'
						draw();
					}
					setTimeout(() => {
						for( i in undraggableBoxes ){
							undraggableBoxes[i].fillStroke = '#0554fa';
							draw();
							drawRect( validator, true, true );
						}
					}, 1000);
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
			if(cursorOverLapsRect( validator, event)){		
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
})
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


//------------------------------------------------------------------------------------------------------------------------------------------

//The first status of game
window.addEventListener('load', () => {
	let playBtn = document.getElementById('play-game-btn');
	let instructions = document.getElementById('instructions');
	let instructionsBkgd = document.getElementById('background');
	let audioBackground = document.getElementById('audio');
	let exitBtn = document.getElementById('exit');
	playBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
	exitBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
	playBtn.addEventListener('mousedown', () => {
		if(postClicked){
			postClick.currentTime = 0;
			postClick.play();
			postClicked = false;
			setTimeout(() => {
				canvas.style.display = `block`;
				instructions.style.display = `none`;
				instructionsBkgd.style.display = `none`;
				audioBackground.currentTime = 0;
				audioBackground.play();
				exitBtn.style.backgroundColor = ` #FF8C19`;
				exitBtn.style.borderColor = `#E67300`;
				exitBtn.addEventListener('mouseover', () => { exitBtn.style.backgroundColor = ` #FFA64D`; });
				exitBtn.addEventListener('mouseout', () => { exitBtn.style.backgroundColor = ` #FF8C19`; });
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = 'white';
				ctx.font = '40px Arial';
				ctx.fillText(titleContent, titleX, titleY);
				ctx.drawImage( image, imagesX, imagesY );
				drawProgressBar(score);
				drawScore();
				makeBoxes(setUnOrder(word), boxesSize, boxesX, boxesY, 'white', 'black', true);
				makeBoxes(emptyStringWithLength(word), emptyBoxesSize, boxesX, emptyBoxesY, '#FFB366', 'none', false);
				drawBoxes( boxes, true, false );
				drawBoxes( undraggableBoxes, true, false );
				setTimeout(() => { beginning = false; }, 1000);
			}, 1000);
		}
	})
})