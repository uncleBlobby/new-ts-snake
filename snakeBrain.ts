import { Battlesnake, ScoredMoves } from "./types";

export class SnakeBrain {
    snake: Battlesnake;
    scoredMoves: ScoredMoves;
    bestMove: string;

    constructor(snake: Battlesnake) {
        this.snake = snake;
        this.scoredMoves = 
            {   
                left:   {direction: "left",   score: 0}, 
                right:  {direction: "right",  score: 0},
                up:     {direction: "up",     score: 0},
                down:   {direction: "down",   score: 0}
            };
        this.bestMove = "";
    }

    head = () => {
        return this.snake.body[0];
    }

    neck = () => {
        return this.snake.body[1];
    }
}