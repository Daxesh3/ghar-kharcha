import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Calendar } from 'lucide-react';
import ExpensesList from '../components/ExpensesList';
import { ExpenseCategory } from '../types';

const Dashboard: React.FC = () => {
  const { expenses, budgets, loading, getExpenseSummary } = useExpenses();
  const [summary, setSummary] = useState<any>({
    totalAmount: 0,
    plannedAmount: 0,
    unplannedAmount: 0,
    byCategory: {},
    byMember: {}
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const COLORS = ['#4F86C6', '#63B995', '#F9C784', '#EF4444', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];
  
  // Get current date info
  const today = new Date();
  const currentMonth = format(today, 'MMMM');
  const currentYear = format(today, 'yyyy');
  
  // Get start and end dates based on selected period
  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'week') {
      // Start from current day minus 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (period === 'month') {
      // Start from beginning of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      // Start from beginning of current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }
    
    return { startDate, endDate };
  };
  
  // Fetch expense summary
  useEffect(() => {
    const fetchSummary = async () => {
      const { startDate, endDate } = getDateRange();
      const summaryData = await getExpenseSummary(startDate, endDate);
      setSummary(summaryData);
    };
    
    if (!loading) {
      fetchSummary();
    }
  }, [loading, period, getExpenseSummary]);
  
  // Prepare chart data
  const pieChartData = Object.entries(summary.byCategory || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));
  
  const barChartData = Object.entries(summary.byCategory || {})
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      amount
    }));
  
  // Calculate budget progress
  const budgetProgress = (() => {
    if (budgets.length === 0) return 0;
    
    const totalBudgetForPeriod = budgets
      .filter(budget => budget.period === (period === 'year' ? 'yearly' : 'monthly'))
      .reduce((sum, budget) => sum + budget.amount, 0);
    
    if (totalBudgetForPeriod === 0) return 0;
    
    return Math.min(Math.round((summary.totalAmount / totalBudgetForPeriod) * 100), 100);
  })();
  
  // Get recently added expenses
  const recentExpenses = expenses.slice(0, 5);
  
  return (
    <div className="space-y-8 pb-16 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            {period === 'month' && `${currentMonth} ${currentYear}`}
            {period === 'week' && 'Last 7 days'}
            {period === 'year' && currentYear}
          </p>
        </div>
        
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              period === 'week' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 text-sm font-medium ${
              period === 'month' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              period === 'year' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <h3 className="text-2xl font-semibold mt-1">₹{summary.totalAmount.toLocaleString()}</h3>
            </div>
            <div className="bg-primary-100 p-2 rounded-lg">
              <Wallet size={20} className="text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className={`flex items-center text-xs ${summary.totalAmount > 0 ? 'text-error-500' : 'text-success-500'}`}>
                {summary.totalAmount > 0 ? (
                  <ArrowUpRight size={14} className="mr-1" />
                ) : (
                  <ArrowDownRight size={14} className="mr-1" />
                )}
                <span>{Math.abs(((summary.totalAmount - 0) / 1) * 100).toFixed(0)}%</span>
              </span>
              <span className="text-xs text-gray-500 ml-2">vs target</span>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Planned Expenses</p>
              <h3 className="text-2xl font-semibold mt-1">₹{summary.plannedAmount.toLocaleString()}</h3>
            </div>
            <div className="bg-success-500/20 p-2 rounded-lg">
              <Calendar size={20} className="text-success-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {summary.totalAmount > 0 
                  ? `${Math.round((summary.plannedAmount / summary.totalAmount) * 100)}% of total` 
                  : '0% of total'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Unplanned Expenses</p>
              <h3 className="text-2xl font-semibold mt-1">₹{summary.unplannedAmount.toLocaleString()}</h3>
            </div>
            <div className="bg-warning-500/20 p-2 rounded-lg">
              <TrendingUp size={20} className="text-warning-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {summary.totalAmount > 0 
                  ? `${Math.round((summary.unplannedAmount / summary.totalAmount) * 100)}% of total` 
                  : '0% of total'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Budget Usage</p>
              <h3 className="text-2xl font-semibold mt-1">{budgetProgress}%</h3>
            </div>
            <div className={`${
              budgetProgress < 75 
                ? 'bg-success-500/20' 
                : budgetProgress < 90 
                  ? 'bg-warning-500/20' 
                  : 'bg-error-500/20'
              } p-2 rounded-lg`}>
              <Wallet size={20} className={`
                ${budgetProgress < 75 
                  ? 'text-success-500' 
                  : budgetProgress < 90 
                    ? 'text-warning-500' 
                    : 'text-error-500'
                }`} />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budgetProgress < 75 
                    ? 'bg-success-500' 
                    : budgetProgress < 90 
                      ? 'bg-warning-500' 
                      : 'bg-error-500'
                }`}
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                <Legend />
                <Bar dataKey="amount" fill="#4F86C6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Expenses */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Expenses</h3>
          <a href="/reports" className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </a>
        </div>
        <ExpensesList expenses={recentExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;