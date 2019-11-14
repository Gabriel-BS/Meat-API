import * as restify from "restify";
import { environment } from "../common/environment";

export class Server {
  application!: restify.Server;

  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0"
        });
        this.application.use(restify.plugins.queryParser());

        /**
 * @param resp 
 * it represents the response and the information it carries with itself like
 * contentType
 * 
 * @param req
 * it represents the requisiton and the information of that requisiton, method used,
 * parameters of it is an GET method for example 
 * 
 * @param next
 * Calling next() will move to the next function in the chain.
 * if you need to stop processing some request you can use return next(false)
 */

        this.application.get("/info", [
          (req, resp, next) => {
            if (req.userAgent().includes("Mozilla /5.0")) {
              resp.json({ message: "you are using Mozilla" });
              return next(false);
            }
            return next();
          },
          (req, resp, next) => {
            resp.json({
              browser: req.userAgent(),
              method: req.method,
              url: req.href(),
              path: req.path(),
              query: req.query
            });
            return next();
          }
        ]);

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  boostrap(): Promise<Server> {
    return this.initRoutes().then(() => this);
  }
}
