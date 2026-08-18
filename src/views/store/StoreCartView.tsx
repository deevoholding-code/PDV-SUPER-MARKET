import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const StoreCartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearOnlineCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateEnv,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [cep, setCep] = useState('01310-100');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center select-none bg-slate-50 min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner border border-blue-100">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Seu carrinho está vazio</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Que tal conferir nossas super ofertas da semana e abastecer a despensa com economia?
        </p>
        <button
          onClick={() => navigateEnv('LOJA', '/produtos')}
          className="px-6 py-3 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-blue-700/25 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>IR PARA AS COMPRAS</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 select-none bg-slate-50 min-h-screen">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Meu Carrinho de Compras
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Você tem <strong className="text-slate-800">{cart.length}</strong> {cart.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <button
          type="button"
          onClick={clearOnlineCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Limpar Carrinho
        </button>
      </div>

      {/* Main Grid: Items List (8 cols) + Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Cart Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-2xl bg-slate-50 p-1.5 border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.product.brand} • {item.product.category}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h3>
                    <div className="text-xs font-black text-blue-700 font-mono mt-0.5">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                      <span className="text-[10px] text-slate-400 font-semibold ml-1">/{item.product.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity + Item Total + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  {/* Quantity modifier */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Trash */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                    title="Remover do carrinho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigateEnv('LOJA', '/produtos')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Adicionar Mais Produtos
            </button>
          </div>
        </div>

        {/* Right Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Resumo do Pedido
            </h2>

            {/* Coupon input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-700" /> Possui Cupom ou Vale?
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold font-mono uppercase">{appliedCoupon}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Ex: BEMVINDO10"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition"
                  >
                    APLICAR
                  </button>
                </form>
              )}

              {couponFeedback && (
                <div
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{couponFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal dos itens</span>
                <span className="font-bold text-slate-900 font-mono">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Descontos Aplicados</span>
                  <span className="font-bold font-mono">
                    - R$ {cartDiscount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Entrega Expressa Family</span>
                <span className="font-bold text-slate-900 font-mono">
                  {cartDeliveryFee === 0 ? (
                    <strong className="text-emerald-600">GRÁTIS</strong>
                  ) : (
                    `R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`
                  )}
                </span>
              </div>

              {cartSubtotal < 150 && (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  Faltam apenas <strong>R$ {(150 - cartSubtotal).toFixed(2).replace('.', ',')}</strong> para você ganhar <strong>Frete Grátis</strong>!
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-base font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-700 font-mono tracking-tight">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Big Proceed to Checkout Button (6 Phases) */}
            <button
              type="button"
              onClick={() => navigateEnv('CHECKOUT', '/checkout/identificacao')}
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>FECHAR PEDIDO (CHECKOUT)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Security badge */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3 text-xs text-slate-600 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Compra 100% segura. Seus dados estão protegidos com criptografia SSL 256-bit.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
