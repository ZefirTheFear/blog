import { check } from "express-validator";

export const addOrEditPostValidation = [
  check("title")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("from 1 to 50 symbols"),
  check("contentOrder").custom((value) => {
    const content = JSON.parse(value);
    if (content.length < 1 || content.length > 8) {
      throw new Error("from 1 to 8 content units");
    }
    return true;
  }),
  check("tags").custom((value) => {
    const tags = JSON.parse(value);
    if (tags.length < 1 || tags.length > 8) {
      throw new Error("from 1 to 8 tags");
    }
    for (const tag of tags) {
      if (tag.length > 40) {
        throw new Error("from 1 to 40 symbols in tag");
      }
    }
    return true;
  })
];
