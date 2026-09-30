/**
 * Database Types - PostgreSQL Schema Alignment
 * 
 * These types match the PostgreSQL DDL schema exactly
 * Generated from: /database/schema.sql
 * Version: 1.0
 * Date: October 28, 2025
 */

// ================================================================================
// ENUMS & CONSTANTS
// ================================================================================

export enum Role {
  PRODUCER = 'PRODUCER',
  COMMISSION_AGENT = 'COMMISSION_AGENT',
  BUYER = 'BUYER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

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

// ================================================================================
// 1. CORE TABLES: Producer Credit Lifecycle
// ================================================================================

/**
 * Producer Credit Request
 * Credit requests raised by producers (or by agent on their behalf)
 */
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

/**
 * Producer Advance
 * Approved advances with 2FA via OTP for grant/closure
 */
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
  otpGrantLast4: string | null; // Last 4 digits for audit
  status: AdvanceStatus;
}

/**
 * Producer Repayment
 * Repayments can be partial; also support "deduction at payout"
 */
export interface ProducerRepayment {
  id: number;
  advanceId: number;
  amountPaid: number;
  mode: PaymentMode | null;
  note: string | null;
  paidAt: Date;
  otpCloseLast4: string | null;
}

/**
 * Producer Expense
 * Expenses paid on producer's behalf (to be deducted later)
 */
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

/**
 * Producer Sale
 * Sales entries credited to the producer (gross); net is after deductions
 */
export interface ProducerSale {
  id: number;
  producerUserId: number;
  commissionAgentId: number;
  lotId: number;
  billId: number | null;
  commodity: string | null;
  qtyUnits: number | null;
  unit: string | null; // Kg/MT/Bag/etc.
  pricePerUnit: number | null;
  grossAmount: number; // Computed: qtyUnits * pricePerUnit
  realizedAt: Date;
}

// ================================================================================
// 2. AI RISK & ALERTS
// ================================================================================

/**
 * AI Producer Score
 * Periodic risk snapshot for producers
 */
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

// ================================================================================
// 3. STAFF ROLES & PERMISSIONS
// ================================================================================

/**
 * Agent Staff
 * Staff linked to an agent, can have multiple roles & scoped access
 */
export interface AgentStaff {
  id: number;
  agentUserId: number;
  staffUserId: number;
  active: boolean;
  assignedAt: Date;
}

/**
 * Staff Role Scope
 * JSONB structure for role scoping
 */
export interface StaffRoleScope {
  villages?: string[];
  ops?: string[]; // Operations: WEIGHMENT, DISPATCH, QUALITY_CHECK, etc.
}

/**
 * Agent Staff Role
 * Role assignments with granular permissions and village/operation scopes
 */
export interface AgentStaffRole {
  id: number;
  agentStaffId: number;
  role: StaffRole;
  scopeJson: StaffRoleScope | null;
  canViewFinancials: boolean;
  canEditLedgers: boolean;
  canAuthorizeOtp: boolean;
}

// ================================================================================
// 4. UNIFIED PRODUCER LEDGER (Views)
// ================================================================================

/**
 * Producer Ledger Entry
 * Combined view of credits, debits, expenses, and sales with running balance
 */
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

/**
 * Producer Credit Status
 * Open credit exposure & delinquency snapshot
 */
export interface ProducerCreditStatus {
  producerUserId: number;
  commissionAgentId: number;
  openAdvances: number;
  openPrincipal: number;
  totalRepaidForThisAdvance: number;
  lastCreditAt: Date | null;
}

/**
 * Agent Portfolio Risk
 * Portfolio-level risk metrics for commission agents
 */
export interface AgentPortfolioRisk {
  commissionAgentId: number;
  producersCount: number;
  totalPrincipal: number;
  activeLoans: number;
  defaultsCount: number;
}

// ================================================================================
// 5. EXTENDED TYPES (For UI/Business Logic)
// ================================================================================

/**
 * Producer with Status
 * Extended view combining producer info with credit status and AI scoring
 */
export interface ProducerWithStatus {
  id: number;
  fullName: string;
  village: string | null;
  phone: string | null;
  email: string | null;
  creditStatus: ProducerCreditStatus | null;
  aiScore: AIProducerScore | null;
}

/**
 * Advance with Details
 * Extended advance view with repayment tracking
 */
export interface AdvanceWithDetails extends ProducerAdvance {
  producerName: string;
  totalRepaid: number;
  remainingDue: number;
  repayments: ProducerRepayment[];
}

/**
 * Sale with Net Payable
 * Extended sale view with expense and advance deductions
 */
