import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Archive,
  DollarSign,
  QrCode,
  CreditCard,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { sound } from '../services/soundService';

export const POSCashCloseView: React.FC = () => {
  const {
    currentSession,
    closeCashSession,
    currentUser,
    currentStore,
    registerNumber,
    navigate,
  } = usePOS();

  const [countedCash, setCountedCash] = useState<string>('');
  const [closureNotes, setClosureNotes] = useState<string>('');
  const [closedSummary, setClosedSummary] = useState<any | null>(null);

  if (!currentSession) {
    return (
      <div className="flex-1 bg-slate-100 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Nenhum Caixa Aberto</h3>
          <p className="text-xs text-slate-500">
            Não há sessão de caixa ativa no momento para realizar o fechamento.
          </p>
          <button
            onClick={() => navigate('/pos/caixa/abertura')}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Abrir Caixa
          </button>
        </div>
      </div>
    );
  }

  // Calculate theoretical expected cash
  const initialCash = currentSession.openingAmount;
  const cashSales = currentSession.totalByPaymentMethod['DINHEIRO'] || 0;
  const suprimentos = currentSession.movements
    .filter((m) => m.type === 'SUPRIMENTO')
    .reduce((acc, m) => acc + m.amount, 0);
  const sangrias = currentSession.movements
    .filter((m) => m.type === 'SANGRIA')
    .reduce((acc, m) => acc + m.amount, 0);

  const expectedCashInDrawer = initialCash + cashSales + suprimentos - sangrias;
  const parsedCounted = parseFloat(countedCash.replace(',', '.') || '0');
  const difference = parsedCounted - expectedCashInDrawer;

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countedCash) {
      alert('Por favor, informe o valor contado em dinheiro na gaveta.');
      return;
    }

    const summary = closeCashSession(parsedCounted, closureNotes);
    setClosedSummary(summary);
    sound.playSuccess();
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto flex items-center justify-center select-none">
      <div className="max-w-4xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Fechamento de Caixa / Redução Z</h2>
              <p className="text-xs text-slate-500 font-medium">
                Terminal {registerNumber} • Operador: {currentUser?.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao PDV
          </button>
        </div>

        {closedSummary ? (
          /* Closure Final Confirmation Receipt */
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Caixa Encerrado com Sucesso!</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Relatório de Fechamento e Redução Z emitidos fiscalmente.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Vendas Totais:</span>
                <span className="font-bold">R$ {closedSummary.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo Esperado (Gaveta):</span>
                <span>R$ {closedSummary.expectedBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo Contado (Operador):</span>
                <span>R$ {closedSummary.closingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
                <span>Diferença / Divergência:</span>
                <span
                  className={
                    closedSummary.difference === 0
                      ? 'text-emerald-600'
                      : closedSummary.difference > 0
                      ? 'text-blue-600'
                      : 'text-rose-600'
                  }
                >
                  {closedSummary.difference > 0 ? '+ ' : ''}
                  R$ {closedSummary.difference.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Redução Z
              </button>
              <button
                type="button"
                onClick={() => navigate('/pos/login')}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Retornar ao Login
              </button>
            </div>
          </div>
        ) : (
          /* Closure Form & Balances Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Financial Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Movimentação do Turno
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Fundo Inicial</div>
                  <div className="text-lg font-black font-mono text-slate-900 mt-1">
                    R$ {initialCash.toFixed(2)}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Geral de Vendas</div>
                  <div className="text-lg font-black font-mono text-blue-700 mt-1">
                    R$ {currentSession.totalSales.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* By Payment Method */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-slate-700 mb-2">Vendas por Forma de Pagamento:</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Dinheiro em Espécie:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      R$ {cashSales.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-sky-600" /> Pix Instantâneo:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      R$ {(currentSession.totalByPaymentMethod['PIX'] || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Cartão de Débito:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      R$ {(currentSession.totalByPaymentMethod['DEBITO'] || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Cartão de Crédito:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      R$ {(currentSession.totalByPaymentMethod['CREDITO'] || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sangrias & Suprimentos */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                  <span className="font-bold text-emerald-900">Suprimentos / Entradas:</span>
                  <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
                    + R$ {suprimentos.toFixed(2)}
                  </div>
                </div>
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
                  <span className="font-bold text-rose-900">Sangrias / Retiradas:</span>
                  <div className="text-base font-black text-rose-700 font-mono mt-0.5">
                    - R$ {sangrias.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Cash Reconciliation Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Conferência Cega do Caixa</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Conte o dinheiro físico presente na gaveta e digite o total.
                </p>
              </div>

              <form onSubmit={handleCloseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valor Físico Contado na Gaveta (R$) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={countedCash}
                      onChange={(e) => setCountedCash(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-2xl font-mono font-black text-slate-900 focus:border-rose-600 focus:outline-none"
                      autoFocus
                    />
                    <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Live Difference Indicator */}
                {countedCash && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                      difference === 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : difference > 0
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <span>
                      {difference === 0 ? 'Caixa Exato' : difference > 0 ? 'Sobra de Caixa' : 'Falta de Caixa'}:
                    </span>
                    <span className="font-mono text-sm">
                      {difference > 0 ? '+ ' : ''}
                      R$ {difference.toFixed(2)}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Justificativa / Observação do Fechamento
                  </label>
                  <textarea
                    rows={2}
                    value={closureNotes}
                    onChange={(e) => setClosureNotes(e.target.value)}
                    placeholder="Ex: Turno finalizado sem ocorrências."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition active:scale-98"
                >
                  <Archive className="w-5 h-5" />
                  CONFIRMAR E ENCERRAR CAIXA
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
