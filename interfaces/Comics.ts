import IThumbnail from "./Thumbnail";

/** Get a list of comics Route: /comics */
interface IComics {
  count: number;
  limit: number;
  results: Array<IComicResult>;
}

interface IComicResult {
  thumbnail: IComicThumbnail;
  _id: string;
  title: string;
  description: string;
  __v: number;
}

interface IComicThumbnail extends IThumbnail {}

const isComics = (value: unknown) => {
  if ((value as IComics).count || (value as IComics).limit) return true;
  else return false;
};

export default IComics;
export type { IComicResult, IComicThumbnail };
export { isComics };
