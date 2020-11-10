import fs from "fs";
// import path from "path";

export const deleteImage = (filePath: string): void => {
  // filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
