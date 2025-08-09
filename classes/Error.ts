import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";

class CArgumentValidationError extends Error {
  readonly name = "CArgumentValidationError";
  readonly status: number;
  readonly parameterType?: EParameterType;
  readonly argumentName: string;
  readonly argumentType?: EArgumentType;
  constructor({
    status,
    message,
    parameterType,
    argumentName,
    argumentType,
  }: {
    status: number;
    message: string;
    parameterType?: EParameterType;
    argumentName: string;
    argumentType?: EArgumentType;
  }) {
    super(message);
    this.status = status;
    this.parameterType = parameterType;
    this.argumentName = argumentName;
    this.argumentType = argumentType;

    Object.setPrototypeOf(this, CArgumentValidationError.prototype);
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      parameterType: this.parameterType,
      argumentName: this.argumentName,
      argumentType: this.argumentType,
    };
  }
}

export default CArgumentValidationError;
