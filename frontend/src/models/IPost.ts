import { ContentUnitToGet } from "./ContentUnit";
import { IUser } from "./IUser";

export interface IPost {
  _id: string;
  title: string;
  body: ContentUnitToGet[];
  tags: string[];
  creator: IUser;
  createdAt: string;
}
