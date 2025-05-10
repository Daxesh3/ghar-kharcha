import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Budget } from '../types';
import BudgetModal from '../components/BudgetModal';

const Budgets: React.FC = () => {
    const { budgets, addBudget, updateBudget } = useExpenses();
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddBudget = () => {
        setSelectedBudget(null); // Clear selection for adding a new budget
        setIsModalOpen(true);
    };

    const handleEditBudget = (budget: Budget) => {
        setSelectedBudget(budget); // Set the selected budget for editing
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBudget(null);
    };

    const handleSaveBudget = async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (selectedBudget) {
            // Update existing budget
            await updateBudget(selectedBudget.id, budget);
        } else {
            // Add new budget
            await addBudget(budget);
        }
        handleCloseModal();
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>Budgets</h1>
                <button onClick={handleAddBudget} className='btn-primary'>
                    Add Budget
                </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {budgets.map((budget) => (
                    <div key={budget.id} className='card p-4'>
                        <h3 className='text-lg font-semibold'>{budget.category}</h3>
                        <p className='text-sm text-gray-500'>Amount: ₹{budget.amount.toLocaleString()}</p>
                        <p className='text-sm text-gray-500'>
                            Period: {budget.startDate.toLocaleDateString()} - {budget.endDate?.toLocaleDateString() || 'Ongoing'}
                        </p>
                        <button onClick={() => handleEditBudget(budget)} className='text-sm text-primary-600 hover:underline mt-2'>
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && <BudgetModal budget={selectedBudget} onClose={handleCloseModal} onSave={handleSaveBudget} />}
        </div>
    );
};

export default Budgets;
