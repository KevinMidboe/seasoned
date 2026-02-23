import type ITorrent from "./ITorrent";

export default interface IStateTorrent {
  results: ITorrent[];
  resultCount: number | null;
}
