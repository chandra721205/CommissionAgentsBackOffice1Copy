# 📋 Schema Quick Reference Card

## 🗂️ Database Tables

### Core Transaction Tables (5)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `producer_credit_requests` | Credit requests from producers | `request_amount`, `status`, `ai_risk_rank` |
| `producer_advances` | Approved credits with OTP trail | `principal_amount`, `otp_grant_last4`, `status` |
| `producer_repayments` | Full/partial repayments | `advance_id`, `amount_paid`, `otp_close_last4` |
| `producer_expenses` | Agent-paid expenses | `category`, `qty * unit_price`, `lot_id` |
| `producer_sales` | Producer sales revenue | `gross_amount`, `lot_id`, `bill_id` |

### AI & Staff Tables (3)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `ai_producer_scores` | Risk assessment snapshots | `risk_rank` (1-5), `risk_score` (0-100), `pending_credits` |
| `agent_staff` | Staff-agent assignments | `agent_user_id`, `staff_user_id`, `active` |
| `agent_staff_roles` | Role permissions & scopes | `role`, `scope_json`, `can_view_financials` |

---

## 📊 Database Views (5)

| View | Purpose | Use Case |
|------|---------|----------|
| `v_producer_credits` | All credits (advances + sales) | Credits ledger |
| `v_producer_debits` | All debits (repayments + expenses) | Debits ledger |
| `v_producer_ledger` | **Combined ledger with running balance** | **Main ledger view** |
| `v_producer_credit_status` | Open advances per producer | Dashboard summary |
| `v_agent_portfolio_risk` | Agent portfolio metrics | Risk monitoring |

---

## 🎨 Entry Types

```typescript
type EntryType = 
  | 'ADVANCE'      // Credit: Money given to producer
  | 'SALE_GROSS'   // Credit: Revenue from produce sale
  | 'REPAYMENT'    // Debit: Producer repays advance
  | 'EXPENSE'      // Debit: Agent paid on producer's behalf
```

### Ledger Math

```
Running Balance = 
  + ADVANCE (positive)
  + SALE_GROSS (positive)
  - REPAYMENT (negative)
  - EXPENSE (negative)
```

---

## 🔐 Staff Roles (Enum)

```sql
CREATE TYPE staff_role AS ENUM (
  'WATCHMAN',           -- Gate security, check-in/out
  'RECEIVER',           -- Receive & verify incoming produce
  'LABORER',            -- General labor work
  'MARKET_SALESMAN',    -- Market liaison
  'WEIGHING_LABORER',   -- Operate weighing equipment
  'QUALITY_SUPERVISOR', -- Quality control & sampling
  'SAMPLE_MOVER',       -- Transport samples
  'OTHER'               -- Custom roles
);
```

### Permission Flags

| Flag | Purpose |
|------|---------|
| `can_view_financials` | Can see amounts/money |
| `can_edit_ledgers` | Can modify transactions |
| `can_authorize_otp` | Can approve with 2FA |

### Scope JSON

```json
{
  "villages": ["Guntur", "Tenali"],
  "ops": ["WEIGHMENT", "DISPATCH"]
}
```

---

## 🔍 Common Queries

### 1. Get Producer Ledger

```sql
SELECT * FROM v_producer_ledger
WHERE commission_agent_id = $agentId
  AND producer_user_id = $producerId
ORDER BY txn_date DESC;
```

### 2. High Risk Producers

```sql
SELECT u.full_name, aps.risk_rank, aps.risk_score, ps.open_principal
FROM v_producer_credit_status ps
JOIN users u ON u.id = ps.producer_user_id
LEFT JOIN LATERAL (
  SELECT * FROM ai_producer_scores
  WHERE producer_user_id = ps.producer_user_id
  ORDER BY generated_at DESC LIMIT 1
) aps ON TRUE
WHERE ps.commission_agent_id = $agentId
  AND aps.risk_rank >= 4
ORDER BY aps.risk_rank DESC;
```

### 3. Advance with Repayments

```sql
SELECT 
  a.*,
  COALESCE(SUM(r.amount_paid), 0) AS total_repaid,
  a.principal_amount - COALESCE(SUM(r.amount_paid), 0) AS remaining
FROM producer_advances a
LEFT JOIN producer_repayments r ON r.advance_id = a.id
WHERE a.id = $advanceId
GROUP BY a.id;
```

### 4. Net Payable for Sale

```sql
SELECT
  s.gross_amount,
  COALESCE(SUM(e.amount), 0) AS total_expenses,
  s.gross_amount - COALESCE(SUM(e.amount), 0) AS net_payable
FROM producer_sales s
LEFT JOIN producer_expenses e 
  ON e.producer_user_id = s.producer_user_id 
  AND e.lot_id = s.lot_id
WHERE s.id = $saleId
GROUP BY s.id;
```

---

## 🎯 TypeScript Type Mapping

| PostgreSQL Column | TypeScript Type | Example |
|-------------------|-----------------|---------|
| `BIGSERIAL` | `number` | `id: number` |
| `NUMERIC(14,2)` | `number` | `amount: number` |
| `TEXT` | `string \| null` | `purpose: string \| null` |
| `TIMESTAMPTZ` | `Date` | `txnDate: Date` |
| `BOOLEAN` | `boolean` | `active: boolean` |
| `JSONB` | `object \| null` | `scopeJson: StaffRoleScope \| null` |
| `staff_role` | `StaffRole` | `role: StaffRole` |

