import React, { useState } from 'react';
import {
  ShoppingBag,
  User,
  CreditCard,
  LayoutDashboard,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Laptop,
  Monitor,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FamilyLogo } from '../../components/common/FamilyLogo';
import { AppEnvironment } from '../../types/store';

interface POSSystemMapViewProps {
  onNavigateEnv: (env: AppEnvironment, subRoute?: string) => void;
}

export const POSSystemMapView: React.FC<POSSystemMapViewProps> = ({ onNavigateEnv }) => {
  const [filterModule, setFilterModule] = useState<string>('ALL');

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Top Header reproducing Image 4 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <FamilyLogo variant="color" size="lg" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                MAPA COMPLETO DO SISTEMA FAMILY SUPERMARKET
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Todas as páginas e subpáginas do projeto com navegação interativa e em tempo real
              </p>
            </div>
          </div>

          {/* Quick Environment Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'TODOS', color: 'bg-slate-800 text-white' },
              { id: 'LOJA', label: 'LOJA ONLINE', color: 'bg-blue-600 text-white' },
              { id: 'CLIENTE', label: 'CLIENTE', color: 'bg-emerald-600 text-white' },
              { id: 'CHECKOUT', label: 'CHECKOUT', color: 'bg-amber-600 text-white' },
              { id: 'ADMIN', label: 'PAINEL ADMINISTRATIVO', color: 'bg-indigo-600 text-white' },
              { id: 'PDV', label: 'PDV / CAIXA', color: 'bg-sky-600 text-white' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterModule(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-xs ${
                  filterModule === tab.id
                    ? tab.color
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Columns Layout matching Reference Image 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. LOJA ONLINE (Blue) */}
          {(filterModule === 'ALL' || filterModule === 'LOJA') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-blue-600 shadow-sm flex flex-col space-y-3">
              <div className="bg-blue-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-black text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  <span>LOJA ONLINE</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateEnv('LOJA', '/')}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold transition"
                >
                  Abrir ↗
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 overflow-y-auto max-h-[680px] pr-1 divide-y divide-slate-100">
                <div className="pt-1">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer flex items-center justify-between"
                  >
                    <span>01. Home</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1 font-medium">
                    <li>Banner Principal</li>
                    <li>Categorias</li>
                    <li>Ofertas da Semana</li>
                    <li>Mais Vendidos</li>
                    <li>Novidades</li>
                    <li>Benefícios</li>
                    <li>Clube Family</li>
                    <li>Newsletter</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/produtos')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer flex items-center justify-between"
                  >
                    <span>02. Produtos</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Lista de Produtos</li>
                    <li>Filtros e Ordenação</li>
                    <li>Busca</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/produtos/prod-001')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer flex items-center justify-between"
                  >
                    <span>03. Produto (Detalhe)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Informações do Produto</li>
                    <li>Preço Atual</li>
                    <li>Promoções Ativas</li>
                    <li>Cupons Aplicáveis</li>
                    <li>Comparação de Preços</li>
                    <li>Histórico de Preços</li>
                    <li>Produtos Relacionados</li>
                    <li>Avaliações</li>
                    <li>Adicionar ao Carrinho</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/categoria/mercearia')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    04. Categorias
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Todas as Categorias</li>
                    <li>Categoria (Detalhe)</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/ofertas')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    05. Ofertas
                  </div>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/mais-vendidos')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    06. Mais Vendidos
                  </div>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/novidades')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    07. Novidades
                  </div>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/busca')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    08. Busca
                  </div>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/carrinho')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    09. Carrinho
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Itens do Carrinho</li>
                    <li>Cupom</li>
                    <li>Calcular Frete</li>
                    <li>Resumo do Pedido</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('LOJA', '/sobre')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    10. Institucional
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Sobre</li>
                    <li>Contato</li>
                    <li>FAQ</li>
                    <li>Lojas</li>
                    <li>Trabalhe Conosco</li>
                    <li>Política de Privacidade</li>
                    <li>Termos de Uso</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. ÁREA DO CLIENTE (Green) */}
          {(filterModule === 'ALL' || filterModule === 'CLIENTE') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-600 shadow-sm flex flex-col space-y-3">
              <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-black text-sm">
                  <User className="w-4 h-4" />
                  <span>ÁREA DO CLIENTE</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateEnv('CLIENTE', '/minha-conta')}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold transition"
                >
                  Abrir ↗
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700 overflow-y-auto max-h-[680px] pr-1 divide-y divide-slate-100">
                <div className="pt-1">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/login')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    01. Login
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/cadastro')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    02. Cadastro
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/recuperar-senha')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    03. Recuperar Senha
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    04. Minha Conta (Dashboard)
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Resumo de Compras</li>
                    <li>Últimos Pedidos</li>
                    <li>Pontos Clube Family</li>
                    <li>Cupons</li>
                    <li>Ofertas para Você</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/pedidos')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    05. Meus Pedidos
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/pedidos/ord-001')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    06. Pedido (Detalhes)
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Itens do Pedido</li>
                    <li>Endereço</li>
                    <li>Pagamento</li>
                    <li>Status e Timeline</li>
                    <li>Reimprimir Comprovante</li>
                    <li>Comprar Novamente</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/favoritos')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    07. Favoritos
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/cupons')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    08. Cupons
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/enderecos')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    09. Endereços
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/pagamentos')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    10. Pagamentos
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/dados')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    11. Dados Pessoais
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/notificacoes')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    12. Notificações
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/clube-family')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    13. Clube Family
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/minha-conta/atendimento')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    14. Atendimento
                  </div>
                </div>
                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CLIENTE', '/login')}
                    className="font-bold text-slate-500 hover:underline cursor-pointer"
                  >
                    15. Sair
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. CHECKOUT (Orange) */}
          {(filterModule === 'ALL' || filterModule === 'CHECKOUT') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-500 shadow-sm flex flex-col space-y-3">
              <div className="bg-amber-500 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-black text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>CHECKOUT</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateEnv('CHECKOUT', '/checkout/identificacao')}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold transition"
                >
                  Abrir ↗
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 overflow-y-auto max-h-[680px] pr-1 divide-y divide-slate-100">
                <div className="pt-1">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/identificacao')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    01. Identificação
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Cliente Existente</li>
                    <li>Novo Cliente</li>
                    <li>Comprar como Convidado</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/endereco')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    02. Endereço
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Selecionar Endereço</li>
                    <li>Novo Endereço</li>
                    <li>Editar Endereço</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/entrega')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    03. Entrega
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Tipo de Entrega</li>
                    <li>Escolher Data e Horário</li>
                    <li>Taxas e Informações</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/pagamento')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    04. Pagamento
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Pix</li>
                    <li>Cartão de Crédito</li>
                    <li>Cartão de Débito</li>
                    <li>Dinheiro</li>
                    <li>Retirada na Loja</li>
                    <li>Parcelamento</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/revisao')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    05. Revisão do Pedido
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Endereço</li>
                    <li>Entrega</li>
                    <li>Pagamento</li>
                    <li>Itens do Pedido</li>
                    <li>Cupom e Descontos</li>
                    <li>Total do Pedido</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    onClick={() => onNavigateEnv('CHECKOUT', '/checkout/concluido')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    06. Pedido Concluído
                  </div>
                  <ul className="text-[11px] text-slate-500 pl-3 list-disc space-y-0.5 mt-1">
                    <li>Confirmação</li>
                    <li>Número do Pedido</li>
                    <li>Acompanhar Pedido</li>
                    <li>Baixar Comprovante</li>
                    <li>Continuar Comprando</li>
                  </ul>
                </div>

                {/* Flow Summary Box */}
                <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-bold text-amber-900 space-y-1">
                  <div className="text-amber-800 uppercase font-black text-[10px]">
                    RESUMO DO FLUXO
                  </div>
                  <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                    <span>Identificação</span>
                    <span>→</span>
                    <span>Endereço</span>
                    <span>→</span>
                    <span>Entrega</span>
                    <span>→</span>
                    <span>Pagamento</span>
                    <span>→</span>
                    <span>Revisão</span>
                    <span>→</span>
                    <span>Concluído</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PAINEL ADMINISTRATIVO (Purple) */}
          {(filterModule === 'ALL' || filterModule === 'ADMIN') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-indigo-600 shadow-sm flex flex-col space-y-3">
              <div className="bg-indigo-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-black text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>PAINEL ADMIN (ERP)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateEnv('ADMIN', '/admin')}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold transition"
                >
                  Abrir ↗
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700 overflow-y-auto max-h-[680px] pr-1 divide-y divide-slate-100">
                <div className="pt-1">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    01. Dashboard
                  </div>
                  <ul className="text-[10px] text-slate-500 pl-3 list-disc space-y-0.5 mt-0.5">
                    <li>Indicadores</li>
                    <li>Gráficos de Vendas</li>
                    <li>Estoque Crítico</li>
                  </ul>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/pedidos')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    02. Pedidos
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/produtos')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    03. Produtos
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/estoque')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    04. Estoque & Inventário
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/categorias')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    05. Categorias & Marcas
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/fornecedores')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    07. Fornecedores & Compras
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/precos')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    09. Preços & Promoções
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/clientes')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    11. Clientes & Clube Family
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/separacao')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    13. Separação & Entregas
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/pdv-caixa')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    15. PDV / Caixa Monitor
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/financeiro')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    16. Financeiro & Relatórios
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/usuarios')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    18. Usuários & Permissões
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('ADMIN', '/admin/loja-online')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    19. Loja Online & Aplicativo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PDV / CAIXA (Cyan) */}
          {(filterModule === 'ALL' || filterModule === 'PDV') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-sky-500 shadow-sm flex flex-col space-y-3">
              <div className="bg-sky-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-black text-sm">
                  <Calculator className="w-4 h-4" />
                  <span>PDV / CAIXA</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateEnv('PDV', '/pos')}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold transition"
                >
                  Abrir ↗
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700 overflow-y-auto max-h-[680px] pr-1 divide-y divide-slate-100">
                <div className="pt-1">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/login')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    01. Login do PDV
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    03. Nova Venda (Frente de Caixa)
                  </div>
                  <ul className="text-[10px] text-slate-500 pl-3 list-disc space-y-0.5 mt-0.5">
                    <li>Carrinho de Compras</li>
                    <li>Adicionar Produto (Leitor)</li>
                    <li>Catálogo Touch</li>
                    <li>Clube Family (F4)</li>
                  </ul>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/venda/pagamento')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    04. Pagamento (F8)
                  </div>
                  <ul className="text-[10px] text-slate-500 pl-3 list-disc space-y-0.5 mt-0.5">
                    <li>Dinheiro com Troco</li>
                    <li>Pix Dinâmico</li>
                    <li>Cartão Débito/Crédito TEF</li>
                    <li>Pagamento Misto</li>
                  </ul>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/venda/concluida')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    05. Venda Concluída (Comprovante)
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/historico')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    06. Últimas Vendas
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/consultar-preco')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    07. Consultar Preço (F9)
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/caixa/abertura')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    08. Caixa (Abertura / Fechamento)
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/sangria')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    09. Movimentações (Sangria / Suprimento)
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/devolucoes')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    11. Devoluções & Trocas
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/relatorios')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    13. Relatórios de Turno
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/configuracoes')}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    14. Configurações de Hardware
                  </div>
                </div>

                <div className="pt-1.5">
                  <div
                    onClick={() => onNavigateEnv('PDV', '/pos/login')}
                    className="font-bold text-slate-500 hover:underline cursor-pointer"
                  >
                    16. Sair / Trocar Operador
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Demo Credential Cards matching bottom bar of Image 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900 uppercase">Demo Cliente</div>
              <div className="text-xs font-mono font-bold text-emerald-700">cliente@family.com</div>
              <div className="text-[11px] text-slate-500">Senha: 123456</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase">Demo Administrador</div>
              <div className="text-xs font-mono font-bold text-indigo-700">admin@family.com</div>
              <div className="text-[11px] text-slate-500">Senha: 123456</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-900 uppercase">Demo Caixa / PDV</div>
              <div className="text-xs font-mono font-bold text-sky-700">caixa@family.com</div>
              <div className="text-[11px] text-slate-500">Senha: 123456 (PIN 1234)</div>
            </div>
          </div>
        </div>

        {/* Footer Credits matching exact project specification */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Family Supermarket • Arquitetura Integrada PWA</span>
          </div>

          <div className="font-bold text-slate-300">
            Desenvolvido por <strong className="text-white">Vini Amaral</strong>
          </div>

          <div className="text-slate-400">
            Licenciado por <strong>Family Supermarket LTDA</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
