import { useState, type FormEvent } from 'react';
import { Lock, Unlock, X } from 'lucide-react';

interface TeacherPinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const TEACHER_PIN = 'guru123';

export function TeacherPinModal({ onSuccess, onClose }: TeacherPinModalProps) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin === TEACHER_PIN) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('PIN salah. Silakan coba lagi.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border-4 border-purple-500 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-fredoka text-xl font-bold text-slate-900">
                Akses Panel Guru
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Masukkan PIN untuk melanjutkan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 flex items-center justify-center transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="teacher-pin-input"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              PIN Guru
            </label>
            <input
              id="teacher-pin-input"
              type="password"
              autoFocus
              autoComplete="off"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Masukkan PIN..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-purple-500 outline-none font-bold text-slate-900 text-base tracking-wider"
            />
            {errorMsg && (
              <p className="mt-2 text-xs font-bold text-rose-600">{errorMsg}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d btn-slate px-4 py-2.5 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-3d btn-purple px-5 py-2.5 text-sm"
            >
              <Unlock className="w-4 h-4" />
              Masuk Panel Guru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
