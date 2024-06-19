"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAboutACharacter = void 0;
var isAboutACharacter = function (value) {
    if (value._id)
        return true;
    else
        return false;
};
exports.isAboutACharacter = isAboutACharacter;
