import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Sun, Moon, QrCode, User } from 'lucide-react';
import memberService from '../../services/memberService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../common/Modal.jsx';
import Loader from '../common/Loader.jsx';
import PhotoViewer from '../common/PhotoViewer.jsx';
import StatusBadge from './StatusBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ReceiptModal from '../receipt/ReceiptModal.jsx';

const Info = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-2.5 text-gray-300 text-sm">
    <Icon size={16} className="text-gray-500 mt-0.5 shrink-0" />
    <span className="min-w-0 break-words">{children}</span>
  </div>
);

const MemberProfileModal = ({ isOpen, onClose, memberId }) => {
  const [member, setMember] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (!isOpen || !memberId) return;
    setLoading(true);
    memberService
      .getMemberById(memberId)
      .then((res) => {
        setMember(res.member);
        setPayments(res.payments || []);
      })
      .finally(() => setLoading(false));
  }, [isOpen, memberId]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Member Profile" size="lg">
        {loading ? (
          <Loader full />
        ) : !member ? (
          <EmptyState title="Member not found" />
        ) : (
          <div className="space-y-5">
            {/* Photo + name */}
            <div className="flex gap-4">
              <PhotoViewer src={member.photo} name={member.name} className="h-36 w-28 sm:h-40 sm:w-32 rounded-2xl" iconSize={36} />
              <div className="min-w-0 flex-1 flex flex-col justify-center gap-2">
                <h3 className="text-xl font-semibold text-white break-words">{member.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge member={member} />
                  {member.isOldMember && <span className="text-xs px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">Old member</span>}
                </div>
                <p className="text-gray-400 text-sm capitalize inline-flex items-center gap-1.5">
                  {member.batch === 'morning' ? <Sun size={14} /> : <Moon size={14} />} {member.batch} batch
                </p>
                {member.photo && <p className="text-xs text-gray-600">Tap photo to enlarge</p>}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2.5 bg-navy-900 border border-navy-700 rounded-xl p-4">
              <Info icon={Phone}><a href={`tel:${member.phone}`} className="hover:text-accent">{member.phone}</a></Info>
              {member.email && <Info icon={Mail}>{member.email}</Info>}
              {member.address && <Info icon={MapPin}>{member.address}</Info>}
              {member.age && <Info icon={User}>{member.age} yrs</Info>}
            </div>

            {/* Plan */}
            <div className="grid grid-cols-3 gap-3 bg-navy-900 border border-navy-700 rounded-xl p-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Plan</p>
                <p className="text-white font-medium text-sm truncate">{member.plan?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-white font-medium text-sm">{formatDate(member.admissionDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="text-white font-medium text-sm">{formatDate(member.expiryDate)}</p>
              </div>
            </div>

            {/* Payments */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Payment History (Cash)</h4>
              {payments.length === 0 ? (
                <EmptyState title="No payments recorded" description={member.isOldMember ? 'Old member: renew to record the first payment.' : ''} />
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p._id} className="flex items-center gap-3 bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium capitalize">{p.type.replace('_', ' ')}</p>
                        <p className="text-gray-500 text-xs truncate">{formatDate(p.date)} · {p.plan?.name}</p>
                      </div>
                      <p className="text-accent font-semibold">{formatCurrency(p.amount)}</p>
                      {p.receiptToken && (
                        <button
                          onClick={() => setReceipt({ token: p.receiptToken, memberName: member.name, phone: member.phone, amount: p.amount })}
                          title="Receipt QR"
                          className="p-2 rounded-lg bg-navy-700 text-gray-300 hover:text-accent"
                        >
                          <QrCode size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </>
  );
};

export default MemberProfileModal;
