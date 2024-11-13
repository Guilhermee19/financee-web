export interface ICategoryPercentages {
  name: string,
  percentage: number,
  total_spent: number,
}


export interface IDashbaord {
  balance: number,
  total_income: number,
  total_expenditure: number,
  category_percentages: ICategoryPercentages[]
}

