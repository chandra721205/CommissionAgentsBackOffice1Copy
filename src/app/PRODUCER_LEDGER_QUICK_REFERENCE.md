# 🌾 Producer Ledger - Quick Reference Card

## 📊 18 Expert Fields at a Glance

**Note**: Producers are customers. Internal staff role assignments are managed separately and not displayed in this ledger.

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **ProducerID** | String | Unique identifier | `P001`, `P002`, `P003` |
| **ProducerName** | String | Full name | `Chandra Sekhar` |
| **VillagePlace** | String | Location | `Guntur`, `Gurajepalli` |
| **Date** | Date | Transaction date | `2025-02-12` |
| **TransactionType** | Enum | Type of entry | `Credit`, `Sale`, `Expense` |
| **CreditAmount** | Number | Money given | `20000`, `28000` |
| **DebitAmount** | Number | Money received | `42000`, `8000` |
| **Purpose** | String | Description | `Pesticides`, `Sale of chillies` |
| **BalanceAfter** | Number | Running balance | `980000`, `952000` |
| **RiskRanking** | Enum | AI risk level | `Low`, `Medium`, `High`, `Critical` |
| **OTPStatus** | Enum | Verification | `Pending`, `Confirmed`, `Closed`, `N/A` |
| **AuthorizedBy** | String | Approver | `Commission Agent`, `Market Receiver` |
| **RoleNotes** | String | Transaction notes | `Initial credit`, `Sale proceeds` |
| **AIAlertFlag** | Boolean | Priority flag | `true` (🚨), `false` |
| **RecordCreatedBy** | String | Creator ID | `Agent1`, `Agent2`, `Agent3` |
| **RecordAccessPerm** | Enum | Access level | See Access Matrix below |
| **AIInsights** | String | AI analysis | `Increased borrow frequency` |
| **Chronology** | Number | Audit sequence | `1`, `2`, `3`, `4`... |

---

## 🔐 Access Permission Matrix

| Level | Icon | Who Can Access | Use Case |
|-------|------|----------------|----------|
| **AgentOnly** | 🔐 | Commission Agent | Confidential credits |
| **MarketOnly** | 🏪 | Market Receiver | Public sales records |
| **AgentAndAdmin** | 👥 | Agent + Admin | High-risk transactions |
| **AgentAndExpense** | 💰 | Agent + Expense Approver | Operational expenses |
| **PublicView** | 👁️ | Everyone | General information |

### Permission Badge Colors
- 🔐 AgentOnly: **Blue** (`bg-blue-50 text-blue-600`)
- 🏪 MarketOnly: **Green** (`bg-green-50 text-green-600`)
- 👥 AgentAndAdmin: **Purple** (`bg-purple-50 text-purple-600`)
- 💰 AgentAndExpense: **Orange** (`bg-orange-50 text-orange-600`)
- 👁️ PublicView: **Gray** (`bg-gray-50 text-gray-600`)

---

## 🎯 Transaction Types

| Type | Symbol | Direction | When to Use | Example |
|------|--------|-----------|-------------|---------|
| **Credit** | 💸➡️ | To Producer | Lending money/advances | Seeds, pesticides, equipment |
| **Sale** | 💰⬅️ | From Producer | Sale proceeds | Commodity sold at market |
| **Expense** | 💵⬅️ | From Producer | Operational costs | Labor, transport, storage |
| **Debit** | 📊⬅️ | From Producer | Other receipts | (Rarely used) |

### Type Color Coding
- **Credit**: Green badge, green amount text
- **Sale**: Blue/secondary badge, red amount text
- **Expense**: Outline badge, red amount text

---

## 🚨 AI Risk Levels

| Level | Color | Badge | Criteria | Action Required |
|-------|-------|-------|----------|-----------------|
| **Low** | 🟢 Green | `bg-green-100 text-green-700` | Regular payments, low balance | Normal monitoring |
| **Medium** | 🟡 Yellow | `bg-yellow-100 text-yellow-700` | Moderate credit, normal activity | Watch closely |
| **High** | 🟠 Orange | `bg-orange-100 text-orange-700` | Frequent requests, increasing balance | Increased oversight |
| **Critical** | 🔴 Red | `bg-red-100 text-red-700` | Large transactions, pending OTP | Immediate action |

