const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 640;

const ballRadius = 10;
let ballX1 = canvas.width / 4;
let ballY1 = canvas.height / 2;



let speed = 2;
let random1 = Math.random() > 0.5 ? -1 : 1;

let ballSpeedX1Init = speed * random1;
let ballSpeedY1Init = -speed * random1; 
let ballSpeedX1 = ballSpeedX1Init; 
let ballSpeedY1 = ballSpeedY1Init; 


let red = 'f00';
let blue = '#00f';
// Definition der Bilder für die Blöcke
const redBlockImage = new Image();
redBlockImage.src = 'red_block.png'; // Passe den Pfad entsprechend deiner Dateistruktur an

const blueBlockImage = new Image();
blueBlockImage.src = 'blue_block.png'; // Passe den Pfad entsprechend deiner Dateistruktur an
let ballX2 = 3 * canvas.width / 4;
let ballY2 = canvas.height / 2;


let random = Math.random() > 0.5 ? -1 : 1;


let ballSpeedX2Init = speed * random;
let ballSpeedY2Init = -speed * random; 
let ballSpeedX2 = ballSpeedX2Init; 
let ballSpeedY2 = ballSpeedY2Init; 

const rangeInput = document.getElementById('myRange');


const fieldSize = 40; // Größe eines Blocks
const numFields = 16; // 16x16 Blöcke
let fields = [];

for (let i = 0; i < numFields; i++) {
    fields[i] = [];
    for (let j = 0; j < numFields; j++) {
        if (i < numFields / 2) {
            fields[i][j] = red; // linke Seite, rote Blöcke
        } else {
            fields[i][j] = blue; // rechte Seite, blaue Blöcke
        }
    }
}

function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawFields() {
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields[i].length; j++) {
            const x = i * fieldSize;
            const y = j * fieldSize;
            if (fields[i][j] === red) {
                ctx.drawImage(redBlockImage, x, y, fieldSize, fieldSize);
            } else {
                ctx.drawImage(blueBlockImage, x, y, fieldSize, fieldSize);
            }
            ctx.strokeStyle = '#000'; // Rahmenfarbe
            ctx.strokeRect(x, y, fieldSize, fieldSize); // Rahmen zeichnen
        }
    }
}

function updateFieldCounts() {
    document.getElementById('redFieldCount').innerText = countField(red);
    document.getElementById('blueFieldCount').innerText = countField(blue);
}


function countField(_red){
    let count = 0;
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields[i].length; j++) {
            if (fields[i][j] === _red) 
            {
                count++;
            }  
        }
    }
    return count;
}

function updateBallPosition() {
    ballX1 += ballSpeedX1;
    ballY1 += ballSpeedY1;
    ballX2 += ballSpeedX2;
    ballY2 += ballSpeedY2;

    // Wände
    if (ballX1 + ballRadius > canvas.width || ballX1 - ballRadius < 0) {
        ballSpeedX1 = -ballSpeedX1;
    }
    if (ballY1 + ballRadius > canvas.height || ballY1 - ballRadius < 0) {
        ballSpeedY1 = -ballSpeedY1;
    }

    if (ballX2 + ballRadius > canvas.width || ballX2 - ballRadius < 0) {
        ballSpeedX2 = -ballSpeedX2;
    }
    if (ballY2 + ballRadius > canvas.height || ballY2 - ballRadius < 0) {
        ballSpeedY2 = -ballSpeedY2;
    }

    // Kollisionserkennung und Farbwechsel für Ball 1
    const fieldIndexX1 = Math.floor(ballX1 / fieldSize);
    const fieldIndexY1 = Math.floor(ballY1 / fieldSize);
    if (fieldIndexX1 >= 0 && fieldIndexX1 < numFields && fieldIndexY1 >= 0 && fieldIndexY1 < numFields) {
        if (fields[fieldIndexX1][fieldIndexY1] !== red) {
            fields[fieldIndexX1][fieldIndexY1] = red;
            const distX = ballX1 - (fieldIndexX1 * fieldSize + fieldSize / 2);
            const distY = ballY1 - (fieldIndexY1 * fieldSize + fieldSize / 2);
            if (Math.abs(distX) > Math.abs(distY)) {
                ballSpeedX1 = -ballSpeedX1;
                ballX1 += ballSpeedX1 > 0 ? 10 : -10;
            } else {
                ballSpeedY1 = -ballSpeedY1;
                ballY1 += ballSpeedY1 > 0 ? 10 : -10;
            }
        }
    }

    // Kollisionserkennung und Farbwechsel für Ball 2
    const fieldIndexX2 = Math.floor(ballX2 / fieldSize);
    const fieldIndexY2 = Math.floor(ballY2 / fieldSize);
    if (fieldIndexX2 >= 0 && fieldIndexX2 < numFields && fieldIndexY2 >= 0 && fieldIndexY2 < numFields) {
        if (fields[fieldIndexX2][fieldIndexY2] !== blue) {
            fields[fieldIndexX2][fieldIndexY2] = blue;
            const distX = ballX2 - (fieldIndexX2 * fieldSize + fieldSize / 2);
            const distY = ballY2 - (fieldIndexY2 * fieldSize + fieldSize / 2);
            if (Math.abs(distX) > Math.abs(distY)) {
                ballSpeedX2 = -ballSpeedX2;
                ballX2 += ballSpeedX2 > 0 ? 10 : -10;
            } else {
                ballSpeedY2 = -ballSpeedY2;
                ballY2 += ballSpeedY2 > 0 ? 10 : -10;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFields();
    updateFieldCounts();
    
    drawBall(ballX1, ballY1, '#4d050b');
    drawBall(ballX2, ballY2, '#010117');
    updateBallPosition();
    requestAnimationFrame(draw);
}


rangeInput.addEventListener('input', function() {
    // Den aktuellen Wert des Inputs abrufen
    const value = rangeInput.value;

    let x = parseInt(value) - speed;
    speed = parseInt(value);


    ballSpeedX1 += ballSpeedX1 < 0 ? -x : x; 
    ballSpeedX2 += ballSpeedX2 < 0 ? -x : x; 
    ballSpeedY1 += ballSpeedY1 < 0 ? -x : x; 
    ballSpeedY2 += ballSpeedY2 < 0 ? -x : x;  

    document.getElementById('rangeLabel').innerText = speed.toString();

});
draw();
