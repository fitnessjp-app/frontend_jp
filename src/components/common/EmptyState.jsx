import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = '', icon: Icon = Inbox }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="h-14 w-14 rounded-full bg-navy-800 flex items-center justify-center mb-4">
      <Icon size={26} className="text-gray-500" />
    </div>
    <p className="text-white font-medium">{title}</p>
    {description && <p className="text-gray-500 text-sm mt-1 max-w-sm">{description}</p>}
  </div>
);

export default EmptyState;
