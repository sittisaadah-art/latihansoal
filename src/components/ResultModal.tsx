import { useState } from 'react';
import { Building2, Download, ListChecks, RotateCcw } from 'lucide-react';
import { AVATARS } from '../data/questions';
import { QuizResultSummary } from '../types/edublox';
import { downloadFile, formatTime, getPlayerLevel } from '../utils/storage';

interface ResultModalProps {
  result: QuizResultSummary;
  playerName: string;
  className: string;
  avatarId: string;
  totalCoins: number;
  totalXP: number;
  onRestart: () => void;
  onClose: () => void;
}

export function ResultModal({
  result,
  playerName,
  className,
  avatarId,
  totalCoins,
  totalXP,
  onRestart,
  onClose,
}: ResultModalProps) {
  const [showReview, setShowReview] = useState(false);
  const avatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const lv = getPlayerLevel(totalXP);
  const timeStr = formatTime(result.elapsedSeconds);

  const handleDownloadReport = () => {
    const text = [
      '====================================================',
      'HASIL AKHIR PETUALANGAN – EDUBLOX INFORMATIKA BY SITTY',
      '====================================================',
      `Nama Pemain   : ${playerName}`,
      `Kelas         : ${className}`,
      `Nilai Akhir   : ${result.score}`,
      `Benar / Salah : ${result.correct} / ${result.wrong} (Total ${result.total})`,
      `Total Koin    : ${totalCoins}`,
      `Total XP      : ${totalXP}`,
      `Waktu         : ${timeStr}`,
      '====================================================',
    ].join('\n');
    downloadFile(text, `Hasil_Edublox_${playerName}.txt`, 'text/plain');
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-7 max-h-[94vh] overflow-y-auto text-center border-4 border-amber-400 shadow-2xl">
        <div className="text-xs font-extrabold text-purple-700 mb-1">
          EDUBLOX – INFORMATIKA · HASIL PETUALANGAN · BY SITTY
        </div>
        <h2 className="font-fredoka text-3xl sm:text-4xl font-extrabold text-slate-900">
          PETUALANGAN SELESAI!
        </h2>
        <div className="inline-block mt-2 px-5 py-1.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-fredoka font-bold text-lg shadow-sm">
          {result.predicate}
        </div>

        {/* Score Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 tabular-nums">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-sky-700">Nilai Akhir</div>
            <div className="font-fredoka text-3xl font-extrabold text-sky-800">{result.score}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-emerald-700">Benar / Salah</div>
            <div className="font-fredoka text-2xl font-extrabold text-emerald-700">
              {result.correct} / <span className="text-rose-600">{result.wrong}</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-amber-700">Koin & XP Sesi</div>
            <div className="font-fredoka text-lg font-extrabold text-amber-800">
              +{result.sessionCoins} 🪙 · +{result.sessionXP} XP
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-purple-700">Akurasi & Waktu</div>
            <div className="font-fredoka text-lg font-extrabold text-purple-800">
              {result.accuracy}% · {timeStr}
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-3 mb-5 flex flex-wrap items-center justify-around gap-2 text-xs sm:text-sm font-bold text-slate-700">
          <span>
            Pemain: <b className="text-slate-900">{playerName}</b>
          </span>
          <span>
            Avatar: <b className="text-slate-900">{avatar.icon} {avatar.name}</b>
          </span>
          <span>
            Level: <b className="text-purple-700">Lv.{lv.level} {lv.title}</b>
          </span>
          <span className="tabular-nums">
            Total Soal: <b className="text-slate-900">{result.total}</b>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="btn-3d btn-emerald py-3 px-3 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" /> MAIN LAGI
          </button>
          <button
            type="button"
            onClick={() => setShowReview((s) => !s)}
            className="btn-3d btn-sky py-3 px-3 text-xs sm:text-sm"
          >
            <ListChecks className="w-4 h-4" /> PEMBAHASAN
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="btn-3d btn-orange py-3 px-3 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" /> DOWNLOAD HASIL
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-3d btn-purple py-3 px-3 text-xs sm:text-sm"
          >
            <Building2 className="w-4 h-4" /> KE KOTA
          </button>
        </div>

        {showReview && (
          <div className="mt-5 text-left border-t border-slate-200 pt-4">
            <h3 className="font-fredoka text-lg font-bold text-slate-900 mb-3">
              Pembahasan Jawaban Sesi Ini
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {result.history.map((item, idx) => (
                <div
                  key={`${item.qNumber}-${idx}`}
                  className={`p-3 rounded-xl border text-xs ${
                    item.status === 'Benar'
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="font-bold text-slate-900">
                    {idx + 1}. [{item.category}] {item.question}
                  </div>
                  <div className="mt-1 text-slate-700">
                    Jawabanmu: <b>{item.playerAnswer}</b> · Kunci:{' '}
                    <b className="text-emerald-700">{item.correctAnswer}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
