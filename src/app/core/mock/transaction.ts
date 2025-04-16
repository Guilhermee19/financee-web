// Enum para os tipos de transações
export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionStatus = 'PAID' | 'RECEIVED' | 'PENDING';

export type RecurrenceType = 'INSTALLLMENTS' | 'MONTHLY';

export interface Transaction {
  id: number;
  type: TransactionType;  // 'INCOME' ou 'EXPENSE'
  description: string;
  expiry_date: string;
  date_payment: string;
  url_receipt: string;
  status: TransactionStatus;  // 'PAID', 'RECEIVED', 'PENDING'
  recurrence: RecurrenceType;  // 'INSTALLMENTS'
  installment: number;
  value: number;
  card_id: number;
  category_id: number;
}

export interface Installment {
  id: number;
  installments: number;  // Número total de parcelas
  value: number;  // Valor total da transação
  transactions: number;  // ID da transação associada
}

export interface Card {
  id: number;
  name: string;
  limit: number;
  expiration_date: string;
  flag: string;  // 'MASTER_CARD', 'VISA'
  type: string;  // 'CREDIT', 'DEBIT', 'BOTH'
}

export interface Account {
  id: number;
  type: string;  // Tipo da conta, ex: 'Nubank'
  balance: number;  // Saldo da conta
  transactions: number[];  // IDs das transações associadas à conta
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;  // ID da categoria associada
  icon: string;
}

export const INSTALLMENT: Installment[] = [
  {
    id: 1,
    installments: 10,
    value: 2200,
    transactions: 1
  },
  {
    id: 2,
    installments: 5,
    value: 150,
    transactions: 2
  }
];

export const TRANSACTION: Transaction[] = [
  {
    id: 1,
    type: "EXPENSE",
    description: "Salary",
    expiry_date: "2025-04-05",
    date_payment: "2025-04-01",
    url_receipt: '',
    status: "PENDING",
    recurrence: "INSTALLLMENTS",
    installment: 1,
    value: 2200,
    card_id: 1,
    category_id: 1
  },
  {
    id: 2,
    type: "EXPENSE",
    description: "Online Streaming Subscription",
    expiry_date: "2025-04-10",
    date_payment: "2025-04-05",
    url_receipt: '',
    status: "PENDING",
    recurrence: "INSTALLLMENTS",
    installment: 1,
    value: 150,
    card_id: 1,
    category_id: 1
  }
];

export const CARD: Card[] = [
  {
    id: 1,
    name: "Nubank",
    limit: 1500,
    expiration_date: "2032-03-05",
    flag: "MASTER_CARD",
    type: "BOTH"
  }
];

export const ACCOUNT: Account[] = [
  {
    id: 1,
    type: "Nubank",
    balance: 0,
    transactions: [1, 2]
  }
];

export const CATEGORY: Category[] = [
  {
    id: 1,
    name: 'Lazer',
    icon: ''
  }
];

export const SUBCATEGORY: Subcategory[] = [
  {
    id: 1,
    name: 'Streming',
    icon: '',
    category_id: 1
  }
];
