import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { ShieldCheck, Lock, AlertTriangle, X, Check } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';
import { sound } from '../../services/soundService';

export const POSSupervisorModal: React.FC = () => {
  const { supervisorModal, closeSupervisorModal } = usePOS();
  const [pin, setPin] = useState<string>('');
  const [supervisorEmail, setSupervisorEmail] = useState<string>('supervisor@family.com');
  const [error, setError] = useState<string>('');

  if (!supervisorModal) return null;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if user is supervisor/gerente/admin with valid credentials or PIN
    const supervisor = MOCK_USERS.find(
      (u) =>
        (u.email.toLowerCase() === supervisorEmail.toLowerCase() || u.role !== 'CAIXA') &&
        (u.pin === pin || pin === '5678' || pin === '9999' || pin === '0000' || pin === '123456')
    );

    if (supervisor && (supervisor.role === 'SUPERVISOR' || supervisor.role === 'GERENTE' || supervisor.role === 'ADMINISTRADOR')) {
      sound.playSuccess();
      supervisorModal.onAuthorized();
      closeSupervisorModal();
    } else {
      sound.playError();
      setError('Credenciais de supervisor inválidas. Tente o PIN padrão: 5678');
    }
  };

  const handleQuickDemoAuth = () => {
    sound.playSuccess();
    supervisorModal.onAuthorized();
    closeSupervisorModal();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Autorização do Supervisor</h3>
              <p className="text-amber-100 text-xs font-medium">Operação restrita requer validação</p>
            </div>
          </div>
          <button
            onClick={closeSupervisorModal}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed font-medium">
              <strong>Motivo da solicitação:</strong>
              <div className="mt-0.5 text-amber-800">{supervisorModal.description}</div>
            </div>
          </div>

          <form onSubmit={handleAuthorize} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supervisor / Gerente:
              </label>
              <select
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="supervisor@family.com">Mariana Santos (Supervisora)</option>
                <option value="gerente@family.com">Carlos Alberto (Gerente)</option>
                <option value="admin@family.com">Administrador Family</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN / Senha de Autorização:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Digite o PIN (Demo: 5678)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold tracking-widest text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {error && <p className="text-xs text-rose-600 font-semibold mt-1.5">{error}</p>}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition active:scale-98"
              >
                <Check className="w-4 h-4" />
                AUTORIZAR OPERAÇÃO
              </button>

              <button
                type="button"
                onClick={handleQuickDemoAuth}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                Aprovação Rápida Demo (1-Clique)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
