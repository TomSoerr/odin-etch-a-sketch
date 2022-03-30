const canvas = document.querySelector('.container-canvas');
const toolbar = document.querySelector('.container-toolbar');
const background = document.querySelector('#background');
const backgroundColor = document.querySelector('#background-color');
const pen = document.querySelector('#pen');
const penColor = document.querySelector('#pen-color');

let borderColor = 'rgb(127, 127, 127)';
let canvasGrid = false;
let currentGridSize = 16;
let currentPenColor = 'black';

let popupPen = false;
let popupBackground = false;

let selected = 'pen';


function buildCanvasGrid(size) {

    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }
    const row = size;
    const col = size;

    if (canvasGrid) {
        canvas.style.borderTop = `${borderColor} thin solid`;
        canvas.style.borderLeft = `${borderColor} thin solid`;
    }

    for (let i = 0; i < row; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.flexDirection = 'row';
        rowDiv.style.flex = 'auto';
        rowDiv.classList.add('row');

        for (let j = 0; j < col; j++) {
            const colDiv = document.createElement('div');
            colDiv.classList.add('pixel');
            colDiv.style.backgroundColor = 'transparent';

            if (canvasGrid) {
                colDiv.style.borderRight = `${borderColor} thin solid`;
                colDiv.style.borderBottom = `${borderColor} thin solid`;
            }

            colDiv.style.flex = 'auto';
            rowDiv.appendChild(colDiv);
        }
        canvas.appendChild(rowDiv);
    }
}


function popup(which) {
    switch (which) {
        case 'pen':
            if (!popupPen) {
                handler = function(event){
                    currentPenColor = event.target.value;
                    event.stopPropagation();
                    penColor.style.visibility = 'hidden';
                    penColor.removeEventListener('change', handler);
                    popupPen = false;
                };
                popupPen = true;
                penColor.style.visibility = 'visible';
                penColor.addEventListener('change', handler);
            } else {
                penColor.style.visibility = 'hidden';
                penColor.removeEventListener('change', handler);
                popupPen = false;
            }
            break;

        case 'background':
            if (!popupBackground) {
                handler = function(event){
                    canvas.style.backgroundColor = event.target.value;
                    event.stopPropagation();
                    backgroundColor.style.visibility = 'hidden';
                    backgroundColor.removeEventListener('change', handler);
                    popupBackground = false;
                    background.classList.remove('active');
                };
                popupBackground = true;
                backgroundColor.style.visibility = 'visible';
                background.classList.add('active');
                backgroundColor.addEventListener('change', handler);
            } else {
                backgroundColor.style.visibility = 'hidden';
                backgroundColor.removeEventListener('change', handler);
                popupBackground = false;
                background.classList.remove('active');
            }
            break;
            
    }
}


function checkMode(event) {
    switch (selected) {
        case 'pen':
            event.target.style.backgroundColor = currentPenColor;
            break;
    }
}
function load() {
    canvas.style.backgroundColor = 'white';

    buildCanvasGrid(currentGridSize);

    selected = 'pen';
    pen.classList.add('active');

    let mouseDown = false;
    canvas.addEventListener('mousedown', (event) => {
        mouseDown = true;
        event.stopPropagation();
    });
    window.addEventListener('mouseup', (event) => {
        mouseDown = false;
        event.stopPropagation();
    });
    canvas.addEventListener('mouseover', (event) => {
        if (mouseDown && event.target.classList.contains('pixel')) {
            checkMode(event);
        }
        event.stopPropagation();
    });
   canvas.addEventListener('click', (event) => {
        if (event.target.classList.contains('pixel')) {
            checkMode(event);
        }
        event.stopPropagation();
    });

    toolbar.addEventListener('click', (event) => {
        if (event.target.id === 'pen') {
            popup('pen');
            selected = 'pen';
            pen.classList.add('active');
        } else if (event.target.id === 'background') {
            popup('background');
        }
        event.stopPropagation();
    });
}

load();