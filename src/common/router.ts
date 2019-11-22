import * as restify from "restify";
import { EventEmitter } from "events";

export class Router extends EventEmitter {
  applyRoutes(application: restify.Server): any {
    return application;
  }


  
}
