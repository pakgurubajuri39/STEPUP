import { CurriculumLevel } from "./types";

export const KUMON_CURRICULUM: CurriculumLevel[] = [
  {
    id: "6A",
    name: "Level 6A",
    category: "Arithmetic",
    description: "Menghitung gambar/benda (Up to 10), membaca angka.",
    topics: [
      { id: "counting-1-5", name: "Menghitung gambar (1 - 5)", description: "Belajar menghitung jumlah gambar apel, bintang, dll sampai 5.", examples: ["● ● = 2", "● ● ● ● = 4"] },
      { id: "counting-1-10", name: "Menghitung gambar (1 - 10)", description: "Belajar menghitung jumlah gambar sampai 10.", examples: ["● ● ● ● ● ● = 6"] },
      { id: "reading-1-10", name: "Membaca Angka (1 - 10)", description: "Menghubungkan jumlah gambar dengan lambang bilangan.", examples: ["Satu, Dua, Tiga...", "Cocokkan '3' dengan ● ● ●"] }
    ]
  },
  {
    id: "5A",
    name: "Level 5A",
    category: "Arithmetic",
    description: "Membaca angka hingga 30, pola urutan angka.",
    topics: [
      { id: "reading-1-30", name: "Membaca Angka (1 - 30)", description: "Membaca bilangan 1 sampai 30 dengan lancar secara berurutan.", examples: ["1, 2, ..., 15, 16, ..., 30"] },
      { id: "number-sequence-30", name: "Urutan Angka sampai 30", description: "Melengkapi angka yang hilang dalam barisan bilangan.", examples: ["10, 11, [ ], 13, 14", "25, 26, 27, [ ]"] }
    ]
  },
  {
    id: "4A",
    name: "Level 4A",
    category: "Arithmetic",
    description: "Menulis angka hingga 30, urutan angka, pengenalan titik/garis bilangan.",
    topics: [
      { id: "writing-1-30", name: "Menulis Angka (1 - 30)", description: "Berlatih menulis lambang bilangan dengan urutan guratan yang benar.", examples: ["Tulis angka setelah 19: [ 20 ]", "Hubungkan titik-titik bilangan 1 sampai 30."] },
      { id: "number-sequence-dots", name: "Garis Bilangan & Titik", description: "Mengenal urutan angka di atas garis bilangan.", examples: ["Isilah titik: 18 -> 19 -> [ ]", "28 -> [ ] -> 30"] }
    ]
  },
  {
    id: "3A",
    name: "Level 3A",
    category: "Arithmetic",
    description: "Mengenal angka hingga 100, Penjumlahan +1, +2, +3.",
    topics: [
      { id: "add-1", name: "Penjumlahan +1", description: "Penjumlahan dasar menambahkan 1 ke bilangan 1-100.", examples: ["1 + 1 = 2", "9 + 1 = 10", "49 + 1 = 50"] },
      { id: "add-2", name: "Penjumlahan +2", description: "Penjumlahan dasar menambahkan 2 ke bilangan.", examples: ["3 + 2 = 5", "8 + 2 = 10", "28 + 2 = 30"] },
      { id: "add-3", name: "Penjumlahan +3", description: "Penjumlahan dasar menambahkan 3 ke bilangan.", examples: ["4 + 3 = 7", "17 + 3 = 20", "87 + 3 = 90"] }
    ]
  },
  {
    id: "2A",
    name: "Level 2A",
    category: "Arithmetic",
    description: "Penjumlahan hingga +10.",
    topics: [
      { id: "add-4-5", name: "Penjumlahan +4 & +5", description: "Menambahkan 4 dan 5 secara cepat tanpa menghitung jari.", examples: ["5 + 4 = 9", "7 + 5 = 12"] },
      { id: "add-6-10", name: "Penjumlahan +6 hingga +10", description: "Melatih kelancaran penjumlahan dasar hingga penambahan 10.", examples: ["8 + 6 = 14", "9 + 9 = 18", "15 + 10 = 25"] }
    ]
  },
  {
    id: "A",
    name: "Level A",
    category: "Arithmetic",
    description: "Penjumlahan lanjutan (hingga jumlah 100), Pengurangan dasar (Kurang dari 1 hingga 12).",
    topics: [
      { id: "add-advanced-100", name: "Penjumlahan Lanjutan (Jumlah s.d 100)", description: "Penjumlahan bilangan belasan dan puluhan secara horizontal.", examples: ["14 + 5 = 19", "25 + 10 = 35", "73 + 8 = 81"] },
      { id: "sub-basic-1-12", name: "Pengurangan Dasar (Kurang 1 s.d 12)", description: "Pengurangan angka 1 sampai 12 dari bilangan belasan.", examples: ["10 - 2 = 8", "12 - 5 = 7", "11 - 9 = 2"] }
    ]
  },
  {
    id: "B",
    name: "Level B",
    category: "Arithmetic",
    description: "Penjumlahan/Pengurangan bersusun 2-Digit dan 3-Digit.",
    topics: [
      { id: "add-vertical-2d", name: "Penjumlahan Bersusun 2-Digit", description: "Penjumlahan dengan teknik menyimpan (carrying).", examples: ["  28\n+ 35\n-----\n  [ 63 ]"] },
      { id: "sub-vertical-2d", name: "Pengurangan Bersusun 2-Digit", description: "Pengurangan dengan teknik meminjam (borrowing).", examples: ["  52\n- 18\n-----\n  [ 34 ]"] },
      { id: "add-sub-3d", name: "Penjumlahan & Pengurangan 3-Digit", description: "Melatih operasi bersusun dengan angka ratusan.", examples: ["145 + 278 = [ 423 ]", "503 - 247 = [ 256 ]"] }
    ]
  },
  {
    id: "C",
    name: "Level C",
    category: "Arithmetic",
    description: "Perkalian dasar (tabel 1-9), Perkalian 2-Digit x 1-Digit, Pengenalan Pembagian dasar.",
    topics: [
      { id: "multiplication-table-1-9", name: "Tabel Perkalian (1 - 9)", description: "Menghafal perkalian dasar 1 sampai 9 secara acak.", examples: ["6 x 7 = 42", "8 x 9 = 72"] },
      { id: "multiplication-2dx1d", name: "Perkalian 2-Digit x 1-Digit", description: "Perkalian bersusun sederhana dengan teknik menyimpan.", examples: ["24 x 3 = [ 72 ]", "45 x 6 = [ 270 ]"] },
      { id: "division-basic", name: "Pengenalan Pembagian Dasar", description: "Kebalikan dari perkalian, tanpa sisa pembagian.", examples: ["36 : 6 = 6", "72 : 9 = 8"] }
    ]
  },
  {
    id: "D",
    name: "Level D",
    category: "Arithmetic",
    description: "Perkalian (3-Digit x 2-Digit), Pembagian dengan sisa, Pembagian dengan pembagi 2-Digit, Penyederhanaan pecahan.",
    topics: [
      { id: "multiplication-3dx2d", name: "Perkalian Bersusun Tinggi", description: "Perkalian angka ratusan dengan angka puluhan bersusun.", examples: ["124 x 32 = [ 3968 ]"] },
      { id: "division-with-remainders", name: "Pembagian dengan Sisa", description: "Pembagian bilangan 2-digit dengan 1-digit yang menghasilkan sisa.", examples: ["17 : 3 = [ 5 ] sisa [ 2 ]"] },
      { id: "division-2d-divisor", name: "Pembagian Pembagi 2-Digit", description: "Pembagian bersusun (porogapit) dengan pembagi puluhan.", examples: ["156 : 12 = [ 13 ]"] },
      { id: "fraction-simplification", name: "Penyederhanaan Pecahan", description: "Membagi pembilang dan penyebut dengan FPB untuk menyederhanakan pecahan.", examples: ["6/8 = [ 3/4 ]", "15/45 = [ 1/3 ]"] }
    ]
  },
  {
    id: "E",
    name: "Level E",
    category: "Arithmetic",
    description: "Pecahan (Penjumlahan, Pengurangan, Perkalian, Pembagian pecahan biasa dan campuran).",
    topics: [
      { id: "fraction-add-sub", name: "Penjumlahan & Pengurangan Pecahan", description: "Menyamakan penyebut pecahan biasa maupun campuran lalu menghitung.", examples: ["1/3 + 1/2 = [ 5/6 ]", "2 1/4 - 1/2 = [ 1 3/4 ]"] },
      { id: "fraction-mul-div", name: "Perkalian & Pembagian Pecahan", description: "Mengalikan pembilang dengan pembilang, atau membalik pecahan untuk pembagian.", examples: ["2/3 x 4/5 = [ 8/15 ]", "3/4 : 1/2 = [ 1 1/2 ]"] }
    ]
  },
  {
    id: "F",
    name: "Level F",
    category: "Arithmetic",
    description: "Empat Operasi Hitung Campuran (Pecahan, Desimal, Soal Cerita).",
    topics: [
      { id: "mixed-operations", name: "Operasi Campuran Pecahan & Desimal", description: "Menerapkan prioritas operasi hitung perkalian/pembagian sebelum penjumlahan/pengurangan.", examples: ["1.5 + 2/3 x 3/4 = [ 2 ]", "3/4 : 0.25 - 1/2 = [ 2.5 ]"] },
      { id: "word-problems-f", name: "Soal Cerita Aritmatika Campuran", description: "Menyelesaikan masalah matematika kehidupan sehari-hari dengan pecahan/desimal.", examples: ["Ibu memiliki 3 1/2 kg tepung, digunakan 1.5 kg. Berapa sisanya? -> [ 2 kg ]"] }
    ]
  },
  {
    id: "G",
    name: "Level G",
    category: "Algebra",
    description: "Bilangan Positif/Negatif, Aljabar Dasar, Persamaan Linear 1 Variabel.",
    topics: [
      { id: "negative-numbers", name: "Bilangan Positif & Negatif", description: "Operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan negatif.", examples: ["(-5) + 3 = -2", "(-6) x (-4) = 24", "12 : (-3) = -4"] },
      { id: "algebraic-expressions", name: "Penyederhanaan Aljabar Dasar", description: "Menggabungkan suku-suku sejenis (like terms).", examples: ["3x + 5 - x + 2 = [ 2x + 7 ]", "-2(a - 3) = [ -2a + 6 ]"] },
      { id: "linear-equations-1v", name: "Persamaan Linear 1 Variabel", description: "Mencari nilai x dengan teknik pindah ruas.", examples: ["2x + 5 = 11 -> [ x = 3 ]", "3(x - 1) = x + 5 -> [ x = 4 ]"] }
    ]
  },
  {
    id: "H",
    name: "Level H",
    category: "Algebra",
    description: "Persamaan Linear 2-4 Variabel (Substitusi/Eliminasi), Pertidaksamaan Linear.",
    topics: [
      { id: "system-equations-2v", name: "Sistem Persamaan Linear 2 Variabel (SPLDV)", description: "Mencari himpunan penyelesaian (x, y) dengan eliminasi atau substitusi.", examples: ["x + y = 5 dan 2x - y = 1 -> [ x = 2, y = 3 ]"] },
      { id: "system-equations-3v", name: "Sistem Persamaan 3-4 Variabel", description: "Menyelesaikan sistem persamaan dengan 3 variabel (x, y, z).", examples: ["x+y+z = 6, 2y+z = 7, z = 3 -> [ x=1, y=2, z=3 ]"] },
      { id: "linear-inequalities", name: "Pertidaksamaan Linear", description: "Menyelesaikan pertidaksamaan linear satu variabel, ingat balik tanda saat kali/bagi negatif.", examples: ["-3x < 9 -> [ x > -3 ]", "2x - 5 >= 7 -> [ x >= 6 ]"] }
    ]
  },
  {
    id: "I",
    name: "Level I",
    category: "Algebra",
    description: "Perkalian Polinomial, Faktorisasi Pecahan Aljabar, Akar Kuadrat, Persamaan Kuadrat.",
    topics: [
      { id: "polynomial-expansion", name: "Perkalian & Ekspansi Polinomial", description: "Menjabar perkalian aljabar dengan rumus distributif.", examples: ["(x + 3)(x - 2) = [ x^2 + x - 6 ]", "(2a - b)^2 = [ 4a^2 - 4ab + b^2 ]"] },
      { id: "algebraic-factorization", name: "Faktorisasi Aljabar", description: "Memfaktorkan persamaan kuadrat menjadi bentuk perkalian binomial.", examples: ["x^2 - 5x + 6 = [ (x - 2)(x - 3) ]", "4x^2 - 9 = [ (2x - 3)(2x + 3) ]"] },
      { id: "square-roots", name: "Akar Kuadrat", description: "Menyederhanakan dan mengoperasikan akar kuadrat.", examples: ["√72 = [ 6√2 ]", "√3 x √12 = [ 6 ]", "2/(√3 - 1) = [ √3 + 1 ]"] },
      { id: "quadratic-equations", name: "Persamaan Kuadrat", description: "Mencari akar-akar persamaan kuadrat menggunakan pemfaktoran atau rumus ABC.", examples: ["x^2 - 4 = 0 -> [ x = 2, x = -2 ]", "x^2 - 2x - 3 = 0 -> [ x = 3, x = -1 ]"] }
    ]
  },
  {
    id: "J",
    name: "Level J",
    category: "Algebra",
    description: "Faktorisasi Lanjutan, Teorema Sisa/Faktor, Bilangan Kompleks, Diskriminan, Hubungan Akar-Koefisien.",
    topics: [
      { id: "advanced-factorization", name: "Faktorisasi Polinomial Lanjutan", description: "Memfaktorkan persamaan berderajat 3 atau lebih dengan metode horner.", examples: ["x^3 - 6x^2 + 11x - 6 = [ (x-1)(x-2)(x-3) ]"] },
      { id: "remainder-theorem", name: "Teorema Sisa & Teorema Faktor", description: "Mencari sisa pembagian fungsi suku banyak f(x) oleh (x - k).", examples: ["Sisa f(x)=x^3-2x^2+3x-1 dibagi (x-2) adalah f(2) = [ 5 ]"] },
      { id: "complex-numbers", name: "Bilangan Kompleks", description: "Operasi bilangan imajiner i di mana i^2 = -1.", examples: ["(2 + 3i) + (1 - 4i) = [ 3 - i ]", "(1 + i)(1 - i) = [ 2 ]"] },
      { id: "root-coefficient", name: "Hubungan Akar-Koefisien (Vieta)", description: "Menentukan penjumlahan dan perkalian akar persamaan kuadrat x1 + x2 = -b/a dan x1.x2 = c/a.", examples: ["Untuk x^2 - 5x + 6 = 0, x1+x2 = [ 5 ], x1.x2 = [ 6 ]"] }
    ]
  },
  {
    id: "K",
    name: "Level K",
    category: "Algebra",
    description: "Fungsi Kuadrat & Grafik, Nilai Maksimum/Minimum, Fungsi Pecahan/Irasional, Eksponen & Logaritma.",
    topics: [
      { id: "quadratic-functions", name: "Fungsi Kuadrat & Grafik", description: "Menentukan koordinat puncak fungsi kuadrat y = a(x - h)^2 + k.", examples: ["Puncak y = x^2 - 4x + 7 adalah [ (2, 3) ]"] },
      { id: "exponential-logarithmic", name: "Fungsi Eksponen & Logaritma", description: "Menyelesaikan persamaan eksponensial dan logaritma dasar.", examples: ["2^(x+1) = 16 -> x = [ 3 ]", "log2(x) + log2(x-2) = 3 -> x = [ 4 ]"] }
    ]
  },
  {
    id: "L",
    name: "Level L",
    category: "Algebra",
    description: "Fungsi Modulus, Limit Fungsi, Turunan (Derivatives), Garis Singgung, Integral (Tentu/Tak Tentu), Luas & Volume.",
    topics: [
      { id: "limits", name: "Limit Fungsi", description: "Menghitung limit fungsi aljabar saat mendekati suatu nilai atau tak hingga.", examples: ["lim (x->3) (x^2 - 9)/(x - 3) = [ 6 ]"] },
      { id: "derivatives", name: "Turunan (Derivatives)", description: "Menghitung turunan f'(x) menggunakan aturan pangkat dan rantai.", examples: ["f(x) = 3x^2 - 5x + 2 -> f'(x) = [ 6x - 5 ]", "f(x) = (2x - 3)^4 -> f'(x) = [ 8(2x - 3)^3 ]"] },
      { id: "integrals", name: "Integral (Tentu & Tak Tentu)", description: "Mengintegralkan fungsi aljabar serta menghitung integral tentu.", examples: ["∫(2x + 3) dx = [ x^2 + 3x + C ]", "∫[1 s.d 3] (2x) dx = [ 8 ]"] }
    ]
  },
  {
    id: "M-X",
    name: "Level M - XS",
    category: "Advanced",
    description: "Matematika Tingkat Lanjut: Trigonometri, Vektor, Matriks, Peluang & Statistika.",
    topics: [
      { id: "trigonometry-addition", name: "Trigonometri (Rumus Jumlah)", description: "Menggunakan rumus sin(a+b) atau cos(a+b) untuk mencari nilai sudut non-istimewa.", examples: ["sin(75°) = sin(45°+30°) = [ (√6 + √2)/4 ]"] },
      { id: "vectors", name: "Vektor pada Bidang & Ruang", description: "Mencari panjang vektor, perkalian titik (dot product), dan sudut antar vektor.", examples: ["u = (2, -1), v = (3, 4). u . v = [ 2 ]"] },
      { id: "matrices", name: "Matriks & Invers", description: "Menghitung determinan dan invers matriks ordo 2x2.", examples: ["A = [[2, 1], [5, 3]], det(A) = [ 1 ], Invers(A) = [[3, -1], [-5, 2]]"] },
      { id: "probability-perms", name: "Permutasi, Kombinasi & Peluang", description: "Menghitung cara menyusun objek dan peluang suatu kejadian.", examples: ["Kombinasi 2 dari 5 unsur = 5C2 = [ 10 ]"] }
    ]
  }
];
