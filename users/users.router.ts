import * as restify from "restify";
import { Router } from "../common/router";
import { User } from "../users/users.model";

class UsersRouter extends Router {
    applyRoutes(application: restify.Server){
        application.get('/users', (req, resp, next) => { //route that utilizes the findAll function
            User.findAll().then(users => {
                resp.json(users)
                return next()
            })
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => { //route that utilizes the findById function
                if(user){
                    resp.json(user)
                    return next()
                }
                resp.send(404)
                return next()
            })
        })
    }
}


export const usersRouter = new UsersRouter()



        // /**
        //  * @param resp
        //  * it represents the response and the information it carries with itself like
        //  * contentType
        //  *
        //  * @param req
        //  * it represents the requisiton and the information of that requisiton, method used,
        //  * parameters of it is an GET method for example
        //  *
        //  * @param next
        //  * Calling next() will move to the next function in the chain.
        //  * if you need to stop processing some request you can use return next(false)
        //  */

        // this.application.get("/info", [
        //     (req, resp, next) => {
        //       if (req.userAgent().includes("Mozilla /5.0")) {
        //         resp.json({ message: "you are using Mozilla" });
        //         return next(false);
        //       }
        //       return next();
        //     },
        //     (req, resp, next) => {
        //       resp.json({
        //         browser: req.userAgent(),
        //         method: req.method,
        //         url: req.href(),
        //         path: req.path(),
        //         query: req.query
        //       });
        //       return next();
        //     }
        //   ]);
  