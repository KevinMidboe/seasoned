export interface IList {
  results: Array<IMovie | IShow | IPerson | IRequest>;
  page: number;
  total_results: number;
  total_pages: number;
}

export enum ListTypes {
  Movie = "movie",
  Show = "show",
  Person = "person",
  Request = "request"
}

export enum RequestTypes {
  Requested = "requested"
}

export interface IMovie {
  id: number;
  title: string;
  year: number;
  overview: string;
  poster: string;
  backdrop: string;
  release_date: string | Date;
  rating: number;
  type: ListTypes.Movie;
}

export interface IShow {
  id: number;
  title: string;
  year: number;
  overview: string;
  poster: string;
  backdrop: string;
  type: ListTypes.Show;
}

export interface IPerson {
  id: number;
  title: string;
  poster: string;
  birthday: string | null;
  deathday: string | null;
  known_for_department: string;
  adult: boolean;
}

export interface IRequest extends IMovie {
  requested_by: string;
  ip: string;
  status: string | RequestTypes;
  user_agent: string;
}
