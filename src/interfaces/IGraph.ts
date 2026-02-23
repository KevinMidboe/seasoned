export enum GraphTypes {
  Plays = "plays",
  Duration = "duration"
}

export enum GraphValueTypes {
  Number = "number",
  Time = "time"
}

export interface IGraphDataset {
  name: string;
  data: number[];
}

export interface IGraphData {
  labels: string[];
  series: IGraphDataset[];
}

export interface IGraphResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  categories: Date[];
  series: Series[];
}

export interface Series {
  name: string;
  data: number[];
}
