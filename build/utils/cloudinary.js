"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePicture = exports.uploadPicture = void 0;
var cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
var uploadPicture = function (picture, folder) {
    var convertToBase64 = function (picture) {
        return "data:".concat(picture.mimetype, ";base64,").concat(picture.data.toString("base64"));
    };
    picture = typeof picture !== "string" ? convertToBase64(picture) : picture;
    return cloudinary_1.v2.uploader.upload(picture, { folder: folder });
};
exports.uploadPicture = uploadPicture;
var deletePicture = function (publicId, folder) {
    return cloudinary_1.v2.uploader.destroy(publicId).then(function () {
        cloudinary_1.v2.api.delete_folder(folder);
    });
};
exports.deletePicture = deletePicture;
