export interface IUser {
  id: number;
  last_login: string;
  profile_image: string;
  email: string;
  name: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  password?: string;
}

export interface IToken {
  token: string;
}


export type ILogin = Pick<IUser, 'email' | 'password'>;
export type IRegister = Pick<IUser, 'name' | 'email' | 'password'>;
