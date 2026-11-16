import { useState } from 'react';
import { CheckCircle2, UserRound, X } from 'lucide-react';
import { AVATARS, OUTFIT_COLORS } from '../data/questions';

interface CharacterModalProps {
  initialName: string;
  initialAvatarId: string;
  initialOutfitColor: string;
  initialPlayerCount: number;
  onSave: (name: string, avatarId: string, outfitColor: string, playerCount: number) => void;
  onClose: () => void;
}

export function CharacterModal({
  initialName,
  initialAvatarId,
  initialOutfitColor,
  initialPlayerCount,
  onSave,
  onClose,
}: CharacterModalProps) {
  const [name, setName] = useState(initialName);
  const [avatarId, setAvatarId] = useState(initialAvatarId);
  const [outfitColor, setOutfitColor] = useState(initialOutfitColor);
  const [playerCount, setPlayerCount] = useState(initialPlayerCount);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/75 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto border-2 border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="font-fredoka text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UserRound className="w-6 h-6 text-sky-500" />
              Kustomisasi Karakter & Multi-Player
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              EDUBLOX – INFORMATICS ADVENTURE CITY · By Sitty
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 flex items-center justify-center transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pemain Utama (P1)
              </label>
              <input
                type="text"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kamu..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-sky-500 outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Warna Pakaian Utama
              </label>
              <div className="flex flex-wrap gap-2">
                {OUTFIT_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setOutfitColor(hex)}
                    className={`w-9 h-9 rounded-xl transition ${
                      outfitColor === hex
                        ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
                        : 'border-2 border-white shadow'
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={`Pilih warna ${hex}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jumlah Pemain Satu Layar (Multi-Player)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPlayerCount(n)}
                    className={`py-2 rounded-xl font-bold text-sm border-2 transition ${
                      playerCount === n
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    {n === 1 ? '1P (Solo)' : `${n}P`}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                <b>P1:</b> WASD + Spasi · <b>P2:</b> Arrow Keys + Right Shift · <b>P3 & P4:</b> Pendamping Kota Aktif.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih 1 dari 6 Avatar Lucu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVATARS.map((av) => {
                const selected = av.id === avatarId;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarId(av.id)}
                    className={`p-3 rounded-2xl border-2 text-center transition ${
                      selected
                        ? 'border-sky-500 bg-sky-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{av.icon}</div>
                    <div className="font-fredoka font-bold text-xs text-slate-900">
                      {av.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{av.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => onSave(name.trim() || 'Explorer', avatarId, outfitColor, playerCount)}
            className="btn-3d btn-emerald px-6 py-3 text-base"
          >
            <CheckCircle2 className="w-5 h-5" />
            SIMPAN & MASUK KOTA
          </button>
        </div>
      </div>
    </div>
  );
}
