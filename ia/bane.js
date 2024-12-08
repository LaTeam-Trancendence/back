import store from "@/store";
import uptadeAI from "./bane.js";

function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    return context;
}

export default function startPongGame(canvas, onPaddleMove) {
    // const context = canvas.getContext("2d");
    const context = setupCanvas(canvas);
  
    // Taille du canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Variables du jeu
    const paddleWidth = 20;
    const paddleHeight = 120;
    const paddleOffset = 86;
    const ballSize = 10;
  
    let leftPaddleY = (canvas.height - paddleHeight) / 2; //h = (800 - 120) / 2 = 680 / 2 = 340
    let rightPaddleY = (canvas.height - paddleHeight) / 2;
    let PaddleSpeed = 6;
    let ballX = canvas.width / 2; //h=1400 = 1400 / 2 = 700 x
    let ballY = canvas.height / 2; //h=800 = 800 /2 = 400 y
    let ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
    let ballSpeedY = 4 * store.getters["GetBallSpeedManualState"];
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
        ballSpeedX += ball_more_speed_x; //ballSpeed ?
        ballSpeedY += ball_more_speed_y;
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    
        // Collision avec le haut et le bas du canvas
        if (ballY <= 0 || ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
            ball_more_speed_y = -ball_more_speed_y;
        }
    
        // // Collision avec la raquette gauche
        if (
            ballX - ballSize <= paddleOffset + paddleWidth && 
            ballY >= leftPaddleY && 
            ballY <= leftPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            ball_more_speed_x = -ball_more_speed_x;
            ballX = paddleOffset + paddleWidth + ballSize;
        
            // Modifier ballSpeedY en fonction de l'impact
            const impact = (ballY - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = impact * 5; // Ajustez ce multiplicateur pour contrôler l'effet
        }
        
        if (
            ballX + ballSize >= canvas.width - paddleOffset - paddleWidth && 
            ballY >= rightPaddleY && 
            ballY <= rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            ball_more_speed_x = -ball_more_speed_x;
            ballX = canvas.width - paddleOffset - paddleWidth - ballSize;
        
            // Modifier ballSpeedY en fonction de l'impact
            const impact = (ballY - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = impact * 5; // Ajustez ce multiplicateur pour contrôler l'effet
        }
    
        // Si la balle sort du canvas (score ou reset)
        if (ballX <= 0 || ballX >= canvas.width) {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 8 * store.getters["GetBallSpeedManualState"];
            ballSpeedY = 4 * store.getters["GetBallSpeedManualState"];
            if (Math.random() >= 0.5) {
                ballSpeedX = -ballSpeedX;
            }
            ball_more_speed_x = -ball_more_speed_x;
            ball_more_speed_x = 0;
            ball_more_speed_y = 0;
        }
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
            onPaddleMove({leftPaddleY, rightPaddleY});
        }
    }

    // Mouvement des raquettes
    function IncreaseBallSpeed() 
    {
        if (ball_more_speed_x < 10 && ball_more_speed_x > -10) 
        {
            if (ball_more_speed_x < 0) 
            {
                ball_more_speed_x = ball_more_speed_x - 0.00001;
            }
            else {
                ball_more_speed_x = ball_more_speed_x + 0.00001;
            }
        }
        if (ball_more_speed_y < 10  && ball_more_speed_y > -10) 
        {
            if (ball_more_speed_y < 0)
            {
                ball_more_speed_y = ball_more_speed_y - 0.00001;
            }
            else
            {
                ball_more_speed_y = ball_more_speed_y + 0.00001;
            }
        }
    }


    let aiController = new uptadeAI(); //attention au chemin d'importation
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
  
    // Contrôle des raquettes
    function controlPaddles() 
    {
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
  