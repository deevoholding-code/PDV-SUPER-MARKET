import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  Flame,
  Phone,
  Gift,
  Heart,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Smartphone,
  Truck,
  Layers,
  Award,
} from 'lucide-react';
import { FamilyLogo } from '../common/FamilyLogo';
import { CATEGORIES } from '../../data/mockData';

export const StoreHeader: React.FC = () => {
  const {
    cart,
    cartTotal,
    currentCustomer,
    navigateEnv,
    favoriteProductIds,
    setOnlineSubRoute,
    setSelectedProductId,
  } = useStore();
  const { products } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cepModalOpen, setCepModalOpen] = useState(false);
  const [userCep, setUserCep] = useState('01310-100');

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const searchResults = searchQuery.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectSearchedProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    setShowSearchResults(false);
    setSearchQuery('');
    navigateEnv('LOJA', `/produtos/${prodId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs select-none">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="bg-amber-400 text-blue-950 font-black px-1.5 py-0.2 rounded text-[10px] uppercase">
              Frete Grátis
            </span>
            <span>em compras acima de R$ 150 para São Paulo e Grande SP</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCepModalOpen(true)}
              className="flex items-center gap-1 hover:text-amber-300 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Entregar em: <strong className="underline">{userCep}</strong></span>
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => navigateEnv('LOJA', '/institucional/lojas')}
              className="hover:text-blue-200 transition hidden md:inline"
            >
              Nossas Lojas (3 Unidades)
            </button>
            <span className="text-white/40 hidden md:inline">|</span>
            <button
              onClick={() => alert('WhatsApp Family: (11) 98765-4321')}
              className="flex items-center gap-1 text-emerald-300 font-bold hover:text-emerald-200 transition"
            >
              <Phone className="w-3 h-3" />
              <span>Pedir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div
            onClick={() => navigateEnv('LOJA', '/')}
            className="cursor-pointer"
          >
            <FamilyLogo variant="color" size="lg" />
          </div>
        </div>

        {/* Global Search Omnibar */}
        <div className="flex-1 max-w-2xl relative hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="O que você procura hoje? Ex: Picanha, Cerveja Heineken, Arroz..."
              className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition shadow-2xs"
            />
            <div className="absolute left-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigateEnv('LOJA', `/produtos?q=${encodeURIComponent(searchQuery)}`);
                  setShowSearchResults(false);
                }
              }}
              className="absolute right-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black transition"
            >
              BUSCAR
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectSearchedProduct(p.id)}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-blue-50/70 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-white p-0.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.category} • {p.brand}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-blue-700">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </div>
                    {p.clubPrice && (
                      <div className="text-[10px] text-emerald-600 font-bold">
                        Clube: R$ {p.clubPrice.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Customer, Clube, Favorites, Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Clube Family Badge */}
          <button
            onClick={() => navigateEnv('CLIENTE', '/minha-conta/clube-family')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-400 flex items-center justify-center text-blue-950 font-black text-xs shadow-2xs">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Clube Family</div>
              <div className="text-xs font-black text-slate-900">
                {currentCustomer ? `${currentCustomer.clubPoints} pts` : 'Cadastre-se'}
              </div>
            </div>
          </button>

          {/* Customer Account Button */}
          <button
            onClick={() => navigateEnv('CLIENTE', currentCustomer ? '/minha-conta' : '/login')}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-100 border border-slate-200 transition text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-slate-500">
                {currentCustomer ? 'Minha Conta' : 'Bem-vindo(a)'}
              </div>
              <div className="text-xs font-black text-slate-900 truncate max-w-[120px]">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Entrar / Cadastrar'}
              </div>
            </div>
          </button>

          {/* Favorites */}
          <button
            onClick={() => navigateEnv('CLIENTE', '/minha-conta/favoritos')}
            className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition hidden sm:flex"
            title="Meus Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favoriteProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteProductIds.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigateEnv('LOJA', '/carrinho')}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-600 active:scale-98 text-white rounded-2xl transition shadow-md shadow-blue-700/20"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-blue-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold text-blue-200 uppercase">Meu Carrinho</div>
              <div className="text-xs font-black text-white">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="border-t border-slate-200 bg-slate-50/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-slate-700">
          <button
            onClick={() => navigateEnv('LOJA', '/produtos')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-xl font-black shrink-0 hover:bg-blue-600 transition shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>TODOS OS DEPARTAMENTOS</span>
          </button>

          <button
            onClick={() => navigateEnv('LOJA', '/produtos?categoria=OFERTAS')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-black shrink-0 transition"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>OFERTAS DA SEMANA</span>
          </button>

          {CATEGORIES.filter((c) => c.id !== 'TODOS').map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateEnv('LOJA', `/produtos?categoria=${cat.id}`)}
              className="px-2.5 py-1.5 rounded-xl hover:bg-white hover:text-blue-700 shrink-0 transition whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => navigateEnv('CLIENTE', '/minha-conta/clube-family')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-amber-700 hover:bg-amber-50 font-black shrink-0 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>CLUBE FAMILY</span>
          </button>
        </div>
      </nav>

      {/* CEP Modal */}
      {cepModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-black text-slate-900">Informe seu CEP</h3>
              </div>
              <button
                onClick={() => setCepModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Digite seu CEP para consultar a disponibilidade de produtos e o tempo de entrega na sua região.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={userCep}
                onChange={(e) => setUserCep(e.target.value)}
                placeholder="00000-000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <button
                onClick={() => setCepModalOpen(false)}
                className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md shadow-blue-700/20"
              >
                CONFIRMAR CEP
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
