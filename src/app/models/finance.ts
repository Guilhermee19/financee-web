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

// export interface Installment {
//   created_at: string;
//   created_by: number;
//   current_installment: number;
//   total_installments: number;
//   due_date: string;
//   transaction: number;
//   id: number;
//   receipt: string
//   value: number;
//   is_paid: boolean;
//   updated_at: string;
//   updated_by: number;
//   account: number;
//   account_obj?: Account;
//   category: number;
//   category_obj?: ICategory;
//   type: 'INCOME' | 'EXPENDITURE' | 'TRANSFER'
// }

export interface ITransaction {
  id: number;
  created_at: string;
  created_by: number;
  expiry_date: string;
  description: string;
  current_installment: number;
  installments: number;
  updated_at: string;
  updated_by: number;
  value: number;
  value_installment: number;
  is_paid: boolean;
  account: number;
  account_obj?: Account;
  category: number;
  category_obj?: ICategory;
  receipt: string
  type: 'INCOME' | 'EXPENDITURE' | 'TRANSFER'
  recurrence: 'SINGLE' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'INSTALLMENTS'
}
