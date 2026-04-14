import { Layout } from "@/components/Layout";
import { Check, CheckCircle2, X, XCircle } from "lucide-react";
import { useState } from "react";

interface RecItem { id: string; date: string; description: string; bookAmount: number; bankAmount: number | null; reconciled: boolean; }

const initial: RecItem[] = [
  { id: "R1", date: "19 Feb 2026", description: "Bank Deposit", bookAmount: 25000, bankAmount: 25000, reconciled: true },
  { id: "R2", date: "18 Feb 2026", description: "Expense Payment", bookAmount: -1400, bankAmount: -1400, reconciled: true },
  { id: "R3", date: "17 Feb 2026", description: "Customer Payment – Mr. Brown", bookAmount: 12500, bankAmount: 12500, reconciled: false },
  { id: "R4", date: "15 Feb 2026", description: "Vendor Payment – Ravi Supplies", bookAmount: -3000, bankAmount: null, reconciled: false },
  { id: "R5", date: "14 Feb 2026", description: "Opening Balance", bookAmount: 1000000, bankAmount: 1000000, reconciled: true },
];

const fmt = (n: number) => `₹ ${Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BankReconciliation() {
  const [items, setItems] = useState<RecItem[]>(initial);
  const [bankStatementBalance, setBankStatementBalance] = useState("1033100");

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id===id?{...i,reconciled:!i.reconciled}:i));

  const bookBalance = items.reduce((s, i) => s + i.bookAmount, 0);
  const reconciledBalance = items.filter(i=>i.reconciled).reduce((s,i)=>s+i.bookAmount,0);
  const bankBal = parseFloat(bankStatementBalance)||0;
  const difference = bankBal - reconciledBalance;
  const isReconciled = Math.abs(difference) < 0.01;

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Bank Reconciliation</h1><p className="text-sm text-gray-600">Match your books with bank statement</p></div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-t-4 border-t-blue-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Book Balance</p><p className="text-xl font-bold text-blue-600">{fmt(bookBalance)}</p></div>
          <div className="bg-purple-50 border-t-4 border-t-purple-500 rounded-lg p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600 uppercase mb-1">Bank Statement Balance</p>
            <input type="number" value={bankStatementBalance} onChange={(e)=>setBankStatementBalance(e.target.value)} className="text-xl font-bold text-purple-600 bg-transparent border-b border-purple-300 focus:outline-none w-full"/>
          </div>
          <div className={`border-t-4 rounded-lg p-4 shadow-sm ${isReconciled?"bg-green-50 border-t-green-500":"bg-red-50 border-t-red-500"}`}>
            <p className="text-xs font-medium text-gray-600 uppercase mb-1">Difference</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-bold ${isReconciled?"text-green-600":"text-red-600"}`}>{fmt(difference)}</p>
              {isReconciled?<CheckCircle2 size={20} className="text-green-500"/>:<XCircle size={20} className="text-red-500"/>}
            </div>
          </div>
        </div>

        {isReconciled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600"/>
            <p className="text-sm font-medium text-green-800">Books are reconciled with bank statement!</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Book Amount</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Bank Amount</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">Reconcile</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item)=>(
                <tr key={item.id} className={`hover:bg-gray-50 ${item.reconciled?"opacity-60":""}`}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${item.bookAmount>=0?"text-green-600":"text-red-600"}`}>
                    {item.bookAmount>=0?"":"-"}{fmt(item.bookAmount)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${item.bankAmount===null?"text-gray-400":item.bankAmount>=0?"text-green-600":"text-red-600"}`}>
                    {item.bankAmount===null?"Not in Bank":item.bankAmount>=0?"":"-"}{item.bankAmount!==null?fmt(item.bankAmount):""}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.reconciled
                      ?<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check size={10}/>Matched</span>
                      :<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><X size={10}/>Unmatched</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={()=>toggle(item.id)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.reconciled?"bg-green-100 hover:bg-red-100":"bg-gray-100 hover:bg-green-100"}`}>
                      {item.reconciled?<Check size={14} className="text-green-600"/>:<Check size={14} className="text-gray-400"/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
