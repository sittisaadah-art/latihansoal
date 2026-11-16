import {
  AvatarDefinition,
  BuildingCode,
  BuildingMeta,
  CanteenItem,
  LevelDefinition,
  QuestionItem,
} from '../types/edublox';

export const AVATARS: AvatarDefinition[] = [
  { id: 'raja', name: 'Raja Blox', icon: '👑', desc: 'Mahkota Emas', color: '#facc15' },
  { id: 'neko', name: 'Neko Pink', icon: '🐱', desc: 'Telinga Kucing', color: '#ec4899' },
  { id: 'kapten', name: 'Kapten Bintang', icon: '🛸', desc: 'Antena Angkasa', color: '#38bdf8' },
  { id: 'knight', name: 'Emerald Knight', icon: '🛡️', desc: 'Kostum Hijau', color: '#10b981' },
  { id: 'wizard', name: 'Rainbow Wizard', icon: '🧙', desc: 'Topi Penyihir', color: '#8b5cf6' },
  { id: 'noob', name: 'Classic Noob', icon: '🧱', desc: 'Blocky Klasik', color: '#f97316' },
];

export const OUTFIT_COLORS = [
  '#38bdf8',
  '#10b981',
  '#8b5cf6',
  '#f97316',
  '#facc15',
  '#ec4899',
];

export const LEVELS: LevelDefinition[] = [
  { level: 1, title: 'New Explorer', minXP: 0 },
  { level: 2, title: 'Data Beginner', minXP: 150 },
  { level: 3, title: 'Spreadsheet Student', minXP: 350 },
  { level: 4, title: 'Formula Master', minXP: 600 },
  { level: 5, title: 'Scratch Creator', minXP: 900 },
  { level: 6, title: 'Informatics Champion', minXP: 1250 },
];

export const CANTEEN_ITEMS: CanteenItem[] = [
  { id: 'esteh', name: 'Es Teh Manis', icon: '🧋', price: 20, xp: 15, desc: 'Segar setelah mikir rumus!' },
  { id: 'burger', name: 'Burger Blox', icon: '🍔', price: 50, xp: 45, desc: 'Energi ekstra menjelajah kota!' },
  { id: 'pizza', name: 'Pizza Voxel', icon: '🍕', price: 70, xp: 65, desc: 'Lezatnya bikin fokus kuis!' },
  { id: 'donat', name: 'Donat Pelangi', icon: '🍩', price: 30, xp: 25, desc: 'Manis ceria ala Edublox!' },
  { id: 'eskrim', name: 'Es Krim Sundae', icon: '🍨', price: 35, xp: 30, desc: 'Dingin menyegarkan pikiran!' },
  { id: 'bakso', name: 'Bakso Spesial', icon: '🍜', price: 60, xp: 55, desc: 'Hangat & mengenyangkan!' },
];

export const BUILDINGS_META: Record<BuildingCode, BuildingMeta> = {
  A: {
    name: 'Gedung A – Computational Thinking',
    short: 'Gedung A: Computational Thinking',
    color: 0xf97316,
    hex: '#f97316',
    pos: { x: -65, z: -65 },
    icon: '🧠',
    desc: 'Dekomposisi, Pola, Abstraksi & Algoritma',
  },
  B: {
    name: 'Gedung B – Data & Information',
    short: 'Gedung B: Data & Information',
    color: 0x38bdf8,
    hex: '#38bdf8',
    pos: { x: 65, z: -65 },
    icon: '📊',
    desc: 'Data Mentah, Informasi, Analisis & Interpretasi',
  },
  C: {
    name: 'Gedung C – Spreadsheet Academy',
    short: 'Gedung C: Spreadsheet Academy',
    color: 0x10b981,
    hex: '#10b981',
    pos: { x: -75, z: 45 },
    icon: '📗',
    desc: 'Sel, Range, Grafik, Fill Handle & Referensi Absolut',
  },
  D: {
    name: 'Gedung D – Formula Laboratory',
    short: 'Gedung D: Formula Laboratory',
    color: 0x8b5cf6,
    hex: '#8b5cf6',
    pos: { x: 75, z: 45 },
    icon: '🧪',
    desc: 'SUM, COUNT, AVERAGE, MEDIAN, MAX/MIN, IF, AND/OR',
  },
  E: {
    name: 'Gedung E – Data Management & Scratch',
    short: 'Gedung E: Data Mgmt & Scratch',
    color: 0xec4899,
    hex: '#ec4899',
    pos: { x: 0, z: 85 },
    icon: '🐱',
    desc: 'Sort, Filter, Data Validation, Sprite, Stage & Repeat',
  },
};

