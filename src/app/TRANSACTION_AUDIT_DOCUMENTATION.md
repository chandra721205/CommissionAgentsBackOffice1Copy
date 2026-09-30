# 📋 Detailed Transaction & Audit View - Complete Documentation

## Overview

The **Detailed Transaction & Audit View** is a comprehensive back-office screen for managing individual bills/transactions with complete audit trail tracking, payment monitoring, and AI-powered behavioral insights.

---

## 🎨 Component Structure

### A. Transaction Detail Card

#### 1. **Header Section**
```
┌─────────────────────────────────────────────────────┐
│ Transaction Detail                  [← Back to List]│
│ Bill #123 • Oct 27, 2024                            │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Bill ID and creation date
- Back navigation button
- Print and export options

#### 2. **Status Strip** (Flashing for Critical States)

**Status Configurations:**

| Status | Color | Icon | Animation | Meaning |
|--------|-------|------|-----------|---------|
| `PENDING_BUYER` | Yellow | Clock | Pulse | Awaiting buyer approval |
| `PENDING_AGENT` | Blue | Clock | None | Awaiting agent approval |
| `MODIFIED_NEEDS_JUSTIFICATION` | Orange | Edit | Pulse | Change requested |
| `AUTHORIZED` | Green | CheckCircle | None | Approved & frozen |
| `REJECTED` | Red | XCircle | None | Rejected |

**Additional Badges:**
- **Overdue:** Red badge with days past due (flashing if ≥7 days)
- **Payment Due:** Purple badge showing remaining balance
- **Paid in Full:** Green badge with checkmark
- **Risk Flag:** Color-coded by discrepancy level (HIGH/MEDIUM/LOW)

**Example:**
```typescript
{/* Severely overdue bill (7+ days) */}
<Card className="border-l-4 border-l-red-500 bg-red-50 animate-pulse">
  <Badge className="bg-red-600 animate-pulse">
    ⚠️ 12 Days Overdue
  </Badge>
  <Badge className="bg-purple-500">
    ₹1,150 Due
  </Badge>
  <Badge className="bg-red-600">
    HIGH Risk
  </Badge>
</Card>
```

---

#### 3. **Buyer Information Block** (Expandable)

**Fields Displayed:**
- **Buyer Name:** Display name from buyer_entity
- **Brand/Company:** 
  - Brand name from company table
  - Legal name (if different)
- **Address:** Full formatted address with map pin icon
- **Authorized Contacts:** (Expand/Collapse)
  - Multiple contact persons
  - Phone, email, WhatsApp
  - Authorization badge

**Database Mapping:**
```sql
SELECT 
  be.display_name,
  c.brand_name,
  c.legal_name,
  c.address_line,
  c.city,
  c.state_region,
  bc.name,
  bc.phone,
  bc.email,
  bc.is_authorized
FROM buyer_entities be
JOIN companies c ON c.id = be.company_id
LEFT JOIN buyer_contacts bc ON bc.buyer_entity_id = be.id
WHERE be.id = $buyerEntityId;
```

**UI Example:**
```tsx
<Accordion>
  <AccordionItem value="buyer">
    <AccordionTrigger>
      <Building2 /> Buyer Information
    </AccordionTrigger>
    <AccordionContent>
      <div>Buyer: PSR Enterprises</div>
      <div>Brand: JJ&Co</div>
      <div>📍 GGFFH, Mumbai, MH 400001</div>
      
      {/* Expandable contacts */}
      <button onClick={() => toggleContacts()}>
        Show Authorized Contacts (3)
      </button>
      
      {showContacts && (
        <div>
          <ContactCard name="Mr. Ramesh" phone="+91-98765" />
          <ContactCard name="Ms. Priya" phone="+91-91234" />
        </div>
      )}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

#### 4. **Commodity Block** (Editable with Auditor Rights)

**Fields:**
- **Commodity & Variety:** Crop type and specific variety
- **Quality Grade:** Standard/Premium/etc.
- **Unit Picker:** Dropdown (Kg/MT/Quintal/Bag/Crate)
- **Measurement Selector:** Unit-specific options
- **Quantity:** Numeric input (editable if authorized)
- **Weight:** From weighment table (net_weight)

