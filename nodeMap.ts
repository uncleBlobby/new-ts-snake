import { SnakeBrain } from "./snakeBrain";
import { GameState, Coord, FCoord, FCoordStatus } from "./types";

export class NodeMap {
    nodeMap: Map<string, FCoord>;

    constructor() {
        this.nodeMap = new Map<string, FCoord>();
    }

    init = (gs: GameState) => {
        //console.log(`init nodeMap...`)
        for (let i = 0; i < gs.board.width; i++){
            for (let j = 0; j < gs.board.height; j++){
                //console.log(`x: ${i}: y: ${j}`)
                this.nodeMap.set(JSON.stringify({x: i, y: j}), {
                    coord: {x: i, y: j},
                    status: FCoordStatus.EMPTY,
                    checkedFromLeft: false,
                    checkedFromRight: false,
                    checkedFromDown: false,
                    checkedFromUp: false
                })
            }
            //console.log(`updating nodeMap with empty state...`)
            //console.log(`json.stringify(this.nodemap): ${JSON.stringify(this.nodeMap)}`)
        }

        //console.log(`nodeMap after init: ${JSON.stringify(this.nodeMap)}`)
    }

    fillSnakes = (gs: GameState) => {
        //console.log(`init nodeMap... snakes...`)
        const snakes = gs.board.snakes;

        for (let i = 0; i < snakes.length; i++){
            for (let j = 0; j < snakes[i].body.length; j++){
                this.nodeMap.set(JSON.stringify({x: snakes[i].body[j].x, y: snakes[i].body[j].y}), {
                    coord: {x: i, y: j},
                    status: FCoordStatus.SNAKE,
                    checkedFromLeft: false,
                    checkedFromRight: false,
                    checkedFromDown: false,
                    checkedFromUp: false
                }) 
            }
        }
    }

    fillFood = (gs: GameState) => {
        const food = gs.board.food;

        for (let i = 0; i < food.length; i++){
            
            this.nodeMap.set(JSON.stringify({x: food[i].x, y: food[i].y}), {
                coord: {x: food[i].x, y: food[i].y},
                status: FCoordStatus.FOOD,
                checkedFromLeft: false,
                checkedFromRight: false,
                checkedFromDown: false,
                checkedFromUp: false
            }) 
        
        }
    }

    fillHaz = (gs: GameState) => {
        const hazards = gs.board.hazards;

        for (let i = 0; i < hazards.length; i++){
            this.nodeMap.set(JSON.stringify({x: hazards[i].x, y: hazards[i].y}), {
                coord: {x: hazards[i].x, y: hazards[i].y},
                status: FCoordStatus.HAZARD,
                checkedFromLeft: false,
                checkedFromRight: false,
                checkedFromDown: false,
                checkedFromUp: false
            })
        }
    }
}

export const CheckIfNodeIsSnake = (nm: NodeMap, target: Coord) => {
    if (nm.nodeMap.get(JSON.stringify({x: target.x, y: target.y}))?.status == FCoordStatus.SNAKE){
        return true;
    }
    return false;
}

export const CountOpenNodes = (gs: GameState, sb: SnakeBrain, nm: NodeMap) => {
    let head: Coord = sb.snake.body[0];

    let clearanceLeft = 0;
    let clearanceRight = 0;
    let clearanceTop = 0;
    let clearanceBottom = 0;

    for (let i = head.x - 1; i >= 0; i--){
        if (!CheckIfNodeIsSnake(nm, {x: i, y: head.y})){
            //console.log(`we have left clearance here, my head at ${JSON.stringify(head)}`)
            clearanceLeft++;
            for (let j = head.y + 1; j < gs.board.height; j++){
                if(!CheckIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
            for (let j = head.y - 1 ; j >= 0; j--){
                if(!CheckIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = head.x + 1; i < gs.board.width; i++){
        if (!CheckIfNodeIsSnake(nm, {x: i, y: head.y})){
            clearanceRight++;
            for (let j = head.y + 1; j < gs.board.height; j++){
                if(!CheckIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
            for (let j = head.y - 1; j >= 0; j--){
                if(!CheckIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = head.y - 1; i >= 0; i--){
        if (!CheckIfNodeIsSnake(nm, {x: head.x, y: i})){
            clearanceBottom++;
            for (let j = head.x; j < gs.board.width; j++){
                if(!CheckIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
            for (let j = head.x -1; j >=0; j--){
                if(!CheckIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = head.y + 1; i < gs.board.height; i++){
        if (!CheckIfNodeIsSnake(nm, {x: head.x, y: i})){
            clearanceTop++;
            for (let j = head.x; j < gs.board.width; j++){
                if(!CheckIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
            for (let j = head.x -1; j >=0; j--){
                if(!CheckIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    console.log(`new flood clearanceLeft: ${clearanceLeft}`)
    console.log(`new flood clearanceRight: ${clearanceRight}`)
    console.log(`new flood clearanceDown: ${clearanceBottom}`)
    console.log(`new flood clearanceUp: ${clearanceTop}`)

    const maxClearance = Math.max(clearanceLeft, clearanceRight, clearanceTop, clearanceBottom);

    if (clearanceLeft < sb.snake.body.length){
        console.log(`Left Clearance is less than body length!`);
        sb.scoredMoves.left.score -= 50;
        if(clearanceLeft == maxClearance){
            console.log(`Left is still the max clearance! Go Left?`);
            sb.scoredMoves.left.score += 50;
        }
        //clearanceLeft = 0;
    }

    if (clearanceRight < sb.snake.body.length){
        console.log(`Right Clearance is less than body length!`);
        sb.scoredMoves.right.score -= 50;
        //clearanceRight = 0;
        if(clearanceRight == maxClearance){
            console.log(`Right is still the max clearance! Go Right?`);
            sb.scoredMoves.right.score += 50;
        }
    }

    if (clearanceTop < sb.snake.body.length){
        console.log(`Up Clearance is less than body length!`);
        sb.scoredMoves.up.score -= 50;
        //clearanceTop = 0;
        if(clearanceTop == maxClearance){
            console.log('Top is still the max clearance, go top!');
            sb.scoredMoves.up.score += 50;
        }
    }

    if (clearanceBottom < sb.snake.body.length){
        console.log(`Down Clearance is less than body length!`);
        sb.scoredMoves.down.score -= 50;
        //clearanceBottom =0;
        if(clearanceBottom == maxClearance){
            console.log('Bottom is still max Clearance, go bottom!');
            sb.scoredMoves.down.score += 50;
        }
    }
    

    sb.scoredMoves.left.score += clearanceLeft;
    sb.scoredMoves.right.score += clearanceRight;
    sb.scoredMoves.down.score += clearanceBottom;
    sb.scoredMoves.up.score += clearanceTop;
}