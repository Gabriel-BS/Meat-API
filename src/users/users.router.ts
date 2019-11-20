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

  applyRoutes(application: restify.Server) {

    application.get("/users", this.findAll) // retrieve all documents from that collection

    application.get("/users/:id", [this.validateId, this.findById]) // retrieve a single document by its id

    application.post("/users", this.createOne) // create a new document

    application.put("/users/:id", [this.validateId, this.replaceOne]) // replace a document

    application.patch("/users/:id", [this.validateId, this.updateOne]) // updates a document

    application.del("/users/:id", [this.validateId, this.deleteOne]) // delete  a document
  }
}

export const usersRouter = new UsersRouter();
