enum UserStatus {
  user = "user",
  moderator = "moderator",
  admin = "admin"
}

export interface IUser {
  _id: string;
  nickname: string;
  email: string;
  avatar: { url: string; publicId: string };
  status: UserStatus;
}
