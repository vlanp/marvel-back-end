import express from "express";
import hashPassword from "../utils/passwordProtection";
import fileUpload, { UploadedFile } from "express-fileupload";
import User from "../models/User";
import uid2 from "uid2";
import { deletePicture, uploadPicture } from "../utils/cloudinary";
import sendEmail from "../utils/email";
import isArgumentValid from "../middlewares/argumentValidation";
import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import CArgumentValidationError from "../classes/Error";
import { isAuthentificated } from "../middlewares/authentification";
import CustomRequest from "../interfaces/CustomRequest";
import { UploadApiResponse } from "cloudinary";

const router = express.Router();

router.post(
  "/signup",
  fileUpload(),
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "username",
    argumentType: EArgumentType.STRING,
    stringOption: {
      argumentMinLength: 1,
    },
  }),
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "password",
    argumentType: EArgumentType.STRING,
    stringOption: {
      mustBeStrongPassword: true,
    },
  }),
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "email",
    argumentType: EArgumentType.STRING,
    stringOption: {
      mustBeEmail: true,
    },
  }),
  async (req, res, next) => {
    try {
      const isAvatarValidFunction = isArgumentValid({
        parameterType: EParameterType.FILES,
        argumentName: "avatar",
        argumentType: EArgumentType.PICTURE,
        isMiddleware: false,
      });
      const isAvatarValid = isAvatarValidFunction(req, res, next);

      const avatar: UploadedFile | null = !isAvatarValid
        ? null
        : Array.isArray(req.files)
        ? req.files[0].avatar
        : req.files!.avatar;

      const { username, password, email } = req.body;

      const user = await User.findOne({
        "account.email": email,
      });

      if (user) {
        throw new CArgumentValidationError({
          status: 409,
          argumentName: "email",
          argumentType: EArgumentType.STRING,
          parameterType: EParameterType.BODY,
          message:
            "Email non valide. Il y a déjà un compte associé à cette email.",
        });
      }

      const { salt, hash, token } = hashPassword(password);

      const randomString = uid2(128);

      await sendEmail(
        email,
        "Lien de vérification de l'email " + email,
        "Merci de cliquer sur le lien ci-dessous pour activer votre compte : \n" +
          process.env.THIS_BACK_END_URL +
          "/user/mailcheck/" +
          randomString
      );

      const newUser = new User({
        account: {
          email: email,
          username: username,
          avatar: null,
        },
        private: {
          token: token,
          hash: hash,
          salt: salt,
        },
        randomString: randomString,
      });

      if (avatar) {
        const folder = "/marvel/user/" + newUser._id;
        const pictureDataObj = await uploadPicture(avatar, folder);
        newUser.account.avatar = {
          secure_url: pictureDataObj.secure_url,
          public_id: pictureDataObj.public_id,
        };
      }

      await newUser.save();

      const response = {
        _id: newUser._id,
        token: token,
        account: newUser.account,
      };

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        res.status(error.status).json(error);
      } else {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
);

router.post(
  "/signin",
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "password",
    argumentType: EArgumentType.STRING,
    stringOption: {
      mustBeStrongPassword: true,
    },
  }),
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "email",
    argumentType: EArgumentType.STRING,
    stringOption: {
      mustBeEmail: true,
    },
  }),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(email, password);

      const user = await User.findOne({ "account.email": email });

      if (!user) {
        throw new CArgumentValidationError({
          status: 404,
          argumentName: "email",
          argumentType: EArgumentType.STRING,
          parameterType: EParameterType.BODY,
          message:
            "Impossible de se connecter au compte. Mauvais mail ou mot de passe.",
        });
      }

      const { _id } = user;
      const { token, hash, salt } = user.private;

      const hashToVerify = hashPassword(password, salt).hash;

      if (hashToVerify !== hash) {
        throw new CArgumentValidationError({
          status: 404,
          argumentName: "email",
          argumentType: EArgumentType.STRING,
          parameterType: EParameterType.BODY,
          message:
            "Impossible de se connecter au compte. Mauvais mail ou mot de passe.",
        });
      }

      const response = {
        _id: _id,
        token: token,
        account: user.account,
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        res.status(error.status).json(error);
      } else {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
);

router.get("/mailcheck/:randomString", async (req, res) => {
  try {
    const randomString = req.params.randomString;

    const user = await User.findOne({ randomString: randomString });

    if (!user) {
      throw new CArgumentValidationError({
        status: 404,
        argumentName: "randomString",
        argumentType: EArgumentType.STRING,
        parameterType: EParameterType.BODY,
        message:
          "Aucun utilisateur trouvé associé à ce token de vérification d'email.",
      });
    }

    user.randomString = undefined;
    user.isActive = true;

    await user.save();

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error: unknown) {
    if (error instanceof CArgumentValidationError) {
      res.status(error.status).json(error);
    } else {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.get("/account", isAuthentificated, async (req: CustomRequest, res) => {
  try {
    const { user } = req;

    if (!user) {
      throw new CArgumentValidationError({
        status: 500,
        argumentName: "user",
        message:
          "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant le controller.",
      });
    }

    res.status(200).json({
      account: user.account,
      active: user.isActive,
    });
  } catch (error: unknown) {
    if (error instanceof CArgumentValidationError) {
      res.status(error.status).json(error);
    } else {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.patch(
  "/account",
  isAuthentificated,
  fileUpload(),
  async (req: CustomRequest, res, next) => {
    try {
      const { user } = req;

      if (!user) {
        throw new CArgumentValidationError({
          status: 500,
          argumentName: "user",
          message:
            "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant le controller.",
        });
      }

      const isUsernameValidFunction = isArgumentValid({
        parameterType: EParameterType.BODY,
        argumentName: "username",
        argumentType: EArgumentType.STRING,
        isMiddleware: false,
        stringOption: {
          argumentMinLength: 1,
        },
      });
      const isUsernameValid = isUsernameValidFunction(req, res, next);

      const isAvatarValidFunction = isArgumentValid({
        parameterType: EParameterType.FILES,
        argumentName: "avatar",
        argumentType: EArgumentType.PICTURE,
        isMiddleware: false,
      });
      const isAvatarValid = isAvatarValidFunction(req, res, next);

      const avatar: UploadedFile | null = !isAvatarValid
        ? null
        : Array.isArray(req.files)
        ? req.files[0].avatar
        : req.files!.avatar;

      const { username } = req.body;

      if (isUsernameValid) {
        user.account.username = username;
      }

      if (avatar) {
        const folder = "/vinted/user/" + user._id;

        // Save
        const arrayOfPromises: [Promise<UploadApiResponse>, Promise<void>?] = [
          uploadPicture(avatar, folder),
        ];

        // Delete
        if (
          user.account.avatar &&
          "public_id" in user.account.avatar &&
          user.account.avatar.public_id
        ) {
          const deletePromise = deletePicture(
            user.account.avatar.public_id,
            folder
          );
          arrayOfPromises.push(deletePromise);
        }

        const responseList = await Promise.all(arrayOfPromises);

        user.account.avatar = {
          secure_url: responseList[0].secure_url,
          public_id: responseList[0].public_id,
        };
      }

      await user.save();

      res.status(200).json({
        account: user.account,
        isActive: user.isActive,
      });
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        res.status(error.status).json(error);
      } else {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
);

export default router;
