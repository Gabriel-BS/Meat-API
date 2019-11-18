import * as restify from "restify";
import { environment } from "../common/environment";
import { Router } from "../common/router";
import { connect, Mongoose } from "mongoose";

export class Server {
  application!: restify.Server;

  initializeDb(): Promise<Mongoose> {
    return connect(environment.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0"
        });
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());

        for (let router of routers) {
          router.applyRoutes(this.application); //apply routes for the current running application
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });

        // this.application.on('restiftError', )
      } catch (error) {
        reject(error);
      }
    });
  }

  boostrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }
}
