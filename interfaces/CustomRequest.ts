import fileUpload, { UploadedFile } from "express-fileupload";
import { Request } from "express";

/** When using fileUpload, a new key, named files, is created in req, this is why it is not defined initialy in Request type from express */
interface ICustomRequest extends Request {
  files?: {
    [key: string]: UploadedFile | UploadedFile[];
  };
}

export default ICustomRequest;
