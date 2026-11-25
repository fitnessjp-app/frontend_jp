import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, RefreshCw, SwitchCamera, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Portrait 4:5 photo, same shape the member cards use.
const OUT_W = 800;
const OUT_H = 1000;

// Phone photos are huge (4000px+). Crop to 4:5 portrait, shrink and compress so uploads are fast.
const processImage = async (file) => {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bitmap = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  const iw = bitmap.width || bitmap.naturalWidth;
  const ih = bitmap.height || bitmap.naturalHeight;
  const target = OUT_W / OUT_H;
  let sw = iw;
  let sh = ih;
  let sx = 0;
  let sy = 0;
  if (iw / ih > target) {
    sw = ih * target;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / target;
    sy = (ih - sh) / 3; // keep more of the top: faces stay in frame
  }
  const canvas = document.createElement('canvas');
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  canvas.getContext('2d').drawImage(bitmap, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  return new File([blob], `member-${Date.now()}.jpg`, { type: 'image/jpeg' });
};

const CameraSheet = ({ onCapture, onClose, onFail }) => {
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
      onFail(err?.name === 'NotAllowedError' || err?.name === 'SecurityError' ? 'blocked' : 'error');
    }
  }, [onFail]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      onFail('unsupported');
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

// Shown only when the in-app camera can't open (permission blocked on this device). Never leaves the admin stuck.
const CameraProblemSheet = ({ reason, onRetry, onPhoneCamera, onPick, onClose }) => {
  const [steps, setSteps] = useState(false);
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-navy-800 border border-navy-700 rounded-t-2xl sm:rounded-2xl p-5 pb-safe animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center"><Camera size={22} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold">{reason === 'unsupported' ? 'Camera not available here' : 'Camera is blocked for this app'}</p>
            <p className="text-sm text-gray-400 mt-0.5">Take the photo another way — the admission is not blocked.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="grid gap-2.5 mt-5">
          <button onClick={onPhoneCamera} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-medium">
            <Camera size={18} /> Open phone camera
          </button>
          <button onClick={onPick} className="w-full py-3.5 rounded-xl border border-navy-600 text-gray-200 font-medium">
            Choose a photo
          </button>
          {reason === 'blocked' && (
            <button onClick={onRetry} className="w-full py-3 rounded-xl text-sm text-gray-300 inline-flex items-center justify-center gap-2">
              <RefreshCw size={15} /> Try the in-app camera again
            </button>
          )}
        </div>

        {reason === 'blocked' && (
          <div className="mt-3 border-t border-navy-700 pt-3">
            <button onClick={() => setSteps((v) => !v)} className="text-sm text-accent">
              {steps ? 'Hide steps' : 'Fix it once for good'}
            </button>
            {steps && (
              <ol className="mt-2 text-sm text-gray-400 space-y-1 list-decimal pl-5">
                <li>Open the <b className="text-gray-200">Chrome</b> app → ⋮ menu → <b className="text-gray-200">Settings</b></li>
                <li><b className="text-gray-200">Site settings</b> → <b className="text-gray-200">Camera</b></li>
                <li>Find this site in the list → set to <b className="text-gray-200">Allow</b></li>
                <li>Close this app completely and open it again</li>
              </ol>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// Photo is taken inside the app (camera opens straight away, no gallery).
// If the camera is blocked on a device, a small sheet offers the phone's camera app / photo picker so nobody gets stuck.
const PhotoUpload = ({ onChange, initialPreview }) => {
  const [preview, setPreview] = useState(initialPreview || null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [problem, setProblem] = useState(null); // 'blocked' | 'unsupported' | 'error'
  const [processing, setProcessing] = useState(false);
  const captureRef = useRef(null); // phone camera app
  const pickRef = useRef(null); // photo picker

  const handleCaptured = (file, url) => {
    onChange(file);
    setPreview(url);
    setCameraOpen(false);
  };

  const handleNativeFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setProcessing(true);
    try {
      const out = await processImage(file);
      onChange(out);
      setPreview(URL.createObjectURL(out));
    } catch {
      toast.error('Could not read the photo, please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
  };

  const handleFail = useCallback((reason) => {
    setCameraOpen(false);
    setProblem(reason);
  }, []);

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return setProblem('unsupported');
    // Already blocked on this device? Skip straight to the options instead of a dead end.
    try {
      const status = await navigator.permissions?.query({ name: 'camera' });
      if (status?.state === 'denied') return setProblem('blocked');
    } catch {
      /* permissions API not available - just try the camera */
    }
    setCameraOpen(true);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        Photo <span className="text-gray-500 font-normal">(optional)</span>
      </label>

      <div className="flex items-end gap-4">
        <button
          type="button"
          onClick={openCamera}
          className="relative h-40 w-32 rounded-xl border-2 border-dashed border-navy-600 hover:border-accent bg-navy-900 flex items-center justify-center overflow-hidden transition-colors"
        >
          {processing ? (
            <span className="text-xs text-gray-400">Processing…</span>
          ) : preview ? (
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
            <button type="button" onClick={openCamera} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-600 text-sm text-gray-200 hover:border-accent">
              <RefreshCw size={15} /> Retake
            </button>
            <button type="button" onClick={clear} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-600 text-sm text-gray-400 hover:border-red-500 hover:text-red-400">
              <X size={15} /> Remove
            </button>
          </div>
        )}
      </div>

      <input ref={captureRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleNativeFile} />
      <input ref={pickRef} type="file" accept="image/*" className="hidden" onChange={handleNativeFile} />

      {cameraOpen && <CameraSheet onCapture={handleCaptured} onClose={() => setCameraOpen(false)} onFail={handleFail} />}

      {problem && (
        <CameraProblemSheet
          reason={problem}
          onClose={() => setProblem(null)}
          onRetry={() => { setProblem(null); setCameraOpen(true); }}
          onPhoneCamera={() => { setProblem(null); captureRef.current?.click(); }}
          onPick={() => { setProblem(null); pickRef.current?.click(); }}
        />
      )}
    </div>
  );
};

export default PhotoUpload;
