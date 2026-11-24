import { Link } from 'react-router-dom';
import { UserPlus, ListChecks, Users, UserCog } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useAnalytics from '../hooks/useAnalytics.js';
import StatsCards from '../components/analytics/StatsCards.jsx';
import BatchPieChart from '../components/analytics/BatchPieChart.jsx';
import RevenueChart from '../components/analytics/RevenueChart.jsx';
import PlanRevenueChart from '../components/analytics/PlanRevenueChart.jsx';
import RecentAdmissionsTable from '../components/analytics/RecentAdmissionsTable.jsx';

const menu = [
  { to: '/dashboard/admission', label: 'New Admission', icon: UserPlus, tint: 'bg-accent/15 text-accent' },
  { to: '/dashboard/members', label: 'Members', icon: Users, tint: 'bg-blue-500/15 text-blue-400' },
  { to: '/dashboard/plans', label: 'Plans', icon: ListChecks, tint: 'bg-emerald-500/15 text-emerald-400' },
  { to: '/dashboard/profile', label: 'Profile', icon: UserCog, tint: 'bg-purple-500/15 text-purple-400' },
];

const AnalyticsPage = () => {
  const { admin } = useAuth();
  const { overview, revenue, revenueByPlan, recentAdmissions } = useAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hi, {admin?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Analytics · gym performance and cash revenue</p>
      </div>

      {/* App-style quick menu (phones) */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {menu.map(({ to, label, icon: Icon, tint }) => (
          <Link key={to} to={to} className="bg-navy-800 border border-navy-700 rounded-2xl p-4 flex flex-col items-start gap-3 active:scale-[0.98] transition-transform">
            <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${tint}`}><Icon size={22} /></span>
            <span className="text-white font-medium text-sm">{label}</span>
          </Link>
        ))}
      </div>

      <StatsCards data={overview.data} loading={overview.loading} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue.data} loading={revenue.loading} />
        </div>
        <BatchPieChart data={overview.data} loading={overview.loading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PlanRevenueChart data={revenueByPlan.data} loading={revenueByPlan.loading} />
        <RecentAdmissionsTable data={recentAdmissions.data} loading={recentAdmissions.loading} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
