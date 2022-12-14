// API Types
// https://docs.battlesnake.com/api

export interface Coord {
  x: number;
  y: number;
}

export interface Battlesnake {
  id: string;
  name: string;
  health: number;
  body: Coord[];
  head: Coord;
  length: number;
  latency: string;
  shout: string;
  customizations: Customizations;
}

export interface Customizations {
  color: string;
  head: string;
  tail: string;
}

export interface Board {
  height: number;
  width: number;
  food: Coord[];
  hazards: Coord[];
  snakes: Battlesnake[];
}

export interface GameState {
  game: Game;
  turn: number;
  board: Board;
  you: Battlesnake;
}

export interface Game {
  id: string;
  ruleset: Ruleset;
  map: string;
  source: string;
  timeout: number;
}

export interface Ruleset {
  name: string;
  version: string;
  settings: RulesetSettings;
}

export interface RulesetSettings {
  foodSpawnChance: number;
  minimumFood: number;
  hazardDamagePerTurn: number;
}

// Response Types
// https://docs.battlesnake.com/api

export interface InfoResponse {
  apiversion: string;
  author?: string;
  color?: string;
  head?: string;
  tail?: string;
  version?: string;
}

export interface MoveResponse {
  move: string;
  shout?: string;
}

export interface ScoredMove {
  direction: string;
  score: number;
}

export interface ScoredMoves {
  left: ScoredMove;
  right: ScoredMove;
  up: ScoredMove;
  down: ScoredMove;
}

export const enum FCoordStatus {
  EMPTY,
  SNAKE,
  FOOD,
  HAZARD
}

export interface FCoord {
  coord: Coord;
  status: FCoordStatus;
  checkedFromLeft: boolean;
  checkedFromRight: boolean;
  checkedFromUp: boolean;
  checkedFromDown: boolean;

}

export interface Clearance {
  left: number;
  right: number;
  down: number;
  up: number;
}