**Calculation Helpers:**
- Calculator icon with tooltip showing formula
- Real-time updates when editing
- Validation against weighment data

**Database Mapping:**
```sql
SELECT 
  l.commodity,
  l.variety,
  l.quality_grade,
  b.quantity_units,
  w.net_weight,
  w.unit
FROM bills b
JOIN lots l ON l.id = b.lot_id
LEFT JOIN weighments w ON w.lot_id = l.id
WHERE b.id = $billId;
```

**Edit Mode:**
```tsx
{editing ? (
  <>
    <Input 
      type="number" 
      value={quantity}
      onChange={handleQuantityChange}
    />
    <Select value={unit} onChange={handleUnitChange}>
      <SelectItem value="Kg">Kilogram</SelectItem>
      <SelectItem value="MT">Metric Ton</SelectItem>
    </Select>
  </>
) : (
  <div>
    <div>Quantity: 50 Kg</div>
    <div>Weight: 5000 Kg (from weighment)</div>
  </div>
)}
```

---

#### 5. **Pricing Section** (Itemized with Calculation Helpers)

**Display:**
```
┌─────────────────────────────────────────┐
│ Pricing Breakdown                  🧮   │
├─────────────────────────────────────────┤
│ Price per Unit                  ₹22.00  │
│ Quantity × Rate          ₹1,100  (💡)   │
│ Packaging Cost                 ₹50.00   │
│ ─────────────────────────────────────── │
│ Total Payable              ₹1,150.00 ✓  │
└─────────────────────────────────────────┘
```

**Calculation Helper Tooltips:**
- Hover over 💡 icon shows: "50 × ₹22.00 = ₹1,100"
- Each field has helper text explaining calculation
- Auto-recalculates on any change

**Database Mapping:**
```sql
SELECT 
  b.price_per_unit,
  b.quantity_units,
  b.packaging_cost,
  (b.price_per_unit * b.quantity_units) + b.packaging_cost as total_payable
FROM bills b
WHERE b.id = $billId;

-- Line items (optional)
SELECT 
  label,
  qty,
  unit_price,
  (qty * unit_price) as line_total
FROM bill_items
WHERE bill_id = $billId;
```

**Edit Mode with Justification:**
```tsx
{editing && (
  <Alert className="border-orange-500">
    <AlertTriangle />
    <AlertDescription>
      <p>Justification Required</p>
      <Textarea 
        placeholder="Explain reason for price change..."
        value={justification}
        onChange={setJustification}
      />
      <Button onClick={submitChanges}>
        Submit Changes
      </Button>
    </AlertDescription>
  </Alert>
)}
```

---

#### 6. **Payment & Overdue Section**

##### Payment Methods Display

**Supported Methods with Icons:**
- 📱 UPI (QrCode icon)
- ⚡ IMPS (Zap icon)
- 🏦 NEFT/ACH/SEPA/WIRE (Building icon)
- 📄 CHEQUE (FileCheck icon)
- 💳 CARD (CreditCard icon)
- 👛 PAYPAL/WALLET (Wallet icon)
- 💵 CASH (Banknote icon)
- 🎯 CRYPTO (Target icon)

**Database Mapping:**
```sql
SELECT 
  method,
  details_json,
  is_default
FROM buyer_payment_prefs
WHERE buyer_entity_id = $buyerEntityId;
```

**UI Example:**
```tsx
<div>
  <Label>Payment Method(s)</Label>
  <div className="flex gap-2">
    {paymentMethods.map(method => (
      <HoverCard>
        <HoverCardTrigger>
          <Badge>
            {getPaymentIcon(method.type)}
            {method.type}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent>
          {/* Show cheque no, UPI ID, account details */}
          <div>Details: {method.details_json}</div>
        </HoverCardContent>
      </HoverCard>
    ))}
  </div>
</div>
```

##### Due Date Section

**Display:**
- Due date with calendar icon
- Rule badge (Regulatory/Association/Custom/AI Suggested)
- Tooltip explaining the rule

**Rule Types:**

