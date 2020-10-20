import cloneDeep from "clone-deep";

interface IValidationError {
  msg: string;
  param: string;
}

interface IInputErrors {
  [key: string]: string[];
}

export const convertInputErrors = (errors: IValidationError[]) => {
  const convertedErrors: IInputErrors = {};
  errors.forEach((error) => {
    if (convertedErrors[error.param]) {
      const oldMsgs = cloneDeep(convertedErrors[error.param]);
      convertedErrors[error.param] = [...oldMsgs, error.msg];
    } else {
      convertedErrors[error.param] = [error.msg];
    }
  });
  return convertedErrors;
};
