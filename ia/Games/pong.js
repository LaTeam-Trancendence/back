import store from "@/store";
import aiController from "./ia.js";

let isGameRunning = false;

function setupCanvas(canvas) {
    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        context.scale(dpr, dpr);
    };

    const context = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return context;
}

export default function startPongGame(canvas, onPaddleMove, GetScore) {
    const context = setupCanvas(canvas);

    let animationFrameId = null;
    isGameRunning = true;
  
    // Taille du canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Variables du jeu
    let player1 = 0;
    let player2 = 0;
    // const paddleWidth = 105;
    // const paddleHeight = 160;
    // const paddleOffset = 14;
    const ballSize = 10;
    const paddleWidth = canvas.width * 0.05;  // 5% de la largeur du canvas
    const paddleHeight = canvas.height * 0.2; // 20% de la hauteur du canvas
    const paddleOffset = canvas.width * 0.02; // 2% de la largeur du canvas
  
    let leftPaddleY = (canvas.height - paddleHeight) / 2;
    let rightPaddleY = (canvas.height - paddleHeight) / 2;
    let PaddleSpeed = 6;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
    let ballSpeedY = 0 * store.getters["GetBallSpeedManualState"];
    let ball_more_speed_x = 0;
    let ball_more_speed_y = 0;
  
    // Mouvement des raquettes
    let leftPaddleSpeed = 0;
    let rightPaddleSpeed = 0;
  
    // Dessiner la balle et les raquettes
    function Draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // Balle
        context.beginPath();
        context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        context.fillStyle = store.getters["GetColor2State"];
        context.fill();
    
        // Raquette gauche
        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.fillRect(paddleOffset, leftPaddleY, paddleWidth, paddleHeight);
    
        // Raquette droite
        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.fillRect((canvas.width - paddleWidth) - paddleOffset, rightPaddleY, paddleWidth, paddleHeight);
    }
  
    // Logique de collision de la balle
    function MoveBall() {
        ballX += ballSpeedX + ball_more_speed_x;
        ballY += ballSpeedY + ball_more_speed_y;
    
        // Collision avec le haut et le bas du canvas
        if (ballY <= 0 || ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY; // Inverser la direction
            ball_more_speed_y = -ball_more_speed_y; // Conserver l'effet de vitesse supplémentaire
        }
    
        // Collision avec la raquette gauche
        if (
            ballX - ballSize <= paddleOffset + paddleWidth &&
            ballY >= leftPaddleY &&
            ballY <= leftPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX; // Inverser la direction
            ball_more_speed_x = -ball_more_speed_x; // Conserver l'effet de vitesse supplémentaire
            ballX = paddleOffset + paddleWidth + ballSize;
    
            // Modifier ballSpeedY en fonction de l'impact
            const impact = (ballY - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = impact * 4;
        }
    
        // Collision avec la raquette droite
        if (
            ballX + ballSize >= canvas.width - paddleOffset - paddleWidth &&
            ballY >= rightPaddleY &&
            ballY <= rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX; // Inverser la direction
            ball_more_speed_x = -ball_more_speed_x; // Conserver l'effet de vitesse supplémentaire
            ballX = canvas.width - paddleOffset - paddleWidth - ballSize;
    
            // Modifier ballSpeedY en fonction de l'impact
            const impact = (ballY - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = impact * 4;
        }
    
        // Si la balle sort du canvas (score ou reset)
        if (ballX <= 0 || ballX >= canvas.width) {
            resetBall();
        }
    }

    let isSpeedIncreaseActive = true;
    function resetBall() {
        // Score et envoie score
        if (ballX >= canvas.width) {
            player1 = player1 + 1;
        }
        if (ballX <= 0) {
            player2 = player2 + 1;
        }
        if (typeof GetScore === 'function') {
            GetScore({player1, player2});
        }

        // Balle au centre et vitesse a 0
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 0 * store.getters["GetBallSpeedManualState"];
        ballSpeedY = 0 * store.getters["GetBallSpeedManualState"];
    
        // Réinitialisation des vitesses supplémentaires
        ball_more_speed_x = 0;
        ball_more_speed_y = 0;
        isSpeedIncreaseActive = false;
    
        // Appliquer une direction aléatoire pour `ballSpeedX`
        if (Math.random() >= 0.5) {
            ballSpeedX = -ballSpeedX;
        }

        // Attendre 4 seconde pour que la balle rebouge
        setTimeout(() => {
            ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
            isSpeedIncreaseActive = true;
        }, "1000");
    }
  
    // Mouvement des raquettes
    function MovePaddles() {
        leftPaddleY += leftPaddleSpeed;
        rightPaddleY += rightPaddleSpeed;
    
        // Empêcher les raquettes de sortir du canvas
        leftPaddleY = Math.max(0, Math.min(leftPaddleY, canvas.height - paddleHeight));
        rightPaddleY = Math.max(0, Math.min(rightPaddleY, canvas.height - paddleHeight));
    
        // Appeler la fonction de callback avec les positions mises à jour
        if (typeof onPaddleMove === 'function') {
            onPaddleMove({leftPaddleY, rightPaddleY, paddleOffset});
        }
    }

    // Augmenter vitesse de la balle
    let speedIntervalId = null;
    function IncreaseBallSpeed() {
        if (speedIntervalId !== null) return;
    
/*        speedIntervalId = setInterval(() => {
            if (!isSpeedIncreaseActive) return;

            if (Math.abs(ball_more_speed_x) < 40) {
                ball_more_speed_x += ballSpeedX > 0 ? 0.2 : -0.2;
            }
            if (Math.abs(ball_more_speed_y) < 40) {
                ball_more_speed_y += ballSpeedY > 0 ? 0.2 : -0.2;
            }
            if (Math.abs(ball_more_speed_x) >= 40 && Math.abs(ball_more_speed_y) >= 40) {
                clearInterval(speedIntervalId);
                speedIntervalId = null;
            }
        }, 800);*/
    }

    const gameState = {          
        canvasWidth : canvas.width,
        canvasHeight : canvas.height,
        paddleWidth : canvas.width * 0.05,
        paddleHeight : canvas.height * 0.2,
        paddleOffset : canvas.width * 0.02,
        ballSize : 10,
        rightPaddleY : rightPaddleY,
        PaddleSpeed : 6,
        gnow : Date.now(),
        ballX : ballX,
        ballY : ballY,
        ballSpeedX : ballSpeedX,
        ballSpeedY : ballSpeedY,
        ball_more_speed_x : ball_more_speed_x,
        ball_more_speed_y : ball_more_speed_y
    };

    function updateGameState()
    {
        gameState.rightPaddleY = rightPaddleY;
        gameState.gnow = Date.now();
        gameState.ballX = ballX;
        gameState.ballY = ballY;
        gameState.ballSpeedX = ballSpeedX;
        gameState.ballSpeedY = ballSpeedY;
        gameState.ball_more_speed_x = ball_more_speed_x;
        gameState.ball_more_speed_y = ball_more_speed_y;
    }

    let isAIEnabled = true; // Active l'IA
    let ai = aiController();
    let lastUpdateTime = Date.now();
    let sleep = 1000;
  
    // Fonction de jeu
    function gameLoop() {
        if (player1 >= 5 || player2 >= 5) {
            isGameRunning = false;
            cancelAnimationFrame(animationFrameId);
        }
        let now = Date.now();
        let t = now - lastUpdateTime;
        if (now - lastUpdateTime >= sleep)
        {
            updateGameState();
            console.log(t)
            console.log(gameState.ballSpeedX, gameState.ballSpeedY, gameState.ballX, gameState.ballY);
            lastUpdateTime = now;
        }
        MoveBall();
        MovePaddles();
        if (store.getters["GetBallSpeedTimeState"] == true) {
            IncreaseBallSpeed();
        }
        Draw();
        if (isAIEnabled && ai) 
        {
            rightPaddleSpeed = ai.updateAi(gameState);
        }
    
        if (isGameRunning) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }
  
    // Contrôle des raquettes
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
    gameLoop();
    if (isAIEnabled && ai) {
        const gameState = {          
            canvasWidth : canvas.width,
            canvasHeight : canvas.height,
            paddleWidth : canvas.width * 0.05,
            paddleHeight : canvas.height * 0.2,
            paddleOffset : canvas.width * 0.02,
            ballSize : 10,
            rightPaddleY : rightPaddleY,
            PaddleSpeed : 6,
            gnow : Date.now(),
            ballX : ballX,
            ballY : ballY,
            ballSpeedX : ballSpeedX,
            ballSpeedY : ballSpeedY,
            ball_more_speed_x : ball_more_speed_x,
            ball_more_speed_y : ball_more_speed_y
        };
        ai.updateAi(gameState);
        controlPaddlesLeftIA();
    }
    else 
    {
        controlPaddles();
    }
    return animationFrameId;
}

export function stopPongGame(animationFrameId) {
    if (animationFrameId && isGameRunning) {
        isGameRunning = false;
        cancelAnimationFrame(animationFrameId);
    } else {
        console.error("Aucune boucle de jeu active à annuler");
    }
}
