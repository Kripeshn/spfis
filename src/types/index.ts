// Type definitions for all entities

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  monthlyIncome: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Expense {
  _id?: string;
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Goal {
  _id?: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: Date;
  category: string;
  description: string;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt?: Date;
}

export interface Budget {
  _id?: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string; // "YYYY-MM"
  createdAt: Date;
  updatedAt?: Date;
}

export interface AnalyticsResult {
  behaviorType: string; // "Saver", "Balanced", "Impulsive", "Seasonal"
  savingsRate: number; // percentage
  spendingVariance: number;
  recommendations: string[];
  anomalies: Anomaly[];
  healthScore: number;
}

export interface Anomaly {
  date: Date;
  category: string;
  amount: number;
  reason: string;
  severity: "low" | "medium" | "high";
}