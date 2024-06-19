"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAboutAComic = void 0;
var isAboutAComic = function (value) {
    if (value._id)
        return true;
    else
        return false;
};
exports.isAboutAComic = isAboutAComic;
