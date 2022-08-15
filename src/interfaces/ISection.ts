import type { IList } from "./IList";

export default interface ISection {
  title: string;
  apiFunction: (page: number) => Promise<IList>;
}
