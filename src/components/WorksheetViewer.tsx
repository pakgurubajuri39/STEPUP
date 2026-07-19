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

  // Download raw markdown file of the worksheet
  const handleDownloadMarkdown = () => {
    let mdContent = `### 📝 WORKSHEET KUMON STYLE\n`;
    mdContent += `**Level:** ${worksheet.level}\n`;
    mdContent += `**Topik:** ${worksheet.topic}\n`;
    mdContent += `**Waktu Penyelesaian Standar (SCT):** ${worksheet.sctMinutes}\n\n`;
    mdContent += `**Instruksi:** ${worksheet.instruction}\n\n`;

    worksheet.questions.forEach((q, idx) => {
      mdContent += `${idx + 1}. ${q.questionText}\n`;
      if (q.isExample) {
        mdContent += `   *Contoh Berbimbing: ${q.scaffoldingTemplate || ""}\n`;
        mdContent += `   *Penjelasan: ${q.explanation || ""}\n`;
      }
      mdContent += `\n`;
    });

    mdContent += `\n---\n### 🔑 KUNCI JAWABAN (ANSWER KEY)\n`;
    worksheet.questions.forEach((q, idx) => {
      mdContent += `${idx + 1}. ${q.answer} (${q.explanation || "Hasil Akhir"})\n`;
    });

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
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Cetak Lembar Kerja"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            title="Download Markdown"
          >
            <FileDown className="w-4 h-4" />
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
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center print:hidden">
              <span className="text-xs text-slate-400">
                Gunakan tombol cetak untuk mencetak langsung ke kertas fisik atau file PDF.
              </span>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak ke Kertas/PDF
              </button>
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
