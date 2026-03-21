"use client"

import { LayoutDashboard, Wallet, PiggyBank, Target, BarChart3, TrendingUp, Home, Utensils, Bookmark } from "lucide-react"

// Sidebar Logo
function SidebarLogo() {
  return (
    <div className="flex items-center justify-center py-4 pr-1">
      <img 
        src="/images/logo_d_bg.jpg" 
        alt="VibeLedger Logo" 
        className="h-24 w-auto"
      />
    </div>
  )
}

// Sidebar Navigation Item
function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-[#F97354] text-white" : "text-white hover:bg-slate-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

// Sidebar Decorative Shapes
function SidebarDecoration() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
      {/* Yellow large shape */}
      <div className="absolute bottom-8 left-4 w-20 h-20 bg-yellow-400 rounded-sm rotate-12" />
      {/* Coral shape */}
      <div className="absolute bottom-20 right-4 w-16 h-16 bg-[#F97354] rounded-full" />
      {/* Navy shape */}
      <div className="absolute bottom-4 right-8 w-12 h-12 bg-slate-900 rounded-sm -rotate-12" />
      {/* Yellow small person icon */}
      <div className="absolute bottom-16 left-8 flex flex-col items-center">
        <div className="w-6 h-6 bg-yellow-400 rounded-full" />
        <div className="w-10 h-8 bg-yellow-400 rounded-t-full mt-1" />
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar() {
  return (
    <div className="w-56 bg-slate-800 min-h-screen relative flex flex-col">
      <SidebarLogo />
      <nav className="flex flex-col gap-1 mt-4">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={Wallet} label="Accounts" />
        <NavItem icon={PiggyBank} label="Budgets" />
        <NavItem icon={Target} label="Goals" />
        <NavItem icon={BarChart3} label="Analytics" />
      </nav>
      <SidebarDecoration />
    </div>
  )
}

// Header with avatars
function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-slate-800">Abstract Energy</h1>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

// Stat Card - Total Balance (Orange)
function TotalBalanceCard() {
  return (
    <div className="bg-[#F97354] rounded-xl p-5 text-white relative overflow-hidden col-span-2">
      <div className="relative z-10">
        <p className="text-white/90 text-sm mb-1">Total Balance</p>
        <p className="text-3xl font-bold">$1,675.52</p>
      </div>
      {/* Chart decoration */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
          <path d="M10 50 L30 30 L50 40 L70 20 L90 10" stroke="#FBBF24" strokeWidth="3" fill="none" />
          <path d="M70 20 L90 10 L90 20 L70 20" fill="#FBBF24" />
          {/* Bar chart */}
          <rect x="60" y="35" width="8" height="25" fill="#1e3a5f" />
          <rect x="72" y="25" width="8" height="35" fill="#FBBF24" />
          <rect x="84" y="30" width="8" height="30" fill="#1e3a5f" />
        </svg>
      </div>
    </div>
  )
}

// Small Stat Card
function StatCard({ title, value, chart }: { title: string; value: string; chart?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  )
}

// Mini Line Chart SVG
function MiniLineChart({ color = "#F97354" }: { color?: string }) {
  return (
    <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
      <path
        d="M0 25 Q20 20 30 15 T60 20 T90 10 T120 15"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M0 25 Q20 20 30 15 T60 20 T90 10 T120 15 L120 30 L0 30 Z"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  )
}

// Savings Goal Card
function SavingsGoalCard() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">Savings Goal Status</p>
      <p className="text-2xl font-bold text-slate-800">80.7%</p>
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#F97354] rounded-full" style={{ width: "80.7%" }} />
        </div>
        <p className="text-xs text-slate-500 mt-1">Savings Goal: $1,000</p>
      </div>
    </div>
  )
}

// Monthly Spending Trend Chart
function MonthlySpendingTrend() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Dec"]
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Monthly Spending Trend</h3>
        <button className="text-[#F97354] text-sm font-medium">View all</button>
      </div>
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-500">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        {/* Chart area */}
        <div className="ml-10 h-40 relative">
          <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
            {/* Coral/Orange area */}
            <path
              d="M0 140 Q40 120 80 100 T160 80 T240 60 T320 80 T400 100 L400 160 L0 160 Z"
              fill="#F97354"
              fillOpacity="0.8"
            />
            {/* Yellow area */}
            <path
              d="M0 160 Q40 140 80 120 T160 100 T240 80 T320 100 T400 120 L400 160 L0 160 Z"
              fill="#FBBF24"
              fillOpacity="0.9"
            />
            {/* Navy bars */}
            <rect x="20" y="90" width="20" height="70" fill="#1e3a5f" />
            <rect x="60" y="100" width="20" height="60" fill="#1e3a5f" />
            <rect x="100" y="80" width="20" height="80" fill="#1e3a5f" />
            <rect x="140" y="70" width="20" height="90" fill="#1e3a5f" />
            <rect x="180" y="60" width="20" height="100" fill="#1e3a5f" />
            <rect x="220" y="50" width="20" height="110" fill="#1e3a5f" />
            <rect x="260" y="70" width="20" height="90" fill="#1e3a5f" />
            <rect x="300" y="90" width="20" height="70" fill="#1e3a5f" />
            <rect x="340" y="80" width="20" height="80" fill="#1e3a5f" />
            <rect x="380" y="100" width="20" height="60" fill="#1e3a5f" />
          </svg>
        </div>
        {/* X-axis labels */}
        <div className="ml-10 flex justify-between text-xs text-slate-500 mt-2">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Budget Status Panel
function BudgetStatus() {
  const items = [
    { label: "Budget Status", value: "100%", progress: 100, color: "#3B82F6" },
    { label: "Budget Incom", value: "$30.00", progress: 100, color: "#FBBF24" },
    { label: "Total Expenses", value: "$17.00", progress: 60, color: "#F97354" },
    { label: "Savings Goal", value: "100%", progress: 100, color: "#3B82F6" },
  ]

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Budget Status</h3>
        <button className="text-[#F97354] text-sm font-medium">View all</button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-800">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.progress}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Recent Transactions Table
function RecentTransactions() {
  const transactions = [
    { date: "08/12/23", description: "Conver-transations", category: "food", amount: "-$30.00", icon: Utensils, iconBg: "#FBBF24" },
    { date: "03/12/23", description: "Good darrans", category: "housing", amount: "-$12.00", icon: Home, iconBg: "#F97354" },
    { date: "28/12/23", description: "Placking former", category: "food", amount: "-$10.00", icon: Utensils, iconBg: "#F97354" },
    { date: "13/12/23", description: "Placking fun", category: "housing", amount: "-$22.00", icon: Home, iconBg: "#FBBF24" },
  ]

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        <button className="text-[#F97354] text-sm font-medium">See all</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-slate-500">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-t border-gray-100">
              <td className="py-3 text-sm text-slate-600">{tx.date}</td>
              <td className="py-3 text-sm text-slate-800">{tx.description}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: tx.iconBg }}
                  >
                    <tx.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-600">{tx.category}</span>
                </div>
              </td>
              <td className="py-3 text-sm text-slate-800 text-right font-medium">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Top Spending Categories Chart
function TopSpendingCategories() {
  const categories = [
    { name: "seaving", color: "#F97354", icon: Bookmark },
    { name: "housing", color: "#1e3a5f", icon: Home },
    { name: "food", color: "#FBBF24", icon: Utensils },
  ]

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Top Spending Categories</h3>
        <button className="text-[#F97354] text-sm font-medium">See all</button>
      </div>
      <div className="flex gap-4">
        {/* Bar Chart */}
        <div className="flex-1">
          <div className="relative h-40">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-slate-500">
              <span>$250</span>
              <span>$200</span>
              <span>$150</span>
              <span>$100</span>
              <span>$50</span>
              <span>0</span>
            </div>
            {/* Bars */}
            <div className="ml-10 h-32 flex items-end gap-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, idx) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-0.5">
                    <div className="w-full bg-[#FBBF24]" style={{ height: `${20 + idx * 5}px` }} />
                    <div className="w-full bg-[#1e3a5f]" style={{ height: `${30 + idx * 8}px` }} />
                    <div className="w-full bg-[#F97354]" style={{ height: `${15 + idx * 3}px` }} />
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-3 justify-center">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: cat.color }}
              >
                <cat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        
        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <TotalBalanceCard />
          <StatCard title="Total Income" value="$2,293.31" chart={<MiniLineChart color="#F97354" />} />
          <StatCard title="Total Expenses" value="$384.90" chart={<MiniLineChart color="#F97354" />} />
          <SavingsGoalCard />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MonthlySpendingTrend />
          <BudgetStatus />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4">
          <RecentTransactions />
          <TopSpendingCategories />
        </div>
      </main>
    </div>
  )
}
