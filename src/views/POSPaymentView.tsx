import React, { useState, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import {
  DollarSign,
  QrCode,
  CreditCard,
  Utensils,
  Layers,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { PaymentMethod, PaymentRecord } from '../types/pos';
import { sound } from '../services/soundService';

export const POSPaymentView: React.FC = () => {
  const {
    subtotal,
    discountTotal,
    total,
    cartItems,
    completeSale,
    navigate,
    currentCustomer,
  } = usePOS();

  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('DINHEIRO');

  // Cash state
  const [cashReceived, setCashReceived] = useState<number>(total);
  const [customCashInput, setCustomCashInput] = useState<string>(total.toFixed(2));

  // Pix state
  const [pixStatus, setPixStatus] = useState<'IDLE' | 'WAITING' | 'APPROVED'>('WAITING');

  // Card state
  const [cardType, setCardType] = useState<'DEBITO' | 'CREDITO'>('DEBITO');
  const [cardBrand, setCardBrand] = useState<string>('Mastercard');
  const [installments, setInstallments] = useState<number>(1);
  const [cardStatus, setCardStatus] = useState<'IDLE' | 'PROCESSING' | 'APPROVED'>('IDLE');

  // Split / Multi-payment state
  const [partialPayments, setPartialPayments] = useState<PaymentRecord[]>([]);
  const [partialAmount, setPartialAmount] = useState<string>('');

  // Calculate remaining balance in split mode
  const paidSoFar = partialPayments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = Math.max(0, total - paidSoFar);

  // Auto calculate change
  const cashChange = Math.max(0, cashReceived - total);
  const isCashSufficient = cashReceived >= total;

  useEffect(() => {
    // If entered Pix mode, simulate instant QR payment detection after 3 seconds
    if (activeMethod === 'PIX') {
      setPixStatus('WAITING');
      const timer = setTimeout(() => {
        setPixStatus('APPROVED');
        sound.playSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeMethod]);

  const handleCashTender = (val: number) => {
    setCashReceived(val);
    setCustomCashInput(val.toFixed(2));
  };

  const handleCustomCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    setCustomCashInput(raw);
    const parsed = parseFloat(raw || '0');
    setCashReceived(isNaN(parsed) ? 0 : parsed);
  };

  const handleProcessCard = () => {
    setCardStatus('PROCESSING');
    sound.playBarcodeBeep();
    setTimeout(() => {
      setCardStatus('APPROVED');
      sound.playSuccess();
    }, 2000);
  };

  const handleAddPartialPayment = (method: PaymentMethod) => {
    const amt = parseFloat(partialAmount.replace(',', '.') || '0');
    if (amt <= 0 || amt > remainingBalance) {
      sound.playError();
      alert(`Valor inválido. Saldo restante: R$ ${remainingBalance.toFixed(2)}`);
      return;
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      method,
      amount: amt,
      status: 'APPROVED',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setPartialPayments((prev) => [...prev, newPayment]);
    setPartialAmount('');
    sound.playSuccess();
  };

  const handleFinalizeSale = () => {
    if (activeMethod === 'DINHEIRO') {
      if (!isCashSufficient) {
        sound.playError();
        alert('O valor recebido em dinheiro é inferior ao total da venda.');
        return;
      }

      const payments: PaymentRecord[] = [
        {
          id: 'pay-' + Date.now(),
          method: 'DINHEIRO',
          amount: cashReceived,
          receivedAmount: cashReceived,
          change: cashChange,
          status: 'APPROVED',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ];

      completeSale(payments, cashChange);
      navigate('/pos/venda/concluida');
    } else if (activeMethod === 'PIX') {
      const payments: PaymentRecord[] = [
        {
          id: 'pay-' + Date.now(),
          method: 'PIX',
          amount: total,
          pixTransactionId: 'PIX-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          status: 'APPROVED',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      completeSale(payments, 0);
      navigate('/pos/venda/concluida');
    } else if (activeMethod === 'DEBITO' || activeMethod === 'CREDITO') {
      const payments: PaymentRecord[] = [
        {
          id: 'pay-' + Date.now(),
          method: activeMethod,
          amount: total,
          cardBrand,
          installments: activeMethod === 'CREDITO' ? installments : 1,
          authorizationCode: 'AUT-' + Math.floor(100000 + Math.random() * 900000),
          status: 'APPROVED',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      completeSale(payments, 0);
      navigate('/pos/venda/concluida');
    } else if (activeMethod === 'MISTO') {
      if (remainingBalance > 0.01) {
        sound.playError();
        alert(`Ainda resta um saldo pendente de R$ ${remainingBalance.toFixed(2)}.`);
        return;
      }
      completeSale(partialPayments, 0);
      navigate('/pos/venda/concluida');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 p-4 select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-4">
        {/* Back and Title */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/pos/venda/novo')}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR AOS ITENS (ESC)
          </button>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Cliente: </span>
            <span className="text-xs font-bold text-slate-800">
              {currentCustomer ? currentCustomer.name : 'Consumidor Final'}
            </span>
          </div>
        </div>

        {/* Main Grid: Summary & Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Left Column: Totals & Method Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Amount Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resumo dos Valores
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} itens)</span>
                  <span className="font-mono font-bold text-slate-800">R$ {subtotal.toFixed(2)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Descontos</span>
                    <span className="font-mono font-bold">- R$ {discountTotal.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">Total a Pagar</span>
                <span className="text-3xl font-black text-blue-700 font-mono">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Forma de Pagamento
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Dinheiro */}
                <button
                  type="button"
                  onClick={() => setActiveMethod('DINHEIRO')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    activeMethod === 'DINHEIRO'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">Dinheiro</div>
                    <div className="text-[10px] text-slate-500">Cálculo de troco</div>
                  </div>
                </button>

                {/* Pix */}
                <button
                  type="button"
                  onClick={() => setActiveMethod('PIX')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    activeMethod === 'PIX'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">Pix Instantâneo</div>
                    <div className="text-[10px] text-slate-500">QR Code dinâmico</div>
                  </div>
                </button>

                {/* Débito */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('DEBITO');
                    setCardType('DEBITO');
                    setCardStatus('IDLE');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    activeMethod === 'DEBITO'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">Cartão Débito</div>
                    <div className="text-[10px] text-slate-500">Aproximação / Chip</div>
                  </div>
                </button>

                {/* Crédito */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('CREDITO');
                    setCardType('CREDITO');
                    setCardStatus('IDLE');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    activeMethod === 'CREDITO'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">Cartão Crédito</div>
                    <div className="text-[10px] text-slate-500">Parcelamento</div>
                  </div>
                </button>
              </div>

              {/* Multi-tender option */}
              <button
                type="button"
                onClick={() => setActiveMethod('MISTO')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition mt-2 ${
                  activeMethod === 'MISTO'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm">Pagamento Misto / Dividido</div>
                  <div className="text-[10px] text-slate-500">Ex: R$ 20 Pix + R$ 30 Cartão</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Active Payment Method Interactive Box (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            {/* DINHEIRO VIEW */}
            {activeMethod === 'DINHEIRO' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pagamento em Dinheiro</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Informe o valor recebido pelo cliente para calcular o troco exato.
                  </p>
                </div>

                {/* Quick Cash Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">
                    Notas Rápidas:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'Exato', val: total },
                      { label: 'R$ 10', val: 10 },
                      { label: 'R$ 20', val: 20 },
                      { label: 'R$ 50', val: 50 },
                      { label: 'R$ 100', val: 100 },
                      { label: 'R$ 200', val: 200 },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCashTender(btn.val)}
                        className={`py-2 px-1 rounded-xl text-xs font-black border transition ${
                          cashReceived === btn.val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Received & Change Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Valor Recebido (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={customCashInput}
                      onChange={handleCustomCashChange}
                      className="w-full text-2xl font-black font-mono text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div
                    className={`rounded-2xl p-4 border ${
                      isCashSufficient
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider mb-1">
                      {isCashSufficient ? 'Troco a Devolver' : 'Valor Insuficiente'}
                    </div>
                    <div className="text-3xl font-black font-mono">
                      R$ {cashChange.toFixed(2)}
                    </div>
                    {!isCashSufficient && (
                      <div className="text-xs text-rose-600 font-semibold mt-1">
                        Falta receber R$ {(total - cashReceived).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PIX VIEW */}
            {activeMethod === 'PIX' && (
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pagamento via Pix</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Apresente o QR Code ao cliente para leitura no aplicativo do banco
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-sky-300 rounded-3xl max-w-xs mx-auto">
                  {/* Mock QR Code Visual */}
                  <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center relative">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020126580014BR.GOV.BCB.PIX0136family-pos-pix-key520400005303986540550.005802BR5925FAMILY+SUPERMARKET+LTDA6009SAO+PAULO62070503***6304"
                      alt="QR Code Pix"
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  <div className="mt-4 font-mono font-bold text-sm text-slate-700">
                    Valor: R$ {total.toFixed(2)}
                  </div>

                  {pixStatus === 'WAITING' ? (
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1.5 rounded-full animate-pulse">
                      <Clock className="w-4 h-4 animate-spin" />
                      Aguardando confirmação bancária...
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full shadow-xs">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Pagamento Pix Aprovado!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CARTÃO (DÉBITO / CRÉDITO) VIEW */}
            {(activeMethod === 'DEBITO' || activeMethod === 'CREDITO') && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Cartão de {activeMethod === 'DEBITO' ? 'Débito' : 'Crédito'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Terminal Integrado de TEF / Pinpad
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Bandeira:
                    </label>
                    <select
                      value={cardBrand}
                      onChange={(e) => setCardBrand(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none"
                    >
                      <option value="Mastercard">Mastercard</option>
                      <option value="Visa">Visa</option>
                      <option value="Elo">Elo</option>
                      <option value="Hipercard">Hipercard</option>
                      <option value="Amex">American Express</option>
                    </select>
                  </div>

                  {activeMethod === 'CREDITO' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Parcelas:
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none"
                      >
                        <option value={1}>1x de R$ {total.toFixed(2)} (À Vista)</option>
                        <option value={2}>2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                        <option value={3}>3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                        <option value={4}>4x de R$ {(total / 4).toFixed(2)} sem juros</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* TEF Pinpad Simulation Box */}
                <div className="bg-slate-900 rounded-2xl p-6 text-center text-white space-y-3 shadow-inner">
                  <div className="text-xs font-mono text-slate-400">PINPAD TOLEDO / STONE TEF 01</div>

                  {cardStatus === 'IDLE' && (
                    <div className="py-4 space-y-2">
                      <CreditCard className="w-10 h-10 text-blue-400 mx-auto animate-bounce" />
                      <div className="font-bold text-base text-slate-100">
                        Insira ou aproxime o cartão
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Valor: R$ {total.toFixed(2)} ({cardBrand})
                      </div>
                      <button
                        type="button"
                        onClick={handleProcessCard}
                        className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                      >
                        Simular Inserção do Cartão
                      </button>
                    </div>
                  )}

                  {cardStatus === 'PROCESSING' && (
                    <div className="py-6 space-y-2">
                      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <div className="font-bold text-base text-blue-300">
                        Processando transação...
                      </div>
                      <div className="text-xs text-slate-400">Aguarde a resposta da adquirente</div>
                    </div>
                  )}

                  {cardStatus === 'APPROVED' && (
                    <div className="py-4 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div className="font-bold text-lg text-emerald-400">
                        TRANSAÇÃO AUTORIZADA
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        AUT: 948271 • DOC: 001928 • {cardBrand}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MISTO / SPLIT VIEW */}
            {activeMethod === 'MISTO' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pagamento Misto</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Divida a conta em múltiplas formas de pagamento.
                  </p>
                </div>

                {/* Remaining Balance Tracker */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase">Saldo Restante:</div>
                    <div className="text-2xl font-black text-amber-950 font-mono">
                      R$ {remainingBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-xs text-amber-900 font-medium">
                    Total: R$ {total.toFixed(2)} <br />
                    Pago: R$ {paidSoFar.toFixed(2)}
                  </div>
                </div>

                {/* Add Payment Row */}
                {remainingBalance > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600">
                      Adicionar Pagamento Parcial:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={`Até R$ ${remainingBalance.toFixed(2)}`}
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddPartialPayment('PIX')}
                        className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        + Pix
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPartialPayment('DEBITO')}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        + Débito
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPartialPayment('DINHEIRO')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        + Dinheiro
                      </button>
                    </div>
                  </div>
                )}

                {/* Added Payments List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {partialPayments.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                    >
                      <span className="text-slate-700">
                        #{idx + 1} - {p.method}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">R$ {p.amount.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => setPartialPayments((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Finalize Action */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleFinalizeSale}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition active:scale-98"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                CONCLUIR VENDA (ENTER)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
