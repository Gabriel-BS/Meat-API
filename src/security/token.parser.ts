import * as restify from "restify";
import { User, UserInterface } from "../users/users.model";
import * as jwt from "jsonwebtoken";
import { environment } from "../common/environment";

declare module 'restify' {
  export interface Request {
      authenticated: UserInterface
  }
}

export const tokenParser: restify.RequestHandler = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
  } else {
    next();
  }
};

function extractToken(req: restify.Request) {
  //Authorization: Bearer TOKEN
  let token = undefined;
  const authorization = req.header("authorization");
  if (authorization) {
    const parts: string[] = authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  return token;
}

function applyBearer(
  req: restify.Request,
  next: restify.Next
): (error: jwt.VerifyErrors, decoded: string | object) => void {
  return (error: jwt.VerifyErrors, decoded: string | object) => {
    if (decoded) {
      User.findByEmail((<any>decoded).sub)
        .then(user => {
          if (user) {
            req.authenticated = user;
          }
          next();
        })
        .catch(next);
    } else {
      next();
    }
  };
}
