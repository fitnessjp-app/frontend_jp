import { Eye, RefreshCw, Pencil, Trash2, Phone } from 'lucide-react';

const btn = 'p-2 rounded-lg hover:bg-navy-700 text-gray-400 transition-colors';

const MemberActions = ({ member, onView, onRenew, onEdit, onDelete }) => (
  <div className="flex items-center gap-0.5">
    <a href={`tel:${member.phone}`} title="Call" className={`${btn} hover:text-sky-400`}><Phone size={16} /></a>
    <button onClick={() => onView(member)} title="View" className={`${btn} hover:text-white`}><Eye size={16} /></button>
    <button onClick={() => onRenew(member)} title="Renew" className={`${btn} hover:text-emerald-400`}><RefreshCw size={16} /></button>
    <button onClick={() => onEdit(member)} title="Edit" className={`${btn} hover:text-accent`}><Pencil size={16} /></button>
    <button onClick={() => onDelete(member)} title="Delete" className={`${btn} hover:text-red-400`}><Trash2 size={16} /></button>
  </div>
);

export default MemberActions;
