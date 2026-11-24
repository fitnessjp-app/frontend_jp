import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const COLORS = ['#ff7a1a', '#4f6bff'];

const BatchPieChart = ({ data, loading }) => {
  if (loading) return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-72"><Loader full /></div>;
  if (!data) return <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 h-72"><EmptyState title="No data" /></div>;

  const chartData = [
    { name: 'Morning', value: data.morningBatchCount },
    { name: 'Evening', value: data.eveningBatchCount },
  ];

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Batch Split</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#161d2e', border: '1px solid #1f2940', borderRadius: 8, color: '#fff' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BatchPieChart;
