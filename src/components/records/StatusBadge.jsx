import { getMemberStatus, getStatusColor } from '../../utils/getStatusColor';

const labels = { active: 'Active', expiring: 'Expiring Soon', expired: 'Expired' };

const StatusBadge = ({ member }) => {
  const status = getMemberStatus(member);
  const { badge, dot } = getStatusColor(status);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${badge}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {labels[status]}
      </span>
      {member?.isOldMember && (
        <span className="px-2 py-1 rounded-full border text-[11px] font-medium bg-purple-500/15 text-purple-300 border-purple-500/30">Old</span>
      )}
    </span>
  );
};

export default StatusBadge;
