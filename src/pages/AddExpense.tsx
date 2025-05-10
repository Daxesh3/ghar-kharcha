import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, Clock, Check, X, Tag, User, Plus, ChevronDown, CheckCircle, Mic, Upload, Camera } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { Expense, ExpenseCategory } from '../types';
import { getCategoryIcon } from '../utils/icons';

interface ExpenseFormData {
    amount: number;
    description: string;
    category: ExpenseCategory;
    familyMemberId: string;
    date: string;
    isPlanned: boolean;
    isRecurring: boolean;
    recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    tags: string[];
}

const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'personal', label: 'Personal' },
    { value: 'debt', label: 'Debt' },
    { value: 'savings', label: 'Savings' },
    { value: 'gifts', label: 'Gifts' },
    { value: 'other', label: 'Other' },
];

const AddExpense: React.FC = () => {
    const navigate = useNavigate();
    const { addExpense, familyMembers } = useExpenses();
    const [isRecurring, setIsRecurring] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('food');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ExpenseFormData>({
        defaultValues: {
            amount: 0,
            description: '',
            category: 'food',
            familyMemberId: familyMembers.length > 0 ? familyMembers[0].id : '',
            date: format(new Date(), 'yyyy-MM-dd'),
            isPlanned: true,
            isRecurring: false,
            tags: [],
        },
    });

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            const newTags = [...tags, currentTag.trim()];
            setTags(newTags);
            setValue('tags', newTags);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        setValue('tags', newTags);
    };

    const onSubmit = async (data: ExpenseFormData) => {
        try {
            await addExpense({
                ...data,
                amount: Number(data.amount),
                date: new Date(data.date),
                tags: tags,
                category: selectedCategory,
            } as Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>);

            // Show success message
            reset();
            setTags([]);

            // Redirect to dashboard after a short delay to show success animation
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const CategoryIcon = getCategoryIcon(selectedCategory);

    return (
        <div className='max-w-2xl mx-auto py-6'>
            <div className='mb-6 flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-semibold text-gray-800'>Add Expense</h1>
                    <p className='text-gray-500 mt-1'>Record your spending with all the details</p>
                </div>
                <div className='flex items-center space-x-4'>
                    {/* Voice Recording Icon */}
                    <button type='button' className='p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600' title='Voice Recording'>
                        <Mic size={20} />
                    </button>

                    {/* Upload Icon */}
                    <button type='button' className='p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600' title='Upload'>
                        <Upload size={20} />
                    </button>

                    {/* Camera Icon */}
                    <button type='button' className='p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600' title='Camera'>
                        <Camera size={20} />
                    </button>
                </div>
            </div>

            <div className='card p-4'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Amount Field */}
                    <div>
                        <label htmlFor='amount' className='input-label'>
                            Amount
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <span className='text-gray-500 sm:text-sm'>₹</span>
                            </div>
                            <input
                                type='number'
                                id='amount'
                                step='0.01'
                                className={`input-field pl-7 ${errors.amount ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                                placeholder='0.00'
                                {...register('amount', {
                                    required: 'Amount is required',
                                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                                })}
                            />
                        </div>
                        {errors.amount && <p className='mt-1 text-sm text-error-500'>{errors.amount.message}</p>}
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor='description' className='input-label'>
                            Description
                        </label>
                        <input
                            type='text'
                            id='description'
                            className={`input-field ${errors.description ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                            placeholder='What was this expense for?'
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <p className='mt-1 text-sm text-error-500'>{errors.description.message}</p>}
                    </div>

                    {/* Category Field */}
                    <div>
                        <label htmlFor='category' className='input-label'>
                            Category
                        </label>
                        <div className='mt-1 grid grid-cols-2 md:grid-cols-3 gap-3'>
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category.value);
                                return (
                                    <button
                                        key={category.value}
                                        type='button'
                                        className={`flex items-center p-3 border rounded-lg transition-colors ${
                                            selectedCategory === category.value
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setSelectedCategory(category.value);
                                            setValue('category', category.value);
                                        }}
                                    >
                                        <Icon size={18} className='mr-2' />
                                        <span className='text-sm'>{category.label}</span>
                                        {selectedCategory === category.value && <CheckCircle size={16} className='ml-auto text-primary-600' />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Field */}
                    <div>
                        <label htmlFor='date' className='input-label'>
                            Date
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Calendar size={18} className='text-gray-500' />
                            </div>
                            <input type='date' id='date' className='input-field pl-10' {...register('date', { required: 'Date is required' })} />
                        </div>
                    </div>

                    {/* Family Member Field */}
                    <div>
                        <label htmlFor='familyMemberId' className='input-label'>
                            Family Member
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <User size={18} className='text-gray-500' />
                            </div>
                            <select id='familyMemberId' className='input-field pl-10 pr-10 appearance-none' {...register('familyMemberId')}>
                                {familyMembers.length > 0 ? (
                                    familyMembers.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value=''>Add family members first</option>
                                )}
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                <ChevronDown size={18} className='text-gray-500' />
                            </div>
                        </div>
                    </div>

                    {/* Planned vs Unplanned Toggle */}
                    <div>
                        <span className='input-label'>Expense Type</span>
                        <div className='mt-1 flex space-x-3'>
                            <label className='flex items-center'>
                                <Controller
                                    name='isPlanned'
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <input
                                                type='radio'
                                                className='hidden'
                                                {...field}
                                                checked={field.value === true}
                                                onChange={() => field.onChange(true)}
                                            />
                                            <div
                                                className={`flex items-center px-3 py-2 border rounded-lg ${
                                                    field.value
                                                        ? 'bg-success-500/10 border-success-500 text-success-500'
                                                        : 'bg-white border-gray-300 text-gray-500'
                                                }`}
                                            >
                                                <Check size={18} className='mr-2' />
                                                <span>Planned</span>
                                            </div>
                                        </>
                                    )}
                                />
                            </label>

                            <label className='flex items-center'>
                                <Controller
                                    name='isPlanned'
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <input
                                                type='radio'
                                                className='hidden'
                                                {...field}
                                                checked={field.value === false}
                                                onChange={() => field.onChange(false)}
                                            />
                                            <div
                                                className={`flex items-center px-3 py-2 border rounded-lg ${
                                                    !field.value
                                                        ? 'bg-warning-500/10 border-warning-500 text-warning-500'
                                                        : 'bg-white border-gray-300 text-gray-500'
                                                }`}
                                            >
                                                <X size={18} className='mr-2' />
                                                <span>Unplanned</span>
                                            </div>
                                        </>
                                    )}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div>
                        <div className='flex items-center'>
                            <label className='relative inline-flex items-center cursor-pointer'>
                                <Controller
                                    name='isRecurring'
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type='checkbox'
                                            className='sr-only peer'
                                            checked={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked);
                                                setIsRecurring(e.target.checked);
                                            }}
                                        />
                                    )}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                <span className='ml-3 text-sm font-medium text-gray-700'>Recurring Expense</span>
                            </label>
                        </div>

                        {isRecurring && (
                            <div className='mt-3'>
                                <label htmlFor='recurringFrequency' className='input-label'>
                                    Frequency
                                </label>
                                <div className='mt-1 relative rounded-md shadow-sm'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Clock size={18} className='text-gray-500' />
                                    </div>
                                    <select
                                        id='recurringFrequency'
                                        className='input-field pl-10 pr-10 appearance-none'
                                        {...register('recurringFrequency')}
                                    >
                                        <option value='daily'>Daily</option>
                                        <option value='weekly'>Weekly</option>
                                        <option value='monthly'>Monthly</option>
                                        <option value='yearly'>Yearly</option>
                                    </select>
                                    <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                        <ChevronDown size={18} className='text-gray-500' />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label htmlFor='tags' className='input-label'>
                            Tags
                        </label>
                        <div className='mt-1 flex items-center'>
                            <div className='relative rounded-md shadow-sm flex-1'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Tag size={18} className='text-gray-500' />
                                </div>
                                <input
                                    type='text'
                                    id='tags'
                                    className='input-field pl-10 pr-12'
                                    placeholder='Add tags (e.g. essentials, vacation)'
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type='button'
                                className='ml-2 p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100'
                                onClick={handleAddTag}
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {tags.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800'
                                    >
                                        {tag}
                                        <button
                                            type='button'
                                            className='ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 hover:text-primary-700 focus:outline-none'
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className='flex pt-2'>
                        <button type='submit' className='btn btn-primary w-full py-2.5'>
                            Save Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
