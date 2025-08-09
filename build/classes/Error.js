"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CArgumentValidationError = /** @class */ (function (_super) {
    __extends(CArgumentValidationError, _super);
    function CArgumentValidationError(_a) {
        var status = _a.status, message = _a.message, parameterType = _a.parameterType, argumentName = _a.argumentName, argumentType = _a.argumentType;
        var _this = _super.call(this, message) || this;
        _this.name = "CArgumentValidationError";
        _this.status = status;
        if (parameterType) {
            _this.parameterType = parameterType;
        }
        _this.argumentName = argumentName;
        if (argumentType) {
            _this.argumentType = argumentType;
        }
        Object.setPrototypeOf(_this, CArgumentValidationError.prototype);
        return _this;
    }
    CArgumentValidationError.prototype.toJSON = function () {
        return {
            message: this.message,
            status: this.status,
            parameterType: this.parameterType,
            argumentName: this.argumentName,
            argumentType: this.argumentType,
        };
    };
    return CArgumentValidationError;
}(Error));
exports.default = CArgumentValidationError;
