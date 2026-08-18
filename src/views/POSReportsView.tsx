import React from 'react';
import { usePOS } from '../context/POSContext';
import {
  BarChart3,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  Printer,
  FileSpreadsheet,
  Award,
  CreditCard,
  QrCode,
  PieChart as PieIcon,
} from 'lucide-react';

export const POSReportsView: React.FC = () => {
  const { salesHistory, currentSession, currentStore, registerNumber, navigate } = usePOS();

  const totalSalesCount = salesHistory.length;
  const grossRevenue = salesHistory.reduce((acc, s) => acc + s.total, 0);
  const averageTicket = totalSalesCount > 0 ? grossRevenue / totalSalesCount : 0;
  const totalItemsSold = salesHistory.reduce(
    (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0),
    0
  );

  // Calculate payment methods distribution
  const paymentsByMethod: Record<string, number> = {
    DINHEIRO: 0,
    PIX: 0,
    DEBITO: 0,
    CREDITO: 0,
  };

  salesHistory.forEach((sale) => {
    sale.payments.forEach((p) => {
      paymentsByMethod[p.method] = (paymentsByMethod[p.method] || 0) + p.amount;
    });
  });

  // Calculate product sales rank
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  salesHistory.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          name: item.product.name,
          qty: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.total;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none space-y-5">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR AO PDV (ESC)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir Relatório Sintético
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Faturamento Bruto</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              R$ {grossRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{totalSalesCount} cupons emitidos</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Ticket Médio</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              R$ {averageTicket.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">+ 8.4% vs meta</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Itens Faturados</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {totalItemsSold} un
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Média de {(totalItemsSold / (totalSalesCount || 1)).toFixed(1)} itens/venda</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Clube Family</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {salesHistory.filter((s) => s.customer).length} clientes
            </div>
            <div className="text-[11px] text-purple-700 font-bold mt-1">
              {((salesHistory.filter((s) => s.customer).length / (totalSalesCount || 1)) * 100).toFixed(0)}% identificado
            </div>
          </div>
        </div>

        {/* 2-Column Graphs & Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Top Sold Products (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Produtos Mais Vendidos (Volume & Receita)
            </h3>

            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Nenhuma venda computada ainda no turno.
                </div>
              ) : (
                topProducts.map((prod, idx) => {
                  const maxQty = topProducts[0].qty || 1;
                  const pct = Math.round((prod.qty / maxQty) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span className="truncate max-w-[280px]">
                          #{idx + 1} {prod.name}
                        </span>
                        <span className="font-mono text-blue-700">
                          {prod.qty} un • R$ {prod.revenue.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Payment Methods Mix (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-600" />
              Distribuição por Meio de Pagamento
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Dinheiro em Espécie', key: 'DINHEIRO', color: 'bg-emerald-500', icon: DollarSign },
                { label: 'Pix Instantâneo', key: 'PIX', color: 'bg-sky-500', icon: QrCode },
                { label: 'Cartão de Débito', key: 'DEBITO', color: 'bg-blue-600', icon: CreditCard },
                { label: 'Cartão de Crédito', key: 'CREDITO', color: 'bg-purple-600', icon: CreditCard },
              ].map((m) => {
                const amount = paymentsByMethod[m.key] || 0;
                const pct = grossRevenue > 0 ? (amount / grossRevenue) * 100 : 0;
                const Icon = m.icon;

                return (
                  <div key={m.key} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                        <span>{m.label}</span>
                      </div>
                      <span className="font-mono">R$ {amount.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${m.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
