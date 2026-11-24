import { Users, Sunrise, Moon, CheckCircle, Clock, XCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { SkeletonCard } from '../common/Loader.jsx';

const StatsCards = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'Total Members', value: data.totalMembers, icon: Users, color: 'text-blue-400 bg-blue-500/15' },
    { label: 'Morning Batch', value: data.morningBatchCount, icon: Sunrise, color: 'text-amber-400 bg-amber-500/15' },
    { label: 'Evening Batch', value: data.eveningBatchCount, icon: Moon, color: 'text-indigo-400 bg-indigo-500/15' },
    { label: 'Active', value: data.activeCount, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/15' },
    { label: 'Expiring Soon', value: data.expiringSoonCount, icon: Clock, color: 'text-amber-400 bg-amber-500/15' },
    { label: 'Expired', value: data.expiredCount, icon: XCircle, color: 'text-red-400 bg-red-500/15' },
    { label: "This Month's Revenue", value: formatCurrency(data.currentMonthRevenue), icon: Wallet, color: 'text-accent bg-accent/15' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
            <Icon size={18} />
          </div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
