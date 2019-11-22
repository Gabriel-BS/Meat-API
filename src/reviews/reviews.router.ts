import { ReviewInterface, Review } from "./reviews.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import * as mongoose from "mongoose";

class ReviewRouter extends ModelRouter<ReviewInterface> {
  constructor() {
    super(Review);
  }

  envelope(document: any){
    let resource = super.envelope(document)
    const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
    resource._links.restaurant = `/restaurant/${restId}`
    return resource
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<ReviewInterface | null, ReviewInterface, {}>
  ): mongoose.DocumentQuery<ReviewInterface | null, ReviewInterface, {}> {
    return query.populate("user", "name").populate("restaurant", "name");
  }
  
  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll); // retrieve all documents from that collection

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]); // retrieve a single document by its id

    application.post(`${this.basePath}`, this.createOne); // create a new document
  }
}

export const reviewRouter = new ReviewRouter();
