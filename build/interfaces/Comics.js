"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComics = void 0;
var isComics = function (value) {
    if (value.count || value.limit)
        return true;
    else
        return false;
};
exports.isComics = isComics;