| Type | Days | Tooltip |
|------|------|---------|
| Regulatory | 15 | "As per India Agricultural Produce Marketing Act" |
| Association | 30 | "APEDA Association Guidelines" |
| Custom | Variable | "Mutually agreed payment terms" |
| AI Suggested | Calculated | "Based on historical settlement patterns (avg 22 days)" |

**Database Mapping:**
```sql
SELECT 
  due_date,
  due_date_type,
  CASE 
    WHEN due_date < CURRENT_DATE THEN CURRENT_DATE - due_date
    ELSE 0
  END as days_overdue
FROM bills
WHERE id = $billId;
```

##### Payment Received Tracking

**Display:**
```
┌─────────────────────────────────────────┐
│ Payments Received                       │
├─────────────────────────────────────────┤
│ 📱 UPI                          ₹500    │
│   Oct 25 • Ref: TXN123456       ✓       │
├─────────────────────────────────────────┤
│ 💳 Card                         ₹650    │
│   Oct 26 • Ref: CARD789         ✓       │
├─────────────────────────────────────────┤
│ Remaining Balance          ₹0 (Paid) ✓  │
└─────────────────────────────────────────┘
```

**Database Mapping:**
```sql
SELECT 
  p.method,
  p.amount,
  p.paid_at,
  p.reference
FROM payments p
WHERE p.bill_id = $billId
ORDER BY p.paid_at DESC;

-- Calculate remaining
SELECT 
  b.total_payable - COALESCE(SUM(p.amount), 0) as remaining
FROM bills b
LEFT JOIN payments p ON p.bill_id = b.id
WHERE b.id = $billId;
```

##### Days Past Due (Auto-calculated)

**Logic:**
```typescript
const daysOverdue = calculateDaysOverdue(bill.due_date);
const isOverdue = daysOverdue > 0;
const isSeverelyOverdue = daysOverdue >= 7;

// Display with color coding
<div className={`text-2xl font-bold ${
  daysOverdue > 0 ? 'text-red-600' : 'text-green-600'
}`}>
  {daysOverdue > 0 ? `+${daysOverdue}` : '0'} days
</div>

{isSeverelyOverdue && (
  <Badge className="bg-red-600 animate-pulse">
    ⚠️ Severely Overdue
  </Badge>
)}
```

---

#### 7. **Overdue Actions** (Conditional Display)

**Triggered When:** `daysOverdue > 0`

**Available Actions:**

1. **Send Reminder** 📨
   - Opens modal with channel selection (SMS/Email/WhatsApp)
   - Automated notification with bill details
   - Includes: Amount, due date, days overdue, payment instructions

```tsx
<Button onClick={() => sendReminder()}>
  <Send className="w-4 h-4 mr-2" />
  Send Reminder
</Button>

// Modal
<Dialog>
  <DialogContent>
    <DialogTitle>Send Payment Reminder</DialogTitle>
    <div>
      <Button><Phone /> SMS</Button>
      <Button><Mail /> Email</Button>
      <Button><MessageCircle /> WhatsApp</Button>
    </div>
  </DialogContent>
</Dialog>
```

2. **Justify Overdue** 📝
   - Opens modal with history of notes
   - Editable note field (mandatory)
   - Saved to audit trail

```tsx
<Dialog>
  <DialogTitle>Justify Overdue Payment</DialogTitle>
  <div>
    <Label>History of Notes</Label>
    <ScrollArea className="h-32">
      {previousNotes.map(note => (
        <div>{note.text} - {note.date}</div>
      ))}
    </ScrollArea>
    
    <Label>New Note</Label>
    <Textarea placeholder="Explain delay..." />
    
    <Button>Save Justification</Button>
  </div>
</Dialog>
```

3. **AI Insight Badge** 🧠
   - View buyer behavioral summary
   - Historical overdue patterns
   - Reliability ratings

```tsx
<Button onClick={() => showAIInsights()}>
  <Brain className="w-4 h-4 mr-2" />
  AI Insight
</Button>

// Modal shows:
// - Reliability score
// - Avg settlement time
// - Discrepancy ratio
// - On-time payment %
// - Pattern warnings
```

4. **Escalate to Association** 🚨 (if ≥7 days overdue)
   - Only appears for severely overdue
   - Triggers regulatory escalation
   - Logged in audit trail

