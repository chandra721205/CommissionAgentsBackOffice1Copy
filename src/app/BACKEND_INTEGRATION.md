# TRADIE Backend Integration Documentation

## 📚 Complete SQL Schema → Frontend Integration Guide

This document explains how the SQL/Prisma database schema integrates with the TRADIE frontend components.

---

## 🗄️ Database Architecture Overview

### Core Enums
```typescript
enum Role { PRODUCER, COMMISSION_AGENT, BUYER, STAFF, ADMIN }
enum AuthStatus { PENDING_BUYER, PENDING_AGENT, MODIFIED_NEEDS_JUSTIFICATION, AUTHORIZED, REJECTED }
enum ChangeStatus { OPEN, APPROVED, REJECTED }
enum PaymentMethod { UPI, IMPS, NEFT, CHEQUE, ACH, SEPA, WIRE, SWIFT, CARD, PAYPAL, CASH, CRYPTO }
enum DiscrepancyFlag { NONE, LOW, MEDIUM, HIGH }
```

### Database Tables (17 Total)

**Identity & Organization (5 tables):**
1. `users` - User accounts with roles
2. `companies` - Company/brand information
3. `buyer_entities` - Legal entities under brands
4. `buyer_contacts` - Contact people per entity
5. `buyer_payment_prefs` - Payment method preferences

**Trade Artifacts (8 tables):**
6. `lots` - Commodity lot tracking
7. `weighments` - Weight measurements
8. `bills` - Transaction bills
9. `bill_items` - Line items per bill
10. `bill_change_requests` - Change request tracking
11. `bill_authorizations` - 2FA approvals
12. `otp_codes` - OTP verification
13. `ledger_entries` - Immutable confirmed records
14. `payments` - Payment transactions

**AI & Audit (4 tables):**
15. `ai_buyer_scores` - Buyer reliability scoring
16. `ai_agent_scores` - Agent performance scoring
17. `audit_log` - Complete audit trail
18. `country_payment_methods` - Payment method mappings

---

## 🔄 Complete Workflow Mappings

### Workflow 1: Create Bill after Weighment

**SQL:**
```sql
INSERT INTO bills (lot_id, buyer_entity_id, price_per_unit, quantity_units, 
                   packaging_cost, currency_code, due_date_type, due_date)
VALUES ($1, $2, $3, $4, $5, 'INR', $6, $7)
RETURNING id;
```

**Frontend Components:**
- `WeighingComplete.tsx` - Captures weighment data
- `BillApprovalScreen.tsx` - Creates bill from weighment
- `TradieV4Prototype.tsx` - Weighment Authorization screen

**API Service:**
```typescript
import { api } from './services/api';

const bill = await api.createBill({
  lot_id: BigInt(lotId),
  buyer_entity_id: BigInt(buyerId),
  price_per_unit: 22.00,
  quantity_units: 50,
  packaging_cost: 50,
  currency_code: 'INR',
  due_date_type: 'REGULATION',
  due_date: new Date('2024-12-15')
});

// Bill created with status: PENDING_BUYER
```

**Complete Workflow Function:**
```typescript
import { createBillAfterWeighment } from './services/workflows';

const bill = await createBillAfterWeighment({
  lot_id: BigInt(123),
  buyer_entity_id: BigInt(456),
  price_per_unit: 22.00,
  quantity_units: 50,
  packaging_cost: 50,
  due_date_type: 'REGULATION'
});
```

---

### Workflow 2: Buyer Requests Change

**SQL:**
```sql
-- Insert change request
INSERT INTO bill_change_requests 
  (bill_id, requested_by_user, field_name, old_value, new_value, justification)
VALUES ($billId, $buyerUserId, 'price_per_unit', '22.00', '21.50', 
        'Grade marginally lower on sample');

-- Update bill status
UPDATE bills 
SET status = 'MODIFIED_NEEDS_JUSTIFICATION' 
WHERE id = $billId;
```

**Frontend Components:**
- `TradieV4Prototype.tsx` - Change Request Modal
- `ExpertBuyerDatabase.tsx` - Edit with justification
- `BillApprovalScreen.tsx` - Change approval interface

**API Service:**
```typescript
const changeRequest = await api.createChangeRequest({
  bill_id: BigInt(billId),
  requested_by_user: BigInt(buyerUserId),
  field_name: 'price_per_unit',
  old_value: '22.00',
  new_value: '21.50',
  justification: 'Grade marginally lower on sample'
});

// Bill status automatically updated to MODIFIED_NEEDS_JUSTIFICATION
```

