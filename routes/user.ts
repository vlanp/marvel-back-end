import express from "express";
import hashPassword from "../utils/passwordProtection";
import fileUpload, { UploadedFile } from "express-fileupload";
import User from "../models/User";
import uid2 from "uid2";
import { uploadPicture } from "../utils/cloudinary";
import sendEmail from "../utils/email";
import isArgumentValid from "../middlewares/argumentValidation";
import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import CArgumentValidationError from "../classes/Error";

const router = express.Router();

router.post(
  "/signup",
  fileUpload(),
  isArgumentValid({
    parameterType: EParameterType.BODY,
    argumentName: "username",
    argumentType: EArgumentType.STRING,
    stringOption: {
      argumentMinLength: 2,
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
      });
      const isAvatarValid = isAvatarValidFunction(req, res, next);

      const avatar: UploadedFile | null = !isAvatarValid
        ? null
        : Array.isArray(req.files)
        ? req.files[0].picture
        : req.files!.picture;

      const { username, password, email } = req.body;

      const user = await User.findOne({ email: email });

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
          "https://site--backend-vinted--x7c7hl9cnzx6.code.run" +
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
        newUser.account.avatar = pictureDataObj.secure_url;
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
  "/login",
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

      const user = await User.findOne({ email: email });

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

router.get("/account", async (req, res) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      throw { status: 401, message: "Unauthorized access" };
    }

    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({
      token: token,
    });

    if (!user) {
      throw { status: 404, message: "No user found with this token" };
    }

    res.status(200).json({
      username: user.account.username,
      avatar: user.account.avatar?.secure_url,
      email: user.email,
      active: user.active,
      newsletter: user.newsletter,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

router.patch("/account", fileUpload(), async (req, res) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      throw { status: 401, message: "Unauthorized access" };
    }

    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({
      token: token,
    });

    if (!user) {
      throw { status: 404, message: "No user found with this token" };
    }

    const { newsletter, username } = req.body;

    const isUsernameValidFunction = isArgumentValid({
      parameterType: "body",
      argumentName: "username",
      argumentType: "string",
      isMiddleware: false,
      stringOption: {
        argumentMinLength: 2,
      },
    });
    const isUsernameValid = isUsernameValidFunction(req, res);

    const isNewsletterValidFunction = isArgumentValid({
      parameterType: "body",
      argumentName: "newsletter",
      argumentType: "boolean",
      isMiddleware: false,
    });
    const isNewsletterValid = isNewsletterValidFunction(req, res);

    const isPictureValidFunction = isArgumentValid({
      parameterType: "files",
      argumentName: "picture",
      argumentType: "picture",
      isMiddleware: false,
    });
    const isPictureValid = isPictureValidFunction(req, res);

    if (isUsernameValid) {
      user.account.username = username;
    }

    if (isNewsletterValid) {
      user.newsletter = newsletter;
    }

    if (isPictureValid) {
      const { picture } = req.files;
      const folder = "/vinted/user/" + user._id;
      const pictureDataObj = await uploadPicture(picture, folder);
      user.account.avatar = pictureDataObj;
    }

    await user.save();

    res.status(200).json({
      username: user.account.username,
      avatar: user.account.avatar?.secure_url,
      email: user.email,
      active: user.active,
      newsletter: user.newsletter,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
