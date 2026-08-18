import { Product, Customer, PaymentMethod, CashMovement, Sale } from './pos';

export type AppEnvironment = 'LOJA' | 'CLIENTE' | 'CHECKOUT' | 'ADMIN' | 'PDV' | 'MAPA' | 'CONTRATAR';

export interface OnlineCartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CreditCardRecord {
  id: string;
  cardNumberMasked: string;
  cardHolderName: string;
  expirationDate: string;
  brand: string;
  isDefault: boolean;
}

export interface OnlineOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  deliveryAddress: Address;
  deliveryMethod: 'EXPRESSA' | 'AGENDADA' | 'RETIRADA';
  scheduledTimeSlot?: string;
  items: OnlineCartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO';
  installments?: number;
  status: 'APROVADO' | 'SEPARACAO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO';
  trackingSteps: {
    step: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
  pixQrCode?: string;
  pixCopiaCola?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer: boolean;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface EquivalentProduct {
  brand: string;
  name: string;
  price: number;
  unitPrice: string;
  pricePerKg?: number;
}

export interface AdminStats {
  todayRevenue: number;
  todayOrdersCount: number;
  averageTicket: number;
  lowStockItemsCount: number;
  openRegistersCount: number;
  pendingDeliveriesCount: number;
  totalClubMembers: number;
}
