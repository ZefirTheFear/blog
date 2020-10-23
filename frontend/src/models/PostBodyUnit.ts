enum PostBodyUnitTypes {
  text = "text",
  image = "image"
}

interface ITextPostBodyUnit {
  type: PostBodyUnitTypes.text;
  content: string;
}
interface IImagePostBodyUnit {
  type: PostBodyUnitTypes.image;
  url: string;
  publicId: string;
}

export type PostBodyUnit = ITextPostBodyUnit | IImagePostBodyUnit;
