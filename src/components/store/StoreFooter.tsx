import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Send,
  Lock,
  Award,
  Truck,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Apple,
  Heart,
  Wine,
  Croissant,
  ShoppingCart,
  Sparkles,
  Droplets,
  PawPrint,
  CheckCircle2,
  Barcode,
} from 'lucide-react';
import { FamilyLogo } from '../common/FamilyLogo';

export const StoreFooter: React.FC = () => {
  const { navigateEnv } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 select-none font-sans">
      {/* Top 5-Column Navigation Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Column 1: Logo, Slogan, Socials, Newsletter (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <FamilyLogo variant="color" size="md" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Tudo para sua casa, com qualidade, variedade e os melhores preços você encontra aqui no{' '}
              <strong className="text-blue-700 font-black">Family Supermarket</strong>!
            </p>

            {/* Siga-nos */}
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">Siga-nos</h5>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#1877F2] hover:bg-slate-50 transition shadow-2xs"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#E4405F] hover:bg-slate-50 transition shadow-2xs"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#25D366] hover:bg-slate-50 transition shadow-2xs"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#FF0000] hover:bg-slate-50 transition shadow-2xs"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Receba nossas ofertas */}
            <div className="space-y-2 pt-1">
              <h5 className="text-xs font-black text-slate-900">Receba nossas ofertas</h5>
              <p className="text-[11px] text-slate-500">
                Cadastre seu e-mail e receba ofertas exclusivas e novidades.
              </p>

              {subscribed ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>E-mail cadastrado com sucesso!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 max-w-xs">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    required
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-blue-700 hover:bg-blue-600 active:scale-95 text-white rounded-xl transition shadow-xs shrink-0 flex items-center justify-center"
                    title="Cadastrar e-mail"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Institucional (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-blue-700">Institucional</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/sobre')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Sobre nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/lojas')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Nossas lojas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/trabalhe-conosco')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Trabalhe conosco
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/fornecedor')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Seja um fornecedor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/imprensa')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Imprensa
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/politica-privacidade')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/institucional/termos-de-uso')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Termos de Uso
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Serviços (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-blue-700">Serviços</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/como-comprar')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Como comprar
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/formas-de-pagamento')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Formas de pagamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/entrega-e-prazos')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Entrega e Prazos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/trocas-e-devolucoes')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Trocas e Devoluções
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Programa Clube Family
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/atendimento')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Atendimento
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/faq')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Perguntas Frequentes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Minha Conta (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-blue-700">Minha Conta</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Acessar minha conta
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Meus pedidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Meus dados
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Meus endereços
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Favoritos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Cupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('CLIENTE', '/minha-conta')}
                  className="hover:text-blue-700 hover:translate-x-0.5 transition flex items-center gap-1 text-left"
                >
                  <span className="text-slate-400 text-[10px]">&gt;</span> Clube Family
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Categorias (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-blue-700">Categorias</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=HORTIFRUTI')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Apple className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hortifruti</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=ACOUGUE')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Heart className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Açougue</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=BEBIDAS')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Wine className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Bebidas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=PADARIA')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Croissant className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Padaria</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=MERCEARIA')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Mercearia</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=LIMPEZA')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Limpeza</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=HIGIENE')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Higiene</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateEnv('LOJA', '/produtos?categoria=PET')}
                  className="hover:text-blue-700 transition flex items-center gap-2 text-left"
                >
                  <PawPrint className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pet</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => navigateEnv('LOJA', '/produtos')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 transition flex items-center gap-1"
              >
                <span>Ver todas categorias</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Trust & Benefits Box (4 columns in light container) */}
        <div className="mt-12 p-6 bg-slate-50/90 border border-slate-200/80 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Item 1: Qualidade Garantida */}
            <div className="flex items-center gap-3.5">
              <div className="text-blue-700 shrink-0">
                <Award className="w-9 h-9 stroke-[1.75]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-blue-900 leading-tight">Qualidade Garantida</h5>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Produtos selecionados com o melhor padrão
                </p>
              </div>
            </div>

            {/* Item 2: Entrega Rápida */}
            <div className="flex items-center gap-3.5">
              <div className="text-blue-700 shrink-0">
                <Truck className="w-9 h-9 stroke-[1.75]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-blue-900 leading-tight">Entrega Rápida</h5>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Entrega rápida e segura para sua região
                </p>
              </div>
            </div>

            {/* Item 3: Pagamento Seguro */}
            <div className="flex items-center gap-3.5">
              <div className="text-blue-700 shrink-0">
                <CreditCard className="w-9 h-9 stroke-[1.75]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-blue-900 leading-tight">Pagamento Seguro</h5>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Ambiente 100% seguro e certificado
                </p>
              </div>
            </div>

            {/* Item 4: Privacidade */}
            <div className="flex items-center gap-3.5">
              <div className="text-blue-700 shrink-0">
                <ShieldCheck className="w-9 h-9 stroke-[1.75]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-blue-900 leading-tight">Privacidade</h5>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Seus dados protegidos com segurança
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Royal Blue Bar: Security + Payment Methods + Credits + Copyright */}
      <div className="bg-[#0047BA] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: SSL Security Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center text-white shrink-0">
                <Lock className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black leading-tight text-white">Ambiente 100% Seguro</div>
                <div className="text-[11px] text-blue-100 font-medium leading-tight mt-0.5">
                  Seus dados e pagamentos são protegidos com tecnologia SSL.
                </div>
              </div>
            </div>

            {/* Middle: Payment Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Visa */}
              <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center shadow-xs">
                <span className="text-[#1A1F71] font-black italic text-xs tracking-wider">VISA</span>
              </div>

              {/* Mastercard */}
              <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center gap-0.5 shadow-xs">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90 -mr-1.5" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
              </div>

              {/* Elo */}
              <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center shadow-xs">
                <span className="text-black font-black text-xs lowercase tracking-tighter">elo</span>
              </div>

              {/* American Express */}
              <div className="h-8 px-2 bg-[#006FCF] rounded-md flex items-center justify-center shadow-xs border border-white/20">
                <span className="text-white font-black text-[9px] uppercase tracking-tighter">AMERICAN EXPRESS</span>
              </div>

              {/* Hipercard */}
              <div className="h-8 px-2 bg-[#CC0000] rounded-md flex items-center justify-center shadow-xs">
                <span className="text-white font-black italic text-[10px] tracking-tight">Hipercard</span>
              </div>

              {/* Pix */}
              <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center gap-1.5 shadow-xs">
                <svg className="w-3.5 h-3.5 fill-[#32BCAD]" viewBox="0 0 512 512">
                  <path d="M375.3 107.5l-95-95a34.4 34.4 0 0 0-48.6 0l-95 95a34.4 34.4 0 0 0 0 48.6l95 95a34.4 34.4 0 0 0 48.6 0l95-95a34.4 34.4 0 0 0 0-48.6zM136.7 355.9l95 95a34.4 34.4 0 0 0 48.6 0l95-95a34.4 34.4 0 0 0 0-48.6l-95-95a34.4 34.4 0 0 0-48.6 0l-95 95a34.4 34.4 0 0 0 0 48.6z" />
                </svg>
                <span className="text-[#32BCAD] font-black text-xs lowercase">pix</span>
              </div>

              {/* Boleto Bancário */}
              <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center gap-1.5 shadow-xs">
                <Barcode className="w-4 h-4 text-slate-800" />
                <span className="text-slate-800 font-bold text-[9px] uppercase leading-none">
                  Boleto<br />Bancário
                </span>
              </div>
            </div>

            {/* Right: Credits ("Desenvolvido por Vini Amaral" | "Mantido por DEEVO Financeiras") */}
            <div className="flex items-center gap-6 text-left shrink-0">
              <div>
                <div className="text-[11px] text-blue-200 font-medium">Desenvolvido por</div>
                <div className="text-sm font-black text-white leading-tight">Vini Amaral</div>
              </div>

              <div className="h-7 w-px bg-white/20" />

              <div>
                <div className="text-[11px] text-blue-200 font-medium">Mantido por</div>
                <div className="text-sm font-black text-white leading-tight">DEEVO Financeiras</div>
              </div>
            </div>
          </div>

          {/* Centered Copyright Line */}
          <div className="mt-6 pt-5 border-t border-white/15 text-center text-xs text-blue-100/90 font-medium">
            © 2026 Family Supermarket. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
