import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Scale, X, Check, RefreshCw, Plus, Minus } from 'lucide-react';
import { sound } from '../../services/soundService';

export const POSWeighedModal: React.FC = () => {
  const { weighedModal, closeWeighedModal } = usePOS();
  const [weight, setWeight] = useState<number>(0.500); // 500g default
  const [tare, setTare] = useState<number>(0.005); // 5g tare

  if (!weighedModal) return null;

  const product = weighedModal.product;
  const netWeight = Math.max(0.001, Number((weight - tare).toFixed(3)));
  const unitPrice = product.promoPrice || product.price;
  const calculatedTotal = Number((unitPrice * netWeight).toFixed(2));

  const handleConfirm = () => {
    sound.playBarcodeBeep();
    weighedModal.onConfirm(netWeight);
    closeWeighedModal();
  };

  const handlePreset = (kg: number) => {
    setWeight(kg);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Pesagem do Produto</h3>
              <p className="text-emerald-100 text-xs font-medium">Balança Eletrônica Toledo Prix 5</p>
            </div>
          </div>
          <button
            onClick={closeWeighedModal}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info & Digital Scale Display */}
        <div className="p-6 space-y-5">
          {/* Product Header */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {product.category}
              </span>
              <h4 className="font-bold text-slate-800 text-base mt-1 truncate">{product.name}</h4>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>EAN: {product.ean}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">R$ {unitPrice.toFixed(2)} / kg</span>
              </div>
            </div>
          </div>

          {/* Toledo Digital Scale Screen */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-white shadow-inner font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-sans font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                BALANÇA ESTÁVEL (STABLE)
              </span>
              <span>TARA ATIVA: {(tare * 1000).toFixed(0)}g</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-semibold">
                  PESO LÍQUIDO (KG)
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight mt-1">
                  {netWeight.toFixed(3)}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">kg</div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-semibold">
                  PREÇO / KG
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight mt-1">
                  {unitPrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">R$ / kg</div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-semibold">
                  TOTAL A PAGAR
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight mt-1">
                  R$ {calculatedTotal.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">Reais (BRL)</div>
              </div>
            </div>
          </div>

          {/* Quick Presets & Manual Adjustment */}
          <div>
            <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
              <span>Atalhos Rápidos de Peso:</span>
              <button
                type="button"
                onClick={() => setTare(tare === 0 ? 0.015 : 0)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {tare > 0 ? 'Remover Tara' : 'Aplicar Tara (15g)'}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[0.250, 0.500, 1.000, 1.250, 2.000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                    weight === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {preset.toFixed(3)} kg
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Input */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWeight((prev) => Math.max(0.05, Number((prev - 0.05).toFixed(3))))}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <input
                type="number"
                step="0.005"
                min="0.005"
                max="50"
                value={weight}
                onChange={(e) => setWeight(Number(parseFloat(e.target.value || '0').toFixed(3)))}
                className="w-full text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setWeight((prev) => Number((prev + 0.05).toFixed(3)))}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition active:scale-98"
          >
            <Check className="w-5 h-5" />
            CONFIRMAR PESAGEM (R$ {calculatedTotal.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};
