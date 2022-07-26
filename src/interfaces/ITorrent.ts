export default interface ITorrent {
  name: string;
  magnet: string;
  uploader: string | null;
  size: string;
  date: string | Date;
  seed: string;
  leech: string;
  url: string | null;
  release_type: Array<string>;
}
