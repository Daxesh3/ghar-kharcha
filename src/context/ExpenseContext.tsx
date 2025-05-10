import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { Expense, ExpenseCategory, ExpenseSummary, FamilyMember, Budget } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  familyMembers: FamilyMember[];
  budgets: Budget[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  updateFamilyMember: (id: string, member: Partial<Omit<FamilyMember, 'id'>>) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getExpenseSummary: (startDate: Date, endDate: Date) => Promise<ExpenseSummary>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setFamilyMembers([]);
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date.toDate(),
          familyMemberId: data.familyMemberId,
          isPlanned: data.isPlanned,
          isRecurring: data.isRecurring,
          recurringFrequency: data.recurringFrequency,
          tags: data.tags || [],
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Expense;
      });
      setExpenses(expensesData);
    });

    const familyQuery = query(
      collection(db, 'familyMembers'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeFamily = onSnapshot(familyQuery, (snapshot) => {
      const familyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as FamilyMember[];
      setFamilyMembers(familyData);
    });

    const budgetsQuery = query(
      collection(db, 'budgets'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
      const budgetsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data.category,
          amount: data.amount,
          period: data.period,
          startDate: data.startDate.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Budget;
      });
      setBudgets(budgetsData);
      setLoading(false);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeFamily();
      unsubscribeBudgets();
    };
  }, [currentUser]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    const now = Timestamp.now();
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      userId: currentUser.uid,
      date: Timestamp.fromDate(expense.date),
      createdAt: now,
      updatedAt: now
    });
  };

  const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const expenseRef = doc(db, 'expenses', id);
    const updates: any = { ...expense, updatedAt: Timestamp.now() };
    
    // Convert Date objects to Timestamps
    if (expense.date) {
      updates.date = Timestamp.fromDate(expense.date);
    }
    
    await updateDoc(expenseRef, updates);
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  const addFamilyMember = async (member: Omit<FamilyMember, 'id'>) => {
    if (!currentUser) return;

    await addDoc(collection(db, 'familyMembers'), {
      ...member,
      userId: currentUser.uid
    });
  };

  const updateFamilyMember = async (id: string, member: Partial<Omit<FamilyMember, 'id'>>) => {
    const memberRef = doc(db, 'familyMembers', id);
    await updateDoc(memberRef, member);
  };

  const deleteFamilyMember = async (id: string) => {
    await deleteDoc(doc(db, 'familyMembers', id));
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    const now = Timestamp.now();
    await addDoc(collection(db, 'budgets'), {
      ...budget,
      userId: currentUser.uid,
      startDate: Timestamp.fromDate(budget.startDate),
      endDate: budget.endDate ? Timestamp.fromDate(budget.endDate) : null,
      createdAt: now,
      updatedAt: now
    });
  };

  const updateBudget = async (id: string, budget: Partial<Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const budgetRef = doc(db, 'budgets', id);
    const updates: any = { ...budget, updatedAt: Timestamp.now() };
    
    // Convert Date objects to Timestamps
    if (budget.startDate) {
      updates.startDate = Timestamp.fromDate(budget.startDate);
    }
    if (budget.endDate) {
      updates.endDate = Timestamp.fromDate(budget.endDate);
    }
    
    await updateDoc(budgetRef, updates);
  };

  const deleteBudget = async (id: string) => {
    await deleteDoc(doc(db, 'budgets', id));
  };

  const getExpenseSummary = async (startDate: Date, endDate: Date): Promise<ExpenseSummary> => {
    if (!currentUser) {
      return {
        totalAmount: 0,
        plannedAmount: 0,
        unplannedAmount: 0,
        byCategory: {} as Record<ExpenseCategory, number>,
        byMember: {}
      };
    }

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    const snapshot = await getDocs(expensesQuery);
    
    let totalAmount = 0;
    let plannedAmount = 0;
    let unplannedAmount = 0;
    const byCategory: Record<string, number> = {};
    const byMember: Record<string, number> = {};

    snapshot.docs.forEach(doc => {
      const expense = doc.data();
      const amount = expense.amount;
      
      totalAmount += amount;
      
      if (expense.isPlanned) {
        plannedAmount += amount;
      } else {
        unplannedAmount += amount;
      }
      
      // By category
      if (byCategory[expense.category]) {
        byCategory[expense.category] += amount;
      } else {
        byCategory[expense.category] = amount;
      }
      
      // By family member
      if (byMember[expense.familyMemberId]) {
        byMember[expense.familyMemberId] += amount;
      } else {
        byMember[expense.familyMemberId] = amount;
      }
    });

    return {
      totalAmount,
      plannedAmount,
      unplannedAmount,
      byCategory: byCategory as Record<ExpenseCategory, number>,
      byMember
    };
  };

  const value = {
    expenses,
    familyMembers,
    budgets,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addBudget,
    updateBudget,
    deleteBudget,
    getExpenseSummary
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};