import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import {
  Filter,
  SlidersHorizontal,
  Plus,
  Heart,
  ChevronRight,
  Flame,
  Award,
  Check,
  Search,
  RotateCcw,
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { Product } from '../../types/pos';

export const StoreCatalogView: React.FC = () => {
  const {
    addToCart,
    navigateEnv,
    favoriteProductIds,
    toggleFavorite,
    setSelectedProductId,
  } = useStore();
  const { products } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [selectedBrand, setSelectedBrand] = useState<string>('TODOS');
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [onlyClub, setOnlyClub] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(100);

  // Extract unique brands
  const brands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) bSet.add(p.brand);
    });
    return Array.from(bSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'TODOS' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'TODOS' && p.brand !== selectedBrand) return false;
      if (onlyDeals && !(p.promoPrice || p.promotionalPrice)) return false;
      if (onlyClub && !p.clubPrice) return false;
      if (p.price > maxPrice) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.ean.includes(q) ||
          (p.barcode && p.barcode.includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // featured / default
    });
  }, [products, selectedCategory, selectedBrand, onlyDeals, onlyClub, maxPrice, searchFilter, sortBy]);

  const handleProductClick = (prod: Product) => {
    setSelectedProductId(prod.id);
    navigateEnv('LOJA', `/produtos/${prod.id}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('TODOS');
    setSelectedBrand('TODOS');
    setOnlyDeals(false);
    setOnlyClub(false);
    setMaxPrice(100);
    setSearchFilter('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button onClick={() => navigateEnv('LOJA', '/')} className="hover:text-blue-700">
          Início
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Catálogo de Produtos</span>
        {selectedCategory !== 'TODOS' && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-bold">{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Header bar with total and sort */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {selectedCategory === 'TODOS' ? 'Todos os Produtos' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Exibindo <strong className="text-slate-800">{filteredProducts.length}</strong> produtos disponíveis para entrega rápida
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" />
            <span>Ordenar por:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="featured">Destaques / Relevância</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name-asc">Nome (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Filters (3 Cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900 uppercase">
              <Filter className="w-4 h-4 text-blue-700" />
              <span>Filtros</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Limpar
            </button>
          </div>

          {/* Search inside catalog */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Filtrar por nome/termo</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Ex: Leite, Café..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Special Promo Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700">Condições Especiais</div>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={(e) => setOnlyDeals(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Apenas Ofertas
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyClub}
                onChange={(e) => setOnlyClub(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Preço Clube Family
              </span>
            </label>
          </div>

          {/* Categories list */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700">Departamentos</div>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Preço Máximo</span>
              <span className="font-mono text-blue-700">R$ {maxPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Brands list */}
          {brands.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700">Marcas</div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBrand('TODOS')}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                    selectedBrand === 'TODOS' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Todas as Marcas
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                      selectedBrand === b ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Products Grid (9 Cols) */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-800">Nenhum produto encontrado</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente ajustar os filtros de categoria, marca ou valor máximo para ver mais opções.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => {
                const isFav = favoriteProductIds.includes(prod.id);
                const discountPct = prod.originalPrice
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-4 text-slate-900 shadow-2xs hover:shadow-md transition flex flex-col justify-between relative group border border-slate-200"
                  >
                    {/* Discount badge */}
                    {discountPct > 0 && (
                      <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prod.id);
                      }}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
                    </button>

                    {/* Product Image */}
                    <div
                      onClick={() => handleProductClick(prod)}
                      className="h-36 sm:h-40 flex items-center justify-center p-2 cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {prod.category} • {prod.brand}
                      </div>

                      <h4
                        onClick={() => handleProductClick(prod)}
                        className="text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-700 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {prod.name}
                      </h4>

                      {/* Price Section */}
                      <div>
                        {prod.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through font-semibold font-mono">
                            R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                        <div className="text-base sm:text-lg font-black text-blue-700 font-mono">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                          <span className="text-[10px] font-bold text-slate-500 ml-1">/{prod.unit}</span>
                        </div>

                        {prod.clubPrice && (
                          <div className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg inline-block border border-emerald-200 mt-0.5">
                            Clube: R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>COMPRAR</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
