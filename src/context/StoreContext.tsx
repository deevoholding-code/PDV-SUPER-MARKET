import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer } from '../types/pos';
import {
  OnlineCartItem,
  Address,
  CreditCardRecord,
  OnlineOrder,
  ProductReview,
  AppEnvironment,
} from '../types/store';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../data/mockData';
import { sound } from '../services/soundService';

interface StoreContextType {
  // Navigation & Environment
  currentEnv: AppEnvironment;
  setCurrentEnv: (env: AppEnvironment) => void;
  onlineSubRoute: string;
  setOnlineSubRoute: (route: string) => void;
  currentStoreRoute: string;
  navigateEnv: (env: AppEnvironment, subRoute?: string) => void;

  // Online Cart
  cart: OnlineCartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearOnlineCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Customer Auth
  currentCustomer: Customer | null;
  loginCustomer: (email: string, pass: string) => boolean;
  logoutCustomer: () => void;
  registerCustomer: (name: string, email: string, cpf: string, phone: string) => void;

  // Customer Data
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  savedCards: CreditCardRecord[];
  addCard: (card: Omit<CreditCardRecord, 'id'>) => void;
  favoriteProductIds: string[];
  toggleFavorite: (productId: string) => void;

  // Orders
  orders: OnlineOrder[];
  activeOrder: OnlineOrder | null;
  createOrder: (orderData: Partial<OnlineOrder>) => OnlineOrder;
  updateOrderStatus: (orderId: string, status: OnlineOrder['status']) => void;

  // Selected Product for Detail
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;

  // Active Store Branch
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  // Active Admin Submodule
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    label: 'Casa',
    street: 'Av. Paulista',
    number: '1200',
    complement: 'Apto 45',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: true,
  },
  {
    id: 'addr-02',
    label: 'Trabalho',
    street: 'Rua Funchal',
    number: '418',
    complement: '10º Andar',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04551-060',
    isDefault: false,
  },
];

const DEFAULT_CARDS: CreditCardRecord[] = [
  {
    id: 'card-01',
    cardNumberMasked: '•••• •••• •••• 4242',
    cardHolderName: 'CARLOS SILVA',
    expirationDate: '12/28',
    brand: 'Mastercard',
    isDefault: true,
  },
];