**Complete Workflow Function:**
```typescript
import { requestBillChange } from './services/workflows';

const changeRequest = await requestBillChange({
  bill_id: BigInt(123),
  buyer_user_id: BigInt(456),
  field_name: 'price_per_unit',
  old_value: '22.00',
  new_value: '21.50',
  justification: 'Grade marginally lower on sample'
});
```

---

### Workflow 3: 2FA Authorization (Buyer)

**SQL:**
```sql
-- Insert authorization record
INSERT INTO bill_authorizations 
  (bill_id, by_role, by_user_id, otp_last4, approved, note)
VALUES ($billId, 'BUYER', $buyerUserId, $last4, true, 'Approved by finance');

-- Update bill status
UPDATE bills 
SET status = 'PENDING_AGENT' 
WHERE id = $billId;
```

**Frontend Components:**
- `TradieV4Prototype.tsx` - 2FA Modal with OTP input
- `BuyerApprovalWait.tsx` - Buyer approval interface
- `ApprovalQueue.tsx` - Pending approvals list

**API Service:**
```typescript
// Step 1: Send OTP
await api.sendOTP(BigInt(buyerUserId), 'SMS');

// Step 2: Buyer enters OTP and approves
const authorization = await api.authorizeBillAsBuyer({
  bill_id: BigInt(billId),
  by_role: Role.BUYER,
  by_user_id: BigInt(buyerUserId),
  otp_code: '123456',
  approved: true,
  note: 'Approved by finance'
});

// Bill status automatically updated to PENDING_AGENT
```

**Complete Workflow Function:**
```typescript
import { buyerApproveWithOTP } from './services/workflows';

const authorization = await buyerApproveWithOTP({
  bill_id: BigInt(123),
  buyer_user_id: BigInt(456),
  otp_code: '123456',
  note: 'Approved by buyer finance team'
});
```

---

### Workflow 4: Agent Final Approval & Ledger Freeze

**SQL:**
```sql
-- Insert agent authorization
INSERT INTO bill_authorizations 
  (bill_id, by_role, by_user_id, otp_last4, approved, note)
VALUES ($billId, 'COMMISSION_AGENT', $agentUserId, $last4, true, 'Final check done');

-- Update bill status
UPDATE bills 
SET status = 'AUTHORIZED' 
WHERE id = $billId;

-- Create immutable ledger entry
INSERT INTO ledger_entries (bill_id, snapshot_json)
SELECT b.id, jsonb_build_object(
  'bill', to_jsonb(b.*),
  'total', (SELECT total_payable FROM v_bill_totals v WHERE v.bill_id = b.id),
  'weighment', to_jsonb(w.*)
)
FROM bills b
JOIN weighments w ON w.lot_id = b.lot_id
WHERE b.id = $billId;
```

**Frontend Components:**
- `TradieV4Prototype.tsx` - Agent final approval screen
- `ConfirmedAppendLedger.tsx` - Ledger confirmation
- `CommissionAgentApp.tsx` - Agent dashboard

**API Service:**
```typescript
// Step 1: Send OTP to agent
await api.sendOTP(BigInt(agentUserId), 'SMS');

// Step 2: Agent approves and freezes ledger
const result = await api.authorizeBillAsAgent({
  bill_id: BigInt(billId),
  by_role: Role.COMMISSION_AGENT,
  by_user_id: BigInt(agentUserId),
  otp_code: '654321',
  approved: true,
  note: 'Final verification complete'
});

// Returns: { authorization, ledger_entry }
// Bill status: AUTHORIZED
// Ledger: Frozen and immutable
```

**Complete Workflow Function:**
```typescript
import { agentFinalApprovalAndFreeze } from './services/workflows';

const result = await agentFinalApprovalAndFreeze({
  bill_id: BigInt(123),
  agent_user_id: BigInt(789),
  otp_code: '654321',
  note: 'Final check done'
});

// result.authorization - BillAuthorization record
// result.ledger_entry - Immutable LedgerEntry with snapshot
```

---

### Workflow 5: AI Score Refresh

**SQL:**
```sql
INSERT INTO ai_buyer_scores 
  (buyer_entity_id, reliability_score, discrepancy_ratio, 
   on_time_pay_ratio, comment)
VALUES ($buyerEntityId, $score, $discRatio, $otpRatio, 'Updated by nightly job');
```

**Frontend Components:**
- `AIInsights.tsx` - AI insights display
- `BuyerInsightsDashboard.tsx` - Comprehensive buyer analytics
- `TradieV4Prototype.tsx` - AI Assistant & Analytics