```tsx
{isSeverelyOverdue && (
  <Button className="bg-red-600">
    <Flag className="w-4 h-4 mr-2" />
    Escalate to Association
  </Button>
)}
```

**Database Mapping:**
```sql
-- Log reminder sent
INSERT INTO audit_log (entity, entity_id, action, after_json)
VALUES ('BILL', $billId, 'REMINDER_SENT', jsonb_build_object(
  'channel', 'SMS',
  'sent_at', NOW(),
  'days_overdue', $daysOverdue
));

-- Save justification
INSERT INTO audit_log (entity, entity_id, action, after_json)
VALUES ('BILL', $billId, 'OVERDUE_JUSTIFIED', jsonb_build_object(
  'note', $justificationText,
  'days_overdue', $daysOverdue
));
```

---

#### 8. **Confirmation Switches & Actions**

**2FA/OTP Toggle:**
```tsx
<div className="flex items-center justify-between">
  <div>
    <Shield /> 2FA/OTP Verification
    <p>Require OTP for approval</p>
  </div>
  <Switch defaultChecked />
</div>
```

**Action Buttons:**
```tsx
<div className="flex gap-2">
  <Button className="flex-1 bg-green-600">
    <CheckCircle2 /> Approve
  </Button>
  <Button className="flex-1 bg-red-600">
    <XCircle /> Reject
  </Button>
  <Button variant="outline" className="flex-1">
    <Edit /> Request Changes
  </Button>
</div>
```

**Database Actions:**
```sql
-- Approve
INSERT INTO bill_authorizations (bill_id, by_role, by_user_id, approved)
VALUES ($billId, $role, $userId, true);

UPDATE bills SET status = 'AUTHORIZED' WHERE id = $billId;

-- Create ledger entry
INSERT INTO ledger_entries (bill_id, snapshot_json)
SELECT id, to_jsonb(bills.*) FROM bills WHERE id = $billId;

-- Reject
UPDATE bills SET status = 'REJECTED' WHERE id = $billId;

-- Request changes
UPDATE bills SET status = 'MODIFIED_NEEDS_JUSTIFICATION' WHERE id = $billId;
```

---

### B. Visual & Audit Controls (Right Sidebar)

#### 1. **AI Behavioral Insights Card**

**Layout:**
```
┌─────────────────────────────────────┐
│ 🧠 AI Behavioral Insights           │
├─────────────────────────────────────┤
│ Reliability Score                   │
│ [████████░░] 85%                    │
├─────────────────────────────────────┤
│ Avg Settlement: 22 days             │
│ Discrepancy Ratio: 12%              │
│ On-Time Payments: 88%               │
├─────────────────────────────────────┤
│ ⚠️ Warnings:                        │
│ • Low reliability (< 90%)           │
│ • 3 modifications in 30 days        │
└─────────────────────────────────────┘
```

**Database Mapping:**
```sql
SELECT 
  reliability_score,
  discrepancy_ratio,
  on_time_pay_ratio,
  comment
FROM ai_buyer_scores
WHERE buyer_entity_id = $buyerEntityId
ORDER BY generated_at DESC
LIMIT 1;
```

**UI Implementation:**
```tsx
<Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
  <CardHeader>
    <Brain className="w-5 h-5 text-purple-600" />
    AI Behavioral Insights
  </CardHeader>
  <CardContent>
    <div>
      <Label>Reliability Score</Label>
      <Progress value={aiScore.reliability_score} />
      <span className="font-bold">{aiScore.reliability_score}%</span>
    </div>
    
    <div className="text-sm">
      <div>Avg Settlement: {aiScore.avg_settlement_days} days</div>
      <div>Discrepancy: {aiScore.discrepancy_ratio}%</div>
      <div>On-Time: {aiScore.on_time_pay_ratio}%</div>
    </div>
    
    {warnings.length > 0 && (
      <Alert>
        <Sparkles />
        <AlertDescription>
          {warnings.map(w => <div>⚠️ {w}</div>)}
        </AlertDescription>
      </Alert>
    )}
  </CardContent>
</Card>
```

#### 2. **Audit Trail Table**

