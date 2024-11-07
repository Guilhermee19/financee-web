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
}

export interface IDialogActions {
  action: 'yes' | 'no';
}
