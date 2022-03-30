const canvas = document.querySelector('.container-canvas');
const toolbar = document.querySelector('.container-toolbar');
const pen = document.querySelector('#pen');
const borderColor = 'rgb(127, 127, 127)';
const backgroundColor = 'white';
const canvasGrid = false;
const currentColor = 'grey';


function buildCanvasGrid(size) {

    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }
    canvas.style.backgroundColor = backgroundColor;
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

function selectPen() {
    pen.style.webkitFilter = 'opacity(100%)';
    pen.style.filter = 'opacity(100%)';
    pen.style.borderLeft = 'white solid 0.5vh';

}


function checkMode(event) {
    event.target.style.backgroundColor = currentColor;
}

function load() {
    buildCanvasGrid(64);
    
    selectPen();

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

    toolbar.addEventListener('click', (event) => {
        if (event.target.id === 'pen') {
            selectPen();
        }
    });
    

}

load();