export interface SaleWithNetPayable extends ProducerSale {
  totalExpenses: number;
  totalRepaidAlready: number;
  netPayableBeforeAdvanceDeduction: number;
}

// ================================================================================
// 6. QUERY RESULT TYPES
// ================================================================================

/**
 * Producer Needing Attention Query Result
 */
export interface ProducerNeedingAttention {
  producerUserId: number;
  fullName: string;
  riskRank: number | null;
  riskScore: number | null;
  openPrincipal: number | null;
}

/**
 * Advance Repayment Summary Query Result
 */
export interface AdvanceRepaymentSummary {
  advanceId: number;
  principalAmount: number;
  totalRepaid: number;
  remainingDue: number;
}

/**
 * Sale Net Payable Query Result
 */
export interface SaleNetPayable {
  saleId: number;
  grossAmount: number;
  totalExpenses: number;
  totalRepaidAlready: number;
  netPayableBeforeAdvanceDeduction: number;
}

// ================================================================================
// 7. FILTER & SEARCH TYPES
// ================================================================================

/**
 * Ledger Filters
 */
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

/**
 * Ledger Sort Options
 */
export interface LedgerSortOptions {
  field: 'txnDate' | 'amount' | 'runningBalance' | 'entryType';
  direction: 'asc' | 'desc';
}

// ================================================================================
// 8. API REQUEST/RESPONSE TYPES
// ================================================================================

/**
 * Create Credit Request Input
 */
export interface CreateCreditRequestInput {
  producerUserId: number;
  commissionAgentId: number;
  requestAmount: number;
  purpose?: string;
  village?: string;
  stateRegion?: string;
}

/**
 * Approve Advance Input
 */
export interface ApproveAdvanceInput {
  creditRequestId: number;
  principalAmount: number;
  interestPct?: number;
  tenureDays?: number;
  otpCode: string; // For 2FA verification
}

/**
 * Record Repayment Input
 */
export interface RecordRepaymentInput {
  advanceId: number;
  amountPaid: number;
  mode: PaymentMode;
  note?: string;
  otpCode?: string; // For 2FA verification on closure
}

/**
 * Record Expense Input
 */
export interface RecordExpenseInput {
  producerUserId: number;
  commissionAgentId: number;
  lotId?: number;
  category: ExpenseCategory;
  description?: string;
  qty?: number;
  unitPrice?: number;
}

/**
 * Record Sale Input
 */
export interface RecordSaleInput {
  producerUserId: number;
  commissionAgentId: number;
  lotId: number;
  billId?: number;
  commodity?: string;
  qtyUnits?: number;
  unit?: string;
  pricePerUnit?: number;
}

// ================================================================================
// 9. STAFF PERMISSION TYPES
// ================================================================================

/**
 * Staff Permission Check
 * Used for authorization middleware
 */
export interface StaffPermissionCheck {
  staffUserId: number;
  agentUserId: number;
  canViewFinancials: boolean;
  canEditLedgers: boolean;
  canAuthorizeOtp: boolean;
  allowedVillages: string[];
  allowedOps: string[];
}

/**
 * Assign Staff Role Input
 */
export interface AssignStaffRoleInput {
  agentUserId: number;
  staffUserId: number;
  role: StaffRole;
  scopeJson?: StaffRoleScope;
  canViewFinancials?: boolean;
  canEditLedgers?: boolean;
  canAuthorizeOtp?: boolean;
}

// ================================================================================
// 10. SUMMARY STATISTICS TYPES
// ================================================================================

/**
 * Ledger Summary
 */
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

/**
 * Dashboard Stats
 */
export interface DashboardStats {
  totalProducers: number;
  activeProducers: number;
  highRiskProducers: number;
  totalOutstanding: number;
  overdueAmount: number;
  thisMonthSales: number;
  thisMonthExpenses: number;
}

// ================================================================================
// 11. OTP VERIFICATION TYPES
// ================================================================================

/**
 * OTP Verification
 */
export interface OTPVerification {
  type: 'grant' | 'close';
  advanceId?: number;
  repaymentId?: number;
  otpCode: string;
  otpLast4: string; // For audit
  verifiedAt: Date;
  verifiedBy: number; // User ID
}

// ================================================================================
// 12. AUDIT TRAIL TYPES
// ================================================================================

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  changes: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

/**
 * Change Tracking
 */
export interface ChangeTracking {
  field: string;
  oldValue: any;
  newValue: any;
  changedAt: Date;
  changedBy: number;
}

// ================================================================================
// 13. USER TYPES (Referenced by schema)
// ================================================================================