### AI Alert Flags
- **AIAlertFlag = true**: Red background row, 🔔 bell badge
- **AIAlertFlag = false**: Normal row background

---

## 🔍 Advanced Filtering

### Filter Options

1. **🔔 AI Alerts Toggle**
   - Show only flagged transactions
   - Displays alert count badge
   - Filters instantly

2. **📋 Sort Options**
   - **By Chronology**: Audit sequence order (#1, #2, #3...)
   - **By Date**: Temporal order (newest first)

3. **👤 Producer Filter**
   - Select specific producer
   - Shows all transactions for that producer

4. **📍 Village Filter**
   - Filter by location
   - Geographic analysis

5. **⚠️ Risk Level Filter**
   - Low / Medium / High / Critical
   - Risk-based prioritization

6. **📊 Transaction Type**
   - Credit / Sale / Expense / Debit
   - Type-specific analysis

7. **🔐 Access Permission**
   - Filter by permission level
   - Role-based data access

8. **🔍 Full-Text Search**
   - Search by producer name
   - Search by purpose/description

### Filter Combinations
```
Example 1: High-Risk Credits in Guntur
Village: Guntur
+ Risk: High
+ Type: Credit
= Shows all high-risk credit transactions in Guntur

Example 2: AI Alert Transactions for Specific Producer
Producer: P001 (Chandra Sekhar)
+ AI Alerts: ON
= Shows all flagged transactions for Chandra Sekhar
```

---

## 🔐 Access Control (5-Tier RBAC)

| Permission Level | Icon | Access Scope | Who Can View |
|------------------|------|--------------|--------------|
| **AgentOnly** | 🔐 | Commission Agent exclusive | Agent only |
| **MarketOnly** | 🏪 | Market operations | Market staff |
| **AgentAndAdmin** | 👥 | Elevated access | Agent + Admin |
| **AgentAndExpense** | 💰 | Expense management | Agent + Expense approvers |
| **PublicView** | 👁️ | Read-only public | All authorized users |

### Staff Role Management
**Important**: Internal staff roles (Watchman, Receiver, Laborer, Salesman, Weighing Supervisor, Quality Supervisor, Sample Mover, etc.) are managed in a **separate Staff Management module**. 

Producers are **customers**, not staff, so staff role assignments do not appear in the producer ledger.

---

## 📱 UI Quick Actions

### From Main View
- **➕ Add Transaction**: Create new entry
- **🔄 Switch View**: Toggle between Transactions / Summary
- **🔍 Search**: Real-time filter
- **👁️ View Details**: Click any row
- **📊 Export**: Download Excel/CSV

### From Transaction Details
- **✏️ Edit**: Modify pending transactions
- **✅ Approve**: Confirm with OTP
- **🚫 Reject**: Cancel pending entry
- **📄 Print**: Generate PDF
- **🔗 Share**: Copy link

---

## 🎨 Visual Color Guide

### Row Backgrounds
- **Normal Row**: White (`bg-white`)
- **Alert Row**: Soft Red (`bg-red-50/30`)
- **Hover**: Light Blue (`hover:bg-blue-50/50`)
- **Selected**: Blue highlight

### Status Colors
- **Pending OTP**: Yellow (`bg-yellow-100`)
- **Confirmed**: Green (`bg-green-100`)
- **Closed**: Gray (`bg-gray-100`)
- **N/A**: Gray (`bg-gray-50`)

### Amount Colors
- **Credit (Positive)**: Green (`text-green-600`)
- **Debit (Negative)**: Red (`text-red-600`)
- **Balance**: Black (or orange if high)

---

## 📊 Producer Summary Cards

Each producer has a summary card showing:

```
┌─────────────────────────────────────┐
│ 👤 Chandra Sekhar                   │
│ 📍 Guntur                   🟠 High │
├─────────────────────────────────────┤
│ Total Credit:    ₹81,000            │
│ Total Debit:     ₹50,000            │
├─────────────────────────────────────┤
│ Current Balance: ₹973,000           │
├─────────────────────────────────────┤
│ Transactions: 5                     │
│ Last Activity: 01 Apr               │
├─────────────────────────────────────┤
│ 🤖 AI Alerts:                       │
│ • High-frequency requests           │
├─────────────────────────────────────┤
│ [View Transactions]                 │
└─────────────────────────────────────┘
```

---

## 🔢 Sample Data Reference

### Example 1: Normal Credit
```json
{
  "producerId": "P001",
  "producerName": "Chandra Sekhar",
  "village": "Guntur",
  "date": "2025-02-12",
  "type": "Credit",
  "creditAmount": 20000,
  "purpose": "Pesticides",
  "balanceAfter": 980000,
  "riskRanking": "Medium",
  "otpStatus": "Confirmed",
  "authorizedBy": "Commission Agent",
  "roleNotes": "Initial credit",
  "aiAlertFlag": false,
  "recordCreatedBy": "Agent1",
  "recordAccessPerm": "AgentOnly",
  "aiInsights": "Increased borrow frequency",
  "chronology": 1
}
```

### Example 2: High-Risk Alert
```json
{
  "producerId": "P001",
  "type": "Credit",
  "creditAmount": 13000,
  "purpose": "Watering",
  "balanceAfter": 939000,
  "riskRanking": "High",
  "roleNotes": "High-frequency requests",
  "aiAlertFlag": true,  // 🚨 ALERT!
  "recordAccessPerm": "AgentAndAdmin",  // Elevated access
  "aiInsights": "Increase in risk flag",
  "chronology": 3
}
```

### Example 3: Sale Transaction
```json
{
  "producerId": "P001",
  "type": "Sale",
  "debitAmount": 42000,
  "purpose": "Sale of chillies - 350 Kg @ ₹120/Kg",
  "balanceAfter": 981000,
  "riskRanking": "Low",  // Improved!
  "otpStatus": "Closed",
  "authorizedBy": "Market Receiver",
  "recordAccessPerm": "MarketOnly",  // Public record
  "aiInsights": "Positive sale event",
  "chronology": 4
}
```

---

## 🛠️ Common Workflows

### Workflow 1: Add Credit Transaction
1. Click **"Add Transaction"** button
2. Select **Producer** from dropdown (or enter new)
3. Select **Type**: Credit
4. Enter **Credit Amount**: e.g., 20000
5. Enter **Purpose**: e.g., "Seeds for next season"
6. Select **Roles**: e.g., Salesman, Quality Supervisor
7. Add **Role Notes**: e.g., "Seasonal advance"
8. Set **Access Permission**: Default AgentOnly
9. Click **"Submit"**
10. System generates **OTP** → Send to producer
11. Producer confirms → Status: **Confirmed**
12. AI calculates risk → Updates **Risk Ranking**
13. System assigns **Chronology** number
14. Transaction becomes **immutable**

### Workflow 2: Review AI Alerts
1. Toggle **"Show AI Alert Flags Only"** ON
2. Review count in badge (e.g., "3 Alerts")
3. See red-highlighted rows in table
4. Click row to view details
5. Review **AI Insights** section
6. Check **AI Alert Flags** list
7. Take appropriate action:
   - Contact producer
   - Escalate to admin
   - Request additional verification

### Workflow 3: Filter High-Risk Producers
1. Select **Risk Level**: High or Critical
2. Select **Transaction Type**: Credit (optional)
3. Enable **AI Alerts** toggle (optional)
4. Review filtered results
5. Sort by **Chronology** to see sequence
6. Export to Excel for reporting

### Workflow 4: Audit Trail Review
1. Select **Sort by**: Chronology
2. Transactions appear in audit order (#1, #2, #3...)
3. Review **RecordCreatedBy** for accountability
4. Check **RecordAccessPerm** for compliance
5. Verify **OTP Status** for all credits
6. Export for regulatory reporting

---

## 📈 AI Insights Examples

| Insight Message | Meaning | Risk Impact |
|----------------|---------|-------------|
| **"Normal activity"** | Standard transaction | No change |
| **"Increased borrow frequency"** | More credits than usual | ⚠️ Watch closely |
| **"Increase in risk flag"** | Pattern detected | 🚨 High priority |
| **"Positive sale event"** | Balance reducing | ✅ Risk decreased |
| **"Expense recorded"** | Operational deduction | Neutral |
| **"High-value pending transaction"** | Large amount awaiting OTP | 🚨 Immediate attention |
| **"Successful closure - zero balance"** | Fully settled | ✅ Excellent |
| **"Long-term productivity improvement"** | Infrastructure investment | Positive outlook |

---

## 🔐 Security Features

### OTP Verification
- **Credit > ₹10,000**: Requires OTP
- **High-risk producers**: Always requires OTP
- **Status flow**: Pending → Confirmed → Immutable

### Access Control
- **5-tier permissions**: Strictly enforced
- **Role assignments**: Multi-role support
- **Creator tracking**: Full accountability

### Audit Trail
- **Chronology sequence**: Unbreakable audit chain
- **Immutable records**: Cannot modify confirmed entries
- **Blockchain-ready**: Polygon NFT append (future)

---

## 📱 Mobile vs Desktop

### Desktop (1440×1024)
- ✅ Full 17-column table visible
- ✅ All filters in 6-column grid
- ✅ Side-by-side comparison
- ✅ Wide transaction detail dialog

### Mobile (360×800)
- ✅ Card-based layout
- ✅ Swipeable transactions
- ✅ Collapsible filters
- ✅ Bottom sheet for details
- ✅ Touch-optimized buttons

---

## 💡 Pro Tips

### For Commission Agents
1. **Review AI alerts daily** - Catch issues early
2. **Use chronology sorting** - Track sequence of events
3. **Assign multiple roles** - Improve accountability
4. **Add detailed role notes** - Context for future reference
5. **Export regularly** - Backup important data

### For Administrators
1. **Audit access permissions** - Review quarterly
2. **Monitor AI alert patterns** - Identify systemic issues
3. **Review creator activity** - Ensure proper usage
4. **Set risk thresholds** - Adjust based on experience
5. **Train staff on RBAC** - Ensure proper understanding

### For Auditors
1. **Use chronology view** - Sequential audit trail
2. **Filter by access permission** - Compliance checks
3. **Review OTP confirmations** - Security verification
4. **Check role assignments** - Proper authorization
5. **Export audit reports** - Regulatory documentation

---

## 🆘 Quick Troubleshooting

### Issue: AI Alert not showing
**Solution**: Check `aiAlertFlag = true` and toggle is ON

### Issue: Cannot see transaction
**Solution**: Check your access permission level vs. `recordAccessPerm`

### Issue: OTP not working
**Solution**: Verify producer contact info and SMS gateway

### Issue: Balance calculation wrong
**Solution**: Sort by Chronology to see correct sequence

### Issue: Filter not working
**Solution**: Clear all filters and try again

---

## 📊 Keyboard Shortcuts (Coming Soon)

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New transaction |
| `Ctrl + F` | Focus search |
| `Ctrl + E` | Export data |
| `Esc` | Close dialog |
| `↑ ↓` | Navigate rows |
| `Enter` | View details |

---

## 📞 Quick Support

**Need Help?**
- 📖 Full Documentation: [PRODUCER_LEDGER_DOCUMENTATION.md](./PRODUCER_LEDGER_DOCUMENTATION.md)
- 🔍 Accounting Overview: [ACCOUNTING_SYSTEMS_OVERVIEW.md](./ACCOUNTING_SYSTEMS_OVERVIEW.md)
- 📚 Main Index: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- 🆘 Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Component Location**: `/components/ProducerLedger.tsx`

---

## ✅ Quick Checklist for New Users

- [ ] Understand the 19 fields and their purposes
- [ ] Learn the 5-tier access permission system
- [ ] Know the 4 transaction types (Credit/Sale/Expense/Debit)
- [ ] Familiarize with AI risk levels (Low/Medium/High/Critical)
- [ ] Practice using filters and search
- [ ] Review sample transactions
- [ ] Test OTP verification flow
- [ ] Export a report
- [ ] Understand chronology vs. date sorting
- [ ] Review AI insights interpretation

---

**Last Updated**: October 27, 2025  
**Version**: 3.1 (Expert-Level Enhancement)  
**Status**: ✅ Production Ready

**Print this card and keep it handy for daily operations!** 🌾📋✨
