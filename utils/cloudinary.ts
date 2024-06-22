import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface Picture {
  mimetype: string;
  data: Buffer;
}

const uploadPicture = (picture: Picture | string, folder?: string) => {
  const convertToBase64 = (picture: Picture) => {
    return `data:${picture.mimetype};base64,${picture.data.toString("base64")}`;
  };
  picture = typeof picture !== "string" ? convertToBase64(picture) : picture;
  return cloudinary.uploader.upload(picture, { folder: folder });
};

const deletePicture = (publicId: string, folder: string) => {
  return cloudinary.uploader.destroy(publicId).then(() => {
    cloudinary.api.delete_folder(folder);
  });
};

export { uploadPicture, deletePicture };
