import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Settings,
  Printer,
  Scale,
  Barcode,
  Volume2,
  VolumeX,
  Archive,
  ArrowLeft,
  Save,
  Check,
  RotateCcw,
  Shield,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { POSSettings } from '../types/pos';
import { sound } from '../services/soundService';

export const POSSettingsView: React.FC = () => {
  const { settings, updateSettings, navigate, resetDemoData } = usePOS();
  const [formData, setFormData] = useState<POSSettings>({ ...settings });
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    sound.playSuccess();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestBeep = () => {
    sound.playBarcodeBeep();
  };

  const handleTestScale = () => {
    sound.playSuccess();
    alert('Comunicação com balança Toledo Prix 5 realizada com sucesso! Peso recebido: 0.850 kg.');
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none space-y-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR AO PDV (ESC)
          </button>

          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Configurações do Terminal PDV & Periféricos
          </h2>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            Configurações salvas e aplicadas com sucesso neste terminal!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Hardware & Peripherals Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              Periféricos & Hardware Frente de Caixa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Thermal Printer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Impressora Térmica Fiscal (NFC-e / SAT)
                </label>
                <select
                  value={formData.thermalPrinterModel}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, thermalPrinterModel: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Epson TM-T20X">Epson TM-T20X (ESC/POS USB)</option>
                  <option value="Bematech MP-4200 TH">Bematech MP-4200 TH</option>
                  <option value="Elgin i9 / i8">Elgin i9 / i8 Térmica</option>
                  <option value="Daruma DR800">Daruma DR800</option>
                  <option value="Impressora Virtual / PDF">Impressora Virtual / PDF</option>
                </select>
              </div>

              {/* Toledo Scale */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Balança Eletrônica de Checkout
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.scaleModel}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scaleModel: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Toledo Prix 5 / 6">Toledo Prix 5 / 6 (Protocolo Toledo)</option>
                    <option value="Filizola CS-15">Filizola CS-15</option>
                    <option value="Urano Pop-Z">Urano Pop-Z</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleTestScale}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shrink-0"
                  >
                    Testar Balança
                  </button>
                </div>
              </div>
            </div>

            {/* Checkboxes for Hardware features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">Gaveta Automática</div>
                  <div className="text-[10px] text-slate-500">Abrir ao finalizar venda</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoOpenCashDrawer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, autoOpenCashDrawer: e.target.checked }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">Sons & Bips do Scanner</div>
                  <div className="text-[10px] text-slate-500">Feedback sonoro no PDV</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestBeep}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Bip
                  </button>
                  <input
                    type="checkbox"
                    checked={formData.soundEnabled}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, soundEnabled: e.target.checked }))
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </label>

              <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">Impressão Automática</div>
                  <div className="text-[10px] text-slate-500">Imprimir cupom sem confirmação</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoPrintReceipt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, autoPrintReceipt: e.target.checked }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Business & Cashier Rules */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Regras Comerciais & Alçada de Supervisão
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Limite Máximo de Desconto do Caixa (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.maxCashierDiscountPercent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxCashierDiscountPercent: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Descontos superiores exigem PIN / Senha do Supervisor.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ambiente de Emissão Fiscal
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, environment: e.target.value as any }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="HOMOLOGACAO">Homologação (Testes SEFAZ)</option>
                  <option value="PRODUCAO">Produção Comercial Oficial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reset Demo Data & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={resetDemoData}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar Catálogo & Vendas Demo de Fábrica
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-700/25 transition active:scale-98"
            >
              <Save className="w-4 h-4" />
              SALVAR CONFIGURAÇÕES DO TERMINAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
