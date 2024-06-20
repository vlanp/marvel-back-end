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
var argumentValidation_1 = __importDefault(require("../middlewares/argumentValidation"));
var ArgumentValidation_1 = require("../interfaces/ArgumentValidation");
var axios_1 = __importDefault(require("axios"));
var Characters_1 = require("../interfaces/Characters");
var AboutACharacter_1 = require("../interfaces/AboutACharacter");
var router = express_1.default.Router();
router.get("/characters", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, limit, skip, name, isLimitValidFunction, isLimitValid, isSkipValidFunction, isSkipValid, isNameValidFunction, isNameValid, endpoint, url, response, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, limit = _a.limit, skip = _a.skip, name = _a.name;
                isLimitValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "limit",
                    argumentType: ArgumentValidation_1.EArgumentType.NUMBER,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    numberOption: {
                        argumentMinValue: 1,
                        argumentMaxValue: 100,
                        mustBeInteger: true,
                    },
                    isMiddleware: false,
                });
                isLimitValid = isLimitValidFunction(req, res, next);
                isSkipValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "skip",
                    argumentType: ArgumentValidation_1.EArgumentType.NUMBER,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    numberOption: {
                        mustBeInteger: true,
                    },
                    isMiddleware: false,
                });
                isSkipValid = isSkipValidFunction(req, res, next);
                isNameValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "name",
                    argumentType: ArgumentValidation_1.EArgumentType.STRING,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    isMiddleware: false,
                });
                isNameValid = isNameValidFunction(req, res, next);
                endpoint = "/characters";
                url = process.env.MARVEL_BASE_API_URL +
                    endpoint +
                    "?apiKey=" +
                    process.env.MARVEL_API_SECRET +
                    (isLimitValid ? "&limit=" + limit : "") +
                    (isSkipValid ? "&skip=" + skip : "") +
                    (isNameValid ? "&name=" + name : "");
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _b.sent();
                if (!(0, Characters_1.isCharacters)(response.data)) {
                    throw new Error("Unexpected response from marvel's API");
                }
                res.status(200).json(response.data);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/character/:characterid", (0, argumentValidation_1.default)({
    argumentName: "characterid",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    parameterType: ArgumentValidation_1.EParameterType.PARAMS,
    stringOption: {
        argumentMinLength: 1,
    },
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var characterid, endpoint, url, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                characterid = req.params.characterid;
                endpoint = "/character";
                url = process.env.MARVEL_BASE_API_URL +
                    endpoint +
                    "/" +
                    characterid +
                    "?apiKey=" +
                    process.env.MARVEL_API_SECRET;
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                if (!(0, AboutACharacter_1.isAboutACharacter)(response.data)) {
                    throw new Error("Unexpected response from marvel's API");
                }
                res.status(200).json(response.data);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/characters/:comicid", (0, argumentValidation_1.default)({
    argumentName: "comicid",
    argumentType: ArgumentValidation_1.EArgumentType.STRING,
    parameterType: ArgumentValidation_1.EParameterType.PARAMS,
    stringOption: {
        argumentMinLength: 1,
    },
}), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, _limit, url, response, count, nbRequest, arrayOfPromises, i, skip_1, newUrl, promiseResponse, responseList, characterList, isNameValidFunction, isNameValid, isLimitValidFunction, isLimitValid, isSkipValidFunction, isSkipValid, comicid_1, name, limit_1, skip_2, regex_1, filteredCharacterList, _count, characters, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                endpoint = "/characters";
                _limit = 100;
                url = process.env.MARVEL_BASE_API_URL +
                    endpoint +
                    "?apiKey=" +
                    process.env.MARVEL_API_SECRET +
                    "&limit=" +
                    _limit;
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                if (!(0, Characters_1.isCharacters)(response.data)) {
                    throw new Error("Unexpected response from marvel's API");
                }
                count = response.data.count;
                nbRequest = Math.ceil((count - 100) / _limit);
                arrayOfPromises = [];
                for (i = 1; i <= nbRequest; i++) {
                    skip_1 = 100 * i;
                    newUrl = url + "&skip=" + skip_1;
                    promiseResponse = axios_1.default.get(newUrl);
                    arrayOfPromises.push(promiseResponse);
                }
                return [4 /*yield*/, Promise.all(arrayOfPromises)];
            case 2:
                responseList = _a.sent();
                responseList.push(response);
                characterList = responseList.flatMap(function (response) { return response.data.results; });
                isNameValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "name",
                    argumentType: ArgumentValidation_1.EArgumentType.STRING,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    isMiddleware: false,
                });
                isNameValid = isNameValidFunction(req, res, next);
                isLimitValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "limit",
                    argumentType: ArgumentValidation_1.EArgumentType.NUMBER,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    numberOption: {
                        argumentMinValue: 1,
                        argumentMaxValue: 100,
                        mustBeInteger: true,
                    },
                    isMiddleware: false,
                });
                isLimitValid = isLimitValidFunction(req, res, next);
                isSkipValidFunction = (0, argumentValidation_1.default)({
                    argumentName: "skip",
                    argumentType: ArgumentValidation_1.EArgumentType.NUMBER,
                    parameterType: ArgumentValidation_1.EParameterType.QUERY,
                    numberOption: {
                        mustBeInteger: true,
                    },
                    isMiddleware: false,
                });
                isSkipValid = isSkipValidFunction(req, res, next);
                comicid_1 = req.params.comicid;
                name = req.query.name;
                limit_1 = Number(req.query.limit);
                skip_2 = Number(req.query.skip);
                regex_1 = isNameValid && new RegExp(name, "i");
                filteredCharacterList = characterList.filter(function (character) {
                    return (character.comics.includes(comicid_1) &&
                        (regex_1 ? regex_1.test(character.name) : true));
                });
                _count = filteredCharacterList.length;
                skip_2 = isSkipValid ? skip_2 : 0;
                limit_1 = isLimitValid ? limit_1 : 100;
                filteredCharacterList = filteredCharacterList.filter(function (_character, index) {
                    return index > skip_2 - 1 && index <= skip_2 - 1 + limit_1;
                });
                characters = {
                    count: _count,
                    limit: limit_1,
                    results: filteredCharacterList,
                };
                res.status(200).json(characters);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