**Columns:**
- **Timestamp:** Date and time of change
- **Action:** CREATE/UPDATE/APPROVE/REJECT
- **User:** Who made the change
- **Field:** What was changed
- **Old Value → New Value:** Before and after
- **Justification:** Reason for change

**Database Mapping:**
```sql
SELECT 
  al.created_at,
  al.action,
  u.full_name as actor_name,
  al.before_json,
  al.after_json,
  al.entity
FROM audit_log al
LEFT JOIN users u ON u.id = al.actor_user_id
WHERE al.entity = 'BILL' AND al.entity_id = $billId
ORDER BY al.created_at DESC;
```

**UI Example:**
```tsx
<Card>
  <CardHeader>
    <History /> Audit Trail
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-96">
      {auditTrail.map(log => (
        <div className="border-l-2 border-blue-200 pl-3">
          <div className="text-xs text-gray-500">
            {log.created_at.toLocaleString()}
          </div>
          <Badge>{log.action}</Badge>
          <div className="font-medium">{log.entity}</div>
          
          {/* Show before/after comparison */}
          {log.before_json && log.after_json && (
            <div className="text-xs">
              {Object.keys(log.after_json).map(key => {
                if (log.before_json[key] !== log.after_json[key]) {
                  return (
                    <div>
                      <strong>{key}:</strong>
                      <span className="line-through">{log.before_json[key]}</span>
                      → 
                      <span className="text-green-600">{log.after_json[key]}</span>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  </CardContent>
</Card>
```

#### 3. **Payment Receipt Files**

**Features:**
- View uploaded receipts
- Download PDF/images
- Upload new receipts
- Link to payment records

**Database Mapping:**
```sql
-- Store receipt file path in payment record
UPDATE payments 
SET reference = $receiptFilePath
WHERE id = $paymentId;

-- Or use separate table
CREATE TABLE payment_receipts (
  id BIGSERIAL PRIMARY KEY,
  payment_id BIGINT REFERENCES payments(id),
  file_path TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI Example:**
```tsx
<Dialog>
  <DialogTrigger>
    <Button>
      <Upload /> Upload Receipt
    </Button>
  </DialogTrigger>
  <DialogContent>
    <div className="border-dashed border-2 p-8">
      <Upload className="w-12 h-12 mx-auto" />
      <p>Drag and drop file or click to browse</p>
      <p className="text-xs">JPG, PNG, PDF (max 5MB)</p>
    </div>
    
    <Input placeholder="Transaction ID / Cheque No..." />
    
    <Button>Upload Receipt</Button>
  </DialogContent>
</Dialog>

{/* Display receipts */}
<div>
  {receipts.map(receipt => (
    <div className="flex items-center justify-between">
      <div>
        <FileText className="w-4 h-4" />
        {receipt.filename}
      </div>
      <Button size="sm" onClick={() => download(receipt)}>
        <Download className="w-4 h-4" />
      </Button>
    </div>
  ))}
