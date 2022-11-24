// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import { AvoidNeck, AvoidWalls, getHighScoreMove } from './basics';
import runServer from './server';
import { SnakeBrain } from './snakeBrain';
import { GameState, InfoResponse, MoveResponse } from './types';

import { DatabaseAPI } from './database';
import { CountOpenNodes, NodeMap } from './nodeMap';

const database = new DatabaseAPI();
database.db;
database.createTable();

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "uncleBlobby",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log(`${gameState.game.id} GAME START`);
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  console.log(`${gameState.game.id} GAME OVER\n`);
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {


  const me = new SnakeBrain(gameState.you);

  const nm = new NodeMap();

  nm.init(gameState);
  nm.fillSnakes(gameState);
  nm.fillFood(gameState);
  nm.fillHaz(gameState);
  //console.log(nm);


  me.AvoidNeck();
  me.AvoidWalls(gameState);
  me.AvoidOwnBody();
  me.PreferTowardClosestFood(gameState);
  me.PreferTowardOwnTail(gameState);
  me.PreferAwayFromLargerSnakeHead(gameState);

  CountOpenNodes(gameState, me, nm);
  console.log(me.scoredMoves);
  const nextMove = getHighScoreMove(me.scoredMoves)

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)

  database.updateData(gameState, me.scoredMoves, nextMove);

  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});

