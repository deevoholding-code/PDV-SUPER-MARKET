import { useEffect } from 'react';
import { usePOS } from '../context/POSContext';

interface ShortcutOptions {
  onFocusSearch?: () => void;
  onOpenPayment?: () => void;
  onOpenCustomer?: () => void;
  onOpenDiscount?: () => void;
  onOpenPriceCheck?: () => void;
  onOpenHistory?: () => void;
  onOpenSangria?: () => void;
  onNewSale?: () => void;
  onOpenHelp?: () => void;
  onCancelItem?: () => void;
  onCancelSale?: () => void;
  onQuantityChange?: () => void;
  onEscape?: () => void;
}

export const usePOSShortcuts = (handlers?: ShortcutOptions) => {
  const {
    currentRoute,
    navigate,
    setHelpModalOpen,
    setPriceLookupModalOpen,
    cancelActiveSale,
    cartItems,
    isLocked,
  } = usePOS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If screen is locked, only allow Esc/Enter on PIN modal
      if (isLocked) return;

      // Check if user is typing in a standard input or textarea (unless it's an F-key)
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          if (handlers?.onOpenHelp) handlers.onOpenHelp();
          else setHelpModalOpen(true);
          break;

        case 'F2':
          e.preventDefault();
          if (handlers?.onQuantityChange) handlers.onQuantityChange();
          break;

        case 'F3':
          e.preventDefault();
          if (handlers?.onFocusSearch) handlers.onFocusSearch();
          else {
            const searchInput = document.getElementById('pos-main-search') as HTMLInputElement;
            if (searchInput) searchInput.focus();
          }
          break;

        case 'F4':
          e.preventDefault();
          if (handlers?.onOpenCustomer) handlers.onOpenCustomer();
          break;

        case 'F5':
          e.preventDefault();
          if (handlers?.onOpenDiscount) handlers.onOpenDiscount();
          break;

        case 'F6':
          e.preventDefault();
          if (handlers?.onCancelItem) handlers.onCancelItem();
          break;

        case 'F7':
          e.preventDefault();
          if (handlers?.onCancelSale) handlers.onCancelSale();
          else cancelActiveSale();
          break;

        case 'F8':
          e.preventDefault();
          if (cartItems.length > 0) {
            if (handlers?.onOpenPayment) handlers.onOpenPayment();
            else navigate('/pos/venda/pagamento');
          }
          break;

        case 'F9':
          e.preventDefault();
          if (handlers?.onOpenPriceCheck) handlers.onOpenPriceCheck();
          else setPriceLookupModalOpen(true);
          break;

        case 'F10':
          e.preventDefault();
          if (handlers?.onOpenHistory) handlers.onOpenHistory();
          else navigate('/pos/historico');
          break;

        case 'F11':
          e.preventDefault();
          if (handlers?.onOpenSangria) handlers.onOpenSangria();
          else navigate('/pos/sangria');
          break;

        case 'F12':
          e.preventDefault();
          if (handlers?.onNewSale) handlers.onNewSale();
          else navigate('/pos/venda/novo');
          break;

        case 'Escape':
          if (handlers?.onEscape) {
            handlers.onEscape();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handlers,
    currentRoute,
    navigate,
    setHelpModalOpen,
    setPriceLookupModalOpen,
    cancelActiveSale,
    cartItems.length,
    isLocked,
  ]);
};
