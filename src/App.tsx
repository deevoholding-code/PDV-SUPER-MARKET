import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { usePOSShortcuts } from './hooks/usePOSShortcuts';

// Global Switcher
import { GlobalEnvironmentNav } from './components/common/GlobalEnvironmentNav';

// POS Components & Modals
import { POSHeader } from './components/common/POSHeader';
import { POSSupervisorModal } from './components/modals/POSSupervisorModal';
import { POSWeighedModal } from './components/modals/POSWeighedModal';
import { POSPriceLookupModal } from './components/modals/POSPriceLookupModal';
import { POSHelpModal } from './components/modals/POSHelpModal';
import { POSLockScreen } from './components/modals/POSLockScreen';

// POS Views
import { POSLoginView } from './views/POSLoginView';
import { POSSalesView } from './views/POSSalesView';
import { POSPaymentView } from './views/POSPaymentView';
import { POSSaleCompletedView } from './views/POSSaleCompletedView';
import { POSCashOpenView } from './views/POSCashOpenView';
import { POSCashCloseView } from './views/POSCashCloseView';
import { POSCashMovementsView } from './views/POSCashMovementsView';
import { POSSalesHistoryView } from './views/POSSalesHistoryView';
import { POSDeliveryView } from './views/POSDeliveryView';
import { POSSettingsView } from './views/POSSettingsView';
import { POSReportsView } from './views/POSReportsView';

// Store & Customer & Checkout & Admin Views
import { StoreHeader } from './components/store/StoreHeader';
import { StoreFooter } from './components/store/StoreFooter';
import { StoreHomeView } from './views/store/StoreHomeView';
import { StoreCatalogView } from './views/store/StoreCatalogView';
import { StoreProductDetailView } from './views/store/StoreProductDetailView';
import { StoreCartView } from './views/store/StoreCartView';
import { CheckoutMasterView } from './views/checkout/CheckoutMasterView';
import { CustomerMasterView } from './views/customer/CustomerMasterView';
import { AdminMasterView } from './views/admin/AdminMasterView';

// PDV Inner Router
const POSInnerRouter: React.FC = () => {
  const { currentRoute, currentUser } = usePOS();
  usePOSShortcuts();

  if (!currentUser || currentRoute === '/pos/login') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans antialiased text-slate-800">
        <POSLoginView />
      </div>
    );
  }

  const renderPOSView = () => {
    switch (currentRoute) {
      case '/pos/login':
        return <POSLoginView />;
      case '/pos/venda/pagamento':
        return <POSPaymentView />;
      case '/pos/venda/concluida':
        return <POSSaleCompletedView />;
      case '/pos/caixa/abertura':
        return <POSCashOpenView />;
      case '/pos/caixa/fechamento':
        return <POSCashCloseView />;
      case '/pos/sangria':
        return <POSCashMovementsView initialType="SANGRIA" />;
      case '/pos/suprimento':
        return <POSCashMovementsView initialType="SUPRIMENTO" />;
      case '/pos/caixa/movimentacoes':
        return <POSCashMovementsView />;
      case '/pos/historico':
      case '/pos/vendas':
      case '/pos/devolucoes':
      case '/pos/trocas':
        return <POSSalesHistoryView />;
      case '/pos/delivery':
        return <POSDeliveryView />;
      case '/pos/configuracoes':
        return <POSSettingsView />;
      case '/pos/relatorios':
        return <POSReportsView />;
      case '/pos':
      case '/pos/venda':
      case '/pos/venda/novo':
      default:
        return <POSSalesView />;
    }
  };

  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-slate-950 font-sans antialiased select-none overflow-hidden">
      <POSHeader />
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {renderPOSView()}
      </main>
      <POSSupervisorModal />
      <POSWeighedModal />
      <POSPriceLookupModal />
      <POSHelpModal />
      <POSLockScreen />
    </div>
  );
};

// Unified Application Shell
const AppUnifiedShell: React.FC = () => {
  const { currentEnv, currentStoreRoute, onlineSubRoute } = useStore();

  // AMBIENTE 3: PDV (Operacional de Frente de Caixa Exclusivo)
  if (currentEnv === 'PDV') {
    return (
      <div className="h-screen h-[100dvh] w-full bg-slate-950 overflow-hidden flex flex-col">
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <POSInnerRouter />
        </main>
      </div>
    );
  }

  // AMBIENTE 2: ADMINISTRADOR / LOJISTA (ERP & Backoffice)
  if (currentEnv === 'ADMIN') {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-900">
        <GlobalEnvironmentNav />
        <main className="flex-1">
          <AdminMasterView />
        </main>
      </div>
    );
  }

  // AMBIENTE 1: CLIENTE — CHECKOUT
  if (currentEnv === 'CHECKOUT') {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <StoreHeader />
        <main className="flex-1">
          <CheckoutMasterView />
        </main>
        <StoreFooter />
      </div>
    );
  }

  // AMBIENTE 1: CLIENTE — MINHA CONTA / LOGIN / CADASTRO
  if (currentEnv === 'CLIENTE') {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <StoreHeader />
        <main className="flex-1">
          <CustomerMasterView />
        </main>
        <StoreFooter />
      </div>
    );
  }

  // AMBIENTE 1: CLIENTE — VITRINE, CATÁLOGO E CARRINHO (LOJA)
  const renderStoreContent = () => {
    const route = currentStoreRoute || onlineSubRoute || '/';
    if (route.startsWith('/produtos/')) {
      return <StoreProductDetailView />;
    }
    if (
      route.startsWith('/produtos') ||
      route.startsWith('/categoria') ||
      route.startsWith('/ofertas') ||
      route.startsWith('/mais-vendidos') ||
      route.startsWith('/novidades') ||
      route.startsWith('/busca')
    ) {
      return <StoreCatalogView />;
    }
    if (route === '/carrinho') {
      return <StoreCartView />;
    }
    return <StoreHomeView />;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <StoreHeader />
      <main className="flex-1">
        {renderStoreContent()}
      </main>
      <StoreFooter />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <StoreProvider>
        <AppUnifiedShell />
      </StoreProvider>
    </POSProvider>
  );
}
