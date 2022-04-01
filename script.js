const canvas = document.querySelector('.container-canvas');
const canvasBackground = document.querySelector('.container-canvas-background');

const toolbar = document.querySelector('.container-toolbar');

const backgroundBtn = document.querySelector('#background');
const backgroundColorPicker = document.querySelector('#background-color');
const penBtn = document.querySelector('#pen');
const penColorPicker = document.querySelector('#pen-color');
const eraserBtn = document.querySelector('#eraser');
const randomColorBtn = document.querySelector('#random');
const addWhiteBtn = document.querySelector('#add-white');
const addBlackBtn = document.querySelector('#add-black');
const gridLinesBtn = document.querySelector('#grid-lines');

// initial values
let borderColor = 'rgb(127, 127, 127)';
let currentGridSize = 10;
let currentPenColor = '#000000';
let currentBackgroundColor = '#ffffff';
canvasBackground.style.backgroundColor = currentBackgroundColor;

let gridLines = false;
let popupPen = false;
let popupBackground = false;

let pencil = 'pen';
penBtn.classList.add('active');
//

// 6 as a last one build the bucket tool 
// 7 maybe add grid size popup

const buildCanvas = function buildCanvasGrid() {
    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }

    const row = currentGridSize;
    const col = currentGridSize;
    if (gridLines) {
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
            colDiv.id = `${i}-${j}`;
            colDiv.dataset.color = 'transparent';
            colDiv.style.backgroundColor = 'transparent';
            colDiv.dataset.shade = 0;
            if (gridLines) {
                colDiv.style.borderRight = `${borderColor} thin solid`;
                colDiv.style.borderBottom = `${borderColor} thin solid`;
            }
            colDiv.style.flex = 'auto';
            rowDiv.appendChild(colDiv);
        }
        canvas.appendChild(rowDiv);
    }
}


const clearCanvas = function clearCanvasWithAnimation() {
    canvas.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });

    setTimeout(buildCanvas, 500);
}


const promptNewSize = function promptForNewCanvasSize() {
    const size = prompt('Enter a grid size between 1 and 128');
    if (size > 0 && size < 129) {
        currentGridSize = size;
        buildCanvas();
    } else if (size === null) {
        return;
    } else {
        promptNewSize();
    }
}


const rgb = function getHtmlRgbValues(value, index) {
    switch (index) {
        case 'r':
            return parseInt(value.match(/\d+/g)[0]);
        case 'g':
            return parseInt(value.match(/\d+/g)[1]);
        case 'b':
            return parseInt(value.match(/\d+/g)[2]);
    }
}
const rgbToInt = rgb


const changeShade = function changeShadeWithBackground(item) {
    const shade = item.dataset.shade
    const color = canvasBackground.style.backgroundColor;
    let r = rgb(color, 'r');
    let g = rgb(color, 'g');
    let b = rgb(color, 'b');
    const cW = function calculateWhiteShade(color) {
        return color + Math.round((255 - color) / 10 * shade);
    }
    const cB = function calculateBlackShade(color) {
        return color - Math.round(color / 10 * -shade);
    }
    switch (true) {
        case shade == 0:
            item.style.backgroundColor = color;
            break;
        case shade > 0:
            item.style.backgroundColor = `rgb(${cW(r)}, ${cW(g)}, ${cW(b)})`;
            break;
        case shade < 0:
            item.style.backgroundColor = `rgb(${cB(r)}, ${cB(g)}, ${cB(b)})`;
            break;
    };
};


const toggleGrid = function toggleGridLines() {
    gridLines = !gridLines;
    if (gridLines) {
        gridLinesBtn.classList.add('active');
        canvas.style.borderTop = `${borderColor} thin solid`;
        canvas.style.borderLeft = `${borderColor} thin solid`;
        canvas.querySelectorAll('.pixel').forEach(item => {
            item.style.borderRight = `${borderColor} thin solid`;
            item.style.borderBottom = `${borderColor} thin solid`;
        });
    } else {
        gridLinesBtn.classList.remove('active');
        canvas.style.borderTop = 'none';
        canvas.style.borderLeft = 'none';
        canvas.querySelectorAll('.pixel').forEach(item => {
            item.style.borderRight = 'none';
            item.style.borderBottom = 'none';
        });
    }
}


