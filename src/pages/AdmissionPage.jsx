import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdmissionForm from '../components/admission/AdmissionForm.jsx';
import ReceiptQR from '../components/receipt/ReceiptQR.jsx';
import Button from '../components/common/Button.jsx';

const AdmissionPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [done, setDone] = useState(null); // { token, memberName, phone, amount } after a successful admission

  const handleSuccess = (res) => {
    setDone({
      token: res.receiptToken,
      memberName: res.member?.name,
      phone: res.member?.phone,
      amount: res.member?.amountPaid,
    });
    window.scrollTo({ top: 0 });
  };

  const addAnother = () => {
    setDone(null);
    setFormKey((k) => k + 1);
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 animate-fade-up">
          <ReceiptQR token={done.token} memberName={done.memberName} phone={done.phone} amount={done.amount} title="Admission done!">
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-navy-700">
              <Link to="/dashboard/members" className="contents">
                <Button variant="ghost" className="w-full"><Users size={16} /> Members</Button>
              </Link>
              <Button variant="primary" className="w-full" onClick={addAnother}><UserPlus size={16} /> New admission</Button>
            </div>
          </ReceiptQR>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
          <UserPlus size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">New Admission</h1>
          <p className="text-gray-500 text-sm">Add a member and record the cash payment</p>
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 sm:p-6">
        <AdmissionForm key={formKey} mode="create" onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AdmissionPage;
