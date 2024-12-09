
const paddleWidth = 20;
const paddleHeight = 120;
const paddleOffset = 86;
const ballSize = 10;
let PaddleSpeed = 6;

let i = 0;

export default function aiController(){
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
            let t = [0, 0, "gauche", "monte"]
            t = previous(gameState.ballX, gameState.ballY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, canvasWidth, canvasHeight, t);
            console.log(t);
            let h = canvasHeight / 3; //haut
            let c = canvasHeight / 3 * 2; //centre
            let t1 = canvasWidth / 3; // gauche
            let t2 = canvasWidth / 3 * 2; // centre
            let bx = gameState.ballX;
            let by = gameState.ballY;
            let targetY = canvasHeight / 2 + paddleHeight / 2;
            if (t[2] == "gauche")
            {
                if (((by < h && bx >= t2) || (by >= h && by < c && bx < t1) || (by < h && bx < t1)) && t[3] == "descend") // hib 1/3 et cib 3/3 et hib 3/3
                {
                    targetY = h * 1.2; // haut
                    console.log("haut");
                }
                else if ((by >= h && by < c && bx >= t2 && t[3] == "monte") || (by > c && bx >= t2 && t[3] == "descend") || (by > c && bx < t1 && t[3] == "descend")) //cih 1/3 et bib 3/3 1/3
                {
                    targetY = h * 1.2; // haut
                    console.log("haut");
                }
                else if (((by > c && bx < t1) || (by > c && bx >= t2) || (by < h && bx < t1) || (by < h && bx >= t2)) && t[3] == "monte") // bih 1/3 bih 3/3 hih 1/3 hih 3/3
                {
                    targetY = c; // bas
                    console.log("bas");
                }
                else if (((by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2) || (by > c && bx >= t1 && bx < t2)) && t[3] == "descend") // hib 2/3 cib 2/3 bib 2/3
                {
                    targetY = canvasHeight / 5 * 2; //c haut
                    console.log("centre haut");
                }
                else if (((by >= c && bx >= t1 && bx < t2) || (by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2)) && t[3] == "monte") // bih 2/3 hih 2/3 cb 2/3
                {
                    targetY = canvasHeight / 5 * 3;
                    console.log("centre bas");
                }
                else
                {
                    targetY = canvasHeight / 2 + paddleHeight / 2;
                    console.log("centre");
                }
            }
            
            if (t[2] == "droite") //point d'arriver
            {
                console.log("droite");
                if (t[3] == "monte")
                {
                    if (rightPaddleY < bx)
                        targetY = rightPaddleY + PaddleSpeed;
                    else if ((rightPaddleY - paddleHeight) > bx)
                        targetY = rightPaddleY - PaddleSpeed;
                    console.log("monte");
                }
                else
                {
                    if ((rightPaddleY - paddleHeight) > bx)
                        targetY = rightPaddleY - PaddleSpeed;
                    else if (rightPaddleY < bx)
                        targetY = rightPaddleY + PaddleSpeed;
                    console.log("descend");
                }
            }
            
            if (rightPaddleY < targetY) {
                return PaddleSpeed; // Bouger vers le haut
            } else if (rightPaddleY >= targetY) {
                return -PaddleSpeed; // Bouger vers le bas
            }
            return 0; // Ne pas bouger centre
        }
    }
}

function previous(BX, BY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, canvasWidth, canvasHeight, t)
{
    let oldBY = 0.1;

    console.log(BX);
    if (BX <= 0) // raquette gauche
    {
        t[0] = 0;
        t[1] = BY;
        t[2] = "gauche";
        if (BY > oldBY)
            t[3] = "monte";
        else
            t[3] = "descend"
        console.log("Tableau après modification 0 :", t);
        return (tableau)
    }
    else if (BX >= canvasWidth) // raquette droite
    {
        t[0] = BX;
        t[1] = canvasWidth;
        t[2] = "droite";
        if (BY > oldBY)
            t[3] = "monte";
        else
            t[3] = "descend"
        console.log("Tableau après modification 1 :", t);
        return (t)
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
            t[0] = BX;
            t[1] = BY;
            if (BX <= 0)
                t[2] = "gauche";
            else if (BX >= canvasWidth)
                t[2] = "droite";
            if (BY > oldBY)
                t[3] = "monte";
            else
                t[3] = "descend";
            console.log("Tableau après modification 2 :", t);
            return (t)
        }
    }
    console.log("Tableau après modification 3 :", t);
    return (t)
}