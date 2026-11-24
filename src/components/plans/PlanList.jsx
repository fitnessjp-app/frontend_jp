import PlanCard from './PlanCard.jsx';
import { SkeletonBlock } from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const PlanList = ({ plans, loading, onEdit, onDelete, onToggle }) => {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-64" />)}
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return <EmptyState title="No plans here" description="Add a membership plan to get started." />;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {plans.map((plan) => (
        <PlanCard key={plan._id} plan={plan} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default PlanList;
