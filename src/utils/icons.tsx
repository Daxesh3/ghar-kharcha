import React from 'react';
import { ShoppingBag, Home, Car, Utensils, Lightbulb, PiggyBank, Heart, Briefcase, Notebook, Gift, Wallet, DivideIcon as LucideIcon, ShoppingCart, GraduationCap } from 'lucide-react';
import { ExpenseCategory } from '../types';

export const getCategoryIcon = (category: ExpenseCategory): LucideIcon => {
  switch (category) {
    case 'food':
      return Utensils;
    case 'groceries':
      return ShoppingCart;
    case 'housing':
      return Home;
    case 'transportation':
      return Car;
    case 'utilities':
      return Lightbulb;
    case 'entertainment':
      return Notebook;
    case 'healthcare':
      return Heart;
    case 'education':
      return GraduationCap;
    case 'shopping':
      return ShoppingBag;
    case 'personal':
      return Wallet;
    case 'debt':
      return Briefcase;
    case 'savings':
      return PiggyBank;
    case 'gifts':
      return Gift;
    case 'other':
    default:
      return Wallet;
  }
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  switch (category) {
    case 'food':
      return '#F97316'; // Orange
    case 'groceries':
      return '#63B995'; // Green
    case 'housing':
      return '#4F86C6'; // Blue
    case 'transportation':
      return '#8B5CF6'; // Purple
    case 'utilities':
      return '#14B8A6'; // Teal
    case 'entertainment':
      return '#EC4899'; // Pink
    case 'healthcare':
      return '#EF4444'; // Red
    case 'education':
      return '#F59E0B'; // Amber
    case 'shopping':
      return '#6366F1'; // Indigo
    case 'personal':
      return '#10B981'; // Emerald
    case 'debt':
      return '#6B7280'; // Gray
    case 'savings':
      return '#0EA5E9'; // Sky
    case 'gifts':
      return '#D946EF'; // Fuchsia
    case 'other':
    default:
      return '#9CA3AF'; // Gray
  }
};