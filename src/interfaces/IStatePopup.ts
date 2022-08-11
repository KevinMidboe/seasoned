import type { MediaTypes } from "./IList";
// export enum PopupTypes {
//   Movie = "movie",
//   Show = "show",
//   Person = "person"
// }

// export interface IPopupOpen {
//   id: string | number;
//   type: PopupTypes;
// }

export interface IStatePopup {
  id: number;
  type: MediaTypes;
  open: boolean;
}
