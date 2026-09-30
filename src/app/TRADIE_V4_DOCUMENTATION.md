# TRADIE v4.0 - Buyer Database & Authorization Workflow

## 📱 Multi-Platform Responsive Prototype

**Complete Implementation:** 7 Workflow Screens • Responsive Design • AI-Powered Insights

---

## 🎨 Design Specifications

### Platform Support
- **📱 Mobile (Android/iOS):** 360×800px optimized
- **💻 Web/Desktop Dashboard:** 1440×1024px optimized
- **🔄 Fully Responsive:** Adapts to all screen sizes

### TRADIE Branding
- **Base Colors:**
  - White/Ivory base: `#FFFEF5`
  - Gold accents: `#D4AF37`
  - Teal highlights: `#009688`
  - Dark mode: `#0F172A` (gray-950)

- **Typography:**
  - Font Family: Inter / Roboto Medium
  - H1: 32px bold
  - Body: 16px regular
  - Small: 14px

- **Layout:**
  - Grid-based: 8pt spacing
  - Auto-layout enabled
  - Corner radius: 12px
  - Card padding: 16-24px
  - Desktop: 3-column grid (12 columns, 24px gutters)

---

## 🏗️ Architecture Overview

### 7 Main Workflows

1. **Buyer Database (Master Record)**
2. **Weighment Completion & Authorization Queue**
3. **Authorization & Change-Request Panel**
4. **Payment Calculation & Due-Date Logic**
5. **Packaging & Measurement Configuration**
6. **Country-Specific Payment Options**
7. **Audit & Regulatory Logs**

---

## 1️⃣ Buyer Database (Master Record)

### Features

#### Data Fields
- **Buyer Serial No:** Auto-generated unique identifier
- **Date Created:** Timestamp of record creation
- **Buyer Name:** Primary company name
- **Brand → Multiple Companies:**
  - Expandable nested list
  - Each brand can have multiple subsidiary companies
  - Example: JJ&Co → [JJ Main Ltd, JJ Sub-Branch A, JJ Sub-Branch B]
- **Address:** Full geographical address
- **Authorized Person:** Primary contact name
- **Contact Numbers:**
  - Mobile
  - WhatsApp
  - Email

#### Debit Details (Country-Adaptive)
Payment methods auto-adjust based on selected country:

**India:**
- UPI
- IMPS
- NEFT
- Cheque

**UAE:**
- Wire Transfer
- SWIFT

**USA:**
- ACH
- Card
- Crypto (when enabled)

**EU:**
- SEPA
- Wire
- PayPal

**UK:**
- Wire
- SEPA

#### AI Verification Badges
- **✓ Verified:** 90%+ reliability score (Green)
- **⚠ Suspicious:** Modification patterns detected (Red)
- **★ New Entrant:** First-time buyer (Blue)

### Layout Views

**Mobile (360×800):**
- Card-based layout
- Stacked vertical design
- Collapsible brand lists
- Touch-optimized buttons

**Desktop (1440×1024):**
- Table view with sortable columns
- Horizontal scrolling for wide data
- Quick action buttons inline
- Multi-select capabilities

### Actions
- **Search:** Buyer name, serial no, contact
- **Filter:** By country, AI status, brand
- **Export:** PDF/CSV download
- **Add New:** Create buyer record

---

## 2️⃣ Weighment Completion & Authorization Queue

### Workflow Flow

```
Weighment Complete → Auto-Record → Pending Buyer Authorization
                                              ↓
                                    2FA/OTP Verification
                                    (Buyer + Agent)
                                              ↓
                                    Confirmed → Append to Ledger
```

### Status Indicators

#### 🕓 Waiting for Buyer Authorization (Yellow)
- Entry created, pending buyer review
- Can request changes
- OTP not yet sent

#### 🟡 Modified (Pending Justification) (Orange)
- Changes requested by buyer/agent
- Mandatory justification required
- Awaiting re-approval

#### 🟢 Authorized (Appended to Final Ledger) (Green)
- Both parties approved via 2FA
- Immutable record
- Blockchain-anchored

### Fields Displayed

**Lot Information:**
- Lot ID (e.g., LOT-2024-789)
- Crop Type (Coconut, Rice, Turmeric, etc.)
- Variety (West Coast Tall, Basmati, etc.)

