import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Settings,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  Download,
  Upload,
  Copy,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  Calendar,
  Layers,
  Award,
  CreditCard,
  Building,
  KeyRound,
  FileCheck2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Eye,
} from 'lucide-react';
import { FamilyLogo } from '../../components/common/FamilyLogo';
import { Product } from '../../types/pos';
import { OnlineOrder } from '../../types/store';

export type AdminModuleType =
  | 'dashboard'
  | 'vendas'
  | 'produtos'
  | 'estoque'
  | 'clientes'
  | 'financeiro'
  | 'relatorios'
  | 'pedidos_online'
  | 'fiscal'
  | 'config';

export const AdminMasterView: React.FC = () => {
  const { products, salesHistory, activeCashShift } = usePOS();
  const { orders, currentCustomer, navigateEnv, adminActiveTab, setAdminActiveTab, selectedBranch } = useStore();

  // Local active module fallback to context
  const activeModule = (adminActiveTab as AdminModuleType) || 'dashboard';
  const setActiveModule = (mod: AdminModuleType) => setAdminActiveTab(mod);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedProductEdit, setSelectedProductEdit] = useState<Product | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OnlineOrder | null>(null);

  // Stats calculation
  const totalSalesToday = salesHistory.reduce((acc, s) => acc + s.total, 0) + 14580.9;
  const totalOrdersCount = salesHistory.length + orders.length + 142;
  const avgTicket = (totalSalesToday / totalOrdersCount) || 85.5;
  const lowStockProducts = products.filter((p) => p.stock < 15);
  const lowStockCount = lowStockProducts.length;

  // New product mock state
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'MERCEARIA',
    price: '',
    clubPrice: '',
    cost: '',
    stock: '',
    ean: '',
    brand: '',
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col select-none font-sans">
      {/* Sub-bar showing active branch & environment */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            <span>Unidade: {selectedBranch}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 font-mono">Ambiente Administrativo & ERP</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateEnv('PDV', '/pos')}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Frente de Caixa (PDV)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Nav */}
        <aside className="w-64 bg-slate-950/80 border-r border-slate-800 p-4 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">
            Módulos Principais
          </div>

          <button
            onClick={() => setActiveModule('dashboard')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Dashboard Executivo</span>
          </button>

          <button
            onClick={() => setActiveModule('vendas')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'vendas' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>2. Vendas & Operadores</span>
          </button>

          <button
            onClick={() => setActiveModule('produtos')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'produtos' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>3. Produtos & Preços</span>
          </button>

          <button
            onClick={() => setActiveModule('estoque')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'estoque' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>4. Estoque & Validade</span>
          </button>

          <button
            onClick={() => setActiveModule('clientes')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'clientes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>5. Clientes & CRM</span>
          </button>

          <button
            onClick={() => setActiveModule('financeiro')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'financeiro' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>6. Financeiro & DRE</span>
          </button>

          <button
            onClick={() => setActiveModule('relatorios')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'relatorios' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>7. Relatórios & Curva ABC</span>
          </button>

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 pt-4 pb-2">
            Operações & Fiscal
          </div>

          <button
            onClick={() => setActiveModule('pedidos_online')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'pedidos_online' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Pedidos & Delivery</span>
          </button>

          <button
            onClick={() => setActiveModule('fiscal')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'fiscal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Fiscal NFC-e / SAT</span>
          </button>

          <button
            onClick={() => setActiveModule('config')}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition cursor-pointer ${
              activeModule === 'config' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & Auditoria</span>
          </button>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-900 space-y-6">
          {/* ==========================================
              1. DASHBOARD MODULE (/admin)
             ========================================== */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Dashboard Executivo — {selectedBranch}</h2>
                  <p className="text-xs text-slate-400">
                    Visão geral da operação: faturamento, vendas, pedidos, ticket médio, clientes e ruptura em tempo real.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sincronização Ativa
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Faturamento Hoje</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    R$ {totalSalesToday.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% vs. dia anterior
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Total de Pedidos</span>
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{totalOrdersCount}</div>
                  <div className="text-[11px] text-blue-400 font-bold">PDV: 128 | Delivery: 22</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Ticket Médio</span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    R$ {avgTicket.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-[11px] text-purple-400 font-bold">Meta: R$ 80,00 (+6.8%)</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Alerta de Ruptura</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">{lowStockCount} itens</div>
                  <div className="text-[11px] text-amber-300 font-bold">Estoque &lt; 15 unidades</div>
                </div>
              </div>

              {/* Grid: Produtos Mais Vendidos + Últimas Transações */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2 cols: Recent Transactions Table */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Atividade Recente & Vendas
                    </h3>
                    <button
                      onClick={() => setActiveModule('vendas')}
                      className="text-xs text-blue-400 hover:underline font-bold"
                    >
                      Ver todas &gt;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="pb-3">Comprovante</th>
                          <th className="pb-3">Canal</th>
                          <th className="pb-3">Cliente / Operador</th>
                          <th className="pb-3">Forma Pagto</th>
                          <th className="pb-3 text-right">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {salesHistory.slice(0, 4).map((sale) => (
                          <tr key={sale.id} className="text-slate-300 hover:bg-slate-900/50">
                            <td className="py-3 font-bold text-blue-400">{sale.receiptNumber}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded text-[10px] font-bold">
                                PDV
                              </span>
                            </td>
                            <td className="py-3 font-sans text-slate-200">{sale.operatorName}</td>
                            <td className="py-3">{sale.paymentMethod}</td>
                            <td className="py-3 text-right font-black text-emerald-400">
                              R$ {sale.total.toFixed(2).replace('.', ',')}
                            </td>
                          </tr>
                        ))}
                        {orders.slice(0, 3).map((ord) => (
                          <tr key={ord.id} className="text-slate-300 hover:bg-slate-900/50">
                            <td className="py-3 font-bold text-purple-400">{ord.orderNumber}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded text-[10px] font-bold">
                                E-commerce
                              </span>
                            </td>
                            <td className="py-3 font-sans text-slate-200">{ord.customer.name}</td>
                            <td className="py-3">{ord.paymentMethod}</td>
                            <td className="py-3 text-right font-black text-emerald-400">
                              R$ {ord.total.toFixed(2).replace('.', ',')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 1 col: Produtos Mais Vendidos */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Produtos Mais Vendidos
                  </h3>

                  <div className="space-y-3">
                    {products.slice(0, 5).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                          <div>
                            <div className="font-bold text-white truncate max-w-[120px]">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.category}</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="font-bold text-emerald-400">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                          <div className="text-[10px] text-slate-500">{p.stock} un vendidas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              2. VENDAS MODULE (/admin/vendas)
             ========================================== */}
          {activeModule === 'vendas' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Vendas & Operações Comerciais</h2>
                  <p className="text-xs text-slate-400">
                    Acompanhe vendas realizadas, cancelamentos, devoluções, formas de pagamento e operadores de caixa.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Relatório analítico de vendas exportado com sucesso.')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Exportar Vendas
                  </button>
                </div>
              </div>

              {/* Vendas Sub-Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Vendas Concluídas</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">150 vendas</div>
                  <div className="text-[10px] text-slate-500">100% liquidadas</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Cancelamentos</div>
                  <div className="text-xl font-black text-rose-400 font-mono mt-1">2 cupons</div>
                  <div className="text-[10px] text-slate-500">R$ 142,00 estornados</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Trocas & Devoluções</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">1 operação</div>
                  <div className="text-[10px] text-slate-500">Vale compras gerado</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Maior Operador</div>
                  <div className="text-xl font-black text-blue-400 font-sans mt-1">Ana Paula</div>
                  <div className="text-[10px] text-slate-500">Caixa 01 (54 vendas)</div>
                </div>
              </div>

              {/* Vendas List */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Histórico Geral de Cupons Fiscais & Vendas
                  </h3>
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por cupom, operador ou cliente..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">Cupom / ID</th>
                        <th className="pb-3">Data / Hora</th>
                        <th className="pb-3">Operador / Canal</th>
                        <th className="pb-3">Itens</th>
                        <th className="pb-3">Pagamento</th>
                        <th className="pb-3 text-right">Desconto</th>
                        <th className="pb-3 text-right">Valor Total</th>
                        <th className="pb-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {salesHistory.map((sale) => (
                        <tr key={sale.id} className="text-slate-300 hover:bg-slate-900/50">
                          <td className="py-3 font-bold text-blue-400">{sale.receiptNumber}</td>
                          <td className="py-3 text-slate-400 font-sans">{sale.date}</td>
                          <td className="py-3 font-sans text-white">{sale.operatorName}</td>
                          <td className="py-3">{sale.items.length} itens</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 text-right text-rose-400 font-bold">
                            {sale.discount > 0 ? `- R$ ${sale.discount.toFixed(2).replace('.', ',')}` : '-'}
                          </td>
                          <td className="py-3 text-right font-black text-emerald-400">
                            R$ {sale.total.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 text-center font-sans">
                            <button
                              onClick={() => alert(`Detalhes do cupom ${sale.receiptNumber}:\nTotal: R$ ${sale.total.toFixed(2)}\nOperador: ${sale.operatorName}`)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              3. PRODUTOS MODULE (/admin/produtos)
             ========================================== */}
          {activeModule === 'produtos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Catálogo & Cadastro de Produtos</h2>
                  <p className="text-xs text-slate-400">
                    Cadastrar, editar, duplicar, ativar/desativar, importar/exportar, alterar preços e margens de venda.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Importação de XML de Notas de Fornecedor acionada.')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Importar XML
                  </button>
                  <button
                    onClick={() => setShowNewProductModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Novo Produto
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar por nome, código de barras EAN ou marca..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-2xl px-4 py-2.5 focus:outline-none"
                  >
                    <option value="ALL">Todas as Categorias</option>
                    <option value="HORTIFRUTI">Hortifruti</option>
                    <option value="ACOUGUE">Açougue</option>
                    <option value="BEBIDAS">Bebidas</option>
                    <option value="PADARIA">Padaria</option>
                    <option value="MERCEARIA">Mercearia</option>
                    <option value="LIMPEZA">Limpeza</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">EAN / SKU</th>
                        <th className="pb-3">Produto</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3 text-right">Estoque</th>
                        <th className="pb-3 text-right">Preço Venda</th>
                        <th className="pb-3 text-right">Preço Clube</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products
                        .filter((p) => {
                          const matchSearch =
                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.ean.includes(searchTerm) ||
                            (p.barcode && p.barcode.includes(searchTerm));
                          const matchCat = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;
                          return matchSearch && matchCat;
                        })
                        .map((prod) => (
                          <tr key={prod.id} className="text-slate-300 hover:bg-slate-900/50">
                            <td className="py-3 font-mono text-slate-400">{prod.ean || prod.barcode}</td>
                            <td className="py-3 font-bold text-white flex items-center gap-2">
                              <img src={prod.image} alt={prod.name} className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                              <span
                                onClick={() => setSelectedProductDetails(prod)}
                                className="hover:text-blue-400 cursor-pointer underline decoration-dotted"
                              >
                                {prod.name}
                              </span>
                            </td>
                            <td className="py-3 font-medium text-slate-400">{prod.category}</td>
                            <td className="py-3 text-right font-mono font-bold">
                              <span className={prod.stock < 15 ? 'text-amber-400' : 'text-slate-300'}>
                                {prod.stock} {prod.unit}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono font-black text-emerald-400">
                              R$ {prod.price.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-amber-400">
                              {prod.clubPrice ? `R$ ${prod.clubPrice.toFixed(2).replace('.', ',')}` : '-'}
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full text-[10px] font-bold">
                                Ativo
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedProductDetails(prod)}
                                  title="Ver Detalhes"
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setSelectedProductEdit(prod)}
                                  title="Editar Produto"
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 transition cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => alert(`Produto ${prod.name} duplicado com sucesso.`)}
                                  title="Duplicar Produto"
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-purple-400 transition cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              4. ESTOQUE MODULE (/admin/estoque)
             ========================================== */}
          {activeModule === 'estoque' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Controle de Estoque & Ruptura</h2>
                  <p className="text-xs text-slate-400">
                    Estoque atual, ponto de reposição, estoque zerado, entradas XML, lotes, validade e perdas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Inventário físico iniciado.')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer"
                  >
                    Iniciar Inventário
                  </button>
                </div>
              </div>

              {/* Estoque Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Total de Itens em Estoque</div>
                  <div className="text-xl font-black text-white font-mono mt-1">4.820 un</div>
                  <div className="text-[10px] text-emerald-400 font-bold">98.2% abastecido</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Itens com Estoque Baixo</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">{lowStockCount} itens</div>
                  <div className="text-[10px] text-amber-300">Necessita compra</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Itens Zerados</div>
                  <div className="text-xl font-black text-rose-400 font-mono mt-1">0 itens</div>
                  <div className="text-[10px] text-emerald-400">Sem ruptura total</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Próximos do Vencimento</div>
                  <div className="text-xl font-black text-purple-400 font-mono mt-1">3 lotes</div>
                  <div className="text-[10px] text-slate-500">Validade &lt; 7 dias</div>
                </div>
              </div>

              {/* Low stock alert table */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Produtos em Ponto de Reposição Crítico (&lt; 15 unidades)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">Produto</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3 text-right">Estoque Atual</th>
                        <th className="pb-3 text-right">Estoque Mínimo</th>
                        <th className="pb-3 text-right">Sugestão de Compra</th>
                        <th className="pb-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {lowStockProducts.map((prod) => (
                        <tr key={prod.id} className="text-slate-300 hover:bg-slate-900/50">
                          <td className="py-3 font-bold text-white flex items-center gap-2">
                            <img src={prod.image} alt={prod.name} className="w-7 h-7 object-contain bg-white rounded p-0.5" />
                            <span>{prod.name}</span>
                          </td>
                          <td className="py-3 text-slate-400">{prod.category}</td>
                          <td className="py-3 text-right font-mono font-black text-amber-400">
                            {prod.stock} {prod.unit}
                          </td>
                          <td className="py-3 text-right font-mono text-slate-400">15 {prod.unit}</td>
                          <td className="py-3 text-right font-mono font-bold text-emerald-400">
                            + {30 - prod.stock} {prod.unit}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => alert(`Pedido de compra gerado para ${prod.name}`)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Gerar Pedido
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              5. CLIENTES MODULE (/admin/clientes)
             ========================================== */}
          {activeModule === 'clientes' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Gestão de Clientes & CRM</h2>
                  <p className="text-xs text-slate-400">
                    Cadastro de clientes, histórico de compras, ticket médio, favoritos, cupons e Clube Family.
                  </p>
                </div>
                <button
                  onClick={() => alert('Novo cliente cadastrado.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Cadastrar Cliente
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Total Clientes Cadastrados</div>
                  <div className="text-xl font-black text-white font-mono mt-1">2.450 clientes</div>
                  <div className="text-[10px] text-emerald-400 font-bold">+38 novos esta semana</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Membros Ativos Clube Family</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">1.890 membros</div>
                  <div className="text-[10px] text-slate-500">77% de engajamento</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Pontos Acumulados no Mês</div>
                  <div className="text-xl font-black text-purple-400 font-mono mt-1">142.500 pts</div>
                  <div className="text-[10px] text-slate-500">R$ 7.125 em vouchers</div>
                </div>
              </div>

              {/* Clientes Table */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Base de Clientes & Hábitos de Consumo
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">CPF</th>
                        <th className="pb-3">Contato</th>
                        <th className="pb-3 text-right">Pontos Clube</th>
                        <th className="pb-3 text-center">Nível</th>
                        <th className="pb-3 text-right">Total Gasto</th>
                        <th className="pb-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { name: 'Carlos Silva', cpf: '123.456.789-00', phone: '(11) 98765-4321', points: 1450, tier: 'Diamante', spent: 3420.5 },
                        { name: 'Mariana Costa', cpf: '987.654.321-11', phone: '(11) 97123-4567', points: 820, tier: 'Ouro', spent: 1890.0 },
                        { name: 'Roberto Almeida', cpf: '456.789.123-22', phone: '(11) 96543-2198', points: 410, tier: 'Prata', spent: 940.2 },
                      ].map((c) => (
                        <tr key={c.cpf} className="text-slate-300 hover:bg-slate-900/50">
                          <td className="py-3 font-bold text-white">{c.name}</td>
                          <td className="py-3 font-mono text-slate-400">{c.cpf}</td>
                          <td className="py-3 font-sans text-slate-400">{c.phone}</td>
                          <td className="py-3 text-right font-mono font-bold text-emerald-400">{c.points} pts</td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded-full font-bold text-[10px]">
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono font-black text-white">
                            R$ {c.spent.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => alert(`Histórico de ${c.name} aberto.`)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Ver Histórico
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              6. FINANCEIRO MODULE (/admin/financeiro)
             ========================================== */}
          {activeModule === 'financeiro' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Gestão Financeira & Fluxo de Caixa</h2>
                  <p className="text-xs text-slate-400">
                    Faturamento, entradas, saídas, contas a pagar/receber, custos de mercadoria e margem de lucro.
                  </p>
                </div>
                <button
                  onClick={() => alert('DRE Gerencial gerado.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Exportar DRE
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Faturamento Bruto (Mês)</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">R$ 384.920,00</div>
                  <div className="text-[10px] text-emerald-400 font-bold">+12.4% vs mês anterior</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Custo de Mercadorias (CMV)</div>
                  <div className="text-xl font-black text-rose-400 font-mono mt-1">R$ 242.500,00</div>
                  <div className="text-[10px] text-slate-500">63% do faturamento</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Margem Bruta Média</div>
                  <div className="text-xl font-black text-blue-400 font-mono mt-1">37.0%</div>
                  <div className="text-[10px] text-blue-400">Meta atingida (&gt; 35%)</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Lucro Líquido Estimado</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">R$ 58.420,00</div>
                  <div className="text-[10px] text-emerald-400 font-bold">15.2% margem líquida</div>
                </div>
              </div>

              {/* Fluxo de Caixa Recente */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Demonstrativo de Entradas e Saídas Recentes
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">Data</th>
                        <th className="pb-3">Tipo</th>
                        <th className="pb-3">Descrição / Origem</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3 text-right">Valor</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {[
                        { date: '18/02 12:40', type: 'ENTRADA', desc: 'Vendas PDV Loja 01 (Turno Manhã)', cat: 'Venda de Balcão', val: 8420.0, st: 'Realizado' },
                        { date: '18/02 11:15', type: 'ENTRADA', desc: 'Recebimentos E-commerce Pix', cat: 'Vendas Digitais', val: 2150.9, st: 'Realizado' },
                        { date: '18/02 09:30', type: 'SAIDA', desc: 'Pagamento Fornecedor Ambev LTDA', cat: 'Fornecedores', val: -4500.0, st: 'Liquidado' },
                        { date: '18/02 08:00', type: 'SAIDA', desc: 'Suprimento Abertura Caixas', cat: 'Frente de Caixa', val: -600.0, st: 'Em trânsito' },
                      ].map((item, idx) => (
                        <tr key={idx} className="text-slate-300 hover:bg-slate-900/50">
                          <td className="py-3 font-sans text-slate-400">{item.date}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.type === 'ENTRADA'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-rose-950 text-rose-400'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 font-sans text-white">{item.desc}</td>
                          <td className="py-3 font-sans text-slate-400">{item.cat}</td>
                          <td
                            className={`py-3 text-right font-black ${
                              item.val > 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            R$ {Math.abs(item.val).toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 text-center font-sans">
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[10px]">
                              {item.st}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              7. RELATÓRIOS MODULE (/admin/relatorios)
             ========================================== */}
          {activeModule === 'relatorios' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Relatórios Gerenciais & Curva ABC</h2>
                  <p className="text-xs text-slate-400">
                    Relatórios consolidados de vendas, estoque, compras, clientes, perdas e rentabilidade por produto.
                  </p>
                </div>
                <button
                  onClick={() => alert('Todos os relatórios do mês exportados em PDF/Excel.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Exportar Pacote Completo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Curva ABC de Vendas (Classe A)</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">20% dos itens</div>
                  <div className="text-[11px] text-slate-500">Respondem por 78.4% do faturamento da loja.</div>
                  <button
                    onClick={() => alert('Relatório Curva ABC gerado.')}
                    className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold"
                  >
                    Gerar Curva ABC
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Relatório de Perdas & Avarias</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">0.8% do estoque</div>
                  <div className="text-[11px] text-slate-500">Abaixo da média do setor supermercadista (1.5%).</div>
                  <button
                    onClick={() => alert('Relatório de Perdas gerado.')}
                    className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold"
                  >
                    Gerar Relatório de Perdas
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Desempenho por Departamento</div>
                  <div className="text-2xl font-black text-purple-400 font-mono">Açougue (32%)</div>
                  <div className="text-[11px] text-slate-500">Seguido por Hortifruti (24%) e Bebidas (18%).</div>
                  <button
                    onClick={() => alert('Relatório de Departamentos gerado.')}
                    className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-xl text-xs font-bold"
                  >
                    Gerar Relatório por Setor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              PEDIDOS ONLINE & DELIVERY MODULE
             ========================================== */}
          {activeModule === 'pedidos_online' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Pedidos E-commerce & Separação Delivery</h2>
                  <p className="text-xs text-slate-400">
                    Acompanhamento em tempo real do picking/separação de itens frescos e rota dos motoristas Family Express.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="pb-3">Pedido</th>
                        <th className="pb-3">Data / Hora</th>
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Entrega</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Valor Total</th>
                        <th className="pb-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="text-slate-300 hover:bg-slate-900/50">
                          <td className="py-3 font-bold text-purple-400">{ord.orderNumber}</td>
                          <td className="py-3 font-sans text-slate-400">{ord.date}</td>
                          <td className="py-3 font-sans text-white">{ord.customer.name}</td>
                          <td className="py-3 font-sans text-slate-400">{ord.deliveryMethod}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded font-bold text-[10px]">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-black text-emerald-400">
                            R$ {ord.total.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 text-center font-sans">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Ver Separação
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              FISCAL & SAT MODULE
             ========================================== */}
          {activeModule === 'fiscal' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Módulo Fiscal & Transmissão NFC-e / SAT</h2>
                  <p className="text-xs text-slate-400">SEFAZ SP em produção, contingência offline automática e exportação SPED.</p>
                </div>
                <button
                  onClick={() => alert('Lote de arquivos XML SPED exportado com sucesso.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Exportar XML SPED
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Certificado Digital A1</span>
                  <div className="text-sm font-black text-emerald-400">Válido até 12/2026</div>
                  <div className="text-[11px] text-slate-500">CNPJ: 12.345.678/0001-90</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Status SEFAZ SP</span>
                  <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online (Latência: 180ms)
                  </div>
                  <div className="text-[11px] text-slate-500">Ambiente de Produção Homologado</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Notas Emitidas Hoje</span>
                  <div className="text-sm font-black text-blue-400 font-mono">142 NFC-e Transmitidas</div>
                  <div className="text-[11px] text-slate-500">0 notas em contingência</div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              CONFIGURAÇÕES & AUDITORIA MODULE
             ========================================== */}
          {activeModule === 'config' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Configurações do Sistema & Auditoria</h2>
                  <p className="text-xs text-slate-400">Gestão de operadores, níveis de acesso, senhas e logs de auditoria.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Usuários & Níveis de Acesso
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Administrador Geral</div>
                        <div className="text-[10px] text-slate-400">Acesso total (ERP, PDV, Fiscal)</div>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 font-bold text-[10px] rounded">Ativo</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Operador de Caixa (Ana Paula)</div>
                        <div className="text-[10px] text-slate-400">Acesso restrito ao PDV</div>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 font-bold text-[10px] rounded">Ativo</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Auditoria & Logs de Segurança
                  </h3>
                  <div className="space-y-2 text-xs text-slate-400 font-mono">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      [18/02 12:50] Abertura de Caixa PDV 01 por Ana Paula
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg">
                      [18/02 11:30] Alteração de preço Produto #prod-001 por Admin
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg">
                      [18/02 09:15] Transmissão de Lote NFC-e SEFAZ SP aprovada
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Product Details Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProductDetails.image}
                  alt={selectedProductDetails.name}
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1"
                />
                <div>
                  <h3 className="text-base font-black text-white">{selectedProductDetails.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">EAN: {selectedProductDetails.ean} • SKU: {selectedProductDetails.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProductDetails(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 font-bold block">Preço de Venda Padrão</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  R$ {selectedProductDetails.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 font-bold block">Preço Clube Family</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {selectedProductDetails.clubPrice ? `R$ ${selectedProductDetails.clubPrice.toFixed(2).replace('.', ',')}` : 'Não cadastrado'}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 font-bold block">Estoque Físico Atual</span>
                <span className="text-base font-black text-white font-mono">
                  {selectedProductDetails.stock} {selectedProductDetails.unit}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 font-bold block">Categoria / Setor</span>
                <span className="text-base font-bold text-blue-400">{selectedProductDetails.category}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigateEnv('LOJA', `/produtos/${selectedProductDetails.id}`);
                  setSelectedProductDetails(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase"
              >
                Abrir na Loja Online
              </button>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Cadastrar Novo Produto</h3>
              <button onClick={() => setShowNewProductModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  placeholder="Ex: Cerveja Corona Extra 330ml"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Preço de Venda (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="9,90"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Preço Clube Family (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="8,90"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Estoque Inicial:</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Código EAN / Barras:</label>
                  <input
                    type="text"
                    placeholder="7891234567890"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setShowNewProductModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Produto cadastrado com sucesso e sincronizado no PDV e na Loja Online.');
                  setShowNewProductModal(false);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase shadow-sm"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer with mandatory credits */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-3 text-center text-xs text-slate-500">
        <p>Desenvolvido por <strong className="text-slate-300 font-bold">Vini Amaral</strong> • Mantido por <strong>DEEVO Financeiras</strong> • Family Supermarket v2.5 Enterprise</p>
      </footer>
    </div>
  );
};
