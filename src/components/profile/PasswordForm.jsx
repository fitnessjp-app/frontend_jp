import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import { inputCls } from './ProfileForm.jsx';

const PasswordForm = () => {
  const { updateSession } = useAuth();
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const res = await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      updateSession({ token: res.token }); // keep this device signed in; other devices must login again
      toast.success('Password changed');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      {[
        { name: 'currentPassword', label: 'Current password', rules: { required: 'Required' }, auto: 'current-password' },
        { name: 'newPassword', label: 'New password', rules: { required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } }, auto: 'new-password' },
        {
          name: 'confirm',
          label: 'Confirm new password',
          rules: { required: 'Required', validate: (v) => v === watch('newPassword') || 'Passwords do not match' },
          auto: 'new-password',
        },
      ].map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
          <input type={show ? 'text' : 'password'} autoComplete={f.auto} {...register(f.name, f.rules)} className={inputCls} />
          {errors[f.name] && <p className="text-red-400 text-xs mt-1">{errors[f.name].message}</p>}
        </div>
      ))}

      <button type="button" onClick={() => setShow((s) => !s)} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        {show ? <EyeOff size={16} /> : <Eye size={16} />} {show ? 'Hide' : 'Show'} passwords
      </button>

      <p className="text-xs text-gray-500">After changing it, you stay logged in here; other devices will need to login again.</p>

      <div><Button type="submit" variant="primary" loading={saving}>Update password</Button></div>
    </form>
  );
};

export default PasswordForm;
