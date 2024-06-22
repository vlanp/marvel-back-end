import { Response, NextFunction, Request } from "express";
import IArgumentValidation, {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import validator from "validator";
import { UploadedFile } from "express-fileupload";
import CArgumentValidationError from "../classes/Error";

/**
 * Return **next()** or **undefined** when use as a **middleware** and return **true** or **undefined** otherwise.
 *
 * With express **next()** make the code continue to the next middleware.
 *
 * @param parameterType **Mandatory parameter**. Must represent the key in which the argument is stored (**eg: body, params, query, files...**)
 * @param argumentName **Mandatory parameter**. Must represent the name of the argument stored in **req[***parameterType***]**
 * @param argumentType **Mandatory parameter**. Must represent the type (**ie: string, number, picture or boolean**) for which the argument will be validate
 * @param stringOption **Optional parameter**. Allow to add some options when ***argumentType***=**string**
 * @param numberOption **Optional parameter**. Allow to add some options when ***argumentType***=**number**
 * @param isMiddleware **Optional parameter**. Must be set to **false** when the funtion is not used as a middleware
 * @return **next()** or **true** or **undefined**
 */
const isArgumentValid = <NewArgType>(
  argumentValidation: IArgumentValidation<NewArgType>
) => {
  const {
    parameterType,
    argumentName,
    argumentType,
    stringOption,
    numberOption,
    isMiddleware = true,
  } = argumentValidation;

  const isString = (req: Request, res: Response, next: NextFunction) => {
    try {
      const argument = req[parameterType][argumentName];

      if (typeof argument !== "string") {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message:
            "Incorrect " +
            argumentName +
            ". Please enter a valid " +
            argumentName +
            ". (format: " +
            argumentType +
            ")",
        });
      }

      if (
        (stringOption?.argumentMinLength
          ? argument.length < stringOption.argumentMinLength
          : false) ||
        (stringOption?.argumentMaxLength
          ? argument.length > stringOption.argumentMaxLength
          : false)
      ) {
        const part1 = stringOption?.argumentMinLength
          ? argumentName +
            " length must be at least " +
            stringOption.argumentMinLength +
            " char long"
          : "";
        const part2 = part1
          ? stringOption?.argumentMaxLength
            ? " and not more than " + stringOption.argumentMaxLength + " char."
            : ""
          : stringOption?.argumentMaxLength
          ? argumentName +
            " length must be no more than " +
            stringOption.argumentMinLength +
            " char long."
          : "";

        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: "Incorrect " + argumentName + ". " + part1 + part2,
        });
      }

      if (
        stringOption?.mustBeStrongPassword
          ? !validator.isStrongPassword(argument)
          : false
      ) {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message:
            "Incorrect password. Your password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol",
        });
      }

      if (stringOption?.mustBeEmail ? !validator.isEmail(argument) : false) {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: "Incorrect email. Please enter a valid email.",
        });
      }

      const keyList = stringOption?.argumentTransformObj
        ? Object.keys(stringOption.argumentTransformObj)
        : [];
      if (keyList.length !== 0) {
        if (!keyList.includes(argument)) {
          throw new CArgumentValidationError({
            status: 406,
            argumentName: argumentName,
            argumentType: argumentType,
            parameterType: parameterType,
            message:
              "Incorrect " +
              argumentName +
              ". Must be " +
              keyList.join(" or ") +
              ".",
          });
        }
        const newArg = stringOption!.argumentTransformObj![argument];
        req[parameterType][argumentName] = newArg;
      }

      return isMiddleware ? next() : true;
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        isMiddleware
          ? res.status(error.status).json(error)
          : console.log(error.message);
      } else {
        isMiddleware ? res.status(500).json(error) : console.log(error);
      }
    }
  };

  const isNumber = (req: Request, res: Response, next: NextFunction) => {
    try {
      const argument = Number(req[parameterType][argumentName]);

      if (typeof argument !== "number" || Number.isNaN(argument)) {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message:
            "Incorrect " +
            argumentName +
            ". Please enter a valid " +
            argumentName +
            ". (format: " +
            argumentType +
            ")",
        });
      }

      if (numberOption?.mustBeInteger ? !Number.isInteger(argument) : false) {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: "Incorrect " + argumentName + ". Must be an integer.",
        });
      }

      if (
        (numberOption?.argumentMinValue
          ? argument < numberOption.argumentMinValue
          : false) ||
        (numberOption?.argumentMaxValue
          ? argument > numberOption.argumentMaxValue
          : false)
      ) {
        const part1 = stringOption?.argumentMinLength
          ? argumentName +
            "  must be superior than " +
            stringOption.argumentMinLength
          : "";
        const part2 = part1
          ? stringOption?.argumentMaxLength
            ? " and not more than " + stringOption.argumentMaxLength + "."
            : ""
          : stringOption?.argumentMaxLength
          ? argumentName +
            " must be no more than " +
            stringOption.argumentMinLength +
            "."
          : "";
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: "Incorrect " + argumentName + ". " + part1 + part2,
        });
      }

      req[parameterType][argumentName] = argument;

      return isMiddleware ? next() : true;
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        isMiddleware
          ? res.status(error.status).json(error)
          : console.log(error.message);
      } else {
        isMiddleware ? res.status(500).json(error) : console.log(error);
      }
    }
  };

  const isPicture = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (parameterType === EParameterType.FILES && req[parameterType]) {
        if (!Array.isArray(req[parameterType]![argumentName])) {
          const picture = req[parameterType]![argumentName] as UploadedFile;
          if (!picture || !picture.mimetype || !picture.data) {
            throw new CArgumentValidationError({
              status: 400,
              argumentName: argumentName,
              argumentType: argumentType,
              parameterType: parameterType,
              message: "No picture found",
            });
          }
        } else {
          const pictureList = req[parameterType]![
            argumentName
          ] as UploadedFile[];

          for (let i = 0; i <= pictureList.length - 1; i++) {
            const picture = pictureList[i];
            if (!picture || !picture.mimetype || !picture.data) {
              pictureList.splice(i, 1);
              i--;
            }
          }

          req[parameterType]![argumentName] = pictureList;

          if (pictureList.length === 0) {
            throw new CArgumentValidationError({
              status: 400,
              argumentName: argumentName,
              argumentType: argumentType,
              parameterType: parameterType,
              message: "No picture found",
            });
          }
        }
      } else {
        throw new CArgumentValidationError({
          status: 400,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: "No picture found",
        });
      }
      return isMiddleware ? next() : true;
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        isMiddleware
          ? res.status(error.status).json(error)
          : console.log(error.message);
      } else {
        isMiddleware ? res.status(500).json(error) : console.log(error);
      }
    }
  };

  const isBoolean = (req: Request, res: Response, next: NextFunction) => {
    try {
      let argument = req[parameterType][argumentName];
      const allowedArgumentList = [
        0,
        1,
        "0",
        "1",
        false,
        true,
        "false",
        "true",
      ];

      if (!allowedArgumentList.includes(argument)) {
        throw new CArgumentValidationError({
          status: 406,
          argumentName: argumentName,
          argumentType: argumentType,
          parameterType: parameterType,
          message: argumentName + " is not a boolean.",
        });
      }

      if ((allowedArgumentList.indexOf(argument) + 1) % 2 === 0) {
        argument = true;
      } else {
        argument = false;
      }

      req[parameterType][argumentName] = argument;

      return isMiddleware ? next() : true;
    } catch (error: unknown) {
      if (error instanceof CArgumentValidationError) {
        isMiddleware
          ? res.status(error.status).json(error)
          : console.log(error.message);
      } else {
        isMiddleware ? res.status(500).json(error) : console.log(error);
      }
    }
  };

  switch (argumentType) {
    case EArgumentType.STRING:
      return isString;
    case EArgumentType.NUMBER:
      return isNumber;
    case EArgumentType.PICTURE:
      return isPicture;
    case EArgumentType.BOOLEAN:
      return isBoolean;
  }
};

export default isArgumentValid;
