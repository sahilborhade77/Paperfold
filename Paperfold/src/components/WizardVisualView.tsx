import React, { useState, useRef } from 'react';

interface WizardVisualViewProps {
  currentPhotoUrl: string;
  onUpdatePhoto: (photoUrl: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardVisualView: React.FC<WizardVisualViewProps> = ({
  currentPhotoUrl,
  onUpdatePhoto,
  onNext,
  onBack,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_PHOTOS = [
    {
      name: 'Wildflower Meadow',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7f0-bmyz8I45mAjj1AEGnN0WsCrxqH1r4sV7xsCbDPLaPbPEdjCCsaJGR4gc6-hyT3fu6w8zc8B2c7qcTC6Jg0e0p_GZNY35Tp1G8vR7kANR-ZFUzecsG0H7Mj0lUoT4uF91KHXoBepak8mz9u7cdlHFGd9unKVwPI59Zkps3kl0VJFF5_ocbGMoDiTZONwzcL03cINaL6DaaAFh1njm3FROB2C-BNMzqlQwNFznplw_TznbxZUv',
    },
    {
      name: 'Coffee & Wildflowers',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_ImGu9c-u_2Ys66U9d_MldCpMOuU0cEkuNjG62cqSgPFGGraQU1Hh0SG3yJ9WZCIug4gCguy0sTaTAxPw4r5yRkB9ohoWMfN-MvEafmIAvqEvcNnNlkXSDfLHA7cb-xyp5maqhsn9KT5Ch6AR-z98es0dOHqnc5UZVcOquRL6w4SjC0nx1XqtU5i0D3CWIndWcQF6W3m49qFubuDphCSADI-9_BcOXl_Q8k7u4K8AwbG2yJYDxjv',
    },
    {
      name: 'Sun-Drenched Cafe',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr3qwzchvCnVUXArqRDnkxvYwOd1-9nH3u_sauQyWcPEbyC9jqBFgHoyJJTm5fX7WZ1e0dWylUDoSWJHO2Gz6Nsvz5zVeOwGZakStHVMTZGg95jbNL4_FySev6fXvTliPWo46MsCnFODfwjiCCeU8TsftOdZynoDNzbe-NDsHvD0CfdrhA4RQ9yR_gtsrwCa0w8Redg2hLC6IqefTJMt8SNIRcwXcJlfie2T9zrPgJ9itOOiiqLLqu',
    },
    {
      name: 'Vintage Camera',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZKJMj4FlWVVtBElgQ6O2a1ttL1FT_e8e5uI34nRvhWz1c79HyCxlOuq2Qn-ypLMzVHxAoVrqFEaKkwxiTS8-9NQFdCeumnkNzd6Rg-Eq7Hw95yktrBs-ESDAk1CqgK5QzciVYpWOOOkQYG2AW08u4n2F8E1pJcgQaR_-hunPtDS3Yu1xf8aPIg4E6Wnno4Uxckc1RCGmYytxLG1nZCllBDW5uvuZWtr0ZxxtBZQzhyQn80TyQcaiY',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdatePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check camera permissions.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onUpdatePhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <main className="flex-grow pt-24 pb-32 px-6 max-w-4xl mx-auto w-full">
      {/* Step Indicator */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#6d1824] text-white flex items-center justify-center font-bold shadow-md">
            1
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 text-[#6d1824] uppercase tracking-wider">
            Visual
          </span>
        </div>
        <div className="w-12 h-[1px] bg-[#dcc0c0]" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-8 h-8 rounded-full border-2 border-[#A5A58D] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 uppercase tracking-wider">
            Melody
          </span>
        </div>
        <div className="w-12 h-[1px] bg-[#dcc0c0]" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-8 h-8 rounded-full border-2 border-[#A5A58D] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 uppercase tracking-wider">
            Send
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#fdf9f4] p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgba(61,61,61,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5E1E24]/20 via-[#6d1824]/10 to-[#5E1E24]/20" />

        <div className="flex flex-col gap-6">
          <header className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-[#3D3D3D] mb-1">
              Choose Your Memory
            </h2>
            <p className="text-sm font-body-md text-[#564242]">
              Select a photo that captures the essence of your message.
            </p>
          </header>

          {/* Camera View Modal / Overlay */}
          {isCameraActive ? (
            <div className="flex flex-col items-center gap-4 bg-[#1c1c19] p-6 rounded-xl text-white">
              <video ref={videoRef} className="w-full max-w-md h-64 object-cover rounded-lg bg-black" />
              <div className="flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-[#6d1824] text-white rounded-full font-label-caps text-xs flex items-center gap-2 hover:bg-[#5E1E24]"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-2 border border-white/50 text-white rounded-full font-label-caps text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Option */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#897272] rounded-xl p-6 flex flex-col items-center justify-center bg-[#f7f3ee] min-h-[220px] hover:bg-[#f1ede8] transition-colors cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-5xl text-[#A5A58D] mb-3 group-hover:scale-110 transition-transform">
                  add_photo_alternate
                </span>
                <p className="text-lg font-bold font-headline-md text-[#3D3D3D]">
                  Upload Photo
                </p>
                <p className="text-xs font-label-caps text-[#564242] mt-1">
                  JPG, PNG up to 10MB
                </p>
              </div>

              {/* Camera Option */}
              <div
                onClick={startCamera}
                className="border-2 border-[#dcc0c0]/40 rounded-xl p-6 flex flex-col items-center justify-center bg-white min-h-[220px] hover:bg-[#f1ede8] transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-5xl text-[#A5A58D] mb-3 group-hover:scale-110 transition-transform">
                  photo_camera
                </span>
                <p className="text-lg font-bold font-headline-md text-[#3D3D3D]">
                  Take a Photo
                </p>
                <p className="text-xs font-label-caps text-[#564242] mt-1">
                  Use your device camera
                </p>
              </div>
            </div>
          )}

          {cameraError && (
            <p className="text-xs text-[#ba1a1a] text-center font-body-md">{cameraError}</p>
          )}

          {/* Current Selected Photo & Presets */}
          <div className="mt-4 pt-4 border-t border-[#dcc0c0]/30 space-y-3">
            <p className="text-xs font-bold font-label-caps text-[#A5A58D] uppercase tracking-wider text-center">
              Selected Memory / Presets
            </p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onUpdatePhoto(preset.url)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentPhotoUrl === preset.url
                      ? 'border-[#6d1824] ring-2 ring-[#FFB7B2]'
                      : 'border-[#dcc0c0] hover:scale-105'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Controls Bar */}
      <div className="mt-8 flex justify-between items-center bg-[#fdf9f4] p-4 rounded-full shadow-lg border border-[#dcc0c0]/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-[#564242] font-label-caps text-xs tracking-wider hover:text-[#6d1824] transition-all group cursor-pointer"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
            chevron_left
          </span>
          Back
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] transition-all active:scale-95 cursor-pointer"
        >
          Next to Canvas
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  );
};
