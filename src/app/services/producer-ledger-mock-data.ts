/**
 * Mock Data for Producer Ledger System
 * Based on PostgreSQL schema with realistic agricultural commodity trading scenarios
 */

import type {
  ProducerCreditRequest,
  ProducerAdvance,
  ProducerRepayment,
  ProducerExpense,
  ProducerSale,
  AIProducerScore,
  ProducerLedgerEntry,
  ProducerWithStatus,
  KidFriendlyLedgerEntry,
  AIInsightMessage,
} from '../types/producer-ledger';

// ================
// Mock Producers
// ================

export const mockProducers = [
  {
    id: 1,
    fullName: 'Chandra Sekhar',
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    phone: '+91 98765 43210',
    email: 'chandra@example.com',
  },
  {
    id: 2,
    fullName: 'Ravi Kumar',
    village: 'Gurajepalli',
    stateRegion: 'Andhra Pradesh',
    phone: '+91 98765 43211',
    email: 'ravi@example.com',
  },
  {
    id: 3,
    fullName: 'Suresh Babu',
    village: 'Tenali',
    stateRegion: 'Andhra Pradesh',
    phone: '+91 98765 43212',
    email: 'suresh@example.com',
  },
];

// ================
// Mock Credit Requests
// ================

export const mockCreditRequests: ProducerCreditRequest[] = [
  {
    id: 1,
    producerUserId: 1,
    commissionAgentId: 100,
    requestAmount: 20000,
    purpose: 'Pesticides for chilli crop protection',
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    requestedAt: new Date('2025-02-10'),
    status: 'APPROVED',
    aiRiskRank: 3,
    aiComment: 'Moderate risk - frequent borrower with good repayment history',
  },
  {
    id: 2,
    producerUserId: 1,
    commissionAgentId: 100,
    requestAmount: 28000,
    purpose: 'Shade nets and carpets for crop protection',
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    requestedAt: new Date('2025-03-01'),
    status: 'APPROVED',
    aiRiskRank: 3,
    aiComment: 'Infrastructure investment - acceptable',
  },
  {
    id: 3,
    producerUserId: 1,
    commissionAgentId: 100,
    requestAmount: 13000,
    purpose: 'Irrigation and watering equipment',
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    requestedAt: new Date('2025-03-12'),
    status: 'APPROVED',
    aiRiskRank: 4,
    aiComment: '⚠️ High-frequency requests detected - monitor closely',
  },
  {
    id: 4,
    producerUserId: 2,
    commissionAgentId: 100,
    requestAmount: 35000,
    purpose: 'Seeds and fertilizers for new season',
    village: 'Gurajepalli',
    stateRegion: 'Andhra Pradesh',
    requestedAt: new Date('2025-03-25'),
    status: 'APPROVED',
    aiRiskRank: 2,
    aiComment: 'Low risk - seasonal requirement',
  },
  {
    id: 5,
    producerUserId: 3,
    commissionAgentId: 100,
    requestAmount: 45000,
    purpose: 'Equipment lease for harvesting',
    village: 'Tenali',
    stateRegion: 'Andhra Pradesh',
    requestedAt: new Date('2025-04-03'),
    status: 'PENDING',
    aiRiskRank: 5,
    aiComment: '🚨 High-value pending - new producer with no repayment history',
  },
];

// ================
// Mock Advances
// ================

