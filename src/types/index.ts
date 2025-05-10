// User Types
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'adult' | 'child';
  avatarUrl?: string;
}

// Expense Types
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  familyMemberId: string;
  isPlanned: boolean;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'food'
  | 'groceries'
  | 'housing'
  | 'transportation'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'shopping'
  | 'personal'
  | 'debt'
  | 'savings'
  | 'gifts'
  | 'other';

// Budget Types
export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Report Types
export interface ExpenseSummary {
  totalAmount: number;
  plannedAmount: number;
  unplannedAmount: number;
  byCategory: Record<ExpenseCategory, number>;
  byMember: Record<string, number>;
}

// AI Suggestion Types
export interface Suggestion {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  category?: ExpenseCategory;
  isImplemented: boolean;
  createdAt: Date;
}