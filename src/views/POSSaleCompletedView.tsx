import React, { useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import {
  CheckCircle2,
  Printer,
  Plus,
  QrCode,
  Share2,
  ArrowRight,
  Receipt,
  ShoppingCart,
  Award,
  Sparkles,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundService';

export const POSSaleCompletedView: React.FC = () => {
  const { salesHistory, navigate, startNewSale, currentStore, registerNumber } = usePOS();

  // Get the most recent completed sale
  const lastSale = salesHistory[0];

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handleNewSale = () => {
    startNewSale();
    navigate('/pos/venda/novo');
  };

  const handlePrint = () => {
    sound.playBarcodeBeep();
    window.print();
  };

  if (!lastSale) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100">
        <button
          onClick={handleNewSale}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
        >
          Iniciar Nova Venda
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex flex-col items-center justify-center select-none">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 my-auto">
        {/* Left Col: Success Announcement & Next Actions (6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-center space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center md:text-left space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto md:mx-0 shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Venda Finalizada com Sucesso!
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                Venda Nº {lastSale.code}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Registrada no Caixa {lastSale.registerNumber} • {lastSale.timestamp}
              </p>
            </div>

            {/* Total Paid & Change Recap */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-mono">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total da Venda:</span>
                <span className="font-bold text-slate-900 text-sm">
                  R$ {lastSale.total.toFixed(2)}
                </span>
              </div>
              {lastSale.change && lastSale.change > 0 ? (
                <div className="flex justify-between text-xs text-emerald-700 font-bold pt-1 border-t border-slate-200">
                  <span>Troco Devolvido:</span>
                  <span className="text-base text-emerald-600">
                    R$ {lastSale.change.toFixed(2)}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Clube Family Points Banner */}
            {lastSale.customer && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-xs text-amber-900 text-left">
                  <div className="font-bold">{lastSale.customer.name}</div>
                  <div>
                    Ganhou <strong>+{Math.floor(lastSale.total)} pontos</strong> no Clube Family nesta compra!
                  </div>
                </div>
              </div>
            )}

            {/* Main Action: New Sale */}
            <button
              type="button"
              onClick={handleNewSale}
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-700/25 transition active:scale-98"
            >
              <Plus className="w-5 h-5" />
              NOVA VENDA (F12 / ENTER)
            </button>

            {/* Secondary Print & Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                Imprimir Cupom (F8)
              </button>

              <button
                type="button"
                onClick={() => alert(`Comprovante digital enviado para o WhatsApp/E-mail do cliente!`)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" />
                Enviar WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Realistic Thermal Receipt Mockup (Cupom Fiscal NFC-e) (6 cols) */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-full max-w-sm bg-white p-5 rounded-2xl border border-slate-300 shadow-md font-mono text-[11px] text-slate-800 space-y-3 leading-tight print:border-none print:shadow-none">
            {/* Supermarket Header */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400 space-y-0.5">
              <div className="font-black text-sm tracking-wide">FAMILY SUPERMARKET LTDA</div>
              <div>CNPJ: 12.345.678/0001-90 • IE: 112.334.556</div>
              <div>{currentStore?.address || 'Av. Paulista, 1000 - Bela Vista - SP'}</div>
              <div className="font-bold pt-1 text-[10px] uppercase">
                DANFE NFC-e - Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
              </div>
            </div>

            {/* Customer Identification */}
            <div className="py-1 border-b border-dashed border-slate-400">
              <div>Consumidor: {lastSale.customer ? lastSale.customer.name : 'NÃO IDENTIFICADO'}</div>
              <div>CPF: {lastSale.customer ? lastSale.customer.cpf : '---'}</div>
            </div>

            {/* Items Table */}
            <div className="space-y-1 py-1 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold text-[10px] text-slate-500">
                <span>ITEM CÓDIGO DESCRIÇÃO</span>
                <span>QTDxUNIT TOTAL</span>
              </div>

              {lastSale.items.map((item, idx) => (
                <div key={item.id} className="flex justify-between">
                  <div className="truncate max-w-[180px]">
                    #{idx + 1} {item.product.name}
                  </div>
                  <div className="text-right shrink-0">
                    {item.quantity}x {item.unitPrice.toFixed(2)} = {item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 py-1 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Qtd. Total de Itens:</span>
                <span>{lastSale.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {lastSale.subtotal.toFixed(2)}</span>
              </div>
              {lastSale.discountTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Descontos:</span>
                  <span>- R$ {lastSale.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-xs pt-1">
                <span>VALOR A PAGAR R$:</span>
                <span>{lastSale.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payments */}
            <div className="space-y-1 py-1 border-b border-dashed border-slate-400">
              <div className="font-bold">FORMAS DE PAGAMENTO:</div>
              {lastSale.payments.map((pay) => (
                <div key={pay.id} className="flex justify-between">
                  <span>{pay.method}</span>
                  <span>R$ {pay.amount.toFixed(2)}</span>
                </div>
              ))}
              {lastSale.change && lastSale.change > 0 ? (
                <div className="flex justify-between font-bold">
                  <span>TROCO R$:</span>
                  <span>{lastSale.change.toFixed(2)}</span>
                </div>
              ) : null}
            </div>

            {/* SEFAZ NFC-e Access Key & QR Code */}
            <div className="text-center pt-2 space-y-2">
              <div className="text-[9px] text-slate-500 break-all">
                CHAVE DE ACESSO:
                <br />
                {lastSale.fiscalDetails?.chaveAcesso || '3526 0812 3456 7800 0190 6500 1000 0019 2810 9283 7461'}
              </div>

              <div className="flex justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.nfce.fazenda.sp.gov.br/qrcode?p=35260812345678000190650010000019281092837461"
                  alt="QR Code NFC-e SEFAZ"
                  className="w-20 h-20"
                />
              </div>

              <div className="text-[9px] text-slate-400">
                Consulta via leitor de QR Code • Protocolo de Autorização SEFAZ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