function paint(event) {
    switch (pencil) {
        case 'pen':
            event.target.style.backgroundColor = currentPenColor;
            event.target.dataset.color = event.target.style.backgroundColor;
            event.target.dataset.shade = 0;
            break;

        case 'bucket':
            console.log('bucket');

        case 'random':
            rand = () => Math.floor(Math.random() * 256);
            event.target.style.backgroundColor = `rgb(${rand()}, ${rand()}, ${rand()})`;
            event.target.dataset.color = event.target.style.backgroundColor;
            event.target.dataset.shade = 0;
            break;

        case 'eraser':
            event.target.style.backgroundColor = 'transparent';
            event.target.dataset.color = 'transparent';
            event.target.dataset.shade = 0;
            break;

        case 'add-white':
            if (event.target.dataset.shade >= 10) return;
            if (event.target.dataset.color === 'transparent') {
                event.target.dataset.color = 'bg';
            }
            event.target.dataset.shade++;
            addWhiteOrBlack(event);
            break;

        case 'add-black':
            if (event.target.dataset.shade <= -10) return;
            if (event.target.dataset.color === 'transparent') {
                event.target.dataset.color = 'bg';
            }
            event.target.dataset.shade--;
            addWhiteOrBlack(event);
            break;
        }
    }

function addWhiteOrBlack(event) {
    function rgbToInt(value, index) {
        switch (index) {
            case 'r':
                return parseInt(value.match(/\d+/g)[0]);
            case 'g':
                return parseInt(value.match(/\d+/g)[1]);
            case 'b':
                return parseInt(value.match(/\d+/g)[2]);
        }
    }
    const setShade = function(event) {

    }
    if (event.target.dataset.shade == 0) {
        
        if (event.target.dataset.color === 'bg') {
            event.target.style.backgroundColor = canvasBackground.style.backgroundColor;
        } else {
            event.target.style.backgroundColor = canvasBackground.style.backgroundColor;
        }
        event.target.style.backgroundColor = event.target.dataset.color;
    } else if (event.target.dataset.shade > 0) {
        if (event.target.dataset.color === 'bg') {
            const rOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'r');
            const rDifference = Math.round((255 - rOriginal) / 10 * event.target.dataset.shade);
            const r = rOriginal + rDifference;
            const gOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'g');
            const gDifference = Math.round((255 - gOriginal) / 10 * event.target.dataset.shade);
            const g = gOriginal + gDifference;
            const bOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'b');
            const bDifference = Math.round((255 - bOriginal) / 10 * event.target.dataset.shade);
            const b = bOriginal + bDifference;
            event.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        } else {
            const rOriginal = rgbToInt(event.target.dataset.color, 'r');
            const rDifference = Math.round((255 - rOriginal) / 10 * event.target.dataset.shade);
            const r = rOriginal + rDifference;
            const gOriginal = rgbToInt(event.target.dataset.color, 'g');
            const gDifference = Math.round((255 - gOriginal) / 10 * event.target.dataset.shade);
            const g = gOriginal + gDifference;
            const bOriginal = rgbToInt(event.target.dataset.color, 'b');
            const bDifference = Math.round((255 - bOriginal) / 10 * event.target.dataset.shade);
            const b = bOriginal + bDifference;
            event.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    } else if (event.target.dataset.shade < 0) {

        if (event.target.dataset.color === 'bg') {
            const rOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'r');
            const rDifference = Math.round(rOriginal / 10 * -event.target.dataset.shade);
            const r = rOriginal - rDifference;
            const gOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'g');
            const gDifference = Math.round(gOriginal / 10 * -event.target.dataset.shade);
            const g = gOriginal - gDifference;
            const bOriginal = rgbToInt(canvasBackground.style.backgroundColor, 'b');
            const bDifference = Math.round(bOriginal / 10 * -event.target.dataset.shade);
            const b = bOriginal - bDifference;
            event.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        } else {
            const rOriginal = rgbToInt(event.target.dataset.color, 'r');
            const rDifference = Math.round(rOriginal / 10 * -event.target.dataset.shade);
            const r = rOriginal - rDifference;
            const gOriginal = rgbToInt(event.target.dataset.color, 'g');
            const gDifference = Math.round(gOriginal / 10 * -event.target.dataset.shade);
            const g = gOriginal - gDifference;
            const bOriginal = rgbToInt(event.target.dataset.color, 'b');
            const bDifference = Math.round(bOriginal / 10 * -event.target.dataset.shade);
            const b = bOriginal - bDifference;
            event.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    }
}