</div>
```

#### 4. **Auditor-Only Notes** (Private/Internal)

**Features:**
- Internal notes field
- Not visible to buyer/agent
- Saved to database with timestamp
- Editable by auditors only

**Database Mapping:**
```sql
CREATE TABLE auditor_notes (
  id BIGSERIAL PRIMARY KEY,
  bill_id BIGINT REFERENCES bills(id),
  note TEXT NOT NULL,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check user role before showing
SELECT * FROM auditor_notes 
WHERE bill_id = $billId 
AND EXISTS (
  SELECT 1 FROM users 
  WHERE id = $currentUserId 
  AND role IN ('ADMIN', 'STAFF')
);
```

**UI Example:**
```tsx
<Card>
  <CardHeader>
    <FileEdit /> Auditor Notes
    <CardDescription className="text-xs">
      Internal notes (not visible to buyer/agent)
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Textarea
      placeholder="Add internal notes..."
      value={auditorNote}
      onChange={setAuditorNote}
      rows={4}
    />
    <Button className="w-full mt-2">
      <CheckCircle2 /> Save Note
    </Button>
    
    {/* History */}
    <div className="mt-4 space-y-2">
      {previousNotes.map(note => (
        <div className="text-sm border-l-2 pl-2">
          <div className="text-xs text-gray-500">{note.created_at}</div>
          <div>{note.text}</div>
          <div className="text-xs">By: {note.created_by}</div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

#### 5. **Change Requests Display**

**Shows:**
- All change requests for this bill
- Status (OPEN/APPROVED/REJECTED)
- Field changed
- Old value → New value
- Justification
- Timestamp

**Database Mapping:**
```sql
SELECT 
  bcr.id,
  bcr.field_name,
  bcr.old_value,
  bcr.new_value,
  bcr.justification,
  bcr.status,
  bcr.created_at,
  u.full_name as requested_by
FROM bill_change_requests bcr
JOIN users u ON u.id = bcr.requested_by_user
WHERE bcr.bill_id = $billId
ORDER BY bcr.created_at DESC;
```

**UI Example:**
```tsx
<Card>
  <CardHeader>
    <Edit /> Change Requests
  </CardHeader>
  <CardContent>
    {changes.map(change => (
      <div className="p-3 bg-orange-50 border border-orange-200 rounded">
        <div className="flex justify-between">
          <Badge className={
            change.status === 'APPROVED' ? 'bg-green-500' :
            change.status === 'REJECTED' ? 'bg-red-500' :
            'bg-orange-500'
          }>
            {change.status}
          </Badge>
          <span className="text-xs">{change.created_at}</span>
        </div>
        
        <div className="font-semibold">{change.field_name}</div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="line-through">{change.old_value}</span>
          →
          <span className="text-green-600 font-semibold">
            {change.new_value}
          </span>
        </div>
        
        <div className="mt-2 text-xs">
          <strong>Reason:</strong> {change.justification}
        </div>
      </div>
    ))}
  </CardContent>
</Card>
```

---

### C. Overdue/Payment UI Logic

#### Threshold-Based Behavior

**Level 1: Overdue (1-6 days)**
```tsx
if (daysOverdue >= 1 && daysOverdue < 7) {
  return (
    <Card className="border-l-4 border-l-orange-500 bg-orange-50">
      <Badge className="bg-orange-500">
        ⚠️ {daysOverdue} Days Overdue
      </Badge>
      {/* Show: Send Reminder, Justify buttons */}
    </Card>
  );
}
```

**Level 2: Severely Overdue (≥7 days)**
```tsx
if (daysOverdue >= 7) {
  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50 animate-pulse">
      <Badge className="bg-red-600 animate-pulse">
        🚨 {daysOverdue} Days Overdue - SEVERE
      </Badge>
      {/* Show: All actions + Escalate to Association */}
      <Button className="bg-red-600">
        <Flag /> Escalate to Association
      </Button>
    </Card>
  );
}
```

#### AI Popup for Chronic Overdue

**Triggered When:**
- Buyer has ≥3 overdue transactions in last 30 days
- Current transaction overdue ≥7 days
- AI reliability score < 70

**Popup Content:**
```tsx
<Dialog open={showChronicWarning}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <Brain className="w-6 h-6 text-yellow-600" />
      Chronic Overdue Pattern Detected
    </DialogHeader>
    
    <Alert className="border-red-500 bg-red-50">
      <AlertTriangle />
      <AlertDescription>
        <div className="font-semibold">High Risk Buyer Detected</div>
        <div className="mt-2">
          This buyer has:
          <ul className="list-disc list-inside mt-2">
            <li>5 overdue transactions in last 30 days</li>
            <li>Average delay: 14 days</li>
            <li>Reliability score dropped 15% this month</li>
          </ul>
        </div>
        
        <div className="mt-4 font-semibold">Recommended Actions:</div>
        <ul className="list-disc list-inside">
          <li>Require advance payment for future orders</li>
          <li>Reduce credit limit by 50%</li>
          <li>Escalate to regulatory association</li>
          <li>Schedule payment plan discussion</li>
        </ul>
      </AlertDescription>
    </Alert>
    
    <div className="flex gap-2">
      <Button className="bg-red-600">Take Action</Button>
      <Button variant="outline">Dismiss</Button>
    </div>
  </DialogContent>
</Dialog>
```

**Database Query:**
```sql
-- Detect chronic overdue pattern
SELECT 
  COUNT(*) as overdue_count,
  AVG(CURRENT_DATE - due_date) as avg_delay_days,
  MIN(due_date) as earliest_overdue
FROM bills
WHERE buyer_entity_id = $buyerEntityId
  AND due_date < CURRENT_DATE
  AND status != 'AUTHORIZED'
  AND created_at >= NOW() - INTERVAL '30 days';

-- Get reliability trend
SELECT 
  reliability_score,
  generated_at
FROM ai_buyer_scores
WHERE buyer_entity_id = $buyerEntityId
ORDER BY generated_at DESC
LIMIT 2;
```

---

## 📊 Export/Print Options

### Print View

**Optimized for printing:**
```tsx
<style>
  @media print {
    .no-print { display: none; }
    .print-only { display: block; }
    .card { 
      page-break-inside: avoid;
      border: 1px solid #000;
    }
  }
</style>

<Button onClick={() => window.print()} className="no-print">
  <Printer /> Print
</Button>
```

**Print Layout:**
- Company letterhead
- Transaction summary
- Payment details
- Audit trail (optional)
- Signatures section

### Export Options

**CSV Export:**
```typescript
const exportCSV = () => {
  const csv = [
    ['Bill ID', 'Date', 'Buyer', 'Amount', 'Status', 'Days Overdue'],
    [bill.id, bill.created_at, bill.buyer_entity.display_name, 
     bill.total_payable, bill.status, daysOverdue]
  ].map(row => row.join(',')).join('\n');
  
  download(csv, 'transaction.csv', 'text/csv');
};
```

**PDF Export:**
```typescript
const exportPDF = async () => {
  const blob = await api.generateBillDocument(bill.id);
  download(blob, `bill_${bill.id}.pdf`, 'application/pdf');
};
```

---

## 🔐 Security & Access Control

### Role-Based Visibility

```typescript
const canEdit = (userRole: Role) => {
  if (bill.status === AuthStatus.AUTHORIZED) return false;
  return userRole === Role.ADMIN || userRole === Role.STAFF;
};

const canViewAuditorNotes = (userRole: Role) => {
  return userRole === Role.ADMIN || userRole === Role.STAFF;
};

const canEscalate = (userRole: Role) => {
  return userRole === Role.COMMISSION_AGENT || 
         userRole === Role.ADMIN;
};
```

### Immutability Enforcement

```sql
-- Prevent deletion of authorized bills
CREATE RULE prevent_delete_authorized AS
  ON DELETE TO bills
  WHERE OLD.status = 'AUTHORIZED'
  DO INSTEAD NOTHING;

-- Prevent updates to authorized bills (except audit notes)
CREATE RULE prevent_update_authorized AS
  ON UPDATE TO bills
  WHERE OLD.status = 'AUTHORIZED'
  DO INSTEAD NOTHING;
```

---

## 🎯 Complete Integration Example

```tsx
import DetailedTransactionAuditView from './components/DetailedTransactionAuditView';

function App() {
  return (
    <DetailedTransactionAuditView 
      billId={BigInt(123)}
      onClose={() => navigateBack()}
    />
  );
}
```

**Component automatically:**
- ✅ Loads bill with all relations (buyer, lot, weighment, payments)
- ✅ Fetches AI insights from buyer scores
- ✅ Loads complete audit trail
- ✅ Calculates days overdue
- ✅ Tracks payment status
- ✅ Displays change requests
- ✅ Shows overdue actions (conditional)
- ✅ Enables editing (role-based)
- ✅ Provides export/print options

---

## 📈 Key Features Summary

✅ **Complete Transaction Detail:** All fields visible with expand/collapse
✅ **Editable Fields:** With mandatory justification tracking
✅ **Payment Tracking:** Multiple methods, receipt uploads
✅ **Overdue Management:** Auto-calculation, reminders, escalation
✅ **AI Insights:** Behavioral analysis, pattern detection
✅ **Audit Trail:** Complete change history with before/after
✅ **Auditor Notes:** Internal-only private notes
✅ **Change Requests:** Full tracking with justifications
✅ **Export/Print:** Compliance-ready outputs
✅ **Role-Based Access:** Security-first design

---

**Built with precision for comprehensive back-office transaction management.** 🎯📋
