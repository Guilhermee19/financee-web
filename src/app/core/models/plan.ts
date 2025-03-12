export interface IPlan {
  id: number;
  title: string;
  monthly_price: number;
  annual_price: number;
  benefits: string;
  is_active: boolean;
  order: number;
}
