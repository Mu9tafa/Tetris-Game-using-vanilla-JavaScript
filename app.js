document.addEventListener("DOMContentLoaded", () => {

    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const width = 10;
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-btn");
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'lightblue',
        'red',
        'purple',
        'green',
        'blue'
    ];


    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPostion = 4;
    let currentRotation = 0;

    // randomly select a Tetromino and its rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // draw the Tetromino
    function draw() {
        current.forEach(item => {
            squares[currentPostion + item].classList.add("tetromino")
            squares[currentPostion + item].style.backgroundColor = colors[random];
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(item => {
            squares[currentPostion + item].classList.remove("tetromino")
            squares[currentPostion + item].style.backgroundColor = '';
        })
    }


    // assign function to keyCodes
    document.addEventListener("keyup", control);
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

    // moveDown function 
    function moveDown() {
        undraw();
        currentPostion += width;
        draw();
        freeze();
    }
    
    // freeze function
    function freeze() {
        if(current.some(item => squares[currentPostion + item + width].classList.contains("taken"))) {
            current.forEach(item => squares[currentPostion + item].classList.add("taken"))
            // start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPostion = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left, unless at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(item => (currentPostion + item) % width === 0);
        if(!isAtLeftEdge) {
            currentPostion -=1;
        }
        if(current.some(item => squares[currentPostion + item].classList.contains("taken"))) {
            currentPostion +=1;
        }
        draw();
    }

    // move the tetromino right, unless at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(item => (currentPostion + item) % width === width - 1);
        if(!isAtRightEdge) {
            currentPostion +=1;
        }
        if(current.some(item => squares[currentPostion + item].classList.contains("taken"))) {
            currentPostion -=1;
        }
        draw();
    }


    // rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        // if the current rotation gets 4 make it go back to 0
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }


    // show up-next tetromino in the mini-grid 
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    const displayIndex = 0;

    // the tetromino without rotations
    const upNextTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2], //ltetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //ztetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tteromino
        [0, 1, displayWidth, displayWidth + 1], //otetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //itetromino
    ];

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove("tetromino")
            square.style.backgroundColor = '';
        })
        upNextTetromino[nextRandom].forEach(item => {
            displaySquares[displayIndex + item].classList.add("tetromino");
            displaySquares[displayIndex + item].style.backgroundColor = colors[nextRandom];
        })
    }


    // adding functionality to start button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })


    // add score function
    function addScore() {
        for(let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(item => squares[item].classList.contains("taken"))) {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(item => {
                    squares[item].classList.remove("taken");
                    squares[item].classList.remove("tetromino");
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }


    // Game over function
    function gameOver() {
        if(current.some(item => squares[currentPostion + item].classList.contains("taken"))){
            scoreDisplay.innerHTML = "end";
            clearInterval(timerId);
        }
    }

})