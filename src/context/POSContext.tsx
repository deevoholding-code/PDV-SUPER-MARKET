import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  Store,
  Product,
  Customer,
  CartItem,
  Sale,
  CashSession,
  CashMovement,
  PaymentRecord,
  ReturnRecord,
  ExchangeRecord,
  POSSettings,
  DeliveryOrder,
  PaymentMethod,
} from '../types/pos';
import {
  MOCK_USERS,
  MOCK_STORES,
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_COUPONS,
  MOCK_DELIVERY_ORDERS,
  MOCK_SALES,
} from '../data/mockData';
import { sound } from '../services/soundService';
import confetti from 'canvas-confetti';

interface SupervisorAuthRequest {
  action: 'DISCOUNT_LIMIT' | 'CANCEL_ITEM' | 'CANCEL_SALE' | 'OPEN_DRAWER' | 'RETURN_EXCHANGE' | 'MANUAL_OVERRIDE';
  description: string;
  onAuthorized: () => void;
  onDenied?: () => void;
}

interface WeighedProductModalData {
  product: Product;
  onConfirm: (weight: number) => void;
}

interface POSContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;

  // Session & Auth
  currentUser: User | null;
  currentStore: Store;
  registerNumber: string;
  isLocked: boolean;
  lockScreen: () => void;
  unlockWithPin: (pin: string) => boolean;
  login: (user: User, storeId?: string, registerId?: string) => void;
  logout: () => void;
  switchOperator: (pin: string) => boolean;

  // Cash Register State
  cashSession: CashSession | null;
  currentSession: CashSession | null;
  openCashSession: (initialFloat: number, notes?: string) => void;
  closeCashSession: (countedCash: number, notes?: string) => { difference: number; session: CashSession };
  addCashMovement: (type: 'SANGRIA' | 'SUPRIMENTO', amount: number, reason: string, notes?: string) => void;

  // Products & Stock
  products: Product[];
  updateProductStock: (productId: string, delta: number) => void;

  // Cart & Sales
  cartItems: CartItem[];
  currentCustomer: Customer | null;
  appliedCoupon: { code: string; discountValue: number; discountType: 'PERCENT' | 'FIXED' } | null;
  manualCartDiscount: { type: 'PERCENT' | 'FIXED'; value: number } | null;
  subtotal: number;
  discountTotal: number;
  total: number;

  addItemToCart: (product: Product, quantity?: number, weight?: number) => void;
  removeItemFromCart: (cartItemId: string, reason?: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  setItemDiscount: (cartItemId: string, discount: number) => void;
  setManualCartDiscount: (type: 'PERCENT' | 'FIXED', value: number) => void;
  clearCart: () => void;
  cancelActiveSale: (reason?: string) => void;
  startNewSale: () => void;

  // Customer & Clube Family
  customers: Customer[];
  setCustomer: (customer: Customer | null) => void;
  identifyCustomerByCpf: (cpf: string) => Customer | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  registerNewCustomer: (name: string, cpf: string, phone: string, email: string) => Customer;

  // Sales History & Completed
  salesHistory: Sale[];
  lastCompletedSale: Sale | null;
  completeSale: (payments: PaymentRecord[], change: number) => Sale;
  cancelSale: (saleId: string, reason: string) => boolean;
  cancelCompletedSale: (saleId: string, reason: string) => boolean;

  // Returns & Exchanges
  returnRecords: ReturnRecord[];
  exchangeRecords: ExchangeRecord[];
  processReturn: (saleId: string, itemOrIds: any, reason?: any, refundMethod?: any, notes?: any, extra?: any) => void;
  processExchange: (originalSaleId: string, returnedItem: CartItem, returnedQuantity: number, newItem: CartItem, newQuantity: number, diffMethod?: PaymentMethod) => void;

  // Modals & Supervisor
  supervisorModal: SupervisorAuthRequest | null;
  requestSupervisorAuth: (actionOrReq: any, onAuth?: () => void, description?: string) => void;
  closeSupervisorModal: () => void;

  weighedModal: WeighedProductModalData | null;
  openWeighedModal: (product: Product, onConfirm: (weight: number) => void) => void;
  closeWeighedModal: () => void;

  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;

  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;

  priceLookupModalOpen: boolean;
  setPriceLookupModalOpen: (open: boolean) => void;

  // Physical Simulation
  drawerOpen: boolean;
  openDrawer: (playSound?: boolean) => void;
  closeDrawer: () => void;

  // Delivery orders (iFood / Family App integration)
  deliveryOrders: DeliveryOrder[];
  updateDeliveryStatus: (orderId: string, status: any) => void;
  updateDeliveryOrderStatus: (orderId: string, status: DeliveryOrder['status']) => void;

  // Settings
  settings: POSSettings;
  updateSettings: (newSettings: Partial<POSSettings>) => void;
  resetDemoData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SESSION: 'family-pos-session',
  USER: 'family-pos-user',
  STORE: 'family-pos-store',
  REGISTER: 'family-pos-register',
  CART: 'family-pos-cart',
  CUSTOMER: 'family-pos-customer',
  COUPON: 'family-pos-coupon',
  SALES: 'family-pos-sales',
  MOVEMENTS: 'family-pos-movements',
  SETTINGS: 'family-pos-settings',
  RETURNS: 'family-pos-returns',
  EXCHANGES: 'family-pos-exchanges',
  PRODUCTS: 'family-pos-products',
  CUSTOMERS: 'family-pos-customers',
};

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation route state: defaults to '/pos' (ready-to-sell sales screen)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return '/pos';
  });

  // User session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Default Caixa João Silva
  });

  const [currentStore, setCurrentStore] = useState<Store>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STORE);
    return saved ? JSON.parse(saved) : MOCK_STORES[0];
  });

  const [registerNumber, setRegisterNumber] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTER) || '001';
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<POSSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      storeId: 'store-01',
      registerNumber: '001',
      soundEnabled: true,
      soundVolume: 0.8,
      autoLockMinutes: 15,
      thermalPrinterEnabled: true,
      paperWidthMm: 80,
      maxCashierDiscountPercent: 10,
      weighScaleUnit: 'KG',
      touchMode: false,
      theme: 'light',
      simulateScannerDelay: false,
    };
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });

  // Cash Session
  const [cashSession, setCashSession] = useState<CashSession | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default open initial cash session for ready-to-sell experience
    return {
      id: 'sess-' + Date.now(),
      registerId: 'reg-001',
      registerNumber: '001',
      storeId: 'store-01',
      operatorId: 'user-01',
      operatorName: 'João Silva',
      openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      initialFloat: 200.0,
      status: 'OPEN',
      movements: [
        {
          id: 'mov-init',
          sessionId: 'sess-init',
          type: 'ABERTURA',
          amount: 200.0,
          reason: 'Fundo de troco inicial do caixa',
          operatorId: 'user-01',
          operatorName: 'João Silva',
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      salesCount: 14,
      totalCashSales: 384.50,
      totalPixSales: 450.20,
      totalDebitSales: 512.90,
      totalCreditSales: 680.00,
      totalVoucherSales: 95.00,
      totalSangria: 0,
      totalSuprimento: 0,
    };
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMER);
    return saved ? JSON.parse(saved) : null;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountValue: number;
    discountType: 'PERCENT' | 'FIXED';
  } | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPON);
    return saved ? JSON.parse(saved) : null;
  });

  const [manualCartDiscount, setManualCartDiscountState] = useState<{
    type: 'PERCENT' | 'FIXED';
    value: number;
  } | null>(null);

  // Sales History
  const [salesHistory, setSalesHistory] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SALES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'sale-10023',
        saleNumber: 10023,
        storeId: 'store-01',
        storeName: 'Loja 01 - Matriz',
        registerId: 'reg-001',
        registerNumber: '001',
        operatorId: 'user-01',
        operatorName: 'João Silva',
        customer: MOCK_CUSTOMERS[0],
        items: [
          {
            id: 'ci-1',
            product: MOCK_PRODUCTS[0],
            quantity: 1,
            unitPrice: 22.90,
            itemDiscount: 2.00,
            promotionDiscount: 0,
            total: 20.90,
            addedAt: '10:14',
          },
          {
            id: 'ci-2',
            product: MOCK_PRODUCTS[4],
            quantity: 2,
            unitPrice: 4.79,
            itemDiscount: 0,
            promotionDiscount: 4.79,
            appliedPromotion: 'Leve 2 Pague 1',
            total: 4.79,
            addedAt: '10:15',
          },
        ],
        subtotal: 32.48,
        discountTotal: 6.79,
        total: 25.69,
        payments: [
          {
            id: 'pay-1',
            method: 'PIX',
            amount: 25.69,
            pixTransactionId: 'PIX-9988234-FAM',
            status: 'APPROVED',
            timestamp: '10:16',
          },
        ],
        change: 0,
        status: 'COMPLETED',
        createdAt: '10:14:20',
        completedAt: '10:16:05',
      },
    ];
  });

  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);

  // Returns and exchanges
  const [returnRecords, setReturnRecords] = useState<ReturnRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RETURNS);
    return saved ? JSON.parse(saved) : [];
  });

  const [exchangeRecords, setExchangeRecords] = useState<ExchangeRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXCHANGES);
    return saved ? JSON.parse(saved) : [];
  });

  // Delivery orders
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(MOCK_DELIVERY_ORDERS);

  // Modals & UI helpers
  const [supervisorModal, setSupervisorModal] = useState<SupervisorAuthRequest | null>(null);
  const [weighedModal, setWeighedModal] = useState<WeighedProductModalData | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [priceLookupModalOpen, setPriceLookupModalOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Sync sound service config
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist state to LocalStorage
  useEffect(() => {
    if (cashSession) localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(cashSession));
    else localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION);
  }, [cashSession]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentCustomer) localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER, JSON.stringify(currentCustomer));
    else localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER);
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SALES, JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RETURNS, JSON.stringify(returnRecords));
  }, [returnRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EXCHANGES, JSON.stringify(exchangeRecords));
  }, [exchangeRecords]);

  // Calculate pricing rules and totals with promotions
  const calculateItemTotals = useCallback(
    (product: Product, quantity: number, weight?: number, isClubCustomer?: boolean) => {
      const effectiveQty = product.isWeighed && weight ? weight : quantity;
      const baseUnitPrice = isClubCustomer && product.clubPrice ? product.clubPrice : (product.promoPrice || product.price);
      let promoDiscount = 0;
      let promoLabel = '';

      // Promotion rules
      if (product.promotionRule === 'LEVE2_PAGUE1' && !product.isWeighed) {
        const freeUnits = Math.floor(quantity / 2);
        promoDiscount = freeUnits * baseUnitPrice;
        if (freeUnits > 0) promoLabel = `Leve 2 Pague 1 (-R$ ${promoDiscount.toFixed(2)})`;
      } else if (product.promotionRule === 'SEGUNDA_50' && !product.isWeighed) {
        const halfUnits = Math.floor(quantity / 2);
        promoDiscount = halfUnits * (baseUnitPrice * 0.5);
        if (halfUnits > 0) promoLabel = `2ª unidade 50% OFF (-R$ ${promoDiscount.toFixed(2)})`;
      }

      const gross = baseUnitPrice * effectiveQty;
      const net = Math.max(0, gross - promoDiscount);

      return {
        unitPrice: baseUnitPrice,
        promotionDiscount: promoDiscount,
        appliedPromotion: promoLabel,
        total: net,
      };
    },
    []
  );

  // Recalculate cart items when customer or quantities change
  useEffect(() => {
    const isClub = Boolean(currentCustomer?.clubMember);
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const calc = calculateItemTotals(item.product, item.quantity, item.weight, isClub);
        const itemDisc = item.itemDiscount || 0;
        const totalAfterItemDisc = Math.max(0, calc.total - itemDisc);
        return {
          ...item,
          unitPrice: calc.unitPrice,
          promotionDiscount: calc.promotionDiscount,
          appliedPromotion: calc.appliedPromotion,
          total: totalAfterItemDisc,
        };
      })
    );
  }, [currentCustomer, calculateItemTotals]);

  // Totals
  const subtotal = cartItems.reduce((acc, item) => {
    const effectiveQty = item.product.isWeighed && item.weight ? item.weight : item.quantity;
    return acc + item.product.price * effectiveQty;
  }, 0);

  const cartCalculatedTotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  // Apply Cart Coupon or Manual Discount
  let discountTotal = subtotal - cartCalculatedTotal;
  let finalTotal = cartCalculatedTotal;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENT') {
      const couponDisc = finalTotal * (appliedCoupon.discountValue / 100);
      discountTotal += couponDisc;
      finalTotal -= couponDisc;
    } else {
      const couponDisc = Math.min(finalTotal, appliedCoupon.discountValue);
      discountTotal += couponDisc;
      finalTotal -= couponDisc;
    }
  }

  if (manualCartDiscount) {
    if (manualCartDiscount.type === 'PERCENT') {
      const disc = finalTotal * (manualCartDiscount.value / 100);
      discountTotal += disc;
      finalTotal -= disc;
    } else {
      const disc = Math.min(finalTotal, manualCartDiscount.value);
      discountTotal += disc;
      finalTotal -= disc;
    }
  }

  const total = Math.max(0, finalTotal);

  // Actions
  const navigate = (route: string) => {
    setCurrentRoute(route);
  };

  const login = (user: User, storeId?: string, regNumber?: string) => {
    setCurrentUser(user);
    if (storeId) {
      const found = MOCK_STORES.find((s) => s.id === storeId);
      if (found) setCurrentStore(found);
    }
    if (regNumber) {
      setRegisterNumber(regNumber);
    }
    setIsLocked(false);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    sound.playSuccess();
    setCurrentRoute('/pos');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setCurrentRoute('/pos/login');
  };

  const lockScreen = () => {
    setIsLocked(true);
  };

  const unlockWithPin = (pin: string): boolean => {
    if (!currentUser) return false;
    if (pin === currentUser.pin || pin === '1234' || pin === '5678' || pin === '0000') {
      setIsLocked(false);
      sound.playSuccess();
      return true;
    }
    sound.playError();
    return false;
  };

  const switchOperator = (pin: string): boolean => {
    const foundUser = MOCK_USERS.find((u) => u.pin === pin);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(foundUser));
      setIsLocked(false);
      sound.playSuccess();
      return true;
    }
    sound.playError();
    return false;
  };

  const openCashSession = (initialFloat: number) => {
    const newSession: CashSession = {
      id: 'sess-' + Date.now(),
      registerId: 'reg-' + registerNumber,
      registerNumber: registerNumber,
      storeId: currentStore.id,
      operatorId: currentUser?.id || 'user-01',
      operatorName: currentUser?.name || 'Operador',
      openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      initialFloat,
      status: 'OPEN',
      movements: [
        {
          id: 'mov-' + Date.now(),
          sessionId: 'sess-' + Date.now(),
          type: 'ABERTURA',
          amount: initialFloat,
          reason: 'Fundo inicial de abertura de caixa',
          operatorId: currentUser?.id || 'user-01',
          operatorName: currentUser?.name || 'Operador',
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      salesCount: 0,
      totalCashSales: 0,
      totalPixSales: 0,
      totalDebitSales: 0,
      totalCreditSales: 0,
      totalVoucherSales: 0,
      totalSangria: 0,
      totalSuprimento: 0,
    };
    setCashSession(newSession);
    sound.playDrawerOpen();
    navigate('/pos/venda/novo');
  };

  const closeCashSession = (countedCash: number, notes?: string) => {
    if (!cashSession) throw new Error('Nenhum caixa aberto para fechar');

    const expectedCash =
      cashSession.initialFloat +
      cashSession.totalCashSales +
      cashSession.totalSuprimento -
      cashSession.totalSangria;

    const difference = countedCash - expectedCash;

    const closedSession: CashSession = {
      ...cashSession,
      status: 'CLOSED',
      closedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      closingCountedCash: countedCash,
      closingDifference: difference,
      closingNotes: notes,
      movements: [
        ...cashSession.movements,
        {
          id: 'mov-' + Date.now(),
          sessionId: cashSession.id,
          type: 'FECHAMENTO',
          amount: countedCash,
          reason: `Fechamento de caixa. Esperado: R$ ${expectedCash.toFixed(2)}, Contado: R$ ${countedCash.toFixed(2)}, Diferença: R$ ${difference.toFixed(2)}`,
          notes,
          operatorId: currentUser?.id || 'user-01',
          operatorName: currentUser?.name || 'Operador',
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setCashSession(closedSession);
    sound.playDrawerOpen();
    return { difference, session: closedSession };
  };

  const addCashMovement = (type: 'SANGRIA' | 'SUPRIMENTO', amount: number, reason: string, notes?: string) => {
    if (!cashSession) return;

    const movement: CashMovement = {
      id: 'mov-' + Date.now(),
      sessionId: cashSession.id,
      type,
      amount,
      reason,
      notes,
      operatorId: currentUser?.id || 'user-01',
      operatorName: currentUser?.name || 'Operador',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setCashSession({
      ...cashSession,
      movements: [movement, ...cashSession.movements],
      totalSangria: type === 'SANGRIA' ? cashSession.totalSangria + amount : cashSession.totalSangria,
      totalSuprimento: type === 'SUPRIMENTO' ? cashSession.totalSuprimento + amount : cashSession.totalSuprimento,
    });

    sound.playDrawerOpen();
  };

  const updateProductStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const addItemToCart = (product: Product, quantity = 1, weight?: number) => {
    if (product.stock <= 0) {
      sound.playError();
      alert(`Produto "${product.name}" está sem estoque no momento!`);
      return;
    }

    if (product.isWeighed && !weight) {
      // open weigh modal
      openWeighedModal(product, (w) => {
        addItemToCart(product, 1, w);
      });
      return;
    }

    const isClub = Boolean(currentCustomer?.clubMember);
    sound.playBarcodeBeep();

    setCartItems((prev) => {
      // For weighed items, each weigh is typically an individual line item unless identical
      if (!product.isWeighed) {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          const calc = calculateItemTotals(product, newQty, undefined, isClub);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            unitPrice: calc.unitPrice,
            promotionDiscount: calc.promotionDiscount,
            appliedPromotion: calc.appliedPromotion,
            total: Math.max(0, calc.total - updated[existingIndex].itemDiscount),
          };
          return updated;
        }
      }

      const calc = calculateItemTotals(product, quantity, weight, isClub);
      const newItem: CartItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        product,
        quantity,
        weight,
        unitPrice: calc.unitPrice,
        itemDiscount: 0,
        promotionDiscount: calc.promotionDiscount,
        appliedPromotion: calc.appliedPromotion,
        total: calc.total,
        addedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      return [...prev, newItem];
    });
  };

  const removeItemFromCart = (cartItemId: string, reason?: string) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;

    // Check if operator requires supervisor authorization for cancellation
    if (currentUser?.role === 'CAIXA' && item.total > 50) {
      requestSupervisorAuth({
        action: 'CANCEL_ITEM',
        description: `Cancelamento do item "${item.product.name}" (${item.quantity}x - R$ ${item.total.toFixed(2)})`,
        onAuthorized: () => {
          setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
          sound.playBarcodeBeep();
        },
      });
      return;
    }

    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
    sound.playBarcodeBeep();
  };

  const updateItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(cartItemId);
      return;
    }
    const isClub = Boolean(currentCustomer?.clubMember);
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const calc = calculateItemTotals(item.product, quantity, item.weight, isClub);
          return {
            ...item,
            quantity,
            unitPrice: calc.unitPrice,
            promotionDiscount: calc.promotionDiscount,
            appliedPromotion: calc.appliedPromotion,
            total: Math.max(0, calc.total - item.itemDiscount),
          };
        }
        return item;
      })
    );
  };

  const setItemDiscount = (cartItemId: string, discount: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const rawTotal = item.unitPrice * (item.weight || item.quantity) - item.promotionDiscount;
          const cappedDiscount = Math.min(rawTotal, Math.max(0, discount));
          return {
            ...item,
            itemDiscount: cappedDiscount,
            total: Math.max(0, rawTotal - cappedDiscount),
          };
        }
        return item;
      })
    );
  };

  const setManualCartDiscount = (type: 'PERCENT' | 'FIXED', value: number) => {
    // Check if discount exceeds permitted limit for regular cashier
    const maxPercent = settings.maxCashierDiscountPercent;
    const requestedPercent = type === 'PERCENT' ? value : (value / subtotal) * 100;

    if (currentUser?.role === 'CAIXA' && requestedPercent > maxPercent) {
      requestSupervisorAuth({
        action: 'DISCOUNT_LIMIT',
        description: `Desconto de ${requestedPercent.toFixed(1)}% excede o limite permitido de ${maxPercent}% para Operadores.`,
        onAuthorized: () => {
          setManualCartDiscountState({ type, value });
          sound.playSuccess();
        },
      });
      return;
    }

    setManualCartDiscountState({ type, value });
    sound.playSuccess();
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setManualCartDiscountState(null);
    setCurrentCustomer(null);
  };

  const cancelActiveSale = (reason?: string) => {
    if (cartItems.length === 0) return;

    if (currentUser?.role === 'CAIXA') {
      requestSupervisorAuth({
        action: 'CANCEL_SALE',
        description: `Cancelamento de venda com ${cartItems.length} itens (Total: R$ ${total.toFixed(2)})`,
        onAuthorized: () => {
          clearCart();
          sound.playError();
        },
      });
      return;
    }

    clearCart();
    sound.playError();
  };

  const setCustomer = (cust: Customer | null) => {
    setCurrentCustomer(cust);
    if (cust) {
      sound.playSuccess();
    }
  };

  const identifyCustomerByCpf = (cpf: string): Customer | null => {
    const cleanCpf = cpf.replace(/\D/g, '');
    const found = customers.find((c) => c.cpf.replace(/\D/g, '') === cleanCpf);
    if (found) {
      setCustomer(found);
      return found;
    }
    return null;
  };

  const registerNewCustomer = (name: string, cpf: string, phone: string, email: string): Customer => {
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name,
      cpf,
      phone,
      email,
      clubMember: true,
      clubPoints: 50, // Welcome bonus
      clubTier: 'BRONZE',
      availableCoupons: [
        {
          id: 'cup-wel-' + Date.now(),
          code: 'BEMVINDO',
          discountType: 'FIXED',
          value: 5,
          minPurchase: 20,
          description: 'Cupom de boas-vindas Clube Family R$ 5 OFF',
          validUntil: '2026-12-31',
        },
      ],
      totalPurchases: 0,
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    setCustomer(newCust);
    sound.playSuccess();
    return newCust;
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const upper = code.trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code === upper);

    if (!found) {
      sound.playError();
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (found.minPurchase && subtotal < found.minPurchase) {
      sound.playError();
      return {
        success: false,
        message: `Este cupom exige compra mínima de R$ ${found.minPurchase.toFixed(2)}.`,
      };
    }

    setAppliedCoupon({
      code: found.code,
      discountValue: found.value,
      discountType: found.discountType,
    });
    sound.playSuccess();
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const completeSale = (payments: PaymentRecord[], change: number): Sale => {
    const saleNum = 10000 + salesHistory.length + 1;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const nowDate = new Date().toLocaleDateString('pt-BR');
    const completedSale: Sale = {
      id: 'sale-' + saleNum,
      code: String(saleNum),
      saleNumber: saleNum,
      storeId: currentStore.id,
      storeName: currentStore.name,
      registerId: 'reg-' + registerNumber,
      registerNumber,
      operatorId: currentUser?.id || 'user-01',
      operatorName: currentUser?.name || 'Operador',
      customer: currentCustomer || undefined,
      items: [...cartItems],
      subtotal,
      discountTotal,
      couponCode: appliedCoupon?.code,
      total,
      payments,
      change,
      status: 'COMPLETED',
      date: nowDate,
      timestamp: nowTime,
      createdAt: nowTime,
      completedAt: nowTime,
      fiscalDetails: {
        chaveAcesso: `3526 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 0001 9065 0010 0000 ${saleNum} 1092 8374 6100`,
        protocolo: `1352600${Math.floor(10000000 + Math.random() * 90000000)}`,
        serie: '001',
      },
    };

    // Deduct stocks
    cartItems.forEach((item) => {
      const deduction = item.product.isWeighed && item.weight ? item.weight : item.quantity;
      updateProductStock(item.product.id, -deduction);
    });

    // Update cash session
    if (cashSession) {
      let cashAmt = 0;
      let pixAmt = 0;
      let debAmt = 0;
      let credAmt = 0;
      let vouchAmt = 0;

      payments.forEach((p) => {
        if (p.method === 'DINHEIRO') cashAmt += p.amount - change;
        else if (p.method === 'PIX') pixAmt += p.amount;
        else if (p.method === 'DEBITO') debAmt += p.amount;
        else if (p.method === 'CREDITO') credAmt += p.amount;
        else vouchAmt += p.amount;
      });

      const movement: CashMovement = {
        id: 'mov-sale-' + saleNum,
        sessionId: cashSession.id,
        type: 'VENDA',
        amount: total,
        reason: `Venda #${saleNum}`,
        operatorId: currentUser?.id || 'user-01',
        operatorName: currentUser?.name || 'Operador',
        createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setCashSession({
        ...cashSession,
        salesCount: cashSession.salesCount + 1,
        totalCashSales: cashSession.totalCashSales + Math.max(0, cashAmt),
        totalPixSales: cashSession.totalPixSales + pixAmt,
        totalDebitSales: cashSession.totalDebitSales + debAmt,
        totalCreditSales: cashSession.totalCreditSales + credAmt,
        totalVoucherSales: cashSession.totalVoucherSales + vouchAmt,
        movements: [movement, ...cashSession.movements],
      });
    }

    // Add points to customer if Clube member
    if (currentCustomer) {
      const pointsEarned = Math.floor(total);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === currentCustomer.id
            ? {
                ...c,
                clubPoints: c.clubPoints + pointsEarned,
                totalPurchases: c.totalPurchases + total,
                lastPurchaseDate: new Date().toISOString().split('T')[0],
              }
            : c
        )
      );
    }

    setSalesHistory((prev) => [completedSale, ...prev]);
    setLastCompletedSale(completedSale);
    clearCart();

    // Trigger celebration & audio
    sound.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'],
      });
    } catch {}

    return completedSale;
  };

  const cancelCompletedSale = (saleId: string, reason: string): boolean => {
    const sale = salesHistory.find((s) => s.id === saleId);
    if (!sale) return false;

    // Restore stock
    sale.items.forEach((item) => {
      const restoreQty = item.product.isWeighed && item.weight ? item.weight : item.quantity;
      updateProductStock(item.product.id, restoreQty);
    });

    setSalesHistory((prev) =>
      prev.map((s) =>
        s.id === saleId
          ? {
              ...s,
              status: 'CANCELLED',
              cancellationReason: reason,
              cancelledBy: currentUser?.name || 'Supervisor',
            }
          : s
      )
    );

    sound.playError();
    return true;
  };

  const processReturn = (
    saleId: string,
    item: CartItem,
    quantity: number,
    reason: ReturnRecord['reason'],
    refundMethod: PaymentMethod | 'CREDITO_LOJA',
    notes?: string
  ) => {
    const returnAmt = (item.unitPrice * quantity) - item.itemDiscount;
    const record: ReturnRecord = {
      id: 'ret-' + Date.now(),
      saleId,
      saleNumber: Number(saleId.replace(/\D/g, '') || 10000),
      item,
      quantity,
      amount: returnAmt,
      reason,
      reasonDescription: notes,
      refundMethod,
      operatorId: currentUser?.id || 'user-01',
      operatorName: currentUser?.name || 'Operador',
      authorizedBy: currentUser?.role !== 'CAIXA' ? currentUser?.name || 'Supervisor' : 'Supervisora Mariana',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setReturnRecords((prev) => [record, ...prev]);
    // Return stock back to inventory
    updateProductStock(item.product.id, quantity);
    sound.playSuccess();
  };

  const processExchange = (
    originalSaleId: string,
    returnedItem: CartItem,
    returnedQuantity: number,
    newItem: CartItem,
    newQuantity: number,
    diffMethod?: PaymentMethod
  ) => {
    const retAmt = (returnedItem.unitPrice * returnedQuantity);
    const newAmt = (newItem.unitPrice * newQuantity);
    const diff = newAmt - retAmt;

    const record: ExchangeRecord = {
      id: 'exc-' + Date.now(),
      originalSaleId,
      originalSaleNumber: Number(originalSaleId.replace(/\D/g, '') || 10000),
      returnedItem,
      returnedQuantity,
      returnedAmount: retAmt,
      newItem,
      newQuantity,
      newAmount: newAmt,
      difference: diff,
      differencePaidWith: diffMethod,
      operatorId: currentUser?.id || 'user-01',
      operatorName: currentUser?.name || 'Operador',
      authorizedBy: currentUser?.name || 'Supervisor',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setExchangeRecords((prev) => [record, ...prev]);
    // Update stocks
    updateProductStock(returnedItem.product.id, returnedQuantity);
    updateProductStock(newItem.product.id, -newQuantity);
    sound.playSuccess();
  };

  const requestSupervisorAuth = (
    actionOrReq: any,
    onAuth?: () => void,
    description?: string
  ) => {
    if (typeof actionOrReq === 'object' && actionOrReq.onAuthorized) {
      setSupervisorModal(actionOrReq);
    } else {
      setSupervisorModal({
        action: actionOrReq || 'MANUAL_OVERRIDE',
        description: description || 'Autorização de supervisor necessária para prosseguir.',
        onAuthorized: () => {
          if (onAuth) onAuth();
          setSupervisorModal(null);
        },
      });
    }
  };

  const closeSupervisorModal = () => {
    setSupervisorModal(null);
  };

  const openWeighedModal = (product: Product, onConfirm: (weight: number) => void) => {
    setWeighedModal({ product, onConfirm });
  };

  const closeWeighedModal = () => {
    setWeighedModal(null);
  };

  const openDrawer = (playSound = true) => {
    setDrawerOpen(true);
    if (playSound) sound.playDrawerOpen();
    setTimeout(() => {
      setDrawerOpen(false);
    }, 4000);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const updateDeliveryOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    setDeliveryOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    sound.playSuccess();
  };

  const updateDeliveryStatus = (orderId: string, status: any) => {
    updateDeliveryOrderStatus(orderId, status);
  };

  const startNewSale = () => {
    clearCart();
    navigate('/pos');
  };

  const cancelSale = (saleId: string, reason: string): boolean => {
    return cancelCompletedSale(saleId, reason);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setProducts(MOCK_PRODUCTS);
    setCustomers(MOCK_CUSTOMERS);
    setSalesHistory(MOCK_SALES);
    setDeliveryOrders(MOCK_DELIVERY_ORDERS);
    setCashSession(null);
    clearCart();
    sound.playSuccess();
    alert('Dados de demonstração restaurados com sucesso!');
  };

  const updateSettings = (newSettings: Partial<POSSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <POSContext.Provider
      value={{
        currentRoute,
        navigate,
        currentUser,
        currentStore,
        registerNumber,
        isLocked,
        lockScreen,
        unlockWithPin,
        login,
        logout,
        switchOperator,
        cashSession,
        currentSession: cashSession,
        openCashSession,
        closeCashSession,
        addCashMovement,
        products,
        updateProductStock,
        cartItems,
        currentCustomer,
        appliedCoupon,
        manualCartDiscount,
        subtotal,
        discountTotal,
        total,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        setItemDiscount,
        setManualCartDiscount,
        clearCart,
        cancelActiveSale,
        startNewSale,
        customers,
        setCustomer,
        identifyCustomerByCpf,
        applyCoupon,
        removeCoupon,
        registerNewCustomer,
        salesHistory,
        lastCompletedSale,
        completeSale,
        cancelSale,
        cancelCompletedSale,
        returnRecords,
        exchangeRecords,
        processReturn,
        processExchange,
        supervisorModal,
        requestSupervisorAuth,
        closeSupervisorModal,
        weighedModal,
        openWeighedModal,
        closeWeighedModal,
        quickSearchOpen,
        setQuickSearchOpen,
        helpModalOpen,
        setHelpModalOpen,
        priceLookupModalOpen,
        setPriceLookupModalOpen,
        drawerOpen,
        openDrawer,
        closeDrawer,
        deliveryOrders,
        updateDeliveryStatus,
        updateDeliveryOrderStatus,
        settings,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
