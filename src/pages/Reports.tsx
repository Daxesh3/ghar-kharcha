import React, { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Filter, Download, CalendarDays, ChevronDown } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Expense, ExpenseCategory } from '../types';
import { getCategoryColor } from '../utils/icons';
import ExpensesList from '../components/ExpensesList';
import EditExpenseModal from '../components/EditExpenseModal';

const Reports: React.FC = () => {
    const { expenses, familyMembers, updateExpense } = useExpenses();
    const [period, setPeriod] = useState<'month' | 'year'>('month');
    const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
    const [filterMember, setFilterMember] = useState<string | 'all'>('all');
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense); // Open the modal with the selected expense
    };

    const handleCloseModal = () => {
        setEditingExpense(null); // Close the modal
    };

    // Date range
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState<Date>(currentDate);
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Generate monthly labels for the last 6 months
    const monthLabels = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(currentDate, i);
        return {
            label: format(date, 'MMM yyyy'),
            date,
        };
    }).reverse();

    // Change date range based on selected period and month
    useEffect(() => {
        if (period === 'month') {
            setDateRange({
                start: startOfMonth(selectedMonth),
                end: endOfMonth(selectedMonth),
            });
        } else {
            const year = selectedMonth.getFullYear();
            setDateRange({
                start: new Date(year, 0, 1),
                end: new Date(year, 11, 31),
            });
        }
    }, [period, selectedMonth]);

    // Filter expenses
    useEffect(() => {
        let filtered = expenses.filter((expense) =>
            isWithinInterval(expense.date, {
                start: dateRange.start,
                end: dateRange.end,
            })
        );

        if (filterCategory !== 'all') {
            filtered = filtered.filter((expense) => expense.category === filterCategory);
        }

        if (filterMember !== 'all') {
            filtered = filtered.filter((expense) => expense.familyMemberId === filterMember);
        }

        setFilteredExpenses(filtered);
    }, [expenses, dateRange, filterCategory, filterMember]);

    // Process data for charts
    const processMonthlyData = () => {
        return monthLabels.map((monthData) => {
            const monthStart = startOfMonth(monthData.date);
            const monthEnd = endOfMonth(monthData.date);

            const monthExpenses = expenses.filter((expense) => isWithinInterval(expense.date, { start: monthStart, end: monthEnd }));

            const plannedAmount = monthExpenses.filter((e) => e.isPlanned).reduce((sum, e) => sum + e.amount, 0);

            const unplannedAmount = monthExpenses.filter((e) => !e.isPlanned).reduce((sum, e) => sum + e.amount, 0);

            return {
                name: monthData.label,
                planned: plannedAmount,
                unplanned: unplannedAmount,
                total: plannedAmount + unplannedAmount,
            };
        });
    };

    const processCategoryData = () => {
        const categoryAmounts: Record<string, number> = {};

        filteredExpenses.forEach((expense) => {
            if (categoryAmounts[expense.category]) {
                categoryAmounts[expense.category] += expense.amount;
            } else {
                categoryAmounts[expense.category] = expense.amount;
            }
        });

        return Object.entries(categoryAmounts)
            .map(([category, amount]) => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                value: amount,
                color: getCategoryColor(category as ExpenseCategory),
            }))
            .sort((a, b) => b.value - a.value);
    };

    const processPlannedVsUnplannedData = () => {
        const plannedAmount = filteredExpenses.filter((e) => e.isPlanned).reduce((sum, e) => sum + e.amount, 0);

        const unplannedAmount = filteredExpenses.filter((e) => !e.isPlanned).reduce((sum, e) => sum + e.amount, 0);

        return [
            { name: 'Planned', value: plannedAmount, color: '#63B995' },
            { name: 'Unplanned', value: unplannedAmount, color: '#F9C784' },
        ];
    };

    const monthlyData = processMonthlyData();
    const categoryData = processCategoryData();
    const plannedVsUnplannedData = processPlannedVsUnplannedData();

    // Calculate summary
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const plannedAmount = filteredExpenses.filter((e) => e.isPlanned).reduce((sum, e) => sum + e.amount, 0);
    const unplannedAmount = totalAmount - plannedAmount;

    return (
        <div className='space-y-8 pb-16 md:pb-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-semibold text-gray-800'>Reports</h1>
                    <p className='text-gray-500'>{period === 'month' ? format(selectedMonth, 'MMMM yyyy') : format(selectedMonth, 'yyyy')}</p>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <div className='inline-flex rounded-lg border border-gray-200 bg-white'>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                period === 'month' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setPeriod('year')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                period === 'year' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Year
                        </button>
                    </div>

                    <div className='relative inline-block'>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className='inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        >
                            <Filter size={16} className='mr-1.5' />
                            Filters
                            <ChevronDown size={16} className='ml-1.5' />
                        </button>

                        {showFilters && (
                            <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4'>
                                <div className='mb-4'>
                                    <label className='input-label'>Category</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
                                        className='input-field mt-1'
                                    >
                                        <option value='all'>All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='input-label'>Family Member</label>
                                    <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className='input-field mt-1'>
                                        <option value='all'>All Members</option>
                                        {familyMembers.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='relative inline-block'>
                        <button className='inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'>
                            <CalendarDays size={16} className='mr-1.5' />
                            {period === 'month' ? format(selectedMonth, 'MMM yyyy') : format(selectedMonth, 'yyyy')}
                            <ChevronDown size={16} className='ml-1.5' />
                        </button>
                    </div>

                    <button className='inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'>
                        <Download size={16} className='mr-1.5' />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='card p-5'>
                    <p className='text-sm font-medium text-gray-500'>Total Expenses</p>
                    <h3 className='text-2xl font-semibold mt-1'>₹{totalAmount.toLocaleString()}</h3>
                </div>

                <div className='card p-5'>
                    <p className='text-sm font-medium text-gray-500'>Planned Expenses</p>
                    <h3 className='text-2xl font-semibold mt-1'>₹{plannedAmount.toLocaleString()}</h3>
                    <p className='text-xs text-gray-500 mt-1'>
                        {totalAmount > 0 ? `${Math.round((plannedAmount / totalAmount) * 100)}%` : '0%'} of total
                    </p>
                </div>

                <div className='card p-5'>
                    <p className='text-sm font-medium text-gray-500'>Unplanned Expenses</p>
                    <h3 className='text-2xl font-semibold mt-1'>₹{unplannedAmount.toLocaleString()}</h3>
                    <p className='text-xs text-gray-500 mt-1'>
                        {totalAmount > 0 ? `${Math.round((unplannedAmount / totalAmount) * 100)}%` : '0%'} of total
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Monthly Trend Chart */}
                <div className='card p-5'>
                    <h3 className='text-lg font-semibold mb-4'>Monthly Spending Trend</h3>
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                <XAxis dataKey='name' />
                                <YAxis />
                                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                                <Legend />
                                <Line type='monotone' dataKey='total' stroke='#4F86C6' activeDot={{ r: 8 }} strokeWidth={2} />
                                <Line type='monotone' dataKey='planned' stroke='#63B995' strokeDasharray='5 5' />
                                <Line type='monotone' dataKey='unplanned' stroke='#F9C784' strokeDasharray='3 3' />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className='card p-5'>
                    <h3 className='text-lg font-semibold mb-4'>Category Breakdown</h3>
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={categoryData} layout='vertical' margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3' horizontal={true} vertical={false} />
                                <XAxis type='number' />
                                <YAxis dataKey='name' type='category' width={70} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                                <Bar dataKey='value' radius={[0, 4, 4, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className='card p-5'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>
                        {filteredExpenses.length} Expense{filteredExpenses.length !== 1 ? 's' : ''}
                    </h3>
                </div>
                <ExpensesList expenses={filteredExpenses} onEdit={handleEditExpense} />
            </div>
            {editingExpense && (
                <EditExpenseModal
                    expense={editingExpense}
                    onClose={handleCloseModal}
                    onSave={(updatedExpense) => {
                        updateExpense(editingExpense.id, updatedExpense); // Update the expense
                        handleCloseModal();
                    }}
                />
            )}
        </div>
    );
};

// List of expense categories
const categories: ExpenseCategory[] = [
    'food',
    'groceries',
    'housing',
    'transportation',
    'utilities',
    'entertainment',
    'healthcare',
    'education',
    'shopping',
    'personal',
    'debt',
    'savings',
    'gifts',
    'other',
];

export default Reports;
