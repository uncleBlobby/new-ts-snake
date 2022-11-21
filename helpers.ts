import { Coord, GameState } from "./types"

const GetClosestFoodCoord = (gs: GameState) => {

}

export const GetDistanceBetweenCoords = (start: Coord, end: Coord) => {
    let distance: number = 0;

    let xDistance: number = Math.abs(start.x - end.x);
    let yDistance: number = Math.abs(start.y - end.y);

    distance = xDistance + yDistance;

    return distance;
}