**Measurement:**
- Quantity (numeric)
- Weight (in kg)
- Unit (Kg, MT, Nos, Quintal, Bag, etc.)

**Financial:**
- Price Per Unit
- Packaging Material Cost
- **Total Amount = (Unit × Qty + Packaging)**

**Timeline:**
- Due Date
- Due Date Type (with tooltip)

**Attachments:**
- Bill/Digital Invoice Preview
- PDF icon with download

### AI Insight Widget

Real-time pattern detection:
- "Buyer X modified 3 weighments in last 30 days across 4 agents — Reliability ↓ 10%."
- Risk level indicators
- Behavior pattern warnings
- Historical trend analysis

---

## 3️⃣ Authorization & Change-Request Panel

### Actions

#### ✅ Approve Bill
1. Click "Approve Bill" button
2. 2FA modal opens
3. Enter Buyer OTP (6 digits)
4. Enter Agent OTP (6 digits)
5. Verify & Approve
6. Record status → Authorized
7. Append to confirmed ledger

#### ✏️ Request Change
1. Click "Request Change" button
2. Select field to modify:
   - Price Per Unit
   - Quantity
   - Packaging Cost
   - Due Date
3. Enter new value
4. **Mandatory justification field**
5. Submit change request
6. Status → Modified (Pending)

### AI Pattern Detection

**Triggers:**
- 3+ modifications in 30 days
- Same field changed repeatedly
- Multiple agents flagging same buyer

**Actions:**
- Generate AI flag: "Frequent Discrepancy Pattern"
- Auto-adjust buyer reliability rating ↓
- Send warning to regulatory panel
- Highlight in analytics dashboard

### 2FA Security

**OTP Delivery:**
- SMS to registered mobile
- Email to registered address
- WhatsApp (if enabled)

**Verification:**
- 6-digit OTP codes
- 5-minute expiry
- 3 retry attempts
- Audit trail logged

---

## 4️⃣ Payment Calculation & Due-Date Logic

### Calculation Breakdown

```
Example Transaction:

Units: 50 × ₹22 = ₹1,100
Packaging: 10 × ₹5 = ₹50
─────────────────────────
Total Payable: ₹1,150
```

**Auto-calculation:**
- Real-time updates
- Formula tooltips
- Editable overrides
- Validation checks

### Due-Date Dropdown Options

#### 1. As per Regulatory Rule
- **Tooltip:** "As per India Agricultural Produce Marketing Act - Standard 15 days from delivery"
- Auto-fills: Current date + 15 days
- Non-negotiable
- Government mandated

#### 2. As per Association Guideline
- **Tooltip:** "APEDA Association Guidelines - Standard 30 days from delivery"
- Auto-fills: Current date + 30 days
- Industry standard
- Association policy

#### 3. Custom (Commission Agent + Buyer Agreement)
- **Tooltip:** "Mutually agreed payment terms between Commission Agent and Buyer"
- Manual calendar picker
- Requires both party OTP
- Custom days input

#### 4. AI Suggested
- **Tooltip:** "AI calculated based on historical settlement patterns of this buyer (avg 22 days)"
- Predictive analysis
- Based on buyer history
- Confidence score shown

---

## 5️⃣ Packaging & Measurement Configuration

### Packaging Type

#### Fixed
- Single packaging cost
- Manual entry
- No sub-calculations
- Simple pricing

#### Dynamic
When enabled, reveals:
- **Weight per Bag (kg):** e.g., 50
- **Material Type:** Jute, Plastic, Paper, Carton
- **Cost per Unit (₹):** e.g., 5
- **Auto-calc:** Bags needed × Cost per unit

### Measurement Presets (by Commodity)

**Grains:**
- Kg
- Quintal (100 kg)
- MT (Metric Ton = 1000 kg)

**Fruits:**
- Box
- Crate
- Kg

**Vegetables:**
- Bag
- Kg

**Spices:**
- Gram
- Kg
- Bag

**Configuration:**
- Dropdown selection
- Unit conversion helpers
- Weight validation
- Auto-suggestions

---

## 6️⃣ Country-Specific Payment Options

### Implementation

**Country Selector Dropdown:**
```
Select Country → Auto-load payment methods
```

**Multi-select Checkboxes:**
- Enable multiple payment methods
- Show availability indicators
- Regional compliance badges

### Payment Method Matrix

