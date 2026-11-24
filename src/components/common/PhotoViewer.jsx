import { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, X } from 'lucide-react';

// Photo that looks good everywhere: portrait crop that keeps faces in view, tap to see it full size.
const PhotoViewer = ({ src, name, className = 'h-16 w-16 rounded-xl', iconSize = 22, zoomable = true }) => {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div className={`${className} bg-navy-700 flex items-center justify-center shrink-0`}>
        <User size={iconSize} className="text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={zoomable ? () => setOpen(true) : undefined}
        className={`${className} shrink-0 overflow-hidden bg-navy-700 ${zoomable ? 'cursor-zoom-in' : 'cursor-default'}`}
      >
        <img src={src} alt={name} loading="lazy" className="h-full w-full object-cover object-top" />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white" aria-label="Close" style={{ top: 'max(1rem, env(safe-area-inset-top))' }}>
            <X size={22} />
          </button>
          <img src={src} alt={name} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
          {name && <p className="text-white mt-4 font-medium">{name}</p>}
        </div>,
        document.body
      )}
    </>
  );
};

export default PhotoViewer;
