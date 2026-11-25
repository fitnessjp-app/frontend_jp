import { useState } from 'react';
import { UserPlus, RefreshCw, History, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdmissionForm from '../components/admission/AdmissionForm.jsx';
import RenewPanel from '../components/admission/RenewPanel.jsx';
import ReceiptQR from '../components/receipt/ReceiptQR.jsx';
import Button from '../components/common/Button.jsx';

const modes = [
  { id: 'new', label: 'New', long: 'New Admission', hint: 'Add a new member and take cash', icon: UserPlus },
  { id: 'renew', label: 'Renew', long: 'Renew Plan', hint: 'Existing member pays again', icon: RefreshCw },
  { id: 'old', label: 'Old Member', long: 'Add Old Member', hint: 'Joined before this app, no payment', icon: History },
];

const AdmissionPage = () => {
  const [mode, setMode] = useState('new');
  const [formKey, setFormKey] = useState(0);
  const [done, setDone] = useState(null); // { kind: 'new'|'old', ... }

  const current = modes.find((m) => m.id === mode);

  const reset = () => {
    setDone(null);
    setFormKey((k) => k + 1);
  };

  const switchMode = (id) => {
    setMode(id);
    reset();
  };

  const handleNew = (res) => {
    setDone({ kind: 'new', token: res.receiptToken, memberName: res.member?.name, phone: res.member?.phone, amount: res.member?.amountPaid });
    window.scrollTo({ top: 0 });
  };

  const handleOld = (res) => {
    setDone({ kind: 'old', memberName: res.member?.name });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Admission</h1>
        <p className="text-gray-500 text-sm mt-1">{current.hint}</p>
      </div>

      {/* Mode switch: three equal buttons, nothing to slide */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchMode(id)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 rounded-xl border text-sm font-medium transition-colors ${
              mode === id ? 'bg-accent text-white border-accent' : 'bg-navy-800 border-navy-700 text-gray-300 hover:border-navy-600'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 sm:p-6">
        {mode === 'new' &&
          (done?.kind === 'new' ? (
            <ReceiptQR token={done.token} memberName={done.memberName} phone={done.phone} amount={done.amount} title="Admission done!">
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-navy-700">
                <Link to="/dashboard/members" className="contents">
                  <Button variant="ghost" className="w-full"><Users size={16} /> Members</Button>
                </Link>
                <Button variant="primary" className="w-full" onClick={reset}><UserPlus size={16} /> New admission</Button>
              </div>
            </ReceiptQR>
          ) : (
            <AdmissionForm key={`new-${formKey}`} mode="create" onSuccess={handleNew} />
          ))}

        {mode === 'renew' && <RenewPanel key={`renew-${formKey}`} />}

        {mode === 'old' &&
          (done?.kind === 'old' ? (
            <div className="text-center py-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 size={26} />
              </div>
              <p className="text-white font-semibold text-lg">{done.memberName} added</p>
              <p className="text-gray-500 text-sm mt-1">Saved as an old member. No payment was recorded.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Link to="/dashboard/members?type=old" className="contents">
                  <Button variant="ghost" className="w-full"><Users size={16} /> Old members</Button>
                </Link>
                <Button variant="primary" className="w-full" onClick={reset}><History size={16} /> Add another</Button>
              </div>
            </div>
          ) : (
            <AdmissionForm key={`old-${formKey}`} mode="old" onSuccess={handleOld} />
          ))}
      </div>
    </div>
  );
};

export default AdmissionPage;
