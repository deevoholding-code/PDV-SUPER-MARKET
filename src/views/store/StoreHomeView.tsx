import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePOS } from '../../context/POSContext';
import {
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Award,
  Zap,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { Product } from '../../types/pos';

export const StoreHomeView: React.FC = () => {
  const {
    addToCart,
    navigateEnv,
    favoriteProductIds,
    toggleFavorite,
    setSelectedProductId,
  } = useStore();
  const { products } = usePOS();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Banners
  const slides = [
    {
      id: 1,
      title: 'Festival de Ofertas Especiais',
      subtitle: 'Carnes nobres, cervejas artesanais e hortifrúti fresco com até 40% OFF',
      tag: 'OFERTAS DA SEMANA',
      bgGradient: 'from-blue-900 via-blue-800 to-indigo-950',
      ctaText: 'APROVEITAR AGORA',
      ctaCategory: 'ACOUGUE',
      badge: 'Economia Garantida',
    },
    {
      id: 2,
      title: 'Hortifrúti Direto do Produtor',
      subtitle: 'Frutas, legumes e verduras selecionados diariamente para sua mesa',
      tag: 'FRESCOR 100% GARANTIDO',
      bgGradient: 'from-emerald-900 via-emerald-800 to-teal-950',
      ctaText: 'VER HORTIFRÚTI',
      ctaCategory: 'HORTIFRUTI',
      badge: 'Orgânicos & Selecionados',
    },
    {
      id: 3,
      title: 'Clube Family: Descontos no CPF',
      subtitle: 'Acumule pontos em todas as compras e troque por vouchers em dinheiro',
      tag: 'PROGRAMA DE BENEFÍCIOS',
      bgGradient: 'from-amber-900 via-amber-800 to-stone-900',
      ctaText: 'CONHECER O CLUBE',
      ctaCategory: 'CLUBE',
      badge: 'Exclusivo para Membros',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleProductClick = (prod: Product) => {
    setSelectedProductId(prod.id);
    navigateEnv('LOJA', `/produtos/${prod.id}`);
  };

  const dealProducts = products.filter((p) => p.promotionalPrice || p.clubPrice).slice(0, 8);
  const bestSellers = products.slice(0, 8);
  const produceItems = products.filter((p) => p.category === 'HORTIFRUTI').slice(0, 4);

  return (
    <div className="space-y-10 pb-16 select-none bg-slate-50">
      {/* 1. Hero Carousel Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[420px] flex items-center">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} p-8 sm:p-14 text-white flex flex-col justify-center transition-all duration-700 ${
                idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-400/15 rounded-full blur-2xl" />

              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-400 text-blue-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-sm">
                    {slide.tag}
                  </span>
                  <span className="text-xs text-white/80 font-bold hidden sm:inline">
                    • {slide.badge}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  {slide.title}
                </h2>

                <p className="text-sm sm:text-base text-white/90 max-w-xl font-medium leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (slide.ctaCategory === 'CLUBE') {
                        navigateEnv('CLIENTE', '/minha-conta/clube-family');
                      } else {
                        navigateEnv('LOJA', `/produtos?categoria=${slide.ctaCategory}`);
                      }
                    }}
                    className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-blue-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-amber-400/30 flex items-center gap-2"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigateEnv('LOJA', '/produtos')}
                    className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition backdrop-blur-xs border border-white/20"
                  >
                    Ver Tudo
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-4 z-20 p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 z-20 p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Quick Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Compre por Categoria</h3>
            <p className="text-xs text-slate-500 font-medium">Os melhores departamentos com entrega rápida no seu endereço</p>
          </div>
          <button
            onClick={() => navigateEnv('LOJA', '/produtos')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'TODOS').map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateEnv('LOJA', `/produtos?categoria=${cat.id}`)}
              className="p-3 bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-2xl text-center space-y-2 transition group shadow-2xs"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition shadow-inner">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-black text-slate-800 group-hover:text-blue-700 leading-tight">
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Super Ofertas da Semana (Timer + Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Flame className="w-7 h-7 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-200">
                  Descontos por tempo limitado
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Super Ofertas da Semana
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold">Termina em: </span>
              <span className="font-mono text-sm font-black text-amber-300">23h 48m 12s</span>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {dealProducts.map((prod) => {
              const isFav = favoriteProductIds.includes(prod.id);
              const discountPct = prod.originalPrice
                ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                : 15;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-4 text-slate-900 shadow-md hover:shadow-xl transition flex flex-col justify-between relative group border border-slate-100"
                >
                  {/* Badge Discount */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      -{discountPct}% OFF
                    </span>
                    {prod.clubPrice && (
                      <span className="bg-amber-400 text-blue-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        CLUBE
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
                  </button>

                  {/* Image */}
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

                  {/* Details */}
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

                    {/* Price block */}
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
                        <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg inline-block border border-emerald-200 mt-0.5">
                          Clube: R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADICIONAR</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Split Promo Banners (Clube + Express Delivery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clube Promo */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-blue-950 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-950 text-amber-300 text-[10px] font-black uppercase">
                <Award className="w-3.5 h-3.5" /> Clube Family
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Economize até 30% nas compras do mês
              </h3>
              <p className="text-xs sm:text-sm font-bold text-blue-900/90 max-w-md">
                Cadastre seu CPF gratuitamente e tenha acesso instantâneo a centenas de preços exclusivos em todas as lojas e no app.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => navigateEnv('CLIENTE', '/minha-conta/clube-family')}
                className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md flex items-center gap-2"
              >
                <span>CADASTRAR CPF NO CLUBE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Express Delivery Promo */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                <Truck className="w-3.5 h-3.5" /> Entrega Turbo 2 Horas
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Receba suas compras em até 2 horas
              </h3>
              <p className="text-xs sm:text-sm text-blue-200 max-w-md font-medium">
                Nossos personal shoppers selecionam cada item com o mesmo carinho que você. Alimentos frescos entregues na sua porta.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => navigateEnv('LOJA', '/produtos')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md flex items-center gap-2"
              >
                <span>FAZER PEDIDO AGORA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mais Vendidos do Supermercado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Mais Vendidos da Semana</h3>
            <p className="text-xs text-slate-500 font-medium">Os produtos favoritos dos nossos clientes com os melhores preços</p>
          </div>
          <button
            onClick={() => navigateEnv('LOJA', '/produtos')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm hover:shadow-md transition flex flex-col justify-between border border-slate-200"
            >
              <div
                onClick={() => handleProductClick(prod)}
                className="h-36 sm:h-40 flex items-center justify-center p-2 cursor-pointer group"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                />
              </div>

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

                <div className="text-base sm:text-lg font-black text-blue-700 font-mono">
                  R$ {prod.price.toFixed(2).replace('.', ',')}
                  <span className="text-[10px] font-bold text-slate-500 ml-1">/{prod.unit}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod, 1);
                  }}
                  className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADICIONAR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Vantagens Family (Trust Bar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Entrega Rápida & Segura</div>
              <div className="text-[11px] text-slate-500">Expressa em até 2h ou agendada</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Frescor 100% Garantido</div>
              <div className="text-[11px] text-slate-500">Produtos frescos ou seu dinheiro de volta</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Pagamento 100% Seguro</div>
              <div className="text-[11px] text-slate-500">Pix, Cartão de Crédito e Vales</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Clube de Vantagens</div>
              <div className="text-[11px] text-slate-500">Pontos que viram desconto no caixa</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
