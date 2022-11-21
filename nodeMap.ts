import { GameState, FCoord, FCoordStatus } from "./types";

export class NodeMap {
    nodeMap: Map<string, FCoord>;

    constructor() {
        this.nodeMap = new Map<string, FCoord>();
    }

    init = (gs: GameState) => {
        console.log(`init nodeMap...`)
        for (let i = 0; i < gs.board.width; i++){
            for (let j = 0; j < gs.board.height; j++){
                console.log(`x: ${i}: y: ${j}`)
                this.nodeMap.set(JSON.stringify({x: i, y: j}), {
                    coord: {x: i, y: j},
                    status: FCoordStatus.EMPTY,
                    checkedFromLeft: false,
                    checkedFromRight: false,
                    checkedFromDown: false,
                    checkedFromUp: false
                })
            }
            console.log(`updating nodeMap with empty state...`)
            console.log(`json.stringify(this.nodemap): ${JSON.stringify(this.nodeMap)}`)
        }

        console.log(`nodeMap after init: ${JSON.stringify(this.nodeMap)}`)
    }

    fillSnakes = (gs: GameState) => {
        console.log(`init nodeMap... snakes...`)
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

    log = () => {
        console.log(JSON.stringify(this))
    }
}