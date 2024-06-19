"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComicsWithCharacter = void 0;
var isComicsWithCharacter = function (value) {
    if (value.thumbnail)
        return true;
    else
        return false;
};
exports.isComicsWithCharacter = isComicsWithCharacter;
