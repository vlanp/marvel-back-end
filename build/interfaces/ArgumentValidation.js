"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EParameterType = exports.EArgumentType = void 0;
var EParameterType;
(function (EParameterType) {
    EParameterType["BODY"] = "body";
    EParameterType["QUERY"] = "query";
    EParameterType["PARAMS"] = "params";
    EParameterType["FILES"] = "files";
})(EParameterType || (exports.EParameterType = EParameterType = {}));
var EArgumentType;
(function (EArgumentType) {
    EArgumentType["STRING"] = "string";
    EArgumentType["NUMBER"] = "number";
    EArgumentType["PICTURE"] = "picture";
    EArgumentType["BOOLEAN"] = "boolean";
})(EArgumentType || (exports.EArgumentType = EArgumentType = {}));
