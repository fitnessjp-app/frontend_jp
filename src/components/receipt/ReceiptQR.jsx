import { QRCodeSVG } from 'qrcode.react';
import { Download, MessageCircle, CheckCircle2 } from 'lucide-react';
import { receiptUrl } from '../../utils/receipt';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button.jsx';

// Shown after an admission / renewal and from the member's payment list.
// Member scans the QR with their phone camera -> the receipt PDF downloads directly.
const ReceiptQR = ({ token, memberName, phone, amount, title, children }) => {
  const url = receiptUrl(token);
  const waText = encodeURIComponent(`Hi ${memberName || ''}, here is your payment receipt: ${url}`);
  const waLink = `https://wa.me/${phone ? `91${phone}` : ''}?text=${waText}`;

  return (
    <div className="text-center">
      {title && (
        <div className="flex flex-col items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle2 size={26} />
          </div>
          <p className="text-white font-semibold text-lg">{title}</p>
        </div>
      )}

      <p className="text-white font-medium">{memberName}</p>
      {amount !== undefined && <p className="text-accent font-bold text-xl mt-0.5">{formatCurrency(amount)}</p>}

      <div className="mx-auto mt-4 bg-white p-4 rounded-2xl inline-block">
        <QRCodeSVG value={url} size={200} level="M" />
      </div>
      <p className="text-gray-400 text-sm mt-3">Member scans this QR with the phone camera<br />and the receipt PDF downloads.</p>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <a href={url} target="_blank" rel="noreferrer" className="contents">
          <Button variant="secondary" className="w-full"><Download size={16} /> Download PDF</Button>
        </a>
        <a href={waLink} target="_blank" rel="noreferrer" className="contents">
          <Button variant="outline" className="w-full"><MessageCircle size={16} /> WhatsApp</Button>
        </a>
      </div>

      {children}
    </div>
  );
};

export default ReceiptQR;
