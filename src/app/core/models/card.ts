export interface ICard {
  id: number;
  card_type: string;
  number: string;
  expiration_date: string;
  cardholder_name: string;
  is_active: boolean;
  credit_due_date: string;
  balance_credit: string;
  card_limit: string;
  account: number;
}
