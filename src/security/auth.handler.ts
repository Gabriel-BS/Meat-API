import * as restify from "restify";
import { NotAuthorizedError } from "restify-errors";
import {User} from '../users/users.model'
import * as jwt from 'jsonwebtoken'
import { environment } from "../common/environment";

export const authenticate = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    const {email, password} = req.body
    User.findByEmail(email, '+password').then(user => {
        if(user && user.matches(password)) {
            const token = jwt.sign({sub: user.email, iss: 'meat-api'}, environment.security.apiSecret)
            resp.json({name: user.name, email: user.email, accessToken: token})
            return next(false)
        } else {
            return next(new NotAuthorizedError('Invalid Credentials'))
        }
    }).catch(next)

}