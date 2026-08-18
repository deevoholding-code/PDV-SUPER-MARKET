import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { User, Search, UserPlus, Award, Ticket, Check, X, Shield, Phone, Mail, Sparkles } from 'lucide-react';
import { Customer } from '../../types/pos';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const POSCustomerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    customers,
    currentCustomer,
    setCustomer,
    registerNewCustomer,
    applyCoupon,
    appliedCoupon,
    removeCoupon,
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'SELECT' | 'REGISTER'>('SELECT');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New customer form state
  const [newName, setNewName] = useState<string>('');
  const [newCpf, setNewCpf] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm) ||
      c.phone.includes(searchTerm)
  );

  const handleSelectCustomer = (customer: Customer) => {
    setCustomer(customer);
    onClose();
  };

  const handleClearCustomer = () => {
    setCustomer(null);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCpf.trim()) {
      alert('Por favor, informe ao menos o Nome e o CPF do cliente.');
      return;
    }

    const created = registerNewCustomer(newName, newCpf, newPhone, newEmail);
    setCustomer(created);
    onClose();
  };

  const handleApplyCouponFromCard = (couponCode: string) => {
    applyCoupon(couponCode);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight">Identificar Cliente</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Award className="w-3 h-3" /> Clube Family
                </span>
              </div>
              <p className="text-blue-100 text-xs font-medium">Pontuação, cupons e ofertas exclusivas no PDV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('SELECT')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'SELECT'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            Buscar Cliente Cadastrado
          </button>
          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'REGISTER'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Novo Cliente
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'SELECT' ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por CPF, Nome ou Telefone..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Current identified customer badge if already selected */}
              {currentCustomer && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentCustomer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-emerald-950">{currentCustomer.name}</span>
                        <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full uppercase">
                          {currentCustomer.clubTier}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-0.5">
                        CPF: {currentCustomer.cpf} • {currentCustomer.clubPoints} Pontos acumulados
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCustomer}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
                  >
                    Desvincular
                  </button>
                </div>
              )}

              {/* Customer List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Clientes Disponíveis:
                </div>
                {filteredCustomers.map((cust) => {
                  const isSelected = currentCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{cust.name}</span>
                            {cust.clubMember && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded uppercase">
                                {cust.clubTier}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                            <span>CPF: {cust.cpf}</span>
                            <span>•</span>
                            <span>Tel: {cust.phone}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">{cust.clubPoints} Pontos</span>
                          </div>

                          {/* Customer coupons available */}
                          {cust.availableCoupons && cust.availableCoupons.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {cust.availableCoupons.map((coupon) => {
                                const isApplied = appliedCoupon?.code === coupon.code;
                                return (
                                  <button
                                    key={coupon.id}
                                    type="button"
                                    onClick={() => handleApplyCouponFromCard(coupon.code)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
                                      isApplied
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                                    }`}
                                  >
                                    <Ticket className="w-3 h-3" />
                                    {coupon.code} ({coupon.description})
                                    {isApplied && ' ✓'}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSelectCustomer(cust)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isSelected ? 'Selecionado' : 'Selecionar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Consumidor Não Identificado Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClearCustomer}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Manter como "CONSUMIDOR FINAL" (Sem CPF)
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed font-medium">
                  <strong>Bônus de Boas-Vindas Clube Family:</strong>
                  <div>Ao cadastrar o cliente no PDV, ele ganha imediatamente 50 pontos e um cupom BEMVINDO (R$ 5 OFF).</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Amanda Silva"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={newCpf}
                    onChange={(e) => setNewCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('SELECT')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Salvar e Identificar no PDV
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
