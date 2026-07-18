import { WorksheetHistory } from "../types";
import { History, Clock, Award, Trash2, Calendar, ChevronRight, FileText } from "lucide-react";

interface WorksheetHistoryListProps {
  history: WorksheetHistory[];
  onSelectHistory: (item: WorksheetHistory) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export default function WorksheetHistoryList({
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteHistoryItem,
}: WorksheetHistoryListProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 70) return "bg-blue-50 text-blue-700 border-blue-200";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="worksheet-history-list">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
            <History className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Riwayat Belajar Siswa</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Pantau skor pengerjaan dan efisiensi waktu.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
            id="btn-clear-all-history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        )}
      </div>

      {/* History List */}
      <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto" id="history-items-container">
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center" id="history-empty">
            <FileText className="w-10 h-10 text-slate-200 mb-2" />
            <p className="text-xs font-semibold text-slate-600">Belum ada riwayat pengerjaan.</p>
            <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-relaxed">
              Selesaikan lembar kerja di tab pengerjaan untuk merekam progres belajar Anda.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              id={`history-row-${item.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9px] font-bold font-mono">
                    Level {item.worksheet.level}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 truncate max-w-xs md:max-w-md">
                    {item.worksheet.topic}
                  </h4>
                </div>

                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatTime(item.timeSpentSeconds)} (Target: {item.worksheet.sctMinutes}m)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(item.completedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Score badge */}
                <div
                  className={`px-2.5 py-1 text-xs font-extrabold border rounded-lg flex items-center gap-1 font-mono ${getScoreBadgeClass(
                    item.score
                  )}`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {item.score}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectHistory(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Buka Lembar Kerja"
                    id={`btn-open-history-${item.id}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                    id={`btn-delete-history-${item.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
