import { useState, useEffect } from "react";
import { Worksheet, WorksheetHistory, CurriculumLevel, CurriculumTopic } from "./types";
import LevelExplorer from "./components/LevelExplorer";
import WorksheetGenerator from "./components/WorksheetGenerator";
import WorksheetViewer from "./components/WorksheetViewer";
import WorksheetHistoryList from "./components/WorksheetHistoryList";
import PlacementTest from "./components/PlacementTest";
import Home from "./components/Home";
import Login from "./components/Login";
import { KUMON_CURRICULUM } from "./curriculum";
import {
  GraduationCap,
  History,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  BookMarked,
  LayoutDashboard,
  HelpCircle,
  AlertTriangle,
  Sparkles
} from "lucide-react";

export default function App() {
  // Screen/View router states
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'app'>(() => {
    try {
      const savedUser = localStorage.getItem("stepup_logged_in_user");
      return savedUser ? 'app' : 'home';
    } catch {
      return 'home';
    }
  });
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem("stepup_logged_in_user") || null;
    } catch {
      return null;
    }
  });

  // Application states
  const [activeWorksheet, setActiveWorksheet] = useState<Worksheet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History state (local persistence)
  const [history, setHistory] = useState<WorksheetHistory[]>([]);

  // Selection link between LevelExplorer and Generator
  const [selectedLevelFromExplorer, setSelectedLevelFromExplorer] = useState<CurriculumLevel | null>(null);
  const [selectedTopicFromExplorer, setSelectedTopicFromExplorer] = useState<CurriculumTopic | null>(null);
  const [isPlacementTestActive, setIsPlacementTestActive] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kumon_math_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Gagal memuat riwayat pengerjaan:", e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: WorksheetHistory[]) => {
    try {
      setHistory(newHistory);
      localStorage.setItem("kumon_math_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Gagal menyimpan riwayat pengerjaan:", e);
    }
  };

  // Add a completed worksheet entry to history
  const handleSaveToHistory = (timeSpentSeconds: number, answers: { [key: string]: string }, score: number) => {
    if (!activeWorksheet) return;

    const newHistoryItem: WorksheetHistory = {
      id: Math.random().toString(36).substring(2, 9),
      worksheet: activeWorksheet,
      timeSpentSeconds,
      answers,
      score,
      completedAt: new Date().toISOString(),
    };

    const updatedHistory = [newHistoryItem, ...history];
    saveHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pengerjaan?")) {
      saveHistory([]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  // Select a past worksheet from history to view/redo
  const handleSelectHistory = (item: WorksheetHistory) => {
    setActiveWorksheet(item.worksheet);
    // Smooth scroll to top of worksheet viewer
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trigger generator with level, topic, and question counts
  const handleGenerateWorksheet = async (level: string, topic: string, numQuestions: number, customPrompt?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveWorksheet(null);

    try {
      const response = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, topic, numQuestions, customPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}: Gagal menghubungi server.`);
      }

      const data = await response.json();
      setActiveWorksheet(data);
    } catch (err: any) {
      console.error("Kesalahan API:", err);
      setErrorMsg(err.message || "Terjadi kesalahan koneksi saat merancang lembar kerja.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopicFromExplorer = (level: CurriculumLevel, topic: CurriculumTopic) => {
    setSelectedLevelFromExplorer(level);
    setSelectedTopicFromExplorer(topic);
    // Scroll smoothly to Generator section
    const genSection = document.getElementById("worksheet-generator");
    if (genSection) {
      genSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectFromPlacementTest = (levelId: string, topicName: string) => {
    // Find the level in the curriculum
    const matchedLevel = KUMON_CURRICULUM.find(l => l.id === levelId);
    if (matchedLevel) {
      const matchedTopic = matchedLevel.topics.find(t => t.name === topicName) || matchedLevel.topics[0];
      setSelectedLevelFromExplorer(matchedLevel);
      setSelectedTopicFromExplorer(matchedTopic);
      setIsPlacementTestActive(false);
      setActiveWorksheet(null);
      
      // Scroll to generator
      setTimeout(() => {
        const genSection = document.getElementById("worksheet-generator");
        if (genSection) {
          genSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Stats calculations
  const totalSolved = history.length;
  const averageScore =
    totalSolved > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalSolved)
      : 0;
  const totalStudyTimeMinutes =
    totalSolved > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0) / 60)
      : 0;

  if (currentView === "home") {
    return <Home onNavigateToLogin={() => setCurrentView("login")} />;
  }

  if (currentView === "login") {
    return (
      <Login
        onLoginSuccess={(user) => {
          setLoggedInUser(user);
          localStorage.setItem("stepup_logged_in_user", user);
          setCurrentView("app");
        }}
        onNavigateToHome={() => setCurrentView("home")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 pb-16 bg-[#f4f4f5]" id="stepup-math-app">
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Clean Minimalism Logo style from the spec */}
            <div className="flex flex-col cursor-pointer" onClick={() => setCurrentView("home")}>
              <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                StepUp Study
              </span>
              <h1 className="text-sm font-black text-slate-900 leading-none">
                Math Generator Engine
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsPlacementTestActive(!isPlacementTestActive);
                setActiveWorksheet(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition border ${
                isPlacementTestActive
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Tes Penempatan Level
            </button>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              Belajar Mandiri
            </span>

            {/* User Session Info & Log Out */}
            {loggedInUser && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-slate-100 rounded-lg">
                  👤 {loggedInUser}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem("stepup_logged_in_user");
                    setLoggedInUser(null);
                    setCurrentView("home");
                  }}
                  className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all cursor-pointer"
                  id="btn-logout"
                  title="Keluar dari akun belajar"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* STATS HUD DASHBOARD BAR (Print-Hidden) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 print:hidden" id="stats-hud">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Lembar Selesai
              </span>
              <span className="text-2xl font-black text-slate-800 font-mono">{totalSolved}</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rata-rata Skor Siswa
              </span>
              <span className="text-2xl font-black text-slate-800 font-mono">{averageScore}%</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Waktu Belajar
              </span>
              <span className="text-2xl font-black text-slate-800 font-mono">{totalStudyTimeMinutes} <span className="text-xs font-bold text-slate-400">menit</span></span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-8 flex items-start gap-3 print:hidden animate-fade-in" id="error-banner">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 text-sm">Gagal Menghasilkan Lembar Kerja</h4>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                Detail: {errorMsg}. Mohon periksa kembali API Key Anda di panel Secrets atau coba topik lainnya.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR COLUMN: GENERATOR & HISTORY LIST */}
          <div className="lg:col-span-4 space-y-8 print:hidden" id="left-workspace-column">
            {/* 1. Worksheet Generator Panel */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                1. Pengaturan Soal
              </h3>
              <WorksheetGenerator
                onGenerate={handleGenerateWorksheet}
                isLoading={isLoading}
                selectedLevelFromExplorer={selectedLevelFromExplorer}
                selectedTopicFromExplorer={selectedTopicFromExplorer}
                clearExplorerSelection={() => {
                  setSelectedLevelFromExplorer(null);
                  setSelectedTopicFromExplorer(null);
                }}
              />
            </div>

            {/* 2. History Tracker List */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-600" />
                Progres & Riwayat
              </h3>
              <WorksheetHistoryList
                history={history}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
                onDeleteHistoryItem={handleDeleteHistoryItem}
              />
            </div>
          </div>

          {/* RIGHT VIEW COLUMN: WORKSHEET VIEWER, PLACEMENT TEST OR CURRICULUM EXPLORER */}
          <div className="lg:col-span-8 space-y-8" id="right-workspace-column">
            {isPlacementTestActive ? (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 print:hidden">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Tes Penempatan Level Aktif
                </h3>
                <PlacementTest
                  onSelectLevelTopic={handleSelectFromPlacementTest}
                  onClose={() => setIsPlacementTestActive(false)}
                />
              </div>
            ) : activeWorksheet ? (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 print:hidden">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Lembar Kerja Aktif
                </h3>
                <WorksheetViewer
                  worksheet={activeWorksheet}
                  onSaveToHistory={handleSaveToHistory}
                  onClose={() => setActiveWorksheet(null)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Introduction Banner if no active sheet */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm print:hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      ✍️
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Mulai Belajar Mandiri Sekarang!</h2>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Pilihlah tingkat kurikulum di bawah ini, atau gunakan panel kiri untuk merancang lembar kerja matematika 
                    yang disesuaikan secara instan. Setiap lembar kerja dirancang menggunakan prinsip **Small Steps** agar siswa dapat 
                    memahami konsep dengan mudah tanpa bimbingan intensif.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsPlacementTestActive(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      id="banner-btn-placement-test"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      🎯 Ikuti Tes Penempatan Level
                    </button>
                    <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-lg w-fit">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Atau silakan klik "Buat Soal" pada tabel kurikulum di bawah!
                    </div>
                  </div>
                </div>

                {/* Level Explorer Table */}
                <div className="print:hidden">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    2. Peta Kurikulum & Topik Referensi
                  </h3>
                  <LevelExplorer onSelectTopic={handleSelectTopicFromExplorer} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Standard Applet Footer */}
      <footer className="mt-auto pt-12 pb-6 text-center text-xs text-slate-400 print:hidden border-t border-slate-200 max-w-7xl mx-auto w-full">
        <p className="font-semibold text-slate-500 mb-1">
          StepUp Math Problem Generator Engine
        </p>
        <p className="leading-relaxed mb-1">
          Dirancang secara khusus dengan mengutamakan metodologi Kemandirian, Scaffolding Berbimbing, dan Small Steps.
          <br />
          Ditenagai oleh Gemini 3.5 Flash server-side AI.
        </p>
        <p className="font-semibold text-slate-500 mt-2">
          @Copyright by. Pak GuruAI
        </p>
      </footer>
    </div>
  );
}
