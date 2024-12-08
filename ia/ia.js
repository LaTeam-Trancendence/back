import startPongGame from "./bane.js";
import store from "@/store";


const paddleWidth = 20;
const paddleHeight = 120;
const paddleOffset = 86;
const ballSize = 10;
let PaddleSpeed = 6;

let i = 0;
let j = 0;

export default function AiController(){
    return {
        updateAi(gameState) {
            const canvasWidth = gameState.canvasWidth - paddleOffset;
            const canvasHeight = gameState.canvasHeight;
            let rightPaddleY = gameState.rightPaddleY;
            let ballSpeedX = gameState.ballSpeedX;
            let ballSpeedY = gameState.ballSpeedY;
            let ball_more_speed_x = gameState.ball_more_speed_x;
            let ball_more_speed_y = gameState.ball_more_speed_y;
            //t = tableau
            let t = previous(gameState.BallX, gameState.BallY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, canvasWidth, canvasHeight);
            let h = canvasHeight / 3; //haut
            let c = canvasHeight / 3 * 2; //centre
            let t1 = canvasWidth / 3; // gauche
            let t2 = canvasWidth / 3 * 2; // centre
            let bx = gameState.BallX;
            let by = gameState.BallY;
            let targetY = canvasHeight / 2 + paddleHeight / 2;
            if (t[2] == "gauche")
            {
                if (((by < h && bx >= t2) || (by >= h && by < c && bx < t1) || (by < h && bx < t1)) && t[3] == "descend") // hib 1/3 et cib 3/3 et hib 3/3
                {
                    targetY = h; // haut
                }
                else if ((by >= h && by < c && bx >= t2 && t[3] == "monte") || (by > c && bx >= t2 && t[3] == "descend") || (by > c && bx < t1 && t[3] == "descend")) //cih 1/3 et bib 3/3 1/3
                {
                    targetY = h; // haut
                }
                else if (((by > c && bx < t1) || (by > c && bx >= t2) || (by < h && bx < t1) || (by < h && bx >= t2)) && t[3] == "monte") // bih 1/3 bih 3/3 hih 1/3 hih 3/3
                {
                    targetY = c; // bas
                }
                else if (((by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2) || (by > c && bx >= t1 && bx < t2)) && t[3] == "descend") // hib 2/3 cib 2/3 bib 2/3
                {
                    targetY = canvasHeight / 2.5; //c haut
                }
                else if (((by >= c && bx >= t1 && bx < t2) || (by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2)) && t[3] == "monte") // bih 2/3 hih 2/3 cb 2/3
                {
                    targetY = canvasHeight / 3 * 1.5;
                }
                else
                {
                    targetY = canvasHeight / 2 + paddleHeight / 2;
                }
            }
            /*
            if (t[2] == "droite") //point d'arriver
            {
                if (t[3] == "monte")
                {

                }
                else
                {
    
                }
            }
            */
            if (rightPaddleY < targetY) {
                return PaddleSpeed; // Bouger vers le bas
            } else if (rightPaddleY >= targetY) {
                return -PaddleSpeed; // Bouger vers le haut
            }
            return 0; // Ne pas bouger centre
        }
    }
}

function previous(BX, BY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, canvasWidth, canvasHeight)
{
    const tableau = [0, 0, "null", "null"];
    let oldBY = 0.1;

    if (BX <= 0) // raquette gauche
    {
        tableau[0] = 0;
        tableau[1] = BY;
        tableau[2] = "gauche";
        return (tableau)
    }
    else if (BX >= canvasWidth) // raquette droite
    {
        tableau[0] = BX;
        tableau[1] = canvasWidth;
        tableau[2] = "droite";
        return (tableau)
    }
    while (BX > 0 && BX < canvasWidth)
    {
            // Logique de collision de la balle
        oldBY = BY;
        ballSpeedX += ball_more_speed_x; //ballSpeed ?
        ballSpeedY += ball_more_speed_y;
        BX += ballSpeedX * 2;
        BY += ballSpeedY * 2;
    
        // Collision avec le haut et le bas du canvas
        if (BY <= 0 || BY >= canvasHeight) {
            ballSpeedY = -ballSpeedY;
            ball_more_speed_y = -ball_more_speed_y;
        }
    
    
        if (BX <= 0 || BX >= canvasWidth)
        {
            tableau[0] = BX;
            tableau[1] = BY;
            if (BX <= 0)
                tableau[2] = "gauche";
            else if (BX >= canvasWidth)
                tableau[2] = "droite";
            if (BY > oldBY)
                tableau[3] = "monte";
            else
                tableau[3] = "descend";
            return (tableau)
        }
    }
}