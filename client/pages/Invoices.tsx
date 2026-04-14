import { Layout } from "@/components/Layout";
import { Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Invoice { id: string; date: string; customer: string; amount: number; tax: number; total: number; status: "Paid"|"Pending"|"Overdue"; dueDate: string; }

const initial: Invoice[] = [
  { id: "INV-1023", date: "21 Feb 2026", customer: "Mr. Brown", amount: 10593.22, tax: 1906.78, total: 12500, status: "Paid", dueDate: "07 Mar 2026" },
  { id: "INV-1022", date: "19 Feb 2026", customer: "Abhishek Sharma", amount: 6610.17, tax: 1189.83, total: 7800, status: "Pending", dueDate: "06 Mar 2026" },
  { id: "INV-1021", date: "15 Feb 2026", customer: "Rajesh Julka", amount: 12644103.18, tax: 2275939.57, total: 14920042.75, status: "Paid", dueDate: "01 Mar 2026" },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusColor = (s: string) => s==="Paid"?"bg-green-100 text-green-800":s==="Pending"?"bg-orange-100 text-orange-800":"bg-red-100 text-red-800";

export default function Invoices() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(initial);
  const [viewInv, setViewInv] = useState<Invoice|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer: "", amount: "", tax: "", dueDate: "" });

  const filtered = invoices.filter(
    (i) => i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.toLowerCase().includes(search.toLowerCase()) ||
      i.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.customer || !form.amount) return;
    const amt = parseFloat(form.amount) || 0;
    const tax = parseFloat(form.tax) || 0;
    const id = `INV-${1000 + invoices.length + 1}`;
    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    setInvoices(prev=>[...prev,{id,date:today,customer:form.customer,amount:amt,tax,total:amt+tax,status:"Pending",dueDate:form.dueDate||"TBD"}]);
    setForm({customer:"",amount:"",tax:"",dueDate:""});
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Invoices</h1><p className="text-sm text-gray-600">All Sales Invoices</p></div>

        <div className="grid grid-cols-3 gap-4">
          {[["Total Invoiced", fmt(invoices.reduce((s,i)=>s+i.total,0)), "text-blue-600","bg-blue-50 border-t-blue-500"],
            ["Collected", fmt(invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.total,0)), "text-green-600","bg-green-50 border-t-green-500"],
            ["Outstanding", fmt(invoices.filter(i=>i.status!=="Paid").reduce((s,i)=>s+i.total,0)), "text-orange-600","bg-orange-50 border-t-orange-500"]
          ].map(([label,val,tc,bg])=>(
            <div key={label as string} className={`${bg} border-t-4 rounded-lg p-4 shadow-sm`}>
              <p className="text-xs font-medium text-gray-600 uppercase mb-1">{label}</p>
              <p className={`text-xl font-bold ${tc}`}>{val}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by Invoice No., Customer, Status..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>New Invoice</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["Invoice No.","Date","Customer","Amount","Tax","Total","Due Date","Status","Action"].map((h,i)=>(
                <th key={h} className={`px-4 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${[3,4,5].includes(i)?"text-right":i===8?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv)=>(
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{inv.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{inv.customer}</td>
                  <td className="px-4 py-4 text-sm text-right text-gray-900">{fmt(inv.amount)}</td>
                  <td className="px-4 py-4 text-sm text-right text-gray-600">{fmt(inv.tax)}</td>
                  <td className="px-4 py-4 text-sm text-right font-semibold text-gray-900">{fmt(inv.total)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{inv.dueDate}</td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{inv.status}</span></td>
                  <td className="px-4 py-4 text-center"><button onClick={()=>setViewInv(inv)} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-600"/></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">No invoices found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">New Invoice</h2>
              <button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              {[["Customer *","customer","text","Customer Name"],["Amount (₹) *","amount","number","0.00"],["Tax (₹)","tax","number","0.00"],["Due Date","dueDate","text","DD MMM YYYY"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {viewInv && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Invoice {viewInv.id}</h2>
              <button onClick={()=>setViewInv(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-2">
              {[["Date",viewInv.date],["Customer",viewInv.customer],["Amount",fmt(viewInv.amount)],["Tax",fmt(viewInv.tax)],["Total",fmt(viewInv.total)],["Due Date",viewInv.dueDate],["Status",viewInv.status]].map(([label,value])=>(
                <div key={label as string} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setViewInv(null)} className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
