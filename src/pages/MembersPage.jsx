import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import useMembers from '../hooks/useMembers.js';
import usePlans from '../hooks/usePlans.js';
import memberService from '../services/memberService';
import MemberFilters from '../components/records/MemberFilters.jsx';
import MembersTable from '../components/records/MembersTable.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import MemberProfileModal from '../components/records/MemberProfileModal.jsx';
import RenewModal from '../components/records/RenewModal.jsx';
import AdmissionForm from '../components/admission/AdmissionForm.jsx';

const FILTER_KEYS = [
  'search', 'status', 'batch', 'plan', 'type',
  'admittedFrom', 'admittedTo', 'expiryFrom', 'expiryTo', 'ageMin', 'ageMax', 'sort',
];

const MembersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { plans } = usePlans();

  // Everything lives in the URL: shareable, survives refresh, back button works.
  const params = useMemo(() => {
    const p = { page: Number(searchParams.get('page')) || 1, limit: 20 };
    FILTER_KEYS.forEach((k) => { p[k] = searchParams.get(k) || undefined; });
    return p;
  }, [searchParams]);

  const { members, total, page, pages, counts, loading, refetch } = useMembers(params);

  const [viewId, setViewId] = useState(null);
  const [renewMember, setRenewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => (val ? next.set(key, val) : next.delete(key)));
    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const resetAll = () => setSearchParams({}, { replace: true });

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await memberService.deleteMember(deleteMember._id);
      toast.success('Member deleted');
      setDeleteMember(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete member');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading…' : `${total} member${total === 1 ? '' : 's'} found`}
          </p>
        </div>
        <Link
          to="/dashboard/admission"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium"
        >
          <Plus size={16} /> New Admission
        </Link>
      </div>

      <div className="mb-5">
        <MemberFilters params={params} counts={counts} plans={plans} onChange={updateParams} onReset={resetAll} />
      </div>

      <MembersTable
        members={members}
        loading={loading}
        sort={params.sort || 'newest'}
        onSort={(s) => updateParams({ sort: s })}
        onView={(m) => setViewId(m._id)}
        onRenew={setRenewMember}
        onEdit={setEditMember}
        onDelete={setDeleteMember}
      />

      <Pagination page={page} pages={pages} total={total} onPageChange={handlePageChange} />

      <MemberProfileModal isOpen={!!viewId} onClose={() => setViewId(null)} memberId={viewId} />

      <RenewModal isOpen={!!renewMember} onClose={() => setRenewMember(null)} member={renewMember} onSuccess={refetch} />

      <Modal isOpen={!!editMember} onClose={() => setEditMember(null)} title={`Edit — ${editMember?.name || ''}`} size="lg">
        {editMember && (
          <AdmissionForm mode="edit" member={editMember} onClose={() => setEditMember(null)} onSuccess={refetch} />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteMember}
        onClose={() => setDeleteMember(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Member"
        description={`Delete ${deleteMember?.name}? This cannot be undone. Their payment history is kept for revenue records.`}
      />
    </div>
  );
};

export default MembersPage;
