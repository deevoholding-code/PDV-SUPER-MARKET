import React, { useState, useRef } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Trash2,
  XCircle,
  Plus,
  Minus,
  ArrowRight,
  User,
  Ticket,
  Percent,
  Search,
  Scale,
  Sparkles,
  DollarSign,
  Clock,
  Archive,
  Layers,
  CheckCircle,
  Tag,
  Gift,
  Truck,
  LayoutGrid,
  Apple,
  Beef,
  Milk,
  Croissant,
  ShoppingCart,
  Egg,
  Sparkle,
  HeartPulse,
  Dog,
  Snowflake,
  Baby,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { Product } from '../types/pos';
import { POSFooterShortcuts } from '../components/common/POSFooterShortcuts';
import { POSCustomerModal } from '../components/modals/POSCustomerModal';
import { POSDiscountModal } from '../components/modals/POSDiscountModal';
import { POSReprintModal } from '../components/modals/POSReprintModal';
import { POSWeighedSelectorModal } from '../components/modals/POSWeighedSelectorModal';

export const POSSalesView: React.FC = () => {
  const {
    cartItems,
    products,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    subtotal,
    discountTotal,
    total,
    currentCustomer,
    appliedCoupon,
    navigate,
    openDrawer,
    drawerOpen,
    setPriceLookupModalOpen,
    deliveryOrders,
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [customerModalOpen, setCustomerModalOpen] = useState<boolean>(false);
  const [discountModalOpen, setDiscountModalOpen] = useState<boolean>(false);
  const [reprintModalOpen, setReprintModalOpen] = useState<boolean>(false);
  const [weighedSelectorOpen, setWeighedSelectorOpen] = useState<boolean>(false);
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);

  // Category navigation scroll
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'TODOS') return true;
    return p.category === selectedCategory;
  });

  const handleProductCardClick = (product: Product) => {
    addItemToCart(product);
  };

  const handleCancelSelectedItem = () => {
    if (selectedCartItemId) {
      removeItemFromCart(selectedCartItemId);
      setSelectedCartItemId(null);
    } else if (cartItems.length > 0) {
      removeItemFromCart(cartItems[cartItems.length - 1].id);
    }
  };

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const pendingDeliveryCount = deliveryOrders.filter((d) => d.status === 'PENDING').length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-hidden select-none">
      {/* 3-Column Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
        {/* Column 1: Left Cart (Items da venda) - 4 cols on lg, 3 on xl */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
          {/* Cart Header */}
          <div className="bg-blue-950 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">
                Itens da venda ({cartItems.length})
              </span>
            </div>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-slate-300 hover:text-rose-400 p-1 rounded-lg transition"
                title="Limpar todos os itens (F7)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Table Headers */}
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Qtd.</div>
            <div className="col-span-2 text-right">Unit.</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <ShoppingCart className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-600">Caixa Livre / Venda Vazia</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Passe o código de barras ou clique nos produtos do catálogo ao lado.
                </p>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const isSelected = selectedCartItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCartItemId(item.id)}
                    className={`grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Item info */}
                    <div className="col-span-6 flex items-start gap-2 min-w-0 pr-1">
                      <span className="text-slate-400 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate leading-snug">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <span>{item.product.ean}</span>
                          {item.appliedPromotion && (
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                              {item.appliedPromotion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity with quick controls */}
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemQuantity(item.id, item.quantity - 1);
                        }}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-slate-800 min-w-[14px] text-center font-mono">
                        {item.product.isWeighed && item.weight
                          ? `${item.weight.toFixed(3)}kg`
                          : item.quantity}
                      </span>
                      {!item.product.isWeighed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateItemQuantity(item.id, item.quantity + 1);
                          }}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]"
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-right text-slate-600 font-medium font-mono">
                      {item.unitPrice.toFixed(2)}
                    </div>

                    {/* Total & Delete Action */}
                    <div className="col-span-2 flex items-center justify-end gap-1 font-bold text-slate-900 font-mono">
                      <span>{item.total.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItemFromCart(item.id);
                        }}
                        className="text-slate-300 hover:text-rose-600 transition p-0.5 rounded"
                        title="Remover item (F6)"
                      >
                        <XCircle className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Summary Totals & Checkout Button */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 space-y-2 shrink-0">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono text-sm font-bold text-slate-800">
                R$ {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
            {discountTotal > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Descontos Aplicados
                  {appliedCoupon && <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">Cupom {appliedCoupon.code}</span>}
                </span>
                <span className="font-mono text-sm font-bold">
                  - R$ {discountTotal.toFixed(2)}
                </span>
              </div>
            )}

            {/* Big Bold Total */}
            <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">Total</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono tracking-tight">
                R$ {total.toFixed(2)}
              </span>
            </div>

            {/* Customer Pill (F4) */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                className="w-full bg-white hover:bg-blue-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left flex items-center justify-between transition group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-4 h-4 text-blue-600 group-hover:scale-110 transition shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-slate-400 uppercase leading-none">Cliente (F4)</div>
                    <div className="text-xs font-black text-slate-800 truncate leading-snug">
                      {currentCustomer ? currentCustomer.name : 'CONSUMIDOR (NÃO IDENTIFICADO)'}
                    </div>
                  </div>
                </div>
                {currentCustomer && (
                  <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                    {currentCustomer.clubTier} • {currentCustomer.clubPoints} pts
                  </span>
                )}
              </button>
            </div>

            {/* F8 Big Green Payment Button */}
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/pos/venda/pagamento')}
              className={`w-full py-2.5 px-3.5 rounded-xl font-black text-sm sm:text-base flex items-center justify-between shadow-md transition active:scale-98 ${
                cartItems.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>F8 - PAGAMENTO</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-base font-bold">
                <span>R$ {total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Column 2: Center Catalog & Categories - 6 cols on lg, 6 on xl */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col min-h-0 overflow-hidden space-y-3">
          {/* Category Tabs Scroll Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-1 shrink-0 relative">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-3 shadow-sm min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((prod) => {
                const isWeighed = Boolean(prod.isWeighed);
                const isClubPrice = Boolean(currentCustomer?.clubMember && prod.clubPrice);
                const displayPrice = isClubPrice && prod.clubPrice ? prod.clubPrice : (prod.promoPrice || prod.price);

                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductCardClick(prod)}
                    className="group bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl p-2.5 text-center flex flex-col items-center justify-between transition shadow-2xs hover:shadow-md relative overflow-hidden active:scale-95 text-left"
                  >
                    {/* Badge for Weighed or Promos */}
                    {isWeighed && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 shadow-xs z-10">
                        <Scale className="w-3 h-3" /> PESÁVEL
                      </span>
                    )}

                    {prod.promotionRule === 'LEVE2_PAGUE1' && !isWeighed && (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase shadow-xs z-10">
                        LEVE 2 PAGUE 1
                      </span>
                    )}

                    {prod.promotionRule === 'SEGUNDA_50' && !isWeighed && (
                      <span className="absolute top-2 right-2 bg-purple-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase shadow-xs z-10">
                        2ª COM 50%
                      </span>
                    )}

                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center my-1">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Title & Price */}
                    <div className="w-full mt-2">
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-2 h-8 text-center leading-snug">
                        {prod.name}
                      </h4>

                      <div className="mt-1 text-center">
                        <div className="font-extrabold text-blue-700 text-sm font-mono">
                          R$ {displayPrice.toFixed(2)}
                          {prod.unit === 'KG' && <span className="text-[10px] text-slate-500 font-sans"> /kg</span>}
                        </div>

                        {prod.clubPrice && !isClubPrice && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Clube: R$ {prod.clubPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 3: Right Sidebar Quick Actions - 2 cols on lg/xl */}
        <div className="col-span-12 lg:col-span-2 xl:col-span-2 flex flex-col gap-2 min-h-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm flex flex-col gap-1.5 flex-1 overflow-y-auto">
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5 px-1 flex items-center justify-between">
              <span>Ações rápidas</span>
              {drawerOpen && (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded animate-pulse border border-amber-200">
                  GAVETA ABERTA
                </span>
              )}
            </div>

            {/* Balança / Pesável (F2) */}
            <button
              type="button"
              onClick={() => setWeighedSelectorOpen(true)}
              className="w-full py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Pesagem de Hortifrúti, Carnes e Granel (F2)"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">BALANÇA / PESÁVEL</span>
            </button>

            {/* Consultar Preço (F9) */}
            <button
              type="button"
              onClick={() => setPriceLookupModalOpen(true)}
              className="w-full py-2 px-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Consultar preço e estoque de mercadorias (F9)"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">CONSULTAR PREÇO</span>
            </button>

            {/* Reimprimir Cupom */}
            <button
              type="button"
              onClick={() => setReprintModalOpen(true)}
              className="w-full py-2 px-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Reimprimir último comprovante fiscal NFC-e"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Archive className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">REIMPRIMIR CUPOM</span>
            </button>

            {/* Sangria */}
            <button
              type="button"
              onClick={() => navigate('/pos/sangria')}
              className="w-full py-2 px-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Retirada de dinheiro do caixa"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">SANGRIA</span>
            </button>

            {/* Suprimento */}
            <button
              type="button"
              onClick={() => navigate('/pos/suprimento')}
              className="w-full py-2 px-2.5 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Entrada de troco no caixa"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">SUPRIMENTO</span>
            </button>

            {/* Últimas Vendas (F10) */}
            <button
              type="button"
              onClick={() => navigate('/pos/historico')}
              className="w-full py-2 px-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Histórico e comprovantes de vendas do turno (F10)"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">ÚLTIMAS VENDAS</span>
            </button>

            {/* Abrir Gaveta */}
            <button
              type="button"
              onClick={() => openDrawer()}
              className="w-full py-2 px-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group"
              title="Acionar solenoide de abertura física da gaveta"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Archive className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">ABRIR GAVETA</span>
            </button>

            {/* Delivery / iFood Orders */}
            <button
              type="button"
              onClick={() => navigate('/pos/delivery')}
              className="w-full py-2 px-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-950 text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-2xs group relative"
              title="Gerenciamento de pedidos delivery integrados"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-xs">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 text-left flex-1">
                <div className="truncate">DELIVERY / IFOOD</div>
                {pendingDeliveryCount > 0 && (
                  <div className="text-[9px] text-rose-600 font-bold leading-none">
                    {pendingDeliveryCount} pendentes
                  </div>
                )}
              </div>
              {pendingDeliveryCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Shortcuts */}
      <POSFooterShortcuts
        onOpenCustomerModal={() => setCustomerModalOpen(true)}
        onOpenDiscountModal={() => setDiscountModalOpen(true)}
        onCancelSelectedItem={handleCancelSelectedItem}
      />

      {/* Customer & Discount Modals */}
      <POSCustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      />

      <POSDiscountModal
        isOpen={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
      />

      {/* Reprint Receipt Modal */}
      <POSReprintModal
        isOpen={reprintModalOpen}
        onClose={() => setReprintModalOpen(false)}
      />

      {/* Weighed Product Selector Modal */}
      <POSWeighedSelectorModal
        isOpen={weighedSelectorOpen}
        onClose={() => setWeighedSelectorOpen(false)}
      />
    </div>
  );
};
