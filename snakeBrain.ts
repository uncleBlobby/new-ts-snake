import { GetDistanceBetweenCoords } from "./helpers";
import { Battlesnake, Coord, GameState, ScoredMoves } from "./types";

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

    AvoidNeck = () => {
        const head = this.head();
        const neck = this.neck();

        if (neck.x < head.x) {        // Neck is left of head, don't move left
            this.scoredMoves.left.score -= 1000000;
        }
    
        if (neck.x > head.x) { // Neck is right of head, don't move right
            this.scoredMoves.right.score -= 1000000;
        }
    
        if (neck.y < head.y) { // Neck is below head, don't move down
            this.scoredMoves.down.score -= 1000000;
        }
    
        if (neck.y > head.y) { // Neck is above head, don't move up
            this.scoredMoves.up.score -= 1000000;
        }
    }

    AvoidWalls = (gs: GameState) => {
        if (gs.game.ruleset.name != "wrapped"){
            const head = this.head();
            const BW = gs.board.width;
            const BH = gs.board.height;
    
            if (head.x - 1 < 0){
                this.scoredMoves.left.score -= 100000;
            }
        
            if (head.x + 1 >= BW){
                this.scoredMoves.right.score -= 100000;
            }
        
            if (head.y - 1 < 0){
                this.scoredMoves.down.score -= 100000;
            }
        
            if (head.y + 1 >= BH){
                this.scoredMoves.up.score -= 100000;
            }
        }
    }

    AvoidOwnBody = () => {
        const head = this.head();
        const body = this.snake.body;

        if (body[body.length] != body[body.length-1]){
            for (let i = 0; i < body.length - 1; i++){
              if (head.x + 1 == body[i].x && head.y == body[i].y){
                
                this.scoredMoves.right.score -= 10000;
              }
              if (head.x - 1 == body[i].x && head.y == body[i].y){
                
                this.scoredMoves.left.score -= 10000;
              }
              if (head.x == body[i].x && head.y + 1 == body[i].y){
                
                this.scoredMoves.up.score -= 10000;
              }
              if (head.x == body[i].x && head.y - 1== body[i].y){
                
                this.scoredMoves.down.score -= 10000;
              }
            }
          } else {
            for (let i = 0; i < body.length; i++){
              if (head.x + 1 == body[i].x && head.y == body[i].y){
                
                this.scoredMoves.right.score -= 10000;
              }
              if (head.x - 1 == body[i].x && head.y == body[i].y){
                
                this.scoredMoves.left.score -= 10000;
              }
              if (head.x == body[i].x && head.y + 1 == body[i].y){
                
                this.scoredMoves.up.score -= 10000;
              }
              if (head.x == body[i].x && head.y - 1== body[i].y){
                
                this.scoredMoves.down.score -= 10000;
              }
            }
          }
    }

    GetClosestFoodCoord = (gs: GameState) => {
        const head = this.head();
        const food = gs.board.food;

        let closestFood = food[0];
        let distanceToClosestFood = GetDistanceBetweenCoords(head, closestFood);
        for (let i = 0; i < food.length; i++){
            if (GetDistanceBetweenCoords(head, food[i]) < distanceToClosestFood){
                closestFood = food[i];
            }
        }

        return closestFood;
    }

    GetGeneralDirectionToCoord = (target: Coord) => {
        const head = this.head();

        if (target.x > head.x){
            return "right";
        }

        if (target.x < head.x){
            return "left";
        }

        if (target.y > head.y){
            return "up";
        }

        if (target.y < head.y){
            return "down";
        }
    }

    PreferTowardClosestFood = (gs: GameState) => {
        const closestFoodCoord = this.GetClosestFoodCoord(gs);
        const head = this.head();

        switch(this.GetGeneralDirectionToCoord(closestFoodCoord)){
            case "right":
                this.scoredMoves.right.score += 10;
                break;
              case "left":
                this.scoredMoves.left.score += 10;
                break;
              case "up":
                this.scoredMoves.up.score += 10;
                break;
              case "down":
                this.scoredMoves.down.score += 10;
                break;
              default:
                break;    
        }

    }

    PreferTowardOwnTail = (gs: GameState) => {
        const head = this.head();
        const tail = this.snake.body[this.snake.body.length - 1];
        const health = this.snake.health;
        const tailPrefValue = this.snake.length / 2;

        const directionToTail = this.GetGeneralDirectionToCoord(tail);

        switch(directionToTail){
            case "right":
                this.scoredMoves.right.score += tailPrefValue;
                break;
              case "left":
                this.scoredMoves.left.score += tailPrefValue;
                break;
              case "up":
                this.scoredMoves.up.score += tailPrefValue;
                break;
              case "down":
                this.scoredMoves.down.score += tailPrefValue;
                break;
              default:
                break;
        }
    }
}