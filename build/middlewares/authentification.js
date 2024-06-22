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
exports.isAccountActive = exports.isAuthentificated = void 0;
var Error_1 = __importDefault(require("../classes/Error"));
var User_1 = __importDefault(require("../models/User"));
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
var isAuthentificated = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.headers || !req.headers.authorization) {
                    throw new Error_1.default({
                        status: 401,
                        argumentName: "authorization",
                        message: "Aucun token d'accès transmis. Accès non autorisé",
                    });
                }
                token = req.headers.authorization.replace("Bearer ", "");
                return [4 /*yield*/, User_1.default.findOne({
                        token: token,
                    }).select("account isActive")];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error_1.default({
                        status: 401,
                        argumentName: "authorization",
                        message: "Aucun utilisateur ne correspond au token d'accès transmis. Accès non autorisé",
                    });
                }
                req.user = {
                    account: user.account,
                    isActive: user.isActive,
                    _id: user.id,
                };
                return [2 /*return*/, next()];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof Error_1.default) {
                    res.status(error_1.status).json(error_1);
                }
                else {
                    console.log(error_1);
                    res.status(500).json(error_1);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isAuthentificated = isAuthentificated;
var isAccountActive = function (req, res, next) {
    try {
        var user = req.user;
        if (!user) {
            throw new Error_1.default({
                status: 500,
                argumentName: "user",
                message: "La clé user n'existe pas dans la requête. Utiliser le middleware isAuthentificated avant isAccountActive.",
            });
        }
        if (!user.isActive) {
            throw new Error_1.default({
                status: 401,
                argumentName: "isActive",
                message: "L'adresse email doit être vérifiée. Accès non authorisé",
            });
        }
        return next();
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
};
exports.isAccountActive = isAccountActive;
