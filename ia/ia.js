import startPongGame from "./bane.js";
import store from "@/store";

const paddleWidth = 20;
const paddleHeight = 120;
const paddleOffset = 86;
const ballSize = 10;
let PaddleSpeed = 6;

let i = 0;
let tX = 0;
let tY = 0;
let j = 0;

const tabX = [0, 0, 0, 0]
const tabY = [0, 0, 0, 0]

const AX = [0, 0, 0, 0]
const AY = [0, 0, 0, 0]

function uptadeAI(gameState)
{
    const canvasWidth = gameState.canvasWidth - paddleOffset;
    const canvasHeight = gameState.canvasHeight;
    let rightPaddleY = gameState.rightPaddleY;
    let ballSpeedX = gameState.ballSpeedX;
    let ballSpeedY = gameState.ballSpeedY;
    let ball_more_speed_x = gameState.ball_more_speed_x;
    let ball_more_speed_y = gameState.ball_more_speed_y;
    while (i <= 3)
    {
        tabX[i] = gameState.BallX;
        tabY[i] = gameState.BallY;
        i++;
    }
    if (i >= 4)
    {
        j = 0;
        while (j <= 2)
        {
            tabX[j] = tabX[j + 1]
            tabY[j] = tabY[j + 1]
            j++;
        }
        tabX[3] = gameState.BallX;
        tabY[3] = gameState.BallY;
    }
    if (i < 4 && i != 0)
    {
        if (tabX[i] > tabX[i - 1])
        {
            if (tabX > canvasWidth)
            {
                if (tabY[i] > (canvasHeight / 2))
                {
                    if (tabY[i] > tabY[i - 1])
                    {

                    }
                    else
                    {

                    }   
                }
            }
            else
            {

            }
        }
    }
}

function anticipe(tabX, tabY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, AX, canvasWidth, canvasHeight)
{
    let BX = tabX[i];
    let BY = tabY[i];
    let n = 0;

    while (tabX <= canvasWidth)
    {
//        ballSpeedX += ball_more_speed_x; //ballSpeed ?
//        ballSpeedY += ball_more_speed_y;
        if (tabX[i] > tabX[i - 1]) // vers la droite
        {
            if (tabX > canvasWidth)
            {
                if (tabY[i] > (canvasHeight / 2))
                {
                    if (tabY[i] > tabY[i - 1])
                    {
    
                    }
                    else
                    {
    
                    }   
                }
            }
            else
            {
    
            }
        }
        else if (tabX[i] < tabX[i - 1]) // vers la gauche
        {
            BX += tabX[i];
            BY += tabX[i];
        }
        tabX[i - 1] = tabX[i];
        tabY[i - 1] = tabY[i];
        tabX[i] += ballSpeedX;
        tabY[i] += ballSpeedY;
        BX += ballSpeedX;
        BY += ballSpeedY;
        n++;
    }
    return AX
}

function previous(tabX, tabY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, AX, canvasWidth, canvasHeight)
{
    let nb = 0;
    const tableau = new Array(20).fill(0);

    while (nb < 10)
    {
            // Logique de collision de la balle
        ballSpeedX += ball_more_speed_x; //ballSpeed ?
        ballSpeedY += ball_more_speed_y;
        ballX += ballSpeedX * 2;
        ballY += ballSpeedY * 2;
    
        // Collision avec le haut et le bas du canvas
        if (ballY <= 0 || ballY >= canvasHeight) {
            ballSpeedY = -ballSpeedY;
            ball_more_speed_y = -ball_more_speed_y;
        }
    
    
        if (tabX <= 0) // raquette gauche
        {

        }
        
        if (tabX >= canvasWidth) // raquette droite
        {

        }
        tableau[nb] = ballX;
        tableau[nb + 10] = ballY;
        nb++;
    }
}