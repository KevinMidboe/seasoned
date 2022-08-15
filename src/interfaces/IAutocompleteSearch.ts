/* eslint-disable no-use-before-define */
import { MediaTypes } from "./IList";

export interface IAutocompleteResult {
  title: string;
  id: number;
  adult: boolean;
  type: MediaTypes;
}

export interface IAutocompleteSearchResults {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: Total;
  max_score: null;
  hits: Hit[];
}

export interface Hit {
  _index: Index;
  _type: Type;
  _id: string;
  _score: number;
  _source: Source;
  sort: number[];
}

export enum Index {
  Movies = "movies",
  Shows = "shows"
}

export interface Source {
  tags: Tag[];
  ecs: Ecs;
  "@timestamp": Date;
  adult: boolean;
  input: Input;
  host: Host;
  "@version": string;
  popularity: number;
  log: Log;
  video: boolean;
  id: number;
  agent: Agent;
  original_title: string;
  original_name?: string;
}

export interface Agent {
  version: AgentVersion;
  ephemeral_id: string;
  id: string;
  hostname: HostnameEnum;
  type: AgentType;
}

export enum HostnameEnum {
  MACProLocal = "macPro.local"
}

export enum AgentType {
  Filebeat = "filebeat"
}

export enum AgentVersion {
  The700 = "7.0.0"
}

export interface Ecs {
  version: EcsVersion;
}

export enum EcsVersion {
  The100 = "1.0.0"
}

export interface Host {
  os: OS;
  name: HostnameEnum;
  id: ID;
  hostname: HostnameEnum;
  architecture: Architecture;
}

export enum Architecture {
  X8664 = "x86_64"
}

export enum ID {
  The30D157C386235739Aa1E30A9464Fa192 = "30D157C3-8623-5739-AA1E-30A9464FA192"
}

export interface OS {
  version: OSVersion;
  name: OSName;
  build: Build;
  family: Family;
  platform: Family;
  kernel: Kernel;
}

export enum Build {
  The18D109 = "18D109"
}

export enum Family {
  Darwin = "darwin"
}

export enum Kernel {
  The1820 = "18.2.0"
}

export enum OSName {
  MACOSX = "Mac OS X"
}

export enum OSVersion {
  The10143 = "10.14.3"
}

export interface Input {
  type: InputType;
}

export enum InputType {
  Log = "log"
}

export interface Log {
  offset: number;
  file: File;
}

export interface File {
  path: string;
}

export enum Tag {
  BeatsInputRawEvent = "beats_input_raw_event"
}

export enum Type {
  Doc = "_doc"
}

export interface Total {
  value: number;
  relation: string;
}
