/* eslint-disable no-use-before-define */

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
  data: Array<number>;
}

export interface IGraphData {
  labels: Array<string>;
  series: Array<IGraphDataset>;
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
