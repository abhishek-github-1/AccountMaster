import { Layout } from "@/components/Layout";
import { Calendar, Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Booking { id: string; date: string; customer: string; description: string; amount: number; advance: number; status: "Confirmed"|"Pending"|"Cancelled"; deliveryDate: string; }

const initial: Booking[] = [
  { id: "BK-001", date: "21 Feb 2026", customer: "Mr. Brown", description: "Custom Furniture Order – 5 Units", amount: 75000, advance: 25000, status: "Confirmed", deliveryDate: "15 Mar 2026" },
  { id: "BK-002", date: "18 Feb 2026", customer: "Abhishek Sharma", description: "Office Chairs – 20 Pieces", amount: 40000, advance: 10000, status: "Pending", deliveryDate: "28 Feb 2026" },
  { id: "BK-003", date: "10 Feb 2026", customer: "Rajesh Julka", description: "Wooden Flooring – 500 sqft", amount: 125000, advance: 50000, status: "Confirmed", deliveryDate: "05 Apr 2026" },
  { id: "BK-004", date: "05 Feb 2026", customer: "Priya Mehta", description: "Modular Kitchen Setup", amount: 180000, advance: 60000, status: "Cancelled", deliveryDate: "01 Mar 2026" },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusColor = (s: string) => s==="Confirmed"?"bg-green-100 text-green-800":s==="Pending"?"bg-orange-100 text-orange-800":"bg-red-100 text-red-800";

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [viewBk, setViewBk] = useState<Booking|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All"|"Confirmed"|"Pending"|"Cancelled">("All");
  const [form, setForm] = useState({ customer:"", description:"", amount:"", advance:"", deliveryDate:"", status:"Confirmed" });

  const filtered = bookings.filter((b) => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase())||b.customer.toLowerCase().includes(search.toLowerCase())||b.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter==="All"||b.status===statusFilter;
    return matchSearch&&matchStatus;
  });

  const handleAdd = () => {
    if (!form.customer||!form.description||!form.amount) return;
    const id = `BK-${String(bookings.length+1).padStart(3,"0")}`;
    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    setBookings(prev=>[...prev,{id,date:today,customer:form.customer,description:form.description,amount:parseFloat(form.amount)||0,advance:parseFloat(form.advance)||0,status:form.status as any,deliveryDate:form.deliveryDate||"TBD"}]);
    setForm({customer:"",description:"",amount:"",advance:"",deliveryDate:"",status:"Confirmed"});
    setShowModal(false);
  };

  const confirmed = bookings.filter(b=>b.status==="Confirmed");
  const totalValue = confirmed.reduce((s,b)=>s+b.amount,0);
  const totalAdvance = bookings.reduce((s,b)=>s+b.advance,0);

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Bookings</h1><p className="text-sm text-gray-600">Customer Orders & Advance Bookings</p></div>

        <div className="grid grid-cols-4 gap-4">
          {[
            ["Total Bookings", bookings.length, "text-blue-600","bg-blue-50 border-t-blue-500"],
            ["Confirmed Value", fmt(totalValue), "text-green-600","bg-green-50 border-t-green-500"],
            ["Advances Received", fmt(totalAdvance), "text-orange-600","bg-orange-50 border-t-orange-500"],
            ["Pending Orders", bookings.filter(b=>b.status==="Pending").length, "text-purple-600","bg-purple-50 border-t-purple-500"],
          ].map(([label,val,tc,bg])=>(
            <div key={label as string} className={`${bg} border-t-4 rounded-lg p-4 shadow-sm`}><p className="text-xs font-medium text-gray-600 uppercase mb-1">{label}</p><p className={`text-xl font-bold ${tc}`}>{val}</p></div>
          ))}
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-48 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search by ID, Customer, Description..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["All","Confirmed","Pending","Cancelled"] as const).map((s)=>(
              <button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-2 text-xs font-medium transition-colors ${statusFilter===s?"bg-primary text-white":"bg-white text-gray-600 hover:bg-gray-50"}`}>{s}</button>
            ))}
          </div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>New Booking</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["Booking ID","Date","Customer","Description","Total Value","Advance","Delivery Date","Status","Action"].map((h,i)=>(
                <th key={h} className={`px-4 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${[4,5].includes(i)?"text-right":i===8?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b)=>(
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-primary">{b.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{b.date}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{b.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{b.description}</td>
                  <td className="px-4 py-4 text-sm text-right font-semibold text-gray-900">{fmt(b.amount)}</td>
                  <td className="px-4 py-4 text-sm text-right text-green-600 font-medium">{fmt(b.advance)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1"><Calendar size={12} className="text-gray-400"/>{b.deliveryDate}</td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span></td>
                  <td className="px-4 py-4 text-center"><button onClick={()=>setViewBk(b)} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-600"/></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">New Booking</h2><button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e)=>setForm(f=>({...f,status:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Confirmed","Pending","Cancelled"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              {[["Customer *","customer","text","Customer Name"],["Description *","description","text","Order Description"],["Total Value (₹) *","amount","number","0.00"],["Advance (₹)","advance","number","0.00"],["Delivery Date","deliveryDate","text","DD MMM YYYY"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5"><button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button><button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Create Booking</button></div>
          </div>
        </div>
      )}

      {viewBk && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">Booking {viewBk.id}</h2><button onClick={()=>setViewBk(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button></div>
            <div className="space-y-2">
              {[["Booking ID",viewBk.id],["Date",viewBk.date],["Customer",viewBk.customer],["Description",viewBk.description],["Total Value",fmt(viewBk.amount)],["Advance Paid",fmt(viewBk.advance)],["Balance Due",fmt(viewBk.amount-viewBk.advance)],["Delivery Date",viewBk.deliveryDate],["Status",viewBk.status]].map(([l,v])=>(
                <div key={l as string} className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs font-medium text-gray-500 uppercase">{l}</span><span className="text-sm font-semibold text-gray-900">{v}</span></div>
              ))}
            </div>
            <button onClick={()=>setViewBk(null)} className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
