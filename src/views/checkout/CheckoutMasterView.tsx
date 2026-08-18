import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Check,
  ChevronRight,
  ShieldCheck,
  User,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  Lock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Store,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { FamilyLogo } from '../../components/common/FamilyLogo';
import { sound } from '../../services/soundService';

type CheckoutPhase = 1 | 2 | 3 | 4 | 5 | 6;

export const CheckoutMasterView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    currentCustomer,
    addresses,
    addAddress,
    createOrder,
    activeOrder,
    navigateEnv,
  } = useStore();

  const [phase, setPhase] = useState<CheckoutPhase>(1);

  // Phase 1: Identification
  const [identName, setIdentName] = useState(currentCustomer?.name || 'Carlos Silva');
  const [identEmail, setIdentEmail] = useState(currentCustomer?.email || 'cliente@family.com');
  const [identCpf, setIdentCpf] = useState(currentCustomer?.cpf || '123.456.789-00');
  const [identPhone, setIdentPhone] = useState(currentCustomer?.phone || '(11) 98765-4321');
  const [joinClub, setJoinClub] = useState(true);

  // Phase 2: Address
  const [selectedAddrId, setSelectedAddrId] = useState(addresses[0]?.id || 'addr-01');
  const [newAddrMode, setNewAddrMode] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('São Paulo');
  const [newState, setNewState] = useState('SP');
  const [newZipCode, setNewZipCode] = useState('01310-100');
  const [newComplement, setNewComplement] = useState('');

  // Phase 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'EXPRESSA' | 'AGENDADA' | 'RETIRADA'>('EXPRESSA');
  const [scheduledSlot, setScheduledSlot] = useState('Hoje - das 18h às 21h');

  // Phase 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO'>('PIX');
  const [installments, setInstallments] = useState(1);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('CARLOS SILVA');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cashChange, setCashChange] = useState('Sem troco (Valor exato)');

  // Pix copy feedback
  const [copiedPix, setCopiedPix] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddrId) || addresses[0];

  const handleFinishOrder = () => {
    sound.playBeep();
    createOrder({
      deliveryAddress: selectedAddress,
      deliveryMethod,
      scheduledTimeSlot: deliveryMethod === 'AGENDADA' ? scheduledSlot : undefined,
      paymentMethod,
      installments: paymentMethod === 'CREDITO' ? installments : undefined,
    });
    setPhase(6);
  };

  const handleCopyPix = () => {
    if (activeOrder?.pixCopiaCola) {
      navigator.clipboard.writeText(activeOrder.pixCopiaCola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const phasesLabels = [
    { num: 1, label: 'Identificação' },
    { num: 2, label: 'Endereço' },
    { num: 3, label: 'Entrega' },
    { num: 4, label: 'Pagamento' },
    { num: 5, label: 'Revisão' },
    { num: 6, label: 'Conclusão' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none">
      {/* Top Checkout Header (Clean & Secure) */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigateEnv('LOJA', '/')}
            className="cursor-pointer"
          >
            <FamilyLogo variant="color" size="md" />
          </div>

          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Ambiente 100% Seguro & Criptografado</span>
            <span className="sm:hidden">Checkout Seguro</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Phase Stepper Progress Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between relative">
            {phasesLabels.map((p, idx) => {
              const isDone = phase > p.num;
              const isCurrent = phase === p.num;

              return (
                <div key={p.num} className="flex-1 flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs transition shadow-2xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : p.num}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1.5 text-center hidden md:block ${
                      isCurrent ? 'text-blue-700 font-black' : isDone ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Phase Box (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* FASE 1: IDENTIFICAÇÃO */}
            {phase === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">1. Identificação do Cliente</h2>
                    <p className="text-xs text-slate-500">Informe seus dados para emissão do pedido e nota fiscal.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nome Completo</label>
                    <input
                      type="text"
                      value={identName}
                      onChange={(e) => setIdentName(e.target.value)}
                      placeholder="Nome e Sobrenome"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">E-mail para Confirmação</label>
                    <input
                      type="email"
                      value={identEmail}
                      onChange={(e) => setIdentEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">CPF (Para Nota Fiscal e Clube)</label>
                    <input
                      type="text"
                      value={identCpf}
                      onChange={(e) => setIdentCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Celular / WhatsApp (Atualizações do Pedido)</label>
                    <input
                      type="text"
                      value={identPhone}
                      onChange={(e) => setIdentPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={joinClub}
                    onChange={(e) => setJoinClub(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="text-xs font-black text-amber-950">Ativar Clube Family gratuitamente com este CPF</span>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Acumule pontos neste pedido e ganhe descontos automáticos em suas compras futuras.
                    </p>
                  </div>
                </label>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPhase(2)}
                    className="px-6 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  >
                    <span>CONTINUAR PARA ENDEREÇO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* FASE 2: ENDEREÇO DE ENTREGA */}
            {phase === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">2. Endereço de Entrega</h2>
                    <p className="text-xs text-slate-500">Onde você deseja receber suas compras?</p>
                  </div>
                </div>

                {/* Saved addresses list */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition ${
                        selectedAddrId === addr.id
                          ? 'border-blue-600 bg-blue-50/70 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddrId === addr.id}
                          onChange={() => setSelectedAddrId(addr.id)}
                          className="mt-1 text-blue-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {addr.street}, {addr.number} - {addr.complement}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {addr.neighborhood} - {addr.city}/{addr.state} • CEP {addr.zipCode}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPhase(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhase(3)}
                    className="px-6 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  >
                    <span>CONTINUAR PARA ENTREGA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3: MODALIDADE DE ENTREGA */}
            {phase === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">3. Tipo de Entrega</h2>
                    <p className="text-xs text-slate-500">Selecione a forma mais conveniente para você.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Expressa 2h */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition ${
                      deliveryMethod === 'EXPRESSA'
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'EXPRESSA'}
                        onChange={() => setDeliveryMethod('EXPRESSA')}
                        className="text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <span>Entrega Turbo Family (Até 2 horas)</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                            Mais Rápida
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Seu pedido chega hoje mesmo com produtos frescos selecionados na loja mais próxima.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-700">R$ 9,90</span>
                  </label>

                  {/* Option 2: Agendada */}
                  <label
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition ${
                      deliveryMethod === 'AGENDADA'
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'AGENDADA'}
                        onChange={() => setDeliveryMethod('AGENDADA')}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>Entrega Agendada (Escolha o Turno)</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Escolha o dia e horário que melhor se adapta à sua rotina.
                        </p>

                        {deliveryMethod === 'AGENDADA' && (
                          <div className="mt-3">
                            <select
                              value={scheduledSlot}
                              onChange={(e) => setScheduledSlot(e.target.value)}
                              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                            >
                              <option value="Hoje - das 18h às 21h">Hoje - Noite (das 18h às 21h)</option>
                              <option value="Amanhã - das 08h às 12h">Amanhã - Manhã (das 08h às 12h)</option>
                              <option value="Amanhã - das 13h às 17h">Amanhã - Tarde (das 13h às 17h)</option>
                              <option value="Amanhã - das 18h às 21h">Amanhã - Noite (das 18h às 21h)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-700">R$ 12,00</span>
                  </label>

                  {/* Option 3: Retirada */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition ${
                      deliveryMethod === 'RETIRADA'
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'RETIRADA'}
                        onChange={() => setDeliveryMethod('RETIRADA')}
                        className="text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-blue-700" />
                          <span>Clique & Retire no Supermercado (Loja 01 - Matriz)</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Pronto em até 1 hora no balcão de atendimento. Sem filas de caixa.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-700">GRÁTIS</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPhase(2)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhase(4)}
                    className="px-6 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  >
                    <span>CONTINUAR PARA PAGAMENTO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* FASE 4: PAGAMENTO */}
            {phase === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">4. Forma de Pagamento</h2>
                    <p className="text-xs text-slate-500">Escolha como prefere pagar suas compras.</p>
                  </div>
                </div>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'PIX'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Pix Instantâneo</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">Aprovação Imediata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDITO')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'CREDITO'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-black shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Cartão de Crédito</span>
                    <span className="text-[9px] text-slate-400 font-normal">Até 3x sem juros</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DEBITO')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'DEBITO'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-black shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">Débito / Vales</span>
                    <span className="text-[9px] text-slate-400 font-normal">VR, VA, Alelo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DINHEIRO')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'DINHEIRO'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-black shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">Dinheiro</span>
                    <span className="text-[9px] text-slate-400 font-normal">Pagar na Entrega</span>
                  </button>
                </div>

                {/* Sub-form based on selection */}
                {paymentMethod === 'PIX' && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-700" />
                      Pagamento via Pix com QR Code Dinâmico
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Após revisar o pedido na próxima etapa, um QR Code dinâmico será gerado. Seu pedido será aprovado e separado imediatamente após a confirmação bancária.
                    </p>
                  </div>
                )}

                {paymentMethod === 'CREDITO' && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Validade</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      >
                        <option value={1}>1x de R$ {cartTotal.toFixed(2).replace('.', ',')} (Sem juros)</option>
                        <option value={2}>2x de R$ {(cartTotal / 2).toFixed(2).replace('.', ',')} (Sem juros)</option>
                        <option value={3}>3x de R$ {(cartTotal / 3).toFixed(2).replace('.', ',')} (Sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'DINHEIRO' && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700">Precisa de troco?</label>
                    <select
                      value={cashChange}
                      onChange={(e) => setCashChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Sem troco">Não preciso de troco (Valor exato)</option>
                      <option value="Troco para R$ 100">Troco para R$ 100,00</option>
                      <option value="Troco para R$ 200">Troco para R$ 200,00</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPhase(3)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhase(5)}
                    className="px-6 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  >
                    <span>REVISAR PEDIDO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* FASE 5: REVISÃO GERAL */}
            {phase === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">5. Revisão Geral do Pedido</h2>
                    <p className="text-xs text-slate-500">Confira todos os dados antes de finalizar sua compra.</p>
                  </div>
                </div>

                {/* Summary cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Cliente</span>
                    <div className="font-black text-slate-900">{identName}</div>
                    <div className="text-slate-600">{identEmail} • {identPhone}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Endereço de Entrega</span>
                    <div className="font-black text-slate-900">{selectedAddress.street}, {selectedAddress.number}</div>
                    <div className="text-slate-600">{selectedAddress.neighborhood} - {selectedAddress.city}/{selectedAddress.state}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Modalidade de Entrega</span>
                    <div className="font-black text-slate-900">
                      {deliveryMethod === 'EXPRESSA' ? 'Entrega Turbo (Até 2h)' : deliveryMethod === 'AGENDADA' ? scheduledSlot : 'Retirada na Loja 01'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Pagamento</span>
                    <div className="font-black text-slate-900 uppercase">{paymentMethod}</div>
                    {paymentMethod === 'CREDITO' && <div className="text-slate-600">{installments}x sem juros</div>}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700">Itens do Pedido ({cart.length})</div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 font-mono">{item.quantity}x</span>
                          <span className="font-medium text-slate-800">{item.product.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 font-mono">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPhase(4)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Alterar Pagamento
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishOrder}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <span>FINALIZAR E PAGAR AGORA</span>
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* FASE 6: PEDIDO CONCLUÍDO & RASTREAMENTO */}
            {phase === 6 && activeOrder && (
              <div className="space-y-6 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pedido Realizado com Sucesso!</span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Pedido {activeOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enviamos a confirmação detalhada para <strong>{activeOrder.customer.email}</strong>.
                    </p>
                  </div>
                </div>

                {/* Pix QR Code Box (If Pix) */}
                {activeOrder.paymentMethod === 'PIX' && (
                  <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 text-emerald-950 rounded-full text-xs font-black uppercase">
                      <Clock className="w-3.5 h-3.5" /> Pague em até 15 minutos para aprovação imediata
                    </div>

                    <div className="flex justify-center">
                      <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-md">
                        <img
                          src={activeOrder.pixQrCode}
                          alt="QR Code Pix"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copiedPix ? 'CÓDIGO PIX COPIADO!' : 'COPIAR CÓDIGO PIX COPIA E COLA'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Real-time Tracking Steps */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Status do Pedido em Tempo Real
                  </h3>

                  <div className="space-y-3">
                    {activeOrder.trackingSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
                          step.completed
                            ? 'bg-blue-50/60 border-blue-200 text-slate-900'
                            : 'bg-slate-50/50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              step.completed ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {step.completed ? <Check className="w-4 h-4" /> : i + 1}
                          </div>
                          <div>
                            <div className="font-bold">{step.step}</div>
                            <div className="text-[11px] text-slate-500">{step.description}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[11px] text-blue-700">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Imprimir Comprovante
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateEnv('CLIENTE', '/minha-conta/pedidos')}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" /> ACOMPANHAR NA MINHA CONTA
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateEnv('LOJA', '/')}
                    className="w-full sm:w-auto px-5 py-3 text-blue-700 hover:underline font-bold text-xs"
                  >
                    Voltar para a Loja
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Resumo da Compra
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} itens)</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono font-bold">
                    - R$ {cartDiscount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxa de Entrega</span>
                <span className="font-mono font-bold text-slate-900">
                  {cartDeliveryFee === 0 ? 'GRÁTIS' : `R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-700 font-mono tracking-tight">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Garantia de Satisfação
              </div>
              <p>Seus produtos chegam intactos e na temperatura correta, ou substituímos na hora.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Footer with mandatory credits */}
      <footer className="bg-white border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        <p>Desenvolvido por <strong className="text-slate-900 font-bold">Vini Amaral</strong> • Licenciado por <strong>Family Supermarket LTDA</strong></p>
      </footer>
    </div>
  );
};
