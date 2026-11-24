import Modal from '../common/Modal.jsx';
import ReceiptQR from './ReceiptQR.jsx';

const ReceiptModal = ({ receipt, onClose }) => (
  <Modal isOpen={!!receipt} onClose={onClose} title="Receipt" size="sm">
    {receipt && <ReceiptQR {...receipt} />}
  </Modal>
);

export default ReceiptModal;
