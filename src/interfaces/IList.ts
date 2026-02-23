export enum MediaTypes {
  Movie = "movie",
  Show = "show",
  Person = "person"
}

export enum RequestTypes {
  Requested = "requested"
}

export enum MovieGenres {
  Action = "Action",
  Adventure = "Adventure",
  Animation = "Animation",
  Comedy = "Comedy",
  Crime = "Crime",
  Documentary = "Documentary",
  Drama = "Drama",
  Family = "Family",
  Fantasy = "Fantasy",
  History = "History",
  Horror = "Horror",
  Music = "Music",
  Mystery = "Mystery",
  Romance = "Romance",
  Science_Fiction = "Science Fiction",
  TV_Movie = "TV Movie",
  Thriller = "Thriller",
  War = "War",
  Western = "Western"
}

export enum MovieProductionStatus {
  Rumored = "Rumored",
  Planned = "Planned",
  In_Production = "In Production",
  Post_Production = "Post Production",
  Released = "Released",
  Canceled = "Canceled"
}

export enum ShowGenres {
  Action_Adventure = "Action & Adventure",
  Animation = "Animation",
  Comedy = "Comedy",
  Crime = "Crime",
  Documentary = "Documentary",
  Drama = "Drama",
  Family = "Family",
  Kids = "Kids",
  Mystery = "Mystery",
  News = "News",
  Reality = "Reality",
  SciFi_Fantasy = "Sci-Fi & Fantasy",
  Soap = "Soap",
  Talk = "Talk",
  War_Politics = "War & Politics",
  Western = "Western"
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
  genres: MovieGenres[];
  production_status: MovieProductionStatus;
  tagline: string;
  runtime: number;
  popularity?: number;
  imdb_db: string;
  exists_in_plex?: boolean;
  type: MediaTypes.Movie;
}

export interface IShow {
  id: number;
  title: string;
  year: number;
  overview: string;
  tagline?: string;
  poster: string;
  backdrop: string;
  seasons?: number;
  episodes?: number;
  popularity?: number;
  genres?: ShowGenres[];
  production_status?: string;
  runtime?: number[];
  exists_in_plex?: boolean;
  type: MediaTypes.Show;
}

export interface IPerson {
  id: number;
  name: string;
  poster: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth?: string;
  biography?: string;
  known_for_department: string;
  adult: boolean;
  type: MediaTypes.Person;
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

export interface IMediaCredits {
  cast: ICast[];
  crew: ICrew[];
  id: number;
}

export interface IPersonCredits {
  cast: (IMovie | IShow)[];
  crew: ICrew[];
  id: number;
  type?: string;
}

export type ListResults = (IMovie | IShow | IPerson | IRequest)[];

export interface IList {
  results: ListResults;
  page: number;
  total_results: number;
  total_pages: number;
}
