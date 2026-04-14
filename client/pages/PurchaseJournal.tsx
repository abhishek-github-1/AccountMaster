import { Layout } from "@/components/Layout";
import { AlertTriangle, Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface PurchaseEntry {
  id: string;
  date: string;
  vchNo: string;
  particulars: string;
  debit: number;
  credit: number;
}

const initialEntries: PurchaseEntry[] = [
  { id: "1", date: "20/02/26", vchNo: "PJ-1", particulars: "Purchase A/c Dr – Ravi Supplies Pvt Ltd", debit: 1000, credit: 1000 },
  { id: "2", date: "14/02/26", vchNo: "PJ-2", particulars: "Purchase A/c Dr – Global Traders", debit: 2000, credit: 2000 },
];

const formatCurrency = (amount: number) =>
  `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PurchaseJournal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<PurchaseEntry[]>(initialEntries);
  const [showModal, setShowModal] = useState(false);
  const [viewEntry, setViewEntry] = useState<PurchaseEntry | null>(null);
  const [form, setForm] = useState({ date: "", vchNo: "", particulars: "", debit: "", credit: "" });

  const filteredEntries = entries.filter(
    (entry) =>
      entry.vchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.includes(searchTerm) ||
      entry.particulars.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = filteredEntries.reduce((sum, e) => sum + e.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  const handleAdd = () => {
    if (!form.date || !form.vchNo || !form.particulars) return;
    setEntries(prev => [...prev, {
      id: Date.now().toString(),
      date: form.date,
      vchNo: form.vchNo,
      particulars: form.particulars,
      debit: parseFloat(form.debit) || 0,
      credit: parseFloat(form.credit) || 0,
    }]);
    setForm({ date: "", vchNo: "", particulars: "", debit: "", credit: "" });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Purchase Journal</h1>
          <p className="text-sm text-gray-600">All Purchase Entries</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-t-4 border-t-blue-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Entries</p><p className="text-xl font-bold text-blue-600">{entries.length}</p></div>
          <div className="bg-red-50 border-t-4 border-t-red-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Purchases</p><p className="text-xl font-bold text-red-600">{formatCurrency(entries.reduce((s,e)=>s+e.debit,0))}</p></div>
          <div className={`border-t-4 rounded-lg p-4 shadow-sm ${isBalanced?"bg-green-50 border-t-green-500":"bg-orange-50 border-t-orange-500"}`}><p className="text-xs font-medium text-gray-600 uppercase mb-1">Balance Status</p><p className={`text-xl font-bold ${isBalanced?"text-green-600":"text-orange-600"}`}>{isBalanced?"Balanced":"Unbalanced"}</p></div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search By ID, Ledger, Dates, Amount..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Purchase Entry
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Date","VCH No.","Particulars"].map(h=><th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">{h}</th>)}
                {["Debit","Credit"].map(h=><th key={h} className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">{h}</th>)}
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{entry.vchNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.particulars}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">{entry.debit > 0 ? formatCurrency(entry.debit) : "-"}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">{entry.credit > 0 ? formatCurrency(entry.credit) : "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setViewEntry(entry)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">No entries found.</td></tr>}
            </tbody>
          </table>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex gap-12">
            <div><p className="text-xs font-medium text-gray-600 uppercase">Total Debit</p><p className="text-sm font-semibold">{formatCurrency(totalDebit)}</p></div>
            <div><p className="text-xs font-medium text-gray-600 uppercase">Total Credit</p><p className="text-sm font-semibold">{formatCurrency(totalCredit)}</p></div>
          </div>

          {!isBalanced && (
            <div className="bg-red-50 border-t border-red-200 px-6 py-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <p className="text-sm font-medium text-red-800">Journal is Not balanced!</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Purchase Entry</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[["Date","date","text","DD/MM/YY"],["Voucher No.","vchNo","text","PJ-3"],["Particulars","particulars","text","Purchase A/c Dr"],["Debit (₹)","debit","number","0.00"],["Credit (₹)","credit","number","0.00"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e) => setForm(f => ({ ...f, [key as string]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Entry</button>
            </div>
          </div>
        </div>
      )}

      {viewEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Entry Details</h2>
              <button onClick={() => setViewEntry(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-2">
              {[["Voucher No.",viewEntry.vchNo],["Date",viewEntry.date],["Particulars",viewEntry.particulars],["Debit",formatCurrency(viewEntry.debit)],["Credit",formatCurrency(viewEntry.credit)]].map(([l,v])=>(
                <div key={l as string} className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs font-medium text-gray-500 uppercase">{l}</span><span className="text-sm font-semibold text-gray-900">{v}</span></div>
              ))}
            </div>
            <button onClick={() => setViewEntry(null)} className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
