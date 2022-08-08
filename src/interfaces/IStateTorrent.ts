import type ITorrent from "./ITorrent";

export default interface IStateTorrent {
  results: Array<ITorrent>;
  resultCount: number | null;
}
