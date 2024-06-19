interface IArgumentValidation<NewArgType> {
  parameterType: EParameterType;
  argumentName: string;
  argumentType: EArgumentType;
  stringOption?: IStringOption<NewArgType>;
  numberOption?: INumberOption;
  isMiddleware?: boolean;
}

enum EParameterType {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
  FILES = "files",
}

enum EArgumentType {
  STRING = "string",
  NUMBER = "number",
  PICTURE = "picture",
  BOOLEAN = "boolean",
}

interface IStringOption<NewArgType> {
  argumentMinLength?: number;
  argumentMaxLength?: number;
  mustBeStrongPassword?: boolean;
  mustBeEmail?: boolean;
  /** For example argumentTransformObj: { "price-asc": 1, "price-desc": -1 } will transform the argument into 1 if it is equal to "price-asc" and transform it into -1 if it is equal to "price-desc" */
  argumentTransformObj?: { [key: string]: NewArgType };
}

interface INumberOption {
  argumentMinValue?: number;
  argumentMaxValue?: number;
  mustBeInteger?: boolean;
}

export default IArgumentValidation;
export { EArgumentType, EParameterType };
export type { IStringOption, INumberOption };
