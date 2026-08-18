import React, { useState, useRef, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Barcode, Search, X, ShoppingCart, Tag, Award, Check, Layers } from 'lucide-react';
import { Product } from '../../types/pos';
import { sound } from '../../services/soundService';

export const POSPriceLookupModal: React.FC = () => {
  const { priceLookupModalOpen, setPriceLookupModalOpen, products, addItemToCart } = usePOS();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (priceLookupModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [priceLookupModalOpen]);

  if (!priceLookupModalOpen) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) return;

    const lower = term.toLowerCase();
    const found = products.find(
      (p) =>
        p.ean === term.trim() ||
        p.sku.toLowerCase() === lower ||
        p.name.toLowerCase().includes(lower)
    );

    if (found) {
      setSelectedProduct(found);
      sound.playBarcodeBeep();
    }
  };

  const handleAddAndClose = (product: Product) => {
    addItemToCart(product);
    setPriceLookupModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Barcode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight">Consulta Rápida de Preço (F9)</h3>
                <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded uppercase">
                  Terminal Ágil
                </span>
              </div>
              <p className="text-blue-200 text-xs font-medium">Passe o leitor de código de barras ou digite o código</p>
            </div>
          </div>
          <button
            onClick={() => setPriceLookupModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Escaneie o código de barras ou digite o nome do produto..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Selected Product Details View */}
        {selectedProduct ? (
          <div className="p-6 space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 w-full text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Marca: {selectedProduct.brand}</span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
                  <span>EAN: <strong>{selectedProduct.ean}</strong></span>
                  <span>•</span>
                  <span>SKU: {selectedProduct.sku}</span>
                  <span>•</span>
                  <span className={`font-bold ${selectedProduct.stock > 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Estoque: {selectedProduct.stock} {selectedProduct.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Cards Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Normal Retail Price */}
              <div className="bg-slate-100/80 border border-slate-200 p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Preço Normal
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  R$ {selectedProduct.price.toFixed(2)}
                  {selectedProduct.unit === 'KG' && <span className="text-sm font-normal text-slate-500"> / kg</span>}
                </div>
                {selectedProduct.promoPrice && (
                  <div className="text-xs text-rose-600 font-semibold mt-1">
                    Oferta Geral: R$ {selectedProduct.promoPrice.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Clube Family Price */}
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" /> Preço Clube Family
                </div>
                <div className="text-3xl font-black text-emerald-700 mt-1">
                  R$ {(selectedProduct.clubPrice || selectedProduct.price * 0.9).toFixed(2)}
                  {selectedProduct.unit === 'KG' && <span className="text-sm font-normal text-emerald-600"> / kg</span>}
                </div>
                <div className="text-xs text-emerald-800 font-medium mt-1">
                  Exclusivo para clientes cadastrados
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleAddAndClose(selectedProduct)}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 transition active:scale-98"
              >
                <ShoppingCart className="w-5 h-5" />
                ADICIONAR PRODUTO AO CARRINHO (F12)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Barcode className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Aproxime o código de barras do leitor para exibir os valores.</p>
          </div>
        )}
      </div>
    </div>
  );
};
