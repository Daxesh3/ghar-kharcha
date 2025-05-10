import React, { useState } from 'react';
import { Expense } from '../types';

interface EditExpenseModalProps {
    expense: Expense;
    onClose: () => void;
    onSave: (updatedExpense: Expense) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onClose, onSave }) => {
    const [updatedExpense, setUpdatedExpense] = useState<Expense>(expense);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedExpense((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleSave = () => {
        onSave(updatedExpense);
    };

    return (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
                <h3 className='text-lg font-semibold mb-4'>Edit Expense</h3>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Description</label>
                        <input
                            type='text'
                            name='description'
                            value={updatedExpense.description}
                            onChange={handleChange}
                            className='input-field mt-1'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Amount</label>
                        <input type='number' name='amount' value={updatedExpense.amount} onChange={handleChange} className='input-field mt-1' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Category</label>
                        <select name='category' value={updatedExpense.category} onChange={handleChange} className='input-field mt-1'>
                            {/* Replace with dynamic categories if needed */}
                            <option value='food'>Food</option>
                            <option value='transportation'>Transportation</option>
                            <option value='housing'>Housing</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                </div>
                <div className='mt-6 flex justify-end space-x-4'>
                    <button onClick={onClose} className='btn-secondary'>
                        Cancel
                    </button>
                    <button onClick={handleSave} className='btn-primary'>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditExpenseModal;
