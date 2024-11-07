export interface TransactionSummaryExpenditure {
  day: number;
  value: number;
  value_total: number;
  type: string;
  }

  export interface TransactionSummaryIncome {
  day: number;
  value: number;
  value_total: number;
  type: string;
  }

export interface IDashbaord {
  total_day_income: number;
  total_day_expenditure: number;
  total_month_income: number;
  total_month_expenditure: number;
  transaction_summary_expenditure: TransactionSummaryExpenditure[];
  transaction_summary_income: TransactionSummaryIncome[];
}