export const mockAdvances: ProducerAdvance[] = [
  {
    id: 1,
    producerUserId: 1,
    commissionAgentId: 100,
    creditRequestId: 1,
    principalAmount: 20000,
    interestPct: 0,
    tenureDays: 90,
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    approvedAt: new Date('2025-02-12'),
    otpGrantLast4: '1234',
    status: 'OPEN',
  },
  {
    id: 2,
    producerUserId: 1,
    commissionAgentId: 100,
    creditRequestId: 2,
    principalAmount: 28000,
    interestPct: 0,
    tenureDays: 90,
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    approvedAt: new Date('2025-03-04'),
    otpGrantLast4: '5678',
    status: 'OPEN',
  },
  {
    id: 3,
    producerUserId: 1,
    commissionAgentId: 100,
    creditRequestId: 3,
    principalAmount: 13000,
    interestPct: 0,
    tenureDays: 90,
    village: 'Guntur',
    stateRegion: 'Andhra Pradesh',
    approvedAt: new Date('2025-03-15'),
    otpGrantLast4: '9012',
    status: 'OPEN',
  },
  {
    id: 4,
    producerUserId: 2,
    commissionAgentId: 100,
    creditRequestId: 4,
    principalAmount: 35000,
    interestPct: 0,
    tenureDays: 120,
    village: 'Gurajepalli',
    stateRegion: 'Andhra Pradesh',
    approvedAt: new Date('2025-03-28'),
    otpGrantLast4: '3456',
    status: 'PARTIALLY_SETTLED',
  },
];

// ================
// Mock Repayments
// ================

export const mockRepayments: ProducerRepayment[] = [
  {
    id: 1,
    advanceId: 4,
    amountPaid: 15000,
    mode: 'LEDGER_DEDUCTION',
    note: 'Partial repayment from sale proceeds',
    paidAt: new Date('2025-04-05'),
    otpCloseLast4: '7890',
  },
];

// ================
// Mock Expenses
// ================

export const mockExpenses: ProducerExpense[] = [
  {
    id: 1,
    producerUserId: 1,
    commissionAgentId: 100,
    lotId: 101,
    category: 'LABOR',
    description: 'Market yard labor charges',
    qty: 4,
    unitPrice: 2000,
    amount: 8000,
    incurredAt: new Date('2025-04-01'),
  },
  {
    id: 2,
    producerUserId: 2,
    commissionAgentId: 100,
    lotId: 102,
    category: 'STORAGE',
    description: 'Storage and moving charges',
    qty: 1,
    unitPrice: 5000,
    amount: 5000,
    incurredAt: new Date('2025-04-02'),
  },
  {
    id: 3,
    producerUserId: 1,
    commissionAgentId: 100,
    lotId: 101,
    category: 'TRANSPORT',
    description: 'Transport from farm to market',
    qty: 350,
    unitPrice: 5,
    amount: 1750,
    incurredAt: new Date('2025-03-29'),
  },
  {
    id: 4,
    producerUserId: 1,
    commissionAgentId: 100,
    lotId: 101,
    category: 'BAGS',
    description: 'Jute bags for packing',
    qty: 20,
    unitPrice: 50,
    amount: 1000,
    incurredAt: new Date('2025-03-29'),
  },
];

// ================
// Mock Sales
// ================

export const mockSales: ProducerSale[] = [
  {
    id: 1,
    producerUserId: 1,
    commissionAgentId: 100,
    lotId: 101,
    billId: 201,
    commodity: 'Red Chillies',
    qtyUnits: 350,
    unit: 'Kg',
    pricePerUnit: 120,
    grossAmount: 42000,
    realizedAt: new Date('2025-03-30'),
  },
  {
    id: 2,
    producerUserId: 2,
    commissionAgentId: 100,
    lotId: 102,
    billId: 202,
    commodity: 'Turmeric',
    qtyUnits: 200,
    unit: 'Kg',
    pricePerUnit: 140,
    grossAmount: 28000,
    realizedAt: new Date('2025-04-03'),
  },
];

// ================
// Mock AI Scores
// ================

export const mockAIScores: AIProducerScore[] = [
  {
    id: 1,
    producerUserId: 1,
    riskRank: 4,
    riskScore: 72,
    pendingCredits: 61000,
    overdueCredits: 0,
    comment: 'High-frequency borrowing detected. Three advances in 2 months.',
    generatedAt: new Date('2025-04-05'),
  },
  {
    id: 2,
    producerUserId: 2,
    riskRank: 2,
    riskScore: 35,
    pendingCredits: 20000,
    overdueCredits: 0,
    comment: 'Good repayment behavior. Made partial payment on time.',
    generatedAt: new Date('2025-04-05'),
  },
  {
    id: 3,
    producerUserId: 3,
    riskRank: 5,
    riskScore: 85,
    pendingCredits: 45000,
    overdueCredits: 0,
    comment: '⚠️ New producer with high credit request. No repayment history.',
    generatedAt: new Date('2025-04-05'),
  },
];

