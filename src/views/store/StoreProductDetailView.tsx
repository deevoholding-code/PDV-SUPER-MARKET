import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import {
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  TrendingDown,
  Scale,
  Barcode,
  Share2,
  Info,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../../types/pos';

export const StoreProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    addToCart,
    navigateEnv,
    favoriteProductIds,
    toggleFavorite,
    setSelectedProductId,
  } = useStore();
  const { products } = usePOS();

  const product: Product =
    products.find((p) => p.id === selectedProductId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState('01310-100');
  const [cepCalculated, setCepCalculated] = useState(true);
  const [activeTab, setActiveTab] = useState<'desc' | 'nutri' | 'history' | 'compare'>('compare');

  const isFav = favoriteProductIds.includes(product.id);

  const originalVal = product.originalPrice || (product.promoPrice ? product.price * 1.2 : undefined);
  const discountPct = originalVal
    ? Math.round(((originalVal - product.price) / originalVal) * 100)
    : 0;

  // Comparison products
  const equivalentProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Price history mock
  const priceHistory = [
    { date: '18/02/2025', price: originalVal || product.price * 1.2 },
    { date: '18/03/2025', price: (originalVal || product.price * 1.15) },
    { date: '18/04/2025', price: product.price * 1.05 },
    { date: 'Hoje (Melhor Preço)', price: product.price },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 select-none bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button onClick={() => navigateEnv('LOJA', '/')} className="hover:text-blue-700">
          Início
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigateEnv('LOJA', `/produtos?categoria=${product.category}`)}
          className="hover:text-blue-700"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Card (Gallery + Buy Box) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Image & Badges (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center justify-center min-h-[380px] shadow-inner group">
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                -{discountPct}% OFF
              </span>
            )}

            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white text-slate-400 hover:text-rose-600 shadow-sm border border-slate-200 transition"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 max-w-full object-contain group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Frescor 100%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Qualidade Family</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span>Troca Fácil</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Box & Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Brand, SKU and Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SKU: {product.sku} • EAN: {product.ean || product.barcode}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-slate-700 ml-1">4.9 (48 avaliações)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Stock status */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Em Estoque • {product.stock} {product.unit} disponíveis para entrega imediata</span>
            </div>

            {/* Pricing Box */}
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
              {originalVal && (
                <div className="text-xs text-slate-400 line-through font-semibold font-mono">
                  De: R$ {originalVal.toFixed(2).replace('.', ',')}
                </div>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-slate-500">Por apenas:</span>
                <span className="text-3xl sm:text-4xl font-black text-blue-700 font-mono tracking-tight">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs font-bold text-slate-500">/{product.unit}</span>
              </div>

              {/* Clube Family Price */}
              {product.clubPrice && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-[11px] font-black text-amber-900 uppercase">Preço Exclusivo Clube Family</div>
                      <div className="text-sm font-black text-slate-900 font-mono">
                        R$ {product.clubPrice.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateEnv('CLIENTE', '/minha-conta/clube-family')}
                    className="text-xs font-bold text-blue-700 underline"
                  >
                    Ativar no CPF
                  </button>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-slate-900 font-mono text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  navigateEnv('LOJA', '/carrinho');
                }}
                className="flex-1 w-full py-4 px-6 bg-blue-700 hover:bg-blue-600 active:scale-98 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>ADICIONAR AO CARRINHO • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
              </button>
            </div>

            {/* CEP Shipping Calculator */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Calcular frete e prazo de entrega:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="max-w-[160px] px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setCepCalculated(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition"
                >
                  CALCULAR
                </button>
              </div>

              {cepCalculated && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Entrega Expressa Family (Até 2h)</span>
                      <p className="text-[11px] text-slate-500">Receba hoje mesmo no conforto da sua casa</p>
                    </div>
                    <span className="font-black text-emerald-700 font-mono">R$ 9,90</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Retirada no Supermercado (Clique & Retire)</span>
                      <p className="text-[11px] text-slate-500">Disponível em 1h na Loja 01 - Matriz</p>
                    </div>
                    <span className="font-black text-emerald-700 font-mono">GRÁTIS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Feature Tabs (Compare, Price History, Description, Nutrition) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'compare'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚖️ COMPARE E ECONOMIZE
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'history'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📉 HISTÓRICO DE PREÇO
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'desc'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            DETALHES DO PRODUTO
          </button>
          <button
            onClick={() => setActiveTab('nutri')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'nutri'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            INFORMAÇÃO NUTRICIONAL
          </button>
        </div>

        {/* TAB 1: COMPARE E ECONOMIZE */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Compare e Economize com Marcas Equivalentes</h3>
              <p className="text-xs text-slate-500 font-medium">
                Confira outras opções do mesmo segmento para escolher a melhor relação custo-benefício.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equivalentProducts.map((eq) => (
                <div
                  key={eq.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={eq.image}
                      alt={eq.name}
                      className="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase">{eq.brand}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{eq.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div>
                      <div className="text-sm font-black text-blue-700 font-mono">
                        R$ {eq.price.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-[10px] text-slate-500">Custo aprox.: R$ {(eq.price * 1.05).toFixed(2)}/un</div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProductId(eq.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-xl text-xs font-bold transition"
                    >
                      Comparar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mandatory Note */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Comparação demonstrativa baseada na categoria e gramatura equivalente.</span>
            </div>
          </div>
        )}

        {/* TAB 2: HISTÓRICO DE PREÇO */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Evolução do Preço nos Últimos 90 Dias</h3>
              <p className="text-xs text-slate-500 font-medium">
                Transparência total: você sempre compra pelo melhor valor do mercado.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {priceHistory.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border text-center space-y-1 ${
                    i === priceHistory.length - 1
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-500">{item.date}</div>
                  <div className="text-lg font-black font-mono">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </div>
                  {i === priceHistory.length - 1 && (
                    <span className="inline-block text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      Melhor Oferta
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DETALHES */}
        {activeTab === 'desc' && (
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              Produto selecionado com rigoroso controle de qualidade Family Supermarket. Ideal para o seu dia a dia, combinando sabor, rendimento e praticidade. Armazenar em local seco, arejado e ao abrigo do sol.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Código EAN</span>
                <strong className="text-slate-900">{product.ean || product.barcode}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Marca</span>
                <strong className="text-slate-900">{product.brand}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Unidade de Medida</span>
                <strong className="text-slate-900">{product.unit}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NUTRIÇÃO */}
        {activeTab === 'nutri' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="p-2.5 rounded-l-xl">Item</th>
                    <th className="p-2.5">Porção</th>
                    <th className="p-2.5 rounded-r-xl">% VD (*)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">Valor Energético</td>
                    <td className="p-2.5 font-mono">120 kcal = 504 kJ</td>
                    <td className="p-2.5 font-mono">6%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Carboidratos</td>
                    <td className="p-2.5 font-mono">14g</td>
                    <td className="p-2.5 font-mono">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Proteínas</td>
                    <td className="p-2.5 font-mono">3.2g</td>
                    <td className="p-2.5 font-mono">4%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Gorduras Totais</td>
                    <td className="p-2.5 font-mono">2.0g</td>
                    <td className="p-2.5 font-mono">3%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Sódio</td>
                    <td className="p-2.5 font-mono">45mg</td>
                    <td className="p-2.5 font-mono">2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400">
              * Valores diários com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
