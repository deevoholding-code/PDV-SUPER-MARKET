import React from 'react';
import { usePOS } from '../../context/POSContext';
import { HelpCircle, Keyboard, X, Headphones, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const POSHelpModal: React.FC = () => {
  const { helpModalOpen, setHelpModalOpen } = usePOS();

  if (!helpModalOpen) return null;

  const shortcuts = [
    { key: 'F1', label: 'Ajuda e Atalhos', desc: 'Abre este painel de consulta' },
    { key: 'F2', label: 'Alterar Quantidade', desc: 'Edita a quantidade do último produto lido' },
    { key: 'F3', label: 'Pesquisar Produto', desc: 'Foca na barra omnibar de busca / EAN' },
    { key: 'F4', label: 'Identificar Cliente', desc: 'CPF na nota / Clube Family' },
    { key: 'F5', label: 'Aplicar Desconto', desc: 'Desconto total, por item ou cupom promocional' },
    { key: 'F6', label: 'Cancelar Item', desc: 'Remove o item selecionado da lista' },
    { key: 'F7', label: 'Cancelar Venda', desc: 'Cancela toda a venda em andamento' },
    { key: 'F8', label: 'Finalizar / Pagamento', desc: 'Abre a tela de formas de pagamento e troco' },
    { key: 'F9', label: 'Consultar Preço', desc: 'Verifica preço normal, clube e estoque de um EAN' },
    { key: 'F10', label: 'Últimas Vendas', desc: 'Histórico e reimpressão de comprovantes' },
    { key: 'F11', label: 'Sangria / Suprimento', desc: 'Movimentações de numerário do caixa' },
    { key: 'F12', label: 'Nova Venda', desc: 'Inicia uma nova venda limpa' },
    { key: 'ESC', label: 'Voltar / Fechar', desc: 'Fecha modais ativos ou volta à tela anterior' },
    { key: 'ENTER', label: 'Confirmar', desc: 'Confirma ações, pesagem e pagamentos' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
              <Keyboard className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Guia Rápido & Atalhos do Teclado (F1)</h3>
              <p className="text-blue-200 text-xs font-medium">Operação ágil para terminais de supermercado</p>
            </div>
          </div>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Workflow Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-blue-600" /> Fluxo Operacional Mais Rápido:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-900">1. Scanner / EAN</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-900">2. Qtd (F2)</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-900">3. Cliente (F4)</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-900">4. Pagamento (F8)</span>
              <span>→</span>
              <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg">5. Concluído (Enter)</span>
            </div>
          </div>

          {/* Shortcuts Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Tabela Completa de Atalhos:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shortcuts.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    <kbd className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-black font-mono shadow-xs">
                      {item.key}
                    </kbd>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Suporte Técnico Family PDV</div>
                <div className="text-[11px] text-slate-500">Central: (11) 3456-7890 • Ramal 204 (Frente de Caixa)</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Chamado de suporte aberto para a equipe de TI da filial.');
                setHelpModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition"
            >
              Chamar Suporte TI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