export const DEFAULT_QUESTIONS: QuestionItem[] = [
  // =========================================================================
  // BAGIAN A: PILIHAN GANDA PSAS (NO. 1–10)
  // =========================================================================
  {
    id: 1,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'PSAS',
    type: 'single',
    question:
      'Rani akan merencanakan acara ulang tahun adiknya. Ia memecah acara tersebut menjadi bagian-bagian kecil, yaitu daftar tamu, ukuran kue, waktu, tempat, dan susunan acara. Komponen berpikir komputasional yang diterapkan Rani adalah ....',
    options: {
      A: 'abstraksi',
      B: 'dekomposisi',
      C: 'pengenalan pola',
      D: 'algoritma',
    },
    answer: 'B',
    explanation:
      'Memecah masalah besar (acara ulang tahun) menjadi bagian-bagian kecil agar lebih mudah dikelola disebut dekomposisi.',
  },
  {
    id: 2,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'single',
    question:
      'Perangkat lunak yang digunakan untuk membuat, mengelola, dan menganalisis data dalam bentuk tabel yang terdiri atas baris dan kolom disebut perkakas pengolah ....',
    options: {
      A: 'kata',
      B: 'presentasi',
      C: 'gambar',
      D: 'lembar kerja (spreadsheet)',
    },
    answer: 'D',
    explanation:
      'Perangkat lunak pengolah tabel berisi baris dan kolom disebut pengolah lembar kerja (spreadsheet).',
  },
  {
    id: 3,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'single',
    question:
      'In a spreadsheet, the small box where a column and a row meet, and where data can be entered, is called a ....',
    options: {
      A: 'cell',
      B: 'worksheet',
      C: 'chart',
      D: 'formula bar',
    },
    answer: 'A',
    explanation:
      'Cell (sel) adalah kotak kecil pertemuan antara kolom dan baris tempat data atau rumus dimasukkan.',
  },
  {
    id: 4,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'single',
    visualId: 'gambar1',
    question:
      'Perhatikan Gambar 1! Dina ingin langsung menuju sel D10 tanpa menggulir layar. Ia dapat mengetik alamat sel tersebut pada bagian yang bernomor ....',
    options: {
      A: '(3)',
      B: '(4)',
      C: '(1)',
      D: '(6)',
    },
    answer: 'C',
    explanation:
      'Bagian bernomor (1) adalah Name Box (kotak nama sel) yang berfungsi menampilkan dan langsung menuju alamat sel tertentu.',
  },
  {
    id: 5,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'single',
    visualId: 'gambar2',
    question:
      'Perhatikan Gambar 2! Rumus yang tepat untuk menghitung jumlah seluruh nilai pada kolom C (sel C2 sampai C7) adalah ....',
    options: {
      A: '=COUNT(C2:C7)',
      B: '=SUM(C2:C7)',
      C: '=SUM(C2;C7)',
      D: '=AVERAGE(C2:C7)',
    },
    answer: 'B',
    explanation:
      'Untuk menjumlahkan seluruh sel dari C2 sampai C7 secara berurutan digunakan range bertanda titik dua, yaitu =SUM(C2:C7).',
  },
  {
    id: 6,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'single',
    visualId: 'gambar2',
    question:
      'Perhatikan kembali Gambar 2! Dewi ingin mengetahui nilai ulangan tertinggi pada data tersebut. Rumus yang digunakan dan hasilnya adalah ....',
    options: {
      A: '=MIN(C2:C7), hasilnya 65',
      B: '=MAX(C2:C7), hasilnya 88',
      C: '=COUNT(C2:C7), hasilnya 6',
      D: '=MAX(C2:C7), hasilnya 92',
    },
    answer: 'D',
    explanation:
      'Fungsi MAX mencari nilai terbesar pada range C2:C7 (85, 92, 78, 88, 65, 72), sehingga hasilnya adalah 92.',
  },
  {
    id: 7,
    building: 'D',
    category: 'Fungsi Logika',
    source: 'PSAS',
    type: 'single',
    visualId: 'figure2',
    question:
      'Look at Figure 2! Mr. Andi types =IF(C2>75;"Pass";"Retake") in cell D2 and copies it down to D7 using the fill handle. How many students get "Retake" in column D?',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '4',
    },
    answer: 'B',
    explanation:
      'Siswa dengan nilai <= 75 mendapatkan "Retake", yaitu Eko (65) dan Fira (72), berjumlah 2 siswa.',
  },
  {
    id: 8,
    building: 'E',
    category: 'Sort, Filter, dan Data Validation',
    source: 'PSAS',
    type: 'single',
    question:
      'Bu Sari memiliki tabel dengan kolom Kelas, Nama, dan Nilai Ujian. Ia ingin data diurutkan berdasarkan Kelas, kemudian di dalam setiap kelas diurutkan lagi berdasarkan Nilai Ujian dari yang tertinggi. Pengaturan tambahan yang perlu dipilih pada kotak dialog pengurutan (Sort) adalah ....',
    options: {
      A: 'Add Level (menambah tingkat pengurutan)',
      B: 'Filter (menyaring data)',
      C: 'Data Validation (validasi data)',
      D: 'Protect File (melindungi berkas)',
    },
    answer: 'A',
    explanation:
      'Tombol Add Level digunakan untuk menambahkan tingkat/kriteria pengurutan kedua (berdasarkan Nilai Ujian setelah Kelas).',
  },
  {
    id: 9,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'PSAS',
    type: 'single',
    visualId: 'table1',
    question:
      'Look at Table 1! The librarian will add one extra staff member on the busiest day and close the reading room on the quietest day. Which decision is supported by the data?',
    options: {
      A: 'Extra staff on Wednesday; close the reading room on Thursday',
      B: 'Extra staff on Friday; close the reading room on Tuesday',
      C: 'Extra staff on Friday; close the reading room on Thursday',
      D: 'Extra staff on Monday; close the reading room on Wednesday',
    },
    answer: 'C',
    explanation:
      'Hari tersibuk adalah Friday (50 kunjungan) dan hari tersepi adalah Thursday (20 kunjungan).',
  },
  {
    id: 10,
    building: 'E',
    category: 'Sort, Filter, dan Data Validation',
    source: 'PSAS',
    type: 'single',
    visualId: 'gambar3',
    question:
      'Perhatikan Gambar 3! Fitur Filter diterapkan pada kolom Kategori dengan hanya memilih "Makanan". Keadaan baris setelah filter diterapkan adalah ....',
    options: {
      A: 'baris 2, 3, dan 4 tampil; dua baris lainnya disembunyikan',
      B: 'baris 3 dan 5 tampil; tiga baris lainnya disembunyikan',
      C: 'baris 2, 4, dan 6 tampil; baris 3 dan 5 disembunyikan sementara',
      D: 'baris 2, 4, dan 6 tampil; baris 3 dan 5 dihapus permanen',
    },
    answer: 'C',
    explanation:
      'Data Kategori "Makanan" berada di baris 2 (Nasi Goreng), 4 (Mie Ayam), dan 6 (Bakso). Baris 3 dan 5 hanya disembunyikan sementara oleh Filter.',
  },

  // =========================================================================
  // BAGIAN B: PILIHAN GANDA KOMPLEKS PSAS (NO. 11–20, PILIH 2 JAWABAN)
  // =========================================================================
  {
    id: 11,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'PSAS',
    type: 'complex',
    question: 'Pilihlah dua pernyataan yang benar tentang komponen berpikir komputasional!',
    options: {
      A: 'Dekomposisi adalah memecah masalah kompleks menjadi bagian-bagian yang lebih kecil.',
      B: 'Abstraksi adalah mengamati hubungan antarbagian masalah untuk menemukan kesamaan.',
      C: 'Pengenalan pola adalah memilih informasi yang relevan dan mengabaikan detail yang tidak perlu.',
      D: 'Algoritma adalah menyusun langkah-langkah yang sistematis untuk menyelesaikan masalah.',
    },
    complexAnswers: ['A', 'D'],
    explanation:
      'Pernyataan A (Dekomposisi) dan D (Algoritma) benar. Pernyataan B dan C tertukar definisinya antara pengenalan pola dan abstraksi.',
  },
  {
    id: 12,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'PSAS',
    type: 'complex',
    question: 'Select TWO correct statements about data!',
    options: {
      A: 'Data is a collection of basic facts that can be numbers, words, images, or symbols.',
      B: 'Raw data always gives a complete picture without being processed.',
      C: 'Data needs to be processed to become useful information.',
      D: 'Data analysis means deleting the data that is hard to understand.',
    },
    complexAnswers: ['A', 'C'],
    explanation:
      'Data adalah kumpulan fakta dasar (A) yang perlu diolah agar menjadi informasi yang berguna (C).',
  },
  {
    id: 13,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'complex',
    visualId: 'gambar1',
    question: 'Perhatikan kembali Gambar 1! Pilihlah dua pernyataan yang benar berdasarkan Gambar 1!',
    options: {
      A: 'Nomor (3) adalah header baris yang ditandai dengan angka.',
      B: 'Sel aktif beralamat B3 karena berada pada kolom B dan baris 3.',
      C: 'Nomor (6) menunjukkan sheet yang sedang aktif, yaitu Sheet1.',
      D: 'Nomor (2) digunakan untuk berpindah antarlembar kerja.',
    },
    complexAnswers: ['B', 'C'],
    explanation:
      'Sel aktif pada Gambar 1 berada di B3 (B) dan nomor (6) menunjuk tab Sheet1 yang sedang aktif (C). Nomor (3) adalah header kolom dan (2) adalah Formula Bar.',
  },
  {
    id: 14,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'complex',
    visualId: 'gambar2',
    question: 'Perhatikan kembali Gambar 2! Pilihlah dua rumus yang menghasilkan angka 480!',
    options: {
      A: '=COUNT(C2:C7)',
      B: '=SUM(C2;C7)',
      C: '=SUM(C2:C7)',
      D: '=AVERAGE(C2:C7)*6',
    },
    complexAnswers: ['C', 'D'],
    explanation:
      'Jumlah 85+92+78+88+65+72 = 480 (=SUM(C2:C7)). Rata-ratanya 80, dikali 6 juga menghasilkan 480 (=AVERAGE(C2:C7)*6).',
  },
  {
    id: 15,
    building: 'C',
    category: 'Tabel, Grafik, dan Range',
    source: 'PSAS',
    type: 'complex',
    question: 'Pilihlah dua pernyataan yang benar tentang penulisan rumus pada spreadsheet!',
    options: {
      A: 'Range ditulis dengan format [sel kanan bawah]:[sel kiri atas].',
      B: 'Range B3:D4 merujuk pada enam sel, yaitu B3, B4, C3, C4, D3, dan D4.',
      C: 'Pemisah parameter pada rumus harus selalu berupa tanda koma di semua komputer.',
      D: 'Pada komputer dengan pengaturan regional Indonesia, pemisah parameter umumnya berupa tanda titik koma (;).',
    },
    complexAnswers: ['B', 'D'],
    explanation:
      'Range B3:D4 mencakup 3 kolom × 2 baris = 6 sel (B), dan regional Indonesia umumnya memakai titik koma (;) sebagai pemisah argumen (D).',
  },
  {
    id: 16,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'complex',
    visualId: 'gambar2',
    question: 'Perhatikan kembali Gambar 2! Pilihlah dua rumus yang menghasilkan angka 88!',
    options: {
      A: '=LARGE(C2:C7;2)',
      B: '=SMALL(C2:C7;5)',
      C: '=MEDIAN(C2:C7)',
      D: '=MAX(C2:C7)',
    },
    complexAnswers: ['A', 'B'],
    explanation:
      'Urutan data: 65, 72, 78, 85, 88, 92. Nilai terbesar ke-2 (=LARGE(C2:C7;2)) adalah 88, dan nilai terkecil ke-5 (=SMALL(C2:C7;5)) juga 88.',
  },
  {
    id: 17,
    building: 'D',
    category: 'Fungsi Logika',
    source: 'PSAS',
    type: 'complex',
    question: 'Select TWO correct statements about logical functions in a spreadsheet!',
    options: {
      A: 'OR returns TRUE only when all conditions are true.',
      B: 'IF can only return the values TRUE or FALSE.',
      C: 'AND returns TRUE only when all conditions are true.',
      D: 'NOT reverses a logical value: TRUE becomes FALSE and FALSE becomes TRUE.',
    },
    complexAnswers: ['C', 'D'],
    explanation:
      'AND bernilai TRUE hanya jika semua kondisi benar (C), dan NOT membalik nilai logika TRUE/FALSE (D).',
  },
  {
    id: 18,
    building: 'E',
    category: 'Sort, Filter, dan Data Validation',
    source: 'PSAS',
    type: 'complex',
    question: 'Pilihlah dua pernyataan yang benar tentang fitur Filter pada spreadsheet!',
    options: {
      A: 'Filter menyembunyikan sementara data yang tidak memenuhi kriteria tanpa menghapusnya.',
      B: 'Filter digunakan untuk mengubah urutan data dari yang terkecil ke yang terbesar.',
      C: 'Setelah Filter diaktifkan, tombol drop-down muncul pada header kolom.',
      D: 'Data yang tersembunyi oleh Filter akan terhapus secara permanen.',
    },
    complexAnswers: ['A', 'C'],
    explanation:
      'Filter menyembunyikan data yang tidak sesuai kriteria secara sementara (A) dan memunculkan tombol drop-down di header kolom (C).',
  },
  {
    id: 19,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'PSAS',
    type: 'complex',
    question: 'A student is planning a class picnic. Select TWO actions that show computational thinking!',
    options: {
      A: 'Doing every task at once without making a list.',
      B: 'Splitting the plan into smaller tasks: food, transport, and games.',
      C: 'Noticing that the budget per student is about the same every year and reusing that pattern.',
      D: 'Asking the teacher to make every decision.',
    },
    complexAnswers: ['B', 'C'],
    explanation:
      'Memecah rencana menjadi tugas kecil adalah dekomposisi (B), dan mengenali kesamaan anggaran tahunan adalah pengenalan pola (C).',
  },
  {
    id: 20,
    building: 'C',
    category: 'Tabel, Grafik, dan Range',
    source: 'PSAS',
    type: 'complex',
    question:
      'Sandi akan menyajikan beberapa data dalam bentuk grafik pada spreadsheet. Pilihlah dua pasangan data dan jenis grafik yang paling tepat!',
    options: {
      A: 'Persentase minat siswa terhadap mata pelajaran – grafik lingkaran',
      B: 'Perbandingan nilai ulangan lima siswa – grafik lingkaran',
      C: 'Persentase pilihan ekstrakurikuler siswa – grafik batang karena grafik lingkaran tidak dapat menampilkan persentase',
      D: 'Perbandingan jumlah buku yang terjual setiap bulan – grafik batang',
    },
    complexAnswers: ['A', 'D'],
    explanation:
      'Grafik lingkaran (pie chart) tepat untuk persentase bagian dari keseluruhan (A), sedangkan grafik batang tepat untuk membandingkan jumlah antar kategori/bulan (D).',
  },

  // =========================================================================
  // BAGIAN C: BENAR - SALAH PSAS (NO. 21–30, 3 PERNYATAAN PER SOAL)
  // =========================================================================
  {
    id: 21,
    building: 'E',
    category: 'Scratch',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'gambar4',
    question: 'Perhatikan Gambar 4 (Antarmuka editor Scratch)! Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Bagian bernomor (3) adalah Stage, tempat sprite beraksi dan hasil program ditampilkan.',
      'Bagian bernomor (1) adalah area kode tempat blok-blok disusun menjadi program.',
      'Bagian bernomor (4) adalah daftar sprite yang digunakan untuk memilih sprite yang akan diedit.',
    ],
    tfAnswers: ['Benar', 'Salah', 'Benar'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      '(3) benar adalah Stage, (1) adalah Block Palette bukan area kode (area kode adalah nomor 2), dan (4) benar adalah daftar sprite.',
  },
  {
    id: 22,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'table2',
    question: 'Look at Table 2! Decide whether each statement is True or False!',
    statements: [
      'Ani has the largest storage capacity among the four students.',
      'The total storage capacity of the four students is 460 GB.',
      'Rian has more storage capacity than Siti.',
    ],
    tfAnswers: ['Benar', 'Salah', 'Salah'],
    tfLabels: ['True', 'False'],
    explanation:
      'Ani terbesar (256 GB = True). Total penyimpanan = 256+128+64+32 = 480 GB bukan 460 GB (False). Rian (32 GB) lebih kecil dari Siti (64 GB) (False).',
  },
  {
    id: 23,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'truefalse',
    question: 'Tentukan Benar atau Salah untuk setiap pernyataan tentang spreadsheet berikut!',
    statements: [
      'Alamat sel dibaca dengan menyebut baris terlebih dahulu, kemudian kolom, misalnya 3B.',
      'Dalam satu berkas spreadsheet dapat terdapat beberapa lembar kerja (sheet) yang namanya dapat diubah.',
      'Sebuah sel dapat berisi angka, teks, atau rumus perhitungan.',
    ],
    tfAnswers: ['Salah', 'Benar', 'Benar'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'Alamat sel selalu dimulai dari huruf kolom lalu angka baris (misal B3, jadi pernyataan 1 Salah). Pernyataan 2 dan 3 Benar.',
  },
  {
    id: 24,
    building: 'C',
    category: 'Tabel, Grafik, dan Range',
    source: 'PSAS',
    type: 'truefalse',
    question:
      'Bu Ratna meminta Cindy merapikan tampilan tabel nilai pada spreadsheet. Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Untuk menebalkan judul kolom, Cindy memilih sel judul kolom lalu menggunakan perintah Bold.',
      'Untuk memberi warna latar pada judul kolom, Cindy menggunakan perintah Fill Color.',
      'Lebar kolom hanya dapat diubah dengan menghapus data pada kolom tersebut.',
    ],
    tfAnswers: ['Benar', 'Benar', 'Salah'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'Bold menebalkan teks (Benar), Fill Color memberi warna latar sel (Benar), dan lebar kolom dapat diubah dengan menggeser batas kolom tanpa menghapus data (Salah).',
  },
  {
    id: 25,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'gambar2',
    question: 'Perhatikan kembali Gambar 2! Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Rumus =COUNTIF(C2:C7;">80") menghasilkan angka 2.',
      'Rumus =SUMIF(B2:B7;"7A";C2:C7) menghasilkan angka 242.',
      'Rumus =COUNT(A2:A7) menghasilkan angka 6.',
    ],
    tfAnswers: ['Salah', 'Benar', 'Salah'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'Nilai >80 ada 3 (85, 92, 88) jadi pernyataan 1 Salah. Nilai kelas 7A = 85+92+65 = 242 (Benar). A2:A7 berisi teks nama siswa, sehingga =COUNT(A2:A7) menghasilkan 0 (Salah).',
  },
  {
    id: 26,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'gambar2',
    question: 'Perhatikan kembali Gambar 2! Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Rumus =AVERAGE(C2:C7) menghasilkan angka 85.',
      'Rumus =MEDIAN(C2:C7) menghasilkan angka 80.',
      'Rumus =LARGE(C2:C7;3) menghasilkan angka 85.',
    ],
    tfAnswers: ['Salah', 'Salah', 'Benar'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'AVERAGE = 480/6 = 80 (Salah). MEDIAN = (78+85)/2 = 81,5 (Salah). Nilai terbesar ke-3 = 85 (Benar).',
  },
  {
    id: 27,
    building: 'D',
    category: 'Fungsi Logika',
    source: 'PSAS',
    type: 'truefalse',
    question:
      'Pada sebuah spreadsheet, sel B2 berisi angka 85 (nilai) dan sel C2 berisi angka 70 (persentase kehadiran). Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Rumus =AND(B2>=80;C2>=75) menghasilkan FALSE.',
      'Rumus =OR(B2>=80;C2>=75) menghasilkan FALSE.',
      'Rumus =NOT(C2>=75) menghasilkan TRUE.',
    ],
    tfAnswers: ['Benar', 'Salah', 'Benar'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'B2>=80 (TRUE) dan C2>=75 (FALSE). AND = FALSE (Benar), OR = TRUE (Salah), dan NOT(FALSE) = TRUE (Benar).',
  },
  {
    id: 28,
    building: 'E',
    category: 'Sort, Filter, dan Data Validation',
    source: 'PSAS',
    type: 'truefalse',
    question:
      'A teacher wants the age column in a spreadsheet to accept only whole numbers from 12 to 18. Decide whether each statement is True or False!',
    statements: [
      'The Sort feature is used to restrict the values that can be typed into a cell.',
      'The Data Validation feature can limit input to whole numbers from 12 to 18.',
      'If someone types 25, the cell will accept it and automatically change it to 18.',
    ],
    tfAnswers: ['Salah', 'Benar', 'Salah'],
    tfLabels: ['True', 'False'],
    explanation:
      'Sort untuk mengurutkan bukan membatasi input (False). Data Validation membatasi input 12–18 (True) dan menolak angka 25 dengan pesan error, tidak otomatis mengubah ke 18 (False).',
  },
  {
    id: 29,
    building: 'E',
    category: 'Scratch',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'gambar5',
    question: 'Perhatikan Gambar 5 (Skrip Scratch)! Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Setelah skrip dijalankan, sprite mengatakan angka 6 selama 2 detik.',
      'Blok repeat 3 membuat blok change skor by 2 dijalankan sebanyak 3 kali.',
      'Blok when green flag clicked termasuk kategori Control.',
    ],
    tfAnswers: ['Benar', 'Benar', 'Salah'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'Skor awal 0 ditambah 2 sebanyak 3 kali menjadi 6 (Benar). Repeat 3 mengulang 3 kali (Benar). Blok when green flag clicked termasuk kategori Events, bukan Control (Salah).',
  },
  {
    id: 30,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'PSAS',
    type: 'truefalse',
    visualId: 'tabel3',
    question: 'Perhatikan Tabel 3! Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    statements: [
      'Nilai Dina cenderung meningkat pada setiap ulangan.',
      'Rata-rata nilai empat ulangan Dina adalah 80.',
      'Menyimpulkan bahwa "nilai Dina cenderung naik" merupakan contoh interpretasi data.',
    ],
    tfAnswers: ['Benar', 'Salah', 'Benar'],
    tfLabels: ['Benar', 'Salah'],
    explanation:
      'Nilai naik 70 -> 75 -> 80 -> 85 (Benar). Rata-ratanya = 310/4 = 77,5 bukan 80 (Salah). Menarik kesimpulan dari tren data adalah interpretasi data (Benar).',
  },

  // =========================================================================
  // BAGIAN D: ISIAN SINGKAT PSAS (NO. 31–40)
  // =========================================================================
  {
    id: 31,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'PSAS',
    type: 'short',
    question:
      'Proses memecah masalah yang kompleks menjadi bagian-bagian yang lebih kecil agar lebih mudah diselesaikan disebut ....',
    acceptedAnswers: ['dekomposisi', 'decomposition'],
    displayAnswer: 'dekomposisi',
    explanation:
      'Dekomposisi adalah proses memecah masalah besar dan kompleks menjadi bagian-bagian kecil agar mudah diselesaikan.',
  },
  {
    id: 32,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'short',
    question: 'Sebuah sel pada spreadsheet terletak pada kolom C dan baris 5. Alamat sel tersebut adalah ....',
    acceptedAnswers: ['c5'],
    displayAnswer: 'C5',
    explanation: 'Alamat sel ditulis dengan huruf kolom diikuti nomor baris, yaitu C5.',
  },
  {
    id: 33,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'short',
    question:
      'A cell in Sheet1 contains the formula =Input!B3. This formula takes the value of cell B3 from the worksheet named ....',
    acceptedAnswers: ['input'],
    displayAnswer: 'Input',
    explanation: 'Tanda seru (!) memisahkan nama worksheet dengan alamat selnya, sehingga =Input!B3 merujuk worksheet bernama Input.',
  },
  {
    id: 34,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'PSAS',
    type: 'short',
    question:
      'Rina memperhatikan bahwa setiap tahun penjualan es krim di kantin sekolah meningkat pada musim kemarau. Ia memanfaatkan kesamaan tersebut untuk memperkirakan stok tahun berikutnya. Komponen berpikir komputasional yang diterapkan Rina adalah pengenalan ....',
    acceptedAnswers: ['pola', 'pengenalan pola', 'pattern'],
    displayAnswer: 'pola',
    explanation:
      'Mengamati kesamaan atau kecenderungan yang berulang dari waktu ke waktu adalah penerapan pengenalan pola.',
  },
  {
    id: 35,
    building: 'E',
    category: 'Scratch',
    source: 'PSAS',
    type: 'short',
    question:
      'Bahasa pemrograman berbasis blok yang dikembangkan oleh MIT Media Lab dan memudahkan pemula membuat animasi serta permainan dengan menyusun blok perintah disebut ....',
    acceptedAnswers: ['scratch'],
    displayAnswer: 'Scratch',
    explanation:
      'Scratch adalah bahasa pemrograman visual berbasis blok yang dikembangkan oleh MIT Media Lab.',
  },
  {
    id: 36,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'PSAS',
    type: 'short',
    question:
      'Setelah melihat grafik jumlah pengunjung perpustakaan, Bu Ani menyimpulkan bahwa hari Jumat paling ramai sehingga ia menambah petugas pada hari itu. Kegiatan memberi makna dan menarik kesimpulan dari data tersebut disebut ... data.',
    acceptedAnswers: ['interpretasi', 'interpretasi data'],
    displayAnswer: 'interpretasi',
    explanation:
      'Memberi makna pada hasil olahan/grafik data serta menarik kesimpulan disebut interpretasi data.',
  },
  {
    id: 37,
    building: 'C',
    category: 'Tabel, Grafik, dan Range',
    source: 'PSAS',
    type: 'short',
    question:
      'Raka memilih sel A1 sampai E1 pada tabelnya, lalu ingin memberi warna latar pada judul kolom tersebut. Perintah yang harus ia gunakan adalah ... Color.',
    acceptedAnswers: ['fill', 'fill color'],
    displayAnswer: 'Fill',
    explanation: 'Perintah untuk memberi warna latar belakang pada sel di spreadsheet adalah Fill Color.',
  },
  {
    id: 38,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'PSAS',
    type: 'short',
    visualId: 'figure2',
    question:
      'Look at Figure 2! Cell E2 contains the formula =AVERAGE(C2:C7)+MAX(C2:C7)-MIN(C2:C7). What value is displayed in cell E2?',
    acceptedAnswers: ['107'],
    displayAnswer: '107',
    explanation: 'AVERAGE(C2:C7) = 80, MAX(C2:C7) = 92, dan MIN(C2:C7) = 65. Jadi 80 + 92 - 65 = 107.',
  },
  {
    id: 39,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'PSAS',
    type: 'short',
    question:
      'Pada sebuah spreadsheet, sel D6 berisi rumus =B6*F3. Rumus tersebut disalin ke sel D4 dengan menarik Fill Handle ke atas. Rumus yang muncul pada sel D4 adalah ....',
    acceptedAnswers: ['=b4*f1', 'b4*f1'],
    displayAnswer: '=B4*F1',
    explanation:
      'Menarik Fill Handle ke atas 2 baris (dari baris 6 ke baris 4) mengurangi referensi baris relatif sebanyak 2: B6 menjadi B4 dan F3 menjadi F1, sehingga hasilnya =B4*F1.',
  },
  {
    id: 40,
    building: 'E',
    category: 'Scratch',
    source: 'PSAS',
    type: 'short',
    visualId: 'gambar6',
    question:
      'Perhatikan Gambar 6 (Skrip Scratch)! Skrip pada gambar dijalankan pada sprite yang menghadap ke kanan. Bangun datar yang tergambar oleh jejak pena sprite adalah ....',
    acceptedAnswers: ['persegi', 'bujur sangkar', 'square', 'kotak'],
    displayAnswer: 'persegi',
    explanation:
      'Mengulang maju 10 langkah dan belok kanan 90 derajat sebanyak 4 kali akan membentuk bangun datar persegi (4 sisi sama panjang dan 4 sudut siku-siku).',
  },

  // =========================================================================
  // 10 SOAL DARI BANK SOAL SEBELUMNYA (NO. 41–50)
  // =========================================================================
  {
    id: 41,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Dalam membuat ringkasan laporan keuangan kelas, kita hanya menampilkan total pemasukan, total pengeluaran, dan saldo akhir tanpa mencantumkan warna pulpen yang dipakai mencatat. Proses menyaring informasi penting dan mengabaikan detail yang tidak relevan disebut ...',
    options: {
      A: 'Algoritma',
      B: 'Dekomposisi',
      C: 'Abstraksi',
      D: 'Pengenalan pola',
    },
    answer: 'C',
    explanation:
      'Abstraksi berfokus pada informasi yang penting dan relevan serta mengabaikan detail yang tidak diperlukan.',
  },
  {
    id: 42,
    building: 'A',
    category: 'Berpikir Komputasional',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Perhatikan urutan langkah berikut saat mengolah data di lembar kerja: (1) Menyiapkan tabel data mentah, (2) Menentukan rumus yang tepat, (3) Mengurutkan hasil dari nilai tertinggi, (4) Menyajikan dalam grafik. Langkah tersebut merupakan penerapan berpikir komputasional pada tahap ...',
    options: {
      A: 'Mengabaikan masalah',
      B: 'Perancangan algoritma penyelesaian masalah',
      C: 'Menghapus seluruh data',
      D: 'Menggandakan file tanpa analisis',
    },
    answer: 'B',
    explanation:
      'Menyusun urutan prosedur kerja yang sistematis dari awal hingga akhir adalah wujud perancangan algoritma.',
  },
  {
    id: 43,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Data yang berbentuk angka dan dapat dihitung secara matematis seperti nilai ujian, tinggi badan, dan jumlah siswa termasuk jenis data ...',
    options: {
      A: 'Kuantitatif (Numerik)',
      B: 'Kualitatif (Teks)',
      C: 'Audio visual',
      D: 'Simbolik non-angka',
    },
    answer: 'A',
    explanation: 'Data kuantitatif adalah data berupa bilangan/angka yang dapat dioperasikan secara matematis.',
  },
  {
    id: 44,
    building: 'B',
    category: 'Data dan Interpretasi Data',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Dalam hasil survei ekstrakurikuler kelas VII, tercatat 18 siswa memilih Robotika, 10 siswa memilih Desain Grafis, dan 4 siswa memilih Jurnalistik. Interpretasi yang paling tepat dari data tersebut adalah ...',
    options: {
      A: 'Jurnalistik adalah ekstrakurikuler paling diminati',
      B: 'Robotika merupakan ekstrakurikuler dengan peminat terbanyak di kelas VII',
      C: 'Jumlah peminat Desain Grafis lebih banyak dari Robotika',
      D: 'Total seluruh siswa kelas VII adalah 28 siswa',
    },
    answer: 'B',
    explanation:
      'Dengan 18 pemilih dari total 32 siswa, Robotika memiliki jumlah peminat paling tinggi dibandingkan pilihan lainnya.',
  },
  {
    id: 45,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Referensi sel yang alamat kolom dan barisnya tidak berubah meskipun rumus disalin ke sel lain, dengan menambahkan tanda dolar seperti $B$2, disebut ...',
    options: {
      A: 'Referensi relatif',
      B: 'Referensi absolut',
      C: 'Referensi dinamis',
      D: 'Referensi acak',
    },
    answer: 'B',
    explanation: 'Referensi absolut mengunci kolom dan baris menggunakan simbol $ (contoh: $B$2) agar tetap saat disalin.',
  },
  {
    id: 46,
    building: 'C',
    category: 'Konsep Spreadsheet',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Jika pada sel C2 terdapat rumus =A2*$B$1 dan rumus tersebut disalin ke sel C3 di bawahnya, maka rumus pada sel C3 akan berubah menjadi ...',
    options: {
      A: '=A3*$B$2',
      B: '=A3*$B$1',
      C: '=A2*$B$1',
      D: '=B3*$C$1',
    },
    answer: 'B',
    explanation:
      'A2 adalah referensi relatif sehingga berubah menjadi A3, sedangkan $B$1 adalah referensi absolut sehingga tetap $B$1.',
  },
  {
    id: 47,
    building: 'D',
    category: 'Fungsi Dasar dan Statistik',
    source: 'Bank Soal',
    type: 'single',
    question: 'Perbedaan utama antara fungsi COUNT dan fungsi COUNTA pada pengolahan data spreadsheet adalah ...',
    options: {
      A: 'COUNT menghitung semua sel terisi, sedangkan COUNTA hanya menghitung angka',
      B: 'COUNT hanya menghitung sel yang berisi angka, sedangkan COUNTA menghitung semua sel yang tidak kosong (angka maupun teks)',
      C: 'COUNT mencari nilai terbesar, sedangkan COUNTA mencari nilai terkecil',
      D: 'COUNT menjumlahkan angka, sedangkan COUNTA mengalikan angka',
    },
    answer: 'B',
    explanation:
      'COUNT menghitung banyaknya sel berisi data numerik (angka), sedangkan COUNTA menghitung seluruh sel yang berisi data apa pun (tidak kosong).',
  },
  {
    id: 48,
    building: 'D',
    category: 'Fungsi Logika',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Diketahui nilai KKM mata pelajaran Informatika adalah 75 pada sel C2. Penulisan rumus IF yang benar untuk menampilkan "Tuntas" jika nilai >= 75 dan "Remedial" jika kurang dari 75 adalah ...',
    options: {
      A: '=IF(C2>=75; "Tuntas"; "Remedial")',
      B: '=IF(C2>75; "Remedial"; "Tuntas")',
      C: '=IF(C2=75; "Tuntas"; "Remedial")',
      D: '=IF(C2<75; "Tuntas"; "Remedial")',
    },
    answer: 'A',
    explanation:
      'Syarat tuntas adalah nilai lebih dari atau sama dengan 75 (C2>=75), sehingga parameter benar adalah "Tuntas" dan salah adalah "Remedial".',
  },
  {
    id: 49,
    building: 'E',
    category: 'Sort, Filter, dan Data Validation',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Untuk menjaga keamanan lembar kerja agar rumus-rumus penting di dalam sel tidak terubah atau terhapus secara tidak sengaja oleh orang lain, fitur yang tepat digunakan adalah ...',
    options: {
      A: 'Protect Sheet / Protect File',
      B: 'Share Link Public',
      C: 'AutoSum',
      D: 'Clear Formats',
    },
    answer: 'A',
    explanation: 'Protect Sheet/Workbook mengunci struktur atau sel lembar kerja dengan kata sandi.',
  },
  {
    id: 50,
    building: 'E',
    category: 'Scratch',
    source: 'Bank Soal',
    type: 'single',
    question:
      'Dalam pembuatan game sederhana di Scratch, jika pemain berhasil menangkap bintang dan kita ingin menambah skor pemain sebesar 1 poin, blok perintah yang digunakan adalah ...',
    options: {
      A: 'change [Skor] by (1)',
      B: 'set [Skor] to (0)',
      C: 'hide variable [Skor]',
      D: 'stop all',
    },
    answer: 'A',
    explanation: "Blok 'change [variabel] by (1)' menambahkan nilai 1 ke nilai variabel Skor saat ini.",
  },
];
