import express, { Request, Response, NextFunction } from "express"

const sqlite3 = require('sqlite3').verbose();

export interface BattlesnakeHandlers {
  info: Function;
  start: Function;
  move: Function;
  end: Function;
  dataDisplay: Function;
}

export default function runServer(handlers: BattlesnakeHandlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send(handlers.info());
  });

  app.post("/start", (req: Request, res: Response) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req: Request, res: Response) => {
    res.send(handlers.move(req.body));
  });

  app.post("/end", (req: Request, res: Response) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.get("/dataDisplay", (req: Request, res: Response) => {
    handlers.dataDisplay(req.body);

    let db = new sqlite3.Database('games.db', sqlite3.OPEN_READONLY, (err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`connected OPEN_READONLY to the db inside the /dataDisplay endpoint!`);
    });

    // DANGEROUS SQL statement, currently sends way too much data over the wire.
    // NEED TODO: introduce frontend interface allowing the client to specify search terms:
    // IE: what gameID to return, what turn number to return,
    // THEN AND ONLY THEN make an SQL query and send the data back.
    let sql = `SELECT * FROM games WHERE gameId = ?`;
    let gameId = '81b50a6d-3e0f-4763-a3c1-0a773b65a583';

    db.all(sql, [gameId], (err: Error, rows: Array<JSON>) => {
      if (err) {
        res.send('err');
        throw err;
      }
      res.send(rows);
    })

    //res.send('ok');

    db.close((err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Closed the db connection!`);
    })
  })

  app.get("/dataDisplay/game/:gameId", (req: Request, res: Response) => {
    //res.send(req.params);
    const gameId = req.params.gameId;
    let db = new sqlite3.Database('games.db', sqlite3.OPEN_READONLY, (err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`connected OPEN_READONLY to the db inside the /dataDisplay endpoint!`);
    });
    let sql = `SELECT * FROM games WHERE gameId = ?`;
    db.all(sql, [gameId], (err: Error, rows: Array<JSON>) => {
      if (err) {
        res.send('err');
        throw err;
      }
      res.send(rows);
    })

    //res.send('ok');

    db.close((err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Closed the db connection!`);
    })
    
  })

  app.get("/dataDisplay/game/:gameId/turn/:turn", (req: Request, res: Response) => {
    //res.send(req.params);
    const gameId = req.params.gameId;
    const turn = req.params.turn;

    let db = new sqlite3.Database('games.db', sqlite3.OPEN_READONLY, (err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`connected OPEN_READONLY to the db inside the /dataDisplay endpoint!`);
    });
    let sql = `SELECT * FROM games WHERE gameId = ? turn = ?`;
    db.all(sql, [gameId, turn], (err: Error, rows: Array<JSON>) => {
      if (err) {
        res.send('err');
        throw err;
      }
      res.send(rows);
    })

    //res.send('ok');

    db.close((err: Error) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Closed the db connection!`);
    })
    
  })

  app.use(function(req: Request, res: Response, next: NextFunction) {
    res.set("Server", "uncleBlobby/new-ts-snake");
    next();
  });

  const host = '0.0.0.0';
  const port = parseInt(process.env.PORT || '8000');

  app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`);
  });
}
