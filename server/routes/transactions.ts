import { RequestHandler } from "express";
import { TransactionsResponse, DashboardResponse } from "@shared/api";

// Sample transaction data
const transactionData = [
  {
    id: "TXN-1",
    date: "20/09/26",
    vchNo: "PJ-1",
    particulars: "Purchase A/c Dr",
    debit: 1000,
    credit: 0,
    ledgerId: "L1",
    type: "PURCHASE" as const,
    reference: "PJ-1",
    status: "COMPLETED" as const,
  },
];

const recentActivityData = [
  {
    id: "ACT-1",
    date: "21 Feb 2026",
    transaction: "Sales Invoice",
    reference: "#INV-1023",
    amount: 12500,
    status: "COMPLETED" as const,
  },
  {
    id: "ACT-2",
    date: "20 Feb 2026",
    transaction: "Purchase Bill",
    reference: "#BILL-458",
    amount: -8200,
    status: "PENDING" as const,
  },
  {
    id: "ACT-3",
    date: "19 Feb 2026",
    transaction: "Bank Deposit",
    reference: "#TXN-8891",
    amount: 25000,
    status: "COMPLETED" as const,
  },
  {
    id: "ACT-4",
    date: "18 Feb 2026",
    transaction: "Expense Payment",
    reference: "#EXP-332",
    amount: -1400,
    status: "COMPLETED" as const,
  },
];

export const getTransactions: RequestHandler = (_req, res) => {
  const totalDebit = transactionData.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactionData.reduce((sum, t) => sum + t.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  const response: TransactionsResponse = {
    data: transactionData,
    total: transactionData.length,
    isBalanced,
  };

  res.json(response);
};

export const createTransaction: RequestHandler = (req, res) => {
  const {
    date,
    vchNo,
    particulars,
    debit,
    credit,
    ledgerId,
    type,
    reference,
  } = req.body;

  if (!date || !vchNo || !particulars || (debit === undefined && credit === undefined)) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const newTransaction = {
    id: `TXN-${Date.now()}`,
    date,
    vchNo,
    particulars,
    debit: debit || 0,
    credit: credit || 0,
    ledgerId,
    type,
    reference,
    status: "COMPLETED" as const,
  };

  res.status(201).json(newTransaction);
};

export const getDashboard: RequestHandler = (_req, res) => {
  const totalSales = 14950042.75;
  const totalPurchases = 3000.0;
  const netProfit = 14920042.75;
  const currentBankBalance = 102000.0;

  const response: DashboardResponse = {
    overview: {
      totalSales,
      totalPurchases,
      netProfit,
      currentBankBalance,
      recentActivityCount: recentActivityData.length,
    },
    recentActivity: recentActivityData,
  };

  res.json(response);
};
