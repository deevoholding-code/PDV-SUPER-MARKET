import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Store,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Fingerprint,
  MessageCircle,
  ShieldCheck,
  Gauge,
  BarChart3,
  ReceiptText,
  ChevronDown,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { FamilyLogo } from '../components/common/FamilyLogo';
import { MOCK_USERS, MOCK_STORES } from '../data/mockData';
import { sound } from '../services/soundService';

export const POSLoginView: React.FC = () => {
  const { login } = usePOS();

  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-01');
  const [selectedRegister, setSelectedRegister] = useState<string>('001');
  const [email, setEmail] = useState<string>('caixa@family.com');
  const [password, setPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [quickAccessOpen, setQuickAccessOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (foundUser) {
      sound.playBeep();
      login(foundUser, selectedStoreId, selectedRegister);
    } else {
      sound.playError();
      setError('Credenciais inválidas. Utilize o login de demonstração: caixa@family.com (Senha: 123456)');
    }
  };

  const handleQuickLogin = (userIndex: number) => {
    const user = MOCK_USERS[userIndex];
    if (user) {
      setEmail(user.email);
      setPassword('123456');
      sound.playBeep();
      login(user, selectedStoreId, selectedRegister);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none">
      {/* Top Bar with Store Selection */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex justify-end">
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <Store className="w-4 h-4 text-blue-700" />
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer tracking-wider uppercase"
          >
            {MOCK_STORES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Main Container reproducing Image 3 */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero Card - Deep Royal Blue branding */}
          <div className="lg:col-span-6 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[580px]">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              {/* Official Family Logo (White Version) */}
              <div className="mb-2">
                <FamilyLogo variant="white" size="lg" />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Acesso do <span className="text-amber-400">PDV</span>
                </h1>
                <p className="text-lg font-bold text-blue-200 mt-1">
                  Sistema de Ponto de Venda
                </p>
                <p className="text-xs sm:text-sm text-blue-100/80 font-medium mt-1">
                  Agilidade, praticidade e controle para o seu atendimento.
                </p>
              </div>

              {/* Graphic Terminal & Barcode Scanner Mockup */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="relative bg-slate-900/60 rounded-2xl p-4 border border-white/10 shadow-inner flex items-center gap-4 max-w-sm w-full">
                  <div className="w-20 h-16 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-1.5 shadow-md shrink-0">
                    <div className="w-full h-8 bg-blue-600/30 rounded flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1">R$ 75,40</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="text-[11px] font-black text-white">Terminal Caixa 001</div>
                    <div className="text-[10px] text-blue-200">Leitor Óptico Conectado</div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-400/30">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Pronto para Venda
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Feature Icons from Image 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-center">
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">Atendimento rápido e eficiente</span>
              </div>

              <div className="space-y-1 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">Operações seguras</span>
              </div>

              <div className="space-y-1 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">Controle total de vendas</span>
              </div>

              <div className="space-y-1 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">Relatórios em tempo real</span>
              </div>
            </div>
          </div>

          {/* Right Card - Form matching Image 3 */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl flex flex-col justify-between min-h-[580px]">
            <div>
              {/* Cash Register Icon in Circle */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner border border-blue-100">
                  <svg
                    className="w-9 h-9 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v3h16V5H4zm0 5v9h16v-9H4zm2 2h3v2H6v-2zm5 0h3v2h-3v-2zm5 0h2v2h-2v-2zm-10 4h3v2H6v-2zm5 0h3v2h-3v-2zm5 0h2v2h-2v-2z" />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-1 mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Entrar no PDV
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Digite suas credenciais para acessar o sistema
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Usuário ou E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu usuário ou e-mail"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>Lembrar acesso neste dispositivo</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Para a versão de demonstração, utilize a senha padrão: 123456')}
                    className="text-blue-700 font-bold hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Big Blue Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-600 active:scale-98 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ENTRAR NO PDV</span>
                </button>
              </form>

              {/* OU Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400 font-bold uppercase text-[10px]">
                    ou
                  </span>
                </div>
              </div>

              {/* Quick Access Button */}
              <button
                type="button"
                onClick={() => setQuickAccessOpen(!quickAccessOpen)}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4 text-blue-700" />
                <span>ACESSO RÁPIDO (F1)</span>
              </button>

              {/* Quick Access User List Dropdown */}
              {quickAccessOpen && (
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Selecione um operador de demonstração:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOCK_USERS.map((user, idx) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleQuickLogin(idx)}
                        className="text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition"
                      >
                        <div className="text-xs font-bold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-500">{user.role} • PIN {user.pin}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Support Card from Image 3 */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Precisa de ajuda?</div>
                  <div className="text-[11px] text-slate-500">Entre em contato com o suporte.</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Suporte Técnico Family Supermarket disponível 24/7 pelo WhatsApp: (11) 98765-4321')}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-black transition flex items-center gap-1 shadow-2xs"
              >
                <span>SUPORTE</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer from Image 3 */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sistema seguro e monitorado</span>
        </div>

        <div className="font-semibold text-slate-700">
          Desenvolvido por <strong className="text-slate-900 font-bold">Vini Amaral</strong>
        </div>

        <div className="text-slate-500">
          Licenciado por <strong>Family Supermarket LTDA</strong>
        </div>
      </footer>
    </div>
  );
};
