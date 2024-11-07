export interface IUser {
  id: number;
  last_login: any;
  profile_image: string;
  email: string;
  name: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface IToken {
  token: string;
}