// ================
// Generate Ledger Entries (Combined View)
// ================

export const generateMockLedgerEntries = (): ProducerLedgerEntry[] => {
  const entries: ProducerLedgerEntry[] = [];

  // Add advances (credits - positive)
  mockAdvances.forEach((advance) => {
    entries.push({
      producerUserId: advance.producerUserId,
      commissionAgentId: advance.commissionAgentId,
      txnDate: advance.approvedAt,
      entryType: 'ADVANCE',
      amount: advance.principalAmount,
      village: advance.village,
      stateRegion: advance.stateRegion,
      runningBalance: 0, // Will calculate
    });
  });

  // Add sales (credits - positive)
  mockSales.forEach((sale) => {
    entries.push({
      producerUserId: sale.producerUserId,
      commissionAgentId: sale.commissionAgentId,
      txnDate: sale.realizedAt,
      entryType: 'SALE_GROSS',
      amount: sale.grossAmount,
      village: mockProducers.find((p) => p.id === sale.producerUserId)?.village || null,
      stateRegion: mockProducers.find((p) => p.id === sale.producerUserId)?.stateRegion || null,
      runningBalance: 0,
    });
  });

  // Add repayments (debits - negative)
  mockRepayments.forEach((repayment) => {
    const advance = mockAdvances.find((a) => a.id === repayment.advanceId);
    entries.push({
      producerUserId: advance?.producerUserId || 0,
      commissionAgentId: advance?.commissionAgentId || 0,
      txnDate: repayment.paidAt,
      entryType: 'REPAYMENT',
      amount: -repayment.amountPaid,
      village: advance?.village || null,
      stateRegion: advance?.stateRegion || null,
      runningBalance: 0,
    });
  });

  // Add expenses (debits - negative)
  mockExpenses.forEach((expense) => {
    entries.push({
      producerUserId: expense.producerUserId,
      commissionAgentId: expense.commissionAgentId,
      txnDate: expense.incurredAt,
      entryType: 'EXPENSE',
      amount: -expense.amount,
      village: mockProducers.find((p) => p.id === expense.producerUserId)?.village || null,
      stateRegion: mockProducers.find((p) => p.id === expense.producerUserId)?.stateRegion || null,
      runningBalance: 0,
    });
  });

  // Sort by date
  entries.sort((a, b) => a.txnDate.getTime() - b.txnDate.getTime());

  // Calculate running balance per producer
  const balances: Record<number, number> = {};
  entries.forEach((entry) => {
    const key = entry.producerUserId;
    if (!balances[key]) balances[key] = 0;
    balances[key] += entry.amount;
    entry.runningBalance = balances[key];
  });

  return entries;
};

// ================
// Kid-Friendly Conversion
// ================

export const convertToKidFriendly = (entry: ProducerLedgerEntry): KidFriendlyLedgerEntry => {
  const getEntryDisplay = () => {
    switch (entry.entryType) {
      case 'ADVANCE':
        return {
          icon: '💰',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Money Given (Advance)',
          description: 'Commission agent gave money to producer',
        };
      case 'SALE_GROSS':
        return {
          icon: '💵',
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Sale Money Received',
          description: 'Producer sold crops and got money',
        };
      case 'REPAYMENT':
        return {
          icon: '💸',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Money Paid Back',
          description: 'Producer paid back the advance',
        };
      case 'EXPENSE':
        return {
          icon: '🧾',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Money Spent (Expense)',
          description: 'Agent paid for producer expenses',
        };
    }
  };

  const getSafetyLevel = (): '🟢' | '🟡' | '🟠' | '🔴' => {
    const balance = Math.abs(entry.runningBalance);
    if (balance < 50000) return '🟢';
    if (balance < 100000) return '🟡';
    if (balance < 200000) return '🟠';
    return '🔴';
  };

  const getStatus = (): '✅' | '⏳' | '🔒' | '❌' => {
    if (entry.entryType === 'SALE_GROSS') return '✅';
    if (entry.entryType === 'REPAYMENT') return '✅';
    if (entry.entryType === 'ADVANCE') return '⏳';
    return '🔒';
  };

  const display = getEntryDisplay();

  return {
    ...display,
    amount: entry.amount,
    balance: entry.runningBalance,
    date: entry.txnDate,
    safetyLevel: getSafetyLevel(),
    status: getStatus(),
  };
};

