import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import memberService from '../../services/memberService';
import usePlans from '../../hooks/usePlans.js';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button.jsx';
import PhotoUpload from './PhotoUpload.jsx';

// mode: 'create' (full admission form) | 'edit' (trimmed — basic details only,
// matches PUT /api/members/:id which does not change plan/amount/expiry).
const AdmissionForm = ({ mode = 'create', member = null, onSuccess, onClose }) => {
  const { plans, loading: plansLoading } = usePlans();
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      phone: member?.phone || '',
      gender: member?.gender || '',
      age: member?.age || '',
      address: member?.address || '',
      batch: member?.batch || 'morning',
      plan: member?.plan?._id || member?.plan || '',
      admissionDate: member?.admissionDate
        ? format(new Date(member.admissionDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      amountPaid: member?.amountPaid || '',
    },
  });

  const selectedPlanId = watch('plan');
  const admissionDate = watch('admissionDate');

  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  // Picking a plan fills the amount with its price (still editable for discounts).
  useEffect(() => {
    if (mode === 'create' && selectedPlan) setValue('amountPaid', selectedPlan.price);
  }, [selectedPlan, mode, setValue]);

  const previewExpiry = () => {
    if (!selectedPlan || !admissionDate) return '—';
    const d = new Date(admissionDate);
    d.setMonth(d.getMonth() + Number(selectedPlan.durationInMonths));
    return format(d, 'dd MMM yyyy');
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      if (values.gender) formData.append('gender', values.gender);
      if (values.age) formData.append('age', values.age);
      if (values.address) formData.append('address', values.address);
      formData.append('batch', values.batch);
      if (photoFile) formData.append('photo', photoFile);

      let result;
      if (mode === 'create') {
        formData.append('plan', values.plan);
        formData.append('admissionDate', values.admissionDate);
        formData.append('amountPaid', values.amountPaid);
        result = await memberService.createMember(formData);
        toast.success('Member admitted successfully!');
      } else {
        await memberService.updateMember(member._id, formData);
        toast.success('Member details updated.');
      }

      onSuccess?.(result);
      if (mode !== 'create') onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <PhotoUpload onChange={setPhotoFile} initialPreview={member?.photo} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
          <input
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^\d{10}$/, message: 'Enter a valid 10-digit phone number' },
            })}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Gender</label>
          <select
            {...register('gender')}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Age</label>
          <input
            type="number"
            {...register('age')}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Batch</label>
          <select
            {...register('batch', { required: true })}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
          <input
            {...register('address')}
            className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
          />
        </div>

        {mode === 'create' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Plan</label>
              <select
                {...register('plan', { required: 'Plan is required' })}
                disabled={plansLoading}
                className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
              >
                <option value="">Select a plan</option>
                {plans.filter((p) => p.isActive).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {formatCurrency(p.price)} / {p.durationInMonths}mo
                  </option>
                ))}
              </select>
              {errors.plan && <p className="text-red-400 text-xs mt-1">{errors.plan.message}</p>}
              {selectedPlan && (
                <p className="text-xs text-gray-500 mt-1">Price hint: {formatCurrency(selectedPlan.price)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Admission Date</label>
              <input
                type="date"
                {...register('admissionDate', { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry Date (preview)</label>
              <input
                type="text"
                readOnly
                value={previewExpiry()}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-900/50 border border-navy-700 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount Received (Cash)</label>
              <input
                type="number"
                step="1"
                {...register('amountPaid', { required: 'Amount is required', min: { value: 0, message: 'Must be non-negative' } })}
                className="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
              />
              {errors.amountPaid && <p className="text-red-400 text-xs mt-1">{errors.amountPaid.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Cash only — editable for discounts</p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>}
        <Button type="submit" variant="primary" loading={submitting}>
          {mode === 'create' ? 'Admit Member' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default AdmissionForm;
