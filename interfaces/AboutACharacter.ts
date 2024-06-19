import { ICharacterResult } from "./Characters";

/** Get a the infos of a specific character Route : /character/:characterId */
interface IAboutACharacter extends ICharacterResult {}

const isAboutACharacter = (value: unknown) => {
  if ((value as IAboutACharacter)._id) return true;
  else return false;
};

export default IAboutACharacter;
export { isAboutACharacter };
