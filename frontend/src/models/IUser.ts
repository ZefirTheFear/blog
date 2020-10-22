enum UserStatus {
  user = "user",
  moderator = "moderator",
  admin = "admin"
}

export interface IUser {
  nickname: string;
  email: string;
  avatar: string;
  status: UserStatus;
}
