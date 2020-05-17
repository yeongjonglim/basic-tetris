document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    const restartButton = document.querySelector('#restart-button');
    let nextRandom = 0;
    let score = 0;
    let timerId;
    let timerSpeed = 1000;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
        'violet',
        'black'
    ]

    // The Tetrominoes
    const jTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ];

    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 0],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2, GRID_WIDTH + 2]
    ];

    const sTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ];

    const zTetromino = [
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [2, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [2, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1]
    ];

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ];

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ];

    const theTetrominoes = [jTetromino, lTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;

    // Randomly select a tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // Draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // Undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // Assign function to keycodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if(e.keyCode === 38) {
            rotate();
        } else if(e.keyCode === 39) {
            moveRight();
        } else if(e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control);

    // Move down function
    function moveDown() {
        displayShape();
        undraw();
        currentPosition += GRID_WIDTH;
        draw();
        freeze();
        addScore();
        gameOver();
    }

    // Freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('taken'))) {
            current.forEach(index => {
                squares[currentPosition + index].classList.add('taken');
            });
            // Start a new tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        };
    }

    // Move the tetromino left unless it is the edge or blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0);
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Move the tetromino right unless it is the edge or blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH-1);
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // Show up next in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 1;

    const upNextTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // jTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, 0], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // sTetromino
        [0, 1, displayWidth + 1, displayWidth + 2], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ];

    function displayShape() {
        // remove any existing shape in the mini-grid first
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        // colour those for upcoming tetromino
        upNextTetromino[nextRandom].forEach(index => {
            console.log(index);
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }

    // Add functionality in start button
    startButton.addEventListener('click', () => {
        if (timerId) {
            pause();
        } else {
            start();
        }
    });

    function start() {
        draw();
        // Make the tetromino move down every second
        timerId = setInterval(moveDown, timerSpeed);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }

    function pause() {
        clearInterval(timerId);
        timerId = null;
    }

    // Add functionality in restart button
    restartButton.addEventListener('click', () => {
        pause();
        for (let i = 0; i < 199; i += GRID_WIDTH) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            });
            const squaresRemoved = squares.splice(i, GRID_WIDTH);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        scoreDisplay.innerHTML = 0;
    });

    // Add scoring
    function addScore() {
        for (let i = 0; i < 199; i += GRID_WIDTH) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, GRID_WIDTH);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = `Game Over! Your score is ${score}.`;
            clearInterval(timerId);
            document.removeEventListener('keyup', control);
        }
    }
});
