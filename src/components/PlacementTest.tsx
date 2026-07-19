import { useState } from "react";
import {
  Award,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Check,
  X,
  HelpCircle,
  GraduationCap,
  Download
} from "lucide-react";
import { KUMON_CURRICULUM } from "../curriculum";

interface PlacementQuestion {
  id: string;
  levelId: string; // The level this question represents
  text: string;
  placeholder: string;
  answer: string; // Correct answer string (for matching, case-insensitive, space-insensitive)
  hint?: string;
}

interface TestTrack {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  icon: string;
  questions: PlacementQuestion[];
  // Recommendation logic: maps score range to recommended Level ID
  getRecommendation: (correctCount: number, totalCount: number) => { levelId: string; reason: string };
}

const TEST_TRACKS: TestTrack[] = [
  {
    id: "sd-awal",
    name: "SD Kelas 1 - 3",
    description: "Operasi dasar penjumlahan, pengurangan, membaca urutan angka.",
    ageGroup: "Umur 6-9 tahun (Tingkat Dasar)",
    icon: "🌱",
    questions: [
      { id: "sa1", levelId: "5A", text: "Lengkapi urutan bilangan berikut: 11, 12, __, 14, 15", placeholder: "Tulis angka saja", answer: "13" },
      { id: "sa2", levelId: "3A", text: "9 + 3 = __", placeholder: "Jawaban Anda", answer: "12" },
      { id: "sa3", levelId: "2A", text: "15 + 8 = __", placeholder: "Jawaban Anda", answer: "23" },
      { id: "sa4", levelId: "A", text: "14 - 6 = __", placeholder: "Jawaban Anda", answer: "8" },
      { id: "sa5", levelId: "B", text: "Selesaikan pengurangan bersusun: 52 - 18 = __", placeholder: "Jawaban Anda", answer: "34" },
      { id: "sa6", levelId: "B", text: "Selesaikan penjumlahan bersusun: 135 + 48 = __", placeholder: "Jawaban Anda", answer: "183" }
    ],
    getRecommendation: (correct, total) => {
      const pct = (correct / total) * 100;
      if (pct === 100) {
        return { levelId: "C", reason: "Luar biasa! Anda menguasai penjumlahan dan pengurangan dasar hingga bersusun dengan sempurna. Anda siap memulai di Level C (Perkalian & Pembagian)." };
      } else if (pct >= 66) {
        return { levelId: "B", reason: "Bagus sekali! Anda memahami penjumlahan dan pengurangan dasar dengan baik, namun perlu melatih kefasihan operasi bersusun di Level B." };
      } else if (pct >= 33) {
        return { levelId: "A", reason: "Pemahaman yang baik. Anda direkomendasikan memulai dari Level A untuk memantapkan pengurangan dasar dan penjumlahan mendatar hingga angka 100." };
      } else {
        return { levelId: "3A", reason: "Mari bangun pondasi berhitung Anda! Kami merekomendasikan Level 3A untuk mematangkan kelancaran penjumlahan +1, +2, dan +3 secara spontan." };
      }
    }
  },
  {
    id: "sd-lanjut",
    name: "SD Kelas 4 - 6",
    description: "Perkalian bersusun, pembagian, pecahan, dan operasi hitung campuran.",
    ageGroup: "Umur 10-12 tahun (Tingkat Menengah)",
    icon: "🚀",
    questions: [
      { id: "sl1", levelId: "C", text: "7 × 8 = __", placeholder: "Jawaban Anda", answer: "56" },
      { id: "sl2", levelId: "C", text: "24 × 3 = __", placeholder: "Jawaban Anda", answer: "72" },
      { id: "sl3", levelId: "D", text: "48 ÷ 4 = __", placeholder: "Jawaban Anda", answer: "12" },
      { id: "sl4", levelId: "D", text: "Sederhanakan pecahan 6/8 menjadi yang paling sederhana!", placeholder: "Contoh: 3/4", answer: "3/4" },
      { id: "sl5", levelId: "E", text: "Hitunglah: 1/2 + 1/4 = __", placeholder: "Contoh: 3/4", answer: "3/4" },
      { id: "sl6", levelId: "F", text: "Hitunglah operasi campuran: 10 + 5 × 2 - 4 = __", placeholder: "Ingat urutan operasi (KABATAKU)", answer: "16" }
    ],
    getRecommendation: (correct, total) => {
      const pct = (correct / total) * 100;
      if (pct === 100) {
        return { levelId: "G", reason: "Sangat mengesankan! Semua jawaban benar. Anda telah menguasai aritmetika pecahan dan bilangan bulat sepenuhnya. Anda siap melangkah ke Level G (Aljabar Dasar & Bilangan Negatif)." };
      } else if (pct >= 66) {
        return { levelId: "F", reason: "Kerja bagus! Anda menguasai perkalian, pembagian, dan dasar pecahan. Memulai di Level F akan membantu mematangkan keterampilan operasi campuran pecahan desimal." };
      } else if (pct >= 33) {
        return { levelId: "E", reason: "Pemahaman yang solid. Kami merekomendasikan Level E agar Anda dapat berlatih penjumlahan, pengurangan, perkalian, dan pembagian pecahan secara mendalam." };
      } else {
        return { levelId: "C", reason: "Mari perkuat dasar perkalian dan pembagian Anda. Memulai dari Level C sangat ideal untuk membangun kecepatan berhitung bersusun Anda." };
      }
    }
  },
  {
    id: "smp",
    name: "SMP Kelas 7 - 9",
    description: "Operasi bilangan negatif, aljabar linear, dan faktorisasi kuadrat dasar.",
    ageGroup: "Umur 13-15 tahun (Tingkat Aljabar)",
    icon: "📐",
    questions: [
      { id: "sm1", levelId: "G", text: "Selesaikan: -8 - (-15) = __", placeholder: "Jawaban Anda", answer: "7" },
      { id: "sm2", levelId: "G", text: "Cari nilai x dari persamaan: 3x - 5 = 10", placeholder: "Contoh: x = 5 atau tulis 5 saja", answer: "5" },
      { id: "sm3", levelId: "H", text: "Jika x + y = 10 dan x - y = 4, berapakah nilai x?", placeholder: "Jawaban Anda", answer: "7" },
      { id: "sm4", levelId: "I", text: "Faktorkan persamaan x² - 5x + 6 menjadi (x - a)(x - b). Jika nilai a < b, berapakah nilai b?", placeholder: "Petunjuk: (x-2)(x-3), maka a=2, b=3", answer: "3" },
      { id: "sm5", levelId: "I", text: "Sederhanakan operasi akar berikut: √(48) ÷ √(3) = __", placeholder: "Tulis angka hasil akhir", answer: "4" },
      { id: "sm6", levelId: "I", text: "Jika x² - 9 = 0, berapakah nilai x yang bernilai positif?", placeholder: "Tulis angka saja", answer: "3" }
    ],
    getRecommendation: (correct, total) => {
      const pct = (correct / total) * 100;
      if (pct === 100) {
        return { levelId: "J", reason: "Kemampuan analisis aljabar yang luar biasa! Anda siap melangkah ke Level J (Faktorisasi Lanjutan, Teorema Sisa, dan Fungsi Kuadrat)." };
      } else if (pct >= 66) {
        return { levelId: "I", reason: "Kerja bagus! Anda memahami aljabar dasar dan eliminasi linear. Memulai di Level I akan menyempurnakan kemampuan faktorisasi polinomial dan akar kuadrat Anda." };
      } else if (pct >= 33) {
        return { levelId: "H", reason: "Bagus! Anda mengerti operasi variabel dasar. Direkomendasikan memulai di Level H untuk memantapkan sistem persamaan linear banyak variabel." };
      } else {
        return { levelId: "G", reason: "Mari matangkan pengenalan aljabar dasar dan operasi bilangan negatif Anda di Level G agar melangkah ke jenjang berikutnya dengan percaya diri." };
      }
    }
  },
  {
    id: "sma-lanjut",
    name: "SMA / Lanjut",
    description: "Fungsi kuadrat, logaritma, trigonometri, limit, dan turunan.",
    ageGroup: "Umur 16-18 tahun (Tingkat Kalkulus)",
    icon: "🧠",
    questions: [
      { id: "sa_l1", levelId: "J", text: "Jika f(x) = 2x² - 3x + 1, tentukan nilai f(2)!", placeholder: "Jawaban Anda", answer: "3" },
      { id: "sa_l2", levelId: "K", text: "Berapakah nilai dari: ²log(8) + ²log(4) = __", placeholder: "Petunjuk: ²log(8) = 3", answer: "5" },
      { id: "sa_l3", levelId: "L", text: "Tentukan turunan pertama dari f(x) = x³ - 3x pada x = 2!", placeholder: "Petunjuk: f'(x) = 3x² - 3", answer: "9" },
      { id: "sa_l4", levelId: "L", text: "Hitung nilai limit berikut: limit x mendekati 3 dari (x² - 9) / (x - 3) = __", placeholder: "Faktorkan terlebih dahulu", answer: "6" },
      { id: "sa_l5", levelId: "M", text: "Hitung nilai dari: sin(30°) + cos(60°) = __", placeholder: "Tulis angka saja", answer: "1" }
    ],
    getRecommendation: (correct, total) => {
      const pct = (correct / total) * 100;
      if (pct === 100) {
        return { levelId: "N", reason: "Luar biasa, tingkat pemahaman kalkulus Anda sangat matang! Anda siap mendalami materi lanjut Level M-X (Vektor, Matriks, Probabilitas, dan Kalkulus Lanjut)." };
      } else if (pct >= 60) {
        return { levelId: "L", reason: "Sangat baik! Anda memahami konsep dasar fungsi dan logaritma. Level L akan mengasah intuisi Kalkulus (Limit, Turunan, dan Integral) Anda secara mendalam." };
      } else if (pct >= 40) {
        return { levelId: "K", reason: "Kerja bagus! Kami merekomendasikan Level K untuk memperkuat pemahaman fungsi kuadrat, fungsi pecahan, eksponen, dan logaritma." };
      } else {
        return { levelId: "J", reason: "Konsep aljabar lanjutan perlu dimantapkan. Kami sarankan memulai dari Level J untuk melatih faktorisasi pecahan aljabar tingkat lanjut dan teorema sisa." };
      }
    }
  },
  {
    id: "tes-lengkap",
    name: "Evaluasi Umum",
    description: "Tes komparatif menyeluruh mencakup aritmetika hingga aljabar kuadrat.",
    ageGroup: "Semua Jenjang (Umum)",
    icon: "🏆",
    questions: [
      { id: "tl1", levelId: "3A", text: "12 + 19 = __", placeholder: "Jawaban Anda", answer: "31" },
      { id: "tl2", levelId: "A", text: "45 - 18 = __", placeholder: "Jawaban Anda", answer: "27" },
      { id: "tl3", levelId: "C", text: "12 × 6 = __", placeholder: "Jawaban Anda", answer: "72" },
      { id: "tl4", levelId: "E", text: "2/5 + 1/2 = __", placeholder: "Contoh: 9/10", answer: "9/10" },
      { id: "tl5", levelId: "G", text: "Selesaikan persamaan: 3x + 7 = 22. Tentukan nilai x!", placeholder: "Tulis angka saja", answer: "5" },
      { id: "tl6", levelId: "I", text: "Faktorkan x² - 7x + 12 = 0. Berapakah nilai akar x terbesar?", placeholder: "Petunjuk: x = 3 atau x = 4", answer: "4" },
      { id: "tl7", levelId: "I", text: "Selesaikan persamaan kuadrat: x² - 4 = 0. Berapakah akar positifnya?", placeholder: "Tulis angka saja", answer: "2" },
      { id: "tl8", levelId: "L", text: "Jika f(x) = x² - 2x, berapakah nilai turunan f'(3)?", placeholder: "Petunjuk: f'(x) = 2x - 2", answer: "4" }
    ],
    getRecommendation: (correct, total) => {
      const pct = (correct / total) * 100;
      if (pct >= 85) {
        return { levelId: "L", reason: "Luar biasa! Anda menguasai berhitung dasar, pecahan, aljabar, hingga dasar kalkulus. Memulai di Level L sangat cocok untuk tantangan berpikir analitis kalkulus." };
      } else if (pct >= 60) {
        return { levelId: "I", reason: "Kerja bagus! Aljabar dasar Anda sudah kuat. Direkomendasikan memulai di Level I untuk mematangkan faktorisasi kuadrat dan manipulasi fungsi aljabar." };
      } else if (pct >= 40) {
        return { levelId: "G", reason: "Bagus! Anda menguasai aritmetika dasar dengan lancar. Anda siap bertransisi ke pemikiran aljabar menggunakan variabel di Level G." };
      } else if (pct >= 20) {
        return { levelId: "E", reason: "Pemahaman berhitung bilangan bulat Anda baik. Level E direkomendasikan untuk menajamkan perhitungan pecahan desimal yang kompleks." };
      } else {
        return { levelId: "C", reason: "Mari mulai dari penguatan perkalian bersusun dan pembagian di Level C agar kecepatan hitung dasar Anda terbentuk sempurna." };
      }
    }
  }
];

