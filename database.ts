import { GameState, ScoredMoves } from "./types";

const sqlite3 = require('sqlite3').verbose();

export class DatabaseAPI {
    db = new sqlite3.Database('games.db', (err: Error) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Connected to the database!`);
    })

    createTable = () => {
        this.db.run('DROP TABLE games')
        this.db.run('CREATE TABLE IF NOT EXISTS games(gameId text not null, turn text not null, gameState text not null, scoredMoves text not null, responseMove text not null)')
    }

    updateData = (gs: GameState, sm: ScoredMoves, nextMove: string) => {
        const gameId = gs.game.id;
        const turn = gs.turn;
        const gameState = JSON.stringify(gs);
        const scoredMoves = JSON.stringify(sm);
        const responseMove = nextMove;

        //const sql = `INSERT INTO games(gameid, turn, gamedata) VALUES (?, ?, ?)`, [gameid, turn, gamedata]
        
        this.db.run(`INSERT INTO games(gameId, turn, gameState, scoredMoves, responseMove) VALUES (?, ?, ?, ?, ?)`, [gameId, turn, gameState, scoredMoves, responseMove], function(err: Error) {
            if (err) {
                return console.log(err.message);
            }

        })
    }

    closeDB = () => {
        this.db.close((err: Error) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Closed the db connection`);
        })
    }

    constructor(){

    }
}




