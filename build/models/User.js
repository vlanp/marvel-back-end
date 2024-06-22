"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
var userSchema = new mongoose_1.Schema({
    account: {
        email: { type: String, required: true },
        username: { type: String, required: true },
        avatar: String,
    },
    private: {
        token: { type: String, required: true },
        hash: { type: String, required: true },
        salt: { type: String, required: true },
    },
    isActive: {
        type: Boolean,
        default: false, // Permet de gérer la vérification de l'email
    },
    randomString: String,
});
// 3. Create a Model
var User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
