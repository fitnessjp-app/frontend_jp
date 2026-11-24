import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

// Centered dialog on desktop, bottom sheet on phones.
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portal: render above the bottom tab bar / page animations instead of inside the page.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full ${sizes[size]} max-h-[92vh] flex flex-col bg-navy-800 border border-navy-700 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-navy-700 shrink-0">
          <h3 className="text-lg font-semibold text-white truncate pr-4">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto pb-safe">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
