import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, RefreshCw, SwitchCamera, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Portrait 4:5 photo, same shape the member cards use.
const OUT_W = 800;
const OUT_H = 1000;

const CameraSheet = ({ onCapture, onClose, onFallback }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facing, setFacing] = useState('environment'); // rear camera first: you photograph the member
  const [ready, setReady] = useState(false);
  const [shot, setShot] = useState(null); // { blob, url }

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async (mode) => {
    stop();
    setReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setReady(true);
    } catch (err) {
      stop();
      toast.error(
        err?.name === 'NotAllowedError'
          ? 'Camera permission blocked. Allow camera for this site in browser settings.'
          : 'Could not open the camera.'
      );
      onFallback();
    }
  }, [onFallback]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      onFallback();
      return undefined;
    }
    start(facing);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing]);

  useEffect(() => () => shot && URL.revokeObjectURL(shot.url), [shot]);

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    // Crop exactly what the 4:5 frame shows.
    const target = OUT_W / OUT_H;
    let sw = v.videoWidth;
    let sh = v.videoHeight;
    let sx = 0;
    let sy = 0;
    if (sw / sh > target) {
      const w = sh * target;
      sx = (sw - w) / 2;
      sw = w;
    } else {
      const h = sw / target;
      sy = (sh - h) / 2;
      sh = h;
    }
    const canvas = document.createElement('canvas');
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    canvas.getContext('2d').drawImage(v, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H);
    canvas.toBlob(
      (blob) => {
        if (blob) setShot({ blob, url: URL.createObjectURL(blob) });
      },
      'image/jpeg',
      0.85
    );
  };

  const use = () => {
    const file = new File([shot.blob], `member-${Date.now()}.jpg`, { type: 'image/jpeg' });
    stop();
    onCapture(file, shot.url);
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] bg-black flex flex-col pt-safe pb-safe animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <p className="font-medium">{shot ? 'Check photo' : 'Take photo'}</p>
        <button onClick={() => { stop(); onClose(); }} className="p-2 rounded-full bg-white/10" aria-label="Close camera">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm aspect-[4/5] max-h-full rounded-2xl overflow-hidden bg-navy-900">
          {shot ? (
            <img src={shot.url} alt="Captured" className="h-full w-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="h-full w-full object-cover"
                style={{ transform: facing === 'user' ? 'scaleX(-1)' : 'none' }}
              />
              {!ready && <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Opening camera…</div>}
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-5 flex items-center justify-center gap-6">
        {shot ? (
          <>
            <button onClick={() => setShot(null)} className="flex flex-col items-center gap-1 text-white text-xs">
              <span className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center"><RefreshCw size={22} /></span>
              Retake
            </button>
            <button onClick={use} className="flex flex-col items-center gap-1 text-white text-xs">
              <span className="h-16 w-16 rounded-full bg-accent flex items-center justify-center"><Check size={28} /></span>
              Use photo
            </button>
          </>
        ) : (
          <>
            <span className="w-14" />
            <button onClick={capture} disabled={!ready} aria-label="Capture" className="h-[72px] w-[72px] rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40">
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
            <button onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))} className="h-14 w-14 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Switch camera">
              <SwitchCamera size={22} />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

// Camera only — no gallery. If the browser can't open the camera, falls back to the phone's camera app.
const PhotoUpload = ({ onChange, initialPreview }) => {
  const [preview, setPreview] = useState(initialPreview || null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fallbackRef = useRef(null);

  const handleCaptured = (file, url) => {
    onChange(file);
    setPreview(url);
    setCameraOpen(false);
  };

  const handleFallbackFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (fallbackRef.current) fallbackRef.current.value = '';
  };

  const openFallback = useCallback(() => {
    setCameraOpen(false);
    fallbackRef.current?.click();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        Photo <span className="text-gray-500 font-normal">(optional)</span>
      </label>

      <div className="flex items-end gap-4">
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="relative h-40 w-32 rounded-xl border-2 border-dashed border-navy-600 hover:border-accent bg-navy-900 flex items-center justify-center overflow-hidden transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Member" className="h-full w-full object-cover object-top" />
          ) : (
            <div className="text-center text-gray-400">
              <Camera size={26} className="mx-auto mb-1.5 text-accent" />
              <span className="text-xs">Open camera</span>
            </div>
          )}
        </button>

        {preview && (
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setCameraOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-600 text-sm text-gray-200 hover:border-accent">
              <RefreshCw size={15} /> Retake
            </button>
            <button type="button" onClick={clear} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-600 text-sm text-gray-400 hover:border-red-500 hover:text-red-400">
              <X size={15} /> Remove
            </button>
          </div>
        )}
      </div>

      {/* Fallback: opens the device camera app directly (capture attr), never the gallery picker on phones. */}
      <input ref={fallbackRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFallbackFile} />

      {cameraOpen && <CameraSheet onCapture={handleCaptured} onClose={() => setCameraOpen(false)} onFallback={openFallback} />}
    </div>
  );
};

export default PhotoUpload;
