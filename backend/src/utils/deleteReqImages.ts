import fs from "fs";

export const deleteReqImages = (req: Express.Request): void => {
  const images = req.files as Express.Multer.File[];
  if (images.length > 0) {
    for (const image of images) {
      fs.unlink(image.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
};