const DEFAULT_ORDERS: OnlineOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: '#FS-8921',
    date: '18/05/2025 09:30',
    customer: {
      id: 'cust-01',
      name: 'Carlos Silva',
      email: 'cliente@family.com',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
    },
    deliveryAddress: DEFAULT_ADDRESSES[0],
    deliveryMethod: 'EXPRESSA',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 },
      { product: MOCK_PRODUCTS[1], quantity: 1 },
      { product: MOCK_PRODUCTS[4], quantity: 3 },
    ],
    subtotal: 68.66,
    discount: 5.0,
    deliveryFee: 9.9,
    total: 73.56,
    paymentMethod: 'PIX',
    status: 'SEPARACAO',
    trackingSteps: [
      { step: 'Pedido Confirmado', description: 'Pagamento Pix aprovado com sucesso', time: '09:30', completed: true },
      { step: 'Em Separação', description: 'Nossa equipe está selecionando seus itens frescos', time: '09:45', completed: true },
      { step: 'A Caminho', description: 'Saiu para entrega com o motorista Family Express', time: 'Previsto 10:30', completed: false },
      { step: 'Entregue', description: 'Entregue no endereço cadastrado', time: '--:--', completed: false },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: '#FS-8750',
    date: '15/05/2025 16:15',
    customer: {
      id: 'cust-01',
      name: 'Carlos Silva',
      email: 'cliente@family.com',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
    },
    deliveryAddress: DEFAULT_ADDRESSES[0],
    deliveryMethod: 'AGENDADA',
    scheduledTimeSlot: '16/05 entre 10h e 12h',
    items: [
      { product: MOCK_PRODUCTS[2], quantity: 2 },
      { product: MOCK_PRODUCTS[3], quantity: 1 },
    ],
    subtotal: 25.88,
    discount: 0,
    deliveryFee: 12.0,
    total: 37.88,
    paymentMethod: 'CREDITO',
    installments: 1,
    status: 'ENTREGUE',
    trackingSteps: [
      { step: 'Pedido Confirmado', description: 'Cartão de crédito aprovado', time: '16:15', completed: true },
      { step: 'Em Separação', description: 'Separado e embalado com cuidado', time: '17:00', completed: true },
      { step: 'A Caminho', description: 'Em rota de entrega', time: '10:10', completed: true },
      { step: 'Entregue', description: 'Entregue ao destinatário', time: '10:45', completed: true },
    ],
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEnv, setCurrentEnv] = useState<AppEnvironment>('PDV');
  const [onlineSubRoute, setOnlineSubRoute] = useState<string>('/');

  // Selected product detail ID
  const [selectedProductId, setSelectedProductId] = useState<string>(MOCK_PRODUCTS[0]?.id || 'prod-001');

  // Selected Branch (Loja 01 Matriz, Loja 02 Centro, Loja 03 Filial)
  const [selectedBranch, setSelectedBranch] = useState<string>('Loja 01 — Matriz');

  // Active Admin Submodule
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');

  // Online Cart
  const [cart, setCart] = useState<OnlineCartItem[]>(() => {
    const saved = localStorage.getItem('family-store-cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { product: MOCK_PRODUCTS[0], quantity: 1 },
      { product: MOCK_PRODUCTS[1], quantity: 1 },
      { product: MOCK_PRODUCTS[4], quantity: 2 },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('BEMVINDO10');

  // Customer Auth
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('family-store-customer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_CUSTOMERS[0];
      }
    }
    return MOCK_CUSTOMERS[0]; // Default logged-in customer for demo
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('family-store-addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [savedCards, setSavedCards] = useState<CreditCardRecord[]>(() => {
    const saved = localStorage.getItem('family-store-cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([
    MOCK_PRODUCTS[0].id,
    MOCK_PRODUCTS[3].id,
  ]);

  const [orders, setOrders] = useState<OnlineOrder[]>(() => {
    const saved = localStorage.getItem('family-store-orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<OnlineOrder | null>(orders[0] || null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('family-store-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('family-store-customer', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('family-store-customer');
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem('family-store-orders', JSON.stringify(orders));
  }, [orders]);

  const navigateEnv = (env: AppEnvironment, subRoute?: string) => {
    setCurrentEnv(env);
    if (subRoute) {
      setOnlineSubRoute(subRoute);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    sound.playBeep();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearOnlineCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let cartDiscount = 0;
  if (appliedCoupon === 'BEMVINDO10') {
    cartDiscount = cartSubtotal * 0.1;
  } else if (appliedCoupon === 'FAMILY50') {
    cartDiscount = Math.min(50, cartSubtotal * 0.2);
  }

  const cartDeliveryFee = cartSubtotal > 150 ? 0 : 9.9;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BEMVINDO10' || clean === 'FAMILY50' || clean === 'CLUBE10') {
      setAppliedCoupon(clean);
      return { success: true, message: `Cupom ${clean} aplicado com sucesso!` };
    }
    return { success: false, message: 'Cupom inválido ou expirado.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Customer auth
  const loginCustomer = (email: string, pass: string) => {
    const found = MOCK_CUSTOMERS.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (found || email.includes('cliente@family.com')) {
      setCurrentCustomer(found || MOCK_CUSTOMERS[0]);
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  const registerCustomer = (name: string, email: string, cpf: string, phone: string) => {
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name,
      email,
      cpf,
      phone,
      clubMember: true,
      clubPoints: 50,
      clubTier: 'BRONZE',
      availableCoupons: [],
      registeredAt: new Date().toLocaleDateString('pt-BR'),
      totalPurchases: 0,
    };
    setCurrentCustomer(newCust);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...address,
      id: 'addr-' + Date.now(),
    };
    setAddresses((prev) => [newAddr, ...prev]);
  };

  const addCard = (card: Omit<CreditCardRecord, 'id'>) => {
    const newCard: CreditCardRecord = {
      ...card,
      id: 'card-' + Date.now(),
    };
    setSavedCards((prev) => [newCard, ...prev]);
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const createOrder = (orderData: Partial<OnlineOrder>): OnlineOrder => {
    const orderNum = '#FS-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: OnlineOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      date: new Date().toLocaleString('pt-BR'),
      customer: {
        id: currentCustomer?.id || 'cust-01',
        name: currentCustomer?.name || 'Cliente Family',
        email: currentCustomer?.email || 'cliente@family.com',
        cpf: currentCustomer?.cpf || '000.000.000-00',
        phone: currentCustomer?.phone || '(11) 99999-9999',
      },
      deliveryAddress: orderData.deliveryAddress || addresses[0],
      deliveryMethod: orderData.deliveryMethod || 'EXPRESSA',
      scheduledTimeSlot: orderData.scheduledTimeSlot,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod || 'PIX',
      installments: orderData.installments,
      status: 'APROVADO',
      trackingSteps: [
        { step: 'Pedido Confirmado', description: 'Pagamento aprovado em tempo real', time: 'Agora', completed: true },
        { step: 'Em Separação', description: 'Separando produtos frescos na Loja Matriz', time: 'Em andamento', completed: false },
        { step: 'A Caminho', description: 'Motorista Family Express em rota', time: 'Previsto em 45 min', completed: false },
        { step: 'Entregue', description: 'Entrega no seu endereço', time: '--:--', completed: false },
      ],
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136family-supermarket-pix-key',
      pixCopiaCola: '00020126580014BR.GOV.BCB.PIX0136family-supermarket-pix-key520400005303986540550.005802BR5925FAMILY SUPERMARKET LTDA6009SAO PAULO62070503***6304E2D1',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearOnlineCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OnlineOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        currentEnv,
        setCurrentEnv,
        onlineSubRoute,
        setOnlineSubRoute,
        currentStoreRoute: onlineSubRoute || '/',
        navigateEnv,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearOnlineCart,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        currentCustomer,
        loginCustomer,
        logoutCustomer,
        registerCustomer,
        addresses,
        addAddress,
        savedCards,
        addCard,
        favoriteProductIds,
        toggleFavorite,
        orders,
        activeOrder,
        createOrder,
        updateOrderStatus,
        selectedProductId,
        setSelectedProductId,
        selectedBranch,
        setSelectedBranch,
        adminActiveTab,
        setAdminActiveTab,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
