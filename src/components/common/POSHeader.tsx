import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Search,
  Barcode,
  Clock,
  User as UserIcon,
  ChevronDown,
  Settings,
  HelpCircle,
  Lock,
  LogOut,
  DollarSign,
  Truck,
} from 'lucide-react';
import { FamilyLogo } from './FamilyLogo';

export const POSHeader: React.FC = () => {
  const {
    currentUser,
    currentStore,
    registerNumber,
    cashSession,
    lockScreen,
    logout,
    navigate,
    products,
    addItemToCart,
    setHelpModalOpen,
    deliveryOrders,
  } = usePOS();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Pending delivery count
  const pendingDeliveries = deliveryOrders.filter((d) => d.status === 'PENDING').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('pt-BR'));
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter products as user types
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase().trim();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      setSearchResults(filtered.slice(0, 8));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check for quantity multiplier e.g. "3*78901234"
    if (searchQuery.includes('*')) {
      const [qtyStr, code] = searchQuery.split('*');
      const qty = parseFloat(qtyStr);
      if (!isNaN(qty) && code) {
        const prod = products.find(
          (p) => p.barcode === code.trim() || p.sku.toLowerCase() === code.trim().toLowerCase()
        );
        if (prod) {
          addItemToCart(prod, qty);
          setSearchQuery('');
          setShowSearchResults(false);
          return;
        }
      }
    }

    // Direct barcode lookup
    const directMatch = products.find(
      (p) =>
        p.barcode === searchQuery.trim() ||
        p.sku.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (directMatch) {
      addItemToCart(directMatch);
      setSearchQuery('');
      setShowSearchResults(false);
      return;
    }

    if (searchResults.length > 0) {
      addItemToCart(searchResults[0]);
      setSearchQuery('');
      setShowSearchResults(false);
    } else {
      alert(`Produto não localizado com o código/nome "${searchQuery}".`);
    }
  };

  const selectProductFromSearch = (product: (typeof products)[0]) => {
    addItemToCart(product);
    setSearchQuery('');
    setShowSearchResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm select-none">
      {/* Brand & Caixa Info matching Image 2 */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/pos')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <FamilyLogo variant="color" size="md" />
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <span className="text-xl font-black text-slate-900 tracking-tight">PDV</span>
            <span className="text-xs text-slate-500 font-semibold">
              Caixa: <strong className="text-slate-900">{registerNumber}</strong>
            </span>
          </div>
        </button>
      </div>

      {/* Central Omnibar Barcode / Product Search matching Image 2 */}
      <div className="relative flex-1 max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="pos-main-search"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchResults(true);
              }}
              placeholder="Digite o código, nome ou passe o código de barras"
              className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-2.5 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Leitor de Código de Barras Ativo"
            >
              <Barcode className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </form>

        {/* Dropdown Instant Results */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectProductFromSearch(item)}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-blue-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-9 h-9 object-contain rounded-lg border border-slate-100 bg-white p-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      EAN: {item.barcode} • Estoque: {item.stock} {item.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-blue-700">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </div>
                  {item.clubPrice && (
                    <div className="text-[10px] text-emerald-600 font-bold">
                      Clube: R$ {item.clubPrice.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right User & Timestamp Section matching Image 2 */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Date / Time */}
        <div className="hidden md:block text-right">
          <div className="text-xs font-bold text-slate-800">{currentDate} - {currentTime}</div>
          <div className="text-[10px] text-slate-500 font-medium">{currentStore.name}</div>
        </div>

        {/* Delivery Orders Quick Badge */}
        <button
          type="button"
          onClick={() => navigate('/pos/delivery')}
          className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
          title="Pedidos Delivery iFood / WhatsApp"
        >
          <Truck className="w-5 h-5" />
          {pendingDeliveries > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {pendingDeliveries}
            </span>
          )}
        </button>

        {/* Operator Menu Dropdown matching Image 2 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 transition border border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'João Silva'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight capitalize">
                {currentUser?.role === 'SUPERVISOR' || currentUser?.role === 'ADMIN' ? 'Supervisor' : 'Operador'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100 text-xs">
              <div className="px-4 py-2">
                <div className="font-bold text-slate-900">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</div>
                <div className="text-[10px] text-blue-700 font-bold mt-1">Terminal #{registerNumber}</div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/pos/historico');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Últimas Vendas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/pos/relatorios');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span>Relatórios do Turno</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/pos/configuracoes');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Configurações PDV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    setHelpModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Ajuda & Atalhos (F1)</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    lockScreen();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-amber-700 font-medium"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Bloquear Caixa (F11)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Trocar Operador / Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