const addCanvasEventListeners = function() {
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
}


const deactivateAll = function deactivateAllActiveClasses() {
    toolbar.querySelectorAll('.only-one-active').forEach(item => {
        item.classList.remove('active');
    });
}


const showPopup = function showColorPickerPopup(which) {
    switch (which) {
        case 'pen':
            if (!popupPen) {
                changePen = function changePenColor(e) {
                    e.stopPropagation();
                    currentPenColor = e.target.value;
                    penColorPicker.style.visibility = 'hidden';
                    penColorPicker.removeEventListener('change', changePen);
                    popupPen = false;
                };
                penColorPicker.value = currentPenColor;
                penColorPicker.style.visibility = 'visible';
                penColorPicker.addEventListener('change', changePen);
                popupPen = true;
            } else {
                penColorPicker.style.visibility = 'hidden';
                penColorPicker.removeEventListener('change', changePen);
                popupPen = false;
            }
            break;
        case 'background':
            if (!popupBackground) {
                changeBg = function changeBackgroundColor(e){
                    e.stopPropagation();
                    canvasBackground.style.backgroundColor = e.target.value;
                    currentBackgroundColor = e.target.value;
                    canvas.querySelectorAll('[data-color="bg"]').forEach(changeShade);
                    backgroundColorPicker.style.visibility = 'hidden';
                    backgroundBtn.classList.remove('active');
                    backgroundColorPicker.removeEventListener('change', changeBg);
                    popupBackground = false;
                };
                backgroundColorPicker.value =  currentBackgroundColor;
                backgroundColorPicker.style.visibility = 'visible';
                backgroundBtn.classList.add('active');
                backgroundColorPicker.addEventListener('change', changeBg);
                popupBackground = true;
            } else {
                backgroundColorPicker.style.visibility = 'hidden';
                backgroundBtn.classList.remove('active');
                backgroundColorPicker.removeEventListener('change', changeBg);
                popupBackground = false;
            }
            break;    
    }
}


const addToolbarEventListeners = function() {

    toolbar.addEventListener('click', (event) => {
        event.stopPropagation();   
        switch (event.target.id) {
            case 'background':
                showPopup('background');
                break; 

            case 'pen':
                pencil = 'pen';
                deactivateAll();
                penBtn.classList.add('active');
                showPopup('pen');
                break;

            case 'bucket':
                pencil = 'bucket';
                deactivateAll();
                bucket.classList.add('active');
                break;

            case 'eraser':
                pencil = 'eraser';
                deactivateAll();
                eraserBtn.classList.add('active');
                break;

            case 'random':
                pencil = 'random';
                deactivateAll();
                randomColorBtn.classList.add('active');
                break; 

            case 'add-white':
                pencil = 'add-white';
                deactivateAll();
                addWhiteBtn.classList.add('active');
                break;

            case 'add-black':
                pencil = 'add-black';
                deactivateAll();
                addBlackBtn.classList.add('active');
                break;

            case 'grid-lines':
                toggleGrid();
                break; 

            case 'size':
                promptNewSize();
                break;

            case 'clear':
                clearCanvas();
                break;
        }
    });
}


addCanvasEventListeners();
addToolbarEventListeners();
buildCanvas();