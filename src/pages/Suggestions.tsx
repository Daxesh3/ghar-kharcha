import React, { useState, useEffect } from 'react';
import { Lightbulb, Check, ChevronRight, TrendingDown, BarChart, PieChart } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  savingsAmount: number;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  implemented: boolean;
}

const Suggestions: React.FC = () => {
  const { expenses } = useExpenses();
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'implemented' | 'pending'>('all');
  
  // Generate AI suggestions based on spending patterns
  useEffect(() => {
    // In a real app, this would connect to an AI service
    // Here we're generating mock suggestions based on the data
    
    const mockSuggestions: SuggestionItem[] = [
      {
        id: '1',
        title: 'Reduce food delivery expenses',
        description: 'You spent 30% more on food delivery this month compared to last month. Consider cooking at home more often to save around ₹3,000 per month.',
        savingsAmount: 3000,
        category: 'food',
        difficulty: 'medium',
        implemented: false
      },
      {
        id: '2',
        title: 'Switch to a more affordable utility provider',
        description: 'Based on your current utility expenses, you could save by switching providers. Many households in your area pay about 15% less for similar usage.',
        savingsAmount: 1200,
        category: 'utilities',
        difficulty: 'easy',
        implemented: false
      },
      {
        id: '3',
        title: 'Consider a family entertainment bundle',
        description: 'You currently subscribe to multiple streaming services separately. A family bundle could save you approximately ₹800 monthly.',
        savingsAmount: 800,
        category: 'entertainment',
        difficulty: 'easy',
        implemented: true
      },
      {
        id: '4',
        title: 'Optimize grocery shopping',
        description: 'Your grocery expenses are higher than average. Try buying seasonal items and shopping with a planned list to potentially save ₹2,500 monthly.',
        savingsAmount: 2500,
        category: 'groceries',
        difficulty: 'medium',
        implemented: false
      },
      {
        id: '5',
        title: 'Use public transportation once a week',
        description: 'Replacing just one day of car usage with public transportation could save you approximately ₹1,000 in fuel costs monthly.',
        savingsAmount: 1000,
        category: 'transportation',
        difficulty: 'medium',
        implemented: false
      },
      {
        id: '6',
        title: 'Implement a 24-hour purchase consideration rule',
        description: 'For non-essential purchases over ₹2,000, wait 24 hours before buying. This simple habit can reduce impulse shopping by up to 30%.',
        savingsAmount: 1500,
        category: 'shopping',
        difficulty: 'easy',
        implemented: false
      }
    ];
    
    setSuggestions(mockSuggestions);
  }, [expenses]);
  
  // Filter suggestions based on active filter
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'implemented') return suggestion.implemented;
    if (activeFilter === 'pending') return !suggestion.implemented;
    return true;
  });
  
  // Toggle suggestion implementation
  const toggleImplementation = (id: string) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === id 
        ? { ...suggestion, implemented: !suggestion.implemented } 
        : suggestion
    ));
  };
  
  // Calculate potential savings
  const potentialSavings = filteredSuggestions
    .filter(s => !s.implemented)
    .reduce((sum, s) => sum + s.savingsAmount, 0);
  
  const implementedSavings = filteredSuggestions
    .filter(s => s.implemented)
    .reduce((sum, s) => sum + s.savingsAmount, 0);
  
  return (
    <div className="space-y-8 pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Smart Suggestions</h1>
        <p className="text-gray-500 mt-1">AI-powered insights to optimize your spending</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Potential Savings</p>
              <h3 className="text-2xl font-semibold mt-1">₹{potentialSavings.toLocaleString()}/month</h3>
            </div>
            <div className="bg-primary-100 p-2 rounded-lg">
              <TrendingDown size={20} className="text-primary-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            If you implement all pending suggestions
          </p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Implemented Savings</p>
              <h3 className="text-2xl font-semibold mt-1">₹{implementedSavings.toLocaleString()}/month</h3>
            </div>
            <div className="bg-success-500/20 p-2 rounded-lg">
              <Check size={20} className="text-success-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            From {filteredSuggestions.filter(s => s.implemented).length} implemented suggestion{filteredSuggestions.filter(s => s.implemented).length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <h3 className="text-lg font-semibold mt-1">{format(new Date(), 'MMMM d, yyyy')}</h3>
            </div>
            <div className="bg-warning-500/20 p-2 rounded-lg">
              <BarChart size={20} className="text-warning-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Suggestions are updated monthly based on your spending patterns
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeFilter === 'all' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 text-sm font-medium ${
              activeFilter === 'pending' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('implemented')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeFilter === 'implemented' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Implemented
          </button>
        </div>
      </div>
      
      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No suggestions yet</h3>
            <p className="text-gray-500">
              We're analyzing your spending patterns to generate personalized suggestions.
            </p>
          </div>
        ) : (
          filteredSuggestions.map(suggestion => (
            <div 
              key={suggestion.id} 
              className={`card p-5 border-l-4 ${
                suggestion.implemented 
                  ? 'border-l-success-500' 
                  : suggestion.difficulty === 'easy' 
                    ? 'border-l-success-500' 
                    : suggestion.difficulty === 'medium' 
                      ? 'border-l-warning-500' 
                      : 'border-l-error-500'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center">
                    <Lightbulb 
                      size={16} 
                      className={`mr-2 ${
                        suggestion.implemented 
                          ? 'text-success-500' 
                          : suggestion.difficulty === 'easy' 
                            ? 'text-success-500' 
                            : suggestion.difficulty === 'medium' 
                              ? 'text-warning-500' 
                              : 'text-error-500'
                      }`} 
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{suggestion.title}</h3>
                  </div>
                  <p className="text-gray-600 my-2">{suggestion.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-primary-600">
                      Save ₹{suggestion.savingsAmount.toLocaleString()}/month
                    </span>
                    {suggestion.category && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{suggestion.category}</span>
                      </>
                    )}
                    <span className="mx-2">•</span>
                    <span className={`${
                      suggestion.difficulty === 'easy' 
                        ? 'text-success-500' 
                        : suggestion.difficulty === 'medium' 
                          ? 'text-warning-500' 
                          : 'text-error-500'
                    }`}>
                      {suggestion.difficulty.charAt(0).toUpperCase() + suggestion.difficulty.slice(1)} difficulty
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <button
                    onClick={() => toggleImplementation(suggestion.id)}
                    className={`p-2 rounded-full ${
                      suggestion.implemented 
                        ? 'bg-success-100 text-success-500' 
                        : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Insights Section */}
      <div className="card p-5">
        <div className="flex items-center mb-4">
          <PieChart size={20} className="text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Financial Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-primary-800">
              Your unplanned expenses account for 32% of your monthly spending, which is 12% higher than similar households. Consider using the planned vs. unplanned tracking feature to gain better control.
            </p>
          </div>
          
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-success-800">
              You've consistently stayed under budget in the 'utilities' category for the past 3 months. Great job on efficient energy usage!
            </p>
          </div>
          
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-warning-800">
              Your 'food' category spending has increased by 15% compared to last month. Check if there are any changes in habits or if prices have increased.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;