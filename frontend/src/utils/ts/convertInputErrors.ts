import cloneDeep from "clone-deep";

import { IValidationError } from "../../models/IValidationError";

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
