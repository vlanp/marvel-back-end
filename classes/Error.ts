class CArgumentValidationError extends Error {
  readonly status: number;
  readonly parameterType: string;
  readonly argumentName: string;
  readonly argumentType: string;
  constructor({
    status,
    message,
    parameterType,
    argumentName,
    argumentType,
  }: {
    status: number;
    message: string;
    parameterType: string;
    argumentName: string;
    argumentType: string;
  }) {
    super(message || "Argument Validation Error " + status);
    this.status = status;
    this.parameterType = parameterType;
    this.argumentName = argumentName;
    this.argumentType = argumentType;
  }
}

export default CArgumentValidationError;
