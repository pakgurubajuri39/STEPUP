import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini Client with environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side Gemini API route for StepUp Math Worksheet generation
app.post("/api/generate-worksheet", async (req, res) => {
  const { level, topic, numQuestions, customPrompt } = req.body;

  if (!level || !topic) {
    return res.status(400).json({ error: "Level dan Topik diperlukan." });
  }

  const count = numQuestions ? parseInt(numQuestions) : 10;

  const userPrompt = customPrompt
    ? `Hasilkan lembar kerja StepUp Math untuk: ${customPrompt} dengan ${count} soal.`
    : `Buat lembar kerja StepUp Math untuk Level: "${level}", Topik/Materi: "${topic}" dengan jumlah soal: ${count}.`;

  const systemInstruction = `Anda adalah "StepUp Math Problem Generator Engine".
Tugas utama Anda adalah menghasilkan lembar kerja matematika (Worksheet) yang mengikuti kurikulum, struktur tingkatan (Level), dan metodologi bimbingan StepUp Math secara presisi.

PRINSIP UTAMA METODOLOGI STEPUP MATH YANG WAJIB DIIKUTI:
1. Small Steps (Langkah Kecil): Soal harus bergerak dari yang paling mudah ke yang lebih sulit secara bertahap dalam satu paket soal. Mulailah nomor awal dengan bilangan kecil/sederhana, lalu kembangkan secara bertahap ke tingkat kerumitan yang lebih tinggi di nomor-nomor akhir.
2. Scaffolding (Perancah / Contoh Terbimbing):
   - Untuk tingkatan menengah/lanjut (Aljabar, Fungsi, Kalkulus, Trigonometri, Matriks, dll) atau saat memperkenalkan konsep baru, wajib jadikan SOAL NOMOR 1 sebagai CONTOH (isExample: true).
   - Di soal nomor 1, berikan contoh pengerjaan langkah-demi-langkah atau pengisian slot kosong [ ] untuk melatih intuisi. Contoh:
     Persamaan: x² - 5x + 6 = 0
     Faktorkan:
     (x - [ 2 ])(x - [ 3 ]) = 0
     Maka, x = [ 2 ] atau x = [ 3 ]
   - Sertakan "explanation" dan "scaffoldingTemplate" untuk soal nomor 1 tersebut. Soal nomor 2 dan seterusnya adalah soal latihan mandiri yang sejenis namun memiliki nilai/angka bervariasi (isExample: false).
3. Kemandirian: Instruksi pengerjaan (instruction) harus sangat singkat, bersih, jelas, dan ditulis dalam Bahasa Indonesia yang formal namun sederhana (Contoh: "Hitunglah:", "Selesaikan persamaan berikut:", "Sederhanakan:", "Tentukan turunan pertamanya:").
4. Kunci Jawaban: Sediakan kunci jawaban ("answer") yang akurat, singkat, dan bersih untuk setiap soal.
5. PENULISAN MATEMATIKA YANG BERSIH DAN RAPI (MANDATORI: TANPA TANDA DOLAR $ ATAU LaTeX YANG MEMBINGUNGKAN):
   - JANGAN PERNAH menyertakan tanda dolar ($) atau penanda LaTeX seperti $$ atau \\frac, \\sqrt, dll dalam teks soal, jawaban, atau penjelasan.
   - Gunakan simbol matematika unicode standar yang bersih, mudah dibaca langsung oleh anak-anak tanpa parser LaTeX.
   - Contoh penulisan:
     * Gunakan superskrip untuk pangkat: x² + 5x + 6 = 0 atau (x - 2)(x - 3) = 0.
     * Gunakan tanda bagi biasa atau per: 1/2 atau (x + 1)/(x - 2).
     * Gunakan simbol akar biasa: √25 atau √x.
     * Gunakan tanda kali biasa: × atau * (misalnya 2 × 3 = 6).
     * Gunakan tanda kurang dan tambah biasa: + dan -.
     * Gunakan simbol matematika standar yang bersih, rapi, dan langsung bisa dibaca.

Kurikulum Referensi StepUp Math:
- Level 6A-5A-4A-3A-2A: Menghitung benda, membaca angka, penjumlahan dasar (+1, +2, +3, dst hingga +10).
- Level A: Penjumlahan lanjutan (hingga jumlah 100), Pengurangan dasar.
- Level B: Penjumlahan/Pengurangan 2-Digit dan 3-Digit.
- Level C: Perkalian dasar (tabel 1-9), Perkalian 2-Digit x 1-Digit, Pengenalan Pembagian dasar.
- Level D: Perkalian (3-Digit x 2-Digit), Pembagian dengan sisa, Penyederhanaan pecahan.
- Level E: Pecahan (Penjumlahan, Pengurangan, Perkalian, Pembagian pecahan biasa dan campuran).
- Level F: Empat Operasi Hitung Campuran (Pecahan, Desimal, Soal Cerita).
- Level G: Bilangan Positif/Negatif, Aljabar Dasar, Persamaan Linear 1 Variabel.
- Level H: Persamaan Linear 2-4 Variabel, Pertidaksamaan Linear.
- Level I: Perkalian Polinomial, Faktorisasi Pecahan Aljabar, Akar Kuadrat, Persamaan Kuadrat.
- Level J: Faktorisasi Lanjutan, Teorema Sisa/Faktor, Bilangan Kompleks, Diskriminan, Hubungan Akar-Koefisien.
- Level K: Fungsi Kuadrat & Grafik, Nilai Maks/Min Fungsi Kuadrat, Fungsi Pecahan/Irasional, Fungsi Eksponen & Logaritma.
- Level L: Fungsi Modulus, Limit Fungsi, Turunan (Derivatives), Garis Singgung, Integral (Tentu/Tak Tentu), Luas & Volume.
- Level M-X: Trigonometri, Locus, Integral Lanjutan, Vektor, Matriks, Permutasi/Kombinasi, Probabilitas, Statistika.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: {
              type: Type.STRING,
              description: "Nama level StepUp Math, contoh: A, G, J, L"
            },
            topic: {
              type: Type.STRING,
              description: "Nama topik atau materi spesifik"
            },
            sctMinutes: {
              type: Type.STRING,
              description: "Waktu Penyelesaian Standar (Standard Completion Time) dalam menit, contoh: 8-12 menit"
            },
            instruction: {
              type: Type.STRING,
              description: "Instruksi singkat pengerjaan dalam Bahasa Indonesia"
            },
            questions: {
              type: Type.ARRAY,
              description: "Daftar soal matematika StepUp Math berurutan",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.STRING,
                    description: "ID unik string acak singkat"
                  },
                  questionNumber: {
                    type: Type.INTEGER,
                    description: "Nomor soal mulai dari 1"
                  },
                  questionText: {
                    type: Type.STRING,
                    description: "Teks soal menggunakan notasi matematika bersih, tanpa tanda $, contoh: '15 - 4 = ' atau 'Sederhanakan: x² - 4x + 4'"
                  },
                  instruction: {
                    type: Type.STRING,
                    description: "Instruksi spesifik khusus nomor ini (jika ada, opsional)"
                  },
                  isExample: {
                    type: Type.BOOLEAN,
                    description: "Apakah merupakan soal contoh ber-scaffolding (terutama nomor 1)"
                  },
                  scaffoldingTemplate: {
                    type: Type.STRING,
                    description: "Template pengerjaan berkotak pembimbing, contoh: '(x - [   ])(x - [   ]) = 0'"
                  },
                  placeholder: {
                    type: Type.STRING,
                    description: "Petunjuk format input jawaban untuk siswa, contoh: 'x = 2 atau x = 3' atau '12'"
                  },
                  answer: {
                    type: Type.STRING,
                    description: "Jawaban akhir yang tepat dan bersih, contoh: '11' atau 'x=2, x=3'"
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Langkah penyelesaian singkat untuk pembimbing atau referensi siswa"
                  }
                },
                required: ["id", "questionNumber", "questionText", "isExample", "answer"]
              }
            }
          },
          required: ["level", "topic", "sctMinutes", "instruction", "questions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini API returned an empty response.");
    }

    const worksheetData = JSON.parse(resultText);
    res.json(worksheetData);
  } catch (error: any) {
    console.error("Gagal menghasilkan worksheet:", error);
    res.status(500).json({
      error: "Gagal memproses permintaan pembuatan soal.",
      details: error.message || error
    });
  }
});

// Wildcard fallback to handle other sub-api-routes if any
app.all("*", (req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

export default app;
