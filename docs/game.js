const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const WIDTH = 400;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Define colors
const WALL_COLOR = '#2C3E50'; // Dark gray
const WHEEL_COLOR = '#E74C3C'; // Red
const OBJECT_COLOR = '#3498DB'; // Blue
const BACKGROUND_COLOR = '#ECF0F1'; // Light gray

// Game variables
const wheelRadius = 20;
let wheelX = WIDTH / 2;
let wheelY = HEIGHT / 2;
let velocityY = 0;
const gravity = 0.5;
const jumpForce = -10;
const wallThickness = 20;
let score = 0;
let lastTapTime = 0;
const doubleTapThreshold = 300; // in milliseconds
let onLeftWall = true; // The wheel starts on the left wall
let doubleTap = false; // Track if double tap has occurred

// Global variable to track game state
let gamePaused = false;

// Wall variables
let leftWallX = 0;
let rightWallX = WIDTH - wallThickness;
let wallSpeed = 1.5; // Changed to let for reassignment

// Object variables
const objectWidth = 30;
const objectHeight = 30;
let objectY = Math.random() * (HEIGHT - objectHeight);
let objectAttachedToLeft = Math.random() < 0.5; // Randomly attach to left or right wall

// Function to draw the wheel
function drawWheel() {
    ctx.fillStyle = WHEEL_COLOR;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Function to draw walls
function drawWalls() {
    ctx.fillStyle = WALL_COLOR;
    ctx.fillRect(leftWallX, 0, wallThickness, HEIGHT);
    ctx.fillRect(rightWallX, 0, wallThickness, HEIGHT);
}

// Function to draw the object
function drawObject() {
    const objectX = objectAttachedToLeft ? leftWallX + wallThickness : rightWallX - objectWidth;
    ctx.fillStyle = OBJECT_COLOR;
    ctx.fillRect(objectX, objectY, objectWidth, objectHeight);
}

// Function to display the score
function displayScore() {
    ctx.fillStyle = '#000000'; // Black
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Function to reset the game
function resetGame() {
    localStorage.setItem('lastScore', score); // Save the score to localStorage
    window.location.href = 'home.html'; // Redirect to home page
}

// Function to pause the game
function pauseGame() {
    gamePaused = true;
}

// Function to resume the game
function resumeGame() {
    gamePaused = false;
    gameLoop(); // Restart the game loop
}

// Main game loop
function gameLoop() {
    if (!gamePaused) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Wheel movement
        velocityY += gravity;
        wheelY += velocityY;

        // Move object
        objectY += 4;
        if (objectY > HEIGHT) {
            objectY = -objectHeight;
            objectAttachedToLeft = Math.random() < 0.5; // Randomly attach to left or right wall
            score += 1;
        }

        // Move walls
        leftWallX += wallSpeed;
        rightWallX -= wallSpeed;
        if (leftWallX >= wallThickness || rightWallX <= WIDTH - wallThickness) {
            wallSpeed = -wallSpeed;
        }

        // Check if wheel is on the wall
        if (onLeftWall) {
            wheelX = leftWallX + wallThickness;
        } else {
            wheelX = rightWallX - wheelRadius;
        }

        // Collision detection
        const objectX = objectAttachedToLeft ? leftWallX + wallThickness : rightWallX - objectWidth;
        if (objectX < wheelX + wheelRadius * 2 && objectX + objectWidth > wheelX && objectY < wheelY + wheelRadius * 2 && objectY + objectHeight > wheelY) {
            resetGame();
        }

        // Check if wheel is out of bounds (falls off the screen)
        if (wheelY < 0 || wheelY > HEIGHT) {
            resetGame();
        }

        // Drawing
        drawWheel();
        drawWalls();
        drawObject();
        displayScore();
    }

    // Update the screen
    requestAnimationFrame(gameLoop);
}

// Event handling
window.addEventListener('mousedown', (event) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < doubleTapThreshold) {
        doubleTap = true; // Mark double-tap
    } else {
        doubleTap = false; // Single-tap
    }
    lastTapTime = currentTime;

    if (doubleTap) {
        // Only jump on double tap, do not switch wall
        if (!gamePaused) {
            velocityY = jumpForce;
        }
    } else {
        // Switch wall on single tap
        if (!gamePaused) {
            onLeftWall = !onLeftWall;
            velocityY = jumpForce;
        }
    }
});

// Start the game loop
gameLoop();
