import { Layout } from "@/components/Layout";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Customer { id: string; name: string; phone: string; email: string; city: string; balance: number; }

const initial: Customer[] = [
  { id: "C001", name: "Mr. Brown", phone: "+91 98100 00001", email: "brown@example.com", city: "Delhi", balance: 1492389 },
  { id: "C002", name: "Abhishek Sharma", phone: "+91 98100 00002", email: "abhishek@example.com", city: "Mumbai", balance: 0 },
  { id: "C003", name: "Rajesh Julka", phone: "+91 98100 00003", email: "rajesh@example.com", city: "Jaipur", balance: 0 },
];

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Customer() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", balance: "" });

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name) return;
    const id = `C${String(customers.length + 1).padStart(3, "0")}`;
    setCustomers((prev) => [...prev, { id, name: form.name, phone: form.phone, email: form.email, city: form.city, balance: parseFloat(form.balance) || 0 }]);
    setForm({ name: "", phone: "", email: "", city: "", balance: "" });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-gray-900 mb-1">Customers</h1><p className="text-sm text-gray-600">All Customer Accounts</p></div>

        <div className="grid grid-cols-3 gap-4">
          {[["Total Customers", customers.length, "text-blue-600", "bg-blue-50 border-t-blue-500"],
            ["Outstanding Balance", fmt(customers.reduce((s,c)=>s+c.balance,0)), "text-orange-600", "bg-orange-50 border-t-orange-500"],
            ["Active Accounts", customers.filter(c=>c.balance>0).length, "text-green-600", "bg-green-50 border-t-green-500"]
          ].map(([label, val, tc, bg]) => (
            <div key={label as string} className={`${bg} border-t-4 rounded-lg p-4 shadow-sm`}>
              <p className="text-xs font-medium text-gray-600 uppercase mb-1">{label}</p>
              <p className={`text-xl font-bold ${tc}`}>{val}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by Name, ID, City..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
            <Plus size={18} /> Add Customer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              {["ID","Name","Phone","Email","City","Balance","Action"].map((h,i)=>(
                <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-900 uppercase tracking-wider ${i===5?"text-right":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{c.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.city}</td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${c.balance>0?"text-green-600":"text-gray-500"}`}>{fmt(c.balance)}</td>
                  <td className="px-6 py-4 text-center"><button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical size={16} className="text-gray-600" /></button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Customer</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[["Name *","name","text","Full Name"],["Phone","phone","text","+91 98100 00000"],["Email","email","email","email@example.com"],["City","city","text","City"],["Opening Balance (₹)","balance","number","0.00"]].map(([label,key,type,ph])=>(
                <div key={key as string}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label><input type={type as string} placeholder={ph as string} value={(form as any)[key as string]} onChange={(e)=>setForm(f=>({...f,[key as string]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
