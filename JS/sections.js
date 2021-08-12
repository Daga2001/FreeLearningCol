
/**
 * Closes the popup window displayed in credits button.
 */
let closePop_up = () => {
    let elements=document.getElementsByClassName('credits-popup');
    let element = '';
    for( i in elements ){
        if(elements[i].nodeName === 'DIV'){
            element = elements[i];
        }   
    }
    element.style.display = `none`;
}

/**
 * Opens the popup window displayed in credits button.
 */
let openPop_up = () => {
    let elements=document.getElementsByClassName('credits-popup');
    let element = '';
    for( i in elements ){
        if(elements[i].nodeName === 'DIV'){
            element = elements[i];
        }   
    }
    element.style.display = `block`;
}

document.getElementById('close-cr-popup').addEventListener('click', closePop_up);
document.getElementById('credits').addEventListener('click', openPop_up);

/**
 * Starts the animation in social media buttons
 * @param {Event} event 
 */
let setAnimationSocial = ( event ) => {
    let childElements = event.target.childNodes;
    for(let element of childElements ){
        if(element.nodeName === 'ION-ICON'){
            icon = element;
        }
        if(element.nodeName === 'P'){
            paragraph = element;
        }
    }
    icon.style.color = `#0ac70a`;
    paragraph.style.color = `#0ac70a`;
    event.target.style.cursor = `pointer`;
    event.target.style.background = `white`;
    icon.style.transition = `1s`;
    paragraph.style.transition = `1s`;
    event.target.style.transition = `1s`;
}

/**
 * Stops the animation in social media buttons
 * @param {Event} event 
 */
let grabAnimationSocial = ( event ) => {
    let childElements = event.target.childNodes;
    for( i in childElements ){
        if(childElements[i].nodeName === 'ION-ICON'){
            icon = childElements[i];
        };
        if(childElements[i].nodeName === 'P'){
            paragraph = childElements[i];
        };
    };
    icon.style.color = `whitesmoke`;
    paragraph.style.color = `whitesmoke`;
    if(event.target.id === 'facebook'){
        event.target.style.background = `blue`;
    }
    if(event.target.id === 'whatsapp'){
        event.target.style.background = `rgb(43, 255, 0)`;
    }
    if(event.target.id === 'email'){
        event.target.style.background = `#2727fc`;
    }
    event.target.style.cursor = `default`;
    icon.style.transition = `1s`;
    paragraph.style.transition = `1s`;
    event.target.style.transition = `1s`;
}

document.getElementById('facebook').addEventListener('mouseenter', setAnimationSocial);
document.getElementById('whatsapp').addEventListener('mouseenter', setAnimationSocial);
document.getElementById('email').addEventListener('mouseenter', setAnimationSocial);

document.getElementById('facebook').addEventListener('mouseleave', grabAnimationSocial);
document.getElementById('whatsapp').addEventListener('mouseleave', grabAnimationSocial);
document.getElementById('email').addEventListener('mouseleave', grabAnimationSocial);

document.getElementById('agreed').addEventListener('click', () => {
    let popUpWindow = document.getElementsByClassName('credits-popup')[0];
    popUpWindow.style.display = `none`;
})


