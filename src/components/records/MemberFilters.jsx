import { useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import SearchBar from './SearchBar.jsx';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest admission' },
  { value: 'oldest', label: 'Oldest admission' },
  { value: 'expiry_soon', label: 'Plan ending soonest' },
  { value: 'expiry_late', label: 'Plan ending latest' },
  { value: 'name_asc', label: 'Name A → Z' },
  { value: 'name_desc', label: 'Name Z → A' },
  { value: 'amount_high', label: 'Amount: high → low' },
  { value: 'amount_low', label: 'Amount: low → high' },
];

const statusTabs = [
  { value: '', label: 'All', key: 'all' },
  { value: 'active', label: 'Active', key: 'active' },
  { value: 'expiring', label: 'Expiring ≤7d', key: 'expiring' },
  { value: 'expired', label: 'Expired', key: 'expired' },
];

const field = 'w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent';
const label = 'block text-xs font-medium text-gray-400 mb-1';

const ADVANCED_KEYS = ['batch', 'plan', 'gender', 'admittedFrom', 'admittedTo', 'expiryFrom', 'expiryTo', 'ageMin', 'ageMax'];

const MemberFilters = ({ params, counts, plans, onChange, onReset }) => {
  const [open, setOpen] = useState(false);
  const activeAdvanced = ADVANCED_KEYS.filter((k) => params[k]).length;
  const anyActive = activeAdvanced > 0 || params.search || params.status;

  return (
    <div className="space-y-3">
      {/* Search + sort + filter toggle */}
      <div className="flex gap-2">
        <SearchBar value={params.search} onChange={(v) => onChange({ search: v })} />
        <button
          onClick={() => setOpen((o) => !o)}
          className={`relative shrink-0 inline-flex items-center gap-2 px-3.5 rounded-xl border text-sm font-medium transition-colors ${
            open || activeAdvanced ? 'bg-accent/15 border-accent/40 text-accent' : 'bg-navy-800 border-navy-700 text-gray-300'
          }`}
        >
          <SlidersHorizontal size={17} />
          <span className="hidden sm:inline">Filters</span>
          {activeAdvanced > 0 && (
            <span className="h-5 min-w-5 px-1 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
              {activeAdvanced}
            </span>
          )}
        </button>
      </div>

      {/* Status chips with live counts */}
      <div className="grid grid-cols-2 md:flex gap-2">
        {statusTabs.map((t) => {
          const active = (params.status || '') === t.value;
          return (
            <button
              key={t.key}
              onClick={() => onChange({ status: t.value })}
              className={`inline-flex items-center justify-between md:justify-start gap-2 px-3.5 py-2.5 rounded-xl md:rounded-full border text-sm transition-colors ${
                active ? 'bg-accent text-white border-accent' : 'bg-navy-800 border-navy-700 text-gray-300 hover:border-navy-600'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 rounded-full ${active ? 'bg-white/20' : 'bg-navy-700 text-gray-400'}`}>
                {counts?.[t.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowUpDown size={16} className="text-gray-500 shrink-0" />
        <select
          value={params.sort || 'newest'}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="flex-1 sm:flex-none sm:w-64 px-3 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-white focus:outline-none focus:border-accent"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {anyActive && (
          <button onClick={onReset} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 ml-auto">
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {open && (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
          <div>
            <label className={label}>Batch</label>
            <select value={params.batch || ''} onChange={(e) => onChange({ batch: e.target.value })} className={field}>
              <option value="">All</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div>
            <label className={label}>Plan</label>
            <select value={params.plan || ''} onChange={(e) => onChange({ plan: e.target.value })} className={field}>
              <option value="">All plans</option>
              {plans?.map((p) => <option key={p._id} value={p._id}>{p.name}{p.isActive ? '' : ' (inactive)'}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Gender</label>
            <select value={params.gender || ''} onChange={(e) => onChange({ gender: e.target.value })} className={field}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={label}>Age from</label>
              <input type="number" min="0" inputMode="numeric" value={params.ageMin || ''} onChange={(e) => onChange({ ageMin: e.target.value })} className={field} />
            </div>
            <div>
              <label className={label}>Age to</label>
              <input type="number" min="0" inputMode="numeric" value={params.ageMax || ''} onChange={(e) => onChange({ ageMax: e.target.value })} className={field} />
            </div>
          </div>

          <div>
            <label className={label}>Admitted from</label>
            <input type="date" value={params.admittedFrom || ''} onChange={(e) => onChange({ admittedFrom: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>Admitted to</label>
            <input type="date" value={params.admittedTo || ''} onChange={(e) => onChange({ admittedTo: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>Expires from</label>
            <input type="date" value={params.expiryFrom || ''} onChange={(e) => onChange({ expiryFrom: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>Expires to</label>
            <input type="date" value={params.expiryTo || ''} onChange={(e) => onChange({ expiryTo: e.target.value })} className={field} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFilters;
