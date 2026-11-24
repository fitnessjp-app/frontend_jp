const Loader = ({ size = 'md', full = false }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className={`${sizes[size]} border-2 border-navy-600 border-t-accent rounded-full animate-spin`} />
  );

  if (full) {
    return <div className="flex items-center justify-center py-16">{spinner}</div>;
  }
  return spinner;
};

export const SkeletonCard = () => (
  <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 animate-pulse">
    <div className="h-3 w-24 bg-navy-700 rounded mb-3" />
    <div className="h-6 w-16 bg-navy-700 rounded" />
  </div>
);

export const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-navy-700">
    <td className="p-4"><div className="h-10 w-10 bg-navy-700 rounded-full" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-navy-700 rounded" /></td>
    <td className="p-4"><div className="h-4 w-20 bg-navy-700 rounded" /></td>
    <td className="p-4"><div className="h-4 w-16 bg-navy-700 rounded" /></td>
    <td className="p-4"><div className="h-4 w-20 bg-navy-700 rounded" /></td>
    <td className="p-4"><div className="h-4 w-20 bg-navy-700 rounded" /></td>
  </tr>
);

export default Loader;

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-navy-800 border border-navy-700 rounded-xl animate-pulse ${className}`} />
);
