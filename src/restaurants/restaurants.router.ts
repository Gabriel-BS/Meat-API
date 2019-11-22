import { RestaurantInterface, Restaurant } from "./restaurants.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";

class RestaurantRouter extends ModelRouter<RestaurantInterface> {
    constructor(){
        super(Restaurant)
    }

    envelope(document: any){
      let resource = super.envelope(document)
      resource._links.menu = `${this.basePath}/${resource._id}/menu`
      return resource
    }

    findMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
      Restaurant.findById(req.params.id).select("menu").then(rest => {
        if(!rest){
          throw new NotFoundError('Restaurant not found')
        }else{
          resp.json(rest.menu)
          return next()
        }
      }).catch(next)
    }

    replaceMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
      Restaurant.findById(req.params.id).select("menu").then(rest => {
        if(!rest){
          throw new NotFoundError('Restaurant not found')
        }else{
          rest.menu = req.body
          return rest.save()
        }
      }).then(rest => {
        resp.json(rest.menu)
      }).catch(next)
    }

  applyRoutes(application: restify.Server) {

    application.get("/restaurants", this.findAll) // retrieve all documents from that collection

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]) // retrieve a single document by its id

    application.post("/restaurants", this.createOne) // create a new document

    application.put(`${this.basePath}/:id`, [this.validateId, this.replaceOne]) // replace a document

    application.patch(`${this.basePath}/:id`, [this.validateId, this.updateOne]) // updates a document

    application.del(`${this.basePath}/:id`, [this.validateId, this.deleteOne]) // delete  a document

    application.get(`${this.basePath}/:id/menu`, this.validateId, this.findMenu )

    application.put(`${this.basePath}/:id/menu`, this.validateId, this.replaceMenu )

  }
}

export const restaurantRouter = new RestaurantRouter();
