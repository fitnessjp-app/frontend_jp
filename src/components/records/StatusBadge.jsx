import { getMemberStatus, getStatusColor } from '../../utils/getStatusColor';

const labels = { active: 'Active', expiring: 'Expiring Soon', expired: 'Expired' };

const StatusBadge = ({ member }) => {
  const status = getMemberStatus(member);
  const { badge, dot } = getStatusColor(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