**API Service:**
```typescript
const score = await api.refreshBuyerScore(BigInt(buyerEntityId));

console.log(`Reliability: ${score.reliability_score}%`);
console.log(`Discrepancy: ${score.discrepancy_ratio * 100}%`);
console.log(`On-Time Pay: ${score.on_time_pay_ratio * 100}%`);
```

**Complete Workflow Function:**
```typescript
import { refreshBuyerAIScore } from './services/workflows';

const score = await refreshBuyerAIScore(BigInt(456));
// AI calculates based on:
// - Historical payment patterns
// - Modification frequency  
// - Dispute rate
// - On-time payment ratio
```

---

## 🎯 Complete End-to-End Example

### Full Bill Lifecycle (No Changes)

```typescript
import { completeBillLifecycle } from './services/workflows';

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

// Steps executed:
// 1. ✅ Bill created (PENDING_BUYER)
// 2. ✅ Buyer approved via 2FA (PENDING_AGENT)
// 3. ✅ Agent approved via 2FA (AUTHORIZED)
// 4. ✅ Ledger entry frozen
// 5. ✅ AI scores refreshed

console.log('Bill ID:', result.bill.id);
console.log('Ledger Entry:', result.ledgerEntry.id);
console.log('Buyer Reliability:', result.buyerScore.reliability_score);
```

### Full Bill Lifecycle (With Change Request)

```typescript
import { billLifecycleWithChangeRequest } from './services/workflows';

const result = await billLifecycleWithChangeRequest({
  lot_id: BigInt(123),
  buyer_entity_id: BigInt(456),
  buyer_user_id: BigInt(789),
  agent_user_id: BigInt(101),
  initial_price: 22.00,
  revised_price: 21.50,
  quantity_units: 50,
  packaging_cost: 50,
  change_justification: 'Grade marginally lower on sample',
  buyer_otp: '123456',
  agent_otp: '654321'
});

// Steps executed:
// 1. ✅ Bill created at ₹22.00
// 2. ✅ Buyer requests change to ₹21.50 with justification
// 3. ✅ Bill status: MODIFIED_NEEDS_JUSTIFICATION
// 4. ✅ Agent approves change
// 5. ✅ Buyer approves revised bill via 2FA
// 6. ✅ Agent final approval via 2FA
// 7. ✅ Bill AUTHORIZED and frozen
// 8. ✅ AI scores updated (reflects change pattern)

if (result.buyerScore.discrepancy_ratio > 0.1) {
  console.warn('⚠️ Buyer showing elevated discrepancy pattern');
}
```

---

## 📊 Frontend Component → Database Table Mapping

| Frontend Component | Primary Tables Used | Purpose |
|-------------------|-------------------|---------|
| `BuyerBackOffice.tsx` | `bills`, `weighments`, `bill_authorizations` | Back-office bill management |
| `ExpertBuyerDatabase.tsx` | `buyer_entities`, `companies`, `buyer_contacts` | Buyer master data |
| `TradieV4Prototype.tsx` | All tables | Complete multi-platform system |
| `WeighingComplete.tsx` | `weighments`, `lots` | Weight capture |
| `BillApprovalScreen.tsx` | `bills`, `bill_authorizations` | Bill approval workflow |
| `AIInsights.tsx` | `ai_buyer_scores`, `ai_agent_scores` | AI analytics |
| `ConfirmedAppendLedger.tsx` | `ledger_entries`, `bills` | Confirmed transactions |
| `CommissionAgentApp.tsx` | `bills`, `weighments`, `payments` | Agent operations |
| `AuditLog.tsx` | `audit_log` | Audit trail viewing |

---

## 🔐 Security & Data Flow

### 2FA/OTP Flow

```
User Action → Send OTP
     ↓
OTP Code Generated (6 digits)
     ↓
Stored in otp_codes table (hashed)
     ↓
Sent via SMS/Email/WhatsApp
     ↓
User enters code in UI
     ↓
API verifies hash match
     ↓
OTP marked as consumed
     ↓
Authorization recorded
     ↓
Bill status updated
```

### Immutability & Audit

```
Bill Created → PENDING_BUYER
     ↓
Buyer Approves → PENDING_AGENT
     ↓
Agent Approves → AUTHORIZED
     ↓
Ledger Entry Created (IMMUTABLE)
     ↓
All changes logged in audit_log
     ↓
AI scores updated
     ↓
Pattern detection runs
```

---

## 🎨 UI Integration Examples

