# 🚀 TRADIE Quick Reference Card

## ⚡ Instant Commands

```bash
# Start development
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Type check
npx tsc --noEmit
```

---

## 🔧 Configuration Access

```typescript
import config from './config/env';

config.apiUrl           // '/api'
config.enableAI         // true
config.apiTimeout       // 30000
config.otpExpiryMinutes // 5
config.overdueSevereDays // 7
```

---

## 🗄️ Database Types (BigInt Required)

```typescript
import { Bill, BuyerEntity } from './types/database';

// Always use BigInt for IDs
const billId = BigInt(123);        // ✅ Correct
const buyerId = BigInt('456');     // ✅ Correct
const id = 123;                    // ❌ Wrong
```

---

## 📡 API Service

```typescript
import { api } from './services/api';

// Get bills
const bills = await api.getBills();

// Get specific bill
const bill = await api.getBillById(BigInt(123));

// Get buyer score
const score = await api.getBuyerScore(BigInt(456));

// Send OTP
await api.sendOTP(BigInt(userId), 'SMS');

// Create bill
const bill = await api.createBill({
  lot_id: BigInt(123),
  buyer_entity_id: BigInt(456),
  price_per_unit: 22.00,
  quantity_units: 50,
  packaging_cost: 50,
  currency_code: 'INR',
  due_date_type: 'REGULATION',
  due_date: new Date('2024-12-15')
});
```

---

## 🔄 Complete Workflows

```typescript
import { 
  createBillAfterWeighment,
  requestBillChange,
  buyerApproveWithOTP,
  agentFinalApprovalAndFreeze,
  completeBillLifecycle
} from './services/workflows';

// Full lifecycle (one call)
const result = await completeBillLifecycle({
  lot_id: BigInt(123),
  buyer_entity_id: BigInt(456),
  buyer_user_id: BigInt(789),
  agent_user_id: BigInt(101),
  price_per_unit: 22.00,
  quantity_units: 50,
  packaging_cost: 50,
  due_date_type: 'REGULATION',
  buyer_otp: '123456',
  agent_otp: '654321'
});
```

---

## 🎨 Common Components

```tsx
// Transaction Audit View
import DetailedTransactionAuditView from './components/DetailedTransactionAuditView';

<DetailedTransactionAuditView 
  billId={BigInt(123)}
  onClose={() => goBack()}
/>

// Integrated Workflow
import IntegratedBillWorkflow from './components/IntegratedBillWorkflow';

<IntegratedBillWorkflow
  lotId={BigInt(123)}
  buyerEntityId={BigInt(456)}
  buyerUserId={BigInt(789)}
  agentUserId={BigInt(101)}
/>
```

---

## 🔐 SQL Workflow Mapping

### 1. Create Bill
```typescript
await createBillAfterWeighment({ /* ... */ });
```
```sql
INSERT INTO bills (...) VALUES (...) RETURNING id;
```

### 2. Change Request
```typescript
await requestBillChange({ /* ... */ });
```
```sql
INSERT INTO bill_change_requests (...);
UPDATE bills SET status='MODIFIED_NEEDS_JUSTIFICATION';
```

### 3. Buyer Approval
```typescript
await buyerApproveWithOTP({ /* ... */ });
```
```sql
INSERT INTO bill_authorizations (...);
UPDATE bills SET status='PENDING_AGENT';
```

### 4. Agent Approval + Freeze
```typescript
await agentFinalApprovalAndFreeze({ /* ... */ });
```
```sql
UPDATE bills SET status='AUTHORIZED';
INSERT INTO ledger_entries (snapshot_json);
```

### 5. AI Refresh
```typescript
await refreshBuyerAIScore(buyerId);
```
```sql
INSERT INTO ai_buyer_scores (...);
```

---

## 🎯 Status Colors

```typescript
// Status badge colors
PENDING_BUYER → Yellow (pulse)
PENDING_AGENT → Blue
MODIFIED_NEEDS_JUSTIFICATION → Orange (pulse)
AUTHORIZED → Green
REJECTED → Red

// Overdue colors
1-6 days → Orange border
≥7 days → Red flashing border
```

---

## 💳 Payment Methods

```typescript
enum PaymentMethod {
  UPI = 'UPI',           // 📱 QrCode
  IMPS = 'IMPS',         // ⚡ Zap
  NEFT = 'NEFT',         // 🏦 Building
  CHEQUE = 'CHEQUE',     // 📄 FileCheck
  ACH = 'ACH',           // 🏦 Building
  SEPA = 'SEPA',         // 🏦 Building
  WIRE = 'WIRE',         // 🏦 Building
  SWIFT = 'SWIFT',       // 🏦 Building
  CARD = 'CARD',         // 💳 CreditCard
  PAYPAL = 'PAYPAL',     // 👛 Wallet
  CASH = 'CASH',         // 💵 Banknote
  CRYPTO = 'CRYPTO'      // 🎯 Target
}
```

