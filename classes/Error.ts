import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";

class CArgumentValidationError extends Error {
  override readonly name = "CArgumentValidationError";
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
    if (parameterType) {
      this.parameterType = parameterType;
    }
    this.argumentName = argumentName;
    if (argumentType) {
      this.argumentType = argumentType;
    }

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
