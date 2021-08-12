//elements
let title = document.getElementById('title');
let audio = document.getElementById('audio');
let audioContainer = document.getElementById('audioContainer');
let audioBody = document.getElementById('audioBody');
let btns = document.getElementsByClassName('btn');
let scoreHTML = document.getElementById('score');
let buttons = document.getElementsByClassName('buttons')[0];
let body = document.getElementById('body');
let answers = ['Caballo', 'Elefante', 'Murciélago', 'Juez', 'Canario', 'Trompeta', 'Carro', 'Pollo', 'Papel', 'Hola',
'Hoja', 'Rio', 'Calamar', 'Cielo', 'Avión'];
let rightAnswer = '';
let voice = new Audio();
let right = new Audio(`../../music/listening-words/Correct Answer - Sound Effect.mp3`);
let wrong = new Audio(`../../music/listening-words/Wrong Clakson Sound Effect.mp3`);
let victory = new Audio(`../../music/listening-words/applause3.mp3`);
let congrats = new Audio(`../../music/listening-words/congrats.mp3`);
let rollOver = new Audio(`../../music/geometric-shapes/rollover-sound-effect.mp3`);
let postClick = new Audio(`../../music/geometric-shapes/post-click sound effect.mp3`);
let postCliked = true;
let score = 0;
let clicked = false;


//----------------------------------------------------------------------------------------------------------------------

//functions

/**
 * Chooses an audio according to the given song's name.
 * @param {String} name 
 * @returns {String}
 */
