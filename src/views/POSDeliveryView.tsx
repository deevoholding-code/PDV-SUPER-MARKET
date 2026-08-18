import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Truck,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  AlertCircle,
  ChefHat,
  PackageCheck,
} from 'lucide-react';
import { sound } from '../services/soundService';

export const POSDeliveryView: React.FC = () => {
  const { deliveryOrders, updateDeliveryStatus, navigate } = usePOS();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(deliveryOrders[0]?.id || '');

  const selectedOrder = deliveryOrders.find((d) => d.id === selectedOrderId) || deliveryOrders[0];

  const handleStatusChange = (orderId: string, status: any) => {
    updateDeliveryStatus(orderId, status);
    sound.playSuccess();
  };

  const handlePrintDeliverySlip = () => {
    sound.playBarcodeBeep();
    alert('Comanda de separação e etiqueta de entrega impressas com sucesso!');
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

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Canal Delivery iFood Integrado</span>
          </div>
        </div>

        {/* 2-Column Delivery Manager Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Orders List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                Pedidos de Entrega ({deliveryOrders.length})
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {deliveryOrders.filter((d) => d.status === 'PENDING').length} Novos
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
              {deliveryOrders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase bg-slate-100 text-slate-700">
                          {order.platform}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900 animate-pulse'
                            : order.status === 'ACCEPTED'
                            ? 'bg-blue-100 text-blue-900'
                            : order.status === 'READY'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {order.status === 'PENDING'
                          ? 'Novo Pedido'
                          : order.status === 'ACCEPTED'
                          ? 'Separando'
                          : order.status === 'READY'
                          ? 'Pronto / Despacho'
                          : 'Entregue'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      Cliente: <strong>{order.customerName}</strong> • {order.items.length} itens
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 font-mono">
                      <span className="text-slate-400 text-[11px]">{order.createdAt}</span>
                      <span className="font-black text-slate-900">R$ {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Order Details Panel (7 cols) */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              {/* Order Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">
                        Pedido #{selectedOrder.orderNumber}
                      </h2>
                      <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded uppercase">
                        {selectedOrder.platform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Recebido às {selectedOrder.createdAt} • Pagamento Online Aprovado
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintDeliverySlip}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir Comanda
                  </button>
                </div>

                {/* Customer and Delivery Address */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{selectedOrder.customerName}</span>
                    <span className="text-slate-400 font-normal">• Tel: {selectedOrder.customerPhone}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>

                {/* Items to Pack */}
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" /> Itens para Separação no Estoque:
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-3 bg-white text-xs space-y-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={item.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800">{item.product.name}</span>
                        </div>
                        <div className="font-mono text-slate-900 font-bold">
                          {item.quantity} un x R$ {item.unitPrice.toFixed(2)} = R$ {item.total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between font-mono text-sm">
                  <span className="font-bold text-slate-700">Total do Pedido:</span>
                  <span className="font-black text-xl text-blue-700">
                    R$ {selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Advance Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedOrder.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, 'ACCEPTED')}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <ChefHat className="w-4 h-4" />
                    Aceitar Pedido & Iniciar Separação
                  </button>
                )}

                {selectedOrder.status === 'ACCEPTED' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, 'READY')}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <PackageCheck className="w-4 h-4" />
                    Separado & Pronto para Despacho
                  </button>
                )}

                {selectedOrder.status === 'READY' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, 'DELIVERED')}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar Entrega ao Motoboy
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
