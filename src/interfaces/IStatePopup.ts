import type { MediaTypes } from "./IList";

export interface IStatePopup {
  id: number;
  type: MediaTypes;
  open: boolean;
}

export interface IPopupQuery {
  movie?: number | string;
  show?: number | string;
  person?: number | string;
}
