import { Layout } from "@/components/Layout";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Ledger {
  id: string;
  name: string;
  group: string;
  openingBalance: number;
  runningBalance: number;
  closingBalance: number;
}

interface LedgerGroup {
  category: string;
  ledgers: Ledger[];
}

const initialLedgerData: LedgerGroup[] = [
  {
    category: "ASSETS",
    ledgers: [
      { id: "L2", name: "Cash", group: "Cash in Hand", openingBalance: 0, runningBalance: 100000, closingBalance: 100000 },
      { id: "L1", name: "SBI Bank A/c", group: "Bank Accounts", openingBalance: 1000000, runningBalance: 1020000, closingBalance: 1020000 },
      { id: "L7", name: "Mr. Brown", group: "Sundry Debtors", openingBalance: 0, runningBalance: 1492389, closingBalance: 1492389 },
      { id: "L8", name: "Abhishek Sharma", group: "Sundry Debtors", openingBalance: 0, runningBalance: 0, closingBalance: 0 },
      { id: "L9", name: "Rajesh Julka", group: "Sundry Debtors", openingBalance: 0, runningBalance: 0, closingBalance: 0 },
    ],
  },
  {
    category: "LIABILITIES",
    ledgers: [
      { id: "L6", name: "Output GST", group: "Duties & Taxes", openingBalance: 0, runningBalance: 15.49, closingBalance: 15.49 },
      { id: "L10", name: "TCS", group: "Duties & Taxes", openingBalance: 0, runningBalance: 0, closingBalance: 0 },
    ],
  },
  {
    category: "INCOME",
    ledgers: [
      { id: "L3", name: "Sales A/c", group: "Direct Income", openingBalance: 0, runningBalance: 14950042.75, closingBalance: 14950042.75 },
    ],
  },
  {
    category: "EXPENSES",
    ledgers: [
      { id: "L4", name: "Purchase A/c", group: "Direct Expenses", openingBalance: 0, runningBalance: 3000, closingBalance: 3000 },
      { id: "L5", name: "Office Expenses", group: "Indirect Expenses", openingBalance: 0, runningBalance: 1400, closingBalance: 1400 },
    ],
  },
];

