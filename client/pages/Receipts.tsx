import { Layout } from "@/components/Layout";
import { Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Receipt { id: string; date: string; customer: string; method: "Bank Transfer"|"Cash"|"Cheque"|"UPI"; amount: number; reference: string; invoice: string; }

const initial: Receipt[] = [
  { id: "REC-201", date: "19 Feb 2026", customer: "Mr. Brown", method: "Bank Transfer", amount: 12500, reference: "NEFT/2026/112", invoice: "INV-1023" },
  { id: "REC-200", date: "10 Feb 2026", customer: "Abhishek Sharma", method: "UPI", amount: 5000, reference: "UPI/2026/445", invoice: "INV-1022" },
  { id: "REC-199", date: "05 Feb 2026", customer: "Rajesh Julka", method: "Cheque", amount: 500000, reference: "CHQ/2026/301", invoice: "INV-1021" },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const methodColor = (m: string) => m==="Bank Transfer"?"bg-blue-100 text-blue-800":m==="Cash"?"bg-green-100 text-green-800":m==="Cheque"?"bg-purple-100 text-purple-800":"bg-orange-100 text-orange-800";

export default function Receipts() {
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>(initial);
  const [viewRec, setViewRec] = useState<Receipt|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer:"", method:"Bank Transfer", amount:"", reference:"", invoice:"", date:"" });

  const filtered = receipts.filter(
    (r) => r.id.toLowerCase().includes(search.toLowerCase())||r.customer.toLowerCase().includes(search.toLowerCase())||r.invoice.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.customer||!form.amount) return;
    const id = `REC-${202+receipts.length}`;
    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    setReceipts(prev=>[...prev,{id,date:form.date||today,customer:form.customer,method:form.method as any,amount:parseFloat(form.amount)||0,reference:form.reference,invoice:form.invoice}]);
    setForm({customer:"",method:"Bank Transfer",amount:"",reference:"",invoice:"",date:""});
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Receipts</h1><p className="text-sm text-gray-600">Customer Receipts & Collections</p></div>

        <div className="grid grid-cols-3 gap-4">
          {[["Total Received", fmt(receipts.reduce((s,r)=>s+r.amount,0)), "text-green-600","bg-green-50 border-t-green-500"],
            ["Receipts Count", receipts.length, "text-blue-600","bg-blue-50 border-t-blue-500"],
            ["Avg. Receipt", fmt(receipts.reduce((s,r)=>s+r.amount,0)/receipts.length), "text-purple-600","bg-purple-50 border-t-purple-500"]
          ].map(([label,val,tc,bg])=>(
            <div key={label as string} className={`${bg} border-t-4 rounded-lg p-4 shadow-sm`}><p className="text-xs font-medium text-gray-600 uppercase mb-1">{label}</p><p className={`text-xl font-bold ${tc}`}>{val}</p></div>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search receipts..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>New Receipt</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["Receipt ID","Date","Customer","Method","Reference","Invoice","Amount","Action"].map((h,i)=>(
                <th key={h} className={`px-4 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${i===6?"text-right":i===7?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r)=>(
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-primary">{r.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.customer}</td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodColor(r.method)}`}>{r.method}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono text-xs">{r.reference}</td>
                  <td className="px-4 py-4 text-sm text-primary font-medium">{r.invoice}</td>
                  <td className="px-4 py-4 text-sm text-right font-semibold text-green-600">+{fmt(r.amount)}</td>
                  <td className="px-4 py-4 text-center"><button onClick={()=>setViewRec(r)} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-600"/></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">No receipts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">New Receipt</h2><button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={form.method} onChange={(e)=>setForm(f=>({...f,method:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Bank Transfer","Cash","Cheque","UPI"].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              {[["Customer *","customer","text","Customer Name"],["Amount (₹) *","amount","number","0.00"],["Reference","reference","text","NEFT/2026/001"],["Invoice No.","invoice","text","INV-1024"],["Date","date","text","DD MMM YYYY"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5"><button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button><button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Record Receipt</button></div>
          </div>
        </div>
      )}

      {viewRec && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">{viewRec.id}</h2><button onClick={()=>setViewRec(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-2">
              {[["Date",viewRec.date],["Customer",viewRec.customer],["Method",viewRec.method],["Reference",viewRec.reference],["Invoice",viewRec.invoice],["Amount",fmt(viewRec.amount)]].map(([l,v])=>(
                <div key={l as string} className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs font-medium text-gray-500 uppercase">{l}</span><span className="text-sm font-semibold text-gray-900">{v}</span></div>
              ))}
            </div>
            <button onClick={()=>setViewRec(null)} className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
