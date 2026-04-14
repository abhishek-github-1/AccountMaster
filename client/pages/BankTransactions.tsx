import { Layout } from "@/components/Layout";
import { ArrowDownLeft, ArrowUpRight, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Txn { id: string; date: string; description: string; reference: string; type: "Credit"|"Debit"; amount: number; balance: number; }

const initial: Txn[] = [
  { id: "TXN-8891", date: "19 Feb 2026", description: "Bank Deposit", reference: "DEP/2026/001", type: "Credit", amount: 25000, balance: 1020000 },
  { id: "TXN-8890", date: "18 Feb 2026", description: "Expense Payment – Office Supplies", reference: "CHQ/2026/099", type: "Debit", amount: 1400, balance: 995000 },
  { id: "TXN-8889", date: "17 Feb 2026", description: "Customer Payment – Mr. Brown", reference: "NEFT/2026/112", type: "Credit", amount: 12500, balance: 996400 },
  { id: "TXN-8888", date: "15 Feb 2026", description: "Vendor Payment – Ravi Supplies", reference: "RTGS/2026/034", type: "Debit", amount: 3000, balance: 983900 },
  { id: "TXN-8887", date: "14 Feb 2026", description: "Opening Balance", reference: "OB/2026", type: "Credit", amount: 1000000, balance: 1000000 },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BankTransactions() {
  const [search, setSearch] = useState("");
  const [txns, setTxns] = useState<Txn[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date:"", description:"", reference:"", type:"Credit", amount:"" });
  const [filterType, setFilterType] = useState<"All"|"Credit"|"Debit">("All");

  const filtered = txns.filter((t)=>{
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())||t.reference.toLowerCase().includes(search.toLowerCase())||t.id.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType==="All"||t.type===filterType;
    return matchSearch&&matchType;
  });

  const totalCredit = txns.filter(t=>t.type==="Credit").reduce((s,t)=>s+t.amount,0);
  const totalDebit = txns.filter(t=>t.type==="Debit").reduce((s,t)=>s+t.amount,0);
  const currentBalance = txns[0]?.balance||0;

  const handleAdd = () => {
    if (!form.description||!form.amount) return;
    const lastBalance = txns[0]?.balance||0;
    const amt = parseFloat(form.amount)||0;
    const newBalance = form.type==="Credit"?lastBalance+amt:lastBalance-amt;
    const id = `TXN-${8892+txns.length}`;
    setTxns(prev=>[{id,date:form.date||"Today",description:form.description,reference:form.reference,type:form.type as any,amount:amt,balance:newBalance},...prev]);
    setForm({date:"",description:"",reference:"",type:"Credit",amount:""});
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Bank Transactions</h1><p className="text-sm text-gray-600">SBI Bank A/c</p></div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-t-4 border-t-blue-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Current Balance</p><p className="text-xl font-bold text-blue-600">{fmt(currentBalance)}</p></div>
          <div className="bg-green-50 border-t-4 border-t-green-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Credits</p><p className="text-xl font-bold text-green-600">{fmt(totalCredit)}</p></div>
          <div className="bg-red-50 border-t-4 border-t-red-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Debits</p><p className="text-xl font-bold text-red-600">{fmt(totalDebit)}</p></div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input type="text" placeholder="Search transactions..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["All","Credit","Debit"] as const).map((t)=>(
              <button key={t} onClick={()=>setFilterType(t)} className={`px-4 py-2 text-sm font-medium transition-colors ${filterType===t?"bg-primary text-white":"bg-white text-gray-600 hover:bg-gray-50"}`}>{t}</button>
            ))}
          </div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>Add Transaction</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["Txn ID","Date","Description","Reference","Type","Amount","Balance"].map((h,i)=>(
                <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${[5,6].includes(i)?"text-right":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t)=>(
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{t.reference}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type==="Credit"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>
                      {t.type==="Credit"?<ArrowDownLeft size={10}/>:<ArrowUpRight size={10}/>}{t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${t.type==="Credit"?"text-green-600":"text-red-600"}`}>{t.type==="Debit"?"-":""}{fmt(t.amount)}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{fmt(t.balance)}</td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">No transactions found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Transaction</h2>
              <button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Credit</option><option>Debit</option>
                </select>
              </div>
              {[["Date","date","text","DD MMM YYYY"],["Description *","description","text","Description"],["Reference","reference","text","REF/2026/001"],["Amount (₹) *","amount","number","0.00"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
