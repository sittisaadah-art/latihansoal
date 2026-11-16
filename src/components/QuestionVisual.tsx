import { QuestionVisualId } from '../types/edublox';

interface QuestionVisualProps {
  visualId: QuestionVisualId;
}

export function QuestionVisual({ visualId }: QuestionVisualProps) {
  if (visualId === 'gambar1') {
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Gambar 1. Antarmuka sebuah spreadsheet
        </div>
        <div className="min-w-[440px] max-w-lg mx-auto border border-slate-400 rounded-lg overflow-hidden bg-white shadow-xs">
          {/* Ribbon */}
          <div className="bg-emerald-800 text-white px-3 py-1.5 flex items-center gap-4 text-[11px] font-semibold">
            <span>File</span>
            <span>Home</span>
            <span>Insert</span>
            <span>Formulas</span>
            <span>Data</span>
            <span>View</span>
          </div>
          {/* Formula bar row */}
          <div className="bg-slate-100 border-b border-slate-300 px-2 py-1 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold shrink-0">
              1
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono font-bold">
              B3
            </span>
            <span className="text-slate-500 italic font-serif">fx</span>
            <span className="flex-1 px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono">
              85
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold shrink-0">
              2
            </span>
          </div>
          {/* Grid */}
          <table className="w-full border-collapse text-[11px] tabular-nums">
            <thead>
              <tr className="bg-slate-200 text-slate-700">
                <th className="border border-slate-300 w-10 py-1 text-center"></th>
                <th className="border border-slate-300 py-1 text-center">A</th>
                <th className="border border-slate-300 py-1 text-center">B</th>
                <th className="border border-slate-300 py-1 text-center">C</th>
                <th className="border border-slate-300 py-1 text-center">D</th>
                <th className="border border-slate-300 py-1 text-center relative">
                  E
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-700 text-white text-[9px] font-bold">
                    3
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 bg-slate-200 text-center font-bold">1</td>
                <td className="border border-slate-300 px-2 py-0.5 font-bold">Nama</td>
                <td className="border border-slate-300 px-2 py-0.5 font-bold">Nilai</td>
                <td className="border border-slate-300 px-2 py-0.5 font-bold">Kelas</td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-200 text-center font-bold">2</td>
                <td className="border border-slate-300 px-2 py-0.5">Andi</td>
                <td className="border border-slate-300 px-2 py-0.5 text-right">90</td>
                <td className="border border-slate-300 px-2 py-0.5">7A</td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-200 text-center font-bold">3</td>
                <td className="border border-slate-300 px-2 py-0.5">Budi</td>
                <td className="border-2 border-emerald-600 px-2 py-0.5 text-right font-bold bg-emerald-50 relative">
                  85
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-700 text-white text-[9px] font-bold">
                    5
                  </span>
                </td>
                <td className="border border-slate-300 px-2 py-0.5">7A</td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-200 text-center font-bold">4</td>
                <td className="border border-slate-300 px-2 py-0.5">Citra</td>
                <td className="border border-slate-300 px-2 py-0.5 text-right">78</td>
                <td className="border border-slate-300 px-2 py-0.5">7B</td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-200 text-center font-bold">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-700 text-white text-[9px] font-bold mr-0.5">
                    4
                  </span>
                  5
                </td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
                <td className="border border-slate-300 px-2 py-0.5"></td>
              </tr>
            </tbody>
          </table>
          {/* Sheet bar */}
          <div className="bg-slate-100 border-t border-slate-300 px-2 py-1 flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
              6
            </span>
            <span className="px-2 py-0.5 bg-white border-b-2 border-emerald-600 font-bold text-emerald-800">
              Sheet1
            </span>
            <span className="px-2 py-0.5 text-slate-600">Nilai</span>
            <span className="px-1 text-slate-500">+</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualId === 'gambar2' || visualId === 'figure2') {
    const isEn = visualId === 'figure2';
    const rows = [
      ['2', 'Andi', '7A', '85', ''],
      ['3', 'Budi', '7A', '92', ''],
      ['4', 'Citra', '7B', '78', ''],
      ['5', 'Dewi', '7B', '88', ''],
      ['6', 'Eko', '7A', '65', ''],
      ['7', 'Fira', '7B', '72', ''],
    ];
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          {isEn
            ? 'Figure 2. Test scores of the students'
            : 'Gambar 2. Data nilai ulangan Informatika'}
        </div>
        <table className="min-w-[340px] max-w-md mx-auto border-collapse bg-white text-[11px] tabular-nums">
          <thead>
            <tr className="bg-slate-200 text-slate-700">
              <th className="border border-slate-300 px-2 py-1"></th>
              <th className="border border-slate-300 px-3 py-1">A</th>
              <th className="border border-slate-300 px-3 py-1">B</th>
              <th className="border border-slate-300 px-3 py-1">C</th>
              <th className="border border-slate-300 px-3 py-1">D</th>
            </tr>
            <tr className="bg-slate-100 font-bold text-slate-800">
              <td className="border border-slate-300 bg-slate-200 px-2 py-1 text-center">1</td>
              <td className="border border-slate-300 px-3 py-1">
                {isEn ? 'Student Name' : 'Nama Siswa'}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-center">
                {isEn ? 'Class' : 'Kelas'}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-right">
                {isEn ? 'Score' : 'Nilai'}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-center">Status</td>
            </tr>
          </thead>
          <tbody>
            {rows.map(([rowNum, name, cls, score, st]) => (
              <tr key={rowNum}>
                <td className="border border-slate-300 bg-slate-200 px-2 py-1 text-center font-bold">
                  {rowNum}
                </td>
                <td className="border border-slate-300 px-3 py-1">{name}</td>
                <td className="border border-slate-300 px-3 py-1 text-center">{cls}</td>
                <td className="border border-slate-300 px-3 py-1 text-right font-semibold">
                  {score}
                </td>
                <td className="border border-slate-300 px-3 py-1 text-center">{st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visualId === 'table1') {
    const days = [
      ['Monday', '30'],
      ['Tuesday', '25'],
      ['Wednesday', '45'],
      ['Thursday', '20'],
      ['Friday', '50'],
    ];
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Table 1. Library visits in one week
        </div>
        <table className="min-w-[260px] max-w-xs mx-auto border-collapse bg-white text-[11px] tabular-nums">
          <thead>
            <tr className="bg-amber-100 text-slate-900 font-bold">
              <th className="border border-slate-300 px-3 py-1 text-left">Day</th>
              <th className="border border-slate-300 px-3 py-1 text-right">Number of visits</th>
            </tr>
          </thead>
          <tbody>
            {days.map(([d, v]) => (
              <tr key={d}>
                <td className="border border-slate-300 px-3 py-1">{d}</td>
                <td className="border border-slate-300 px-3 py-1 text-right font-semibold">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visualId === 'gambar3') {
    const rows = [
      ['2', 'Nasi Goreng', 'Makanan', '12000', '25'],
      ['3', 'Es Teh', 'Minuman', '4000', '40'],
      ['4', 'Mie Ayam', 'Makanan', '10000', '20'],
      ['5', 'Jus Jeruk', 'Minuman', '8000', '15'],
      ['6', 'Bakso', 'Makanan', '11000', '18'],
    ];
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Gambar 3. Data penjualan kantin
        </div>
        <table className="min-w-[360px] max-w-md mx-auto border-collapse bg-white text-[11px] tabular-nums">
          <thead>
            <tr className="bg-slate-200 text-slate-700">
              <th className="border border-slate-300 px-2 py-1"></th>
              <th className="border border-slate-300 px-3 py-1">A</th>
              <th className="border border-slate-300 px-3 py-1">B</th>
              <th className="border border-slate-300 px-3 py-1">C</th>
              <th className="border border-slate-300 px-3 py-1">D</th>
            </tr>
            <tr className="bg-slate-100 font-bold text-slate-800">
              <td className="border border-slate-300 bg-slate-200 px-2 py-1 text-center">1</td>
              <td className="border border-slate-300 px-3 py-1">Nama Produk</td>
              <td className="border border-slate-300 px-3 py-1">Kategori ▼</td>
              <td className="border border-slate-300 px-3 py-1 text-right">Harga</td>
              <td className="border border-slate-300 px-3 py-1 text-right">Terjual</td>
            </tr>
          </thead>
          <tbody>
            {rows.map(([r, prod, cat, price, sold]) => (
              <tr key={r}>
                <td className="border border-slate-300 bg-slate-200 px-2 py-1 text-center font-bold">
                  {r}
                </td>
                <td className="border border-slate-300 px-3 py-1">{prod}</td>
                <td className="border border-slate-300 px-3 py-1">{cat}</td>
                <td className="border border-slate-300 px-3 py-1 text-right">{price}</td>
                <td className="border border-slate-300 px-3 py-1 text-right">{sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visualId === 'gambar4') {
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Gambar 4. Antarmuka editor Scratch
        </div>
        <div className="min-w-[420px] max-w-lg mx-auto border border-slate-400 rounded-lg overflow-hidden bg-white">
          <div className="bg-indigo-600 text-white px-3 py-1 text-[11px] font-bold flex gap-4">
            <span>File</span>
            <span>Edit</span>
            <span>Tutorials</span>
          </div>
          <div className="grid grid-cols-12 min-h-[150px] text-[10px]">
            {/* (1) Block Palette */}
            <div className="col-span-3 border-r border-slate-300 p-2 bg-slate-50 flex flex-col justify-between">
              <div className="space-y-1 font-semibold text-slate-700">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Motion
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Looks
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Events
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Control
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
                  1
                </span>{' '}
                <span className="text-slate-500">Palet Blok</span>
              </div>
            </div>

            {/* (2) Code Area */}
            <div className="col-span-5 border-r border-slate-300 p-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="bg-amber-400 text-slate-900 font-bold px-2 py-1 rounded">
                  when green flag clicked
                </div>
                <div className="bg-blue-500 text-white font-bold px-2 py-1 rounded">
                  move 10 steps
                </div>
                <div className="bg-purple-600 text-white font-bold px-2 py-1 rounded">
                  say Halo! for 2 seconds
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
                  2
                </span>{' '}
                <span className="text-slate-500">Area Kode</span>
              </div>
            </div>

            {/* (3) Stage & (4) Sprite List */}
            <div className="col-span-4 flex flex-col">
              <div className="flex-1 p-2 border-b border-slate-300 flex flex-col justify-between bg-sky-50">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-lg">🟠 🔺</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
                    3
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 text-right">Panggung</div>
              </div>
              <div className="p-2 bg-slate-100 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-white border border-indigo-400 rounded">🟠</span>
                  <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">🔺</span>
                </div>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
                  4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualId === 'table2') {
    const items = [
      ['Ani', '256'],
      ['Budi', '128'],
      ['Siti', '64'],
      ['Rian', '32'],
    ];
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Table 2. Phone storage capacity
        </div>
        <table className="min-w-[240px] max-w-xs mx-auto border-collapse bg-white text-[11px] tabular-nums">
          <thead>
            <tr className="bg-amber-100 text-slate-900 font-bold">
              <th className="border border-slate-300 px-3 py-1 text-left">Name</th>
              <th className="border border-slate-300 px-3 py-1 text-right">Storage (GB)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([n, gb]) => (
              <tr key={n}>
                <td className="border border-slate-300 px-3 py-1">{n}</td>
                <td className="border border-slate-300 px-3 py-1 text-right font-semibold">{gb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visualId === 'gambar5') {
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Gambar 5. Skrip Scratch
        </div>
        <div className="max-w-[220px] mx-auto space-y-1 font-bold text-[11px]">
          <div className="bg-amber-400 text-slate-900 px-3 py-1.5 rounded-t-xl rounded-b">
            when green flag clicked
          </div>
          <div className="bg-orange-500 text-white px-3 py-1.5 rounded">set skor to 0</div>
          <div className="bg-orange-400 text-white p-1.5 rounded">
            <div className="px-1.5 pb-1">repeat 3</div>
            <div className="bg-orange-600 text-white px-2.5 py-1 rounded ml-3">
              change skor by 2
            </div>
          </div>
          <div className="bg-purple-600 text-white px-3 py-1.5 rounded">
            say skor for 2 seconds
          </div>
        </div>
      </div>
    );
  }

  if (visualId === 'tabel3') {
    const scores = [
      ['1', '70'],
      ['2', '75'],
      ['3', '80'],
      ['4', '85'],
    ];
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs overflow-x-auto">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Tabel 3. Nilai empat ulangan Dina
        </div>
        <table className="min-w-[220px] max-w-xs mx-auto border-collapse bg-white text-[11px] tabular-nums">
          <thead>
            <tr className="bg-slate-200 text-slate-900 font-bold">
              <th className="border border-slate-300 px-3 py-1 text-center">Ulangan ke-</th>
              <th className="border border-slate-300 px-3 py-1 text-right">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(([u, v]) => (
              <tr key={u}>
                <td className="border border-slate-300 px-3 py-1 text-center">{u}</td>
                <td className="border border-slate-300 px-3 py-1 text-right font-semibold">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visualId === 'gambar6') {
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs">
        <div className="font-bold text-slate-700 mb-2 text-center">
          Gambar 6. Skrip Scratch
        </div>
        <div className="max-w-[220px] mx-auto space-y-1 font-bold text-[11px]">
          <div className="bg-amber-400 text-slate-900 px-3 py-1.5 rounded-t-xl rounded-b">
            when green flag clicked
          </div>
          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded">pen down</div>
          <div className="bg-orange-400 text-white p-1.5 rounded space-y-1">
            <div className="px-1.5">repeat 4</div>
            <div className="bg-blue-500 text-white px-2.5 py-1 rounded ml-3">move 10 steps</div>
            <div className="bg-blue-500 text-white px-2.5 py-1 rounded ml-3">
              turn right 90 degrees
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
