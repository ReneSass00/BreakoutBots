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

const rangeInput = document.getElementById('speedRange');
const penaltyRange = document.getElementById('penaltyRange');

const paddleHeight = 100;
const paddleWidth = 10;

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;
let leftPaddleMovingUp = false;
let leftPaddleMovingDown = false;
let rightPaddleMovingUp = false;
let rightPaddleMovingDown = false;
let penaltyDamage = 1;

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


function drawPaddles() {
    // Linke Wand
    ctx.fillStyle = '#000';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

    // Rechte Wand
    ctx.fillStyle = '#000';
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

function updateFieldCounts() {
    const redCount = fields.flat().filter(color => color === red).length;
    const blueCount = fields.flat().filter(color => color === blue).length;
    document.getElementById('redFieldCount').innerText = redCount;
    document.getElementById('blueFieldCount').innerText = blueCount;
}


function updateBallPosition() {
    ballX1 += ballSpeedX1;
    ballY1 += ballSpeedY1;
    ballX2 += ballSpeedX2;
    ballY2 += ballSpeedY2;
    
    if (checkBallPaddleCollision()){
        return;
    }

    // Wände
    if (ballX1 + ballRadius > canvas.width || ballX1 - (ballRadius) < 0) {
        if (ballX1 - (ballRadius) < 0){
            backwallTouched(red);
        }
        ballSpeedX1 = -ballSpeedX1;
        ballX1 += ballSpeedX1 > 0 ? 10 : -10;
    }
    if (ballY1 + ballRadius > canvas.height || ballY1 - (ballRadius) < 0) {
        ballSpeedY1 = -ballSpeedY1;
        ballY1 += ballSpeedY1 > 0 ? 10 : -10;
    }

    if (ballX2 + ballRadius > canvas.width || ballX2 - (ballRadius) < 0) {
        if (ballX2 + ballRadius > canvas.width){
            backwallTouched(blue);
        }
        ballSpeedX2 = -ballSpeedX2;
        ballX2 += ballSpeedX2 > 0 ? 10 : -10;
    }
    if (ballY2 + ballRadius > canvas.height || ballY2 - (ballRadius) < 0) {
        ballSpeedY2 = -ballSpeedY2;
        ballY2 += ballSpeedY2 > 0 ? 10 : -10;
    }

    // Kollisionserkennung und Farbwechsel für Ball 1
    const fieldIndexX1 = Math.floor(ballX1 / fieldSize);
    const fieldIndexY1 = Math.floor(ballY1 / fieldSize);
    if (fieldIndexX1 !== 15 && fieldIndexX1 < numFields && fieldIndexY1 >= 0 && fieldIndexY1 < numFields) {
        if (fields[fieldIndexX1][fieldIndexY1] !== red) {
            fields[fieldIndexX1][fieldIndexY1] = red;
            const distX = ballX1 - (fieldIndexX1 * fieldSize + fieldSize / 2);
            const distY = ballY1 - (fieldIndexY1 * fieldSize + fieldSize / 2);
            if (Math.abs(distX) > Math.abs(distY)) {
                ballSpeedX1 = -ballSpeedX1;
                ballX1 += ballSpeedX1 > 0 ? 2 : -2;
            } else {
                ballSpeedY1 = -ballSpeedY1;
                ballY1 += ballSpeedY1 > 0 ? 2 : -2;
            }
            scoreUpdate('redFieldCount');
        }
    }

    // Kollisionserkennung und Farbwechsel für Ball 2
    const fieldIndexX2 = Math.floor(ballX2 / fieldSize);
    const fieldIndexY2 = Math.floor(ballY2 / fieldSize);
    if (fieldIndexX2 !== 0 && fieldIndexX2 < numFields && fieldIndexY2 >= 0 && fieldIndexY2 < numFields) {
        if (fields[fieldIndexX2][fieldIndexY2] !== blue) {
            fields[fieldIndexX2][fieldIndexY2] = blue;
            const distX = ballX2 - (fieldIndexX2 * fieldSize + fieldSize / 2);
            const distY = ballY2 - (fieldIndexY2 * fieldSize + fieldSize / 2);
            if (Math.abs(distX) > Math.abs(distY)) {
                ballSpeedX2 = -ballSpeedX2;
                ballX2 += ballSpeedX2 > 0 ? 5 : 5;
            } else {
                ballSpeedY2 = -ballSpeedY2;
                ballY2 += ballSpeedY2 > 0 ? 5 : 5;
            }
            scoreUpdate('blueFieldCount');
        }
    }
}

function checkBallPaddleCollision() {
    // Ball 1 mit Paddle 1
    if (ballX1 - ballRadius < paddleWidth && ballY1 > leftPaddleY && ballY1 < leftPaddleY + paddleHeight) {
        ballSpeedX1 = -ballSpeedX1; // Richtung umkehren
        ballX1 += ballSpeedX1 > 0 ? 5 : -5;
        return true;
    }

    // Ball 2 mit Paddle 2
    if (ballX2 + ballRadius > canvas.width - paddleWidth && ballY2 > rightPaddleY && ballY2 < rightPaddleY + paddleHeight) {
        ballSpeedX2 = -ballSpeedX2; // Richtung umkehren
        ballX2 += ballSpeedX2 > 0 ? 5 : -5;
        return true;
    }
    return false;
    
}


function scoreUpdate(elementid){
    // Zeige die Strafe an und füge die Animationsklasse hinzu
    const penaltyElement = document.getElementById(elementid);
    penaltyElement.style.visibility = 'visible';
    penaltyElement.style.animation = 'none'; // Animation zurücksetzen
    setTimeout(() => {
        penaltyElement.style.animation = ''; // Animation neu starten
    }, 10);
}

function backwallTouched(ballColor) {
    const ownColor = ballColor === red ? red : blue;
    const opponentColor = ballColor === red ? blue : red;
    const penaltyId = ballColor === red ? 'redFieldPenalty' : 'blueFieldPenalty';
    const effectId = ballColor === red ? 'redFieldEffect' : 'blueFieldEffect';

    // Zeige die Strafe an und füge die Animationsklasse hinzu
    const penaltyElement = document.getElementById(penaltyId);
    penaltyElement.style.visibility = 'visible';
    penaltyElement.style.animation = 'none'; // Animation zurücksetzen
    setTimeout(() => {
        penaltyElement.style.animation = ''; // Animation neu starten
    }, 10);

    // Erzeuge Partikel-Effekt
    createParticles(effectId, 20);

    setTimeout(() => {
        penaltyElement.style.visibility = 'hidden';
    }, 1000); // Versteckt die Anzeige nach 1 Sekunde


    let ownFields = [];
    if (ballColor === red){
        for (let i = 1; i < numFields; i++) {
            for (let j = 0; j < numFields; j++) {
                if (fields[i][j] === ownColor) {
                    ownFields.push({ x: i, y: j });
                }
            }
        }
    }
    else {
        for (let i = 1; i < numFields-1; i++) {
            for (let j = 0; j < numFields; j++) {
                if (fields[i][j] === ownColor) {
                    ownFields.push({ x: i, y: j });
                }
            }
        }
    }
    
    

    for (let i = 0; i < penaltyDamage; i++) {
        if (ownFields.length === 0) break; 
        const randomIndex = Math.floor(Math.random() * ownFields.length);
        const { x, y } = ownFields[randomIndex];
        fields[x][y] = opponentColor;
        ownFields.splice(randomIndex, 1);
    }
}


function updatePaddlePosition() {
    if (leftPaddleMovingUp && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }
    if (leftPaddleMovingDown && leftPaddleY < canvas.height - paddleHeight) {
        leftPaddleY += paddleSpeed;
    }
    if (rightPaddleMovingUp && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }
    if (rightPaddleMovingDown && rightPaddleY < canvas.height - paddleHeight) {
        rightPaddleY += paddleSpeed;
    }
}

function createParticles(elementId, count) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.top = `${Math.random() * 20 - 10}px`;
        particle.style.left = `${Math.random() * 20 - 10}px`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        element.appendChild(particle);
    }
    element.style.visibility = 'visible';
    setTimeout(() => {
        element.style.visibility = 'hidden';
    }, 1000); // Versteckt die Anzeige nach 1 Sekunde
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFields();
    updateFieldCounts();
    
    drawBall(ballX1, ballY1, '#4d050b');
    drawBall(ballX2, ballY2, '#010117');
    drawPaddles();
    updateBallPosition();
    updatePaddlePosition();
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        leftPaddleMovingUp = true;
    }
    if (event.key === 's') {
        leftPaddleMovingDown = true;
    }
    if (event.key === 'ArrowUp') {
        rightPaddleMovingUp = true;
    }
    if (event.key === 'ArrowDown') {
        rightPaddleMovingDown = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        leftPaddleMovingUp = false;
    }
    if (event.key === 's') {
        leftPaddleMovingDown = false;
    }
    if (event.key === 'ArrowUp') {
        rightPaddleMovingUp = false;
    }
    if (event.key === 'ArrowDown') {
        rightPaddleMovingDown = false;
    }
});

penaltyRange.addEventListener('input', function() {
    // Den aktuellen Wert des Inputs abrufen

    const value = penaltyRange.value;
    penaltyDamage = value; 

    document.getElementById('rangeLabelPenalty').innerText = penaltyDamage.toString();

});

rangeInput.addEventListener('input', function() {
    // Den aktuellen Wert des Inputs abrufen
    const value = rangeInput.value;
    let x = parseInt(value) - speed;
    speed = parseInt(value);


    ballSpeedX1 += ballSpeedX1 < 0 ? -x : x; 
    ballSpeedX2 += ballSpeedX2 < 0 ? -x : x; 
    ballSpeedY1 += ballSpeedY1 < 0 ? -x : x; 
    ballSpeedY2 += ballSpeedY2 < 0 ? -x : x;  

    document.getElementById('rangeLabelSpeed').innerText = speed.toString();

});
draw();