const formatCurrency = (amount: number) =>
  `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const groupOptions = [
  "Cash in Hand", "Bank Accounts", "Sundry Debtors", "Sundry Creditors",
  "Duties & Taxes", "Direct Income", "Indirect Income",
  "Direct Expenses", "Indirect Expenses", "Fixed Assets", "Capital Account",
];

const categoryForGroup = (group: string): string => {
  const income = ["Direct Income", "Indirect Income"];
  const expense = ["Direct Expenses", "Indirect Expenses"];
  const liability = ["Sundry Creditors", "Duties & Taxes", "Capital Account"];
  if (income.includes(group)) return "INCOME";
  if (expense.includes(group)) return "EXPENSES";
  if (liability.includes(group)) return "LIABILITIES";
  return "ASSETS";
};

export default function ChartOfAccounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgerData, setLedgerData] = useState<LedgerGroup[]>(initialLedgerData);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", group: "Cash in Hand", openingBalance: "" });
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filteredData = ledgerData
    .map((group) => ({
      ...group,
      ledgers: group.ledgers.filter(
        (ledger) =>
          ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ledger.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ledger.group.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.ledgers.length > 0);

  const handleAdd = () => {
    if (!form.name || !form.group) return;
    const targetCategory = categoryForGroup(form.group);
    const allIds = ledgerData.flatMap(g => g.ledgers.map(l => parseInt(l.id.replace("L","")))).filter(Boolean);
    const nextId = `L${Math.max(0, ...allIds) + 1}`;
    const ob = parseFloat(form.openingBalance) || 0;
    const newLedger: Ledger = { id: nextId, name: form.name, group: form.group, openingBalance: ob, runningBalance: ob, closingBalance: ob };

    setLedgerData(prev => {
      const existing = prev.find(g => g.category === targetCategory);
      if (existing) {
        return prev.map(g => g.category === targetCategory ? { ...g, ledgers: [...g.ledgers, newLedger] } : g);
      }
      return [...prev, { category: targetCategory, ledgers: [newLedger] }];
    });

    setForm({ name: "", group: "Cash in Hand", openingBalance: "" });
    setShowModal(false);
  };

  const handleDelete = (category: string, ledgerId: string) => {
    setLedgerData(prev =>
      prev.map(g => g.category === category ? { ...g, ledgers: g.ledgers.filter(l => l.id !== ledgerId) } : g)
          .filter(g => g.ledgers.length > 0)
    );
    setActionMenu(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Chart of Accounts</h1>
          <p className="text-sm text-gray-600">All Ledgers</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {(["ASSETS","LIABILITIES","INCOME","EXPENSES"] as const).map((cat) => {
            const group = ledgerData.find(g => g.category === cat);
            const total = group?.ledgers.reduce((s, l) => s + l.closingBalance, 0) || 0;
            const colors = { ASSETS:"bg-blue-50 border-t-blue-500 text-blue-600", LIABILITIES:"bg-red-50 border-t-red-500 text-red-600", INCOME:"bg-green-50 border-t-green-500 text-green-600", EXPENSES:"bg-orange-50 border-t-orange-500 text-orange-600" };
            return (
              <div key={cat} className={`${colors[cat]} border-t-4 rounded-lg p-4 shadow-sm`}>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">{cat}</p>
                <p className={`text-lg font-bold ${colors[cat].split(" ")[2]}`}>{formatCurrency(total)}</p>
                <p className="text-xs text-gray-500 mt-1">{group?.ledgers.length || 0} ledgers</p>
              </div>
            );
          })}
        </div>

        {/* Search and Add */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Ledger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Ledger
          </button>
        </div>

        {/* Table — FIX: render header + rows together per group */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["ID", "Ledger Name", "Group", "Opening Balance", "Running Balance", "Closing Balance", "Action"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${[3,4,5].includes(i) ? "text-right" : i === 6 ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((group) => (
                <>
                  {/* Category header row */}
                  <tr key={`header-${group.category}`} className="bg-orange-50 border-t-2 border-b border-orange-200">
                    <td colSpan={4} className="px-6 py-3 text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {group.category}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-right text-gray-700">
                      {formatCurrency(group.ledgers.reduce((s, l) => s + l.runningBalance, 0))}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-right text-gray-700">
                      {formatCurrency(group.ledgers.reduce((s, l) => s + l.closingBalance, 0))}
                    </td>
                    <td></td>
                  </tr>

                  {/* Ledger rows for this category */}
                  {group.ledgers.map((ledger) => (
                    <tr key={`ledger-${ledger.id}`} className="border-b border-gray-100 hover:bg-gray-50 relative">
                      <td className="px-6 py-4 text-sm font-medium text-primary">{ledger.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ledger.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{ledger.group}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-700">{formatCurrency(ledger.openingBalance)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">{formatCurrency(ledger.runningBalance)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">{formatCurrency(ledger.closingBalance)}</td>
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === ledger.id ? null : ledger.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>
                        {actionMenu === ledger.id && (
                          <div className="absolute right-8 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                            <button
                              onClick={() => handleDelete(group.category, ledger.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Subtotal row */}
                  <tr key={`total-${group.category}`} className="bg-gray-50 border-b-2 border-gray-200">
                    <td colSpan={3} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Total {group.category}
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">
                      {formatCurrency(group.ledgers.reduce((s, l) => s + l.openingBalance, 0))}
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">
                      {formatCurrency(group.ledgers.reduce((s, l) => s + l.runningBalance, 0))}
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">
                      {formatCurrency(group.ledgers.reduce((s, l) => s + l.closingBalance, 0))}
                    </td>
                    <td></td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-gray-500">No ledgers found.</div>
          )}
        </div>
      </div>

      {/* Add Ledger Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add New Ledger</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ledger Name *</label>
                <input type="text" placeholder="e.g. HDFC Bank A/c" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Group *</label>
                <select value={form.group} onChange={(e) => setForm(f => ({ ...f, group: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {groupOptions.map(g => <option key={g}>{g}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Category: <span className="font-medium text-gray-600">{categoryForGroup(form.group)}</span></p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Opening Balance (₹)</label>
                <input type="number" placeholder="0.00" value={form.openingBalance} onChange={(e) => setForm(f => ({ ...f, openingBalance: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Ledger</button>
            </div>
          </div>
        </div>
      )}

      {/* Close action menu on outside click */}
      {actionMenu && <div className="fixed inset-0 z-0" onClick={() => setActionMenu(null)} />}
    </Layout>
  );
}
