let i = 0;
const ballSize = 10;

let iarightPaddleY = 0;

export default function aiController(){
    return {
        updateAi(gameState) {
            const iacanvasWidth = gameState.canvasWidth;
            const iacanvasHeight = gameState.canvasHeight;
            const iapaddleWidth = gameState.paddleWidth;
            const iapaddleHeight = gameState.paddleHeight;
            let iaPaddleSpeed = gameState.PaddleSpeed;
            let iarightPaddlePos = gameState.rightPaddleY;
            let iaballSpeedX = gameState.ballSpeedX;
            let iaballSpeedY = gameState.ballSpeedY;
            let iaball_more_speed_x = gameState.ball_more_speed_x;
            let iaball_more_speed_y = gameState.ball_more_speed_y;
            //t = tableau
            let t = [0, 0, "gauche", "monte"]
            if (iaballSpeedX == 0 && iaballSpeedY == 0)
            {
                i = 1;
                let c = iacanvasHeight / 2;
/*                console.log("reinitialisaion", c);
                console.log("rightpaddleY", rightPaddleY);
                if ((rightPaddleY + paddleHeight / 3) > c)
                {
                    rightPaddleY -= PaddleSpeed;
                    return -PaddleSpeed;
                }
                else if ((rightPaddleY + paddleHeight - paddleHeight / 3) <= c)
                {
                    rightPaddleY += PaddleSpeed;
                    return PaddleSpeed;
                }
                else
                    return 0;*/
                if (((iarightPaddleY) < (c - iapaddleHeight / 2))  && ((iarightPaddleY + iapaddleHeight - iapaddleHeight / 3) > c))
                {
                    return 0;
                }
                else if ((iarightPaddleY + iapaddleHeight / 2) >= c)
                {
                    iarightPaddleY -= iaPaddleSpeed;
                    return -iaPaddleSpeed;
                }
                else if ((iarightPaddleY < c) && ((iarightPaddleY + iapaddleHeight - iapaddleHeight / 3) <= c))
                {
                    iarightPaddleY += iaPaddleSpeed;
                    return iaPaddleSpeed;
                }
                return 0;
            }

            t = previous(gameState.ballX, gameState.ballY, iaballSpeedX, iaballSpeedY, iaball_more_speed_x, iaball_more_speed_y, iacanvasWidth, iacanvasHeight, t);
            let h = iacanvasHeight / 3; //haut
            let c = iacanvasHeight / 3 * 2; //centre
            let t1 = iacanvasWidth / 3; // gauche
            let t2 = iacanvasWidth / 3 * 2; // centre
            let bx = gameState.ballX;
            let by = gameState.ballY;
            let targetY = iacanvasHeight / 2 + iapaddleHeight / 2;
            let nt = Date.now() - gameState.gnow;
            if (nt < 10)
            {
                i = 0;
                iarightPaddleY = iarightPaddlePos;
            }
            if (i == 1)
                t[1] = iacanvasHeight / 2 - iapaddleHeight / 5;
            if (t[2] == "gauche")
            {
                if (((by < h && bx >= t2) || (by >= h && by < c && bx < t1) || (by < h && bx < t1)) && t[3] == "descend") // hib 1/3 et cib 3/3 et hib 3/3
                    targetY = h * 0.90; // haut
                else if ((by >= h && by < c && bx >= t2 && t[3] == "monte") || (by > c && bx >= t2 && t[3] == "descend") || (by > c && bx < t1 && t[3] == "descend")) //cih 1/3 et bib 3/3 1/3
                    targetY = h * 0.90; // haut
                else if (((by > c && bx < t1) || (by > c && bx >= t2) || (by < h && bx < t1) || (by < h && bx >= t2)) && t[3] == "monte") // bih 1/3 bih 3/3 hih 1/3 hih 3/3
                    targetY = c; // bas
                else if (((by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2) || (by > c && bx >= t1 && bx < t2)) && t[3] == "descend") // hib 2/3 cib 2/3 bib 2/3
                    targetY = iacanvasHeight / 5 * 2; //c haut
                else if (((by >= c && bx >= t1 && bx < t2) || (by < h && bx >= t1 && bx < t2) || (by >= h && by < c && bx >= t1 && bx < t2)) && t[3] == "monte") // bih 2/3 hih 2/3 cb 2/3
                    targetY = iacanvasHeight / 5 * 3; //centre bas
                else
                    targetY = iacanvasHeight / 2 + iapaddleHeight / 2; //centre
            }
            if (t[2] == "droite") //point d'arriver
            {
//                console.log("droite");
                if (((iarightPaddleY) < (t[1] - iapaddleHeight / 2))  && ((iarightPaddleY + iapaddleHeight - iapaddleHeight / 3) > t[1]))
                {
                    return 0;
                }
                else if ((iarightPaddleY + iapaddleHeight / 2) >= t[1])
                {
                    iarightPaddleY -= iaPaddleSpeed;
                    return -iaPaddleSpeed;
                }
                else if ((iarightPaddleY < t[1]) && ((iarightPaddleY + iapaddleHeight - iapaddleHeight / 3) <= t[1]))
                {
                    iarightPaddleY += iaPaddleSpeed;
                    return iaPaddleSpeed;
                }
                return 0;
            }

            if (iarightPaddleY < targetY) 
            {
                iarightPaddleY += iaPaddleSpeed;
                return iaPaddleSpeed;
            } else if ((iarightPaddleY - iapaddleHeight) >= targetY)
            {
                iarightPaddleY -= iaPaddleSpeed;
                return -iaPaddleSpeed;
            }
            return 0; // Ne pas bouger centre
        }
    }
}

function previous(BX, BY, ballSpeedX, ballSpeedY, ball_more_speed_x, ball_more_speed_y, canvasWidth, canvasHeight, t)
{
    let oldBY = 0.1;

    if (BX <= 0) // raquette gauche
    {
        t[0] = 0;
        t[1] = BY;
        t[2] = "gauche";
        t[3] = "inconnue";
        return (t)
    }
    else if (BX >= canvasWidth) // raquette droite
    {
        t[0] = BX;
        t[1] = BY;
        t[2] = "droite";
        t[3] = "iconnue";
        return (t)
    }
    while (BX > 0 && BX < canvasWidth)
    {
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
            return (t)
        }
    }
    return (t)
}
