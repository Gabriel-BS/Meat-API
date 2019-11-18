import * as restify from "restify";
import { UserDocument } from "../users/users.model";

export class Router {
  applyRoutes(application: restify.Server): any {
    return application;
  }

  render(response: restify.Response, next: restify.Next) {
    return (document: UserDocument | UserDocument[] | null | undefined) => {
      if (document) {
        response.json(document);
      } else {
        response.send(404);
      }
      return next;
    };
  }
}
