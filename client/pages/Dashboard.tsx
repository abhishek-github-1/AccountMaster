import { Layout } from "@/components/Layout";
import { ArrowDownLeft, ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";

interface KPICard {
  title: string;
  value: number;
  subtitle: string;
  accent: "orange" | "blue" | "green" | "purple";
  trend?: string;
}

const kpiCards: KPICard[] = [
  { title: "Total Sales", value: 14950042.75, subtitle: "Sales A/c", accent: "orange", trend: "+12.4%" },
  { title: "Total Purchases", value: 3000.0, subtitle: "Purchase A/c", accent: "blue", trend: "+2.1%" },
  { title: "Net Profit", value: 14920042.75, subtitle: "Based on Income & Expenses", accent: "green", trend: "+15.2%" },
  { title: "Current Bank Balance", value: 1020000.0, subtitle: "SBI Bank A/c", accent: "purple", trend: "+2.0%" },
];

const recentActivity = [
  { date: "21 Feb 2026", transaction: "Sales Invoice", reference: "#INV-1023", amount: 12500, status: "Completed" as const },
  { date: "20 Feb 2026", transaction: "Purchase Bill", reference: "#BILL-458", amount: -1000, status: "Pending" as const },
  { date: "19 Feb 2026", transaction: "Bank Deposit", reference: "#TXN-8891", amount: 25000, status: "Completed" as const },
  { date: "18 Feb 2026", transaction: "Expense Payment", reference: "#EXP-332", amount: -1400, status: "Completed" as const },
  { date: "17 Feb 2026", transaction: "Customer Receipt", reference: "#REC-201", amount: 12500, status: "Completed" as const },
];

// Monthly data for mini bar chart
const monthlyData = [
  { month: "Sep", sales: 320000, purchases: 80000 },
  { month: "Oct", sales: 410000, purchases: 120000 },
  { month: "Nov", sales: 290000, purchases: 90000 },
  { month: "Dec", sales: 580000, purchases: 150000 },
  { month: "Jan", sales: 760000, purchases: 200000 },
  { month: "Feb", sales: 14950042, purchases: 3000 },
];

const accentColors = {
  orange: { border: "border-t-orange-500", text: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
  blue: { border: "border-t-blue-500", text: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  green: { border: "border-t-green-500", text: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  purple: { border: "border-t-purple-500", text: "text-purple-600", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700" },
};

const fmt = (n: number) => `₹ ${Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const KPICard = ({ card }: { card: KPICard }) => {
  const colors = accentColors[card.accent];
  return (
    <div className={`${colors.bg} border-t-4 ${colors.border} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
        <TrendingUp size={18} className={colors.text} opacity={0.5} />
      </div>
      <p className={`text-2xl font-bold ${colors.text} mb-1`}>
        ₹ {Math.abs(card.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">{card.subtitle}</p>
        {card.trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>{card.trend}</span>
        )}
      </div>
    </div>
  );
};

// Simple inline bar chart using divs
const MiniBarChart = () => {
  const maxVal = Math.max(...monthlyData.map(d => d.sales));
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Monthly Overview</h2>
          <p className="text-xs text-gray-500">Sales vs Purchases (FY 2025–26)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" />Sales</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />Purchases</span>
        </div>
      </div>
      <div className="flex items-end gap-3 h-36">
        {monthlyData.map((d) => {
          const salesH = Math.max(4, (d.sales / maxVal) * 100);
          const purchH = Math.max(4, (d.purchases / maxVal) * 100);
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5 h-28">
                <div className="flex-1 bg-orange-400 rounded-t transition-all" style={{ height: `${salesH}%` }} title={`Sales: ₹${d.sales.toLocaleString("en-IN")}`} />
                <div className="flex-1 bg-blue-400 rounded-t transition-all" style={{ height: `${purchH}%` }} title={`Purchases: ₹${d.purchases.toLocaleString("en-IN")}`} />
              </div>
              <span className="text-xs text-gray-500">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Cash flow donut-style summary
const CashFlowSummary = () => {
  const inflow = 14950042.75 + 25000 + 12500;
  const outflow = 3000 + 1400;
  const net = inflow - outflow;
  const inflowPct = Math.round((inflow / (inflow + outflow)) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Cash Flow</h2>
          <p className="text-xs text-gray-500">Current period summary</p>
        </div>
        <BarChart3 size={20} className="text-gray-400" />
      </div>

      {/* Visual bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${inflowPct}%` }} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowDownLeft size={14} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Total Inflow</span>
          </div>
          <span className="text-sm font-bold text-green-600">{fmt(inflow)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowUpRight size={14} className="text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Total Outflow</span>
          </div>
          <span className="text-sm font-bold text-red-600">-{fmt(outflow)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <span className="text-sm font-semibold text-gray-800">Net Cash Flow</span>
          <span className="text-sm font-bold text-blue-600">{fmt(net)}</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Dushyant Enterprises — Financial Overview</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Financial Year</p>
            <p className="text-sm font-semibold text-gray-700">2025 – 2026</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiCards.map((card, idx) => <KPICard key={idx} card={card} />)}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><MiniBarChart /></div>
          <CashFlowSummary />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <span className="text-xs text-gray-400">{recentActivity.length} transactions</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Date","Transaction","Reference","Amount","Status"].map((h,i)=>(
                    <th key={h} className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${i===3?"text-right":""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentActivity.map((activity, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{activity.transaction}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{activity.reference}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      <span className={activity.amount > 0 ? "text-green-600" : "text-red-500"}>
                        {activity.amount > 0 ? "+" : "-"}{fmt(activity.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "New Invoice", path: "/invoices", color: "bg-orange-500 hover:bg-orange-600" },
              { label: "New Bill", path: "/bills", color: "bg-blue-500 hover:bg-blue-600" },
              { label: "Record Receipt", path: "/receipts", color: "bg-green-500 hover:bg-green-600" },
              { label: "Record Payment", path: "/payments", color: "bg-purple-500 hover:bg-purple-600" },
            ].map((item) => (
              <a key={item.label} href={item.path} className={`${item.color} text-white text-sm font-semibold py-3 px-4 rounded-lg text-center transition-colors`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
