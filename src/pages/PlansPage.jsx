import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import usePlans from '../hooks/usePlans.js';
import planService from '../services/planService';
import PlanList from '../components/plans/PlanList.jsx';
import PlanFormModal from '../components/plans/PlanFormModal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Button from '../components/common/Button.jsx';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const sorts = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_low', label: 'Price: low → high' },
  { value: 'price_high', label: 'Price: high → low' },
  { value: 'duration', label: 'Duration' },
  { value: 'members', label: 'Most members' },
];

const PlansPage = () => {
  const { plans, loading, refetch } = usePlans();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('newest');

  const visible = useMemo(() => {
    let list = plans.filter((p) => (tab === 'all' ? true : tab === 'active' ? p.isActive : !p.isActive));
    const by = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      price_low: (a, b) => a.price - b.price,
      price_high: (a, b) => b.price - a.price,
      duration: (a, b) => a.durationInMonths - b.durationInMonths,
      members: (a, b) => (b.memberCount || 0) - (a.memberCount || 0),
    }[sort];
    return [...list].sort(by);
  }, [plans, tab, sort]);

  const openCreate = () => { setEditingPlan(null); setFormOpen(true); };
  const openEdit = (plan) => { setEditingPlan(plan); setFormOpen(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await planService.deletePlan(confirmPlan._id);
      toast.success('Plan deleted');
      setConfirmPlan(null);
      refetch();
    } catch (err) {
      // 409 = plan already used by members: tell the admin to disable it instead.
      toast.error(err.response?.data?.message || 'Failed to delete plan', { duration: 6000 });
      setConfirmPlan(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (plan) => {
    try {
      await planService.updatePlan(plan._id, { isActive: !plan.isActive });
      toast.success(plan.isActive ? 'Plan disabled — hidden from new admissions' : 'Plan enabled');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update plan');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Plans</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit and remove membership plans</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={18} /> Add Plan
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-3.5 py-2 rounded-full border text-sm transition-colors ${
                tab === t.value ? 'bg-accent text-white border-accent' : 'bg-navy-800 border-navy-700 text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto px-3 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-white focus:outline-none focus:border-accent"
        >
          {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <PlanList plans={visible} loading={loading} onEdit={openEdit} onDelete={setConfirmPlan} onToggle={handleToggle} />

      <PlanFormModal
        key={editingPlan?._id || 'new'}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        plan={editingPlan}
        onSuccess={refetch}
      />

      <ConfirmDialog
        isOpen={!!confirmPlan}
        onClose={() => setConfirmPlan(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Plan"
        description={`Permanently delete "${confirmPlan?.name}"? Plans already used by members can't be deleted — disable them instead.`}
      />
    </div>
  );
};

export default PlansPage;
