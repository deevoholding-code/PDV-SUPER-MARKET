import React from 'react';
import { usePOS } from '../../context/POSContext';
import {
  HelpCircle,
  Search,
  User,
  Percent,
  XCircle,
  Trash2,
  Lock,
  DollarSign,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Props {
  onOpenCustomerModal?: () => void;
  onOpenDiscountModal?: () => void;
  onCancelSelectedItem?: () => void;
}

export const POSFooterShortcuts: React.FC<Props> = ({
  onOpenCustomerModal,
  onOpenDiscountModal,
  onCancelSelectedItem,
}) => {
  const {
    navigate,
    setHelpModalOpen,
    setPriceLookupModalOpen,
    cancelActiveSale,
    cartItems,
    cashSession,
  } = usePOS();

  return (
    <footer className="bg-white border-t border-slate-200 px-3 py-1.5 shrink-0 select-none shadow-xs">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {/* F1 - Ajuda */}
        <button
          id="btn-f1-help"
          onClick={() => setHelpModalOpen(true)}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold transition shadow-2xs group active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-blue-500 group-hover:text-blue-600 shrink-0" />
          <span className="truncate"><strong className="text-blue-600">F1</strong> - AJUDA</span>
        </button>

        {/* F3 - Pesquisar */}
        <button
          id="btn-f3-search"
          onClick={() => {
            const el = document.getElementById('pos-main-search');
            if (el) el.focus();
          }}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold transition shadow-2xs group active:scale-95"
        >
          <Search className="w-4 h-4 text-blue-500 group-hover:text-blue-600 shrink-0" />
          <span className="truncate"><strong className="text-blue-600">F3</strong> - PESQUISAR</span>
        </button>

        {/* F4 - Cliente */}
        <button
          id="btn-f4-customer"
          onClick={() => onOpenCustomerModal ? onOpenCustomerModal() : navigate('/pos/clientes')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold transition shadow-2xs group active:scale-95"
        >
          <User className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 shrink-0" />
          <span className="truncate"><strong className="text-emerald-600">F4</strong> - CLIENTE</span>
        </button>

        {/* F5 - Desconto */}
        <button
          id="btn-f5-discount"
          onClick={() => onOpenDiscountModal ? onOpenDiscountModal() : null}
          disabled={cartItems.length === 0}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold transition shadow-2xs active:scale-95 ${
            cartItems.length > 0
              ? 'border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-slate-700 hover:text-purple-700'
              : 'border-slate-100 bg-slate-100/50 text-slate-300 cursor-not-allowed'
          }`}
        >
          <Percent className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="truncate"><strong className="text-purple-600">F5</strong> - DESCONTO</span>
        </button>

        {/* F6 - Cancelar Item */}
        <button
          id="btn-f6-cancel-item"
          onClick={() => onCancelSelectedItem ? onCancelSelectedItem() : null}
          disabled={cartItems.length === 0}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold transition shadow-2xs active:scale-95 ${
            cartItems.length > 0
              ? 'border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700'
              : 'border-slate-100 bg-slate-100/50 text-slate-300 cursor-not-allowed'
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="truncate"><strong className="text-rose-600">F6</strong> - CANC. ITEM</span>
        </button>

        {/* F7 - Cancelar Venda */}
        <button
          id="btn-f7-cancel-sale"
          onClick={() => cancelActiveSale()}
          disabled={cartItems.length === 0}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold transition shadow-2xs active:scale-95 ${
            cartItems.length > 0
              ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 hover:border-rose-300 text-rose-700'
              : 'border-slate-100 bg-slate-100/50 text-slate-300 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate"><strong className="text-rose-700">F7</strong> - CANC. VENDA</span>
        </button>

        {/* Fechar Caixa */}
        <button
          id="btn-close-session"
          onClick={() => navigate('/pos/caixa/fechamento')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-blue-900 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-sm active:scale-95 col-span-3 sm:col-span-1"
        >
          <Lock className="w-4 h-4 text-blue-300 shrink-0" />
          <span className="truncate">FECHAR CAIXA</span>
        </button>
      </div>
    </footer>
  );
};
