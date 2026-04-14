import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import SalesJournal from "./pages/SalesJournal";
import Customer from "./pages/Customer";
import Invoices from "./pages/Invoices";
import PurchaseJournal from "./pages/PurchaseJournal";
import Vendors from "./pages/Vendors";
import Bills from "./pages/Bills";
import BankTransactions from "./pages/BankTransactions";
import BankReconciliation from "./pages/BankReconciliation";
import BankAccounts from "./pages/BankAccounts";
import Payments from "./pages/Payments";
import Receipts from "./pages/Receipts";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/sales-journal" element={<SalesJournal />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/purchase-journal" element={<PurchaseJournal />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/bank-transactions" element={<BankTransactions />} />
          <Route path="/bank-reconciliation" element={<BankReconciliation />} />
          <Route path="/bank-accounts" element={<BankAccounts />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
