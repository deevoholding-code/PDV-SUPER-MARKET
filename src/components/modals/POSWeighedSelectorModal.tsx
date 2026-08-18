import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Scale, X, Search, Sparkles } from 'lucide-react';
import { Product } from '../../types/pos';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const POSWeighedSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { products, openWeighedModal, addItemToCart } = usePOS();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const weighedProducts = products.filter(
    (p) =>
      p.isWeighed &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.ean.includes(search))
  );

  const handleSelect = (prod: Product) => {
    onClose();
    openWeighedModal(prod, (weight) => {
      addItemToCart(prod, 1, weight);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Produtos Pesáveis (Hortifrúti / Açougue / Granel)</h3>
              <p className="text-emerald-100 text-xs font-semibold">Selecione o produto para registrar na balança</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pesável por nome ou código (ex: Banana, Picanha, Maçã)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
              autoFocus
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          {weighedProducts.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Scale className="w-12 h-12 stroke-1 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Nenhum produto pesável encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {weighedProducts.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleSelect(prod)}
                  className="bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-2xl p-3 text-left flex flex-col items-center justify-between transition shadow-2xs hover:shadow-md group active:scale-95"
                >
                  <div className="w-20 h-20 flex items-center justify-center my-1">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-full text-center mt-2">
                    <div className="text-[10px] font-mono text-slate-400 font-bold">{prod.sku}</div>
                    <div className="text-xs font-extrabold text-slate-800 line-clamp-1">{prod.name}</div>
                    <div className="text-sm font-black text-emerald-700 font-mono mt-1">
                      R$ {(prod.promoPrice || prod.price).toFixed(2)} /kg
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
