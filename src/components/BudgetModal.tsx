import React, { useState } from 'react';
import { Budget } from '../types';

interface BudgetModalProps {
    budget: Budget | null;
    onClose: () => void;
    onSave: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ budget, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>>({
        category: budget?.category || '',
        amount: budget?.amount || 0,
        period: budget?.period || 'monthly',
        startDate: budget?.startDate || new Date(),
        endDate: budget?.endDate || null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: new Date(value),
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
                <h3 className='text-lg font-semibold mb-4'>{budget ? 'Edit Budget' : 'Add Budget'}</h3>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Category</label>
                        <input type='text' name='category' value={formData.category} onChange={handleChange} className='input-field mt-1' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Amount</label>
                        <input type='number' name='amount' value={formData.amount} onChange={handleChange} className='input-field mt-1' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Period</label>
                        <select name='period' value={formData.period} onChange={handleChange} className='input-field mt-1'>
                            <option value='monthly'>Monthly</option>
                            <option value='yearly'>Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                        <input
                            type='date'
                            name='startDate'
                            value={formData.startDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            className='input-field mt-1'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>End Date</label>
                        <input
                            type='date'
                            name='endDate'
                            value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                            onChange={handleDateChange}
                            className='input-field mt-1'
                        />
                    </div>
                </div>
                <div className='mt-6 flex justify-end space-x-4'>
                    <button onClick={onClose} className='btn-secondary'>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className='btn-primary'>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetModal;
