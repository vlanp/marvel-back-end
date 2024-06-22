import { Request } from "express";
import { IUser } from "../models/User";
import { Document, Types } from "mongoose";

interface CustomRequest extends Request {
  user?: Document<unknown, object, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
}

export default CustomRequest;
