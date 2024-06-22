import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  account: {
    email: string;
    username: string;
    avatar: string;
  };
  private: {
    token: string;
    hash: string;
    salt: string;
  };
  isActive: boolean;
  randomString?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  account: {
    email: { type: String, required: true },
    username: { type: String, required: true },
    avatar: String,
  },
  private: {
    token: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
  },
  isActive: {
    type: Boolean,
    default: false, // Permet de gérer la vérification de l'email
  },
  randomString: String,
});

// 3. Create a Model
const User = model("User", userSchema);

export default User;
export type { IUser };
