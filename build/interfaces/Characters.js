"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCharacters = void 0;
var isCharacters = function (value) {
    if (value.count || value.limit)
        return true;
    else
        return false;
};
exports.isCharacters = isCharacters;
