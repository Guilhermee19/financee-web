import { ITransaction } from "./finance"

export interface ICategoryPercentages {
  name: string,
  percentage: number,
  total_spent: number,
}


export interface IDashbaord {
  balance: number,
  total_income: number,
  total_expenditure: number
}


export interface IDashbaord {
  balance: number,
  total_income: number,
  total_expenditure: number
}


export interface IDashbaordTransaction {
  overdue_unpaid: ITransaction[],
  upcoming: ITransaction[],
}
