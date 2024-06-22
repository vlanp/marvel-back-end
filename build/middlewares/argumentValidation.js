"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentValidation_1 = require("../interfaces/ArgumentValidation");
var validator_1 = __importDefault(require("validator"));
var Error_1 = __importDefault(require("../classes/Error"));
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
var isArgumentValid = function (argumentValidation) {
    var parameterType = argumentValidation.parameterType, argumentName = argumentValidation.argumentName, argumentType = argumentValidation.argumentType, stringOption = argumentValidation.stringOption, numberOption = argumentValidation.numberOption, _a = argumentValidation.isMiddleware, isMiddleware = _a === void 0 ? true : _a;
    var isString = function (req, res, next) {
        try {
            var argument = req[parameterType][argumentName];
            if (typeof argument !== "string") {
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect " +
                        argumentName +
                        ". Please enter a valid " +
                        argumentName +
                        ". (format: " +
                        argumentType +
                        ")",
                });
            }
            if (((stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMinLength)
                ? argument.length < stringOption.argumentMinLength
                : false) ||
                ((stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMaxLength)
                    ? argument.length > stringOption.argumentMaxLength
                    : false)) {
                var part1 = (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMinLength)
                    ? argumentName +
                        " length must be at least " +
                        stringOption.argumentMinLength +
                        " char long"
                    : "";
                var part2 = part1
                    ? (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMaxLength)
                        ? " and not more than " + stringOption.argumentMaxLength + " char."
                        : ""
                    : (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMaxLength)
                        ? argumentName +
                            " length must be no more than " +
                            stringOption.argumentMinLength +
                            " char long."
                        : "";
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect " + argumentName + ". " + part1 + part2,
                });
            }
            if ((stringOption === null || stringOption === void 0 ? void 0 : stringOption.mustBeStrongPassword)
                ? !validator_1.default.isStrongPassword(argument)
                : false) {
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect password. Your password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol",
                });
            }
            if ((stringOption === null || stringOption === void 0 ? void 0 : stringOption.mustBeEmail) ? !validator_1.default.isEmail(argument) : false) {
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect email. Please enter a valid email.",
                });
            }
            var keyList = (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentTransformObj)
                ? Object.keys(stringOption.argumentTransformObj)
                : [];
            if (keyList.length !== 0) {
                if (!keyList.includes(argument)) {
                    throw new Error_1.default({
                        status: 406,
                        argumentName: argumentName,
                        argumentType: argumentType,
                        parameterType: parameterType,
                        message: "Incorrect " +
                            argumentName +
                            ". Must be " +
                            keyList.join(" or ") +
                            ".",
                    });
                }
                var newArg = stringOption.argumentTransformObj[argument];
                req[parameterType][argumentName] = newArg;
            }
            return isMiddleware ? next() : true;
        }
        catch (error) {
            if (error instanceof Error_1.default) {
                isMiddleware
                    ? res.status(error.status).json(error)
                    : console.log(error.message);
            }
            else {
                isMiddleware ? res.status(500).json(error) : console.log(error);
            }
        }
    };
    var isNumber = function (req, res, next) {
        try {
            var argument = Number(req[parameterType][argumentName]);
            if (typeof argument !== "number" || Number.isNaN(argument)) {
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect " +
                        argumentName +
                        ". Please enter a valid " +
                        argumentName +
                        ". (format: " +
                        argumentType +
                        ")",
                });
            }
            if ((numberOption === null || numberOption === void 0 ? void 0 : numberOption.mustBeInteger) ? !Number.isInteger(argument) : false) {
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect " + argumentName + ". Must be an integer.",
                });
            }
            if (((numberOption === null || numberOption === void 0 ? void 0 : numberOption.argumentMinValue)
                ? argument < numberOption.argumentMinValue
                : false) ||
                ((numberOption === null || numberOption === void 0 ? void 0 : numberOption.argumentMaxValue)
                    ? argument > numberOption.argumentMaxValue
                    : false)) {
                var part1 = (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMinLength)
                    ? argumentName +
                        "  must be superior than " +
                        stringOption.argumentMinLength
                    : "";
                var part2 = part1
                    ? (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMaxLength)
                        ? " and not more than " + stringOption.argumentMaxLength + "."
                        : ""
                    : (stringOption === null || stringOption === void 0 ? void 0 : stringOption.argumentMaxLength)
                        ? argumentName +
                            " must be no more than " +
                            stringOption.argumentMinLength +
                            "."
                        : "";
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "Incorrect " + argumentName + ". " + part1 + part2,
                });
            }
            req[parameterType][argumentName] = argument;
            return isMiddleware ? next() : true;
        }
        catch (error) {
            if (error instanceof Error_1.default) {
                isMiddleware
                    ? res.status(error.status).json(error)
                    : console.log(error.message);
            }
            else {
                isMiddleware ? res.status(500).json(error) : console.log(error);
            }
        }
    };
    var isPicture = function (req, res, next) {
        try {
            if (parameterType === ArgumentValidation_1.EParameterType.FILES && req[parameterType]) {
                if (!Array.isArray(req[parameterType][argumentName])) {
                    var picture = req[parameterType][argumentName];
                    if (!picture || !picture.mimetype || !picture.data) {
                        throw new Error_1.default({
                            status: 400,
                            argumentName: argumentName,
                            argumentType: argumentType,
                            parameterType: parameterType,
                            message: "No picture found",
                        });
                    }
                }
                else {
                    var pictureList = req[parameterType][argumentName];
                    for (var i = 0; i <= pictureList.length - 1; i++) {
                        var picture = pictureList[i];
                        if (!picture || !picture.mimetype || !picture.data) {
                            pictureList.splice(i, 1);
                            i--;
                        }
                    }
                    req[parameterType][argumentName] = pictureList;
                    if (pictureList.length === 0) {
                        throw new Error_1.default({
                            status: 400,
                            argumentName: argumentName,
                            argumentType: argumentType,
                            parameterType: parameterType,
                            message: "No picture found",
                        });
                    }
                }
            }
            else {
                throw new Error_1.default({
                    status: 400,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: "No picture found",
                });
            }
            return isMiddleware ? next() : true;
        }
        catch (error) {
            if (error instanceof Error_1.default) {
                isMiddleware
                    ? res.status(error.status).json(error)
                    : console.log(error.message);
            }
            else {
                isMiddleware ? res.status(500).json(error) : console.log(error);
            }
        }
    };
    var isBoolean = function (req, res, next) {
        try {
            var argument = req[parameterType][argumentName];
            var allowedArgumentList = [
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
                throw new Error_1.default({
                    status: 406,
                    argumentName: argumentName,
                    argumentType: argumentType,
                    parameterType: parameterType,
                    message: argumentName + " is not a boolean.",
                });
            }
            if ((allowedArgumentList.indexOf(argument) + 1) % 2 === 0) {
                argument = true;
            }
            else {
                argument = false;
            }
            req[parameterType][argumentName] = argument;
            return isMiddleware ? next() : true;
        }
        catch (error) {
            if (error instanceof Error_1.default) {
                isMiddleware
                    ? res.status(error.status).json(error)
                    : console.log(error.message);
            }
            else {
                isMiddleware ? res.status(500).json(error) : console.log(error);
            }
        }
    };
    switch (argumentType) {
        case ArgumentValidation_1.EArgumentType.STRING:
            return isString;
        case ArgumentValidation_1.EArgumentType.NUMBER:
            return isNumber;
        case ArgumentValidation_1.EArgumentType.PICTURE:
            return isPicture;
        case ArgumentValidation_1.EArgumentType.BOOLEAN:
            return isBoolean;
    }
};
exports.default = isArgumentValid;