| Country | UPI | IMPS | NEFT | Cheque | Wire | SWIFT | ACH | Card | Crypto | SEPA | PayPal |
|---------|-----|------|------|--------|------|-------|-----|------|--------|------|--------|
| 🇮🇳 India | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 🇦🇪 UAE | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 🇺🇸 USA | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| 🇪🇺 EU | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| 🇬🇧 UK | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

*Crypto enabled only for verified accounts

### Regional Compliance
- Automatic tax calculation
- Currency conversion
- Regulatory checks
- KYC requirements

---

## 7️⃣ Audit & Regulatory Logs

### Ledger Table Fields

| Field | Description |
|-------|-------------|
| **Entry ID** | Unique transaction identifier |
| **Date** | Transaction timestamp |
| **Lot ID** | Reference to weighment lot |
| **Buyer** | Buyer company name |
| **Agent** | Commission agent name |
| **Authorization Status** | Waiting/Modified/Authorized |
| **AI Risk Flag** | ✓ Clear / ⚠ Flagged |
| **Remarks** | Notes/justifications |

### Audit Trail Features

**"Show Audit Trail" Expansion:**
- Old Value vs New Value comparison
- Modification timestamp
- User who made change
- Justification text
- Approval chain

**Immutability:**
- Authorized changes CANNOT be deleted
- Only amendments with timestamp allowed
- Complete version history
- Blockchain verification

### AI Insights Dashboard

**Metrics Tracked:**
1. **Avg Settlement Time per Buyer**
   - Historical payment patterns
   - Buyer reliability score
   - Trend analysis

2. **Repeat Discrepancy Ratio per Agent**
   - Agent modification frequency
   - Pattern detection
   - Performance scoring

3. **Top 3 Buyers Flagged by Multiple Agents**
   - Cross-agent validation
   - Risk concentration
   - Warning system

**Visualizations:**
- Bar charts
- Trend lines
- Heat maps
- Risk matrices

---

## ⚙️ Common UI & Components

### Navigation

**Desktop (Sidebar):**
- Dashboard
- Transactions
- Pending Approvals
- AI Reports
- Settings

**Mobile (Bottom Nav):**
- Home
- Weighment
- Bills
- Finance
- Profile

### Header Components

**Logo & Branding:**
- TRADIE v4.0 logo
- Version badge
- User role indicator

**Actions:**
- Dark/Light mode toggle
- AI Assistant bubble (Grok)
- User profile menu
- Notifications

**Breadcrumbs (Desktop only):**
```
Home > Buyer Database
Home > Weighment Authorization > Bill Detail
```

### Interactive Elements

**Icons:**
- ✔️ Approve (CheckCircle)
- 📝 Edit (Edit)
- 🕓 Pending (Clock)
- ⚠️ Flag (AlertTriangle)
- 🧠 AI Insight (Brain)
- 🔒 2FA Lock (Lock)
- 📄 Document (FileText)

