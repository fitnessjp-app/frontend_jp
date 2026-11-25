import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import memberService from '../../services/memberService';
import usePlans from '../../hooks/usePlans.js';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button.jsx';
import PhotoUpload from './PhotoUpload.jsx';

const input = 'w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent';
const label = 'block text-sm font-medium text-gray-300 mb-1.5';

const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  d.setMonth(d.getMonth() + Number(months));
  return d;
};

// mode:
//   'create' - new admission (pays now, gets receipt QR)
//   'old'    - member who joined before this app: enter joining date + current expiry, no payment
//   'edit'   - basic details only (PUT /api/members/:id)
const AdmissionForm = ({ mode = 'create', member = null, onSuccess, onClose }) => {
  const { plans, loading: plansLoading } = usePlans();
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: member?.name || '',
      phone: member?.phone || '',
      age: member?.age || '',
      address: member?.address || '',
      batch: member?.batch || 'morning',
      plan: member?.plan?._id || member?.plan || '',
      admissionDate: member?.admissionDate ? format(new Date(member.admissionDate), 'yyyy-MM-dd') : today,
      expiryDate: '',
      amountPaid: member?.amountPaid || '',
    },
  });

  const selectedPlanId = watch('plan');
  const admissionDate = watch('admissionDate');
  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  // New admission: picking a plan fills the amount with its price (still editable for discounts).
  useEffect(() => {
    if (mode === 'create' && selectedPlan) setValue('amountPaid', selectedPlan.price);
  }, [selectedPlan, mode, setValue]);

  // Old member: expiry is suggested from joining date + plan, but can be changed by hand.
  useEffect(() => {
    if (mode !== 'old' || dirtyFields.expiryDate) return;
    if (selectedPlan && admissionDate) {
      const d = addMonths(admissionDate, selectedPlan.durationInMonths);
      if (d) setValue('expiryDate', format(d, 'yyyy-MM-dd'));
    }
  }, [mode, selectedPlan, admissionDate, dirtyFields.expiryDate, setValue]);

  const previewExpiry = () => {
    if (!selectedPlan || !admissionDate) return '—';
    const d = addMonths(admissionDate, selectedPlan.durationInMonths);
    return d ? format(d, 'dd MMM yyyy') : '—';
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('phone', values.phone);
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
      } else if (mode === 'old') {
        formData.append('plan', values.plan);
        formData.append('admissionDate', values.admissionDate);
        formData.append('expiryDate', values.expiryDate);
        formData.append('isOldMember', 'true');
        result = await memberService.createMember(formData);
        toast.success('Old member added');
      } else {
        await memberService.updateMember(member._id, formData);
        toast.success('Member details updated.');
      }

      onSuccess?.(result);
      if (mode === 'edit') onClose?.();
    } catch (err) {
      const first = err.response?.data?.errors?.[0]?.message;
      toast.error(first || err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const planOptions = plans.filter((p) => p.isActive || mode === 'old');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <PhotoUpload onChange={setPhotoFile} initialPreview={member?.photo} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Full Name</label>
          <input {...register('name', { required: 'Name is required' })} className={input} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={label}>Mobile Number</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            {...register('phone', {
              required: 'Mobile number is required',
              pattern: { value: /^\d{10}$/, message: 'Enter a valid 10-digit mobile number' },
            })}
            className={input}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className={label}>Age <span className="text-gray-500 font-normal">(optional)</span></label>
          <input type="number" inputMode="numeric" {...register('age')} className={input} />
        </div>

        <div>
          <label className={label}>Batch</label>
          <select {...register('batch')} className={input}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div>
          <label className={label}>Address <span className="text-gray-500 font-normal">(optional)</span></label>
          <input {...register('address')} className={input} />
        </div>

        {mode !== 'edit' && (
          <>
            <div>
              <label className={label}>{mode === 'old' ? 'Current Plan' : 'Plan'}</label>
              <select {...register('plan', { required: 'Plan is required' })} disabled={plansLoading} className={input}>
                <option value="">Select a plan</option>
                {planOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {formatCurrency(p.price)} / {p.durationInMonths}mo{p.isActive ? '' : ' (inactive)'}
                  </option>
                ))}
              </select>
              {errors.plan && <p className="text-red-400 text-xs mt-1">{errors.plan.message}</p>}
            </div>

            <div>
              <label className={label}>{mode === 'old' ? 'Original Joining Date' : 'Admission Date'}</label>
              <input type="date" max={mode === 'old' ? today : undefined} {...register('admissionDate', { required: true })} className={input} />
            </div>

            {mode === 'create' ? (
              <>
                <div>
                  <label className={label}>Expiry Date (preview)</label>
                  <input type="text" readOnly value={previewExpiry()} className={`${input} !bg-navy-900/50 !text-gray-400 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={label}>Amount Received (Cash)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    {...register('amountPaid', { required: 'Amount is required', min: { value: 0, message: 'Must be non-negative' } })}
                    className={input}
                  />
                  {errors.amountPaid && <p className="text-red-400 text-xs mt-1">{errors.amountPaid.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">Cash only. Edit it if you gave a discount.</p>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className={label}>Membership Valid Till (Expiry)</label>
                <input type="date" {...register('expiryDate', { required: 'Expiry date is required' })} className={input} />
                {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate.message}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from joining date + plan. Change it to the member's real current expiry. No payment is recorded for old members.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>}
        <Button type="submit" variant="primary" loading={submitting} className="flex-1 sm:flex-none">
          {mode === 'create' ? 'Admit Member' : mode === 'old' ? 'Add Old Member' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default AdmissionForm;
