import { Layout } from "@/components/Layout";
import { Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Payment { id: string; date: string; vendor: string; method: "Bank Transfer"|"Cash"|"Cheque"|"UPI"; amount: number; reference: string; status: "Completed"|"Pending"; }

const initial: Payment[] = [
  { id: "PAY-101", date: "20 Feb 2026", vendor: "Ravi Supplies Pvt Ltd", method: "Bank Transfer", amount: 3000, reference: "RTGS/2026/034", status: "Completed" },
  { id: "PAY-100", date: "18 Feb 2026", vendor: "Office Depot", method: "Cash", amount: 1400, reference: "CASH/2026/099", status: "Completed" },
  { id: "PAY-099", date: "14 Feb 2026", vendor: "Global Traders", method: "Cheque", amount: 2000, reference: "CHQ/2026/201", status: "Pending" },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const methodColor = (m: string) => m==="Bank Transfer"?"bg-blue-100 text-blue-800":m==="Cash"?"bg-green-100 text-green-800":m==="Cheque"?"bg-purple-100 text-purple-800":"bg-orange-100 text-orange-800";

export default function Payments() {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState<Payment[]>(initial);
  const [viewPay, setViewPay] = useState<Payment|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vendor:"", method:"Bank Transfer", amount:"", reference:"", date:"" });

  const filtered = payments.filter(
    (p) => p.id.toLowerCase().includes(search.toLowerCase())||p.vendor.toLowerCase().includes(search.toLowerCase())||p.reference.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.vendor||!form.amount) return;
    const id = `PAY-${102+payments.length}`;
    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    setPayments(prev=>[...prev,{id,date:form.date||today,vendor:form.vendor,method:form.method as any,amount:parseFloat(form.amount)||0,reference:form.reference,status:"Completed"}]);
    setForm({vendor:"",method:"Bank Transfer",amount:"",reference:"",date:""});
    setShowModal(false);
  };

  const totalPaid = payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
  const totalPending = payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0);

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Payments</h1><p className="text-sm text-gray-600">Vendor Payments & Disbursements</p></div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-t-4 border-t-blue-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Payments</p><p className="text-xl font-bold text-blue-600">{fmt(payments.reduce((s,p)=>s+p.amount,0))}</p></div>
          <div className="bg-green-50 border-t-4 border-t-green-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Completed</p><p className="text-xl font-bold text-green-600">{fmt(totalPaid)}</p></div>
          <div className="bg-orange-50 border-t-4 border-t-orange-500 rounded-lg p-4 shadow-sm"><p className="text-xs font-medium text-gray-600 uppercase mb-1">Pending</p><p className="text-xl font-bold text-orange-600">{fmt(totalPending)}</p></div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search payments..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>New Payment</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["Payment ID","Date","Vendor","Method","Reference","Amount","Status","Action"].map((h,i)=>(
                <th key={h} className={`px-4 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${i===5?"text-right":i===7?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p)=>(
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-primary">{p.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{p.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{p.vendor}</td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodColor(p.method)}`}>{p.method}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono text-xs">{p.reference}</td>
                  <td className="px-4 py-4 text-sm text-right font-semibold text-red-600">-{fmt(p.amount)}</td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status==="Completed"?"bg-green-100 text-green-800":"bg-orange-100 text-orange-800"}`}>{p.status}</span></td>
                  <td className="px-4 py-4 text-center"><button onClick={()=>setViewPay(p)} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-600"/></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">No payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">New Payment</h2><button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={form.method} onChange={(e)=>setForm(f=>({...f,method:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Bank Transfer","Cash","Cheque","UPI"].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              {[["Vendor *","vendor","text","Vendor Name"],["Amount (₹) *","amount","number","0.00"],["Reference","reference","text","REF/2026/001"],["Date","date","text","DD MMM YYYY"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5"><button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button><button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Record Payment</button></div>
          </div>
        </div>
      )}

      {viewPay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">{viewPay.id}</h2><button onClick={()=>setViewPay(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-2">
              {[["Date",viewPay.date],["Vendor",viewPay.vendor],["Method",viewPay.method],["Reference",viewPay.reference],["Amount",fmt(viewPay.amount)],["Status",viewPay.status]].map(([l,v])=>(
                <div key={l as string} className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs font-medium text-gray-500 uppercase">{l}</span><span className="text-sm font-semibold text-gray-900">{v}</span></div>
              ))}
            </div>
            <button onClick={()=>setViewPay(null)} className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
