import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import {
  User,
  ShoppingBag,
  Heart,
  Tag,
  MapPin,
  CreditCard,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { OnlineOrder, Address } from '../../types/store';

type CustomerTab =
  | 'dashboard'
  | 'pedidos'
  | 'favoritos'
  | 'cupons'
  | 'enderecos'
  | 'pagamentos'
  | 'clube'
  | 'dados';

export const CustomerMasterView: React.FC = () => {
  const {
    currentCustomer,
    logoutCustomer,
    orders,
    favoriteProductIds,
    toggleFavorite,
    addToCart,
    addresses,
    addAddress,
    savedCards,
    navigateEnv,
  } = useStore();
  const { products } = usePOS();

  const [activeTab, setActiveTab] = useState<CustomerTab>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);

  // New address modal / state
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newComplement, setNewComplement] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newZipCode, setNewZipCode] = useState('');

  const favoriteProducts = products.filter((p) => favoriteProductIds.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newNumber) return;
    addAddress({
      label: 'Novo Endereço',
      street: newStreet,
      number: newNumber,
      complement: newComplement,
      neighborhood: newNeighborhood || 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: newZipCode || '01310-100',
      isDefault: false,
    });
    setShowNewAddr(false);
    setNewStreet('');
    setNewNumber('');
    setNewComplement('');
  };

  const handleReorder = (order: OnlineOrder) => {
    order.items.forEach((it) => addToCart(it.product, it.quantity));
    navigateEnv('LOJA', '/carrinho');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 select-none bg-slate-50 min-h-screen">
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/20">
            {currentCustomer?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentCustomer?.name || 'Carlos Silva'}</h1>
              <span className="bg-amber-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {currentCustomer?.clubTier || 'BRONZE'}
              </span>
            </div>
            <p className="text-xs text-blue-200">{currentCustomer?.email || 'cliente@family.com'} • {currentCustomer?.phone || '(11) 98765-4321'}</p>
          </div>
        </div>

        {/* Clube Family Quick Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-6 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Pontos Clube Family</span>
            <span className="text-2xl font-black font-mono">{currentCustomer?.clubPoints || 2450} pts</span>
          </div>
          <div className="border-l border-white/20 pl-6">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Total de Pedidos</span>
            <span className="text-2xl font-black font-mono">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Customer Dashboard: Sidebar + Active Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'dashboard' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'pedidos' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Meus Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab('clube')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'clube' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Clube Family & Pontos</span>
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'favoritos' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Meus Favoritos ({favoriteProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cupons')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'cupons' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4 text-purple-500" />
            <span>Meus Cupons & Vouchers</span>
          </button>

          <button
            onClick={() => setActiveTab('enderecos')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'enderecos' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Endereços de Entrega</span>
          </button>

          <button
            onClick={() => setActiveTab('pagamentos')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'pagamentos' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cartões Salvos</span>
          </button>

          <button
            onClick={() => setActiveTab('dados')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition ${
              activeTab === 'dados' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Dados Cadastrais</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                logoutCustomer();
                navigateEnv('LOJA', '/');
              }}
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </aside>

        {/* Content Area (9 cols) */}
        <main className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[480px]">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Visão Geral da Conta</h2>

              {/* Quick stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Último Pedido</span>
                  <div className="text-base font-black text-slate-900 font-mono">{orders[0]?.orderNumber || '#FS-8921'}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">Em Separação</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Saldo Clube Family</span>
                  <div className="text-base font-black text-slate-900 font-mono">2.450 Pontos</div>
                  <div className="text-[11px] text-amber-700 font-bold">R$ 24,50 em vouchers</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Cupons Disponíveis</span>
                  <div className="text-base font-black text-slate-900 font-mono">3 Ativos</div>
                  <div className="text-[11px] text-purple-700 font-bold">Até 20% de desconto</div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Últimos Pedidos</h3>
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    Ver histórico completo
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-black text-slate-900 font-mono">{ord.orderNumber}</div>
                        <div className="text-[11px] text-slate-400">{ord.date} • {ord.items.length} itens</div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-blue-700 font-mono">
                          R$ {ord.total.toFixed(2).replace('.', ',')}
                        </div>
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Histórico de Pedidos</h2>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div>
                        <div className="text-base font-black text-slate-900 font-mono">{ord.orderNumber}</div>
                        <div className="text-xs text-slate-500">Realizado em {ord.date}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-blue-700 font-mono">
                          R$ {ord.total.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase">
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="text-xs space-y-1">
                      {ord.items.map((it) => (
                        <div key={it.product.id} className="flex justify-between text-slate-700">
                          <span>{it.quantity}x {it.product.name}</span>
                          <span className="font-mono font-bold">R$ {(it.product.price * it.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Entregue em: {ord.deliveryAddress.street}, {ord.deliveryAddress.number}</span>
                      </div>

                      <button
                        onClick={() => handleReorder(ord)}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Comprar Novamente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLUBE FAMILY */}
          {activeTab === 'clube' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Programa de Fidelidade Clube Family</h2>
                  <p className="text-xs text-slate-500">Cada R$ 1 em compras = 1 ponto. Resgate vouchers em dinheiro no caixa ou online.</p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl text-blue-950 space-y-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-950/80">Seu Nível Atual</span>
                    <h3 className="text-3xl font-black">Nível Ouro</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-mono">2.450 pts</span>
                    <span className="text-xs font-bold block text-blue-950/80">Saldo Disponível</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-blue-950/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-950 h-3 rounded-full w-3/4" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-blue-950/80">
                    <span>Ouro (2.000 pts)</span>
                    <span>Faltam 550 pts para Diamante</span>
                    <span>Diamante (3.000 pts)</span>
                  </div>
                </div>
              </div>

              {/* Redeem vouchers grid */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Vouchers para Resgatar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-black text-amber-700">500 Pontos</span>
                    <div className="text-lg font-black text-slate-900">R$ 5,00 OFF</div>
                    <button
                      onClick={() => alert('Voucher de R$ 5,00 gerado com sucesso! Utilize o cupom: CLUBE5OFF')}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition"
                    >
                      Resgatar
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-black text-amber-700">1.000 Pontos</span>
                    <div className="text-lg font-black text-slate-900">R$ 10,00 OFF</div>
                    <button
                      onClick={() => alert('Voucher de R$ 10,00 gerado com sucesso! Utilize o cupom: CLUBE10OFF')}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition"
                    >
                      Resgatar
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-black text-amber-700">2.000 Pontos</span>
                    <div className="text-lg font-black text-slate-900">R$ 20,00 OFF</div>
                    <button
                      onClick={() => alert('Voucher de R$ 20,00 gerado com sucesso! Utilize o cupom: CLUBE20OFF')}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition"
                    >
                      Resgatar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAVORITOS */}
          {activeTab === 'favoritos' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Meus Produtos Favoritos ({favoriteProducts.length})</h2>

              {favoriteProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Heart className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">Você ainda não adicionou nenhum produto aos favoritos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map((prod) => (
                    <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                      <div className="h-32 flex items-center justify-center">
                        <img src={prod.image} alt={prod.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{prod.category}</div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{prod.name}</h4>
                        <div className="text-sm font-black text-blue-700 font-mono mt-1">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="flex-1 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition"
                        >
                          Comprar
                        </button>
                        <button
                          onClick={() => toggleFavorite(prod.id)}
                          className="p-2 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CUPONS */}
          {activeTab === 'cupons' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Cupons Ativos & Vouchers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-purple-950 font-mono bg-purple-200 px-2 py-0.5 rounded">
                      BEMVINDO10
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold">10% OFF</span>
                  </div>
                  <p className="text-xs text-purple-900">Válido para a primeira compra em todo o site.</p>
                  <div className="text-[10px] text-purple-600">Válido até 31/12/2025</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-amber-950 font-mono bg-amber-200 px-2 py-0.5 rounded">
                      FAMILY50
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold">R$ 50 OFF</span>
                  </div>
                  <p className="text-xs text-amber-900">Em compras acima de R$ 250 em carnes e vinhos.</p>
                  <div className="text-[10px] text-amber-600">Válido até 30/06/2025</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENDEREÇOS */}
          {activeTab === 'enderecos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">Endereços de Entrega</h2>
                <button
                  onClick={() => setShowNewAddr(!showNewAddr)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Endereço
                </button>
              </div>

              {showNewAddr && (
                <form onSubmit={handleCreateAddress} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-black text-slate-900">Cadastrar Novo Endereço</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="Rua / Avenida"
                      required
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                      placeholder="Número"
                      required
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={newComplement}
                      onChange={(e) => setNewComplement(e.target.value)}
                      placeholder="Complemento (Apto, Bloco)"
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={newZipCode}
                      onChange={(e) => setNewZipCode(e.target.value)}
                      placeholder="CEP"
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    Salvar Endereço
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-black text-slate-900">{addr.label}</div>
                      <div className="text-xs text-slate-600">{addr.street}, {addr.number} - {addr.complement}</div>
                      <div className="text-[11px] text-slate-400">{addr.neighborhood} - {addr.city}/{addr.state} • CEP {addr.zipCode}</div>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Padrão
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAGAMENTOS & DADOS */}
          {activeTab === 'pagamentos' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Cartões Salvos & Formas de Pagamento</h2>
              <div className="space-y-3">
                {savedCards.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                        MC
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{c.cardNumberMasked}</div>
                        <div className="text-[11px] text-slate-500">{c.cardHolderName} • Expira em {c.expirationDate}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      Principal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Dados Cadastrais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nome Completo</span>
                  <strong className="text-slate-900 text-sm">{currentCustomer?.name || 'Carlos Silva'}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">CPF</span>
                  <strong className="text-slate-900 text-sm">{currentCustomer?.cpf || '123.456.789-00'}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">E-mail</span>
                  <strong className="text-slate-900 text-sm">{currentCustomer?.email || 'cliente@family.com'}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone</span>
                  <strong className="text-slate-900 text-sm">{currentCustomer?.phone || '(11) 98765-4321'}</strong>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
