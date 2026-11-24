import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import PhotoViewer from '../common/PhotoViewer.jsx';
import { SkeletonBlock } from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const RecentAdmissionsTable = ({ data, loading }) => (
  <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <h3 className="text-white font-semibold text-sm">Recent Admissions</h3>
      <Link to="/dashboard/members" className="text-xs text-accent hover:underline">View all</Link>
    </div>

    {loading ? (
      <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-14" />)}</div>
    ) : !data || data.length === 0 ? (
      <EmptyState title="No admissions yet" />
    ) : (
      <ul className="divide-y divide-navy-700/60">
        {data.map((m) => (
          <li key={m._id} className="flex items-center gap-3 px-5 py-3">
            <PhotoViewer src={m.photo} name={m.name} className="h-12 w-10 rounded-lg" iconSize={16} />
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium text-sm truncate">{m.name}</p>
              <p className="text-gray-500 text-xs truncate">{m.plan?.name || '—'} · <span className="capitalize">{m.batch}</span></p>
            </div>
            <p className="text-gray-400 text-xs shrink-0">{formatDate(m.admissionDate)}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentAdmissionsTable;
