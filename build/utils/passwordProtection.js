"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
var uid2_1 = __importDefault(require("uid2"));
var hashPassword = function (password, salt) {
    var token = salt ? null : (0, uid2_1.default)(64);
    salt = salt ? salt : (0, uid2_1.default)(64);
    var hash = (0, sha256_1.default)(password + salt).toString(enc_base64_1.default);
    return { salt: salt, hash: hash, token: token };
};
exports.default = hashPassword;
