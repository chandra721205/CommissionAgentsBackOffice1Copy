# 🗄️ PostgreSQL Schema Integration Guide

## Overview

This guide covers the integration of the production-ready PostgreSQL schema into the TRADIE Producer Ledger system. The schema supports expert-level accounting principles with immutability, audit trails, AI risk assessment, and granular staff permissions.

---

## 📋 Table of Contents

1. [Schema Files](#schema-files)
2. [Migration Steps](#migration-steps)
3. [Prisma Integration](#prisma-integration)
4. [Type Alignment](#type-alignment)
5. [Query Examples](#query-examples)
6. [Permission Enforcement](#permission-enforcement)
7. [Testing Strategy](#testing-strategy)

---

## 📁 Schema Files

### Core Files Created

```
/database/
  └── schema.sql           # Complete PostgreSQL DDL

/types/
  └── database.ts          # TypeScript types matching schema

/services/
  └── producer-ledger-mock-data.ts  # Will be updated to match schema
```

---

## 🔄 Migration Steps

### Step 1: Prerequisites

Ensure you have a PostgreSQL database (version 12+) with the following tables already created:
- `users` (with id, full_name, email, phone, user_type, village, state_region)
- `lots` (with id, producer_id, commodity, quantity, village, state_region)
- `bills` (with id, lot_id, buyer_id, total_amount, status)

### Step 2: Run the Schema

```bash
# Connect to your database
psql -U your_username -d tradie_db

# Run the schema file
\i /path/to/database/schema.sql

# Verify tables were created
\dt

# Verify views were created
\dv
```

### Step 3: Verify Structure

```sql
-- Check table structure
\d producer_credit_requests
\d producer_advances
\d producer_repayments
\d producer_expenses
\d producer_sales
\d ai_producer_scores
\d agent_staff
\d agent_staff_roles

-- Check views
\d v_producer_credits
\d v_producer_debits
\d v_producer_ledger
\d v_producer_credit_status
\d v_agent_portfolio_risk

-- Check enum type
\dT staff_role
```

---

## 🔧 Prisma Integration

### Prisma Schema (schema.prisma)

**Awaiting your Prisma model generation!** Once you provide the Prisma models, we'll:

1. Add `schema.prisma` file
2. Configure database connection
3. Run `prisma generate` to create type-safe client
4. Update services to use Prisma client

### Expected Prisma Workflow

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (if not already)
npx prisma init

# After adding schema.prisma, generate client
npx prisma generate

# Migrate database (if using Prisma migrations)
npx prisma migrate dev --name init_producer_ledger
```

---

## 🎯 Type Alignment

### Current Status

✅ **Completed:**
- `/types/database.ts` - Matches PostgreSQL schema exactly
- All table types defined with correct field names (camelCase in TS, snake_case in DB)
- View result types defined
- Query result types defined
- API input/output types defined

### Type Usage Example

```typescript
import {
  ProducerAdvance,
  ProducerLedgerEntry,
  ProducerCreditStatus,
  CreateCreditRequestInput,
} from '../types/database';

// Type-safe function
async function getProducerLedger(
  agentId: number,
  filters: LedgerFilters
): Promise<ProducerLedgerEntry[]> {
  // Implementation
}
```

---

## 📊 Query Examples

### A) Producer Ledger by Village & Date

```typescript
// TypeScript API call
async function getLedgerByVillage(
  agentId: number,
  village: string,
  dateFrom: Date,
  dateTo: Date
): Promise<ProducerLedgerEntry[]> {
  const result = await db.query(`
    SELECT * FROM v_producer_ledger
    WHERE commission_agent_id = $1
      AND village ILIKE $2
      AND txn_date::date BETWEEN $3 AND $4
    ORDER BY txn_date DESC
  `, [agentId, `%${village}%`, dateFrom, dateTo]);
  
  return result.rows;
}
```

### B) Producers Needing Attention

```typescript
async function getHighRiskProducers(
  agentId: number
): Promise<ProducerNeedingAttention[]> {
  const result = await db.query(`
    SELECT 
      ps.producer_user_id,
      u.full_name,
      aps.risk_rank,
      aps.risk_score,
      ps.open_principal
    FROM v_producer_credit_status ps
    JOIN users u ON u.id = ps.producer_user_id
    LEFT JOIN LATERAL (
      SELECT * FROM ai_producer_scores s
      WHERE s.producer_user_id = ps.producer_user_id
      ORDER BY s.generated_at DESC
      LIMIT 1
    ) aps ON TRUE
    WHERE ps.commission_agent_id = $1
      AND (aps.risk_rank >= 4 OR ps.open_principal > 0)
    ORDER BY aps.risk_rank DESC NULLS LAST, ps.open_principal DESC
  `, [agentId]);
  
  return result.rows;
}
```

### C) Advance Repayment Summary

```typescript
async function getAdvanceRepaymentSummary(
  advanceId: number
): Promise<AdvanceRepaymentSummary> {
  const result = await db.query(`
    SELECT
      a.id AS advance_id,
      a.principal_amount,
      COALESCE(SUM(r.amount_paid), 0) AS total_repaid,
      (a.principal_amount - COALESCE(SUM(r.amount_paid), 0)) AS remaining_due
    FROM producer_advances a
    LEFT JOIN producer_repayments r ON r.advance_id = a.id
    WHERE a.id = $1
    GROUP BY a.id
  `, [advanceId]);
  
  return result.rows[0];
}
```

### D) Net Payable Calculation

```typescript
async function calculateNetPayable(
  saleId: number
): Promise<SaleNetPayable> {
  const result = await db.query(`
    SELECT
      s.id AS sale_id,
      s.gross_amount,
      COALESCE((
        SELECT SUM(amount) 
        FROM producer_expenses e 
        WHERE e.producer_user_id = s.producer_user_id 
          AND e.lot_id = s.lot_id
      ), 0) AS total_expenses,
      COALESCE((
        SELECT SUM(amount_paid) 
        FROM producer_repayments r 
        WHERE r.advance_id IN (
          SELECT id FROM producer_advances a
          WHERE a.producer_user_id = s.producer_user_id 
            AND a.commission_agent_id = s.commission_agent_id
        )
      ), 0) AS total_repaid_already,
      (s.gross_amount - COALESCE((
        SELECT SUM(amount) 
        FROM producer_expenses e 
        WHERE e.producer_user_id = s.producer_user_id 
          AND e.lot_id = s.lot_id
      ), 0)) AS net_payable_before_advance_deduction
    FROM producer_sales s
    WHERE s.id = $1
  `, [saleId]);
  
  return result.rows[0];
}
```

---

## 🔒 Permission Enforcement

### Staff Permission Check

```typescript
async function checkStaffPermission(
  staffUserId: number,
  agentUserId: number
): Promise<StaffPermissionCheck> {
  const result = await db.query(`
    SELECT 
      asr.agent_staff_id,
      bool_or(asr.can_view_financials) AS can_view_financials,
      bool_or(asr.can_edit_ledgers) AS can_edit_ledgers,
      bool_or(asr.can_authorize_otp) AS can_authorize_otp,
      array_agg(DISTINCT v) FILTER (WHERE v IS NOT NULL) AS allowed_villages,
      array_agg(DISTINCT o) FILTER (WHERE o IS NOT NULL) AS allowed_ops
    FROM agent_staff ast
    JOIN agent_staff_roles asr ON asr.agent_staff_id = ast.id
    CROSS JOIN LATERAL (
      SELECT jsonb_array_elements_text(asr.scope_json->'villages') AS v
    ) villages
    CROSS JOIN LATERAL (
      SELECT jsonb_array_elements_text(asr.scope_json->'ops') AS o
    ) ops
    WHERE ast.agent_user_id = $1
      AND ast.staff_user_id = $2
      AND ast.active = TRUE
    GROUP BY asr.agent_staff_id
  `, [agentUserId, staffUserId]);
  
  return result.rows[0];
}
```

### Query with Permission Filtering

```typescript
async function getLedgerWithPermissions(
  agentId: number,
  staffUserId: number,
  village?: string
): Promise<ProducerLedgerEntry[]> {
  // First check permissions
  const perms = await checkStaffPermission(staffUserId, agentId);
  
  if (!perms.canViewFinancials) {
    throw new Error('Staff member does not have financial view permission');
  }
  
  // Build query with village restrictions
  const villageFilter = village
    ? `AND village = $3`
    : perms.allowedVillages.length > 0
    ? `AND village = ANY($3)`
    : '';
  
  const params = village
    ? [agentId, village]
    : [agentId, perms.allowedVillages];
  
  const result = await db.query(`
    SELECT * FROM v_producer_ledger
    WHERE commission_agent_id = $1
    ${villageFilter}
    ORDER BY txn_date DESC
  `, params);
  
  return result.rows;
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// Test advance creation
describe('Producer Advances', () => {
  test('should create advance with OTP audit', async () => {
    const advance = await createAdvance({
      producerUserId: 1,
      commissionAgentId: 100,
      principalAmount: 20000,
      otpCode: '123456',
    });
    
    expect(advance.otpGrantLast4).toBe('3456');
    expect(advance.status).toBe('OPEN');
  });
  
  test('should calculate running balance correctly', async () => {
    const ledger = await getProducerLedger(100, 1);
    
    let expectedBalance = 0;
    ledger.forEach(entry => {
      expectedBalance += entry.amount;
      expect(entry.runningBalance).toBe(expectedBalance);
    });
  });
});
```

### Integration Tests

```typescript
// Test full workflow
describe('Producer Credit Workflow', () => {
  test('should complete full credit-to-repayment cycle', async () => {
    // 1. Create credit request
    const request = await createCreditRequest({
      producerUserId: 1,
      commissionAgentId: 100,
      requestAmount: 50000,
      purpose: 'Seeds and fertilizers',
    });
    
    // 2. Approve advance
    const advance = await approveAdvance({
      creditRequestId: request.id,
      principalAmount: 50000,
      tenureDays: 90,
      otpCode: '123456',
    });
    
    // 3. Record sale
    const sale = await recordSale({
      producerUserId: 1,
      commissionAgentId: 100,
      lotId: 101,
      qtyUnits: 500,
      pricePerUnit: 120,
    });
    
    // 4. Deduct from sale proceeds
    const repayment = await recordRepayment({
      advanceId: advance.id,
      amountPaid: 30000,
      mode: 'LEDGER_DEDUCTION',
    });
    
    // 5. Verify ledger balance
    const ledger = await getProducerLedger(100, 1);
    const finalBalance = ledger[ledger.length - 1].runningBalance;
    
    // Expected: +50000 (advance) + 60000 (sale) - 30000 (repayment) = 80000
    expect(finalBalance).toBe(80000);
  });
});
```

---

## 📈 Performance Optimization

### Recommended Indexes (Already in Schema)

```sql
-- All critical indexes are defined in schema.sql
-- Additional composite indexes can be added based on query patterns:

-- For frequent village + date range queries
CREATE INDEX idx_ledger_agent_village_date ON producer_advances(commission_agent_id, village, approved_at DESC);

-- For AI risk filtering
CREATE INDEX idx_ai_scores_producer_risk ON ai_producer_scores(producer_user_id, risk_rank, generated_at DESC);
```

### Query Optimization Tips

1. **Use prepared statements** for frequent queries
2. **Limit result sets** with OFFSET/LIMIT for pagination
3. **Use EXPLAIN ANALYZE** to identify slow queries
4. **Consider materialized views** for complex aggregations
5. **Use connection pooling** (e.g., pgBouncer)

---

## 🔄 Data Migration

### From Existing Mock Data

```typescript
// Migration script to populate from current mock data
async function migrateExistingData() {
  const mockData = generateMockLedgerEntries();
  
  for (const entry of mockData) {
    if (entry.entryType === 'ADVANCE') {
      await db.query(`
        INSERT INTO producer_advances (
          producer_user_id, commission_agent_id, principal_amount,
          village, state_region, approved_at, status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
      `, [
        entry.producerUserId,
        entry.commissionAgentId,
        entry.amount,
        entry.village,
        entry.stateRegion,
        entry.txnDate,
      ]);
    }
    // ... handle other entry types
  }
}
```

---

## 🎯 Next Steps

### Immediate Actions

1. ✅ Schema file created (`/database/schema.sql`)
2. ✅ TypeScript types aligned (`/types/database.ts`)
3. ⏳ **Awaiting Prisma models from you**
4. ⏳ Update `/services/producer-ledger-mock-data.ts` to use new schema
5. ⏳ Update `BeautifulProducerLedger.tsx` to support new data structure
6. ⏳ Create API service layer (`/services/producer-ledger-api.ts`)
7. ⏳ Write integration tests

### Future Enhancements

- [ ] Add blockchain anchoring hooks
- [ ] Implement AI risk calculation algorithms
- [ ] Add real-time notifications for high-risk events
- [ ] Create data export/import utilities
- [ ] Add audit log visualization

---

## 📚 Reference Links

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Prisma Documentation**: https://www.prisma.io/docs
- **TypeScript Best Practices**: https://www.typescriptlang.org/docs/

---

## 🤝 Support

For questions or issues with the schema integration:
1. Review the schema comments in `/database/schema.sql`
2. Check type definitions in `/types/database.ts`
3. Refer to query examples in this guide
4. Open an issue with detailed error messages

---

**Status**: ✅ Schema Ready | ⏳ Awaiting Prisma Models | 🚀 Ready for Integration

**Last Updated**: October 28, 2025
