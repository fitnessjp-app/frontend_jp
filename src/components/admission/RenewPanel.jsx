import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Search, X, RefreshCw } from 'lucide-react';
import memberService from '../../services/memberService';
import usePlans from '../../hooks/usePlans.js';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Button from '../common/Button.jsx';
import PhotoViewer from '../common/PhotoViewer.jsx';
import StatusBadge from '../records/StatusBadge.jsx';
import ReceiptQR from '../receipt/ReceiptQR.jsx';
import Loader from '../common/Loader.jsx';

const input = 'w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent';

// Renew a membership straight from the Admission page: search member -> pick plan -> cash -> receipt QR.
const RenewPanel = ({ onFinished }) => {
  const { plans } = usePlans();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [member, setMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { plan: '', amountPaid: '' },
  });
  const selectedPlan = plans.find((p) => p._id === watch('plan'));

  // Live search by name or mobile number.
  useEffect(() => {
    if (member || term.trim().length < 2) {
      setResults([]);
      return undefined;
    }
    setSearching(true);
    const t = setTimeout(() => {
      memberService
        .getMembers({ search: term.trim(), limit: 6, sort: 'name_asc' })
        .then((res) => setResults(res.members || []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [term, member]);

  useEffect(() => {
    if (selectedPlan) setValue('amountPaid', selectedPlan.price);
  }, [selectedPlan, setValue]);

  const pick = (m) => {
    setMember(m);
    setTerm('');
    reset({ plan: m.plan?._id || '', amountPaid: m.plan?.price ?? '' });
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await memberService.renewMember(member._id, {
        plan: values.plan,
        amountPaid: Number(values.amountPaid),
      });
      toast.success('Membership renewed!');
      setReceipt({ token: res.receiptToken, memberName: member.name, phone: member.phone, amount: Number(values.amountPaid) });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to renew membership');
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <ReceiptQR token={receipt.token} memberName={receipt.memberName} phone={receipt.phone} amount={receipt.amount} title="Renewed!">
        <Button variant="primary" className="w-full mt-5" onClick={() => { setReceipt(null); setMember(null); onFinished?.(); }}>
          Renew another member
        </Button>
      </ReceiptQR>
    );
  }

  return (
    <div className="space-y-5">
      {!member ? (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Find member</label>
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Type name or mobile number…"
              className={`${input} pl-10`}
              autoFocus
            />
          </div>

          {searching && <div className="py-4"><Loader full /></div>}

          {!searching && term.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-gray-500 mt-3">No member found. Check the spelling or number.</p>
          )}

          <div className="mt-3 space-y-2">
            {results.map((m) => (
              <button
                key={m._id}
                onClick={() => pick(m)}
                className="w-full flex items-center gap-3 bg-navy-900 border border-navy-700 hover:border-accent rounded-xl p-3 text-left"
              >
                <PhotoViewer src={m.photo} name={m.name} className="h-14 w-12 rounded-lg" zoomable={false} iconSize={16} />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{m.name}</p>
                  <p className="text-gray-400 text-sm">{m.phone}</p>
                  <p className="text-gray-500 text-xs">{m.plan?.name} · expires {formatDate(m.expiryDate)}</p>
                </div>
                <StatusBadge member={m} />
              </button>
            ))}
          </div>

          {term.trim().length < 2 && <p className="text-xs text-gray-500 mt-3">Search the member who is paying to renew.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3 bg-navy-900 border border-navy-700 rounded-xl p-3">
            <PhotoViewer src={member.photo} name={member.name} className="h-16 w-14 rounded-lg" iconSize={18} />
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold truncate">{member.name}</p>
              <p className="text-gray-400 text-sm">{member.phone}</p>
              <p className="text-gray-500 text-xs">Current: {member.plan?.name} · expires {formatDate(member.expiryDate)}</p>
              <div className="mt-1.5"><StatusBadge member={member} /></div>
            </div>
            <button type="button" onClick={() => setMember(null)} className="p-2 text-gray-400 hover:text-white" aria-label="Change member">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Renew with plan</label>
            <select {...register('plan', { required: 'Plan is required' })} className={input}>
              <option value="">Select a plan</option>
              {plans.filter((p) => p.isActive || p._id === member.plan?._id).map((p) => (
                <option key={p._id} value={p._id}>{p.name} — {formatCurrency(p.price)} / {p.durationInMonths}mo</option>
              ))}
            </select>
            {errors.plan && <p className="text-red-400 text-xs mt-1">{errors.plan.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount Received (Cash)</label>
            <input
              type="number"
              inputMode="numeric"
              {...register('amountPaid', { required: 'Amount is required', min: { value: 0, message: 'Must be non-negative' } })}
              className={input}
            />
            {errors.amountPaid && <p className="text-red-400 text-xs mt-1">{errors.amountPaid.message}</p>}
            <p className="text-xs text-gray-500 mt-1">If the plan is still running, new days are added after the current expiry.</p>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
            <RefreshCw size={16} /> Renew Membership
          </Button>
        </form>
      )}
    </div>
  );
};

export default RenewPanel;