### Example 1: Buyer Database Screen

```typescript
import { api } from './services/api';
import { BuyerEntityWithDetails } from './types/database';

function BuyerDatabaseScreen() {
  const [buyers, setBuyers] = useState<BuyerEntityWithDetails[]>([]);
  
  useEffect(() => {
    loadBuyers();
  }, []);
  
  const loadBuyers = async () => {
    const data = await api.getBuyers();
    setBuyers(data);
  };
  
  return (
    <div>
      {buyers.map(buyer => (
        <BuyerCard
          key={buyer.id}
          buyer={buyer}
          score={buyer.latest_score}
          modFlags={buyer.modification_flags}
        />
      ))}
    </div>
  );
}
```

### Example 2: Bill Approval with 2FA

```typescript
import { api } from './services/api';
import { buyerApproveWithOTP } from './services/workflows';

function BillApprovalModal({ billId, buyerId }: Props) {
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const sendOTP = async () => {
    await api.sendOTP(BigInt(buyerId), 'SMS');
    setOtpSent(true);
  };
  
  const approve = async () => {
    const auth = await buyerApproveWithOTP({
      bill_id: BigInt(billId),
      buyer_user_id: BigInt(buyerId),
      otp_code: otpCode,
      note: 'Approved via mobile app'
    });
    
    console.log('Bill approved!', auth);
    // Bill status now: PENDING_AGENT
  };
  
  return (
    <Dialog>
      {!otpSent ? (
        <Button onClick={sendOTP}>Send OTP</Button>
      ) : (
        <>
          <InputOTP value={otpCode} onChange={setOtpCode} maxLength={6} />
          <Button onClick={approve}>Verify & Approve</Button>
        </>
      )}
    </Dialog>
  );
}
```

### Example 3: AI Insights Display

```typescript
import { api } from './services/api';
import { monitorBuyerBehavior } from './services/workflows';

function BuyerAIInsights({ buyerId }: Props) {
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    loadAnalysis();
  }, [buyerId]);
  
  const loadAnalysis = async () => {
    const data = await monitorBuyerBehavior(BigInt(buyerId));
    setAnalysis(data);
  };
  
  if (!analysis) return <Loading />;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
        <Badge className={
          analysis.riskLevel === 'HIGH' ? 'bg-red-500' :
          analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
          'bg-green-500'
        }>
          {analysis.riskLevel} RISK
        </Badge>
      </CardHeader>
      <CardContent>
        <div>Reliability: {analysis.score.reliability_score}%</div>
        <div>Discrepancy Ratio: {analysis.score.discrepancy_ratio * 100}%</div>
        <div>On-Time Payments: {analysis.score.on_time_pay_ratio * 100}%</div>
        
        {analysis.warnings.length > 0 && (
          <Alert className="mt-4">
            <AlertTriangle />
            <AlertDescription>
              {analysis.warnings.map((w, i) => (
                <div key={i}>⚠️ {w}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

### Example 4: Change Request with Justification

```typescript
import { requestBillChange } from './services/workflows';

function ChangeRequestForm({ billId, buyerId, currentPrice }: Props) {
  const [newPrice, setNewPrice] = useState('');
  const [justification, setJustification] = useState('');
  
  const submit = async () => {
    const changeRequest = await requestBillChange({
      bill_id: BigInt(billId),
      buyer_user_id: BigInt(buyerId),
      field_name: 'price_per_unit',
      old_value: currentPrice.toString(),
      new_value: newPrice,
      justification: justification
    });
    
    console.log('Change request submitted:', changeRequest.id);
    // Bill status now: MODIFIED_NEEDS_JUSTIFICATION
  };
  
  return (
    <form onSubmit={submit}>
      <Label>New Price</Label>
      <Input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
      />
      
      <Label>Justification (Mandatory) *</Label>
      <Textarea
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="Explain reason for change..."
        required
      />
      
      <Alert>
        <Info />
        <AlertDescription>
          Frequent change patterns are tracked by AI and may affect your rating.
        </AlertDescription>
      </Alert>
      
      <Button type="submit">Submit Change Request</Button>
    </form>
  );
}
```

---

## 📈 Analytics & Reporting Queries

### Get Top Flagged Buyers

```typescript
import { api } from './services/api';

const topFlagged = await api.getTopFlaggedBuyers(3);

topFlagged.forEach(buyer => {
  console.log(`${buyer.name}: ${buyer.flag_count} flags from multiple agents`);
});
```

### Get Analytics Dashboard

```typescript
import { getComprehensiveAnalytics } from './services/workflows';

