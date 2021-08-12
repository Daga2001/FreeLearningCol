//Variables

let numberImg = numberBTWLimits(1, 6);
let clicked = false;
let playClicked = false;
let foundImages = [];
let buttonClicked = new Audio(`../../music/picture-game/Mouse_Click_3-fesliyanstudios.com.mp3`);
let rollOver = new Audio(`../../music/geometric-shapes/rollover-sound-effect.mp3`);
let postClick = new Audio(`../../music/geometric-shapes/post-click sound effect.mp3`);
let postClicked = true;

//functions 

/**
 * draws an image according to its number.
 * @param {Number} number 
 */

function drawGame(number){
    let random = numberBTWLimits(1, 15);
    let shouldDisplay = () => {
        if(playClicked){
            return 'display: none';
        }
        return 'display: block';
    }
    let shouldDisplayText = () => {
        if(playClicked){
            return 'display: block';
        }
        return 'display: none';
    }
    document.getElementById('body').innerHTML = 
    `
    <img id="image" class="frame" src="./images/picture-game/img${number}.png" />
    <div id="cropped-image">
        <div class='cropped n1'><img class="frame n1" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n2'><img class="frame n2" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n3'><img class="frame n3" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n4'><img class="frame n4" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n5'><img class="frame n5" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n6'><img class="frame n6" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n7'><img class="frame n7" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n8'><img class="frame n8" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n9'><img class="frame n9" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n10'><img class="frame n10" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n11'><img class="frame n11" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n12'><img class="frame n12" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n13'><img class="frame n13" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n14'><img class="frame n14" src="./images/picture-game/img${number}.png" /></div>
        <div class='cropped n15'><img class="frame n15" src="./images/picture-game/img${number}.png" /></div>
    </div>
    <div id="menu">
        <pre style="${shouldDisplay()}">
            presta atención a cada detalle de la imagen, 
            cuando estés listo presiona el botón "play".
        </pre>
        <p style="${shouldDisplayText()}" class="textMenu2">
            Dónde viste esta imagen por última vez?
        </p>
        <button id="play" style="${shouldDisplay()}">play</button>
        <img id="model" class="n${random}" src="./images/picture-game/img${number}.png" />
    </div>
    `
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
 * checks if an image has been found before by user.
 * @param {Number} number 
 * @returns 
 */

function checkIfFound(number){
    for(let i = 0; i < foundImages.length; i++){
        if(`n${number}` == foundImages[i]){
            return true;
        }
    }
    return false;
}

/**
 * draws the final status of the game.
 */
function drawEnd(){
    document.getElementById('body').innerHTML = 
    `
    <div id="ending">
        <pre class="ending">
            Felicitaciones!!
            Lo hiciste bien.
        </pre>
        <button id="restart">Reiniciar</button>
    </div>
    `
    document.getElementById('restart').addEventListener('mousedown', () => {
        buttonClicked.currentTime = 0;
        buttonClicked.play();
        playClicked = false;
        numberImg = numberBTWLimits(1, 6);
        drawGame(numberImg);
        document.getElementById('cropped-image').id = `cropped-image-none`;
        foundImages.length = 0;
        initGame();
    })
}

/**
 * Draws the initial status of the game.
 */
function initGame(){
    document.getElementById('image').src = `../../images/picture-game/img${numberImg}.png`;
    document.getElementById('model').src = `../../images/picture-game/background.png`;
    document.getElementById('play').addEventListener('mousedown', () => {
        buttonClicked.currentTime = 0;
        buttonClicked.play();
        playClicked = true;
        document.getElementById('cropped-image-none').id = 'cropped-image';
        handlePlayGame();
    });
}


/**
 * Handles the game, in other words, this functions does almost everything.
 */
function handlePlayGame(){
    drawGame(numberImg);
    let frames = document.getElementsByClassName('cropped');
    for(let i = 0; i < frames.length; i++){
        frames[i].childNodes[0].src = `../../images/picture-game/background.png`;
        frames[i].addEventListener('mousedown', () => {
            if(frames[i].childNodes[0].found != true && !clicked){
                frames[i].childNodes[0].src = `../../images/picture-game/img${numberImg}.png`;
                buttonClicked.currentTime = 0;
                buttonClicked.play();
                clicked = true;
                if(document.getElementById('model').classList[0] == frames[i].childNodes[0].classList[1]){
                    frames[i].childNodes[0].found = true;
                    clicked = false;
                    foundImages.push(frames[i].childNodes[0].classList[1]);
                    if(foundImages.length == 15){
                        return drawEnd();
                    }
                    let random = numberBTWLimits(1,15);
                    while(checkIfFound(random)){
                        random = numberBTWLimits(1,15);
                    }
                    document.getElementById('model').className = `n${random}`;
                }
                else{
                    setTimeout(() => {
                        frames[i].childNodes[0].src = `../../images/picture-game/background.png`;
                        let random = numberBTWLimits(1,15);
                        while(checkIfFound(random)){
                            random = numberBTWLimits(1,15);
                        }
                        document.getElementById('model').className = `n${random}`;
                        clicked = false;
                    }, 1000);
                }
            }
                
        })
}
}

//---------------------------------------------------------------------------------------------------------------------

let playBtn = document.getElementById('play-game-btn');
let instructions = document.getElementById('instructions');
let instructionsBkgd = document.getElementById('background');
let audioBackground = document.getElementById('audio-background');
let exitBtn = document.getElementById('exit');
playBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
exitBtn.addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
document.getElementById('play').addEventListener('mouseover', () => { rollOver.currentTime = 0; rollOver.play(); });
playBtn.addEventListener('mousedown', () => {
    if(postClicked){
        postClick.currentTime = 0;
        postClick.play();
        postClicked = false;
        setTimeout(() => {
        document.getElementById('body').style.display = `block`;
        instructions.style.display = `none`;
        instructionsBkgd.style.display = `none`;
        audioBackground.currentTime = 0;
        audioBackground.play();
        exitBtn.style.backgroundColor = ` #AA00CC`;
        exitBtn.style.borderColor = `purple`;
        exitBtn.addEventListener('mouseover', () => { exitBtn.style.backgroundColor = ` #D919FF`; });
        exitBtn.addEventListener('mouseout', () => { exitBtn.style.backgroundColor = ` #AA00CC`; });
        initGame();
        }, 1000);
    }
});