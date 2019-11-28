import * as restify from "restify";
import { ForbiddenError, NotExtendedError } from "restify-errors";

export const authorize: (...profiles: string[]) => restify.RequestHandler = (
  ...profiles
) => {
  return (req, resp, next) => {
    if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
      next();
    } else {
      next(new ForbiddenError("Permission denied"));
    }
  };
};
 