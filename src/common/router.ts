import * as restify from "restify";
import { UserDocument } from "../users/users.model";
import { EventEmitter } from "events";
import { NotFoundError } from "restify-errors";

export class Router extends EventEmitter {
  applyRoutes(application: restify.Server): any {
    return application;
  }

  render(response: restify.Response, next: restify.Next) {
    return (document: UserDocument | UserDocument[] | null | undefined) => {
      if (document) {
        this.emit('beforeRender', document)
        response.json(document);
      } else {
        throw new NotFoundError('Document not found')
      }
      return next;
    };
  }
}
