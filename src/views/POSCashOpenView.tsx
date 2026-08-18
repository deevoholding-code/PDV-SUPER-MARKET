import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Archive, DollarSign, Check, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { sound } from '../services/soundService';

export const POSCashOpenView: React.FC = () => {
  const { currentSession, openCashSession, currentUser, currentStore, registerNumber, navigate } = usePOS();
  const [openingAmount, setOpeningAmount] = useState<string>('150.00');
  const [notes, setNotes] = useState<string>('Fundo de troco inicial conferido.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(openingAmount.replace(',', '.') || '0');
    if (val < 0) {
      alert('O valor de abertura não pode ser negativo.');
      return;
    }

    openCashSession(val, notes);
    sound.playSuccess();
    navigate('/pos');
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto flex items-center justify-center select-none">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Abertura de Caixa</h2>
            <p className="text-xs text-slate-500 font-medium">
              Terminal {registerNumber} • {currentStore?.name}
            </p>
          </div>
        </div>

        {/* Current status warning if already opened */}
        {currentSession && currentSession.status === 'OPEN' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Atenção:</strong> O caixa já se encontra aberto desde{' '}
              {new Date(currentSession.openedAt).toLocaleTimeString('pt-BR')} com fundo de R${' '}
              {currentSession.openingAmount.toFixed(2)}. Deseja prosseguir para as vendas?
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operador Responsável
            </label>
            <input
              type="text"
              readOnly
              value={currentUser?.name || 'Operador'}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fundo de Troco Inicial (R$) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                placeholder="Ex: 150.00"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-mono font-black text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                autoFocus
              />
              <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['100.00', '150.00', '200.00', '300.00'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setOpeningAmount(preset)}
                className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                  openingAmount === preset
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                R$ {preset}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações / Malote
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite observações sobre o fundo de troco..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/pos')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition active:scale-98"
            >
              <Check className="w-5 h-5" />
              CONFIRMAR ABERTURA DE CAIXA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