interface PlacementTestProps {
  onSelectLevelTopic: (levelId: string, topicName: string) => void;
  onClose: () => void;
}

export default function PlacementTest({ onSelectLevelTopic, onClose }: PlacementTestProps) {
  const [selectedTrack, setSelectedTrack] = useState<TestTrack | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string }>({});
  const [currentInputValue, setCurrentInputValue] = useState<string>("");
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const handleDownloadMaterials = () => {
    let md = `# BUKLET DIAGNOSTIK & TES PENEMPATAN LEVEL - STEPUP MATH\n`;
    md += `*Bimbingan Belajar Mandiri Matematika Berjenjang*\n\n`;
    md += `Dokumen ini dirancang untuk diunduh, dicetak, atau digunakan secara mandiri untuk mengukur kemampuan berhitung matematika siswa sebelum memulai program StepUp Math.\n\n`;
    md += `---\n\n`;
    md += `## PANDUAN PELAKSANAAN TES PENEMPATAN:\n`;
    md += `1. **Kejujuran**: Kerjakan tes tanpa bantuan kalkulator, internet, atau bimbingan langsung saat menjawab.\n`;
    md += `2. **Media**: Gunakan pensil dan kertas coret-coretan.\n`;
    md += `3. **Durasi**: Tidak ada batas waktu ketat, namun selesaikan dengan kecepatan normal (rata-rata 10-15 menit per paket soal).\n`;
    md += `4. **Skor**: Setiap paket memiliki kriteria rekomendasi level awal di bagian Kunci Jawaban di akhir dokumen ini.\n\n`;
    md += `---\n\n`;
    md += `# BAGIAN 1: LEMBAR SOAL PESERTA\n\n`;

    TEST_TRACKS.forEach((track, index) => {
      md += `## TES ${index + 1}: ${track.name.toUpperCase()}\n`;
      md += `*Kategori: ${track.ageGroup}*\n`;
      md += `*Deskripsi: ${track.description}*\n\n`;
      md += `**Petunjuk pengerjaan:** Tuliskan jawaban Anda pada kotak kosong di bawah setiap soal.\n\n`;

      track.questions.forEach((q, qIndex) => {
        md += `**Soal ${qIndex + 1} (Representasi Level ${q.levelId}):**\n`;
        md += `  ${q.text}\n`;
        md += `  > Jawaban Anda: [_______________________]\n\n`;
      });
      md += `\n---\n\n`;
    });

    md += `# BAGIAN 2: KUNCI JAWABAN & REKOMENDASI PENEMPATAN (GURU / ORANG TUA)\n\n`;
    md += `Gunakan kunci jawaban di bawah ini untuk memeriksa hasil pengerjaan siswa. Hitung jumlah soal yang dijawab dengan benar untuk menentukan level awal belajar.\n\n`;

    TEST_TRACKS.forEach((track, index) => {
      md += `## KUNCI JAWABAN TES ${index + 1}: ${track.name.toUpperCase()}\n\n`;
      
      track.questions.forEach((q, qIndex) => {
        md += `${qIndex + 1}. Soal Level ${q.levelId}: ${q.text}\n`;
        md += `   Kunci Jawaban: **${q.answer}**\n\n`;
      });

      md += `### Tabel Rekomendasi Level berdasarkan Jumlah Jawaban Benar:\n`;
      if (track.id === "sd-awal") {
        md += `- **6 Benar (100%):** Memulai di **Level C** (Perkalian & Pembagian Dasar)\n`;
        md += `- **4-5 Benar (66% - 83%):** Memulai di **Level B** (Penjumlahan & Pengurangan Bersusun)\n`;
        md += `- **2-3 Benar (33% - 50%):** Memulai di **Level A** (Penjumlahan Mendarat & Pengurangan Dasar)\n`;
        md += `- **0-1 Benar (0% - 16%):** Memulai di **Level 3A** (Kefasihan penjumlahan +1 s.d +3 secara spontan)\n\n`;
      } else if (track.id === "sd-lanjut") {
        md += `- **6 Benar (100%):** Memulai di **Level G** (Aljabar Dasar & Bilangan Negatif)\n`;
        md += `- **4-5 Benar (66% - 83%):** Memulai di **Level F** (Empat Operasi Hitung Campuran Pecahan & Desimal)\n`;
        md += `- **2-3 Benar (33% - 50%):** Memulai di **Level E** (Operasi Pecahan Dasar)\n`;
        md += `- **0-1 Benar (0% - 16%):** Memulai di **Level C** (Perkalian & Pembagian Dasar)\n\n`;
      } else if (track.id === "smp") {
        md += `- **6 Benar (100%):** Memulai di **Level J** (Faktorisasi Lanjutan & Fungsi Kuadrat)\n`;
        md += `- **4-5 Benar (66% - 83%):** Memulai di **Level I** (Faktorisasi Polinomial & Akar Kuadrat)\n`;
        md += `- **2-3 Benar (33% - 50%):** Memulai di **Level H** (Sistem Persamaan Linear Banyak Variabel)\n`;
        md += `- **0-1 Benar (0% - 16%):** Memulai di **Level G** (Aljabar Dasar & Bilangan Negatif)\n\n`;
      } else if (track.id === "sma-lanjut") {
        md += `- **5 Benar (100%):** Memulai di **Level N** / Lanjut (Materi Trigonometri & Vektor Lanjut)\n`;
        md += `- **3-4 Benar (60% - 80%):** Memulai di **Level L** (Kalkulus Dasar: Limit, Turunan, Integral)\n`;
        md += `- **2 Benar (40%):** Memulai di **Level K** (Fungsi Kuadrat, Eksponen & Logaritma)\n`;
        md += `- **0-1 Benar (0% - 20%):** Memulai di **Level J** (Faktorisasi Lanjutan)\n\n`;
      } else { // tes-lengkap
        md += `- **7-8 Benar (85% - 100%):** Memulai di **Level L** (Kalkulus Dasar)\n`;
        md += `- **5-6 Benar (60% - 75%):** Memulai di **Level I** (Faktorisasi Polinomial & Akar Kuadrat)\n`;
        md += `- **3-4 Benar (40% - 50%):** Memulai di **Level G** (Aljabar Dasar)\n`;
        md += `- **1-2 Benar (12% - 25%):** Memulai di **Level E** (Pecahan Dasar)\n`;
        md += `- **0 Benar (0%):** Memulai di **Level C** (Aritmetika Perkalian & Pembagian)\n\n`;
      }
      md += `\n---\n\n`;
    });

    md += `*Buklet Tes Penempatan ini dihasilkan secara otomatis oleh StepUp Math Matematika Generator Engine pada ${new Date().toLocaleDateString("id-ID")}.*`;

    // Trigger download
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "StepUp_Math_Materi_Tes_Penempatan.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Start a specific track
  const handleStartTrack = (track: TestTrack) => {
    setSelectedTrack(track);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setCurrentInputValue("");
    setIsTestFinished(false);
    setTimeSpentSeconds(0);

    // Set simple timer
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Submit current answer and move next
  const handleNextQuestion = () => {
    if (!selectedTrack) return;
    const currentQuestion = selectedTrack.questions[currentQuestionIndex];
    
    // Save current answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: currentInputValue.trim()
    }));

    // Reset input for next
    setCurrentInputValue("");

    if (currentQuestionIndex < selectedTrack.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Test is completed!
      if (timerInterval) clearInterval(timerInterval);
      setIsTestFinished(true);
    }
  };

  // Skip question helper
  const handleSkipQuestion = () => {
    if (!selectedTrack) return;
    const currentQuestion = selectedTrack.questions[currentQuestionIndex];
    
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: "" // empty means skipped / incorrect
    }));

    setCurrentInputValue("");

    if (currentQuestionIndex < selectedTrack.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      if (timerInterval) clearInterval(timerInterval);
      setIsTestFinished(true);
    }
  };

  // Calculate scores
  const getResultsSummary = () => {
    if (!selectedTrack) return { score: 0, correctCount: 0, totalCount: 0, details: [] };

    let correctCount = 0;
    const totalCount = selectedTrack.questions.length;
    const details = selectedTrack.questions.map((q) => {
      const userAnswer = (userAnswers[q.id] || "").trim().toLowerCase().replace(/\s+/g, "");
      const correctAnswer = q.answer.trim().toLowerCase().replace(/\s+/g, "");
      
      // Simple variations matching:
      // If correct answer is "x=3" and student wrote "3" or "x = 3"
      let isCorrect = userAnswer === correctAnswer;
      if (!isCorrect) {
        if (correctAnswer.startsWith("x=") && userAnswer === correctAnswer.replace("x=", "")) {
          isCorrect = true;
        } else if (!correctAnswer.includes("x=") && userAnswer.replace("x=", "") === correctAnswer) {
          isCorrect = true;
        }
      }

      if (isCorrect) correctCount++;

      return {
        questionText: q.text,
        userAnswer: userAnswers[q.id] || "(Dilewati)",
        correctAnswer: q.answer,
        isCorrect,
        levelId: q.levelId
      };
    });

    const score = Math.round((correctCount / totalCount) * 100);

    return {
      score,
      correctCount,
      totalCount,
      details
    };
  };

  const results = getResultsSummary();
  const recommendation = selectedTrack
    ? selectedTrack.getRecommendation(results.correctCount, results.totalCount)
    : { levelId: "3A", reason: "" };

  // Apply recommended level to Core Generator
  const handleStartWithRecommendation = () => {
    if (!recommendation) return;
    
    // Find matching level in curriculum to pick the first topic
    const matchedLevel = KUMON_CURRICULUM.find(l => l.id === recommendation.levelId);
    const defaultTopicName = matchedLevel && matchedLevel.topics.length > 0 
      ? matchedLevel.topics[0].name 
      : "Penjumlahan Dasar";

    onSelectLevelTopic(recommendation.levelId, defaultTopicName);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="placement-test-panel">
      {/* HEADER BAR */}
      <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">Tes Penempatan Level</h3>
            <p className="text-xs text-slate-400">Diagnostic Evaluator • StepUp Math</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white rounded-lg border border-slate-700 transition font-medium"
            id="btn-back-dashboard"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      {/* TRACK SELECTION VIEW */}
      {!selectedTrack && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
              Uji Mandiri
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Cari Tahu Level Memulai Anda!</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Pilih kelompok belajar Anda di bawah ini untuk memulai tes singkat (5-8 soal). 
              Sistem AI kami akan mengevaluasi jawaban Anda secara langsung dan merekomendasikan level awal StepUp Math yang paling sesuai!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEST_TRACKS.map((track) => (
              <div
                key={track.id}
                onClick={() => handleStartTrack(track)}
                className="group p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-xl transition-all cursor-pointer flex items-start gap-4"
              >
                <div className="text-3xl p-2.5 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition">
                  {track.icon}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition flex items-center gap-1">
                      {track.name}
                    </h4>
                    <span className="text-[10px] bg-slate-100 font-semibold px-2 py-0.5 rounded text-slate-500">
                      {track.questions.length} Soal
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {track.description}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 pt-1">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    {track.ageGroup}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* OFFLINE BOOKLET DOWNLOAD BANNER */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <Download className="w-4 h-4 text-blue-600" />
                Tes Penempatan Level (Mandiri / Offline)
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed max-w-lg">
                Unduh lembar soal Tes Penempatan Level matematika agar Anda dapat mengerjakannya secara mandiri secara offline tanpa perangkat digital. Berisi seluruh kategori kelompok belajar (SD, SMP, SMA, Evaluasi Umum) lengkap dengan lembar soal, ruang pengerjaan tertulis, kunci jawaban, dan panduan penempatan level mandiri.
              </p>
            </div>
            <button
              onClick={handleDownloadMaterials}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              id="btn-download-offline-booklet-body"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Tes Penempatan Level
            </button>
          </div>

          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed space-y-1">
              <span className="font-bold">Ketentuan & Panduan Tes:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Kerjakan secara jujur tanpa alat bantu hitung (Kalkulator) agar penempatan level akurat.</li>
                <li>Siapkan pensil dan kertas buram untuk coret-coretan jika dibutuhkan.</li>
                <li>Gunakan format angka desimal dengan titik jika perlu, atau pecahan menggunakan simbol garis miring (contoh: <code className="bg-amber-100 px-1 py-0.2 rounded font-bold">3/4</code>).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE TESTING INTERFACE */}
      {selectedTrack && !isTestFinished && (
        <div className="p-6 md:p-8 space-y-6">
          {/* Progress Bar & Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                {selectedTrack.name} • Soal Aktif
              </span>
              <div className="text-sm font-bold text-slate-800">
                Soal {currentQuestionIndex + 1} dari {selectedTrack.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                Waktu Berlalu: <span className="font-bold text-slate-800">{formatTime(timeSpentSeconds)}</span>
              </span>
            </div>
          </div>

          {/* Progress Indicator Line */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex) / selectedTrack.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* QUESTION BOX */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[220px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              Evaluasi Kemampuan - Level {selectedTrack.questions[currentQuestionIndex].levelId}
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-wide font-sans">
              {selectedTrack.questions[currentQuestionIndex].text}
            </div>
            {selectedTrack.questions[currentQuestionIndex].hint && (
              <p className="text-xs text-slate-400 italic">
                {selectedTrack.questions[currentQuestionIndex].hint}
              </p>
            )}
          </div>

          {/* ANSWER INPUT FORM */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tulis Jawaban Anda:
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={currentInputValue}
                  onChange={(e) => setCurrentInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNextQuestion();
                    }
                  }}
                  placeholder={selectedTrack.questions[currentQuestionIndex].placeholder}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-blue-600 focus:ring-0 rounded-xl font-bold text-center text-xl tracking-wide text-slate-800 transition shadow-sm"
                  id="placement-answer-input"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipQuestion}
                className="flex-1 py-3 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                id="btn-skip-question"
              >
                Lewati Soal
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                id="btn-submit-answer"
              >
                {currentQuestionIndex === selectedTrack.questions.length - 1 ? "Selesaikan Tes" : "Lanjut ke Soal Berikutnya"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED / RESULTS SCREEN */}
      {selectedTrack && isTestFinished && (
        <div className="p-6 md:p-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-full border border-green-100">
              <Award className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Hasil Tes Penempatan Selesai!</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Terima kasih telah berpartisipasi dengan penuh kejujuran. Berikut adalah ringkasan hasil evaluasi matematika Anda:
            </p>
          </div>

          {/* MAIN CARD HUD RESULT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 border border-slate-200 p-6 rounded-2xl">
            {/* Left circular progress or stats */}
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-5 md:pb-0 md:pr-5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Skor Pencapaian</span>
              <div className="relative flex items-center justify-center">
                {/* SVG Circle Progress */}
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-slate-200" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-green-500 transition-all duration-1000"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * results.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-2xl font-black text-slate-900 font-mono">
                  {results.score}%
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-3 font-mono">
                {results.correctCount} dari {results.totalCount} Soal Benar
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Waktu pengerjaan: {formatTime(timeSpentSeconds)}
              </p>
            </div>

            {/* Right diagnostic recommendation */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Level Memulai yang Direkomendasikan</span>
                <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5 mt-1.5">
                  <span>Level {recommendation.levelId}</span>
                  <span className="text-sm font-semibold text-slate-400">
                    ({KUMON_CURRICULUM.find(l => l.id === recommendation.levelId)?.name || "Kurikulum Tingkat"})
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-xl">
                <p className="text-xs text-blue-900 font-medium leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleStartWithRecommendation}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  id="btn-start-recommendation"
                >
                  <Sparkles className="w-4 h-4" />
                  Mulai Belajar di Level {recommendation.levelId}
                </button>
                <button
                  onClick={() => handleStartTrack(selectedTrack)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  id="btn-retry-test"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ulangi Tes
                </button>
              </div>
            </div>
          </div>

          {/* ITEM-BY-ITEM QUESTION REVIEW */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Tinjauan Jawaban Soal
            </h4>
            <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {results.details.map((q, idx) => (
                <div key={idx} className="p-4 bg-white hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">
                        Level {q.levelId}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 font-mono tracking-wide">{q.questionText}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <div className="text-slate-500 font-medium">
                        Jawaban Anda: <span className={`font-bold ${q.isCorrect ? "text-green-600" : "text-red-500"}`}>{q.userAnswer}</span>
                      </div>
                      {!q.isCorrect && (
                        <div className="text-slate-400 font-medium">
                          Jawaban Benar: <span className="font-bold text-slate-700">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {q.isCorrect ? (
                        <div className="p-1 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="p-1 bg-red-50 border border-red-200 text-red-500 rounded-lg">
                          <X className="w-4 h-4" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BACK TO MAIN DIRECTORY */}
          <div className="text-center">
            <button
              onClick={() => {
                setSelectedTrack(null);
                setIsTestFinished(false);
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
              id="btn-test-other-group"
            >
              Coba Tes Kelompok Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
