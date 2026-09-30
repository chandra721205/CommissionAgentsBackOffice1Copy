// TRADIE v1 Prototype Types
// Complete type definitions for 24-screen commodity trading platform

export type UserRole = 'producer' | 'buyer' | 'agent' | 'admin';

export type Language = 'EN' | 'HI' | 'TE' | 'TM' | 'KN' | 'BN' | 'MR';

export type KYCTier = 'Minimum' | 'Facial' | 'License' | 'Physical';

export type StorageType = 'Private' | 'Lease' | 'Chamber';

export type PaymentType = 'Upfront' | 'Partial';

export type PaymentMethod = 
  | 'UPI' 
  | 'NEFT' 
  | 'ACH' 
  | 'SEPA' 
  | 'Wire Transfer'
  | 'Cryptocurrency'
  | 'Cash';

export type VolumeUnit = 'Quintal' | 'Kg' | 'Nos' | 'Tonnes' | 'Liters';

export type PackagingType = 'Fixed' | 'Dynamic';

export type DueType = 
  | 'Regulatory' 
  | 'Association' 
  | 'Agreed' 
  | 'Net30' 
  | 'COD' 
  | 'Receipt' 
  | 'Custom Days';

export type BillStatus = 
  | 'Pending' 
  | 'Waiting for OTP' 
  | 'Confirmed' 
  | 'Rejected'
  | 'Mismatch Alert';

export type NotificationLevel = 'info' | 'warning' | 'error' | 'success';

export interface TradieTokens {
  balance: number;
  signupBonus: 50;
  dailyBonus: 5;
  tradeBonus: 10;
  history: TokenTransaction[];
}

export interface TokenTransaction {
  id: string;
  type: 'signup' | 'daily' | 'trade' | 'reward' | 'redeem';
  amount: number;
  timestamp: string;
  description: string;
}

export interface Commodity {
  id: string;
  name: string;
  category: string;
  variety?: string;
  unit: VolumeUnit;
  currentPrice?: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  language: Language;
  tokens: TradieTokens;
  kycTier: KYCTier;
  blockchainVerified: boolean;
  walletAddress?: string;
}

export interface ProduceListing {
  id: string;
  producerId: string;
  commodity: Commodity;
  quantity: number;
  unit: VolumeUnit;
  pricePerUnit: number;
  quality: string;
  images: string[];
  listedDate: string;
  status: 'Active' | 'Inspected' | 'Sampled' | 'Weighed' | 'Sold';
}

export interface Inspection {
  id: string;
  listingId: string;
  inspectorId: string;
  date: string;
  qualityGrade: string;
  moistureContent: number;
  foreignMatter: number;
  photos: string[];
  notes: string;
  approved: boolean;
}

export interface Sampling {
  id: string;
  listingId: string;
  sampleId: string;
  sampleDate: string;
  labResults: {
    parameter: string;
    value: string;
    acceptable: boolean;
  }[];
  certifiedBy: string;
  nftBadge?: string;
}

export interface Weighment {
  id: string;
  listingId: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  unit: VolumeUnit;
  weighbridgeId: string;
  operatorId: string;
  timestamp: string;
  vehicleNumber: string;
  blockchainHash?: string;
}

export interface MismatchAlert {
  id: string;
  billId: string;
  type: 'Quantity' | 'Quality' | 'Price' | 'Payment Terms';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  expectedValue: string;
  actualValue: string;
  raisedBy: string;
  raisedAt: string;
  status: 'Open' | 'Resolved' | 'Escalated';
}

export interface Storage {
  id: string;
  type: StorageType;
  ownerId: string;
  ownerType: 'Producer' | 'Buyer' | '3rd-Party';
  capacity: number;
  occupied: number;
  unit: VolumeUnit;
  location: string;
  rent?: number;
  paymentType?: PaymentType;
  regulatedPrice?: number;
  commodities: string[];
}

export interface BillEntry {
  id: string;
  serialNo: string;
  date: string;
  billNumber: string;
  buyer: {
    name: string;
    brands?: string[];
    address: string;
    contacts: string[];
  };
  debitAccount: {
    method: PaymentMethod;
    details: string;
  };
  items: BillItem[];
  packaging: {
    type: PackagingType;
    material: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  };
  subtotal: number;
  tax: number;
  taxPercentage: number;
  total: number;
  dueType: DueType;
  dueDate?: string;
  daysPast?: number;
  status: BillStatus;
  otpVerification?: OTPVerification;
  regulatorySync?: RegulatorySync;
}

export interface BillItem {
  commodity: Commodity;
  volume: number;
  unit: VolumeUnit;
  pricePerUnit: number;
  amount: number;
}

export interface OTPVerification {
  required: boolean;
  memberCount: 2;
  member1?: {
    name: string;
    phone: string;
    verified: boolean;
    timestamp?: string;
  };
  member2?: {
    name: string;
    phone: string;
    verified: boolean;
    timestamp?: string;
  };
  allVerified: boolean;
}

export interface RegulatorySync {
  yardQR: string;
  districtQR: string;
  stateQR: string;
  centralQR: string;
  syncedAt: string;
  ledgerUpdated: boolean;
  taxCalculated: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationLevel;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  relatedId?: string;
}

export interface Report {
  id: string;
  type: 'Sales' | 'Purchase' | 'Inventory' | 'Financial' | 'Regulatory';
  generatedBy: string;
  generatedAt: string;
  filters: {
    startDate?: string;
    endDate?: string;
    commodity?: string;
    buyer?: string;
    producer?: string;
  };
  format: 'PDF' | 'Excel';
  emailTo?: string[];
  data: any;
}

export interface Advertisement {
  id: string;
  category: 'Seeds' | 'Tools' | 'Banks' | 'Insurance' | 'Services';
  title: string;
  description: string;
  image: string;
  link: string;
  targetRole: UserRole[];
  active: boolean;
}

// Language translations
export interface Translations {
  [key: string]: {
    EN: string;
    HI: string;
    TE: string;
    TM: string;
    KN: string;
    BN: string;
    MR: string;
  };
}

// Screen types for navigation
export type ProducerScreen = 
  | 'Dashboard'
  | 'CreateListing'
  | 'MyListings'
  | 'InspectionStatus'
  | 'Storage'
  | 'Sales'
  | 'Reports'
  | 'Profile';

export type BuyerScreen =
  | 'Dashboard'
  | 'Browse'
  | 'Inspections'
  | 'Orders'
  | 'Bills'
  | 'Storage'
  | 'Reports'
  | 'Profile';

export type AgentScreen =
  | 'Dashboard'
  | 'Manage'
  | 'Verification'
  | 'Reports';

export type AdminScreen =
  | 'Dashboard'
  | 'Users'
  | 'Regulatory'
  | 'Analytics';
