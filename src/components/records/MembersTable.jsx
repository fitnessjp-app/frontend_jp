import { ChevronUp, ChevronDown } from 'lucide-react';
import PhotoViewer from '../common/PhotoViewer.jsx';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from './StatusBadge.jsx';
import MemberActions from './MemberActions.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { SkeletonBlock } from '../common/Loader.jsx';

const Avatar = ({ m, className = 'h-10 w-10 rounded-full' }) => (
  <PhotoViewer src={m.photo} name={m.name} className={className} iconSize={16} />
);

// Column header that toggles the sort when clicked.
const SortTh = ({ label, asc, desc, sort, onSort }) => {
  const isAsc = sort === asc;
  const isDesc = sort === desc;
  return (
    <th className="px-4 py-3 font-medium">
      <button onClick={() => onSort(isAsc ? desc : asc)} className={`inline-flex items-center gap-1 hover:text-white ${isAsc || isDesc ? 'text-accent' : ''}`}>
        {label}
        {isAsc && <ChevronUp size={13} />}
        {isDesc && <ChevronDown size={13} />}
      </button>
    </th>
  );
};

const MembersTable = ({ members, loading, sort, onSort, ...actions }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} className="h-20 md:h-14" />)}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-xl">
        <EmptyState title="No members found" description="Try a different name/number or clear the filters." />
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-navy-700">
                <SortTh label="Member" asc="name_asc" desc="name_desc" sort={sort} onSort={onSort} />
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <SortTh label="Admission" asc="oldest" desc="newest" sort={sort} onSort={onSort} />
                <SortTh label="Expiry" asc="expiry_soon" desc="expiry_late" sort={sort} onSort={onSort} />
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-b border-navy-700/60 last:border-0 hover:bg-navy-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar m={m} />
                      <span className="text-white font-medium whitespace-nowrap">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{m.phone}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{m.batch}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{m.plan?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(m.admissionDate)}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(m.expiryDate)}</td>
                  <td className="px-4 py-3"><StatusBadge member={m} /></td>
                  <td className="px-4 py-3"><div className="flex justify-end"><MemberActions member={m} {...actions} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {members.map((m) => (
          <div key={m._id} className="bg-navy-800 border border-navy-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Avatar m={m} className="h-24 w-20 rounded-xl" />
              <div className="min-w-0 flex-1">
                <button onClick={() => actions.onView(m)} className="text-white font-semibold block max-w-full text-left break-words">{m.name}</button>
                <p className="text-gray-400 text-sm mt-0.5">{m.phone}</p>
                <p className="text-gray-500 text-xs capitalize mt-0.5">{m.batch} batch</p>
                <div className="mt-2"><StatusBadge member={m} /></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-navy-700 text-xs">
              <div><p className="text-gray-500">Plan</p><p className="text-gray-200 truncate">{m.plan?.name || '—'}</p></div>
              <div><p className="text-gray-500">Joined</p><p className="text-gray-200">{formatDate(m.admissionDate)}</p></div>
              <div><p className="text-gray-500">Expires</p><p className="text-gray-200">{formatDate(m.expiryDate)}</p></div>
            </div>
            <div className="flex justify-end mt-2 pt-2 border-t border-navy-700"><MemberActions member={m} {...actions} /></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MembersTable;
