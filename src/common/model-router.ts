import { Router } from "./router";
import * as mongoose from "mongoose";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { ObjectId } from "bson";
import { parse } from "path";

export abstract class ModelRouter<T extends mongoose.Document> extends Router {
  basePath: string
  pageSize: number = 4

  constructor(protected model: mongoose.Model<T>) {
    super();
    this.basePath = `/${model.collection.name}`
  }

  findAll = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    let page = parseInt(req.query._page || 1) 
    page = page > 0 ? page: 1
    const skip = (page - 1) * this.pageSize
    this.model.countDocuments({}).exec().then(count => 
       this.model
      .find().limit(this.pageSize).skip(skip)
      .then(this.renderAll(resp, next, {page, count, pageSize: this.pageSize, url: req.url})))
      .catch(next);
  }; // retrieve all documents from that collection

  findById = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.prepareOne(this.model.findById(req.params.id))
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

  protected prepareOne(query: mongoose.DocumentQuery<T | null, T, {}>): mongoose.DocumentQuery<T | null, T, {}> {
    return query
  }

  envelope(document: any): any {
    let resource = Object.assign({_links:{}}, document.toJSON())
    resource._links.self = `${this.basePath}/${resource._id}`
    return resource
  }

  envelopeAll(documents: any[], options: any = {}): any{
    const resource: any = {
      _links: {
        self: `${options.url}`
      },
      items: documents
    }
    if (options.page && options.count && options.pageSize){
      if(options.page > 1){
        resource._links.previous = `${this.basePath}?_page=${options.page-1}`
      }
      const remaining = options.count - (options.page * options.pageSize)
      if(remaining > 0){
        resource._links.next = `${this.basePath}?_page=${options.page+1}`
      }
    }
    return resource
  }

  renderAll(resp: restify.Response, next: restify.Next, options: any = {}){
    return (documents: T | T[] | null) => {
      if (Array.isArray(documents)) {
        documents.map((document, index, array) => {
          this.emit("beforeRender", document)
          array[index] = this.envelope(document)
        });
        resp.json(this.envelopeAll(documents, options));
      } else if(documents) {
        this.emit("beforeRender", documents); 
        resp.json(this.envelope(documents));
       } else if(!documents){
         throw new NotFoundError('Document not found')
       }
       return next()
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
