import * as restify from "restify";
import { User, UserInterface } from "./users.model";
import { ModelRouter } from "../common/model-router";

class UsersRouter extends ModelRouter<UserInterface> {
  constructor() {
    super(User);
    this.on("beforeRender", document => {
      document.password = undefined;
    });
  }

  findByEmail = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    if (req.query.email) {
      User.findByEmail(req.query.email)
          .then(this.renderAll(resp, next))
          .catch(next)
    }else{
      next()
    }
  };

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, [this.findByEmail, this.findAll]); // retrieve all documents from that collection

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]); // retrieve a single document by its id

    application.post(`${this.basePath}`, this.createOne); // create a new document

    application.put(`${this.basePath}/:id`, [this.validateId, this.replaceOne]); // replace a document

    application.patch(`${this.basePath}/:id`, [this.validateId, this.updateOne]); // updates a document

    application.del(`${this.basePath}/:id`, [this.validateId, this.deleteOne]); // delete  a document
  }
}

export const usersRouter = new UsersRouter();