---

## 📊 AI Thresholds

```typescript
config.aiVerifiedThreshold     // 90%
config.aiSuspiciousThreshold   // 70%
config.aiHighRiskThreshold     // 50%

// Overdue thresholds
config.overdueWarningDays      // 1 day
config.overdueSevereDays       // 7 days

// Modification warning
config.modificationWarningCount // 3 in 30 days
```

---

## 🔍 Helper Functions

```typescript
import { 
  formatCurrency, 
  calculateDaysOverdue,
  getStatusColorClass,
  getDiscrepancyFlagColor
} from './services/api';

// Format currency
formatCurrency(1150, 'INR')  // "₹1,150.00"

// Calculate overdue
const days = calculateDaysOverdue(dueDate);  // 12

// Get colors
const color = getStatusColorClass(AuthStatus.AUTHORIZED);  // 'bg-green-500'
```

---

## 🌍 Environment Variables

```bash
# Required (with defaults)
VITE_API_URL=/api
VITE_MODE=development

# Optional features
VITE_ENABLE_AI=true
VITE_ENABLE_SUPABASE=false

# Timeouts & limits
VITE_API_TIMEOUT=30000
VITE_OTP_EXPIRY_MINUTES=5
VITE_MAX_FILE_UPLOAD_SIZE=5242880

# Thresholds
VITE_OVERDUE_WARNING_DAYS=1
VITE_OVERDUE_SEVERE_DAYS=7
VITE_AI_VERIFIED_THRESHOLD=90
VITE_MODIFICATION_WARNING_COUNT=3
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 360px)  { /* Mobile */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

---

## 🎨 Color Palette

```css
/* TRADIE brand colors */
--ivory: #F7FAFC;
--gradient-start: #F7FAFC;
--gradient-end: #D9F2FF;
--gold: #D4AF37;
--green: #10B981;
--blue: #3B82F6;
--red: #EF4444;
--orange: #F59E0B;
--purple: #8B5CF6;
```

---

## 🚨 Error Handling

```typescript
try {
  const result = await api.createBill(data);
} catch (error: any) {
  console.error('Error:', error.message);
  // Show toast or alert
}
```

---

## 📋 Enums Quick Reference

```typescript
enum Role {
  PRODUCER, COMMISSION_AGENT, BUYER, STAFF, ADMIN
}

enum AuthStatus {
  PENDING_BUYER, PENDING_AGENT, 
  MODIFIED_NEEDS_JUSTIFICATION, 
  AUTHORIZED, REJECTED
}

enum ChangeStatus {
  OPEN, APPROVED, REJECTED
}

enum DiscrepancyFlag {
  NONE, LOW, MEDIUM, HIGH
}
```

---

## 🔄 Workflow States

```
Bill Creation → PENDING_BUYER
     ↓
Buyer Approve → PENDING_AGENT
     ↓
Agent Approve → AUTHORIZED
     ↓
Ledger Freeze → Immutable

(Optional: Change Request → MODIFIED_NEEDS_JUSTIFICATION)
```

---

## 📖 Documentation Index

| File | Purpose |
|------|---------|
| `README.md` | Overview & quick start |
| `SETUP.md` | Installation guide |
| `TROUBLESHOOTING.md` | Common issues |
| `BACKEND_INTEGRATION.md` | SQL → Frontend mapping |
| `INTEGRATION_SUMMARY.md` | Examples & reference |
| `TRANSACTION_AUDIT_DOCUMENTATION.md` | Component guide |
| `FIX_SUMMARY.md` | Bug fixes |

---

## 🎯 Module Navigation

```typescript
// Set mode in App.tsx
mode: 'buyer' | 'agent' | 'prototype' | 
      'ca-db' | 'full-app' | 'expert-db' | 
      'v4-proto' | 'transaction-audit' | 'welcome'

// Or use welcome screen cards
```

---

## 🧪 Testing Checklist

- [ ] Bills load without errors
- [ ] Can create new bill
- [ ] OTP verification works
- [ ] AI scores display
- [ ] Audit trail shows changes
- [ ] Overdue warnings appear
- [ ] Payment tracking accurate
- [ ] Export/print functions
- [ ] Responsive on mobile
- [ ] Dark mode works

---

## 🚀 Performance Tips

```typescript
// Use React.memo for expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);

// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 📞 Quick Help

**Error:** `process is not defined`
**Fix:** ✅ Already fixed! Use `config` from `/config/env.ts`

**Error:** Type errors with IDs
**Fix:** Use `BigInt(123)` not `123`

**Error:** Module not found
**Fix:** `rm -rf node_modules && npm install`

**Error:** Port in use
**Fix:** `npx kill-port 5173`

---

**Print this card for quick reference!** 📄✨
