import CArgumentValidationError from "../classes/Error";
import CustomRequest from "../interfaces/CustomRequest";
import User from "../models/User";
import { Response, NextFunction } from "express";

/**
 * Return next() if the parameter req contains a Bearer token in req.headers.authorization and this token correspond to a user in the database.
 * Use as a middleware with express package, next() make the code continue to the next middleware.
 * The user found in the database is added to req.user and can be access in the next middleware.
 * Return undefined if there is no valid Bearer token in the req, and respond to the client.
 *
 * @param req The object that contains all the datas and information about the request send to the express route.
 * @param res The object that allows to respond to the request send to the express route.
 * @param next The function that allows to go to the next middleware when it is returned.
 * @return next() if there is a valid Bearer token in the req parameter and undefined if not.
 */
const isAuthentificated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      throw new CArgumentValidationError({
        status: 401,
        argumentName: "authorization",
        message: "Aucun token d'accès transmis. Accès non autorisé",
      });
    }

    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({
      token: token,
    });

    if (!user) {
      throw new CArgumentValidationError({
        status: 401,
        argumentName: "authorization",
        message:
          "Aucun utilisateur ne correspond au token d'accès transmis. Accès non autorisé",
      });
    }

    req.user = user;

    return next();
  } catch (error: unknown) {
    if (error instanceof CArgumentValidationError) {
      res.status(error.status).json(error);
    } else {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

const isAccountActive = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    if (!user) {
      throw new CArgumentValidationError({
        status: 500,
        argumentName: "user",
        message:
          "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant isAccountActive.",
      });
    }

    if (!user.isActive) {
      throw new CArgumentValidationError({
        status: 401,
        argumentName: "isActive",
        message: "L'adresse email doit être vérifiée. Accès non authorisé",
      });
    }

    return next();
  } catch (error: unknown) {
    if (error instanceof CArgumentValidationError) {
      res.status(error.status).json(error);
    } else {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

export { isAuthentificated, isAccountActive };
