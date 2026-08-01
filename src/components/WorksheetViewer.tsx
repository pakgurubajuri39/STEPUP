import { useState, useEffect, useRef } from "react";
import { Worksheet, UserAnswer } from "../types";
import MathRenderer from "./MathRenderer";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Printer,
  CheckCircle,
  FileDown,
  FileText,
  Eye,
  EyeOff,
  Clock,
  BookOpen,
  Award,
  BookMarked,
  XCircle,
  Check,
  AlertCircle
} from "lucide-react";

interface WorksheetViewerProps {
  worksheet: Worksheet;
  onSaveToHistory: (timeSpentSeconds: number, answers: { [key: string]: string }, score: number) => void;
  onClose: () => void;
}

export default function WorksheetViewer({ worksheet, onSaveToHistory, onClose }: WorksheetViewerProps) {
  // Modes: "interactive" (Solve here) | "print" (Clean worksheet view)
  const [activeMode, setActiveMode] = useState<"interactive" | "print">("interactive");

  // Timer state
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Solving state
  const [studentAnswers, setStudentAnswers] = useState<{ [questionId: string]: string }>({});
  const [isGraded, setIsGraded] = useState<boolean>(false);
  const [gradedScore, setGradedScore] = useState<number>(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);

  // Answer Key visibility state
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  // Start & Stop Timer
  useEffect(() => {
    if (isTimerRunning && !isGraded && activeMode === "interactive") {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isGraded, activeMode]);

  // Reset solver when worksheet changes
  useEffect(() => {
    setStudentAnswers({});
    setIsGraded(false);
    setGradedScore(0);
    setTimeSpent(0);
    setIsTimerRunning(true);
    setWrongQuestionIds([]);
    setShowAnswerKey(false);
  }, [worksheet]);

  const handleAnswerChange = (qId: string, value: string) => {
    if (isGraded) return; // disable changes after grading
    setStudentAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const normalizeString = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/\s+/g, "") // remove all spaces
      .replace(/[()]/g, "") // remove brackets
      .replace(/\$/g, "") // remove latex $
      .trim();
  };

  // Grade Worksheet
  const handleGrade = () => {
    let correctCount = 0;
    const wrongIds: string[] = [];

    worksheet.questions.forEach((q) => {
      // If it's a guide/example question, we don't grade it, or it counts as correct if filled/skipped
      if (q.isExample) {
        correctCount++;
        return;
      }

      const studentAns = studentAnswers[q.id] || "";
      const correctAns = q.answer;

      const normStudent = normalizeString(studentAns);
      const normCorrect = normalizeString(correctAns);

      // Check exact or loose match
      const isMatch =
        normStudent === normCorrect ||
        (normStudent.length > 0 && normCorrect.includes(normStudent)) ||
        // handle multiple quadratic roots x=2, x=3 or x=3, x=2
        (normCorrect.includes(",") &&
          normStudent.split(",").every((part) => normCorrect.includes(part)) &&
          normStudent.length > 0);

      if (isMatch) {
        correctCount++;
      } else {
        wrongIds.push(q.id);
      }
    });

    const calculatedScore = Math.round((correctCount / worksheet.questions.length) * 100);
    setGradedScore(calculatedScore);
    setWrongQuestionIds(wrongIds);
    setIsGraded(true);
    setIsTimerRunning(false);

    // Save to history list
    onSaveToHistory(timeSpent, studentAnswers, calculatedScore);
  };

  const handleReset = () => {
    setStudentAnswers({});
    setIsGraded(false);
    setGradedScore(0);
    setTimeSpent(0);
    setIsTimerRunning(true);
    setWrongQuestionIds([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Standard Print View Trigger
  const handlePrint = () => {
    window.print();
  };

  // Helper to escape special HTML characters
  const escapeHtml = (str: string): string => {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Download complete standalone ready-to-print HTML file
  const handleDownloadHtml = () => {
    const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, "_");

    const questionsHtml = worksheet.questions
      .map((q) => {
        let exampleBlock = "";
        if (q.isExample) {
          let scaffoldingHtml = "";
          if (q.scaffoldingTemplate) {
            const parts = q.scaffoldingTemplate.split(/\[(.*?)\]/);
            scaffoldingHtml = `<div class="scaffolding-box"><strong>Alur Bimbingan:</strong> ${parts
              .map((p, idx) =>
                idx % 2 !== 0
                  ? `<span class="fill-box">${escapeHtml(p.trim()) || "?"}</span>`
                  : escapeHtml(p)
              )
              .join("")}</div>`;
          }
          exampleBlock = `
            <div class="example-box">
              <p><strong>Langkah Bimbingan:</strong> ${escapeHtml(q.explanation || "")}</p>
              ${scaffoldingHtml}
            </div>
          `;
        }

        return `
          <div class="question-card">
            <div class="question-header">
              <span class="q-num">[ ${q.questionNumber} ]</span>
              <div class="q-text">${escapeHtml(q.questionText)}</div>
            </div>
            ${exampleBlock}
            ${!q.isExample ? `<div class="answer-space">Jawaban: <span class="answer-line"></span></div>` : ""}
          </div>
        `;
      })
      .join("");

    const answerKeyHtml = worksheet.questions
      .map(
        (q) => `
        <div class="key-item">
          <strong>Soal ${q.questionNumber}:</strong> <span class="ans-value">${escapeHtml(q.answer)}</span>
          ${q.explanation ? `<br/><small class="exp-text">Langkah: ${escapeHtml(q.explanation)}</small>` : ""}
        </div>
      `
      )
      .join("");

    const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembar Kerja Level ${escapeHtml(worksheet.level)} - ${escapeHtml(worksheet.topic)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 24px;
    }
    .paper-card {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .top-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 14px 24px;
      border-radius: 12px;
      margin-bottom: 28px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
    }
    .action-title {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s ease;
    }
    .print-btn:hover { background: #1d4ed8; }

    .header-branding {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .app-title {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: -0.5px;
    }
    .app-subtitle {
      font-size: 12px;
      color: #2563eb;
      font-weight: 700;
      margin-top: 2px;
    }
    .topic-title {
      font-size: 18px;
      font-weight: 800;
      margin-top: 8px;
      color: #1e293b;
    }
    .badge-wrap {
      text-align: right;
    }
    .level-badge {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      display: inline-block;
      margin-bottom: 6px;
    }
    .sct-badge {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .student-info-grid {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px;
      background: #f8fafc;
      margin-bottom: 28px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      font-size: 13px;
    }
    .field-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .field-row label {
      font-weight: 700;
      color: #334155;
      min-width: 90px;
    }
    .field-line {
      flex: 1;
      border-bottom: 1.5px dashed #94a3b8;
      height: 18px;
    }

    .instruction-card {
      background: #f1f5f9;
      border-left: 4px solid #2563eb;
      padding: 14px 18px;
      margin-bottom: 28px;
      font-size: 13px;
      color: #334155;
      border-radius: 0 8px 8px 0;
    }

    .questions-container {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .question-card {
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 18px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .question-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .q-num {
      font-family: monospace;
      font-weight: 800;
      color: #475569;
      font-size: 16px;
    }
    .q-text {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }

    .example-box {
      margin-top: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      color: #475569;
    }
    .scaffolding-box {
      margin-top: 8px;
      font-family: monospace;
      background: #eff6ff;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #dbeafe;
    }
    .fill-box {
      display: inline-block;
      min-width: 30px;
      padding: 2px 8px;
      background: #ffffff;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      color: #1d4ed8;
      margin: 0 3px;
    }

    .answer-space {
      margin-top: 16px;
      font-size: 14px;
      color: #64748b;
    }
    .answer-line {
      display: inline-block;
      width: 220px;
      border-bottom: 2px dashed #94a3b8;
      margin-left: 10px;
    }

    .answer-key-wrapper {
      margin-top: 48px;
      padding-top: 28px;
      border-top: 2px solid #e2e8f0;
      page-break-before: always;
    }
    .key-header {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 20px;
    }
    .key-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .key-item {
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .ans-value {
      font-family: monospace;
      font-weight: 800;
      color: #047857;
      font-size: 15px;
    }
    .exp-text {
      color: #64748b;
    }

    .footer-credit {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        color: #000000 !important;
      }
      .paper-card {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .top-actions {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="paper-card">
    <div class="top-actions">
      <div class="action-title">📄 Lembar Kerja StepUp Study (Format HTML Siap Cetak)</div>
      <button class="print-btn" onclick="window.print()">🖨️ CETAK SEKARANG (PRINT / PDF)</button>
    </div>

    <div class="header-branding">
      <div>
        <div class="app-title">StepUp Study</div>
        <div class="app-subtitle">Matematika Berjenjang • Metode Small Steps</div>
        <div class="topic-title">${escapeHtml(worksheet.topic)}</div>
      </div>
      <div class="badge-wrap">
        <div class="level-badge">LEVEL ${escapeHtml(worksheet.level)}</div>
        <div class="sct-badge">Target SCT: ${worksheet.sctMinutes} Menit</div>
      </div>
    </div>

    <div class="student-info-grid">
      <div class="field-row">
        <label>Nama Siswa:</label>
        <div class="field-line"></div>
      </div>
      <div class="field-row">
        <label>Tanggal:</label>
        <div class="field-line"></div>
      </div>
      <div class="field-row">
        <label>Nilai / Skor:</label>
        <div class="field-line"></div>
      </div>
      <div class="field-row">
        <label>Waktu Pengerjaan:</label>
        <div class="field-line"></div>
      </div>
    </div>

    <div class="instruction-card">
      <strong>Instruksi:</strong> ${escapeHtml(
        worksheet.instruction || "Selesaikan operasi matematika berikut secara cermat, rapi, dan mandiri."
      )}
    </div>

    <div class="questions-container">
      ${questionsHtml}
    </div>

    <div class="answer-key-wrapper">
      <div class="key-header">🔑 KUNCI JAWABAN & SOLUSI PENYELESAIAN (UNTUK REFERENSI)</div>
      <div class="key-grid">
        ${answerKeyHtml}
      </div>
    </div>

    <div class="footer-credit">
      @Copyright by. Pak GuruAI
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `StepUp_Math_Worksheet_Level_${worksheet.level}_${sanitizeFilename(worksheet.topic)}.html`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download raw markdown file of the worksheet
  const handleDownloadMarkdown = () => {
    let mdContent = `# 📝 LEMBAR KERJA MATEMATIKA - STEPUP STUDY\n`;
    mdContent += `*Matematika Berjenjang Berdasarkan Prinsip Small Steps*\n\n`;
    mdContent += `**Level:** ${worksheet.level}\n`;
    mdContent += `**Topik/Materi:** ${worksheet.topic}\n`;
    mdContent += `**Waktu Pengerjaan Standar (SCT):** ${worksheet.sctMinutes} Menit\n\n`;
    mdContent += `---\n\n`;
    mdContent += `## IDENTITAS SISWA:\n`;
    mdContent += `* Nama: _________________________\n`;
    mdContent += `* Tanggal: _______________________\n`;
    mdContent += `* Nilai: _________________________\n`;
    mdContent += `* Durasi Pengerjaan: ______________ s.d ______________ menit\n\n`;
    mdContent += `---\n\n`;
    mdContent += `## INSTRUKSI:\n`;
    mdContent += `*${worksheet.instruction || "Selesaikan operasi hitung berikut secara mandiri, teliti, dan bertahap!"}*\n\n`;
    mdContent += `---\n\n`;
    mdContent += `## DAFTAR SOAL:\n\n`;

    worksheet.questions.forEach((q, idx) => {
      mdContent += `### **[ ${idx + 1} ]**\n`;
      mdContent += `  **Soal:** ${q.questionText}\n`;
      if (q.isExample) {
        mdContent += `  * *Contoh Bimbingan:* ${q.scaffoldingTemplate || ""}\n`;
        mdContent += `  * *Penjelasan:* ${q.explanation || ""}\n`;
      } else {
        mdContent += `  * Jawaban: [_______________________]\n`;
      }
      mdContent += `\n`;
    });

    mdContent += `---\n\n`;
    mdContent += `# 🔑 KUNCI JAWABAN & SOLUSI PENYELESAIAN (UNTUK REFERENSI)\n\n`;
    worksheet.questions.forEach((q, idx) => {
      mdContent += `**Soal ${idx + 1}:**\n`;
      mdContent += `* Kunci Jawaban: **${q.answer}**\n`;
      if (q.explanation) {
        mdContent += `* Penjelasan Langkah: *${q.explanation}*\n`;
      }
      mdContent += `\n`;
    });

    mdContent += `\n*Lembar kerja ini dihasilkan secara otomatis oleh StepUp Study Matematika Generator.*`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `StepUp_Math_Worksheet_Level_${worksheet.level}_${worksheet.topic.replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert scaffolding placeholders to beautiful empty input blocks or text hints
  const renderScaffolding = (q: any) => {
    if (!q.scaffoldingTemplate) return null;

    // Split template by brackets [ ] to show empty styled squares for input help
    const parts = q.scaffoldingTemplate.split(/\[(.*?)\]/);
    return (
      <div className="mt-2.5 p-3 bg-blue-50/30 border border-blue-100 rounded-lg text-xs text-slate-600 flex items-center flex-wrap gap-1 font-mono">
        <span className="font-bold text-blue-700 mr-1 text-[10px] uppercase tracking-wider bg-blue-100/50 px-1.5 py-0.5 rounded">
          Alur Bimbingan:
        </span>
        {parts.map((part: string, idx: number) => {
          // Odd indices are contents of [ ]
          if (idx % 2 !== 0) {
            return (
              <span
                key={idx}
                className="inline-flex items-center justify-center px-2 py-0.5 min-w-[24px] bg-white border-2 border-blue-200 rounded text-blue-700 font-bold shadow-sm text-xs"
              >
                {part.trim() || "?"}
              </span>
            );
          }
          return <span key={idx} className="text-slate-600">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="worksheet-viewer">
      {/* Viewer Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">
            <span className="px-2 py-0.5 bg-blue-100 rounded">Level {worksheet.level}</span>
            <span>•</span>
            <span>SCT: {worksheet.sctMinutes} Menit</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800" id="worksheet-viewer-title">
            {worksheet.topic}
          </h2>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Print Tab Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveMode("interactive")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === "interactive"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Kerjakan di Sini
            </button>
            <button
              onClick={() => setActiveMode("print")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === "print" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              Mode Cetak
            </button>
          </div>

          <button
            onClick={() => {
              setActiveMode("print");
              setTimeout(() => {
                window.print();
              }, 100);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Cetak Lembar Kerja Langsung"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Unduh Lembar Kerja Format HTML (Siap Cetak)"
            id="btn-download-worksheet-html-header"
          >
            <FileDown className="w-3.5 h-3.5" />
            Unduh HTML (Siap Cetak)
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Unduh Soal Format Markdown (.md)"
            id="btn-download-worksheet-md-header"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            .md
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-850 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* RENDER MODE 1: INTERACTIVE SOLVING MODE */}
      {activeMode === "interactive" && (
        <div className="p-6 print:hidden" id="interactive-solving-panel">
          {/* Timer and Score HUD */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900 text-white rounded-lg mb-6 shadow-md gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-400" />
                <span className="text-xl font-mono font-bold">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  disabled={isGraded}
                  className="p-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 rounded transition-colors cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setTimeSpent(0)}
                  disabled={isGraded}
                  className="p-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 rounded transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t border-slate-800 sm:border-t-0 pt-2 sm:pt-0">
              <span className="text-xs text-slate-400 font-medium">SCT Target:</span>
              <span className="px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold font-mono">
                {worksheet.sctMinutes} Menit
              </span>
            </div>
          </div>

          {/* Graded Summary Board */}
          {isGraded && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg mb-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8">
                <Award className="w-full h-full text-blue-900" />
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-xl font-mono border-2 ${
                    gradedScore >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                  }`}
                >
                  {gradedScore}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Lembar Kerja Dinilai!</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selesai dalam waktu <strong className="text-slate-700">{formatTime(timeSpent)}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-all cursor-pointer"
                >
                  Ulangi Pengerjaan
                </button>
                <button
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition-all cursor-pointer"
                >
                  {showAnswerKey ? "Sembunyikan Solusi" : "Lihat Pembahasan"}
                </button>
              </div>
            </div>
          )}

          {/* Instructions banner */}
          <div className="p-4 bg-blue-50/20 border border-blue-100 rounded-lg mb-6">
            <h3 className="font-bold text-xs text-blue-800 flex items-center gap-2 mb-1 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 shrink-0 text-blue-600" />
              Petunjuk Umum:
            </h3>
            <p className="text-xs text-blue-700 font-medium">
              {worksheet.instruction || "Selesaikan operasi hitung berikut dengan teliti!"}
            </p>
          </div>

          {/* Questions Grid */}
          <div className="space-y-6" id="interactive-questions-list">
            {worksheet.questions.map((q, idx) => {
              const isWrong = wrongQuestionIds.includes(q.id);
              const isAnswered = studentAnswers[q.id]?.trim().length > 0;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-lg border transition-all ${
                    q.isExample
                      ? "bg-slate-50/80 border-slate-200"
                      : isGraded
                      ? isWrong
                        ? "bg-red-50/30 border-red-200"
                        : "bg-emerald-50/30 border-emerald-200"
                      : "bg-white border-slate-200 hover:border-slate-350"
                  }`}
                  id={`solving-question-${q.id}`}
                >
                  {/* Question header row */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 font-mono">
                        {q.questionNumber}
                      </span>
                      {q.isExample && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase rounded">
                          CONTOH BIMBINGAN
                        </span>
                      )}
                    </div>

                    {isGraded && !q.isExample && (
                      <div className="flex items-center gap-1.5">
                        {isWrong ? (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Salah
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Benar
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question body */}
                  <div className="my-4 pl-0.5">
                    <div className="text-lg font-medium text-slate-800">
                      <MathRenderer math={q.questionText} />
                    </div>

                    {/* Render specific scaffolding hints for examples */}
                    {q.isExample && q.explanation && (
                      <div className="mt-3 p-3.5 bg-blue-50/10 border border-blue-100/70 rounded-lg text-xs text-slate-600 leading-relaxed">
                        <strong className="text-blue-850 block mb-1">Panduan Langkah:</strong>
                        {q.explanation}
                        {renderScaffolding(q)}
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  {!q.isExample && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 max-w-sm">
                        <input
                          type="text"
                          disabled={isGraded}
                          placeholder={q.placeholder || "Jawaban Anda..."}
                          value={studentAnswers[q.id] || ""}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-xs font-mono font-bold transition-all ${
                            isGraded
                              ? isWrong
                                ? "bg-red-50 border-red-200 text-red-850"
                                : "bg-emerald-50 border-emerald-200 text-emerald-850"
                              : "bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                          }`}
                        />
                      </div>

                      {isGraded && isWrong && (
                        <div className="text-xs text-slate-500" id={`wrong-feedback-${q.id}`}>
                          Koreksi: <code className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-bold">{q.answer}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom actions */}
          {!isGraded && (
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleGrade}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-100 transition-all cursor-pointer"
                id="btn-submit-grading"
              >
                Kirim & Nilai Sekarang
              </button>
            </div>
          )}
        </div>
      )}

      {/* RENDER MODE 2: PRINT & PDF VIEWER */}
      {activeMode === "print" && (
        <div className="p-8 print:p-0 bg-slate-50 print:bg-white" id="print-sheet-panel">
          {/* Printable page layout container */}
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 border border-slate-200 print:border-none rounded-lg shadow-sm print:shadow-none min-h-[842px]">
            {/* Real StepUp Math Header block */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5 mb-8">
              <div>
                <span className="text-xl font-bold tracking-widest text-blue-600 font-sans uppercase">STEPUP STUDY</span>
                <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  Matematika Generator Engine
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-slate-800 px-3 py-1 bg-slate-100 rounded border border-slate-200">
                  Level {worksheet.level}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">SCT: {worksheet.sctMinutes} Menit</div>
              </div>
            </div>

            {/* School Worksheet metadata headers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-200 mb-6 text-sm text-slate-600 font-mono">
              <div>Nama: ________________</div>
              <div>Tanggal: ________________</div>
              <div>Nilai: ________________</div>
              <div>Waktu: _____ s.d _____ mnt</div>
            </div>

            {/* Topic & Instruction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{worksheet.topic}</h2>
              <p className="text-sm text-slate-500 font-medium italic">
                Instruksi: {worksheet.instruction || "Selesaikan dengan mandiri dan teliti."}
              </p>
            </div>

            {/* Print Grid of Questions */}
            <div className="space-y-8" id="print-questions-grid">
              {worksheet.questions.map((q) => (
                <div key={q.id} className="pb-4 border-b border-dashed border-slate-100 last:border-0">
                  <div className="flex items-start gap-4">
                    <span className="font-mono font-bold text-slate-600 w-6 text-right select-none">
                      [{q.questionNumber}]
                    </span>
                    <div className="flex-1">
                      <div className="text-lg font-serif tracking-wide mb-3 text-slate-800">
                        <MathRenderer math={q.questionText} />
                      </div>

                      {q.isExample && q.explanation ? (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-sans max-w-2xl leading-relaxed">
                          <strong>Langkah Bimbingan:</strong> {q.explanation}
                          {q.scaffoldingTemplate && (
                            <div className="mt-1.5 font-mono text-xs border-t border-slate-200 pt-1.5">
                              Pola: <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">{q.scaffoldingTemplate}</code>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-12 border-b border-slate-300 border-dashed max-w-sm mt-2 select-none"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Print Friendly action */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
              <span className="text-xs text-slate-400 text-center sm:text-left">
                Gunakan tombol di bawah untuk mencetak langsung atau mengunduh lembar kerja ini.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <button
                  onClick={handleDownloadHtml}
                  className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  id="btn-download-worksheet-html-footer"
                >
                  <FileDown className="w-4 h-4" />
                  Unduh HTML (Siap Cetak)
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  id="btn-download-worksheet-md-footer"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  Unduh (.md)
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Langsung
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER: ANSWER KEY (Kunci Jawaban) */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 print:hidden" id="answer-key-section">
        <button
          onClick={() => setShowAnswerKey(!showAnswerKey)}
          className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-xs text-slate-700 transition-all shadow-sm cursor-pointer"
          id="btn-toggle-answer-key"
        >
          <span className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-600" />
            🔑 Kunci Jawaban & Solusi Penyelesaian (Referensi)
          </span>
          {showAnswerKey ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
        </button>

        {showAnswerKey && (
          <div className="mt-4 p-5 bg-white border border-slate-150 rounded-xl space-y-3.5 animate-fade-in" id="answer-key-content">
            <div className="text-xs text-slate-500 mb-2 border-b border-slate-100 pb-2">
              Gunakan kunci jawaban ini untuk mengoreksi pengerjaan mandiri anak atau memeriksa pengerjaan langkah demi langkah.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worksheet.questions.map((q) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="font-bold text-slate-500 mb-1">Soal {q.questionNumber}</div>
                  <div className="font-mono text-sm font-extrabold text-emerald-700 mb-1.5">{q.answer}</div>
                  {q.explanation && (
                    <div className="text-slate-500 text-[11px] leading-relaxed border-t border-slate-150 pt-1 mt-1">
                      <span className="font-bold text-slate-600">Langkah:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
