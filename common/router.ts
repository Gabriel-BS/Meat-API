import * as restify from "restify";
import { EventEmitter } from "events";
import { UserDocument } from "../users/users.model";

export class Router {
  applyRoutes(application: restify.Server): any {
    return application;
  }

  render(doc: UserDocument | UserDocument[] | null | undefined, response: restify.Response, next: restify.Next) {
      if (doc) {
        response.json(document);
      } else {
        response.send(404);
      }
      return next;
    };
}
