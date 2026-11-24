import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const RevenueChart = ({ data, loading }) => {
  if (loading) return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-80"><Loader full /></div>;
  if (!data || data.length === 0) {
    return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-80"><EmptyState title="No revenue data yet" /></div>;
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Revenue — Last 6 Months</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2940" vertical={false} />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            contentStyle={{ background: '#161d2e', border: '1px solid #1f2940', borderRadius: 8, color: '#fff' }}
            formatter={(value) => [formatCurrency(value), 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#ff7a1a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
