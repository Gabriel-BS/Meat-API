import * as restify from "restify";
import { User, UserInterface } from "./users.model";
import { ModelRouter } from "../common/model-router";
import { authenticate } from "../security/auth.handler";
import { authorize } from "../security/authz.handler";


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
          .then(this.renderAll(resp, next, {
            pageSize: this.pageSize,
            url: req.url
          }))
          .catch(next)
    }else{
      next()
    }
  };

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, [authorize('admin'), this.findByEmail, this.findAll]); // retrieve all documents from that collection

    application.get(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.findById]); // retrieve a single document by its id

    application.post(`${this.basePath}`, [authorize('admin'),this.createOne]); // create a new document

    application.put(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.replaceOne]); // replace a document

    application.patch(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.updateOne]); // updates a document

    application.del(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.deleteOne]); // delete  a document

    application.post(`${this.basePath}/auth`, authenticate)

    application.post(`${this.basePath}/create/account`, this.createOne)
  }
}

export const usersRouter = new UsersRouter();
