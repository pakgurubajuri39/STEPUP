import { useState } from "react";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Download,
  Printer,
  Award,
  ChevronRight,
  ShieldCheck,
  Clock,
  Brain,
  CheckCircle,
  HelpCircle,
  Users,
  Target,
  GraduationCap
} from "lucide-react";

interface HomeProps {
  onNavigateToLogin: () => void;
}

export default function Home({ onNavigateToLogin }: HomeProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      level: "3A - A",
      title: "Tahap Aritmetika Dasar",
      desc: "Fokus pada pengenalan angka, kefasihan penjumlahan sederhana (+1 hingga +9) dan pengurangan dasar untuk melatih kelancaran mental berhitung.",
      features: ["Penjumlahan Horizontal", "Pengurangan Konseptual", "Pengenalan Pola Angka"]
    },
    {
      level: "B - D",
      title: "Operasi Bersusun & Perkalian",
      desc: "Transisi ke penjumlahan/pengurangan bersusun kompleks, lalu perkalian & pembagian dasar hingga mahir dengan sisa.",
      features: ["Penjumlahan Bersusun", "Perkalian Dasar", "Pembagian Bersusun (Porogapit)"]
    },
    {
      level: "E - F",
      title: "Fraksi, Pecahan & Desimal",
      desc: "Menguasai operasi hitung pecahan biasa, campuran, desimal, hingga operasi aritmetika campuran yang menuntut pemahaman hierarki operasi.",
      features: ["Penyebut Berbeda", "Perkalian Pecahan", "Aritmetika Campuran Kompleks"]
    },
    {
      level: "G - I",
      title: "Aljabar & Persamaan Linear",
      desc: "Siswa mulai melangkah ke matematika abstrak: bilangan negatif, penyederhanaan aljabar, sistem persamaan linear, hingga fungsi kuadrat.",
      features: ["Sistem Persamaan Linear", "Faktorisasi Polinomial", "Fungsi & Grafik Kuadrat"]
    },
    {
      level: "J - N",
      title: "Matematika Lanjut & Kalkulus",
      desc: "Menyiapkan siswa untuk jenjang universitas dengan konsep limit fungsi, turunan aljabar, integral, vektor, serta trigonometri tingkat lanjut.",
      features: ["Logaritma & Eksponen", "Limit & Turunan", "Integral & Geometri Vektor"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="home-landing-page">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4" id="home-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                StepUp <span className="text-blue-600">Study</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Matematika Berjenjang</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">Fitur Utama</a>
            <a href="#keunggulan" className="hover:text-blue-600 transition-colors">Keunggulan</a>
            <a href="#metodologi" className="hover:text-blue-600 transition-colors">Metode Kumon</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <button
            onClick={onNavigateToLogin}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
            id="nav-btn-login"
          >
            Masuk ke Aplikasi
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24 px-6" id="home-hero">
        {/* Soft decorative ambient gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Teknologi AI x Metode Kumon Tradisional
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Kuasai Matematika Secara <span className="text-blue-600">Mandiri</span> Lewat Bimbingan <span className="text-indigo-600 underline decoration-indigo-500 decoration-2 underline-offset-4">Small Steps</span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Membentuk refleks berhitung dan pemahaman konseptual yang kokoh. Rancang lembar latihan interaktif Anda sendiri, ikuti tes penempatan diagnostik, atau cetak lembar kerja kustom tanpa batas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20 text-sm cursor-pointer flex items-center justify-center gap-2"
              id="hero-btn-start"
            >
              Mulai Belajar Sekarang
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#fitur"
              className="w-full sm:w-auto px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition text-sm text-center"
            >
              Pelajari Fitur Aplikasi
            </a>
          </div>

          {/* Quick stats counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 border-t border-slate-100">
            <div className="p-4 bg-slate-50/50 rounded-xl">
              <p className="text-2xl font-black text-slate-900">Level 3A-N</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Kurikulum Terstruktur</p>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-xl">
              <p className="text-2xl font-black text-blue-600">100% Bebas</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Soal Dihasilkan AI</p>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-xl">
              <p className="text-2xl font-black text-slate-900">SCT Target</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Latihan Fokus Kecepatan</p>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-xl">
              <p className="text-2xl font-black text-indigo-600">Offline Ready</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Format Unduh & Cetak</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6 scroll-mt-16" id="fitur">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">FITUR UNGGULAN APLIKASI</h3>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Seluruh Kebutuhan Latihan Mandiri dalam Satu Ekosistem
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Dirancang khusus mengikuti prinsip akademis teruji Kumon yang dipadukan dengan kecerdasan buatan dinamis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Generator Latihan AI Berjenjang</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menghasilkan paket soal matematika yang disesuaikan secara instan dari level pra-sekolah hingga tingkat lanjut. Setiap soal disiapkan agar tingkat kesulitannya naik secara konseptual.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Tes Penempatan Diagnostik (Placement Test)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan modul uji diagnostik untuk mendeteksi kemampuan berhitung awal Anda atau siswa secara instan. Menentukan titik awal belajar yang ideal untuk memaksimalkan efektivitas program.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit">
                <Printer className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Optimasi Cetak & Lembar PDF</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tersedia tata letak ramah cetak (print-friendly style) tanpa gangguan visual navigasi layar. Cetak langsung latihan soal ke printer fisik atau simpan sebagai dokumen PDF berkualitas tinggi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Unduh Format Markdown (.md)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unduh lembar kerja lengkap beserta bimbingan scaffolding dan lembar kunci jawaban mandiri dalam format berkas Markdown. Kompatibel penuh untuk dibuka secara offline di gawai Anda.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">SCT (Standard Completion Time)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap materi dilengkapi target waktu pengerjaan standar. Memotivasi anak tidak hanya untuk sekadar bisa menjawab benar, tetapi juga melatih kelancaran dan ketepatan refleks kognitif.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Analitik Kemajuan & Skor</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pelacak skor interaktif dan waktu riil pengerjaan yang disimpan secara lokal di peramban web Anda. Mengukur tingkat konsistensi, kemajuan rata-rata nilai, dan total soal yang diselesaikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED ADVANTAGES (KUMON VS TRADITIONAL) */}
      <section className="py-20 bg-white px-6 scroll-mt-16" id="keunggulan">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block">Metodologi Unggul</span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Mengapa Memilih Pendekatan Small Steps StepUp Study?
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Metode pembelajaran tradisional sering memicu rasa putus asa ketika siswa dihadapkan pada lompatan konsep yang terlalu ekstrem. Di StepUp Study, kurikulum dibagi menjadi fragmen yang sangat kecil, melatih anak naik tangga satu demi satu secara stabil.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700"><strong>Pacing Sesuai Kemampuan:</strong> Tidak memaksa anak melaju sebelum fondasi aritmetika dasarnya benar-benar fasih.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700"><strong>Rasa Percaya Diri (Self-Esteem):</strong> Penyelesaian lembar soal dengan tingkat kelulusan tinggi memupuk motivasi internal siswa.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700"><strong>Metode Mandiri Tanpa Beban:</strong> Contoh soal terbimbing (scaffolding) dirancang agar siswa bisa menduplikasi pola pengerjaan secara mandiri.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl" />
              <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase">PERBANDINGAN PEMBELAJARAN</h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-amber-400">🚨 Metode Kelas Konvensional</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Siswa dipaksa menyamakan kecepatan belajarnya dengan seluruh kelas. Jika tertinggal di konsep perkalian, mereka akan langsung kesulitan saat mempelajari pecahan dan aljabar di tingkat berikutnya.
                  </p>
                </div>

                <div className="p-4 bg-blue-950/40 rounded-xl border border-blue-900/50 space-y-1">
                  <p className="text-xs font-bold text-blue-400">⭐ Metode StepUp Study (Small Steps)</p>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Materi dipecah menjadi sub-topik terperinci. Siswa belajar di tingkat kesulitan yang "pas" — tidak terlalu mudah yang memicu rasa bosan, dan tidak terlalu sulit yang memicu keputusasaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METODOLOGY STEPPER PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-100 px-6 scroll-mt-16" id="metodologi">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">PETA TINGKATAN KURIKULUM</h3>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Jenjang Kurikulum Matematika Terstruktur
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Setiap tingkatan dirancang secara hati-hati untuk mempersiapkan kompetensi siswa menghadapi topik di atasnya.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar list */}
            <div className="lg:w-1/3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 shrink-0">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`px-4 py-3 text-left rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center justify-between border w-full ${
                    activeStep === idx
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <span>Level {step.level}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeStep === idx ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Display panel */}
            <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-black rounded-lg text-xs border border-blue-100">
                  LEVEL {steps[activeStep].level}
                </span>
                <h4 className="font-bold text-slate-900 text-lg">{steps[activeStep].title}</h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sub-materi Unggulan:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {steps[activeStep].features.map((feat, fidx) => (
                    <div key={fidx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white px-6 scroll-mt-16" id="faq">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">TANYA JAWAB UMUM</h3>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xs md:text-sm text-slate-500">Membantu Anda memahami fungsionalitas dan pemakaian aplikasi secara cepat.</p>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Bagaimana cara memulai belajar dengan StepUp Study?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Kami sangat merekomendasikan Anda mengikuti <strong>Tes Penempatan Level</strong> yang tersedia di dalam aplikasi terlebih dahulu. Tes ini akan menguji tingkat kelancaran kognitif berhitung Anda dan memberikan rekomendasi level awal belajar yang tepat.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Mengapa ada batasan waktu (SCT) untuk setiap latihan?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                SCT (Standard Completion Time) adalah penanda waktu standar untuk merangsang kelancaran kognitif siswa. Menyelesaikan latihan dengan benar namun lambat menandakan siswa masih harus mengulang topik tersebut agar proses berpikirnya menjadi refleks yang spontan.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Apakah soal-soal ini selalu sama setiap kali digenerate?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Tidak. Setiap kali Anda menekan tombol "Buat Soal", algoritma AI kami akan merancang kombinasi angka dan pola soal baru yang unik, memastikan Anda dapat melatih topik yang sama berulang kali tanpa menghafal jawaban sebelumnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 px-6 py-12" id="home-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-white tracking-tight">StepUp Study</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Membentuk kompetensi matematika dan kemandirian belajar siswa secara berjenjang sejak dini melalui bimbingan Small Steps berbasis AI.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Tautan Navigasi</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#fitur" className="hover:text-white transition-colors">Fitur Utama</a>
              <a href="#keunggulan" className="hover:text-white transition-colors">Keunggulan</a>
              <a href="#metodologi" className="hover:text-white transition-colors">Metode Kumon</a>
              <a href="#faq" className="hover:text-white transition-colors">Tanya Jawab</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Mulailah Sekarang</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar / Masuk aplikasi secara instan dengan kredensial kelas belajar Anda.
            </p>
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow cursor-pointer flex items-center gap-1.5"
            >
              Masuk Aplikasi
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            @Copyright by. Pak GuruAI
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
