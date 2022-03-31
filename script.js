const canvas = document.querySelector('.container-canvas');
const canvasBackground = document.querySelector('.container-canvas-background');

const toolbar = document.querySelector('.container-toolbar');
const background = document.querySelector('#background');
const backgroundColor = document.querySelector('#background-color');
const pen = document.querySelector('#pen');
const penColor = document.querySelector('#pen-color');
const eraser = document.querySelector('#eraser');
const randomColor = document.querySelector('#random');
const addWhite = document.querySelector('#add-white');
const gridLines = document.querySelector('#grid-lines');

let borderColor = 'rgb(127, 127, 127)';
let canvasGrid = false;
let currentGridSize = 10;
let currentPenColor = '#000000';
let currentBackgroundColor = '#ffffff';

let popupPen = false;
let popupBackground = false;

let selected = 'pen';

// todo:
// 5 shading and lighten should work on background color
//                   convert the input hex to rgb
//      if pixel color === transparent, 
//           if lighten, set to white with opacity .1
//           if shading, set to black with opacity .1
//           add class shade or lighten
//      if pixel color === color,
//          then current background color should be used
//          and white or black should be added
//      if pixel contains shade class,
//           add opacity + 0.1 black or white
// 6 as a last one build the bucket tool 
// 7 maybe add grid size popup

function popup(which) {
    switch (which) {
        case 'pen':
            if (!popupPen) {
                handler = function(event){
                    event.stopPropagation();
                    currentPenColor = event.target.value;
                    penColor.style.visibility = 'hidden';
                    penColor.removeEventListener('change', handler);
                    popupPen = false;
                };

                popupPen = true;
                penColor.value = currentPenColor;
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
                    event.stopPropagation();
                    canvasBackground.style.backgroundColor = event.target.value;
                    currentBackgroundColor = event.target.value;
                    backgroundColor.style.visibility = 'hidden';
                    backgroundColor.removeEventListener('change', handler);
                    background.classList.remove('active');
                    popupBackground = false;
                };

                popupBackground = true;
                backgroundColor.value = currentBackgroundColor;
                backgroundColor.style.visibility = 'visible';
                background.classList.add('active');
                backgroundColor.addEventListener('change', handler);
            } else {
                backgroundColor.style.visibility = 'hidden';
                backgroundColor.removeEventListener('change', handler);
                background.classList.remove('active');
                popupBackground = false;
            }
            break;    
    }
}

function buildCanvasGrid() {

    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }
    const row = currentGridSize;
    const col = currentGridSize;

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

function clearCanvasAnimation() {
    canvas.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });

    setTimeout(buildCanvasGrid, 500);
}

function promptCanvasSize() {
    const size = prompt('Enter a grid size between 1 and 128');
    if (size > 0 && size < 129) {
        currentGridSize = size;
        buildCanvasGrid();
    } else if (size === null) {
        return;
    } else {
        promptCanvasSize();
    }
}

function toggleGrid() {
    canvasGrid = !canvasGrid;
    if (canvasGrid) {
        gridLines.classList.add('active');
        canvas.style.borderTop = `${borderColor} thin solid`;
        canvas.style.borderLeft = `${borderColor} thin solid`;
        canvas.querySelectorAll('.pixel').forEach(item => {
            item.style.borderRight = `${borderColor} thin solid`;
            item.style.borderBottom = `${borderColor} thin solid`;
        });
    } else {
        gridLines.classList.remove('active');
        canvas.style.borderTop = 'none';
        canvas.style.borderLeft = 'none';
        canvas.querySelectorAll('.pixel').forEach(item => {
            item.style.borderRight = 'none';
            item.style.borderBottom = 'none';
        });
    }

}

function deactivateAll() {
    toolbar.querySelectorAll('.only-one-active').forEach(item => {
        item.classList.remove('active');
    });
}

function paint(event) {
    switch (pencil) {
        case 'pen':
            event.target.style.backgroundColor = currentPenColor;
            break;
        case 'random':
            rand = () => Math.floor(Math.random() * 256);
            event.target.style.backgroundColor = `rgb(${rand()}, ${rand()}, ${rand()})`;
            break;
        case 'eraser':
            event.target.style.backgroundColor = 'transparent';
            break;
        case 'add-white':
            if (
            !event.target.classList.contains('white') 
            && event.target.style.backgroundColor === 'transparent') {
                event.target.classList.add('white');
                event.target.style.backgroundColor = `rgba(255, 255, 255, 0.1)`;
            } else if (!event.target.classList.contains('white') && event.target.style.backgroundColor !== 'transparent') {
                const color = event.target.style.backgroundColor.exec(/rgba{0,1}\((\d+), (\d+), (\d+).*\)/);


                console.log('already white');
            } else if (event.target.classList.contains('white')) {

            } else {
                console.error('add white error');
            }
        }
    }


function load() {
    canvasBackground.style.backgroundColor = currentBackgroundColor;
    buildCanvasGrid();
    pencil = 'pen';
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
            paint(event);
        }
        event.stopPropagation();
    });
   canvas.addEventListener('click', (event) => {
        if (event.target.classList.contains('pixel')) {
            paint(event);
        }
        event.stopPropagation();
    });


    toolbar.addEventListener('click', (event) => {
        event.stopPropagation();   
        switch (event.target.id) {
            case 'background':
                popup('background');
                break;            
            case 'pen':
                pencil = 'pen';
                deactivateAll();
                pen.classList.add('active');
                popup('pen');
                break;
            case 'eraser':
                pencil = 'eraser';
                deactivateAll();
                eraser.classList.add('active');
                break;
            case 'random':
                pencil = 'random';
                deactivateAll();
                randomColor.classList.add('active');
                break;  
            case 'add-white':
                pencil = 'add-white';
                deactivateAll();
                addWhite.classList.add('active');
                break;
            case 'grid-lines':
                toggleGrid();
                break;                   
            case 'size':
                promptCanvasSize();
                break;
            case 'clear':
                clearCanvasAnimation();
                break;

        }
    });
}

load();