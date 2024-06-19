import IThumbnail from "./Thumbnail";

/** Get a list of characters Route : /characters */
interface ICharacters {
  count: number;
  limit: number;
  result: Array<ICharacterResult>;
}

interface ICharacterResult {
  thumbnail: ICharacterThumbnail;
  comics: Array<string>;
  _id: string;
  name: string;
  description: string;
  __v: number;
}

interface ICharacterThumbnail extends IThumbnail {}

const isCharacters = (value: unknown) => {
  if ((value as ICharacters).count || (value as ICharacters).limit) return true;
  else return false;
};

export default ICharacters;
export type { ICharacterResult, ICharacterThumbnail };
export { isCharacters };
