export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  isEssential: boolean
}

export interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  justification: string | null
  categoryId: string
  category: Category
}

export interface CreditCard {
  id: string
  name: string
  bank: string
  creditLimit: number
  balance: number
  apr: number
  closingDay: number
  dueDay: number
  color: string
  createdAt: string
}
