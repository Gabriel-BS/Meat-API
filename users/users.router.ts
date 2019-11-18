import * as restify from "restify";
import { Router } from "../common/router";
import { User } from "../users/users.model";

class UsersRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get("/users", (req, resp, next) => {
      User.find()
        .then(this.render(resp, next))
        .catch(next);
    }); // retrieve all documents from that collection

    application.get("/users/:id", (req, resp, next) => {
      User.findById(req.params.id)
        .then(this.render(resp, next))
        .catch(next);
    }); // retrieve a single document by its id

    application.post("/users", (req, resp, next) => {
      let user = new User(req.body);
      user
        .save()
        .then(this.render(resp, next))
        .catch(next);
    }); // create a new document

    application.put("/users/:id", (req, resp, next) => {
      const options = { overwrite: true };
      User.updateOne({ _id: req.params.id }, req.body, options)
        .exec()
        .then(result => {
          if (result.n) {
            return User.findById(req.params.id);
          } else {
            resp.send(404);
          }
        })
        .then(this.render(resp, next))
        .catch(next);
    }); // replace a document

    application.patch("/users/:id", (req, resp, next) => {
      const options = { new: true };
      User.findOneAndUpdate(req.params.id, req.body, options).then(
        this.render(resp, next)
      ); // updates a document

      application.del("/users/:id", (req, resp, next) => {
        User.deleteOne({ _id: req.params.id })
          .exec()
          .then(result => {
            if (result.n) {
              resp.send(204);
              return next();
            } else {
              resp.send(404);
              return next();
            }
          })
          .catch(next);
      });
    });
  }
} // delete  a document

export const usersRouter = new UsersRouter();