function changeAudioTo(name){
    voice.src = `../../music/listening-words/${name}.mp3`
    voice.currentTime = 0;
    voice.play();
    return `./music/listening-words/${name}.mp3`;
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
 * Removes an element from a list.
 * @param {object} list
 * @param {*} element
 * @returns {object}
 */

function eraseElement( list, element ){
	for( i in list ){
		if( list[i] === element ){
			filtered = list.filter(e => e != element);
			return filtered;
		}
	}
	throw `element not found`;
}

/**
 * Draws the audio bar in viewport.
 * @param {String} song 
 */
function drawAudio( song ){
    document.getElementById('audioBody').innerHTML = `<audio id="audioContainer" controls>
                             <source id="audio" src='${changeAudioTo(song)}' />
                             Your browser doesn't support the audio.
                           </audio>`;
}

/**
 * Inits the game.
 */
function init(){
    victory.pause();
    congrats.pause();
    let random = numberBTWLimits(0, answers.length - 1);
    let localAnswers = answers;
    for(let i = 0; i < document.getElementsByClassName('btn').length; i++){
        random = numberBTWLimits(0, localAnswers.length - 1);
        document.getElementsByClassName('btn')[i].innerHTML = localAnswers[random];
        localAnswers = eraseElement(localAnswers, localAnswers[random] );
    }
    random = numberBTWLimits(0, document.getElementsByClassName('btn').length - 1);
    rightAnswer = pickCorrectAnswer(localAnswers);
    document.getElementsByClassName('btn')[random].innerHTML = rightAnswer;
    answers = eraseElement(answers, rightAnswer);
}

/**
 * Picks an answer acording to the answers array
 * @param {String} answers 
 * @returns 
 */
function pickCorrectAnswer(answers){
    let random = numberBTWLimits(0, answers.length - 1);
    let correctAnswer = answers[random];
    drawAudio( correctAnswer );
    return correctAnswer;
}

/**
 * Validates if the answer is correct accordint to the given argument.
 * @param {String} answer 
 * @returns 
 */
function isCorrectAnswer(answer){
    if( answer == rightAnswer ){
        return true;
    }
    return false;
}

/**
 * Draws the score in viewport.
 */
function drawScore(){
    document.getElementById('score').innerHTML = `score: ${score}`;
}

/**
 * Draws the border of a button according to the given color.
 * @param {String} color 
 */
function drawBorderBtns(color){
    let btns = document.getElementsByClassName('btn');
    for(let i = 0; i < btns.length; i++){
        btns[i].style.border = `5px solid ${color}`;
    }
}

/**
 * Draws the ending.
 */
function ending(){
    congrats.currentTime = 0;
    congrats.play();
    victory.currentTime = 0;
    victory.play();
    document.getElementById('title').style.display = `none`;
    document.getElementById('audioBody').style.display = `none`;
    document.getElementById('score').style.display = `none`;
    document.getElementsByClassName('buttons')[0].style.display = `none`;
    let element = `<div id="ending-screen" class="ending">
                     <pre class="ending">
                        Bien hecho!
                        Felicitaciones!
                     </pre>
                     <button id="restart" class="ending btn" onmousedown='restartGame()' >Reiniciar</button>
                   </div>`;
    document.getElementById('body').innerHTML += element;
}

/**
 * Validates and modifies the GUI when some user gives an answer.
 * @param {Event} event 
 * @returns 
 */
function checkIfCorrectAnswer(event){
    if(!clicked){
        clicked = true;
        let answer = event.target.innerHTML;
        if(isCorrectAnswer(answer)){
            right.currentTime = 0;
            right.play();
            score++;
            if(score == 7){
                clicked = false;
                return ending();
            }
            else{
                try{
                    drawScore();
                    drawBorderBtns('#2ffa00');
                    setTimeout(() => {
                        clicked = false;
                        drawBorderBtns('#269904');
                        init();
                    }, 1000);
                }
                catch(e){
                    console.log(`Error! ${e}`);
                }
            }   
        }
        else{
            wrong.currentTime = 0;
            wrong.play();
            drawBorderBtns('#fa0000');
                setTimeout(() => {
                    clicked = false;
                    drawBorderBtns('#269904');
                }, 1000);
        }
    }
}

/**
 * Restarts the game.
 */
function restartGame(){
    score = 0;
    answers = ['Caballo', 'Elefante', 'Murciélago', 'Juez', 'Canario', 'Trompeta', 'Carro', 'Pollo', 'Papel', 'Hola',
    'Hoja', 'Rio', 'Calamar', 'Cielo', 'Avión'];
    document.getElementById('title').style.display = `block`;
    document.getElementById('audioBody').style.display = `block`;
    document.getElementById('score').style.display = `block`;
    document.getElementsByClassName('buttons')[0].style.display = `block`;
    document.getElementById('ending-screen').remove();
    for(let i = 0; i < document.getElementsByClassName('btn').length; i++){
        document.getElementsByClassName('btn')[i].addEventListener('mousedown', checkIfCorrectAnswer);
    }
    try{
        drawScore();
        init();
    }
    catch(e){
        console.log(`Error! ${e}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

//Listeners

for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener('mousedown', checkIfCorrectAnswer);
}
let playBtn = document.getElementById('play-game-btn');
let instructions = document.getElementById('instructions');
let instructionsBkgd = document.getElementById('background');
let audioBackground = document.getElementById('audio-background');
let exitBtn = document.getElementById('exit');
playBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
exitBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
playBtn.addEventListener('mousedown', () => {
    if(postCliked){
        postClick.currentTime = 0;
        postClick.play();
        postCliked = false;
        setTimeout(() => {
            document.getElementById('body').style.display = `block`;
            instructions.style.display = `none`;
            instructionsBkgd.style.display = `none`;
            audioBackground.currentTime = 0;
            audioBackground.play();
            exitBtn.style.backgroundColor = ` #FF8C19`;
            exitBtn.style.borderColor = `#E67300`;
            exitBtn.addEventListener('mouseover', () => { exitBtn.style.backgroundColor = ` #FFA64D`; });
            exitBtn.addEventListener('mouseout', () => { exitBtn.style.backgroundColor = ` #FF8C19`; });
            try{
                drawScore();
                init();
            }
            catch(e){
                console.log(`Error! ${e}`);
            }
        }, 1000);
    }
});