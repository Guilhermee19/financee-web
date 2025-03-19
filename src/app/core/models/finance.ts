import { ICategory } from "./category";

export interface Account {
  id: number;
  name: string;
  balance_debit: string;
  balance_credit: string;
  credit_limit: string;
  credit_due_date: string;
  is_debit: boolean;
  is_credit: boolean;
}

export interface ITransaction {
  id: number;
  created_at: string;
  created_by: number;
  expiry_date: string;
  description: string;
  current_installment: number;
  installments: number;
  updated_at: string;
  date_payment: string;
  updated_by: number;
  value: number;
  value_installment: number;
  is_paid: boolean;
  account: number;
  account_obj?: Account;
  category: number;
  category_obj?: ICategory;
  receipt: string
  type: TType
  recurrence: TRecurrence
}

export type TType = 'INCOME' | 'EXPENDITURE' | 'TRANSFER'

export type TRecurrence = 'SINGLE' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'INSTALLMENTS'
