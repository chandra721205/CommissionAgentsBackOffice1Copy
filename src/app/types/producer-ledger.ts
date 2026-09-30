/**
 * Producer Ledger Types
 * Based on PostgreSQL DDL schema
 * 
 * Database Design: Expert-level with immutability, audit trails, and AI insights
 * UI Design: Kid-friendly with colorful icons and simple language
 */

// ================
// Core Types
// ================

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
export type AdvanceStatus = 'OPEN' | 'PARTIALLY_SETTLED' | 'CLOSED' | 'DEFAULTED';
export type PaymentMode = 'CASH' | 'UPI' | 'NEFT' | 'LEDGER_DEDUCTION' | 'OTHER';
export type EntryType = 'ADVANCE' | 'SALE_GROSS' | 'REPAYMENT' | 'EXPENSE';
export type ExpenseCategory = 'TRANSPORT' | 'LOADING' | 'STORAGE' | 'BAGS' | 'LABOR' | 'MARKET_FEES' | 'OTHER';

export type StaffRole = 
  | 'WATCHMAN'
  | 'RECEIVER'
  | 'LABORER'
  | 'MARKET_SALESMAN'
  | 'WEIGHING_LABORER'
  | 'QUALITY_SUPERVISOR'
  | 'SAMPLE_MOVER'
  | 'OTHER';

// ================
// Credit Request
// ================

export interface ProducerCreditRequest {
  id: number;
  producerUserId: number;
  commissionAgentId: number;
  requestAmount: number;
  purpose: string | null;
  village: string | null;
  stateRegion: string | null;
  requestedAt: Date;
  status: RequestStatus;
  aiRiskRank: number | null; // 1-5 (5 = highest risk)
  aiComment: string | null;
}

// ================
// Advance (Credit Given)
// ================

export interface ProducerAdvance {
  id: number;
  producerUserId: number;
  commissionAgentId: number;
  creditRequestId: number | null;
  principalAmount: number;
  interestPct: number;
  tenureDays: number | null;
  village: string | null;
  stateRegion: string | null;
  approvedAt: Date;
  otpGrantLast4: string | null; // OTP last 4 digits for audit
  status: AdvanceStatus;
}

// ================
// Repayment (Money Received Back)
// ================

export interface ProducerRepayment {
  id: number;
  advanceId: number;
  amountPaid: number;
  mode: PaymentMode | null;
  note: string | null;
  paidAt: Date;
  otpCloseLast4: string | null; // OTP last 4 digits for closure
}

// ================
// Expense (Money Spent on Producer's Behalf)
// ================

export interface ProducerExpense {
  id: number;
  producerUserId: number;
  commissionAgentId: number;
  lotId: number | null;
  category: ExpenseCategory;
  description: string | null;
  qty: number | null;
  unitPrice: number | null;
  amount: number; // Computed: qty * unitPrice
  incurredAt: Date;
}

// ================
// Sale (Money Earned from Produce)
// ================

export interface ProducerSale {
  id: number;
  producerUserId: number;
  commissionAgentId: number;
  lotId: number;
  billId: number | null;
  commodity: string | null;
  qtyUnits: number | null;
  unit: string | null; // Kg, MT, Bag, etc.
  pricePerUnit: number | null;
  grossAmount: number; // Computed: qtyUnits * pricePerUnit
  realizedAt: Date;
}

// ================
// AI Risk Score
// ================

export interface AIProducerScore {
  id: number;
  producerUserId: number;
  riskRank: number; // 1-5
  riskScore: number; // 0-100
  pendingCredits: number;
  overdueCredits: number;
  comment: string | null;
  generatedAt: Date;
}

// ================
// Staff Management
// ================

export interface AgentStaff {
  id: number;
  agentUserId: number;
  staffUserId: number;
  active: boolean;
  assignedAt: Date;
}

export interface AgentStaffRole {
  id: number;
  agentStaffId: number;
  role: StaffRole;
  scopeJson: {
    villages?: string[];
    ops?: string[];
  } | null;
  canViewFinancials: boolean;
  canEditLedgers: boolean;
  canAuthorizeOtp: boolean;
}

// ================
// Ledger Views (Unified)
// ================

export interface ProducerLedgerEntry {
  producerUserId: number;
  commissionAgentId: number;
  txnDate: Date;
  entryType: EntryType;
  amount: number; // Positive for credits, negative for debits
  village: string | null;
  stateRegion: string | null;
  runningBalance: number;
}

// ================
// Status Views
// ================

export interface ProducerCreditStatus {
  producerUserId: number;
  commissionAgentId: number;
  openAdvances: number;
  openPrincipal: number;
  totalRepaidForThisAdvance: number;
  lastCreditAt: Date | null;
}

export interface AgentPortfolioRisk {
  commissionAgentId: number;
  producersCount: number;
  totalPrincipal: number;
  activeLoans: number;
  defaultsCount: number;
}

// ================
// Extended Types for UI
// ================

export interface ProducerWithStatus {
  id: number;
  fullName: string;
  village: string | null;
  phone: string | null;
  email: string | null;
  creditStatus: ProducerCreditStatus;
  aiScore: AIProducerScore | null;
}

export interface AdvanceWithDetails extends ProducerAdvance {
  producerName: string;
  totalRepaid: number;
  remainingDue: number;
  repayments: ProducerRepayment[];
}

export interface SaleWithNetPayable extends ProducerSale {
  totalExpenses: number;
  totalRepaidAlready: number;
  netPayableBeforeAdvanceDeduction: number;
}

// ================
// Kid-Friendly Display Types
// ================

export interface KidFriendlyLedgerEntry {
  icon: string; // Emoji
  color: string; // Color class
  label: string; // Kid-friendly label
  amount: number;
  balance: number;
  date: Date;
  description: string;
  safetyLevel: '🟢' | '🟡' | '🟠' | '🔴';
  status: '✅' | '⏳' | '🔒' | '❌';
}

export interface AIInsightMessage {
  type: 'success' | 'warning' | 'danger' | 'info';
  icon: string; // Emoji
  title: string; // Kid-friendly title
  message: string; // Simple language
  priority: 'high' | 'medium' | 'low';
}

// ================
// Filter & Search Types
// ================

export interface LedgerFilters {
  producerId?: number;
  village?: string;
  entryType?: EntryType;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  riskRank?: number;
}

export interface LedgerSortOptions {
  field: 'txnDate' | 'amount' | 'runningBalance' | 'entryType';
  direction: 'asc' | 'desc';
}

// ================
// Summary Statistics
// ================

export interface LedgerSummary {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  openAdvances: number;
  pendingRepayments: number;
  totalExpenses: number;
  totalSales: number;
  averageRiskScore: number;
}

// ================
// OTP Verification
// ================

export interface OTPVerification {
  type: 'grant' | 'close';
  advanceId?: number;
  repaymentId?: number;
  otpCode: string;
  otpLast4: string; // For audit
  verifiedAt: Date;
  verifiedBy: number; // User ID
}

// ================
// Permission Checks
// ================

export interface StaffPermission {
  staffUserId: number;
  canViewFinancials: boolean;
  canEditLedgers: boolean;
  canAuthorizeOtp: boolean;
  allowedVillages: string[];
  allowedOps: string[];
}
