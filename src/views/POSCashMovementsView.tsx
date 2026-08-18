import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  DollarSign,
  Plus,
  Minus,
  Archive,
  ArrowLeft,
  Check,
  Clock,
  User,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { CashMovementType } from '../types/pos';
import { sound } from '../services/soundService';

interface Props {
  initialType?: CashMovementType;
}

export const POSCashMovementsView: React.FC<Props> = ({ initialType = 'SANGRIA' }) => {
  const { currentSession, addCashMovement, currentUser, registerNumber, navigate } = usePOS();

  const [type, setType] = useState<CashMovementType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('Recolhimento para cofre / transporte de valores');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const currentMovements = currentSession?.movements || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.') || '0');
    if (val <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }

    addCashMovement(type, val, reason);
    setAmount('');
    sound.playSuccess();
    setSuccessMsg(
      `${type === 'SANGRIA' ? 'Sangria' : 'Suprimento'} de R$ ${val.toFixed(2)} registrado com sucesso!`
    );

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR AO PDV (ESC)
          </button>

          <div className="text-right text-xs">
            <span className="text-slate-500">Caixa: </span>
            <span className="font-bold text-slate-800">{registerNumber}</span>
          </div>
        </div>

        {/* Form and History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Movement Registration Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-900">Movimentação de Caixa</h2>
              <p className="text-xs text-slate-500 font-medium">
                Entrada e saída manual de numerário
              </p>
            </div>

            {/* Type selector toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setType('SANGRIA')}
                className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  type === 'SANGRIA'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Minus className="w-4 h-4" /> Sangria (Retirada)
              </button>

              <button
                type="button"
                onClick={() => setType('SUPRIMENTO')}
                className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  type === 'SUPRIMENTO'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" /> Suprimento (Entrada)
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor da Operação (R$) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-mono font-black text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    autoFocus
                  />
                  <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {['50.00', '100.00', '200.00', '500.00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    R$ {preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo / Finalidade *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                >
                  {type === 'SANGRIA' ? (
                    <>
                      <option value="Recolhimento para cofre / transporte de valores">
                        Recolhimento para cofre / transporte de valores
                      </option>
                      <option value="Excesso de numerário em gaveta">
                        Excesso de numerário em gaveta
                      </option>
                      <option value="Pagamento de despesa urgente / frete">
                        Pagamento de despesa urgente / frete
                      </option>
                      <option value="Troca de turno operacional">Troca de turno operacional</option>
                    </>
                  ) : (
                    <>
                      <option value="Reforço de troco / moedas">Reforço de troco / moedas</option>
                      <option value="Aporte adicional de notas miúdas">
                        Aporte adicional de notas miúdas
                      </option>
                      <option value="Outros aportes autorizados">Outros aportes autorizados</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-98 ${
                  type === 'SANGRIA'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                }`}
              >
                <Check className="w-5 h-5" />
                CONFIRMAR {type}
              </button>
            </form>
          </div>

          {/* Movement History Log Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Histórico de Movimentações Deste Turno
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {currentMovements.length} registro(s)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 space-y-1">
              {currentMovements.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
                  <FileText className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">Nenhuma sangria ou suprimento registrado nesta sessão.</p>
                </div>
              ) : (
                currentMovements.map((mov) => {
                  const isSangria = mov.type === 'SANGRIA';
                  return (
                    <div
                      key={mov.id}
                      className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                            isSangria
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isSangria ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800">
                            {mov.type} • {mov.reason}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {mov.timestamp} • Operador: {mov.operatorName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-mono font-black text-sm ${
                            isSangria ? 'text-purple-700' : 'text-emerald-700'
                          }`}
                        >
                          {isSangria ? '- ' : '+ '}
                          R$ {mov.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