/**
 * User (simplified - adjust based on your actual users table)
 */
export interface User {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  userType: 'PRODUCER' | 'BUYER' | 'COMMISSION_AGENT' | 'STAFF' | 'ADMIN';
  village: string | null;
  stateRegion: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lot (simplified - adjust based on your actual lots table)
 */
export interface Lot {
  id: number;
  producerId: number;
  commodity: string;
  quantity: number;
  unit: string;
  village: string | null;
  stateRegion: string | null;
  status: string;
  createdAt: Date;
}

/**
 * SimpleBill (legacy - use Bill from TRADIE v4 section instead)
 * @deprecated Use Bill interface from section 15
 */
export interface SimpleBill {
  id: number;
  lotId: number;
  buyerId: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

// ================================================================================
// 14. TRADIE v4 TYPES (Bill Workflow & Buyer Database)
// ================================================================================

/**
 * AuthStatus - Bill authorization status
 */
export enum AuthStatus {
  PENDING_BUYER = 'PENDING_BUYER',
  PENDING_AGENT = 'PENDING_AGENT',
  MODIFIED_NEEDS_JUSTIFICATION = 'MODIFIED_NEEDS_JUSTIFICATION',
  AUTHORIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED'
}

/**
 * ChangeStatus - Bill change request status
 */
export enum ChangeStatus {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * PaymentMethod - Supported payment methods
 */
export enum PaymentMethod {
  UPI = 'UPI',
  IMPS = 'IMPS',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  CHEQUE = 'CHEQUE',
  ACH = 'ACH',
  SEPA = 'SEPA',
  WIRE = 'WIRE',
  SWIFT = 'SWIFT',
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
  DEMAND_DRAFT = 'DEMAND_DRAFT',
  ZELLE = 'ZELLE',
  BACS = 'BACS',
  CHAPS = 'CHAPS',
  FASTER_PAYMENTS = 'FASTER_PAYMENTS'
}

/**
 * DiscrepancyFlag - AI-detected discrepancy levels
 */
export enum DiscrepancyFlag {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

/**
 * Country Payment Methods Mapping
 */
export const COUNTRY_PAYMENT_METHODS: Record<string, PaymentMethod[]> = {
  IN: [PaymentMethod.UPI, PaymentMethod.IMPS, PaymentMethod.NEFT, PaymentMethod.RTGS, PaymentMethod.CHEQUE, PaymentMethod.DEMAND_DRAFT, PaymentMethod.CASH],
  US: [PaymentMethod.ACH, PaymentMethod.WIRE, PaymentMethod.ZELLE, PaymentMethod.CHEQUE, PaymentMethod.PAYPAL, PaymentMethod.CARD],
  GB: [PaymentMethod.BACS, PaymentMethod.CHAPS, PaymentMethod.FASTER_PAYMENTS, PaymentMethod.CHEQUE, PaymentMethod.CARD],
  EU: [PaymentMethod.SEPA, PaymentMethod.WIRE, PaymentMethod.CARD, PaymentMethod.PAYPAL],
  AU: [PaymentMethod.WIRE, PaymentMethod.CHEQUE, PaymentMethod.CARD, PaymentMethod.PAYPAL],
  SG: [PaymentMethod.WIRE, PaymentMethod.CARD, PaymentMethod.PAYPAL],
  default: [PaymentMethod.WIRE, PaymentMethod.CARD, PaymentMethod.CASH]
};

// ================================================================================
// 15. TRADIE v4 INTERFACES (Bills & Buyer Entities)
// ================================================================================

/**
 * Bill - Core bill/invoice record
 */
export interface Bill {
  id: bigint;
  lot_id: bigint;
  buyer_entity_id: bigint;
  price_per_unit: number;
  quantity_units: number;
  packaging_cost: number;
  currency_code: string;
  due_date_type: string;
  due_date: Date;
  auth_status: AuthStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * Bill with full details including relationships
 */
export interface BillWithDetails extends Bill {
  buyer_entity?: BuyerEntity;
  lot?: Lot;
  payments?: Payment[];
  change_requests?: BillChangeRequest[];
  authorizations?: BillAuthorization[];
  ai_score?: AIBuyerScore;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  discrepancy_flag?: DiscrepancyFlag;
}

/**
 * Weighment - Weight measurement record
 */
export interface Weighment {
  id: bigint;
  lot_id: bigint;
  gross_weight: number;
  tare_weight: number;
  net_weight: number;
  measured_at: Date;
  measured_by: bigint;
  vehicle_number?: string;
  notes?: string;
}

/**
 * BillChangeRequest - Buyer-initiated change requests
 */
export interface BillChangeRequest {
  id: bigint;
  bill_id: bigint;
  requested_by: bigint;
  field_name: string;
  old_value: string;
  new_value: string;
  justification: string;
  status: ChangeStatus;
  created_at: Date;
  resolved_at?: Date;
  resolved_by?: bigint;
}

/**
 * BillAuthorization - 2FA authorization records
 */
export interface BillAuthorization {
  id: bigint;
  bill_id: bigint;
  authorized_by: bigint;
  auth_type: string;
  otp_last_4: string;
  authorized_at: Date;
  ip_address?: string;
}

/**
 * Payment - Payment transaction record
 */
export interface Payment {
  id: bigint;
  bill_id: bigint;
  amount: number;
  payment_method: PaymentMethod;
  payment_reference: string;
  paid_at: Date;
  notes?: string;
}

/**
 * BuyerEntity - Legal buyer entity
 */
export interface BuyerEntity {
  id: bigint;
  company_id?: bigint;
  entity_name: string;
  entity_type: string;
  country_code: string;
  state_region?: string;
  city?: string;
  address?: string;
  tax_id?: string;
  registration_number?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * BuyerEntityWithDetails - Buyer entity with full details
 */
export interface BuyerEntityWithDetails extends BuyerEntity {
  payment_prefs?: BuyerPaymentPref[];
  contacts?: BuyerContact[];
  bills?: Bill[];
  ai_score?: AIBuyerScore;
  total_transactions?: number;
  total_volume?: number;
  average_payment_days?: number;
  reliability_score?: number;
}

/**
 * BuyerPaymentPref - Payment method preferences
 */
export interface BuyerPaymentPref {
  id: bigint;
  buyer_entity_id: bigint;
  payment_method: PaymentMethod;
  account_details: string;
  is_default: boolean;
  created_at: Date;
}

/**
 * BuyerContact - Contact person for buyer entity
 */
export interface BuyerContact {
  id: bigint;
  buyer_entity_id: bigint;
  contact_name: string;
  role?: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  created_at: Date;
}

/**
 * AIBuyerScore - AI-generated buyer reliability score
 */
export interface AIBuyerScore {
  id: bigint;
  buyer_entity_id: bigint;
  reliability_score: number;
  risk_level: string;
  payment_consistency_score: number;
  volume_trend: string;
  last_analyzed_at: Date;
  insights: string;
}

/**
 * AIAgentScore - AI-generated agent performance score
 */
export interface AIAgentScore {
  id: bigint;
  agent_user_id: bigint;
  performance_score: number;
  risk_level: string;
  change_request_pattern: string;
  last_analyzed_at: Date;
  insights: string;
}

/**
 * LedgerEntry - Immutable confirmed ledger entry
 */
export interface LedgerEntry {
  id: bigint;
  bill_id: bigint;
  entry_type: string;
  amount: number;
  blockchain_hash?: string;
  confirmed_at: Date;
  confirmed_by: bigint;
}

/**
 * AuditLog - Complete audit trail
 */
export interface AuditLog {
  id: bigint;
  table_name: string;
  record_id: bigint;
  action: string;
  old_data?: any;
  new_data?: any;
  changed_by: bigint;
  changed_at: Date;
  ip_address?: string;
}

// ================================================================================
// 16. API REQUEST/RESPONSE TYPES (TRADIE v4)
// ================================================================================

/**
 * CreateBillRequest - Request to create a new bill
 */
export interface CreateBillRequest {
  lot_id: bigint;
  buyer_entity_id: bigint;
  price_per_unit: number;
  quantity_units: number;
  packaging_cost?: number;
  currency_code?: string;
  due_date_type: string;
  due_date?: Date;
}

/**
 * CreateChangeRequestRequest - Request to create a change request
 */
export interface CreateChangeRequestRequest {
  bill_id: bigint;
  requested_by: bigint;
  field_name: string;
  old_value: string;
  new_value: string;
  justification: string;
}

/**
 * Create2FAAuthorizationRequest - Request to authorize with 2FA
 */
export interface Create2FAAuthorizationRequest {
  bill_id: bigint;
  authorized_by: bigint;
  auth_type: string;
  otp_code: string;
  ip_address?: string;
}

/**
 * CreatePaymentRequest - Request to record a payment
 */
export interface CreatePaymentRequest {
  bill_id: bigint;
  amount: number;
  payment_method: PaymentMethod;
  payment_reference: string;
  notes?: string;
}

// ================================================================================
// END OF TYPES
// ================================================================================
