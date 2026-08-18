import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Calculator,
  LayoutDashboard,
  Smartphone,
  Zap,
  HelpCircle,
  PhoneCall,
  Mail,
  Send,
  Star,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';
import { FamilyLogo } from '../../components/common/FamilyLogo';
import { AppEnvironment } from '../../types/store';

interface POSHireViewProps {
  onNavigateEnv: (env: AppEnvironment, subRoute?: string) => void;
}

export const POSHireView: React.FC<POSHireViewProps> = ({ onNavigateEnv }) => {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto select-none">
      {/* Hero Presentation */}
      <section className="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SOLUÇÃO COMPLETA DE VAREJO SUPERMERCADISTA</span>
          </div>

          <div className="flex justify-center">
            <FamilyLogo variant="white" size="xl" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            O Ecossistema Definitivo para <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Supermercados Modernos</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Unifique sua Loja Online, Frente de Caixa (PDV), Controle de Estoque, Clube de Benefícios e Painel Administrativo em uma única plataforma omnichannel de alta performance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigateEnv('PDV', '/pos')}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
            >
              <span>Testar PDV ao Vivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateEnv('LOJA', '/')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Loja Online</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars */}
      <section className="max-w-6xl mx-auto py-14 px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            5 Módulos Integrados em Tempo Real
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Tudo o que seu supermercado precisa, sem necessidade de múltiplos softwares desintegrados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">1. Loja Online & E-commerce</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Catálogo completo com cálculo de frete por CEP, cupons, ofertas dinâmicas, promoções Leve 2 Pague 1 e checkout transparente em 6 etapas.
            </p>
            <button
              type="button"
              onClick={() => onNavigateEnv('LOJA', '/')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Explorar E-commerce</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">2. Frente de Caixa (PDV Ágil)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Velocidade máxima no checkout com suporte a leitor de código de barras, atalhos de teclado (F1-F12), balança de hortifrúti e Pix dinâmico.
            </p>
            <button
              type="button"
              onClick={() => onNavigateEnv('PDV', '/pos')}
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>Abrir Frente de Caixa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">3. Painel Administrativo (ERP)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Controle de estoque crítico, inventário, cadastro de produtos, fornecedores, fluxo financeiro, separação de pedidos e relatórios fiscais.
            </p>
            <button
              type="button"
              onClick={() => onNavigateEnv('ADMIN', '/admin')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Acessar Painel ERP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing / Planos */}
      <section className="bg-slate-100 py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Planos Transparentes para Cada Fase da sua Loja
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Implementação rápida, suporte dedicado e treinamento operacional incluso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Essencial</div>
                <h3 className="text-xl font-black text-slate-900">Plano PDV Caixa</h3>
                <div className="text-3xl font-black text-slate-900">
                  R$ 290 <span className="text-xs text-slate-500 font-normal">/ mês por loja</span>
                </div>
                <p className="text-xs text-slate-500">Ideal para supermercados e mercearias que precisam de frente de caixa ágil e controle de estoque local.</p>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Até 2 Terminais PDV</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Leitor + Balança + Impressora</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Fechamento de Caixa Cego</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Controle de Estoque Básico</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => alert('Obrigado pelo interesse! Solicitação de contato para o Plano PDV Caixa registrada.')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Contratar Plano Essencial
              </button>
            </div>

            {/* Omnichannel Pro */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-600 shadow-lg space-y-6 relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                Mais Escolhido
              </div>
              <div className="space-y-4">
                <div className="text-xs font-black uppercase text-blue-600 tracking-wider">Omnichannel Completo</div>
                <h3 className="text-xl font-black text-slate-900">Plano Supermarket Pro</h3>
                <div className="text-3xl font-black text-blue-600">
                  R$ 590 <span className="text-xs text-slate-500 font-normal">/ mês por loja</span>
                </div>
                <p className="text-xs text-slate-500">A solução completa com Loja Online, PDV ilimitado, Clube de Benefícios e Integração Delivery.</p>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Terminais PDV Ilimitados</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Loja Online E-commerce Própria</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Clube Family (Pontos & Cupons)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Painel ERP com Separação e Entregas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Aplicativo PWA Instalável</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => alert('Excelente escolha! Solicitação de contato para o Plano Supermarket Pro registrada.')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-md shadow-blue-500/20"
              >
                Contratar Plano Pro
              </button>
            </div>

            {/* Enterprise Multiloja */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Redes & Franquias</div>
                <h3 className="text-xl font-black text-slate-900">Plano Enterprise</h3>
                <div className="text-3xl font-black text-slate-900">
                  Sob Consulta
                </div>
                <p className="text-xs text-slate-500">Para redes com múltiplas filiais, centro de distribuição e integrações fiscais avançadas.</p>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Gestão Multi-Filiais Integrada</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Suporte 24/7 com SLA Garantido</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Customizações e API Dedicada</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Treinamento Presencial da Equipe</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => alert('Solicitação registrada! Um consultor especializado entrará em contato.')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Credits Section */}
      <footer className="bg-slate-900 text-white py-10 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <FamilyLogo variant="white" size="sm" />
            <div className="text-slate-400">
              © {new Date().getFullYear()} Family Supermarket • Todos os direitos reservados.
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="font-bold text-slate-200">
              Desenvolvido por <span className="text-blue-400 font-black">Vini Amaral</span>
            </div>
            <div className="text-slate-400">
              Licenciado por <strong>Family Supermarket LTDA</strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
