import { Home, Utensils } from 'lucide-react';

export function RecentTransactions() {
  const transactions = [
    {
      date: '08/12/23',
      description: 'Conver-transations',
      category: 'food',
      amount: '-₩30.00',
      icon: Utensils,
      iconBg: 'var(--color-brand-yellow)',
    },
    {
      date: '03/12/23',
      description: 'Good darrans',
      category: 'housing',
      amount: '-₩12.00',
      icon: Home,
      iconBg: 'var(--color-brand-coral)',
    },
    {
      date: '28/12/23',
      description: 'Placking former',
      category: 'food',
      amount: '-₩10.00',
      icon: Utensils,
      iconBg: 'var(--color-brand-coral)',
    },
    {
      date: '13/12/23',
      description: 'Placking fun',
      category: 'housing',
      amount: '-₩22.00',
      icon: Home,
      iconBg: 'var(--color-brand-yellow)',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        <button className="text-brand-coral text-sm font-medium">
          See all
        </button>
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
              <td className="py-3 text-sm text-slate-800 text-right font-medium">
                {tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
