// Maps a member's computed status to Tailwind color classes for badges/row accents.
export const getMemberStatus = (member) => {
  if (!member?.expiryDate) return 'active';
  const now = new Date();
  const expiry = new Date(member.expiryDate);
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'expiring';
  return 'active';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' };
    case 'expiring':
      return { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' };
    case 'expired':
      return { badge: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' };
    default:
      return { badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30', dot: 'bg-gray-400' };
  }
};

export default getStatusColor;
