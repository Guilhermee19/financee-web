import { TRecurrence, TType } from "./finance";

export interface IPagedReq<T> {
  results: T[];
  count: number;
  next: string;
  previous: string;
}

export interface IFilter {
  return_all?: boolean;
  page?: number;
  year: number;
  month: number;
  account?: number;
  category?: number;
  status?: boolean;
  type?: TType;
  recurrence?: TRecurrence;
  order_by?: string;
  order_direction?: string;
}

export type TOrderBy = 'description' | 'account' | 'category' | 'value_installment' | 'is_paid' | 'expiry_date'


export interface IDialogActions {
  action: 'yes' | 'no';
}

export interface ConfirmModalData {
  title: string
  message: string
  confirmText: string
  cancelText: string
}
