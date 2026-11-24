import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

const PhotoUpload = ({ onChange, initialPreview }) => {
  const [preview, setPreview] = useState(initialPreview || null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Photo</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative h-40 w-32 rounded-xl border-2 border-dashed border-navy-600 hover:border-accent bg-navy-900 flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover object-top" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <Camera size={22} className="mx-auto mb-1" />
            <span className="text-xs">Upload</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default PhotoUpload;
