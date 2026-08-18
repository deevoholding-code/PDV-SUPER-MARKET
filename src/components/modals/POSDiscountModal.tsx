import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Percent, DollarSign, Ticket, X, Check, AlertCircle, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const POSDiscountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    subtotal,
    total,
    appliedCoupon,
    manualCartDiscount,
    setManualCartDiscount,
    setItemDiscount,
    applyCoupon,
    removeCoupon,
    settings,
  } = usePOS();

  const [mode, setMode] = useState<'SALE' | 'ITEM' | 'COUPON'>('SALE');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>(cartItems[0]?.id || '');
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleApplySaleDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(discountValue.replace(',', '.') || '0');
    if (val <= 0) return;

    setManualCartDiscount(discountType, val);
    onClose();
  };

  const handleApplyItemDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(discountValue.replace(',', '.') || '0');
    if (val <= 0 || !selectedItemId) return;

    setItemDiscount(selectedItemId, val);
    onClose();
  };

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleQuickPercent = (pct: number) => {
    setDiscountType('PERCENT');
    setDiscountValue(pct.toString());
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Aplicar Desconto ou Cupom</h3>
              <p className="text-purple-200 text-xs font-medium">Subtotal Atual: R$ {subtotal.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            type="button"
            onClick={() => setMode('SALE')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              mode === 'SALE'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Percent className="w-3.5 h-3.5" /> Desconto Total
          </button>
          <button
            type="button"
            onClick={() => setMode('ITEM')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              mode === 'ITEM'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Por Item
          </button>
          <button
            type="button"
            onClick={() => setMode('COUPON')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              mode === 'COUPON'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" /> Inserir Cupom
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {mode === 'SALE' && (
            <form onSubmit={handleApplySaleDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Desconto:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType('PERCENT')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      discountType === 'PERCENT'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Percent className="w-4 h-4" /> Em Percentual (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('FIXED')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      discountType === 'FIXED'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" /> Em Reais (R$)
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              {discountType === 'PERCENT' && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1.5">Sugestões rápidas:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleQuickPercent(pct)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          discountValue === pct.toString()
                            ? 'bg-purple-100 border-purple-400 text-purple-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor do Desconto {discountType === 'PERCENT' ? '(%)' : '(R$)'}:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'PERCENT' ? 'Ex: 10' : 'Ex: 15.00'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  Descontos acima de <strong>{settings.maxCashierDiscountPercent}%</strong> solicitam automaticamente validação do supervisor.
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-700/20"
                >
                  <Check className="w-4 h-4" /> Aplicar Desconto Total
                </button>
              </div>
            </form>
          )}

          {mode === 'ITEM' && (
            <form onSubmit={handleApplyItemDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Item da Venda:
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                >
                  {cartItems.map((item, idx) => (
                    <option key={item.id} value={item.id}>
                      #{idx + 1} - {item.product.name} ({item.quantity}x) - R$ {item.total.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor do Desconto no Item (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="Ex: 2.50"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-700/20"
              >
                <Check className="w-4 h-4" /> Aplicar Desconto no Item
              </button>
            </form>
          )}

          {mode === 'COUPON' && (
            <form onSubmit={handleApplyCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código do Cupom de Desconto:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Ex: FAMILY10, BEMVINDO, SUPER20"
                    className="flex-1 uppercase px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-purple-700/20"
                  >
                    Validar
                  </button>
                </div>
              </div>

              {couponFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    couponFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {couponFeedback.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {couponFeedback.message}
                </div>
              )}

              {appliedCoupon && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-950">Cupom Ativo: {appliedCoupon.code}</div>
                    <div className="text-[11px] text-purple-700">
                      Desconto de {appliedCoupon.discountValue}
                      {appliedCoupon.discountType === 'PERCENT' ? '%' : ' R$'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Remover Cupom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 text-xs text-slate-600">
                <div className="font-bold text-slate-700">Cupons de Demonstração Disponíveis:</div>
                <div>• <code className="font-mono font-bold text-purple-700">FAMILY10</code>: 10% OFF acima de R$ 30</div>
                <div>• <code className="font-mono font-bold text-purple-700">BEMVINDO</code>: R$ 10,00 OFF acima de R$ 50</div>
                <div>• <code className="font-mono font-bold text-purple-700">SUPER20</code>: 20% OFF acima de R$ 100</div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
