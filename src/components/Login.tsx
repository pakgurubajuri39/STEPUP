import { useState, FormEvent } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
  onNavigateToHome: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToHome }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError("Silakan isi semua kolom username dan password!");
      return;
    }

    // Validating credentials
    // 1. username: lelak, password: stepupmath
    // 2. username: admin, password: bajuri39
    if (
      (cleanUsername === "lelak" && cleanPassword === "stepupmath") ||
      (cleanUsername === "admin" && cleanPassword === "bajuri39")
    ) {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(cleanUsername);
      }, 800);
    } else {
      setError("Username atau password salah! Silakan periksa kembali kredensial Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" id="login-page">
      {/* Back button link */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onNavigateToHome}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer shadow-sm"
          id="btn-back-to-home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Beranda
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="inline-flex p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Masuk ke Akun Belajar
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Gunakan kredensial kelas StepUp Study Anda untuk mengakses aplikasi
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-100 rounded-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn" id="login-error-alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p className="leading-relaxed font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn" id="login-success-alert">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <p className="leading-relaxed font-bold">Autentikasi Berhasil! Mengalihkan ke dashboard...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={success}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={success}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={success}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={success}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                success
                  ? "bg-emerald-600 shadow-emerald-500/10"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/15 active:scale-[0.98]"
              }`}
              id="btn-submit-login"
            >
              {success ? "Masuk..." : "Masuk Kelas"}
            </button>
          </form>

          {/* Prompt displaying hints about credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Akses Akun:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-700">Akun Siswa:</p>
                <p>U: <code className="font-mono text-blue-600 bg-blue-50 px-1 rounded">lelak</code></p>
                <p>P: <code className="font-mono text-blue-600 bg-blue-50 px-1 rounded">stepupmath</code></p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-700">Akun Admin:</p>
                <p>U: <code className="font-mono text-blue-600 bg-blue-50 px-1 rounded">admin</code></p>
                <p>P: <code className="font-mono text-blue-600 bg-blue-50 px-1 rounded">bajuri39</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
