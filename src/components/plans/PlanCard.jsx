import { Pencil, Trash2, Check, Power, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const actionBtn =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-navy-600 text-sm text-gray-300 transition-colors';

const PlanCard = ({ plan, onEdit, onDelete, onToggle }) => (
  <div className={`bg-navy-800 border border-navy-700 rounded-2xl p-5 sm:p-6 flex flex-col ${plan.isActive ? '' : 'opacity-70'}`}>
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
      <span
        className={`shrink-0 text-xs px-2 py-1 rounded-full border ${
          plan.isActive
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            : 'bg-gray-500/15 text-gray-400 border-gray-500/30'
        }`}
      >
        {plan.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>

    <p className="text-3xl font-extrabold text-accent mt-3">{formatCurrency(plan.price)}</p>
    <p className="text-gray-500 text-sm">
      {plan.durationInMonths} month{plan.durationInMonths > 1 ? 's' : ''}
    </p>

    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
      <Users size={13} /> {plan.memberCount || 0} member{plan.memberCount === 1 ? '' : 's'}
    </p>

    {plan.features?.length > 0 && (
      <ul className="mt-4 space-y-2 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <Check size={16} className="text-accent shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
    )}

    <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-navy-700">
      <button onClick={() => onEdit(plan)} className={`${actionBtn} hover:border-accent hover:text-accent`}>
        <Pencil size={14} /> Edit
      </button>
      <button
        onClick={() => onToggle(plan)}
        className={`${actionBtn} ${plan.isActive ? 'hover:border-amber-500 hover:text-amber-400' : 'hover:border-emerald-500 hover:text-emerald-400'}`}
      >
        <Power size={14} /> {plan.isActive ? 'Disable' : 'Enable'}
      </button>
      <button onClick={() => onDelete(plan)} className={`${actionBtn} hover:border-red-500 hover:text-red-400`}>
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
);

export default PlanCard;
