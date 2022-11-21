import { Battlesnake, GameState, ScoredMove, ScoredMoves } from "./types";

export const getHighScoreMove = (moves: ScoredMoves) => {
    let bestMove: ScoredMove = moves.left;


    if (moves.right.score > bestMove.score){
        bestMove = moves.right;
    }

    if (moves.up.score > bestMove.score){
        bestMove = moves.up;
    }

    if (moves.down.score > bestMove.score){
        bestMove = moves.down;
    }

    if (moves.left.score > bestMove.score){
        bestMove = moves.left;
    }

    return bestMove.direction;
}

export const AvoidNeck = (snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const head = snake.body[0];
    const neck = snake.body[1];

    if (neck.x < head.x) {        // Neck is left of head, don't move left
        scoredMoves.left.score -= 1000000;
    }

    if (neck.x > head.x) { // Neck is right of head, don't move right
    scoredMoves.right.score -= 1000000;
    }

    if (neck.y < head.y) { // Neck is below head, don't move down
    scoredMoves.down.score -= 1000000;
    }

    if (neck.y > head.y) { // Neck is above head, don't move up
    scoredMoves.up.score -= 1000000;
    }
}

export const AvoidWalls = (gameState: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    if (gameState.game.ruleset.name != "wrapped"){
        const head = snake.body[0];
        const BW = gameState.board.width;
        const BH = gameState.board.height;

        if (head.x - 1 < 0){
            scoredMoves.left.score -= 100000;
        }
    
        if (head.x + 1 >= BW){
            scoredMoves.right.score -= 100000;
        }
    
        if (head.y - 1 < 0){
            scoredMoves.down.score -= 100000;
        }
    
        if (head.y + 1 >= BH){
            scoredMoves.up.score -= 100000;
        }
    }
}