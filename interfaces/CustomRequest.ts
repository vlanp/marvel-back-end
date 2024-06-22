import { Request } from "express";

interface CustomRequest extends Request {
  user?: {
    account: {
      email: string;
      username: string;
      avatar?: {
        secure_url: string;
        public_id: string;
      };
    };
    isActive: boolean;
    _id: string;
  };
}

export default CustomRequest;