const analytics = await getComprehensiveAnalytics();

console.log('Avg Settlement Time:', analytics.dashboard.avg_settlement_time);
console.log('Discrepancy Ratio:', analytics.dashboard.discrepancy_ratio);
console.log('Top 3 Flagged:', analytics.topFlagged);
console.log('Modification Flags:', analytics.modFlags);
```

### Monitor Specific Buyer

```typescript
import { monitorBuyerBehavior } from './services/workflows';

const behavior = await monitorBuyerBehavior(BigInt(456));

if (behavior.riskLevel === 'HIGH') {
  // Trigger warnings
  console.warn('HIGH RISK BUYER DETECTED');
  console.warn('Warnings:', behavior.warnings);
  
  // Notify regulatory panel
  await api.notifyRegulatory(BigInt(456), behavior.warnings);
}
```

---

## 🔄 Real-Time Updates

### WebSocket Integration (Optional)

```typescript
const ws = new WebSocket('wss://api.tradie.app/ws');

ws.on('bill_status_changed', (data) => {
  console.log(`Bill ${data.bill_id} status: ${data.new_status}`);
  // Update UI reactively
});

ws.on('otp_sent', (data) => {
  console.log(`OTP sent to user ${data.user_id}`);
});

ws.on('ai_score_updated', (data) => {
  console.log(`Buyer ${data.buyer_id} score updated: ${data.score}`);
});
```

---

## 📦 Complete Integration Checklist

### Frontend Setup
- ✅ Import type definitions from `/types/database.ts`
- ✅ Import API service from `/services/api.ts`
- ✅ Import workflows from `/services/workflows.ts`
- ✅ Configure API_BASE_URL environment variable
- ✅ Setup error handling and loading states
- ✅ Implement authentication tokens

### Backend Setup
- ✅ Run SQL schema creation scripts
- ✅ Initialize Prisma with schema
- ✅ Create database views (v_bill_totals, v_buyer_mod_flags)
- ✅ Setup OTP delivery service (SMS/Email)
- ✅ Implement AI scoring algorithms
- ✅ Configure cron jobs for score refresh
- ✅ Setup audit logging middleware

### Testing
- ✅ Test complete bill lifecycle
- ✅ Test change request workflow
- ✅ Test 2FA/OTP verification
- ✅ Test AI score calculations
- ✅ Test ledger immutability
- ✅ Test country payment methods
- ✅ Test due date calculations
- ✅ Test audit trail completeness

---

## 🎓 Best Practices

1. **Always use BigInt for IDs:**
   ```typescript
   const billId = BigInt(123); // ✅ Correct
   const billId = 123; // ❌ Wrong - may cause type errors
   ```

2. **Handle OTP expiry:**
   ```typescript
   const otp = await api.sendOTP(userId, 'SMS');
   // User has 5 minutes to enter code
   ```

3. **Never delete authorized bills:**
   ```typescript
   if (bill.status === AuthStatus.AUTHORIZED) {
     throw new Error('Cannot delete authorized bills - create amendment instead');
   }
   ```

4. **Always log to audit trail:**
   ```typescript
   await api.createAuditLog({
     actor_user_id: userId,
     entity: 'BILL',
     entity_id: billId,
     action: 'UPDATE',
     before_json: oldBill,
     after_json: newBill
   });
   ```

5. **Check AI thresholds:**
   ```typescript
   if (buyerScore.reliability_score < 70) {
     // Require additional approval
     // Notify supervisors
   }
   ```

---

## 🚀 Production Deployment

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.tradie.app
DATABASE_URL=postgresql://user:pass@host:5432/tradie

# OTP Services
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
SENDGRID_API_KEY=your_key

# AI Configuration
AI_SCORING_ENABLED=true
AI_REFRESH_INTERVAL=86400 # 24 hours in seconds

# Security
JWT_SECRET=your_secret
OTP_EXPIRY_MINUTES=5
MAX_OTP_ATTEMPTS=3
```

### Database Migrations

```bash
# Create initial schema
psql -U postgres -d tradie < schema.sql

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed data
npx prisma db seed
```

---

## 📖 Additional Resources

- **SQL Schema:** See provided schema in prompt
- **Prisma Schema:** See `models.prisma` in prompt
- **Type Definitions:** `/types/database.ts`
- **API Services:** `/services/api.ts`
- **Workflows:** `/services/workflows.ts`
- **Frontend Components:** `/components/*`

---

**Built with precision for production-ready commodity trading workflows.** 🎯✅
