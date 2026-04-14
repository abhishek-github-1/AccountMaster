import { Layout } from "@/components/Layout";
import { Building2, Plus, X } from "lucide-react";
import { useState } from "react";

interface BankAccount { id: string; bankName: string; accountNo: string; ifsc: string; branch: string; type: "Current"|"Savings"|"OD"; balance: number; }

const initial: BankAccount[] = [
  { id: "BA001", bankName: "State Bank of India", accountNo: "XXXX XXXX 1234", ifsc: "SBIN0001234", branch: "Connaught Place, Delhi", type: "Current", balance: 1020000 },
  { id: "BA002", bankName: "HDFC Bank", accountNo: "XXXX XXXX 5678", ifsc: "HDFC0005678", branch: "Nehru Place, Delhi", type: "Savings", balance: 0 },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const typeColor = (t: string) => t==="Current"?"bg-blue-100 text-blue-800":t==="Savings"?"bg-green-100 text-green-800":"bg-orange-100 text-orange-800";

export default function BankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bankName: "", accountNo: "", ifsc: "", branch: "", type: "Current", balance: "" });

  const handleAdd = () => {
    if (!form.bankName || !form.accountNo) return;
    const id = `BA${String(accounts.length+1).padStart(3,"0")}`;
    setAccounts(prev=>[...prev,{id,bankName:form.bankName,accountNo:form.accountNo,ifsc:form.ifsc,branch:form.branch,type:form.type as any,balance:parseFloat(form.balance)||0}]);
    setForm({bankName:"",accountNo:"",ifsc:"",branch:"",type:"Current",balance:""});
    setShowModal(false);
  };

  const totalBalance = accounts.reduce((s,a)=>s+a.balance,0);

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Bank Accounts</h1><p className="text-sm text-gray-600">Linked Bank Accounts</p></div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-t-4 border-t-blue-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Accounts</p><p className="text-xl font-bold text-blue-600">{accounts.length}</p></div>
          <div className="bg-green-50 border-t-4 border-t-green-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Balance</p><p className="text-xl font-bold text-green-600">{fmt(totalBalance)}</p></div>
          <div className="bg-orange-50 border-t-4 border-t-orange-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Active Accounts</p><p className="text-xl font-bold text-orange-600">{accounts.filter(a=>a.balance>0).length}</p></div>
        </div>

        <div className="flex justify-end">
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>Add Bank Account</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc)=>(
            <div key={acc.id} className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Building2 size={20} className="text-blue-600"/></div>
                  <div><p className="font-semibold text-gray-900">{acc.bankName}</p><p className="text-xs text-gray-500">{acc.branch}</p></div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor(acc.type)}`}>{acc.type}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-xs text-gray-500">Account No.</span><span className="text-sm font-mono font-medium text-gray-900">{acc.accountNo}</span></div>
                <div className="flex justify-between"><span className="text-xs text-gray-500">IFSC Code</span><span className="text-sm font-mono text-gray-600">{acc.ifsc}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-sm font-medium text-gray-700">Balance</span><span className={`text-lg font-bold ${acc.balance>0?"text-green-600":"text-gray-500"}`}>{fmt(acc.balance)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Bank Account</h2>
              <button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              {[["Bank Name *","bankName","text","State Bank of India"],["Account No. *","accountNo","text","XXXX XXXX XXXX"],["IFSC Code","ifsc","text","SBIN0000000"],["Branch","branch","text","Branch Name"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Account Type</label>
                <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Current</option><option>Savings</option><option>OD</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Opening Balance (₹)</label><input type="number" placeholder="0.00" value={form.balance} onChange={(e)=>setForm(f=>({...f,balance:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Account</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
