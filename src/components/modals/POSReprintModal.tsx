import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Printer, X, CheckCircle, Receipt, ArrowRight, Share2, Copy } from 'lucide-react';
import { sound } from '../../services/soundService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const POSReprintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { salesHistory, lastCompletedSale, currentStore, registerNumber } = usePOS();

  if (!isOpen) return null;

  const sale = lastCompletedSale || salesHistory[0];

  const handlePrint = () => {
    sound.playBarcodeBeep();
    window.print();
  };

  const handleCopyKey = () => {
    if (sale) {
      navigator.clipboard.writeText(sale.nfeKey);
      alert('Chave de Acesso NFC-e copiada com sucesso!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-800 text-blue-200 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Reimpressão de Cupom Fiscal</h3>
              <p className="text-blue-300 text-xs font-semibold">NFC-e / SAT — Family Supermarket</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!sale ? (
            <div className="text-center py-10 space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">Nenhuma venda realizada neste caixa ainda.</p>
              <p className="text-xs text-slate-400">Realize uma venda para emitir e reimprimir o cupom fiscal.</p>
            </div>
          ) : (
            <>
              {/* Receipt Preview Box */}
              <div className="bg-amber-50/40 border border-dashed border-amber-300/80 rounded-2xl p-5 font-mono text-xs text-slate-800 space-y-3 shadow-inner">
                {/* Store Header */}
                <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-0.5">
                  <div className="font-black text-sm text-slate-900 tracking-wider">FAMILY SUPERMARKET</div>
                  <div className="text-[10px] text-slate-500">{currentStore.tradeName} — CNPJ: {currentStore.cnpj}</div>
                  <div className="text-[10px] text-slate-500">{currentStore.address}</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1 text-blue-700">DOCUMENTO AUXILIAR DA NFC-e</div>
                </div>

                {/* Meta info */}
                <div className="flex justify-between text-[11px] text-slate-600 border-b border-dashed border-slate-300 pb-2">
                  <span>Cupom: <strong>#{sale.saleNumber}</strong></span>
                  <span>Caixa: <strong>{registerNumber}</strong></span>
                  <span>{sale.createdAt}</span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between font-bold text-[10px] text-slate-400 border-b border-slate-200 pb-1">
                    <span>ITEM / DESCRIÇÃO</span>
                    <span>QTD x UNIT = TOTAL</span>
                  </div>
                  {sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] leading-tight">
                      <span className="truncate pr-2 font-medium">
                        {idx + 1}. {item.product.name}
                      </span>
                      <span className="shrink-0 font-bold">
                        {item.quantity}x R$ {item.unitPrice.toFixed(2)} = R$ {item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals & Payments */}
                <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Qtd. Total de Itens:</span>
                    <span>{sale.items.length}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Subtotal:</span>
                    <span>R$ {sale.subtotal.toFixed(2)}</span>
                  </div>
                  {sale.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Desconto:</span>
                      <span>- R$ {sale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-300 pt-1">
                    <span>VALOR TOTAL:</span>
                    <span>R$ {sale.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Forma de Pagamento:</span>
                    <span className="font-bold uppercase">
                      {sale.payments.map((p) => p.method).join(' + ')}
                    </span>
                  </div>
                  {sale.change > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Troco:</span>
                      <span>R$ {sale.change.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* NFC-e Key & QR Code Info */}
                <div className="border-t border-dashed border-slate-300 pt-3 text-center space-y-1">
                  <div className="text-[9px] text-slate-400">CHAVE DE ACESSO NFC-E:</div>
                  <div className="text-[10px] text-slate-700 font-bold break-all bg-white p-1 rounded border border-slate-200">
                    {sale.nfeKey}
                  </div>
                  <div className="text-[9px] text-emerald-700 font-bold mt-1 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    AUTORIZADA PELA SEFAZ (PRODUÇÃO)
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {sale && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyKey}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copiar Chave</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Reimprimir na Térmica (ESC/POS)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
