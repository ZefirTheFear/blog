export enum ContentUnitTypes {
  text = "text",
  image = "image"
}

interface ITextContentUnit {
  id: string;
  type: ContentUnitTypes.text;
  content: string;
}

interface IImageContentUnitToGet {
  id: string;
  type: ContentUnitTypes.image;
  url: string;
  publicId: string;
}

export interface IImageContentUnitToSend {
  id: string;
  type: ContentUnitTypes.image;
  content: File;
  url: string;
}

export type ContentUnitToGet = ITextContentUnit | IImageContentUnitToGet;
export type ContentUnitToSend = ITextContentUnit | IImageContentUnitToSend;
