import { Trophy, X } from 'lucide-react';
import { LeaderboardEntry } from '../types/edublox';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

export function LeaderboardModal({ entries, onClose }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/75 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto border-2 border-amber-300 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="font-fredoka text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Leaderboard Juara Edublox
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Peringkat Explorer Terbaik Informatika · By Sitty
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center p-8 text-slate-500 font-bold text-sm bg-slate-50 rounded-2xl border border-slate-200">
            Belum ada catatan skor selesai. Ayo selesaikan kuis pertamamu!
          </div>
        ) : (
          <div className="space-y-2 tabular-nums">
            {entries.map((entry, idx) => {
              const medal =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
              return (
                <div
                  key={`${entry.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-fredoka text-lg font-extrabold w-8 text-center shrink-0">
                      {medal}
                    </span>
                    <div className="min-w-0">
                      <div className="font-fredoka font-bold text-slate-900 text-sm truncate">
                        {entry.name}{' '}
                        <span className="text-xs text-slate-500 font-semibold">
                          ({entry.className})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {entry.avatar} · Benar {entry.correct}/{entry.total} · {entry.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="font-fredoka text-xl font-extrabold text-sky-600">
                      {entry.score}
                    </div>
                    <div className="text-[10px] font-bold text-amber-600">{entry.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
