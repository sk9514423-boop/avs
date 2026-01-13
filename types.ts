
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  images?: string[];
  isError?: boolean;
}

export enum AppMode {
  DASHBOARD = 'dashboard',
  ORDERS = 'orders',
  ADD_ORDER = 'add_order',
  NDR = 'ndr',
  BILLING = 'billing',
  TOOLS = 'tools',
  REPORTS = 'reports', 
  SETTINGS = 'settings', 
  WEIGHT_DISCREPANCY = 'weight_discrepancy',
  OTHERS = 'others',
  AI_SUPPORT = 'ai_support',
  API_DOCS = 'api_docs',
  MARKETPLACE_HUB = 'marketplace_hub',
  SETTINGS_BRANDED_TRACKING = 'settings_branded_tracking',
  SETTINGS_LABEL = 'settings_label',
  SETTINGS_INVOICE = 'settings_invoice',
  SETTINGS_INSURANCE_LABEL = 'settings_insurance_label',
  SETTINGS_RATE_CARD = 'settings_rate_card',
  SETTINGS_AUTO_ASSIGN_COURIERS = 'settings_auto_assign_couriers',
  SETTINGS_AUTO_ASSIGN_RULE = 'settings_auto_assign_rule',
  SETTINGS_SHIPPING_NOTIFICATION = 'settings_shipping_notification',
  SHIPMENT_REPORT = 'shipment_report',
  ORDERS_REPORT = 'orders_report',
  NDR_REPORT = 'ndr_report',
  CUSTOM_REPORT = 'custom_report',
}

export interface Order {
  id: string;
  date: string;
  status: string;
  awb?: string;
  barcodeUrl?: string;
  category: 'Domestic' | 'International';
  tag: string;
  type?: string;
  products: { name: string; sku: string; qty: number; hsn?: string; price?: number }[];
  package: { dimensions: string; deadWt: string; volumetric: string };
  shipping: {
    name: string;
    phone: string;
    address: string;
    zip: string;
    country: string;
  };
  payment: {
    method: 'Prepaid' | 'COD';
    status: string;
    invoice: string;
  };
  financials?: {
    declaredValue: number;
    shippingCharge: number;
    insuranceCharge: number;
    codCharge: number;
    totalPayable: number;
    currency: string;
  };
  pickup: string;
  courier?: string;
  isInsured?: boolean;
  insuranceFee?: number;
  shippingCost?: number;
  sourcePlatform?: string;
}
