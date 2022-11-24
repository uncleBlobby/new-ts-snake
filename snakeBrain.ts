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
        const healthRatio = (100 - this.snake.health) * 3 ;

        switch(this.GetGeneralDirectionToCoord(closestFoodCoord)){
            case "right":
                this.scoredMoves.right.score += Math.max(20, healthRatio);
                break;
              case "left":
                this.scoredMoves.left.score += Math.max(20, healthRatio);
                break;
              case "up":
                this.scoredMoves.up.score += Math.max(20, healthRatio);
                break;
              case "down":
                this.scoredMoves.down.score += Math.max(20, healthRatio);
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
        if (health > 75){
          switch(directionToTail){
              case "right":
                this.scoredMoves.right.score += tailPrefValue *2;
                break;
              case "left":
                this.scoredMoves.left.score += tailPrefValue *2;
                break;
              case "up":
                this.scoredMoves.up.score += tailPrefValue *2;
                break;
              case "down":
                this.scoredMoves.down.score += tailPrefValue *2;
                break;
              default:
                break;
          }
        }
    }

    PreferAwayFromLargerSnakeHead = (gs: GameState) => {
      const opponents = gs.board.snakes;
      const head = this.snake.body[0];

      for (let i = 0; i < opponents.length; i++){
        if (opponents[i].id != this.snake.id){
            let enemy = opponents[i];
            if (enemy.body.length >= this.snake.body.length){
                if (head.x + 2 == enemy.head.x && head.y == enemy.head.y){
                  this.scoredMoves.right.score -= 1550;
                }
          
                if (head.x - 2 == enemy.head.x && head.y == enemy.head.y){
                  this.scoredMoves.left.score -= 1550;
                }
          
                if (head.x == enemy.head.x && head.y + 2 == enemy.head.y){
                  this.scoredMoves.up.score -= 1550;
                }
          
                if (head.x == enemy.head.x && head.y -2 == enemy.head.y){
                  this.scoredMoves.down.score -= 1550;
                }
        
                if (head.x == enemy.head.x + 1 && head.y == enemy.head.y - 1){
                  this.scoredMoves.up.score -= 1550;
                  this.scoredMoves.left.score -= 1550;
                }
        
                if (head.x == enemy.head.x - 1 && head.y == enemy.head.y - 1){
                  this.scoredMoves.up.score -= 1550;
                  this.scoredMoves.right.score -= 1550;
                }
        
                if (head.x == enemy.head.x + 1 && head.y == enemy.head.y + 1){
                  this.scoredMoves.down.score -= 1550;
                  this.scoredMoves.left.score -= 1550;
                }
        
                if (head.x == enemy.head.x - 1 && head.y == enemy.head.y + 1){
                  this.scoredMoves.down.score -= 1550;
                  this.scoredMoves.right.score -= 1550;
                }
        
            }
          }
        }
    }
}