### Import Pattern

```typescript
import {
  ProducerAdvance,
  ProducerLedgerEntry,
  ProducerCreditStatus,
  StaffRole,
  EntryType,
} from '../types/database';
```

---

## 🚦 Status Values

### Credit Request Status

```typescript
'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'
```

### Advance Status

```typescript
'OPEN' | 'PARTIALLY_SETTLED' | 'CLOSED' | 'DEFAULTED'
```

### Payment Mode

```typescript
'CASH' | 'UPI' | 'NEFT' | 'LEDGER_DEDUCTION' | 'OTHER'
```

### Expense Category

```typescript
'TRANSPORT' | 'LOADING' | 'STORAGE' | 'BAGS' | 'LABOR' | 'MARKET_FEES' | 'OTHER'
```

---

## 🔒 OTP Audit Trail

### On Advance Grant

```sql
INSERT INTO producer_advances (..., otp_grant_last4) 
VALUES (..., substring($otpCode from 3 for 4));
```

### On Repayment Close

```sql
INSERT INTO producer_repayments (..., otp_close_last4)
VALUES (..., substring($otpCode from 3 for 4));
```

---

## 📐 Calculated Fields (GENERATED ALWAYS)

### Producer Expense Amount

```sql
amount = COALESCE(qty, 0) * COALESCE(unit_price, 0)
```

### Producer Sale Gross Amount

```sql
gross_amount = COALESCE(qty_units, 0) * COALESCE(price_per_unit, 0)
```

---

## 🎲 Sample Data Insert

```sql
-- 1. Create credit request
INSERT INTO producer_credit_requests (
  producer_user_id, commission_agent_id, request_amount, purpose, village
) VALUES (1, 100, 20000, 'Pesticides', 'Guntur');

-- 2. Approve advance
INSERT INTO producer_advances (
  producer_user_id, commission_agent_id, credit_request_id,
  principal_amount, tenure_days, village, otp_grant_last4
) VALUES (1, 100, 1, 20000, 90, 'Guntur', '3456');

-- 3. Record expense
INSERT INTO producer_expenses (
  producer_user_id, commission_agent_id, category, qty, unit_price
) VALUES (1, 100, 'TRANSPORT', 350, 5);

-- 4. Record sale
INSERT INTO producer_sales (
  producer_user_id, commission_agent_id, lot_id, qty_units, price_per_unit
) VALUES (1, 100, 101, 350, 120);

-- 5. Record repayment
INSERT INTO producer_repayments (
  advance_id, amount_paid, mode, otp_close_last4
) VALUES (1, 15000, 'LEDGER_DEDUCTION', '7890');
```

---

## 📊 View Ledger After Inserts

```sql
SELECT 
  txn_date::date,
  entry_type,
  amount,
  running_balance
FROM v_producer_ledger
WHERE producer_user_id = 1 
  AND commission_agent_id = 100
ORDER BY txn_date;
```

**Expected Result:**

| Date | Entry Type | Amount | Running Balance |
|------|------------|--------|-----------------|
| 2025-02-12 | ADVANCE | +20,000 | 20,000 |
| 2025-03-29 | EXPENSE | -1,750 | 18,250 |
| 2025-03-30 | SALE_GROSS | +42,000 | 60,250 |
| 2025-04-05 | REPAYMENT | -15,000 | 45,250 |

---

## 🎨 Color Codes (UI Reference)

| Risk Rank | Color | Icon |
|-----------|-------|------|
| 1-2 (Low) | 🟢 Green | Safe |
| 3 (Medium) | 🟡 Yellow | Watch |
| 4 (High) | 🟠 Orange | Caution |
| 5 (Critical) | 🔴 Red | Alert |

---

## 🔗 File Locations

```
/database/
  └── schema.sql                    # PostgreSQL DDL

/types/
  └── database.ts                   # TypeScript types

/services/
  └── producer-ledger-mock-data.ts  # Mock data (to update)

/components/
  └── BeautifulProducerLedger.tsx   # UI component

/POSTGRESQL_INTEGRATION_GUIDE.md    # Full integration guide
/SCHEMA_QUICK_REFERENCE.md          # This file
```

---

## ✅ Pre-Migration Checklist

- [ ] PostgreSQL 12+ installed
- [ ] Database created
- [ ] Users table exists
- [ ] Lots table exists  
- [ ] Bills table exists
- [ ] Schema file reviewed
- [ ] Backup of existing data
- [ ] Test environment ready

---

## 🚀 Post-Migration Checklist

- [ ] All 8 tables created
- [ ] All 5 views created
- [ ] staff_role enum created
- [ ] Indexes verified
- [ ] Sample data inserted
- [ ] Views return correct data
- [ ] Prisma models generated
- [ ] TypeScript types aligned
- [ ] Mock data updated
- [ ] UI component tested

---

**Quick Start**: Run `/database/schema.sql` → Generate Prisma models → Update mock data → Test UI

**Status**: ✅ Schema Ready | ⏳ Awaiting Prisma | 🔧 Ready for Integration
