import React from 'react';
import { format } from 'date-fns';
import { Expense } from '../types';
import { getCategoryIcon } from '../utils/icons';

interface ExpensesListProps {
  expenses: Expense[];
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No expenses found. Add your first expense!</p>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {expenses.map((expense) => {
        const CategoryIcon = getCategoryIcon(expense.category);
        
        return (
          <div key={expense.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${expense.isPlanned ? 'bg-success-500/10' : 'bg-warning-500/10'}`}>
                <CategoryIcon size={18} className={expense.isPlanned ? 'text-success-500' : 'text-warning-500'} />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800">{expense.description}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <span className="capitalize">{expense.category}</span>
                  <span className="mx-1">•</span>
                  <span>{format(expense.date, 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-medium text-gray-800">₹{expense.amount.toLocaleString()}</span>
              <div className="text-xs mt-0.5">
                <span className={`px-1.5 py-0.5 rounded-full ${
                  expense.isPlanned ? 'bg-success-500/10 text-success-500' : 'bg-warning-500/10 text-warning-500'
                }`}>
                  {expense.isPlanned ? 'Planned' : 'Unplanned'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpensesList;