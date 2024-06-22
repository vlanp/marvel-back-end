import SHA256 from "crypto-js/sha256";
import encBase64 from "crypto-js/enc-base64";
import uid2 from "uid2";

const hashPassword = (password: string, salt?: string) => {
  const token = salt ? null : uid2(64);
  salt = salt ? salt : uid2(64);
  const hash = SHA256(password + salt).toString(encBase64);
  return { salt: salt, hash: hash, token: token };
};

export default hashPassword;
