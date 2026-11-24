import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-accent';

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const data = await login({ username: values.username.trim(), password: values.password });
      onSuccess(data); // parent plays the welcome animation, then starts the session
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reach the server. Check your connection.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
        <input
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          {...register('username', { required: 'Username is required' })}
          className={inputCls}
          placeholder="your username"
        />
        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            className={`${inputCls} pr-11`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full !rounded-xl" loading={submitting}>
        <LogIn size={18} />
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
