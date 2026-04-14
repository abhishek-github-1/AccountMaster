import { Layout } from "@/components/Layout";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Vendor { id: string; name: string; phone: string; email: string; city: string; balance: number; gst: string; }

const initial: Vendor[] = [
  { id: "V001", name: "Ravi Supplies Pvt Ltd", phone: "+91 91000 11111", email: "ravi@supplies.com", city: "Delhi", balance: 3000, gst: "07AABCS1429B1Z1" },
  { id: "V002", name: "Global Traders", phone: "+91 91000 22222", email: "info@globaltraders.in", city: "Noida", balance: 0, gst: "09AAACG1234A1ZX" },
  { id: "V003", name: "Prime Materials Co.", phone: "+91 91000 33333", email: "prime@materials.co", city: "Gurgaon", balance: 0, gst: "06AADCP5678B2ZY" },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Vendors() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", balance: "", gst: "" });

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.id.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name) return;
    const id = `V${String(vendors.length + 1).padStart(3, "0")}`;
    setVendors(prev => [...prev, { id, name: form.name, phone: form.phone, email: form.email, city: form.city, balance: parseFloat(form.balance) || 0, gst: form.gst }]);
    setForm({ name: "", phone: "", email: "", city: "", balance: "", gst: "" });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Vendors</h1><p className="text-sm text-gray-600">All Vendor Accounts</p></div>

        <div className="grid grid-cols-3 gap-4">
          {[["Total Vendors", vendors.length, "text-blue-600", "bg-blue-50 border-t-blue-500"],
            ["Total Payable", fmt(vendors.reduce((s,v)=>s+v.balance,0)), "text-red-600", "bg-red-50 border-t-red-500"],
            ["Cleared Accounts", vendors.filter(v=>v.balance===0).length, "text-green-600", "bg-green-50 border-t-green-500"]
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
            <input type="text" placeholder="Search by Name, ID, City..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
          </div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"><Plus size={18}/>Add Vendor</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["ID","Name","Phone","Email","City","GST No.","Balance","Action"].map((h,i)=>(
                <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${i===6?"text-right":i===7?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((v)=>(
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{v.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{v.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{v.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{v.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{v.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{v.gst||"—"}</td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${v.balance>0?"text-red-600":"text-gray-500"}`}>{fmt(v.balance)}</td>
                  <td className="px-6 py-4 text-center"><button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical size={16} className="text-gray-600"/></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">No vendors found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Vendor</h2>
              <button onClick={()=>setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              {[["Name *","name","text","Vendor Name"],["Phone","phone","text","+91 00000 00000"],["Email","email","email","email@vendor.com"],["City","city","text","City"],["GST No.","gst","text","GSTIN Number"],["Opening Balance (₹)","balance","number","0.00"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Vendor</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
