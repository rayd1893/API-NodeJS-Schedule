const express = require('express');
const bodyParser = require('body-parser');

const configs = require('./config');
const context = {};

function prepareRoute(route) {
  let newPath = route.path;
  if (!newPath.startsWith('/')) {
    newPath = '/' + newPath;
  }

  return {
    ...route,
    path: newPath,
  };
}

async function initDbs(dbs) {
  const dbNames = Object.entries(dbs).map((db) => (db[0]));
  const dbManager = {};

  for (const db of dbNames) {
    if (!dbManager.hasOwnProperty(db)) {
      let newDb;
      switch (dbs[db].type) {
        case 'pg':
          console.log(dbs[db].conn);
          newDb = await require('./shared/dbs/postgres').create(dbs[db].conn);
        break;
      }

      if (newDb) {
        dbManager[db] = newDb;
      }
    }
  }

  return dbManager;
}

async function initContext() {
  context.dbs = await initDbs(configs.dbs);
}

async function closeContext() {
  const dbNames = Object.entries(context.dbs).map((db) => db[0]);
  for (const db of dbNames) {
    await context.dbs[db].close();
  }
}

class Server {
  constructor(routes = [], port = Server.PORT) {
    this.port = port;
    this.routes = routes;
    this.app = express();
    this.server = null;
  }

  async start() {
    await initContext();
    this.app.use((req, res, next) => {
      req.__context = context;
      next();
    });
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(bodyParser.json());
    
    this.routes.forEach((r) => {
      const preparedRoute = prepareRoute(r);
      this.app.use(preparedRoute.path, preparedRoute.router);
    });
    
    this.server = this.app.listen(this.port, () => console.log(`Server running on port: ${this.port}`));
  }

  async stop() {
    await closeContext();
    this.server.close();
  }
}

Server.PORT = process.env.PORT || '8080';

module.exports = Server;