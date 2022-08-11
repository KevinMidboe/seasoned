export enum ErrorMessageTypes {
  Error = "error",
  Success = "success",
  Warning = "warning"
}

export interface IErrorMessage {
  id: string;
  title: string;
  message: string;
  type: ErrorMessageTypes;
}
