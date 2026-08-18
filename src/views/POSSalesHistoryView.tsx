import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Printer,
  RotateCcw,
  XCircle,
  Eye,
  FileText,
  User,
  DollarSign,
  QrCode,
  CreditCard,
  X,
  Check,
  Share2,
} from 'lucide-react';
import { SaleRecord } from '../types/pos';
import { sound } from '../services/soundService';

export const POSSalesHistoryView: React.FC = () => {
  const { salesHistory, cancelSale, processReturn, navigate, requestSupervisorAuth } = usePOS();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // Return modal state
  const [returnModalOpen, setReturnModalOpen] = useState<boolean>(false);
  const [returnReason, setReturnReason] = useState<string>('Produto avariado ou vencido');
  const [selectedReturnItemIds, setSelectedReturnItemIds] = useState<string[]>([]);

  const filteredSales = salesHistory.filter((s) => {
    const matchesSearch =
      s.code.includes(searchTerm) ||
      (s.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customer?.cpf || '').includes(searchTerm) ||
      s.items.some((i) => i.product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePrintSale = (sale: SaleRecord) => {
    sound.playBarcodeBeep();
    alert(`Imprimindo 2ª via da Venda #${sale.code} na impressora térmica padrão.`);
  };

  const handleCancelSaleClick = (sale: SaleRecord) => {
    requestSupervisorAuth('CANCEL_SALE', () => {
      const reason = prompt('Informe o motivo do cancelamento da venda:');
      if (reason) {
        cancelSale(sale.id, reason);
        setSelectedSale(null);
      }
    });
  };

  const handleOpenReturnModal = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setSelectedReturnItemIds(sale.items.map((i) => i.id));
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = () => {
    if (!selectedSale || selectedReturnItemIds.length === 0) return;

    requestSupervisorAuth('RETURN_ITEM', () => {
      processReturn(selectedSale.id, selectedReturnItemIds, returnReason);
      setReturnModalOpen(false);
      setSelectedSale(null);
      alert('Devolução / Troca processada com sucesso! Vale-compras ou estorno gerado.');
    });
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none space-y-4">
      <div className="max-w-6xl mx-auto space-y-4">
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
            <Clock className="w-5 h-5 text-blue-600" />
            Histórico de Vendas & Devoluções
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Nº da Venda, Cliente, CPF ou Produto..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">Todos os Status</option>
              <option value="COMPLETED">Concluídas</option>
              <option value="REFUNDED">Devolvidas / Estornadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Venda #</th>
                  <th className="py-3 px-4">Horário / Data</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Itens</th>
                  <th className="py-3 px-4">Formas de Pagamento</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Nenhuma venda encontrada com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        #{sale.code}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{sale.timestamp}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{sale.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        {sale.customer ? (
                          <div>
                            <div className="font-bold text-slate-800">{sale.customer.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              CPF: {sale.customer.cpf}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Consumidor Final</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {sale.items.length} produto(s)
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {sale.payments.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700"
                            >
                              {p.method} (R$ {p.amount.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900">
                        R$ {sale.total.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            sale.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sale.status === 'REFUNDED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sale.status === 'COMPLETED'
                            ? 'Concluída'
                            : sale.status === 'REFUNDED'
                            ? 'Devolvida'
                            : 'Cancelada'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSale(sale)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver detalhes da venda"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintSale(sale)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            title="Reimprimir Comprovante"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {sale.status === 'COMPLETED' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenReturnModal(sale)}
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                title="Troca / Devolução de Itens"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCancelSaleClick(sale)}
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Cancelar Venda (Supervisor)"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && !returnModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Detalhes da Venda #{selectedSale.code}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedSale.timestamp} • Operador: {selectedSale.operatorName}
                </div>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {selectedSale.items.map((item, idx) => (
                <div key={item.id} className="py-2 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{item.product.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.quantity} x R$ {item.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-bold font-mono text-slate-900">
                    R$ {item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {selectedSale.subtotal.toFixed(2)}</span>
              </div>
              {selectedSale.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Descontos:</span>
                  <span>- R$ {selectedSale.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200 text-slate-900">
                <span>Total Pago:</span>
                <span>R$ {selectedSale.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handlePrintSale(selectedSale)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir 2ª Via
              </button>
              <button
                onClick={() => setSelectedSale(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return & Exchange Modal */}
      {returnModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Troca / Devolução de Mercadorias
                </h3>
                <div className="text-xs text-slate-500">Venda Ref: #{selectedSale.code}</div>
              </div>
              <button
                onClick={() => setReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-bold text-slate-600">
              Selecione os itens a serem devolvidos:
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
              {selectedSale.items.map((item) => {
                const isChecked = selectedReturnItemIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? 'bg-amber-50 border-amber-400 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedReturnItemIds((prev) =>
                            isChecked ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                          );
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-bold">{item.product.name}</span>
                    </div>
                    <span className="font-mono font-bold">R$ {item.total.toFixed(2)}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motivo da Devolução / Troca:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              >
                <option value="Produto avariado ou danificado">Produto avariado ou danificado</option>
                <option value="Validade vencida ou divergente">Validade vencida ou divergente</option>
                <option value="Arrependimento / Desistência do cliente">
                  Arrependimento / Desistência do cliente
                </option>
                <option value="Erro no registro de quantidade no caixa">
                  Erro no registro de quantidade no caixa
                </option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Autorizar Troca (Supervisor)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
