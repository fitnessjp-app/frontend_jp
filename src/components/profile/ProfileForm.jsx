import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import { formatDate } from '../../utils/formatDate';

export const inputCls =
  'w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-accent';

const ProfileForm = () => {
  const { admin, updateSession } = useAuth();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: admin?.name || '', username: admin?.username || '' },
  });

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile({ name: values.name.trim(), username: values.username.trim() });
      updateSession({ admin: res.admin });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Display name</label>
        <input {...register('name', { required: 'Name is required' })} className={inputCls} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        <p className="text-xs text-gray-500 mt-1">Shown on the welcome screen and in the app header.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Username (login ID)</label>
        <input
          autoCapitalize="none"
          {...register('username', {
            required: 'Username is required',
            pattern: { value: /^[a-zA-Z0-9._]{3,30}$/, message: '3-30 characters: letters, numbers, dot, underscore' },
          })}
          className={inputCls}
        />
        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Role: <span className="text-gray-300 capitalize">{admin?.role}</span></p>
        <p>Last login: <span className="text-gray-300">{formatDate(admin?.lastLoginAt)}</span></p>
      </div>

      <Button type="submit" variant="primary" loading={saving} disabled={!isDirty}>Save changes</Button>
    </form>
  );
};

export default ProfileForm;
