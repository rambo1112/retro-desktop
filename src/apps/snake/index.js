export function createSnakeGame() {
    // 1. Inject Styles
    if (!document.getElementById('css-snake')) {
        const link = document.createElement('link');
        link.id = 'css-snake'; link.rel = 'stylesheet';
        link.href = './src/apps/snake/styles.css';
        document.head.appendChild(link);
    }

    // 2. DOM Structure
    const container = document.createElement('div');
    container.className = 'snake-app';
    container.innerHTML = `
        <div class="snake-header">
            <span>SCORE: <span id="score">0</span></span>
            <span style="font-size:0.8em">Arrows to move</span>
        </div>
        <canvas width="300" height="300"></canvas>
        <div class="snake-overlay" id="overlay">
            <h2 id="msg">GAME OVER</h2>
            <button id="restart-btn">Play Again</button>
        </div>
    `;

    // 3. Game Variables
    const canvas = container.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');
    const overlay = container.querySelector('#overlay');
    const msgEl = container.querySelector('#msg');
    const restartBtn = container.querySelector('#restart-btn');

    const gridSize = 15; // Size of one square
    const tileCount = canvas.width / gridSize; // 20x20 grid

    let score = 0;
    let velocity = { x: 0, y: 0 };
    let trail = [];
    let tailLength = 5;
    let player = { x: 10, y: 10 };
    let apple = { x: 15, y: 15 };
    let gameInterval = null;
    let isRunning = false;

    // 4. core Logic
    function startGame() {
        score = 0;
        tailLength = 5;
        trail = [];
        player = { x: 10, y: 10 };
        velocity = { x: 0, y: 0 }; // Stationary at start
        placeApple();
        scoreEl.innerText = score;
        overlay.style.display = 'none';
        
        if (gameInterval) clearInterval(gameInterval);
        isRunning = true;
        gameInterval = setInterval(gameLoop, 1000 / 10); // 10 FPS (Classic feel)
    }

    function gameLoop() {
        if (!isRunning) return;

        // Move Player
        player.x += velocity.x;
        player.y += velocity.y;

        // Wall Collision (Wrap around logic)
        if (player.x < 0) player.x = tileCount - 1;
        if (player.x > tileCount - 1) player.x = 0;
        if (player.y < 0) player.y = tileCount - 1;
        if (player.y > tileCount - 1) player.y = 0;

        // Draw Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Snake
        ctx.fillStyle = "lime";
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
            
            // Self Collision check
            // Only check if we are actually moving
            if (trail[i].x === player.x && trail[i].y === player.y && (velocity.x !== 0 || velocity.y !== 0)) {
                gameOver();
            }
        }

        // Move Trail
        trail.push({ x: player.x, y: player.y });
        while (trail.length > tailLength) {
            trail.shift();
        }

        // Draw Apple
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);

        // Eat Apple
        if (apple.x === player.x && apple.y === player.y) {
            tailLength++;
            score += 10;
            scoreEl.innerText = score;
            placeApple();
        }
    }

    function placeApple() {
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
    }

    function gameOver() {
        isRunning = false;
        clearInterval(gameInterval);
        msgEl.innerText = `GAME OVER\nScore: ${score}`;
        overlay.style.display = 'block';
    }

    function handleInput(e) {
        // Prevent default scrolling for arrow keys
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowLeft':  if (velocity.x !== 1)  velocity = { x: -1, y: 0 }; break;
            case 'ArrowUp':    if (velocity.y !== 1)  velocity = { x: 0, y: -1 }; break;
            case 'ArrowRight': if (velocity.x !== -1) velocity = { x: 1, y: 0 }; break;
            case 'ArrowDown':  if (velocity.y !== -1) velocity = { x: 0, y: 1 }; break;
        }
    }

    // 5. Setup Listeners
    // We attach keydown to the Container (div) so it only captures keys when focused!
    // To make a div receive keyboard events, it needs a tabindex.
    container.tabIndex = 0; 
    container.style.outline = 'none'; // remove blue focus ring
    container.addEventListener('keydown', handleInput);
    
    // Auto-focus the game when clicked so controls work immediately
    container.addEventListener('click', () => container.focus());

    restartBtn.addEventListener('click', startGame);

    // Clean up when window is closed (MutationObserver or Custom Event from OS is better, 
    // but for now we rely on the fact that if the DOM is removed, interval stops eventually)
    // A quick hack for cleaning intervals: attach it to the element
    container._intervalId = gameInterval; 

    // Start immediately
    startGame();

    return container;
}