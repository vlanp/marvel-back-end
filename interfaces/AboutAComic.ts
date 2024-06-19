import { IComicResult } from "./Comics";

/** Get all informations of specific comic Route : /comic/:comicId */
interface IAboutAComic extends IComicResult {}

const isAboutAComic = (value: unknown) => {
  if ((value as IAboutAComic)._id) return true;
  else return false;
};

export default IAboutAComic;
export { isAboutAComic };
