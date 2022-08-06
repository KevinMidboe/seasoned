export default interface IErrorMessage {
  title: string;
  message: string;
  type: "error" | "success" | "warning";
}