**Buttons:**
- Primary: Gold gradient (#D4AF37)
- Secondary: Teal gradient (#009688)
- Outline: Border only
- Ghost: No background
- Icon-only: Square 40×40px

**Modals:**
- 2FA verification
- Change request
- AI detailed analysis
- Document preview

---

## 🪄 Figma Design Directives

### Auto-Layout Settings
- **Spacing:** 8pt grid system
- **Padding:** 16px content, 24px cards
- **Margins:** 8/16/24px increments
- **Corner Radius:** 12px standard

### Frame Organization
```
TRADIE v4.0
├── Buyer DB
│   ├── Mobile View (360×800)
│   └── Desktop View (1440×1024)
├── Weighment Auth
│   ├── Queue List
│   ├── Detail View
│   └── AI Insights
├── Bill Approval
│   ├── 2FA Modal
│   └── Confirmation
├── Finance
│   ├── Calculations
│   └── Payment Config
└── Audit
    ├── Ledger Table
    └── Analytics Dashboard
```

### Desktop Layout
- **3-column grid**
- **12 columns total**
- **24px gutters**
- **Max-width:** 1440px
- **Breakpoints:** 768px, 1024px, 1440px

### Mobile Layout
- **Single column**
- **Edge-to-edge cards**
- **16px side margins**
- **Bottom nav:** 64px height
- **Touch targets:** 48×48px minimum

---

## 🔗 Prototype Links

### Interactive Flow
```
Buyer DB → Click Record → Detail View
                              ↓
                         Edit/Approve
                              ↓
                         2FA Modal
                              ↓
                         Success → Ledger Update
                              ↓
                         Analytics Refresh
```

### Navigation Flow
```
Dashboard → Weighment Queue → Select Item
                                    ↓
                              Approve/Change
                                    ↓
                              2FA Verify
                                    ↓
                              Audit Log Entry
                                    ↓
                              AI Analysis Update
```

---

## 📊 AI-Powered Features

### Grok AI Assistant

**Capabilities:**
- Buyer risk analysis
- Payment predictions
- Compliance checks
- Pattern detection
- Anomaly alerts

**Interaction:**
- Floating chat bubble
- Contextual suggestions
- Real-time insights
- Natural language queries

### AI Verification System

**Verified Buyer (90%+ score):**
- Green badge
- High reliability
- Minimal oversight
- Fast approval

**Suspicious Buyer (50-70% score):**
- Red badge
- Pattern warnings
- Enhanced monitoring
- Manual review required

**New Entrant (baseline 50%):**
- Blue badge
- Learning phase
- Standard process
- Score builds over time

### Behavioral Pattern Detection

**Triggers:**
1. **Modification Frequency:** 3+ changes in 30 days
2. **Cross-Agent Flags:** Same buyer flagged by multiple agents
3. **Payment Delays:** Consistent late payments
4. **Discrepancy Patterns:** Same fields modified repeatedly

**Actions:**
- Auto-generate warnings
- Adjust reliability scores
- Notify regulatory panel
- Update analytics dashboard

---

## 🔐 Security Features

### 2FA/OTP System
- **Dual verification:** Buyer + Agent
- **6-digit codes**
- **5-minute expiry**
- **SMS/Email/WhatsApp**
- **Audit logged**

### Data Immutability
- **Authorized records:** Cannot be deleted
- **Amendment only:** With timestamp + justification
- **Blockchain anchor:** NFT verification
- **Complete history:** Version control

### Role-Based Access
- **Commission Agent:** Create, Edit, Approve
- **Buyer:** View, Request Changes, Approve
- **Auditor:** View All, Analytics, Compliance
- **Admin:** System Config, User Management

---

## 📱 Responsive Behavior

### Mobile (360×800)
- **Vertical scroll**
- **Card-based**
- **Bottom navigation**
- **Touch-optimized**
- **Swipe gestures**
- **Collapsible sections**

### Tablet (768×1024)
- **2-column grid**
- **Hybrid navigation**
- **Larger touch targets**
- **Side-by-side modals**

### Desktop (1440×1024)
- **3-column grid**
- **Left sidebar**
- **Table views**
- **Hover states**
- **Keyboard shortcuts**
- **Multi-window support**

---

## 🎯 Key Highlights

### Complete Implementation ✅
- 7 workflow screens fully functional
- Mobile + Desktop responsive
- AI insights throughout
- 2FA security integrated
- Country-specific payments
- Audit trail complete
- Dark mode support

### TRADIE Branding ✅
- Gold #D4AF37 primary
- Teal #009688 accents
- Ivory #FFFEF5 base
- 12px corner radius
- 8pt grid spacing
- Inter/Roboto fonts

### Advanced Features ✅
- AI pattern detection
- Grok assistant
- Real-time calculations
- Multi-brand support
- Dynamic packaging
- Commodity presets
- Due date intelligence

---

## 🚀 Getting Started

### Access the Prototype

1. **Launch Application**
2. **Welcome Screen** → Click **"⚡ TRADIE v4.0"** card
3. **Explore Workflows:**
   - Buyer Database
   - Weighment Authorization
   - Bill Approval
   - Finance Dashboard
   - Audit Logs
   - Analytics

### Quick Actions
- **Toggle Dark Mode:** Top-right moon/sun icon
- **Open AI Assistant:** Click chat bubble
- **Switch Screens:** Use sidebar (desktop) or bottom nav (mobile)
- **Export Data:** Click download buttons
- **2FA Approve:** Select weighment → Approve → Enter OTPs

---

## 📖 Documentation Structure

This comprehensive documentation covers:
- ✅ Design specifications
- ✅ 7 workflow implementations
- ✅ AI integration details
- ✅ Security features
- ✅ Responsive layouts
- ✅ Component library
- ✅ User flows
- ✅ Technical details

**Built with precision for professional commodity trading workflows.** 🎯
