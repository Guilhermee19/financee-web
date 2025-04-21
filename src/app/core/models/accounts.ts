import { ICard } from "./card";

export interface IAccount {
  id: number;
  cards: ICard[];
  created_at: string;
  updated_at: string;
  name: string;
  balance: string;
  created_by: number;
  updated_by: number;
  is_active: boolean
}
