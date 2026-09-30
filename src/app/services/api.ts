// ==========================================
// TRADIE API Service Layer
// Maps frontend components to backend SQL/Prisma schema
// ==========================================

import {
  Bill,
  BillWithDetails,
  BuyerEntity,
  BuyerEntityWithDetails,
  Weighment,
  BillChangeRequest,
  BillAuthorization,
  Payment,
  AIBuyerScore,
  AIAgentScore,
  LedgerEntry,
  AuditLog,
  CreateBillRequest,
  CreateChangeRequestRequest,
  Create2FAAuthorizationRequest,
  CreatePaymentRequest,
  AuthStatus,
  Role,
  PaymentMethod,
  COUNTRY_PAYMENT_METHODS
} from '../types/database';

import config from '../config/env';

// ==========================================
// API Configuration
// ==========================================

const API_BASE_URL = config.apiUrl;
const USE_MOCK_DATA = true; // Set to false when backend is available

// ==========================================
// Mock Data for Development
// ==========================================

const MOCK_DATA = {
  buyers: [] as BuyerEntityWithDetails[],
  bills: [] as BillWithDetails[],
  payments: [] as Payment[],
  auditLogs: [] as AuditLog[],
  aiScores: {} as Record<string, AIBuyerScore>,
};

class TradieAPI {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // If using mock data, return mock responses
    if (USE_MOCK_DATA) {
      return this.getMockResponse<T>(endpoint, options);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private async getMockResponse<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const method = options?.method || 'GET';
    
    // Parse endpoint parts
    const parts = endpoint.split('/').filter(Boolean);

    // Route to appropriate mock data
    
    // Bills endpoints
    if (endpoint.includes('/bills/') && endpoint.includes('/payments')) {
      const billId = parts[1];
      return this.getMockPayments(BigInt(billId || '1')) as T;
    }

    if (endpoint.includes('/bills/') && endpoint.includes('/authorizations')) {
      return [] as T; // Mock authorizations
    }

    if (endpoint.startsWith('/bills/') && parts.length === 2) {
      const billId = parts[1];
      return this.getMockBill(BigInt(billId || '1')) as T;
    }

    if (endpoint === '/bills' && method === 'GET') {
      return [this.getMockBill(BigInt(1))] as T; // Mock bills list
    }

    if (endpoint === '/bills' && method === 'POST') {
      return this.getMockBill(BigInt(1)) as T;
    }

    // Buyers endpoints
    if (endpoint.includes('/buyers/') && endpoint.includes('/score')) {
      const buyerId = parts[1];
      return this.getMockAIScore(BigInt(buyerId || '1')) as T;
    }

    if (endpoint.includes('/buyers/') && parts.length === 2) {
      const buyerId = parts[1];
      return this.getMockBuyer(BigInt(buyerId || '1')) as T;
    }

    if (endpoint === '/buyers') {
      return [this.getMockBuyer(BigInt(1))] as T;
    }

    // AI endpoints
    if (endpoint.includes('/ai/buyers/') && endpoint.includes('/insights')) {
      const buyerId = parts[2];
      return this.getMockAIInsights(BigInt(buyerId || '1')) as T;
    }

    // Audit endpoints
    if (endpoint.startsWith('/audit/')) {
      const entityType = parts[1];
      const entityId = parts[2];
      return this.getMockAuditLog(entityType, BigInt(entityId || '1')) as T;
    }

    // OTP endpoints
    if (endpoint === '/otp/send' && method === 'POST') {
      return { success: true, message: 'OTP sent successfully' } as T;
    }

    if (endpoint === '/otp/verify' && method === 'POST') {
      return { valid: true, message: 'OTP verified' } as T;
    }

    // Change requests
    if (endpoint === '/bills/change-request' && method === 'POST') {
      return { id: BigInt(1), status: 'OPEN' } as T;
    }

    // Weighments
    if (endpoint === '/weighments' && method === 'POST') {
      return { id: BigInt(1), net_weight: 5000 } as T;
    }

    // Default empty response
    console.warn('No mock data for endpoint:', endpoint);
    return (method === 'POST' ? {} : []) as T;
  }

