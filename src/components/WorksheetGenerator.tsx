import React, { useState, useEffect } from "react";
import { KUMON_CURRICULUM } from "../curriculum";
import { CurriculumLevel, CurriculumTopic } from "../types";
import { Sparkles, Terminal, Settings2, Hash, AlertCircle, HelpCircle } from "lucide-react";

interface WorksheetGeneratorProps {
  onGenerate: (level: string, topic: string, numQuestions: number, customPrompt?: string) => Promise<void>;
  isLoading: boolean;
  selectedLevelFromExplorer: CurriculumLevel | null;
  selectedTopicFromExplorer: CurriculumTopic | null;
  clearExplorerSelection: () => void;
}

export default function WorksheetGenerator({
  onGenerate,
  isLoading,
  selectedLevelFromExplorer,
  selectedTopicFromExplorer,
  clearExplorerSelection,
}: WorksheetGeneratorProps) {
  // Mode selection: "constructor" vs "command"
  const [activeTab, setActiveTab] = useState<"constructor" | "command">("constructor");

  // Constructor state
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLevelId, setSelectedLevelId] = useState<string>("G");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [customTopicName, setCustomTopicName] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(10);

  // Command/Prompt state
  const [commandText, setCommandText] = useState<string>("");
  const [commandError, setCommandError] = useState<string | null>(null);

  // Synchronize when selected from the curriculum explorer
  useEffect(() => {
    if (selectedLevelFromExplorer && selectedTopicFromExplorer) {
      setSelectedLevelId(selectedLevelFromExplorer.id);
      setSelectedTopicId(selectedTopicFromExplorer.id);
      setCustomTopicName("");
      setActiveTab("constructor");
    }
  }, [selectedLevelFromExplorer, selectedTopicFromExplorer]);

  // Filter levels based on selected category
  const filteredLevels = KUMON_CURRICULUM.filter(
    (l) => selectedCategory === "Semua" || l.category === selectedCategory
  );

  const currentLevel = KUMON_CURRICULUM.find((l) => l.id === selectedLevelId);
  const topics = currentLevel ? currentLevel.topics : [];

  // Default selection when Level changes
  useEffect(() => {
    if (topics.length > 0 && !selectedTopicFromExplorer) {
      setSelectedTopicId(topics[0].id);
    }
  }, [selectedLevelId, topics]);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  // Kumon Command Parser
  // String format: [Level] [Topik/Materi] [Jumlah Soal]
  // Example: "Level G Persamaan Linear 10 soal" or "Level J 5 soal"
  const parseCommand = (input: string) => {
    if (!input.trim()) return null;

    // Normalize
    const text = input.trim();

    // Regex to match Level (e.g. Level 6A, Level G, Level A, Level M-X)
    const levelRegex = /(?:Level\s+)?(6A|5A|4A|3A|2A|M-X|[A-La-lM-Xm-x])\b/i;
    const levelMatch = text.match(levelRegex);
    const parsedLevel = levelMatch ? levelMatch[1].toUpperCase() : "G"; // fallback to G

    // Regex to match question counts (e.g. 5 soal, 10 soal, 5 questions, 10)
    const questionsRegex = /(\d+)\s*(?:soal|questions|q)?/i;
    // Find numbers at the end or floating
    const questionsMatches = [...text.matchAll(/\b(\d+)\b/g)];
    let parsedCount = 10;

    // Check if there's a match containing "soal" or similar
    const specificQuestionMatch = text.match(/(\d+)\s*(soal|questions|q)/i);
    if (specificQuestionMatch) {
      parsedCount = parseInt(specificQuestionMatch[1]);
    } else if (questionsMatches.length > 0) {
      // Find the last number, usually indicates the count
      const lastNum = parseInt(questionsMatches[questionsMatches.length - 1][1]);
      if (lastNum > 0 && lastNum <= 30) {
        parsedCount = lastNum;
      }
    }

    // Extract topic (remove Level indicator and question count indicator)
    let parsedTopic = text
      .replace(levelRegex, "")
      .replace(/(\d+)\s*(?:soal|questions|q)?/gi, "")
      .replace(/-\s*$/g, "")
      .trim();

    // Remove filler words
    parsedTopic = parsedTopic
      .replace(/^(untuk|tentang|materi|topik|sub-materi)\s+/gi, "")
      .trim();

    if (!parsedTopic) {
      parsedTopic = "Latihan Umum";
    }

    return {
      level: parsedLevel,
      topic: parsedTopic,
      count: parsedCount,
    };
  };

  const handleConstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = selectedTopicId === "custom" ? customTopicName || "Custom Topic" : selectedTopic?.name || "Materi";
    onGenerate(selectedLevelId, finalTopic, numQuestions);
    clearExplorerSelection();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommandError(null);

    const parsed = parseCommand(commandText);
    if (!parsed) {
      setCommandError("Mohon masukkan perintah dengan format yang benar.");
      return;
    }

    // Trigger Generation with exact custom query structure
    onGenerate(parsed.level, parsed.topic, parsed.count, commandText);
    clearExplorerSelection();
  };

  // Pre-fill a sample command
  const setSampleCommand = (sample: string) => {
    setCommandText(sample);
    setActiveTab("command");
  };

  const currentLoadingStep = useLoadingStep(isLoading);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="worksheet-generator">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("constructor")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === "constructor"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/10"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
          }`}
          id="tab-constructor"
        >
          <Settings2 className="w-4 h-4" />
          Metode Dropdown
        </button>
        <button
          onClick={() => setActiveTab("command")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === "command"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/10"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
          }`}
          id="tab-command"
        >
          <Terminal className="w-4 h-4" />
          Metode Command Input
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: CONSTRUCTOR DROPDOWN */}
        {activeTab === "constructor" && (
          <form onSubmit={handleConstructorSubmit} className="space-y-5" id="constructor-form">
            {/* Category selection tags */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Kategori Materi
              </label>
              <div className="flex flex-wrap gap-2">
                {["Semua", "Arithmetic", "Algebra", "Advanced"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "Semua"
                      ? "Semua"
                      : cat === "Arithmetic"
                      ? "Aritmatika"
                      : cat === "Algebra"
                      ? "Aljabar"
                      : "Lanjut"}
                  </button>
                ))}
              </div>
            </div>

            {/* Level and Topic Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Pilih Tingkat (Level)
                </label>
                <select
                  id="level-select"
                  value={selectedLevelId}
                  onChange={(e) => setSelectedLevelId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                >
                  {filteredLevels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} - {l.description.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Pilih Sub-Materi (Topik)
                </label>
                <select
                  id="topic-select"
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    if (e.target.value !== "custom") setCustomTopicName("");
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                  <option value="custom">✍️ Tulis Topik Kustom Sendiri...</option>
                </select>
              </div>
            </div>

            {/* Custom Topic Input */}
            {selectedTopicId === "custom" && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama Topik Kustom Anda
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 'Persamaan Logaritma Dua Variabel' atau 'Akar Pangkat 3'"
                  value={customTopicName}
                  onChange={(e) => setCustomTopicName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                />
              </div>
            )}

            {/* Number of Questions and Visual Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                  <Hash className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Jumlah Soal
                  </span>
                  <div className="flex gap-2 mt-1">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNumQuestions(num)}
                        className={`w-9 h-8 text-xs font-bold rounded-lg border transition-all ${
                          numQuestions === num
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTopic && selectedTopicId !== "custom" && (
                <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Sistem Belajar Kecil (Small Steps)
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block max-w-xs mt-0.5">
                    Tingkat kesulitan diatur naik bertahap dari mudah hingga menantang.
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-blue-100 transition-all cursor-pointer"
              id="btn-generate-constructor"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? "Memproses Pembuatan Soal..." : "GENERATE WORKSHEET"}
            </button>
          </form>
        )}

        {/* TAB 2: COMMAND INPUT */}
        {activeTab === "command" && (
          <form onSubmit={handleCommandSubmit} className="space-y-5" id="command-form">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 relative shadow-inner">
              <div className="absolute top-3 right-3 text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-slate-700">
                StepUp Terminal
              </div>
              <div className="text-[10px] text-blue-400 mb-2 font-bold uppercase tracking-wider"># Masukkan Perintah Format StepUp Math</div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold font-mono select-none">&gt;</span>
                <input
                  type="text"
                  required
                  placeholder="Level G Aljabar Linier 10 soal"
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600 caret-blue-400 font-semibold"
                  id="command-input"
                />
              </div>
            </div>

            {commandError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-150 rounded-lg text-xs text-red-600" id="command-error-msg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {commandError}
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Panduan Format Perintah
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Ketikkan kombinasi <strong className="text-slate-800">[Level] [Topik] [Jumlah Soal]</strong>. 
                Mesin AI kami akan menguraikan dan mencocokkan sesuai standard kurikulum StepUp Math.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="sample-commands-list">
                {[
                  "Level A Pengurangan 1-5 10 soal",
                  "Level G Aljabar Persamaan Linier 8 soal",
                  "Level I Persamaan Kuadrat 15 soal",
                  "Level J Hubungan Akar-Koefisien 5 soal",
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setSampleCommand(sample)}
                    className="p-2.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-lg text-left text-xs font-mono text-slate-600 truncate transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-blue-100 transition-all cursor-pointer"
              id="btn-generate-command"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? "Memproses Pembuatan Soal..." : "GENERATE WORKSHEET"}
            </button>
          </form>
        )}

        {/* LOADING ANIMATION CONTAINER */}
        {isLoading && (
          <div className="mt-6 p-6 bg-blue-50/30 border border-blue-100 rounded-lg flex flex-col items-center justify-center text-center animate-pulse" id="loading-container">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" id="spinner"></div>
            <h4 className="font-bold text-blue-900 text-sm mb-1" id="loading-title">
              Sedang Merancang Soal StepUp Math...
            </h4>
            <p className="text-xs text-blue-700 max-w-md leading-relaxed font-medium" id="loading-tip">
              {currentLoadingStep}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom hook to show shifting math tips during loading to engage the user
function useLoadingStep(isLoading: boolean) {
  const [step, setStep] = useState(0);
  const steps = [
    "Menyusun urutan soal secara bertahap (Small Steps Principle)...",
    "Membuat scaffolding (pola kotak pembimbing) pada soal nomor 1...",
    "Merumuskan penulisan matematika yang bersih dan rapi...",
    "Membuat kunci jawaban dan panduan penyelesaian langkah-demi-langkah...",
    "Verifikasi kesesuaian soal dengan standar kurikulum StepUp Math...",
  ];

  useEffect(() => {
    if (!isLoading) {
      setStep(0);
      return;
    }
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading, steps.length]);

  return steps[step];
}
