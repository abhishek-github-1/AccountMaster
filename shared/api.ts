/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Ledger Types
export interface Ledger {
  id: string;
  name: string;
  group: string;
  category: "ASSETS" | "LIABILITIES" | "INCOME" | "EXPENSES";
  openingBalance: number;
  closingBalance: number;
  runningBalance: number;
}

export interface LedgerGroup {
  name: string;
  category: "ASSETS" | "LIABILITIES" | "INCOME" | "EXPENSES";
  ledgers: Ledger[];
  totalOpeningBalance: number;
  totalRunningBalance: number;
  totalClosingBalance: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  date: string;
  vchNo: string;
  particulars: string;
  debit: number;
  credit: number;
  ledgerId: string;
  type: "SALES" | "PURCHASE" | "BANK" | "EXPENSE";
  reference?: string;
  status: "COMPLETED" | "PENDING";
}

// Dashboard Types
export interface DashboardOverview {
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
  currentBankBalance: number;
  recentActivityCount: number;
}

export interface RecentActivity {
  id: string;
  date: string;
  transaction: string;
  reference: string;
  amount: number;
  status: "COMPLETED" | "PENDING";
}

// API Response Types
export interface LedgersResponse {
  data: LedgerGroup[];
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  isBalanced: boolean;
}

export interface DashboardResponse {
  overview: DashboardOverview;
  recentActivity: RecentActivity[];
}
