import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 py-5 text-sm text-gray-400">
      <span>Page {page} of {pages} · {total} total</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2.5 rounded-lg bg-navy-800 border border-navy-700 disabled:opacity-40 hover:border-accent transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2.5 rounded-lg bg-navy-800 border border-navy-700 disabled:opacity-40 hover:border-accent transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
