import { Router } from "./router";
import * as mongoose from "mongoose";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { ObjectId } from "bson";

export abstract class ModelRouter<T extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<T>) {
    super();
  }

  findAll = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .find()
      .then(this.renderAll(resp, next))
      .catch(next);
  }; // retrieve all documents from that collection

  findById = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .findById(req.params.id)
      .then(this.renderAll(resp, next))
      .catch(next);
  }; // retrieve a single document by its id

  createOne = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    let model = new this.model(req.body)
      .save()
      .then(this.renderAll(resp, next))
      .catch(next);
  }; // create a new document

  replaceOne = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    const options = { runValidators: true, overwrite: true };
    this.model
      .updateOne({ _id: req.params.id }, req.body, options)
      .exec()
      .then(result => {
        if (result.n) {
          return this.model.findById(req.params.id);
        } else {
          throw new NotFoundError("Document not found");
        }
      })
      .then(this.renderAll(resp, next))
      .catch(next);
  }; // replace a document

  updateOne = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    const options = { runValidators: true, new: true };
    this.model
      .findOneAndUpdate(req.params.id, req.body, options)
      .then(this.renderAll(resp, next))
      .catch(next);
  }; // updates a document

  deleteOne = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .deleteOne({ _id: req.params.id })
      .exec()
      .then(result => {
        if (result.n) {
          resp.send(204);
          return next();
        } else {
          throw new NotFoundError("Document not found");
          return next();
        }
      })
      .catch(next);
  }; // delete  a document

  renderAll(resp: restify.Response, next: restify.Next){
    return (documents: any) => {
      if (Array.isArray(documents)) {
        documents.map((document) => {
          this.emit("beforeRender", document);
        });
        resp.json(documents);
      } else if(documents) {
        this.emit("beforeRender", documents);
        resp.json(documents);
      } else {
        resp.json([]);
      }
    };
  };

  validateId = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    if (!ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Document not found"));
    } else {
      next();
    }
  };
}
