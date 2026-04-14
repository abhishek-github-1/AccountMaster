import { RequestHandler } from "express";
import { LedgersResponse } from "@shared/api";

// Sample data - In a real app, this would come from a database
const ledgerData = [
  {
    category: "ASSETS",
    name: "Assets",
    ledgers: [
      {
        id: "L2",
        name: "Cash",
        group: "Cash in Hand",
        openingBalance: 0,
        runningBalance: 100000,
        closingBalance: 100000,
      },
      {
        id: "L1",
        name: "SBI Bank A/c",
        group: "Bank Accounts",
        openingBalance: 1000000,
        runningBalance: 1020000,
        closingBalance: 1020000,
      },
      {
        id: "L7",
        name: "Mr. Brown",
        group: "Sundry Debtors",
        openingBalance: 0,
        runningBalance: 1492389,
        closingBalance: 1492389,
      },
      {
        id: "L8",
        name: "Abhishek Sharma",
        group: "Sundry Debtors",
        openingBalance: 0,
        runningBalance: 0,
        closingBalance: 0,
      },
      {
        id: "L9",
        name: "Rajesh Julka",
        group: "Sundry Debtors",
        openingBalance: 0,
        runningBalance: 0,
        closingBalance: 0,
      },
    ],
    totalOpeningBalance: 1000000,
    totalRunningBalance: 1594389,
    totalClosingBalance: 1594389,
  },
  {
    category: "LIABILITIES",
    name: "Liabilities",
    ledgers: [
      {
        id: "L6",
        name: "Output GST",
        group: "Duties & Taxes",
        openingBalance: 0,
        runningBalance: 15.49,
        closingBalance: 15.49,
      },
      {
        id: "L10",
        name: "TCS",
        group: "Duties & Taxes",
        openingBalance: 0,
        runningBalance: 0,
        closingBalance: 0,
      },
    ],
    totalOpeningBalance: 0,
    totalRunningBalance: 15.49,
    totalClosingBalance: 15.49,
  },
];

export const getLedgers: RequestHandler = (_req, res) => {
  const response: LedgersResponse = {
    data: ledgerData,
  };
  res.json(response);
};

export const createLedger: RequestHandler = (req, res) => {
  const { name, group, category, openingBalance } = req.body;

  if (!name || !group || !category) {
    return res.status(400).json({
      error: "Missing required fields: name, group, category",
    });
  }

  const newLedger = {
    id: `L${Math.floor(Math.random() * 1000)}`,
    name,
    group,
    openingBalance: openingBalance || 0,
    runningBalance: openingBalance || 0,
    closingBalance: openingBalance || 0,
  };

  res.status(201).json(newLedger);
};
