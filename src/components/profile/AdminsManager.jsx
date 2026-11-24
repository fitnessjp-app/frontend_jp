import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserPlus, KeyRound, Trash2, ShieldCheck, User } from 'lucide-react';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth.js';
import Modal from '../common/Modal.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';
import { formatDate } from '../../utils/formatDate';
import { inputCls } from './ProfileForm.jsx';

const errMsg = (err, fallback) => err.response?.data?.message || fallback;

const AddAdminModal = ({ isOpen, onClose, onDone }) => {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { role: 'admin' } });

  const close = () => { reset({ role: 'admin' }); onClose(); };

  const onSubmit = async (v) => {
    setSaving(true);
    try {
      await authService.createAdmin({ name: v.name.trim(), username: v.username.trim(), password: v.password, role: v.role });
      toast.success('Admin added');
      onDone();
      close();
    } catch (err) {
      toast.error(errMsg(err, 'Could not add admin'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Add Admin" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Full name</label>
          <input {...register('name', { required: 'Required' })} className={inputCls} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Username (login ID)</label>
          <input
            autoCapitalize="none"
            {...register('username', { required: 'Required', pattern: { value: /^[a-zA-Z0-9._]{3,30}$/, message: '3-30 chars: letters, numbers, . _' } })}
            className={inputCls}
          />
          {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Password</label>
          <input type="text" autoComplete="off" {...register('password', { required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } })} className={inputCls} />
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          <p className="text-xs text-gray-500 mt-1">Share it with them; they can change it from their Profile.</p>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Role</label>
          <select {...register('role')} className={inputCls}>
            <option value="admin">Admin — full gym access</option>
            <option value="owner">Owner — can also manage admins</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" loading={saving}>Add Admin</Button>
        </div>
      </form>
    </Modal>
  );
};

const ResetPasswordModal = ({ admin, onClose }) => {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const close = () => { reset(); onClose(); };

  const onSubmit = async (v) => {
    setSaving(true);
    try {
      await authService.resetAdminPassword(admin.id, v.newPassword);
      toast.success(`Password reset for ${admin.username}`);
      close();
    } catch (err) {
      toast.error(errMsg(err, 'Could not reset password'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={!!admin} onClose={close} title={`Reset password — ${admin?.username || ''}`} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">New password</label>
          <input type="text" autoComplete="off" {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } })} className={inputCls} />
          {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
          <p className="text-xs text-gray-500 mt-1">They will be logged out everywhere and must use this new password.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" loading={saving}>Reset</Button>
        </div>
      </form>
    </Modal>
  );
};

const AdminsManager = () => {
  const { admin: me } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await authService.listAdmins();
      setAdmins(res.admins);
    } catch (err) {
      toast.error(errMsg(err, 'Could not load admins'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await authService.deleteAdmin(deleteTarget.id);
      toast.success('Admin removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(errMsg(err, 'Could not delete admin'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{admins.length} admin{admins.length === 1 ? '' : 's'} can sign in</p>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}><UserPlus size={16} /> Add Admin</Button>
      </div>

      {loading ? (
        <Loader full />
      ) : (
        <div className="space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center gap-3 bg-navy-900 border border-navy-700 rounded-xl px-4 py-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                {a.role === 'owner' ? <ShieldCheck size={18} /> : <User size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium truncate">
                  {a.name} {a.id === me?.id && <span className="text-xs text-accent ml-1">(you)</span>}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  @{a.username} · <span className="capitalize">{a.role}</span> · last login {formatDate(a.lastLoginAt)}
                </p>
              </div>
              <button onClick={() => setResetTarget(a)} title="Reset password" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700">
                <KeyRound size={16} />
              </button>
              {a.id !== me?.id && (
                <button onClick={() => setDeleteTarget(a)} title="Delete" className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-navy-700">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <AddAdminModal isOpen={addOpen} onClose={() => setAddOpen(false)} onDone={load} />
      <ResetPasswordModal admin={resetTarget} onClose={() => setResetTarget(null)} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove admin"
        description={`${deleteTarget?.name} (@${deleteTarget?.username}) will lose access immediately.`}
      />
    </div>
  );
};

export default AdminsManager;
