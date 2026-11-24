import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const COLORS = ['#ff7a1a', '#4f6bff', '#22c55e', '#eab308', '#a855f7', '#ef4444'];

const PlanRevenueChart = ({ data, loading }) => {
  if (loading) return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-80"><Loader full /></div>;
  if (!data || data.length === 0) {
    return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-80"><EmptyState title="No revenue data yet" /></div>;
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Revenue by Plan</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="totalRevenue" nameKey="planName" outerRadius={90}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#161d2e', border: '1px solid #1f2940', borderRadius: 8, color: '#fff' }}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlanRevenueChart;
