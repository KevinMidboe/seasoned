export interface IList {
  results: ListResults;
  page: number;
  total_results: number;
  total_pages: number;
}

export interface IMediaCredits {
  cast: Array<ICast>;
  crew: Array<ICrew>;
  id: number;
}

export interface IPersonCredits {
  cast: Array<IMovie | IShow>;
  crew: Array<ICrew>;
  id: number;
  type?: string;
}

export type MediaTypes = IMovie | IShow | IPerson | IRequest;
export type CreditTypes = ICast | ICrew;
export type ListResults = Array<MediaTypes>;

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
  popularity?: number;
  type: ListTypes.Movie;
}

export interface IShow {
  id: number;
  title: string;
  year: number;
  overview: string;
  poster: string;
  backdrop: string;
  seasons?: number;
  episodes?: number;
  popularity?: number;
  genres?: Array<string>;
  production_status?: string;
  runtime?: Array<number>;
  exists_in_plex?: boolean;
  type: ListTypes.Show;
}

export interface IPerson {
  id: number;
  name: string;
  poster: string;
  birthday: string | null;
  deathday: string | null;
  known_for_department: string;
  adult: boolean;
  type: ListTypes.Person;
}

export interface IRequest extends IMovie {
  requested_by: string;
  ip: string;
  status: string | RequestTypes;
  user_agent: string;
}

export interface ICast {
  character: string;
  gender: number;
  id: number;
  name: string;
  profile_path: string | null;
  type: string;
}

export interface ICrew {
  department: string;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: string | null;
  type: string;
}
