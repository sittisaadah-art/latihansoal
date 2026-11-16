import { Copy, FileCode2, FileSpreadsheet, Trash2, X } from 'lucide-react';
import { LeaderboardEntry, RekapLogItem } from '../types/edublox';
import { downloadFile } from '../utils/storage';

interface RekapModalProps {
  logs: RekapLogItem[];
  leaderboard: LeaderboardEntry[];
  onClearLogs: () => void;
  onShowToast: (msg: string, variant: 'success' | 'warning' | 'info') => void;
  onClose: () => void;
}

export function RekapModal({
  logs,
  leaderboard,
  onClearLogs,
  onShowToast,
  onClose,
}: RekapModalProps) {
  const total = logs.length;
  const correct = logs.filter((l) => l.status === 'Benar').length;
  const wrong = total - correct;
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgScore =
    leaderboard.length > 0
      ? Math.round(leaderboard.reduce((s, x) => s + x.score, 0) / leaderboard.length)
      : acc;

  const handleExportCSV = () => {
    if (logs.length === 0) {
      onShowToast('Tidak ada data rekap untuk diekspor.', 'warning');
      return;
    }
    const headers = [
      'Waktu',
      'Nama Pemain',
      'Kelas',
      'Nomor Soal',
      'Kategori Materi',
      'Pertanyaan',
      'Jawaban Pemain',
      'Kunci Jawaban',
      'Status',
      'Poin',
    ];
    const rows = logs.map((l) =>
      [
        l.timestamp,
        l.playerName,
        l.className,
        l.qNumber,
        l.category,
        `"${l.question.replace(/"/g, '""')}"`,
        `"${l.playerAnswer.replace(/"/g, '""')}"`,
        `"${l.correctAnswer.replace(/"/g, '""')}"`,
        l.status,
        l.points,
      ].join(',')
    );
    downloadFile(
      [headers.join(','), ...rows].join('\n'),
      'Rekap_Nilai_Edublox_Informatika.csv',
      'text/csv'
    );
  };

  const handleExportJSON = () => {
    if (logs.length === 0) {
      onShowToast('Tidak ada data rekap untuk diekspor.', 'warning');
      return;
    }
    downloadFile(
      JSON.stringify(logs, null, 2),
      'Rekap_Nilai_Edublox_Informatika.json',
      'application/json'
    );
  };

  const handleCopyTable = async () => {
    if (logs.length === 0) {
      onShowToast('Tidak ada data rekap untuk disalin.', 'warning');
      return;
    }
    const lines = logs.map(
      (l) =>
        `${l.timestamp}\t${l.playerName}\t${l.className}\t${l.qNumber}\t${l.category}\t${l.status}\t${l.points}`
    );
    const content = `Waktu\tPemain\tKelas\tNo\tKategori\tStatus\tPoin\n${lines.join('\n')}`;
    try {
      await navigator.clipboard.writeText(content);
      onShowToast(
        '📋 Tabel rekap berhasil disalin ke clipboard! Siap ditempel di Excel/Sheets.',
        'success'
      );
    } catch {
      onShowToast('Gagal menyalin otomatis. Gunakan tombol Download CSV.', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 flex items-center justify-center p-2 sm:p-5">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-4 sm:p-6 max-h-[92vh] flex flex-col overflow-hidden border-2 border-slate-200 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="font-fredoka text-xl sm:text-2xl font-bold text-slate-900">
              📊 Rekap Nilai Otomatis – Informatika
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              EDUBLOX – INFORMATICS ADVENTURE CITY · By Sitty
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-3d btn-emerald px-3 py-2 text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Download CSV
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="btn-3d btn-sky px-3 py-2 text-xs"
            >
              <FileCode2 className="w-3.5 h-3.5" /> Download JSON
            </button>
            <button
              type="button"
              onClick={handleCopyTable}
              className="btn-3d btn-orange px-3 py-2 text-xs"
            >
              <Copy className="w-3.5 h-3.5" /> Salin Tabel
            </button>
            <button
              type="button"
              onClick={onClearLogs}
              className="btn-3d btn-pink px-3 py-2 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Log
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4 tabular-nums">
          <div className="bg-slate-100 rounded-2xl p-3 text-center">
            <div className="text-[11px] font-bold text-slate-500">Total Aktivitas</div>
            <div className="font-fredoka text-xl font-bold text-slate-900">{total}</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-700">Jawaban Benar</div>
            <div className="font-fredoka text-xl font-bold text-emerald-700">{correct}</div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-3 text-center border border-rose-200">
            <div className="text-[11px] font-bold text-rose-700">Jawaban Salah</div>
            <div className="font-fredoka text-xl font-bold text-rose-700">{wrong}</div>
          </div>
          <div className="bg-sky-50 rounded-2xl p-3 text-center border border-sky-200">
            <div className="text-[11px] font-bold text-sky-700">Rata-Rata Nilai</div>
            <div className="font-fredoka text-xl font-bold text-sky-700">{avgScore}</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-3 text-center border border-purple-200 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold text-purple-700">Akurasi</div>
            <div className="font-fredoka text-xl font-bold text-purple-700">{acc}%</div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl bg-white">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead className="bg-slate-800 text-white sticky top-0">
              <tr>
                <th className="p-2.5">Waktu</th>
                <th className="p-2.5">Pemain</th>
                <th className="p-2.5">Kelas</th>
                <th className="p-2.5">No</th>
                <th className="p-2.5">Kategori Materi</th>
                <th className="p-2.5">Pertanyaan</th>
                <th className="p-2.5">Jawab</th>
                <th className="p-2.5">Kunci</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-bold">
                    Belum ada aktivitas jawaban tercatat.
                  </td>
                </tr>
              ) : (
                logs.slice(0, 200).map((l, idx) => (
                  <tr key={`${l.timestamp}-${idx}`} className="hover:bg-slate-50">
                    <td className="p-2 whitespace-nowrap">{l.timestamp}</td>
                    <td className="p-2 font-bold text-slate-900">{l.playerName}</td>
                    <td className="p-2">{l.className}</td>
                    <td className="p-2 text-center">{l.qNumber}</td>
                    <td className="p-2">{l.category}</td>
                    <td className="p-2 max-w-xs truncate" title={l.question}>
                      {l.question}
                    </td>
                    <td className="p-2">{l.playerAnswer}</td>
                    <td className="p-2 text-emerald-700 font-bold">{l.correctAnswer}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          l.status === 'Benar'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="p-2 font-bold">{l.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
