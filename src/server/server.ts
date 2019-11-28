import * as restify from "restify";
import { environment } from "../common/environment";
import { Router } from "../common/router";
import { connect, Mongoose, disconnect } from "mongoose";
import { handleError } from "./error.handler";
import { tokenParser } from "./../security/token.parser";
import * as fs from 'fs'

export class Server {
  application!: restify.Server;

  initializeDb(): Promise<Mongoose> {
    return connect(environment.db.url, {
      auth: {password: environment.auth.password, user: environment.auth.username},
      dbName: environment.db.name,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }
 

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const options: restify.ServerOptions = {
          name: "meat-api",
          version: "1.0.0",
        }
        if(environment.security.enableHTTPS){
          options.certificate = fs.readFileSync(environment.security.certificate)
          options.key = fs.readFileSync(environment.security.key)
        }

        this.application = restify.createServer(options);
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(tokenParser)

        for (let router of routers) {
          router.applyRoutes(this.application); //apply routes for the current running application
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });

        this.application.on('restifyError', handleError)
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

  shutdown(){
    return disconnect().then(() => this.application.close())
  }
}
