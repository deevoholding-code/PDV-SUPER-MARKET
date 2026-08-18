export type UserRole = 'CAIXA' | 'SUPERVISOR' | 'GERENTE' | 'ADMINISTRADOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pin: string;
  avatar?: string;
  storeId: string;
  registerId: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  cnpj: string;
  phone: string;
}

export interface Register {
  id: string;
  number: string;
  storeId: string;
  status: 'OPEN' | 'CLOSED' | 'BLOCKED';
  currentSessionId?: string;
}

export type UnitType = 'UN' | 'KG' | 'LT' | 'PCT' | 'CX';

export interface Product {
  id: string;
  name: string;
  sku: string;
  ean: string;
  barcode?: string;
  brand: string;
  category: string;
  unit: UnitType;
  price: number;
  originalPrice?: number;
  promoPrice?: number;
  promotionalPrice?: number;
  clubPrice?: number;
  stock: number;
  isWeighed?: boolean;
  tareWeight?: number; // em kg
  image: string;
  description?: string;
  promotionRule?: 'NONE' | 'LEVE2_PAGUE1' | 'SEGUNDA_50' | 'CLUBE_EXCLUSIVE' | 'COMBO';
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  clubMember: boolean;
  clubPoints: number;
  clubTier: 'BRONZE' | 'PRATA' | 'OURO' | 'DIAMANTE';
  availableCoupons: Coupon[];
  totalPurchases: number;
  lastPurchaseDate?: string;
  registeredAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  minPurchase?: number;
  description: string;
  validUntil: string;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  product: Product;
  quantity: number;
  weight?: number; // for weighed products
  unitPrice: number;
  itemDiscount: number;
  promotionDiscount: number;
  appliedPromotion?: string;
  total: number;
  addedAt: string;
}

export type PaymentMethod = 'DINHEIRO' | 'PIX' | 'DEBITO' | 'CREDITO' | 'VALE_ALIMENTACAO' | 'VALE_REFEICAO' | 'MISTO';

export interface PaymentRecord {
  id: string;
  method: PaymentMethod;
  amount: number;
  installments?: number;
  receivedAmount?: number;
  change?: number;
  cardBrand?: string;
  authorizationCode?: string;
  pixTransactionId?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  timestamp: string;
}

export interface Sale {
  id: string;
  code: string;
  saleNumber: number;
  storeId: string;
  storeName: string;
  registerId: string;
  registerNumber: string;
  operatorId: string;
  operatorName: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  total: number;
  payments: PaymentRecord[];
  change?: number;
  status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'EXCHANGED';
  cancellationReason?: string;
  cancelledBy?: string;
  date: string;
  timestamp: string;
  fiscalDetails?: {
    chaveAcesso: string;
    protocolo: string;
    serie: string;
  };
  createdAt: string;
  completedAt: string;
}

export type SaleRecord = Sale;

export type CashMovementType = 'ABERTURA' | 'SANGRIA' | 'SUPRIMENTO' | 'VENDA' | 'ESTORNO' | 'FECHAMENTO';

export interface CashMovement {
  id: string;
  sessionId: string;
  type: CashMovementType;
  amount: number;
  paymentMethod?: PaymentMethod;
  reason?: string;
  notes?: string;
  operatorId: string;
  operatorName: string;
  authorizedBy?: string;
  createdAt: string;
}

export interface CashSession {
  id: string;
  registerId: string;
  registerNumber: string;
  storeId: string;
  operatorId: string;
  operatorName: string;
  openedAt: string;
  closedAt?: string;
  initialFloat: number;
  status: 'OPEN' | 'CLOSED';
  movements: CashMovement[];
  salesCount: number;
  totalCashSales: number;
  totalPixSales: number;
  totalDebitSales: number;
  totalCreditSales: number;
  totalVoucherSales: number;
  totalSangria: number;
  totalSuprimento: number;
  closingCountedCash?: number;
  closingDifference?: number;
  closingNotes?: string;
}

export interface ReturnRecord {
  id: string;
  saleId: string;
  saleNumber: number;
  item: CartItem;
  quantity: number;
  amount: number;
  reason: 'DEFEITO' | 'DESISTENCIA' | 'ERRO_DIGITACAO' | 'VENCIMENTO' | 'OUTRO';
  reasonDescription?: string;
  refundMethod: PaymentMethod | 'CREDITO_LOJA';
  operatorId: string;
  operatorName: string;
  authorizedBy: string;
  createdAt: string;
}

export interface ExchangeRecord {
  id: string;
  originalSaleId: string;
  originalSaleNumber: number;
  returnedItem: CartItem;
  returnedQuantity: number;
  returnedAmount: number;
  newItem: CartItem;
  newQuantity: number;
  newAmount: number;
  difference: number; // positive = customer pays, negative = refund
  differencePaidWith?: PaymentMethod;
  operatorId: string;
  operatorName: string;
  authorizedBy: string;
  createdAt: string;
}

export interface DeliveryOrder {
  id: string;
  displayId: string;
  channel: 'IFOOD' | 'WHATSAPP' | 'APP_FAMILY' | 'RAPPI';
  customerName: string;
  customerPhone: string;
  address: string;
  items: { name: string; quantity: number; unitPrice: number; total: number }[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface POSSettings {
  storeId: string;
  registerNumber: string;
  soundEnabled: boolean;
  soundVolume: number;
  autoLockMinutes: number;
  thermalPrinterEnabled: boolean;
  thermalPrinterModel?: string;
  paperWidthMm: 80 | 58;
  scaleModel?: string;
  autoOpenCashDrawer?: boolean;
  autoPrintReceipt?: boolean;
  environment?: 'HOMOLOGACAO' | 'PRODUCAO';
  maxCashierDiscountPercent: number; // e.g. 5% for cashier, above requires supervisor
  weighScaleUnit: 'KG' | 'G';
  touchMode: boolean;
  theme: 'light' | 'dark';
  simulateScannerDelay: boolean;
}
