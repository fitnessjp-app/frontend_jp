import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X, Plus } from 'lucide-react';
import planService from '../../services/planService';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const PlanFormModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const isEdit = !!plan;
  const [features, setFeatures] = useState(plan?.features || []);
  const [featureInput, setFeatureInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: plan?.name || '',
      durationInMonths: plan?.durationInMonths || '',
      price: plan?.price || '',
      isActive: plan?.isActive ?? true,
    },
  });

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures((f) => [...f, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (idx) => setFeatures((f) => f.filter((_, i) => i !== idx));

  const handleClose = () => {
    reset();
    setFeatures([]);
    setFeatureInput('');
    onClose();
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        durationInMonths: Number(values.durationInMonths),
        price: Number(values.price),
        features,
        isActive: values.isActive,
      };
      if (isEdit) {
        await planService.updatePlan(plan._id, payload);
        toast.success('Plan updated successfully');
      } else {
        await planService.createPlan(payload);
        toast.success('Plan created successfully');
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Plan' : 'Add Plan'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Plan Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
            placeholder="Quarterly Plan"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration (months)</label>
            <input
              type="number"
              {...register('durationInMonths', { required: 'Required', min: { value: 1, message: 'Min 1 month' } })}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
            />
            {errors.durationInMonths && <p className="text-red-400 text-xs mt-1">{errors.durationInMonths.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹)</label>
            <input
              type="number"
              {...register('price', { required: 'Required', min: { value: 0, message: 'Must be non-negative' } })}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Features</label>
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. Free trainer session"
            />
            <Button type="button" variant="secondary" onClick={addFeature}><Plus size={16} /></Button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {features.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-700 text-xs text-gray-300">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-400">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 accent-accent" />
          <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanFormModal;