  private getMockBill(id: bigint): BillWithDetails {
    return {
      id,
      lot_id: BigInt(1),
      buyer_entity_id: BigInt(1),
      price_per_unit: 22.0,
      quantity_units: 50,
      packaging_cost: 50.0,
      total_payable: 1150.0,
      currency_code: 'INR',
      due_date_type: 'REGULATION',
      due_date: new Date('2024-11-15'),
      status: AuthStatus.PENDING_BUYER,
      discrepancy_flag: 'NONE' as any,
      created_at: new Date('2024-10-20'),
      updated_at: new Date('2024-10-20'),
      lot: {
        id: BigInt(1),
        token_id: 'LOT-001',
        commodity: 'Wheat',
        variety: 'Durum',
        quality_grade: 'Premium',
        created_at: new Date('2024-10-20'),
        updated_at: new Date('2024-10-20'),
      },
      buyer_entity: {
        id: BigInt(1),
        display_name: 'Ramesh Traders',
        company_id: BigInt(1),
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        company: {
          id: BigInt(1),
          legal_name: 'Ramesh Traders Pvt Ltd',
          brand_name: 'RT Commodities',
          address_line: 'Shop 45, APMC Market',
          city: 'Mumbai',
          state_region: 'Maharashtra',
          postal_code: '400001',
          country_code: 'IN',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
        contacts: [
          {
            id: BigInt(1),
            buyer_entity_id: BigInt(1),
            name: 'Ramesh Kumar',
            phone: '+91-9876543210',
            email: 'ramesh@rtcommodities.com',
            is_authorized: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
          {
            id: BigInt(2),
            buyer_entity_id: BigInt(1),
            name: 'Priya Sharma',
            phone: '+91-9123456789',
            email: 'priya@rtcommodities.com',
            is_authorized: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
        ],
        pay_prefs: [
          {
            id: BigInt(1),
            buyer_entity_id: BigInt(1),
            method: PaymentMethod.UPI,
            details_json: { upi_id: 'ramesh@paytm' },
            is_default: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
          {
            id: BigInt(2),
            buyer_entity_id: BigInt(1),
            method: PaymentMethod.NEFT,
            details_json: { account: '1234567890', ifsc: 'SBIN0001234' },
            is_default: false,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
        ],
      },
      weighment: {
        id: BigInt(1),
        lot_id: BigInt(1),
        gross_weight: 5100,
        tare_weight: 100,
        net_weight: 5000,
        unit: 'Kg',
        created_at: new Date('2024-10-20'),
        updated_at: new Date('2024-10-20'),
      },
      items: [],
      changes: [],
      authorizations: [],
    };
  }

  private getMockAIScore(buyerId: bigint): AIBuyerScore {
    return {
      id: BigInt(1),
      buyer_entity_id: buyerId,
      reliability_score: 85,
      discrepancy_ratio: 12,
      on_time_pay_ratio: 88,
      avg_settlement_days: 22,
      comment: 'Reliable buyer with occasional delays',
      generated_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  private getMockPayments(billId: bigint): Payment[] {
    return [
      {
        id: BigInt(1),
        bill_id: billId,
        amount: 500,
        method: PaymentMethod.UPI,
        reference: 'TXN123456789',
        paid_at: new Date('2024-10-25'),
        created_at: new Date('2024-10-25'),
        updated_at: new Date('2024-10-25'),
      },
      {
        id: BigInt(2),
        bill_id: billId,
        amount: 650,
        method: PaymentMethod.CARD,
        reference: 'CARD987654321',
        paid_at: new Date('2024-10-26'),
        created_at: new Date('2024-10-26'),
        updated_at: new Date('2024-10-26'),
      },
    ];
  }

  private getMockAuditLog(entityType: string, entityId: bigint): AuditLog[] {
    return [
      {
        id: BigInt(1),
        entity: entityType,
        entity_id: entityId,
        action: 'CREATE',
        actor_user_id: BigInt(1),
        before_json: null,
        after_json: { status: 'PENDING_BUYER', amount: 1150 },
        created_at: new Date('2024-10-20T10:00:00'),
        updated_at: new Date('2024-10-20T10:00:00'),
      },
      {
        id: BigInt(2),
        entity: entityType,
        entity_id: entityId,
        action: 'UPDATE',
        actor_user_id: BigInt(2),
        before_json: { price_per_unit: 20 },
        after_json: { price_per_unit: 22 },
        created_at: new Date('2024-10-21T14:30:00'),
        updated_at: new Date('2024-10-21T14:30:00'),
      },
    ];
  }

  private getMockAIInsights(buyerId: bigint): any {
    return {
      buyer_entity_id: buyerId,
      reliability_score: 85,
      avg_settlement_days: 22,
      discrepancy_ratio: 12,
      on_time_ratio: 88,
      warnings: [
        'Payment delays observed in last 30 days',
        'Reliability score below 90%',
      ],
      recommendations: [
        'Consider requiring advance payment',
        'Monitor closely for next 2 transactions',
      ],
    };
  }

  private getMockBuyer(id: bigint): BuyerEntityWithDetails {
    return {
      id,
      display_name: 'Ramesh Traders',
      company_id: BigInt(1),
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      company: {
        id: BigInt(1),
        legal_name: 'Ramesh Traders Pvt Ltd',
        brand_name: 'RT Commodities',
        address_line: 'Shop 45, APMC Market',
        city: 'Mumbai',
        state_region: 'Maharashtra',
        postal_code: '400001',
        country_code: 'IN',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
      contacts: [
        {
          id: BigInt(1),
          buyer_entity_id: id,
          name: 'Ramesh Kumar',
          phone: '+91-9876543210',
          email: 'ramesh@rtcommodities.com',
          is_authorized: true,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
      ],
      pay_prefs: [
        {
          id: BigInt(1),
          buyer_entity_id: id,
          method: PaymentMethod.UPI,
          details_json: { upi_id: 'ramesh@paytm' },
          is_default: true,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
      ],
    };
  }

  // ==========================================
  // BUYER MANAGEMENT
  // ==========================================

  /**
   * Get all buyers with details (companies, contacts, scores)
   */
  async getBuyers(): Promise<BuyerEntityWithDetails[]> {
    return this.fetch<BuyerEntityWithDetails[]>('/buyers');
  }

  /**
   * Get single buyer with full details
   */
  async getBuyerById(id: bigint): Promise<BuyerEntityWithDetails> {
    return this.fetch<BuyerEntityWithDetails>(`/buyers/${id}`);
  }

  /**
   * Get buyer's latest AI score
   */
  async getBuyerScore(buyerId: bigint): Promise<AIBuyerScore | null> {
    return this.fetch<AIBuyerScore | null>(`/buyers/${buyerId}/score`);
  }

  /**
   * Get buyer modification flags (30-day window)
   */
  async getBuyerModificationFlags(buyerId: bigint) {
    return this.fetch(`/buyers/${buyerId}/mod-flags`);
  }

  // ==========================================
  // BILL LIFECYCLE
  // ==========================================

  /**
   * Workflow 1: Create Bill after Weighment
   * Sets status to PENDING_BUYER
   */
  async createBill(data: CreateBillRequest): Promise<Bill> {
    return this.fetch<Bill>('/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get bills with filters
   */
  async getBills(filters?: {
    status?: AuthStatus;
    buyer_entity_id?: bigint;
    date_from?: Date;
    date_to?: Date;
  }): Promise<BillWithDetails[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.buyer_entity_id) params.append('buyer_id', filters.buyer_entity_id.toString());
    if (filters?.date_from) params.append('date_from', filters.date_from.toISOString());
    if (filters?.date_to) params.append('date_to', filters.date_to.toISOString());

    return this.fetch<BillWithDetails[]>(`/bills?${params.toString()}`);
  }

  /**
   * Get single bill with all relations
   */
  async getBillById(id: bigint): Promise<BillWithDetails> {
    return this.fetch<BillWithDetails>(`/bills/${id}`);
  }

  /**
   * Get bill total (from v_bill_totals view)
   */
  async getBillTotal(billId: bigint): Promise<number> {
    const result = await this.fetch<{ total_payable: number }>(`/bills/${billId}/total`);
    return result.total_payable;
  }

  // ==========================================
  // CHANGE REQUESTS
  // ==========================================

  /**
   * Workflow 2: Buyer requests a change (must justify)
   * Updates bill status to MODIFIED_NEEDS_JUSTIFICATION
   */
  async createChangeRequest(data: CreateChangeRequestRequest): Promise<BillChangeRequest> {
    return this.fetch<BillChangeRequest>('/bills/change-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all change requests for a bill
   */
  async getChangeRequests(billId: bigint): Promise<BillChangeRequest[]> {
    return this.fetch<BillChangeRequest[]>(`/bills/${billId}/changes`);
  }

  /**
   * Approve or reject a change request
   */
  async decideChangeRequest(changeId: bigint, approved: boolean, note?: string) {
    return this.fetch(`/bills/change-requests/${changeId}/decide`, {
      method: 'POST',
      body: JSON.stringify({ approved, note }),
    });
  }

  // ==========================================
  // 2FA AUTHORIZATION
  // ==========================================

  /**
   * Send OTP to user
   */
  async sendOTP(userId: bigint, channel: 'SMS' | 'EMAIL' | 'APP'): Promise<{ success: boolean }> {
    return this.fetch('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, channel }),
    });
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(userId: bigint, code: string): Promise<{ valid: boolean; token?: string }> {
    return this.fetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, code }),
    });
  }

  /**
   * Workflow 3: 2FA authorization by Buyer
   * Updates bill status to PENDING_AGENT
   */
  async authorizeBillAsBuyer(data: Create2FAAuthorizationRequest): Promise<BillAuthorization> {
    // First verify OTP
    const otpValid = await this.verifyOTP(data.by_user_id, data.otp_code);
    if (!otpValid.valid) {
      throw new Error('Invalid OTP code');
    }

    return this.fetch<BillAuthorization>('/bills/authorize', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        otp_last4: data.otp_code.slice(-4),
      }),
    });
  }

  /**
   * Workflow 4: Agent final approval → freeze ledger
   * Updates bill status to AUTHORIZED
   * Creates immutable ledger entry
   */
  async authorizeBillAsAgent(data: Create2FAAuthorizationRequest): Promise<{
    authorization: BillAuthorization;
    ledger_entry: LedgerEntry;
  }> {
    // First verify OTP
    const otpValid = await this.verifyOTP(data.by_user_id, data.otp_code);
    if (!otpValid.valid) {
      throw new Error('Invalid OTP code');
    }

    return this.fetch('/bills/authorize-final', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        otp_last4: data.otp_code.slice(-4),
      }),
    });
  }

  /**
   * Get all authorizations for a bill
   */
  async getBillAuthorizations(billId: bigint): Promise<BillAuthorization[]> {
    return this.fetch<BillAuthorization[]>(`/bills/${billId}/authorizations`);
  }

  // ==========================================
  // WEIGHMENT
  // ==========================================

  /**
   * Get weighment for a lot
   */
  async getWeighment(lotId: bigint): Promise<Weighment | null> {
    return this.fetch<Weighment | null>(`/lots/${lotId}/weighment`);
  }

  /**
   * Create weighment record
   */
  async createWeighment(data: Omit<Weighment, 'id' | 'created_at' | 'net_weight'>): Promise<Weighment> {
    return this.fetch<Weighment>('/weighments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Flag weighment mismatch
   */
  async flagWeighmentMismatch(weighmentId: bigint, reason: string) {
    return this.fetch(`/weighments/${weighmentId}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ==========================================
  // PAYMENTS
  // ==========================================

  /**
   * Record payment
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    return this.fetch<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get payments for a bill
   */
  async getBillPayments(billId: bigint): Promise<Payment[]> {
    return this.fetch<Payment[]>(`/bills/${billId}/payments`);
  }

  // ==========================================
  // LEDGER & AUDIT
  // ==========================================

  /**
   * Get ledger entry for a bill
   */
  async getLedgerEntry(billId: bigint): Promise<LedgerEntry | null> {
    return this.fetch<LedgerEntry | null>(`/bills/${billId}/ledger`);
  }

  /**
   * Get audit trail for an entity
   */
  async getAuditLog(entity: string, entityId: bigint): Promise<AuditLog[]> {
    return this.fetch<AuditLog[]>(`/audit/${entity}/${entityId}`);
  }

  /**
   * Get complete audit trail with all changes
   */
  async getCompleteAuditTrail(billId: bigint) {
    return this.fetch(`/bills/${billId}/audit-trail`);
  }

  // ==========================================
  // AI & ANALYTICS
  // ==========================================

  /**
   * Workflow 5: Refresh AI buyer score
   * Triggered by cron/ETL or on-demand
   */
  async refreshBuyerScore(buyerEntityId: bigint): Promise<AIBuyerScore> {
    return this.fetch<AIBuyerScore>(`/ai/buyers/${buyerEntityId}/refresh-score`, {
      method: 'POST',
    });
  }

  /**
   * Refresh agent score
   */
  async refreshAgentScore(agentUserId: bigint): Promise<AIAgentScore> {
    return this.fetch<AIAgentScore>(`/ai/agents/${agentUserId}/refresh-score`, {
      method: 'POST',
    });
  }

  /**
   * Get AI insights for buyer
   */
  async getBuyerAIInsights(buyerEntityId: bigint) {
    return this.fetch(`/ai/buyers/${buyerEntityId}/insights`);
  }

  /**
   * Get top flagged buyers (by multiple agents)
   */
  async getTopFlaggedBuyers(limit: number = 3) {
    return this.fetch(`/ai/buyers/top-flagged?limit=${limit}`);
  }

  /**
   * Get analytics dashboard data
   */
  async getAnalyticsDashboard() {
    return this.fetch('/analytics/dashboard');
  }

  /**
   * Get buyer modification flags from view (v_buyer_mod_flags)
   */
  async getBuyerModFlags() {
    return this.fetch('/analytics/buyer-mod-flags');
  }

  // ==========================================
  // COUNTRY-SPECIFIC PAYMENT METHODS
  // ==========================================

  /**
   * Get available payment methods for a country
   */
  async getCountryPaymentMethods(countryCode: string): Promise<PaymentMethod[]> {
    return this.fetch<PaymentMethod[]>(`/countries/${countryCode}/payment-methods`);
  }

  /**
   * Get all country payment method mappings
   */
  async getAllCountryPaymentMethods() {
    return this.fetch('/countries/payment-methods');
  }

  // ==========================================
  // DUE DATE CALCULATION
  // ==========================================

  /**
   * Calculate due date based on type
   */
  async calculateDueDate(
    billId: bigint,
    type: 'REGULATION' | 'ASSOCIATION' | 'CUSTOM' | 'AI_SUGGESTED',
    customDays?: number
  ): Promise<Date> {
    return this.fetch('/bills/calculate-due-date', {
      method: 'POST',
      body: JSON.stringify({ bill_id: billId, type, custom_days: customDays }),
    });
  }

  /**
   * Get AI suggested due date based on buyer history
   */
  async getAISuggestedDueDate(buyerEntityId: bigint): Promise<{
    suggested_days: number;
    confidence: number;
    based_on_transactions: number;
  }> {
    return this.fetch(`/ai/buyers/${buyerEntityId}/suggested-due-date`);
  }

  // ==========================================
  // REPORTS & EXPORTS
  // ==========================================

  /**
   * Export bills to CSV
   */
  async exportBillsCSV(filters?: any): Promise<Blob> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/exports/bills.csv?${params.toString()}`);
    return response.blob();
  }

  /**
   * Export bills to PDF
   */
  async exportBillsPDF(filters?: any): Promise<Blob> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/exports/bills.pdf?${params.toString()}`);
    return response.blob();
  }

  /**
   * Generate bill document
   */
  async generateBillDocument(billId: bigint): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/bills/${billId}/document.pdf`);
    return response.blob();
  }
}

// ==========================================
// Export singleton instance
// ==========================================

export const api = new TradieAPI();

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get AI verification badge type based on score
 */
export function getAIVerificationBadge(score: number): 'verified' | 'suspicious' | 'new-entrant' {
  if (score >= 90) return 'verified';
  if (score >= 70) return 'suspicious';
  return 'new-entrant';
}

/**
 * Check if buyer should be flagged for modifications
 */
export function shouldFlagBuyerForModifications(modCount: number): boolean {
  return modCount >= 3; // 3+ modifications in 30 days
}

/**
 * Calculate total payable amount
 */
export function calculateBillTotal(bill: Bill, items: BillItem[] = []): number {
  const baseAmount = bill.price_per_unit * bill.quantity_units;
  const itemsTotal = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);
  return baseAmount + itemsTotal;
}

/**
 * Get payment methods for country (with fallback)
 */
export function getPaymentMethodsForCountry(countryCode: string): PaymentMethod[] {
  return COUNTRY_PAYMENT_METHODS[countryCode] || [];
}

/**
 * Format currency based on country code
 */
export function formatCurrency(amount: number, currencyCode: string = 'INR'): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Calculate days overdue
 */
export function calculateDaysOverdue(dueDate: Date): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Get status color class
 */
export function getStatusColorClass(status: AuthStatus): string {
  switch (status) {
    case AuthStatus.PENDING_BUYER:
    case AuthStatus.PENDING_AGENT:
      return 'bg-yellow-500';
    case AuthStatus.MODIFIED_NEEDS_JUSTIFICATION:
      return 'bg-orange-500';
    case AuthStatus.AUTHORIZED:
      return 'bg-green-500';
    case AuthStatus.REJECTED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get discrepancy flag color
 */
export function getDiscrepancyFlagColor(flag: DiscrepancyFlag): string {
  switch (flag) {
    case 'HIGH':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-orange-500';
    case 'LOW':
      return 'bg-yellow-500';
    default:
      return 'bg-green-500';
  }
}
