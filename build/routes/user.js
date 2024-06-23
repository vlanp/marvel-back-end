"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passwordProtection_1 = __importDefault(require("../utils/passwordProtection"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var User_1 = __importDefault(require("../models/User"));
var uid2_1 = __importDefault(require("uid2"));
var cloudinary_1 = require("../utils/cloudinary");
var email_1 = __importDefault(require("../utils/email"));
var argumentValidation_1 = __importDefault(require("../middlewares/argumentValidation"));
var ArgumentValidation_1 = require("../interfaces/ArgumentValidation");
var Error_1 = __importDefault(require("../classes/Error"));
var authentification_1 = require("../middlewares/authentification");
var router = express_1.default.Router();
router.post("/signup", (0, express_fileupload_1.default)(), (0, argumentValidation_1.default)({
    parameterType: ArgumentValidation_1.EParameterType.BODY,
    argumentName: "username",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    stringOption: {
        argumentMinLength: 2,
    },
}), (0, argumentValidation_1.default)({
    parameterType: ArgumentValidation_1.EParameterType.BODY,
    argumentName: "password",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    stringOption: {
        mustBeStrongPassword: true,
    },
}), (0, argumentValidation_1.default)({
    parameterType: ArgumentValidation_1.EParameterType.BODY,
    argumentName: "email",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    stringOption: {
        mustBeEmail: true,
    },
}), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var isAvatarValidFunction, isAvatarValid, avatar, _a, username, password, email, user, _b, salt, hash, token, randomString, newUser, folder, pictureDataObj, response, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                isAvatarValidFunction = (0, argumentValidation_1.default)({
                    parameterType: ArgumentValidation_1.EParameterType.FILES,
                    argumentName: "avatar",
                    argumentType: ArgumentValidation_1.EArgumentType.PICTURE,
                    isMiddleware: false,
                });
                isAvatarValid = isAvatarValidFunction(req, res, next);
                avatar = !isAvatarValid
                    ? null
                    : Array.isArray(req.files)
                        ? req.files[0].avatar
                        : req.files.avatar;
                _a = req.body, username = _a.username, password = _a.password, email = _a.email;
                return [4 /*yield*/, User_1.default.findOne({
                        "account.email": email,
                    })];
            case 1:
                user = _c.sent();
                if (user) {
                    throw new Error_1.default({
                        status: 409,
                        argumentName: "email",
                        argumentType: ArgumentValidation_1.EArgumentType.STRING,
                        parameterType: ArgumentValidation_1.EParameterType.BODY,
                        message: "Email non valide. Il y a déjà un compte associé à cette email.",
                    });
                }
                _b = (0, passwordProtection_1.default)(password), salt = _b.salt, hash = _b.hash, token = _b.token;
                randomString = (0, uid2_1.default)(128);
                return [4 /*yield*/, (0, email_1.default)(email, "Lien de vérification de l'email " + email, "Merci de cliquer sur le lien ci-dessous pour activer votre compte : \n" +
                        process.env.THIS_BACK_END_URL +
                        "/user/mailcheck/" +
                        randomString)];
            case 2:
                _c.sent();
                newUser = new User_1.default({
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
                if (!avatar) return [3 /*break*/, 4];
                folder = "/marvel/user/" + newUser._id;
                return [4 /*yield*/, (0, cloudinary_1.uploadPicture)(avatar, folder)];
            case 3:
                pictureDataObj = _c.sent();
                newUser.account.avatar = {
                    secure_url: pictureDataObj.secure_url,
                    public_id: pictureDataObj.public_id,
                };
                _c.label = 4;
            case 4: return [4 /*yield*/, newUser.save()];
            case 5:
                _c.sent();
                response = {
                    _id: newUser._id,
                    token: token,
                    account: newUser.account,
                };
                res.status(201).json(response);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _c.sent();
                if (error_1 instanceof Error_1.default) {
                    res.status(error_1.status).json(error_1);
                }
                else {
                    console.log(error_1);
                    res.status(500).json(error_1);
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post("/login", (0, argumentValidation_1.default)({
    parameterType: ArgumentValidation_1.EParameterType.BODY,
    argumentName: "password",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    stringOption: {
        mustBeStrongPassword: true,
    },
}), (0, argumentValidation_1.default)({
    parameterType: ArgumentValidation_1.EParameterType.BODY,
    argumentName: "email",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    stringOption: {
        mustBeEmail: true,
    },
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _id, _b, token, hash, salt, hashToVerify, response, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ "account.email": email })];
            case 1:
                user = _c.sent();
                if (!user) {
                    throw new Error_1.default({
                        status: 404,
                        argumentName: "email",
                        argumentType: ArgumentValidation_1.EArgumentType.STRING,
                        parameterType: ArgumentValidation_1.EParameterType.BODY,
                        message: "Impossible de se connecter au compte. Mauvais mail ou mot de passe.",
                    });
                }
                _id = user._id;
                _b = user.private, token = _b.token, hash = _b.hash, salt = _b.salt;
                hashToVerify = (0, passwordProtection_1.default)(password, salt).hash;
                if (hashToVerify !== hash) {
                    throw new Error_1.default({
                        status: 404,
                        argumentName: "email",
                        argumentType: ArgumentValidation_1.EArgumentType.STRING,
                        parameterType: ArgumentValidation_1.EParameterType.BODY,
                        message: "Impossible de se connecter au compte. Mauvais mail ou mot de passe.",
                    });
                }
                response = {
                    _id: _id,
                    token: token,
                    account: user.account,
                };
                res.status(200).json(response);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                if (error_2 instanceof Error_1.default) {
                    res.status(error_2.status).json(error_2);
                }
                else {
                    console.log(error_2);
                    res.status(500).json(error_2);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/mailcheck/:randomString", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var randomString, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                randomString = req.params.randomString;
                return [4 /*yield*/, User_1.default.findOne({ randomString: randomString })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error_1.default({
                        status: 404,
                        argumentName: "randomString",
                        argumentType: ArgumentValidation_1.EArgumentType.STRING,
                        parameterType: ArgumentValidation_1.EParameterType.BODY,
                        message: "Aucun utilisateur trouvé associé à ce token de vérification d'email.",
                    });
                }
                user.randomString = undefined;
                user.isActive = true;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(200).json({ message: "Email vérifié avec succès" });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                if (error_3 instanceof Error_1.default) {
                    res.status(error_3.status).json(error_3);
                }
                else {
                    console.log(error_3);
                    res.status(500).json(error_3);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/account", authentification_1.isAuthentificated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        try {
            user = req.user;
            if (!user) {
                throw new Error_1.default({
                    status: 500,
                    argumentName: "user",
                    message: "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant le controller.",
                });
            }
            res.status(200).json({
                account: user.account,
                active: user.isActive,
            });
        }
        catch (error) {
            if (error instanceof Error_1.default) {
                res.status(error.status).json(error);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
        return [2 /*return*/];
    });
}); });
router.patch("/account", authentification_1.isAuthentificated, (0, express_fileupload_1.default)(), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isUsernameValidFunction, isUsernameValid, isAvatarValidFunction, isAvatarValid, avatar, username, folder, arrayOfPromises, deletePromise, responseList, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = req.user;
                if (!user) {
                    throw new Error_1.default({
                        status: 500,
                        argumentName: "user",
                        message: "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant le controller.",
                    });
                }
                isUsernameValidFunction = (0, argumentValidation_1.default)({
                    parameterType: ArgumentValidation_1.EParameterType.BODY,
                    argumentName: "username",
                    argumentType: ArgumentValidation_1.EArgumentType.STRING,
                    isMiddleware: false,
                    stringOption: {
                        argumentMinLength: 2,
                    },
                });
                isUsernameValid = isUsernameValidFunction(req, res, next);
                isAvatarValidFunction = (0, argumentValidation_1.default)({
                    parameterType: ArgumentValidation_1.EParameterType.FILES,
                    argumentName: "avatar",
                    argumentType: ArgumentValidation_1.EArgumentType.PICTURE,
                    isMiddleware: false,
                });
                isAvatarValid = isAvatarValidFunction(req, res, next);
                avatar = !isAvatarValid
                    ? null
                    : Array.isArray(req.files)
                        ? req.files[0].avatar
                        : req.files.avatar;
                username = req.body.username;
                if (isUsernameValid) {
                    user.account.username = username;
                }
                if (!avatar) return [3 /*break*/, 2];
                folder = "/vinted/user/" + user._id;
                arrayOfPromises = [
                    (0, cloudinary_1.uploadPicture)(avatar, folder),
                ];
                // Delete
                if (user.account.avatar) {
                    deletePromise = (0, cloudinary_1.deletePicture)(user.account.avatar.public_id, folder);
                    arrayOfPromises.push(deletePromise);
                }
                return [4 /*yield*/, Promise.all(arrayOfPromises)];
            case 1:
                responseList = _a.sent();
                user.account.avatar = {
                    secure_url: responseList[0].secure_url,
                    public_id: responseList[0].public_id,
                };
                _a.label = 2;
            case 2: return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                res.status(200).json({
                    account: user.account,
                    isActive: user.isActive,
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                if (error_4 instanceof Error_1.default) {
                    res.status(error_4.status).json(error_4);
                }
                else {
                    console.log(error_4);
                    res.status(500).json(error_4);
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
