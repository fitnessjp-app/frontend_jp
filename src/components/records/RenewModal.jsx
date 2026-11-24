import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import memberService from '../../services/memberService';
import usePlans from '../../hooks/usePlans.js';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import ReceiptQR from '../receipt/ReceiptQR.jsx';

const RenewModal = ({ isOpen, onClose, member, onSuccess }) => {
  const { plans } = usePlans();
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      plan: member?.plan?._id || member?.plan || '',
      amountPaid: '',
    },
  });

  const selectedPlanId = watch('plan');
  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  useEffect(() => {
    if (isOpen && member) reset({ plan: member.plan?._id || member.plan || '', amountPaid: member.plan?.price ?? '' });
  }, [isOpen, member, reset]);

  useEffect(() => {
    if (selectedPlan) setValue('amountPaid', selectedPlan.price);
  }, [selectedPlan, setValue]);

  const handleClose = () => {
    reset();
    setReceipt(null);
    onClose();
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await memberService.renewMember(member._id, {
        plan: values.plan,
        amountPaid: Number(values.amountPaid),
      });
      toast.success('Membership renewed!');
      onSuccess?.();
      setReceipt({ token: res.receiptToken, memberName: member.name, phone: member.phone, amount: Number(values.amountPaid) });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to renew membership');
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Renew — ${member.name}`} size="sm">
      {receipt ? (
        <ReceiptQR token={receipt.token} memberName={receipt.memberName} phone={receipt.phone} amount={receipt.amount} title="Renewed">
          <Button variant="primary" className="w-full mt-4" onClick={handleClose}>Done</Button>
        </ReceiptQR>
      ) : (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Plan</label>
          <select
            {...register('plan', { required: 'Plan is required' })}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          >
            <option value="">Select a plan</option>
            {plans.filter((p) => p.isActive || p._id === (member?.plan?._id || member?.plan)).map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {formatCurrency(p.price)} / {p.durationInMonths}mo
              </option>
            ))}
          </select>
          {errors.plan && <p className="text-red-400 text-xs mt-1">{errors.plan.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount Received (Cash)</label>
          <input
            type="number"
            {...register('amountPaid', { required: 'Amount is required', min: { value: 0, message: 'Must be non-negative' } })}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
          {errors.amountPaid && <p className="text-red-400 text-xs mt-1">{errors.amountPaid.message}</p>}
          <p className="text-xs text-gray-500 mt-1">Cash only — if the plan is still running, new days are added after the current expiry</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={submitting}>Renew Membership</Button>
        </div>
      </form>
      )}
    </Modal>
  );
};

export default RenewModal;
