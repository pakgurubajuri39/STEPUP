import { useState } from "react";
import { KUMON_CURRICULUM } from "../curriculum";
import { CurriculumLevel, CurriculumTopic } from "../types";
import { BookOpen, ChevronDown, ChevronUp, Play, Award, HelpCircle } from "lucide-react";

interface LevelExplorerProps {
  onSelectTopic: (level: CurriculumLevel, topic: CurriculumTopic) => void;
}

export default function LevelExplorer({ onSelectTopic }: LevelExplorerProps) {
  const [expandedLevel, setExpandedLevel] = useState<string | null>("G"); // Default to Level G (Algebra) for visual richness
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLevels = KUMON_CURRICULUM.filter((level) => {
    const matchesSearch =
      level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      level.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      level.topics.some(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const toggleLevel = (levelId: string) => {
    setExpandedLevel(expandedLevel === levelId ? null : levelId);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Arithmetic":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Algebra":
        return "bg-slate-50 text-slate-800 border-slate-300";
      case "Advanced":
        return "bg-slate-900 text-white border-slate-900";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="level-explorer">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" id="book-open-icon" />
          </div>
          <h2 className="text-xl font-bold text-slate-800" id="explorer-title">
            Peta Kurikulum Matematika StepUp Math
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4" id="explorer-subtitle">
          Telusuri seluruh tingkatan (Level 6A s.d XS) untuk melihat cakupan materi dan contoh soal standar StepUp Math.
        </p>

        {/* Search */}
        <input
          type="text"
          id="curriculum-search"
          placeholder="Cari materi, level, atau topik (misal: Pecahan, Aljabar, J...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Levels List */}
      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto" id="levels-list-container">
        {filteredLevels.length === 0 ? (
          <div className="p-12 text-center text-slate-400" id="empty-search">
            Tidak menemukan tingkat kurikulum yang cocok dengan pencarian Anda.
          </div>
        ) : (
          filteredLevels.map((level) => {
            const isExpanded = expandedLevel === level.id;
            return (
              <div key={level.id} className="transition-all" id={`level-card-${level.id}`}>
                {/* Level Row Header */}
                <button
                  onClick={() => toggleLevel(level.id)}
                  className={`w-full flex items-center justify-between p-5 hover:bg-slate-50/50 text-left transition-colors ${
                    isExpanded ? "bg-slate-50/30" : ""
                  }`}
                  id={`btn-toggle-level-${level.id}`}
                >
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    <span className="text-lg font-extrabold text-slate-800 font-mono tracking-tight min-w-[50px]">
                      {level.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{level.name}</span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium border rounded-full ${getCategoryBadgeColor(
                          level.category
                        )}`}
                      >
                        {level.category === "Arithmetic"
                          ? "Aritmatika Dasar"
                          : level.category === "Algebra"
                          ? "Aljabar & Fungsi"
                          : "Tingkat Lanjut"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline text-xs text-slate-400 font-medium">
                      {level.topics.length} Materi
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Topics Panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 bg-slate-50/30 border-t border-slate-100/50" id={`topics-panel-${level.id}`}>
                    <div className="mb-4 text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                      <strong className="text-slate-700">Fokus Level:</strong> {level.description}
                    </div>

                    <div className="space-y-3" id="topics-list">
                      {level.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          id={`topic-item-${topic.id}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                              {topic.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {topic.description}
                            </p>

                            {/* Examples */}
                            {topic.examples && topic.examples.length > 0 && (
                              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  Contoh Soal
                                </span>
                                {topic.examples.map((ex, i) => (
                                  <code
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-mono text-slate-600"
                                  >
                                    {ex}
                                  </code>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => onSelectTopic(level, topic)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer"
                            id={`btn-select-topic-${topic.id}`}
                          >
                            <Play className="w-3.5 h-3.5" />
                            Buat Soal
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info card */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-start gap-3 text-xs text-slate-500">
        <Award className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-slate-700">Tips Belajar Mandiri:</span> Di StepUp Math, siswa belajar secara
          mandiri mulai dari level yang mudah. Jika Anda kesulitan pada suatu level aljabar, cobalah kembali ke satu level
          sebelumnya (misal dari Level I ke Level H) untuk mematangkan dasar perhitungan.
        </div>
      </div>
    </div>
  );
}