// ================
// AI Insights (Kid-Friendly Messages)
// ================

export const generateAIInsights = (
  entries: ProducerLedgerEntry[],
  aiScores: AIProducerScore[]
): AIInsightMessage[] => {
  const insights: AIInsightMessage[] = [];

  // Check for pending credits
  const pendingCredits = entries.filter((e) => e.entryType === 'ADVANCE' && e.amount > 0).length;
  if (pendingCredits > 0) {
    insights.push({
      type: 'info',
      icon: '💡',
      title: 'Pending Advances',
      message: `${pendingCredits} producer${pendingCredits > 1 ? 's have' : ' has'} money to pay back!`,
      priority: 'medium',
    });
  }

  // Check for high-risk producers
  const highRisk = aiScores.filter((s) => s.riskRank >= 4);
  if (highRisk.length > 0) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Watch Out!',
      message: `${highRisk.length} producer${highRisk.length > 1 ? 's need' : ' needs'} your attention - borrowing a lot!`,
      priority: 'high',
    });
  }

  // Check for recent sales
  const recentSales = entries.filter(
    (e) => e.entryType === 'SALE_GROSS' && new Date().getTime() - e.txnDate.getTime() < 7 * 24 * 60 * 60 * 1000
  );
  if (recentSales.length > 0) {
    insights.push({
      type: 'success',
      icon: '🎉',
      title: 'Great News!',
      message: `${recentSales.length} producer${recentSales.length > 1 ? 's sold' : ' sold'} crops this week!`,
      priority: 'low',
    });
  }

  // Check for good repayments
  const recentRepayments = entries.filter(
    (e) => e.entryType === 'REPAYMENT' && new Date().getTime() - e.txnDate.getTime() < 7 * 24 * 60 * 60 * 1000
  );
  if (recentRepayments.length > 0) {
    insights.push({
      type: 'success',
      icon: '😊',
      title: 'Excellent!',
      message: `${recentRepayments.length} producer${recentRepayments.length > 1 ? 's paid back' : ' paid back'} on time!`,
      priority: 'low',
    });
  }

  // Check for overdue
  const overdue = aiScores.filter((s) => s.overdueCredits > 0);
  if (overdue.length > 0) {
    insights.push({
      type: 'danger',
      icon: '🚨',
      title: 'Alert!',
      message: `${overdue.length} producer${overdue.length > 1 ? 's have' : ' has'} overdue payments!`,
      priority: 'high',
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// ================
// Summary Statistics
// ================

export const calculateLedgerSummary = (entries: ProducerLedgerEntry[]) => {
  const totalCredits = entries.filter((e) => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);

  const totalDebits = Math.abs(entries.filter((e) => e.amount < 0).reduce((sum, e) => sum + e.amount, 0));

  const netBalance = totalCredits - totalDebits;

  const openAdvances = entries.filter((e) => e.entryType === 'ADVANCE').length;

  const totalExpenses = Math.abs(entries.filter((e) => e.entryType === 'EXPENSE').reduce((sum, e) => sum + e.amount, 0));

  const totalSales = entries.filter((e) => e.entryType === 'SALE_GROSS').reduce((sum, e) => sum + e.amount, 0);

  const avgRiskScore =
    mockAIScores.length > 0 ? mockAIScores.reduce((sum, s) => sum + s.riskScore, 0) / mockAIScores.length : 0;

  return {
    totalCredits,
    totalDebits,
    netBalance,
    openAdvances,
    pendingRepayments: openAdvances,
    totalExpenses,
    totalSales,
    averageRiskScore: avgRiskScore,
  };
};
