import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', description = '', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
        <AlertTriangle size={18} className="text-red-400" />
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
    <div className="flex justify-end gap-3">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
