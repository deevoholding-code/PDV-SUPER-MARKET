import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Search,
  ScanBarcode,
  Store,
  Bell,
  Headphones,
  ShoppingBag,
  Calculator,
  User,
  LayoutDashboard,
  Boxes,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  CreditCard,
  Phone,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Tag,
  Gift,
  Clock,
  Layers,
  Award,
  ArrowRight,
  SlidersHorizontal,
  Lock,
  Smartphone,
  Eye,
  KeyRound,
  FileCheck2,
  HelpCircle,
  BookOpen,
  Plus,
  PieChart,
} from 'lucide-react';
import { FamilyLogo } from './FamilyLogo';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import { AppEnvironment } from '../../types/store';

interface GlobalEnvironmentNavProps {
  currentEnv?: AppEnvironment;
  onChangeEnv?: (env: AppEnvironment, subRoute?: string) => void;
  onlineCartCount?: number;
}

export const GlobalEnvironmentNav: React.FC<GlobalEnvironmentNavProps> = ({
  currentEnv: propEnv,
  onChangeEnv: propChangeEnv,
}) => {
  const {
    currentEnv: storeEnv,
    navigateEnv,
    selectedBranch,
    setSelectedBranch,
    adminActiveTab,
    setAdminActiveTab,
    orders,
    cart,
  } = useStore();
  const { products, salesHistory, openModal, setPriceLookupModalOpen } = usePOS();

  const currentEnv = propEnv ?? storeEnv;
  const onChangeEnv = propChangeEnv ?? navigateEnv;

  // Dropdown & Modal states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showBarcodeScannerModal, setShowBarcodeScannerModal] = useState(false);
  const [scannedCodeInput, setScannedCodeInput] = useState('');

  // Notifications State
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'critical' | 'orders' | 'expiry'>('all');
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'critical',
      title: 'Estoque Crítico: Picanha Bovina Angus',
      desc: 'Restam apenas 6 unidades na Loja 01 — Matriz. Ponto de reposição atingido.',
      time: 'Há 4 min',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'orders',
      title: 'Novo Pedido E-commerce #FS-8921',
      desc: 'Valor R$ 184,50 pago via Pix. Aguardando separação.',
      time: 'Há 12 min',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'expiry',
      title: 'Lote Próximo do Vencimento: Queijo Minas 500g',
      desc: '15 unidades do lote #QM-204 vencem em 3 dias. Sugerido aplicar desconto.',
      time: 'Há 35 min',
      read: false,
    },
    {
      id: 'notif-4',
      type: 'orders',
      title: 'Entrega Finalizada com Sucesso',
      desc: 'Pedido #FS-8750 entregue no endereço Av. Paulista, 1200.',
      time: 'Há 1 hora',
      read: true,
    },
    {
      id: 'notif-5',
      type: 'critical',
      title: 'Transmissão Fiscal NFC-e SEFAZ',
      desc: 'Lote de 58 notas sincronizado em ambiente de produção com 100% de sucesso.',
      time: 'Há 2 horas',
      read: true,
    },
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'products' | 'orders' | 'customers'>('all');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setShowNotifications(false);
        setShowStoreSelector(false);
        setShowUserMenu(false);
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search items
  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query.length >= 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.ean.includes(query) ||
          (p.barcode && p.barcode.includes(query))
      ).slice(0, 5)
    : [];

  const filteredOrders = query.length >= 2
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.customer.cpf.includes(query)
      ).slice(0, 3)
    : [];

  const filteredCustomers = query.length >= 2
    ? [
        { name: 'Carlos Silva', cpf: '123.456.789-00', phone: '(11) 98765-4321', points: 1450, tier: 'Diamante' },
        { name: 'Mariana Costa', cpf: '987.654.321-11', phone: '(11) 97123-4567', points: 820, tier: 'Ouro' },
      ].filter((c) => c.name.toLowerCase().includes(query) || c.cpf.includes(query))
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigateAdminTab = (tab: string) => {
    setAdminActiveTab(tab);
    onChangeEnv('ADMIN', `/admin/${tab}`);
    setOpenDropdown(null);
    setShowDrawer(false);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCodeInput.trim()) return;
    const found = products.find((p) => p.ean === scannedCodeInput.trim() || p.barcode === scannedCodeInput.trim() || p.id === scannedCodeInput.trim());
    if (found) {
      setShowBarcodeScannerModal(false);
      setScannedCodeInput('');
      onChangeEnv('LOJA', `/produtos/${found.id}`);
    } else {
      alert(`Produto com código "${scannedCodeInput}" não encontrado.`);
    }
  };

  return (
    <header ref={dropdownRef} className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs select-none">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 space-y-3">
        {/* ROW 1: [☰] [LOGO] Dashboard | Vendas | Produtos | Estoque | Clientes | Financeiro | Relatórios */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 overflow-hidden">
            {/* 16. Menu Lateral / Módulos Button (☰) */}
            <button
              onClick={() => setShowDrawer(true)}
              className="px-2.5 py-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs group"
              title="Abrir Menu Completo de Módulos (24 Módulos do Sistema)"
            >
              <Menu className="w-4 h-4 text-slate-800 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline text-slate-700">Módulos</span>
            </button>

            {/* 1. Logo Family Supermarket -> Retorna para Home Pública / */}
            <div
              onClick={() => {
                onChangeEnv('LOJA', '/');
              }}
              className="cursor-pointer shrink-0 transition hover:opacity-95"
              title="Family Supermarket - Ir para a Home"
            >
              <FamilyLogo variant="color" size="md" />
            </div>

            {/* Top Primary Navigation Links with Dropdown Menus - Always visible across desktop and tablets */}
            <nav className="flex items-center gap-0.5 sm:gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-slate-700 overflow-x-auto no-scrollbar">
              {/* 2. Dashboard (/admin) */}
              <button
                onClick={() => handleNavigateAdminTab('dashboard')}
                className={`px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1.5 rounded-lg cursor-pointer ${
                  currentEnv === 'ADMIN' && adminActiveTab === 'dashboard'
                    ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>Dashboard</span>
              </button>

              {/* 3. Vendas Dropdown (/admin/vendas) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'vendas' ? null : 'vendas')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'vendas') || openDropdown === 'vendas'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Vendas</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'vendas' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Operações Comerciais & PDV</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('vendas')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Vendas Realizadas</div>
                          <div className="text-[10px] text-slate-400 font-normal">Histórico de cupons e comprovantes</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('vendas')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>Vendas do Período & Operadores</div>
                          <div className="text-[10px] text-slate-400 font-normal">Métricas de caixas e turnos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('vendas')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Formas de Pagamento</div>
                          <div className="text-[10px] text-slate-400 font-normal">Pix, cartões, dinheiro e convênio</div>
                        </div>
                      </button>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onChangeEnv('PDV', '/pos');
                          setOpenDropdown(null);
                        }}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-between transition"
                      >
                        <span className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" /> Acessar Frente de Caixa (PDV)
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Produtos Dropdown (/admin/produtos) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'produtos' ? null : 'produtos')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'produtos') || openDropdown === 'produtos'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Produtos</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'produtos' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Catálogo & Preços</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('produtos')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Package className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Catálogo Geral de Produtos</div>
                          <div className="text-[10px] text-slate-400 font-normal">Listar, buscar e gerenciar estoque</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('produtos')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Cadastrar Novo Produto</div>
                          <div className="text-[10px] text-slate-400 font-normal">Inclusão rápida com código de barras EAN</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('produtos')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Tag className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>Tabela de Preços & Clube Family</div>
                          <div className="text-[10px] text-slate-400 font-normal">Alterar preços normais e promocionais</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onChangeEnv('LOJA', '/produtos');
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>Vitrine da Loja Online</div>
                          <div className="text-[10px] text-slate-400 font-normal">Visualizar como os clientes veem no e-commerce</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Estoque Dropdown (/admin/estoque) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'estoque' ? null : 'estoque')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'estoque') || openDropdown === 'estoque'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Estoque</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'estoque' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Controle de Estoque & Perdas</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('estoque')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Boxes className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>Estoque Atual & Posição Física</div>
                          <div className="text-[10px] text-slate-400 font-normal">Saldos por setor e gôndola</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('estoque')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <div>
                          <div>Estoque Baixo & Ruptura Crítica</div>
                          <div className="text-[10px] text-slate-400 font-normal">Itens em ponto de reposição (&lt; 15 un)</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('estoque')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Clock className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>Lotes & Controle de Validade</div>
                          <div className="text-[10px] text-slate-400 font-normal">Alerta preventivo de vencimento próximo</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('estoque')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Entradas XML & Fornecedores</div>
                          <div className="text-[10px] text-slate-400 font-normal">Importação de notas fiscais e inventário</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Clientes Dropdown (/admin/clientes) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'clientes' ? null : 'clientes')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'clientes') || openDropdown === 'clientes'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Clientes</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'clientes' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">CRM & Fidelidade</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('clientes')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Base Geral de Clientes CRM</div>
                          <div className="text-[10px] text-slate-400 font-normal">Cadastro, pesquisa por CPF e contatos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('clientes')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <div>
                          <div>Programa Clube Family</div>
                          <div className="text-[10px] text-slate-400 font-normal">Pontos, cashback, tiers e descontos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('clientes')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>Histórico de Compras & Hábitos</div>
                          <div className="text-[10px] text-slate-400 font-normal">Ticket médio, frequência e produtos favoritos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onChangeEnv('CLIENTE', '/minha-conta');
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Portal do Cliente (Minha Conta)</div>
                          <div className="text-[10px] text-slate-400 font-normal">Área exclusiva do cliente cadastrado</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Financeiro Dropdown (/admin/financeiro) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'financeiro' ? null : 'financeiro')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'financeiro') || openDropdown === 'financeiro'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Financeiro</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'financeiro' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Gestão Financeira & DRE</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('financeiro')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Faturamento & Fluxo de Caixa</div>
                          <div className="text-[10px] text-slate-400 font-normal">Receitas consolidadas e entradas diárias</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('financeiro')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Contas a Pagar & Receber</div>
                          <div className="text-[10px] text-slate-400 font-normal">Fornecedores, despesas e boletos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('financeiro')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <PieChart className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>DRE Gerencial & Lucratividade</div>
                          <div className="text-[10px] text-slate-400 font-normal">Margem bruta, CMV e lucro líquido</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Relatórios Dropdown (/admin/relatorios) */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'relatorios' ? null : 'relatorios')}
                  className={`px-2 sm:px-2.5 py-1.5 whitespace-nowrap transition flex items-center gap-1 rounded-lg cursor-pointer ${
                    (currentEnv === 'ADMIN' && adminActiveTab === 'relatorios') || openDropdown === 'relatorios'
                      ? 'text-blue-700 font-bold bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Relatórios</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'relatorios' && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Inteligência & Relatórios</div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigateAdminTab('relatorios')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <div>
                          <div>Relatório Geral de Vendas</div>
                          <div className="text-[10px] text-slate-400 font-normal">Diário, semanal, mensal e por operador</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('relatorios')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <PieChart className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>Curva ABC de Produtos</div>
                          <div className="text-[10px] text-slate-400 font-normal">Classificação dos itens mais rentáveis</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('relatorios')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <Boxes className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>Relatório de Estoque & Perdas</div>
                          <div className="text-[10px] text-slate-400 font-normal">Giro de estoque, avarias e vencimentos</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavigateAdminTab('fiscal')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                      >
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Relatório Fiscal & SEFAZ SPED</div>
                          <div className="text-[10px] text-slate-400 font-normal">Notas NFC-e / SAT transmitidas</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* ROW 2: [ Buscar produtos, pedidos, clientes... ] [▣] | [ Loja 01 ] [🔔] [🎧] [Administrador ▼] */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* 9. Busca Global Omnibar + 10. Leitor de Código [▣] */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl relative">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Buscar produtos, pedidos, clientes, SKU, EAN..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>

            {/* 10. Botão Leitor de Código [▣] */}
            <button
              onClick={() => setShowBarcodeScannerModal(true)}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white rounded-xl transition shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
              title="Leitor de Código de Barras / Consulta EAN"
            >
              <ScanBarcode className="w-5 h-5" />
            </button>

            {/* 9. Painel Autocomplete da Busca Global */}
            {showSearchResults && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-12 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {/* Search category filters */}
                <div className="p-2 bg-slate-50 flex items-center gap-1.5 text-[11px] font-bold">
                  <button
                    onClick={() => setSearchFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      searchFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos ({filteredProducts.length + filteredOrders.length + filteredCustomers.length})
                  </button>
                  <button
                    onClick={() => setSearchFilter('products')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      searchFilter === 'products' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Produtos ({filteredProducts.length})
                  </button>
                  <button
                    onClick={() => setSearchFilter('orders')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      searchFilter === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Pedidos ({filteredOrders.length})
                  </button>
                  <button
                    onClick={() => setSearchFilter('customers')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      searchFilter === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Clientes ({filteredCustomers.length})
                  </button>
                </div>

                {/* Products Result */}
                {(searchFilter === 'all' || searchFilter === 'products') && filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                      onChangeEnv('LOJA', `/produtos/${p.id}`);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-blue-50/80 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-contain rounded-lg border border-slate-100 bg-white p-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          EAN: {p.ean} • SKU: {p.id} • {p.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-blue-700">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                      <div className="text-[10px] text-slate-400">Estoque: {p.stock} un</div>
                    </div>
                  </div>
                ))}

                {/* Orders Result */}
                {(searchFilter === 'all' || searchFilter === 'orders') && filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                      handleNavigateAdminTab('pedidos_online');
                    }}
                    className="p-3 flex items-center justify-between hover:bg-purple-50/80 cursor-pointer transition bg-purple-50/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{o.orderNumber} — {o.customer.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{o.date} • {o.deliveryMethod}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-purple-700">R$ {o.total.toFixed(2).replace('.', ',')}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{o.status}</div>
                    </div>
                  </div>
                ))}

                {/* Customers Result */}
                {(searchFilter === 'all' || searchFilter === 'customers') && filteredCustomers.map((c) => (
                  <div
                    key={c.cpf}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                      handleNavigateAdminTab('clientes');
                    }}
                    className="p-3 flex items-center justify-between hover:bg-emerald-50/80 cursor-pointer transition bg-emerald-50/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">CPF: {c.cpf} • {c.phone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-700">{c.points} pts</div>
                      <div className="text-[10px] text-amber-600 font-bold">Clube {c.tier}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 11. Loja / Unidade | 12. Notificações | 13. Suporte | 14 & 15. Perfil & Status */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* 11. Seletor de Loja / Unidade */}
            <div className="relative">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <Store className="w-5 h-5 text-blue-700 shrink-0" />
                <div className="hidden sm:block">
                  <div className="text-xs font-black text-slate-800 leading-tight flex items-center gap-1">
                    <span>{selectedBranch}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Unidade Ativa</div>
                </div>
              </button>

              {showStoreSelector && (
                <div className="absolute top-full right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    Selecione a Filial Operacional
                  </div>
                  {[
                    { name: 'Loja 01 — Matriz', address: 'Av. Paulista, 1000 - Bela Vista' },
                    { name: 'Loja 02 — Centro', address: 'Rua Direita, 250 - Sé' },
                    { name: 'Loja 03 — Filial', address: 'Av. Morumbi, 4500 - Morumbi' },
                  ].map((store) => (
                    <button
                      key={store.name}
                      onClick={() => {
                        setSelectedBranch(store.name);
                        setShowStoreSelector(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition flex items-center justify-between cursor-pointer ${
                        selectedBranch === store.name ? 'bg-blue-50/70 font-bold text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{store.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{store.address}</div>
                      </div>
                      {selectedBranch === store.name && (
                        <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block" />

            {/* 12. Notificações [🔔] */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl text-slate-700 hover:bg-slate-100 transition relative cursor-pointer"
                title="Notificações do Sistema"
              >
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-600 hidden md:inline">Notificações</span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-1.5 w-84 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Central de Alertas & Notificações</span>
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                      className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>

                  <div className="p-2 bg-slate-50 flex items-center gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setNotificationFilter('all')}
                      className={`px-2 py-0.5 rounded-md ${notificationFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setNotificationFilter('critical')}
                      className={`px-2 py-0.5 rounded-md ${notificationFilter === 'critical' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
                    >
                      Críticos
                    </button>
                    <button
                      onClick={() => setNotificationFilter('orders')}
                      className={`px-2 py-0.5 rounded-md ${notificationFilter === 'orders' ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
                    >
                      Pedidos
                    </button>
                    <button
                      onClick={() => setNotificationFilter('expiry')}
                      className={`px-2 py-0.5 rounded-md ${notificationFilter === 'expiry' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                    >
                      Vencimento
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications
                      .filter((n) => notificationFilter === 'all' || n.type === notificationFilter)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            );
                          }}
                          className={`p-3 hover:bg-slate-50 transition flex items-start gap-2.5 cursor-pointer ${
                            !n.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {n.type === 'critical' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                          {n.type === 'orders' && <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />}
                          {n.type === 'expiry' && <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 flex items-center justify-between">
                              <span>{n.title}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{n.desc}</div>
                            <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 13. Suporte [🎧] */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Central de Suporte & Atendimento"
            >
              <Headphones className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-medium text-slate-600 hidden md:inline">Suporte</span>
            </button>

            {/* 14. Perfil do Usuário & 15. Status ● Online */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 hover:opacity-90 transition text-left cursor-pointer"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    AD
                  </div>
                  {/* 15. Status do Usuário: ● Online */}
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 animate-pulse" />
                </div>

                <div className="hidden lg:block">
                  <div className="text-xs font-black text-slate-800 leading-tight flex items-center gap-1">
                    <span>Administrador</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Online</span>
                  </div>
                </div>
              </button>

              {/* 14. Menu de Perfil */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2.5">
                    <div className="text-xs font-bold text-slate-900">Administrador Geral</div>
                    <div className="text-[10px] text-slate-400 font-mono">admin@family.com.br</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Sessão Segura Ativa</div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleNavigateAdminTab('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Meu Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        onChangeEnv('CLIENTE', '/minha-conta');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>Minha Conta & Clube</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavigateAdminTab('config');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span>Preferências & Sistema</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavigateAdminTab('config');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Segurança & Permissões</span>
                    </button>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        onChangeEnv('LOJA', '/');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair do Sistema</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 16. Menu Principal / Sidebar (☰) - Todos os 24 Módulos do Sistema */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex animate-in fade-in">
          <div className="w-84 max-w-full bg-white h-full shadow-2xl flex flex-col p-6 space-y-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <FamilyLogo variant="color" size="md" />
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-semibold pr-1">
              {/* Grupo: Visão Geral & Vendas */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                  Visão Geral & Operações
                </div>
                <button
                  onClick={() => handleNavigateAdminTab('dashboard')}
                  className="w-full px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center gap-2.5 text-left transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-700" />
                  <span>Dashboard Executivo ERP</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('vendas')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>Vendas Realizadas & Cancelamentos</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('pedidos_online')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span>Pedidos & Separação Delivery</span>
                </button>
                <button
                  onClick={() => {
                    onChangeEnv('PDV', '/pos');
                    setShowDrawer(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition font-bold text-sky-700"
                >
                  <Calculator className="w-4 h-4 text-sky-600" />
                  <span>PDV / Frente de Caixa</span>
                </button>
              </div>

              {/* Grupo: Catálogo, Estoque & Compras */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                  Catálogo & Estoque
                </div>
                <button
                  onClick={() => handleNavigateAdminTab('produtos')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>Produtos, Preços & Promoções</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('estoque')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Boxes className="w-4 h-4 text-amber-600" />
                  <span>Estoque, Ruptura, Lotes & Validade</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('produtos')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span>Categorias & Marcas</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('estoque')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Fornecedores & Compras (Entradas XML)</span>
                </button>
              </div>

              {/* Grupo: Clientes & Canais Digitais */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                  Clientes & Canais Digitais
                </div>
                <button
                  onClick={() => handleNavigateAdminTab('clientes')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Clientes CRM & Segmentação</span>
                </button>
                <button
                  onClick={() => {
                    onChangeEnv('CLIENTE', '/minha-conta/clube-family');
                    setShowDrawer(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Programa Clube Family (Cashback/Pontos)</span>
                </button>
                <button
                  onClick={() => {
                    onChangeEnv('LOJA', '/');
                    setShowDrawer(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Loja Online Pública (E-commerce)</span>
                </button>
              </div>

              {/* Grupo: Gestão Financeira, Relatórios & Sistema */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                  Gestão & Governança
                </div>
                <button
                  onClick={() => handleNavigateAdminTab('financeiro')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Financeiro, Fluxo de Caixa & DRE</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('relatorios')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Relatórios Gerenciais & Curva ABC</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('fiscal')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <FileCheck2 className="w-4 h-4 text-purple-600" />
                  <span>Fiscal & Transmissão NFC-e / SAT</span>
                </button>
                <button
                  onClick={() => handleNavigateAdminTab('config')}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 text-left transition"
                >
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span>Usuários, Permissões & Auditoria</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
              <p className="font-bold text-slate-700">Family Supermarket v2.5 Enterprise</p>
              <p className="text-[11px] text-slate-400">Desenvolvido por Vini Amaral</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* 10. Modal do Leitor de Código de Barras / Scanner */}
      {showBarcodeScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ScanBarcode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Leitor & Consulta por Código</h3>
                  <p className="text-xs text-slate-400">Digite o código EAN ou bipar com leitor óptico</p>
                </div>
              </div>
              <button
                onClick={() => setShowBarcodeScannerModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBarcodeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Código de Barras / EAN / SKU:
                </label>
                <input
                  type="text"
                  autoFocus
                  value={scannedCodeInput}
                  onChange={(e) => setScannedCodeInput(e.target.value)}
                  placeholder="Ex: 7891000100103 ou prod-001"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBarcodeScannerModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs uppercase shadow-sm"
                >
                  Localizar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. Modal de Suporte Técnico & Atendimento */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Central de Ajuda & Suporte</h3>
                  <p className="text-xs text-slate-400">Atendimento técnico e documentação</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-semibold">
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between hover:bg-emerald-100 transition"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold">Suporte via WhatsApp</div>
                    <div className="text-[11px] text-emerald-700">(11) 98765-4321 • Atendimento Direto</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </a>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-700">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold">Central Telefônica Matriz</div>
                  <div className="text-[11px] text-slate-500">0800 770 1234 (Seg a Sáb, 07h às 22h)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-700">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-bold">Documentação & FAQ do Sistema</div>
                  <div className="text-[11px] text-slate-500">Manuais operacionais para PDV e Gestão</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
