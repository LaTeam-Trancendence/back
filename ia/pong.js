import store from "@/store";
import aiController from "./ia.js";

function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    return context;
}

export default function startPongGame(canvas, onPaddleMove) {
    console.log("Jeu initialisé !");
    // const context = canvas.getContext("2d");
    const context = setupCanvas(canvas);
  
    // Taille du canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    let isPortrait = window.innerHeight > window.innerWidth; // Orientation initiale
    const paddleWidth = 20;
    const paddleHeight = 120;
    const paddleOffset = 86;
    const ballSize = 10;

    let leftPaddlePos = (isPortrait ? canvas.width : canvas.height - paddleHeight) / 2;
    let rightPaddlePos = (isPortrait ? canvas.width : canvas.height - paddleHeight) / 2;

    let PaddleSpeed = 6;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
    let ballSpeedY = 4 * store.getters["GetBallSpeedManualState"];
    let ball_more_speed_x = 0;
    let ball_more_speed_y = 0;

    let leftPaddleSpeed = 0;
    let rightPaddleSpeed = 0;
  
    function Draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Balle
        context.beginPath();
        context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        context.fillStyle = store.getters["GetColor2State"];
        context.fill();

        // Raquettes
        context.fillStyle = "rgba(255, 255, 255, 0)";
        if (isPortrait) {
            context.fillRect(leftPaddlePos, paddleOffset, paddleHeight, paddleWidth);
            context.fillRect(rightPaddlePos, canvas.height - paddleOffset - paddleWidth, paddleHeight, paddleWidth);
        } else {
            context.fillRect(paddleOffset, leftPaddlePos, paddleWidth, paddleHeight);
            context.fillRect(canvas.width - paddleOffset - paddleWidth, rightPaddlePos, paddleWidth, paddleHeight);
        }
    }
  
    function MoveBall() {
        ballSpeedX += ball_more_speed_x;
        ballSpeedY += ball_more_speed_y;
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (isPortrait) {
            // Collision avec les côtés
            if (ballX <= 0 || ballX >= canvas.width) {
                ballSpeedX = -ballSpeedX;
                ball_more_speed_x = -ball_more_speed_x;
            }

            // Collision avec les raquettes
            if (
                (ballY - ballSize <= paddleOffset + paddleWidth && ballX >= leftPaddlePos && ballX <= leftPaddlePos + paddleHeight) ||
                (ballY + ballSize >= canvas.height - paddleOffset - paddleWidth && ballX >= rightPaddlePos && ballX <= rightPaddlePos + paddleHeight)
            ) {
                ballSpeedY = -ballSpeedY;
                ball_more_speed_y = -ball_more_speed_y;
            }
        } else {
            // Collision avec le haut et le bas
            if (ballY <= 0 || ballY >= canvas.height) {
                ballSpeedY = -ballSpeedY;
                ball_more_speed_y = -ball_more_speed_y;
            }

            // Collision avec les raquettes
            if (
                (ballX - ballSize <= paddleOffset + paddleWidth && ballY >= leftPaddlePos && ballY <= leftPaddlePos + paddleHeight) ||
                (ballX + ballSize >= canvas.width - paddleOffset - paddleWidth && ballY >= rightPaddlePos && ballY <= rightPaddlePos + paddleHeight)
            ) {
                ballSpeedX = -ballSpeedX;
                ball_more_speed_x = -ball_more_speed_x;
            }
        }

        // Réinitialisation en cas de sortie
        if (ballX <= 0 || ballX >= canvas.width) {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
            ballSpeedY = 4 * store.getters["GetBallSpeedManualState"];
            if (Math.random() >= 0.5) {
                ballSpeedX = -ballSpeedX;
            }
            ball_more_speed_x = 0;
            ball_more_speed_y = 0;
        }
    }
  
    function MovePaddles() {
        if (isPortrait) {
            leftPaddlePos += leftPaddleSpeed;
            rightPaddlePos += rightPaddleSpeed;

            leftPaddlePos = Math.max(0, Math.min(leftPaddlePos, canvas.width - paddleHeight));
            rightPaddlePos = Math.max(0, Math.min(rightPaddlePos, canvas.width - paddleHeight));
        } else {
            leftPaddlePos += leftPaddleSpeed;
            rightPaddlePos += rightPaddleSpeed;

            leftPaddlePos = Math.max(0, Math.min(leftPaddlePos, canvas.height - paddleHeight));
            rightPaddlePos = Math.max(0, Math.min(rightPaddlePos, canvas.height - paddleHeight));
        }

        if (typeof onPaddleMove === 'function') {
            onPaddleMove({ leftPaddleY: leftPaddlePos, rightPaddleY: rightPaddlePos });
        }
    }

    function IncreaseBallSpeed() {
        if (ball_more_speed_x < 10 && ball_more_speed_x > -10) {
            ball_more_speed_x += ball_more_speed_x < 0 ? -0.00001 : 0.00001;
        }
        if (ball_more_speed_y < 10 && ball_more_speed_y > -10) {
            ball_more_speed_y += ball_more_speed_y < 0 ? -0.00001 : 0.00001;
        }
    }

    function ResizeWindow() {
        isPortrait = window.innerHeight > window.innerWidth;
        setupCanvas(canvas);

        leftPaddlePos = (isPortrait ? canvas.width : canvas.height - paddleHeight) / 2;
        rightPaddlePos = (isPortrait ? canvas.width : canvas.height - paddleHeight) / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }   

    let isAIEnabled = true; // Active l'IA
    let aiController = new uptadeAi(); //attention au chemin d'importation
    function gameLoop() 
    {
        Draw();
        MoveBall();
        MovePaddles();
        if (store.getters["GetBallSpeedTimeState"] == true) 
        {
            IncreaseBallSpeed();
        }
        if (isAIEnabled && aiController) 
        {
            rightPaddleSpeed = aiController.updateAi(gameState);
        }
    
        requestAnimationFrame(gameLoop);
//        clearInterval(myInterval);
    }
  
    function controlPaddles() {
        window.addEventListener("keydown", (event) => {
            const layoutState = store.getters["GetLayoutState"];

            if (event.key === "ArrowUp") rightPaddleSpeed = -PaddleSpeed;
            if (event.key === "ArrowDown") rightPaddleSpeed = PaddleSpeed;
            if (layoutState) {
                if (event.key === "w") leftPaddleSpeed = -PaddleSpeed;
            }
            else {
                if (event.key === "z") leftPaddleSpeed = -PaddleSpeed;
            }
            if (event.key === "s") leftPaddleSpeed = PaddleSpeed;
        });

        window.addEventListener("keyup", (event) => {
            const layoutState = store.getters["GetLayoutState"];

            if (event.key === "ArrowUp" || event.key === "ArrowDown") rightPaddleSpeed = 0;
            if (layoutState) {
                if (event.key === "w" || event.key === "s") leftPaddleSpeed = 0;
            }
            else {
                if (event.key === "z" || event.key === "s") leftPaddleSpeed = 0;
            }
        });
    }

    function controlPaddlesLeftIA() 
    {
         // Ia rightPaddleSpeed = -PaddleSpeed;
        window.addEventListener("keydown", (event) => {
            const layoutState = store.getters["GetLayoutState"];
            if (layoutState) {
                if (event.key === "w") leftPaddleSpeed = -PaddleSpeed;
            }
            else {
                if (event.key === "z") leftPaddleSpeed = -PaddleSpeed;
            }
            if (event.key === "s") leftPaddleSpeed = PaddleSpeed;
        });
    
        window.addEventListener("keyup", (event) => {
            const layoutState = store.getters["GetLayoutState"];
            if (layoutState) {
                if (event.key === "w" || event.key === "s") leftPaddleSpeed = 0;
            }
            else {
                if (event.key === "z" || event.key === "s") leftPaddleSpeed = 0;
            }
        });
    }

    // Démarrer le jeu
    if (isAIEnabled && aiController) {
        const gameState = {          
            canvasWidth : canvas.width,
            canvasHeight : canvas.height,
            paddleWidth : 20,
            paddleHeight : 120,
            paddleOffset : 86,
            ballSize : 10,
            rightPaddleY : (canvas.height - paddleHeight) / 2,
            PaddleSpeed : 6,

            ballX : ballX,
            ballY : ballY,
            ballSpeedX : ballSpeedX,
            ballSpeedY : ballSpeedY,
            ball_more_speed_x : ball_more_speed_x,
            ball_more_speed_y : ball_more_speed_y
        };
        aiController.updateAi(gameState);
        controlPaddlesLeftIA();
    }
    else 
    {
        controlPaddles();
    }
    gameLoop();
}
  