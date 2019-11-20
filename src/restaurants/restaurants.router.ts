import { RestaurantInterface, Restaurant } from "./restaurants.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";

class RestaurantRouter extends ModelRouter<RestaurantInterface> {
    constructor(){
        super(Restaurant)
    }

  applyRoutes(application: restify.Server) {

    application.get("/restaurants", this.findAll) // retrieve all documents from that collection

    application.get("/restaurants/:id", [this.validateId, this.findById]) // retrieve a single document by its id

    application.post("/restaurants", this.createOne) // create a new document

    application.put("/restaurants/:id", [this.validateId, this.replaceOne]) // replace a document

    application.patch("/restaurants/:id", [this.validateId, this.updateOne]) // updates a document

    application.del("/restaurants/:id", [this.validateId, this.deleteOne]) // delete  a document
  }
}

export const restaurantRouter = new RestaurantRouter();
