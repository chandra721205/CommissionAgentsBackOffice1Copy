# Enhanced Business Entity Registration & Verification System - Figma Prompt

## Executive Requirements

**As a qualified CS/CA/Advocate:** Design an enhanced Business Entity Registration system with strict change controls, verification workflows, and multi-member approval for TRADIE v1.

### Core Principles:
1. **Registration Lock:** Entity registered ONCE → Locked → Categorized → Proceed
2. **Limited Changes:** Maximum 3 changes allowed post-registration
3. **Verification Mandatory:** Every change requires app-appointed verifier + KYC re-verification
4. **Multi-Member Approval:** Minimum 2-member OTP sharing (exception: Individual business)
5. **Proportionate Permissions:** Share-based and position-based permission allocation
6. **Security-First:** KYC re-verification for entity changes, audit trail for all modifications

---

## Figma Design Prompt

Generate an **aesthetic Business Entity Registration, Verification & Change Management Prototype** for TRADIE v1 (12 screens total: 8 existing + 4 new verification/change management screens). Mobile-first (375px), auto-layout (8px grid), TRADIE tokens (Gold #D4AF37 gradients/shimmer buttons, Green #27AE60 success, Red #E74C3C warnings, Blue #3498DB info; text/h1 32px bold Inter, spacing 8/16/24px, square radius 8px). Multi-lang toggles (EN/HI/TE). Voice mic on dropdowns.

---

## Additional 4 Screens (Beyond Existing 8)

### Screen 9: Registration Confirmation & Lock
**Purpose:** Confirm entity registration as FINAL and LOCKED with change counter initialization

**Header:**
- Title: "🔒 Registration Confirmation"
- Subtitle: "Once confirmed, entity details are locked. Changes limited to 3 times only."

**Components:**

**Summary Card (Gold Gradient Border):**
```
┌─────────────────────────────────────────┐
│ 📋 Entity Registration Summary          │
├─────────────────────────────────────────┤
│ Type: Partnership                       │
│ Scale: MSME (₹50-250Cr)                │
│ Name: PSR & CO Partnership              │
│ Brands: PSR Premium, PSR Organic (2)    │
│ Roles: 4 Assigned                       │
│ Status: ⏳ PENDING CONFIRMATION         │
└─────────────────────────────────────────┘
```

**Change Counter Badge:**
```
┌─────────────────────────────────────────┐
│ 🔄 Changes Remaining After Registration │
│                                         │
│        ┌───┐ ┌───┐ ┌───┐               │
│        │ 3 │ │ 3 │ │ 3 │               │
│        └───┘ └───┘ └───┘               │
│         MAX   USED  LEFT                │
└─────────────────────────────────────────┘
```

**Lock Warning (Red Gradient):**
```
⚠️ IMPORTANT NOTICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Registration is PERMANENT and LOCKED
✓ Entity details CANNOT be freely edited
✓ Only 3 changes allowed (lifetime limit)
✓ Each change requires:
  • App-appointed verifier approval
  • Complete KYC re-verification
  • Multi-member OTP (min 2 members)
  • 48-72 hour verification period
✓ Changes consume from limited quota
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Legal Acknowledgment (Checkbox):**
```
☐ I understand that registration is permanent
☐ I acknowledge the 3-change lifetime limit
☐ I agree to KYC re-verification for changes
☐ I authorize multi-member approval process
☐ I have reviewed all details for accuracy
```

**Actions (Gold Shimmer Square Buttons):**
```
┌──────────────┐  ┌──────────────────────┐
│ ← Back       │  │ 🔒 CONFIRM & LOCK    │
│ (Edit More)  │  │    REGISTRATION      │
└──────────────┘  │  (2-Member OTP Req)  │
                  └──────────────────────┘
```

**Flow:**
- Back → Return to Screen 8 for edits
- Confirm & Lock → Opens Multi-Member OTP Modal (2 members) → Navigate to Screen 10 (Success)

**Interactions:**
- All checkboxes must be checked to enable "Confirm & Lock" button
- Gold shimmer on hover for confirm button
- Red pulsing border animation on warning card

---

### Screen 10: Registration Success & Status
**Purpose:** Show successful registration with lock status and change quota

**Header:**
- Title: "✅ Registration Successful"
- Subtitle: "Entity locked and activated. Monitor your change quota carefully."

**Success Card (Green Gradient):**
```
┌─────────────────────────────────────────┐
│         ✅ REGISTRATION COMPLETE         │
│                                         │
│  🏢 PSR & CO Partnership                │
│  🔒 Status: LOCKED & ACTIVE             │
│  📅 Registered: 28-Oct-2025 10:30 AM    │
│  🆔 Entity ID: ENT-2025-001234          │
└─────────────────────────────────────────┘
```

**Change Quota Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🔄 Change Management Quota              │
├─────────────────────────────────────────┤
│ Total Allowed:     3 changes            │
│ Used:              0 changes            │
│ Remaining:         3 changes            │
│                                         │
│ [███████████████████████] 100%          │
│                                         │
│ ⏰ Last Change: Never                   │
│ 📝 Change History: Empty                │
└─────────────────────────────────────────┘
```

**Quick Stats (3 Cards):**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 👥 Roles    │ │ 🔐 Security │ │ 📊 Status   │
│             │ │             │ │             │
│     4       │ │  2-Member   │ │   ACTIVE    │
│  Assigned   │ │  OTP Req    │ │   & LIVE    │
└─────────────┘ └─────────────┘ └─────────────┘
```

**Next Steps Card (Blue Gradient):**
```
📘 What's Next?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✓ Entity is now active for operations
2. 👉 Configure business permissions (Screen 11)
3. 👉 Set share-based proportionate access
4. ⚠️ Changes require verification (48-72 hrs)
5. 💡 Use changes wisely - only 3 lifetime
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Warning Notice (Yellow Card):**
```
⚠️ CHANGE POLICY REMINDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 3 changes allowed (lifetime)
• Each change requires:
  ✓ App verifier appointment (₹5,000 fee)
  ✓ Complete KYC re-verification
  ✓ 2-member OTP approval
  ✓ 48-72 hour processing
• Zero changes = No fees, immediate operation
• Plan changes carefully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Actions:**
```
┌────────────────────────────────────────┐
│ → Proceed to Permissions Setup         │
│   (No Changes - Continue Operations)   │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🔄 Request Change (3/3 Remaining)      │
│   (Requires Verification)              │
└────────────────────────────────────────┘
```

**Flow:**
- Proceed to Permissions → Navigate to Screen 11 (Share-based Permissions)
- Request Change → Navigate to Screen 12 (Change Request & Verification)

---

### Screen 11: Share-Based Proportionate Permissions
**Purpose:** Allocate permissions proportionately based on shareholding and position

**Header:**
- Title: "⚖️ Proportionate Permission Allocation"
- Subtitle: "Permissions based on share % and position in entity"

**Entity Context Card:**
```
🏢 PSR & CO Partnership (MSME)
Partners: 2 Equal | Total: 100% Share
```

**Share-Based Permission Matrix:**

**Partner 1: Rajesh Kumar**
```
┌─────────────────────────────────────────┐
│ 👤 Partner 1: Rajesh Kumar              │
├─────────────────────────────────────────┤
│ Position:    Managing Partner           │
│ Share:       50% (Equal Partnership)    │
│ Stake:       High (Unlimited Liability) │
├─────────────────────────────────────────┤
│ 📊 Auto-Calculated Permissions:         │
│                                         │
│ ✅ View Access:        FULL (100%)      │
│ ✅ Suggest Rights:     YES              │
│ ✅ Edit/Rectify:       YES (with OTP)   │
│ ✅ Approve Changes:    YES (2FA)        │
│ ✅ Financial Access:   FULL (50% share) │
│ ✅ Multi-Approval Req: YES (Partner 2)  │
├─────────────────────────────────────────┤
│ 🔐 Authentication:                      │
│ • Individual OTP: Required              │
│ • Partner 2 OTP: Required (mutual)      │
│ • Biometric 2FA: Enabled                │
└─────────────────────────────────────────┘
```

**Partner 2: Priya Sharma**
```
┌─────────────────────────────────────────┐
│ 👤 Partner 2: Priya Sharma              │
├─────────────────────────────────────────┤
│ Position:    Partner                    │
│ Share:       50% (Equal Partnership)    │
│ Stake:       High (Unlimited Liability) │
├─────────────────────────────────────────┤
│ 📊 Auto-Calculated Permissions:         │
│                                         │
│ ✅ View Access:        FULL (100%)      │
│ ✅ Suggest Rights:     YES              │
│ ✅ Edit/Rectify:       YES (with OTP)   │
│ ✅ Approve Changes:    YES (2FA)        │
│ ✅ Financial Access:   FULL (50% share) │
│ ✅ Multi-Approval Req: YES (Partner 1)  │
├─────────────────────────────────────────┤
│ 🔐 Authentication:                      │
│ • Individual OTP: Required              │
│ • Partner 1 OTP: Required (mutual)      │
│ • Biometric 2FA: Enabled                │
└─────────────────────────────────────────┘
```

**Manager: Operations**
```
┌─────────────────────────────────────────┐
│ 👤 Manager: Suresh Rao                  │
├─────────────────────────────────────────┤
│ Position:    Manager (Ops)              │
│ Share:       0% (Employee)              │
│ Stake:       Low (Salary-based)         │
├─────────────────────────────────────────┤
│ 📊 Auto-Calculated Permissions:         │
│                                         │
│ ✅ View Access:        FULL (Ops Data)  │
│ ✅ Suggest Rights:     YES              │
│ ⚠️ Edit/Rectify:       LIMITED (Ops)    │
│ ❌ Approve Changes:    NO (Suggest only)│
│ ⚠️ Financial Access:   READ-ONLY        │
│ ✅ Multi-Approval Req: N/A              │
├─────────────────────────────────────────┤
│ 🔐 Authentication:                      │
│ • Individual OTP: Required for edits    │
│ • Partner Approval: Required for $      │
└─────────────────────────────────────────┘
```

**Staff: Salesman**
```
┌─────────────────────────────────────────┐
│ 👤 Staff: Ramesh (Salesman)             │
├─────────────────────────────────────────┤
│ Position:    Staff (Sales)              │
│ Share:       0% (Employee)              │
│ Stake:       None                       │
├─────────────────────────────────────────┤
│ 📊 Auto-Calculated Permissions:         │
│                                         │
│ ⚠️ View Access:        LIMITED (Bills)  │
│ ✅ Suggest Rights:     YES (Flag only)  │
│ ❌ Edit/Rectify:       NO               │
│ ❌ Approve Changes:    NO               │
│ ❌ Financial Access:   NONE             │
│ ❌ Multi-Approval Req: N/A              │
├─────────────────────────────────────────┤
│ 🔐 Authentication:                      │
│ • View-only access (No OTP needed)      │
└─────────────────────────────────────────┘
```

**Multi-Member Approval Matrix (Partnership Act 1932):**
```
┌─────────────────────────────────────────┐
│ 🔐 2-Member OTP Requirement Matrix      │
├─────────────────────────────────────────┤
│ Action Type          │ Approval Required │
├──────────────────────┼──────────────────┤
│ Financial Edit       │ Partner 1 + 2    │
│ Entity Change        │ Partner 1 + 2    │
│ Role Assignment      │ Partner 1 + 2    │
│ Share Modification   │ Partner 1 + 2    │
│ Contract Approval    │ Partner 1 + 2    │
│ Operational Change   │ Any 1 Partner    │
│ View/Suggest         │ Individual Only  │
└─────────────────────────────────────────┘
```

**Legal Justification (Blue Info Card):**
```
ℹ️ PARTNERSHIP ACT 1932 - EQUAL PARTNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Equal share (50-50) = Equal permissions
• Unlimited liability = Full mutual consent
• Major decisions require 2-member approval
• Financial transactions need dual OTP
• Proportionate to stake and liability
• Least privilege for staff (ISO 27001)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Exception Notice (Yellow Card):**
```
⚠️ EXCEPTION: INDIVIDUAL BUSINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Individual/Sole Proprietor entities:
• Single OTP only (owner)
• No multi-member approval required
• Full control with personal liability
• Staff: View-only (no approval rights)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**AI Grok Insight:**
```
🤖 AI GROK PROPORTIONATE ALLOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Permissions auto-calculated from share %
✓ 50% share = 50% financial access rights
✓ Position (Partner/Manager/Staff) determines
  approval hierarchy
✓ Multi-member OTP enforces mutual consent
✓ Staff excluded from financial/strategic
  decisions (fraud prevention)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Actions:**
```
┌────────────────────────────────────────┐
│ 💾 Save Proportionate Permissions      │
│    (Requires 2-Member OTP)             │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ → Proceed to Operations                │
│   (Permissions Locked Until Change)    │
└────────────────────────────────────────┘
```

**Flow:**
- Save Permissions → 2-Member OTP Modal → Save to database
- Proceed to Operations → Navigate to main dashboard (entity active)

**Proportionate Formula Display:**
```
📐 PERMISSION CALCULATION FORMULA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Permission_Level = f(Share%, Position, Stake)

Where:
• Share% = Ownership percentage
• Position = Partner/Director/Manager/Staff
• Stake = Liability level (Unlimited/Limited/None)

Examples:
• 50% Partner + Unlimited = FULL access
• 0% Manager + None = Ops-only access
• 0% Staff + None = View-only access
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Screen 12: Change Request & Verification Workflow
**Purpose:** Request entity changes with verification requirements

**Header:**
- Title: "🔄 Entity Change Request"
- Subtitle: "Changes require app verifier + KYC re-verification (48-72 hrs)"

**Change Quota Display (Large, Centered):**
```
┌─────────────────────────────────────────┐
│         🔄 CHANGE QUOTA STATUS          │
├─────────────────────────────────────────┤
│  Total Allowed:        3 changes        │
│  Used to Date:         0 changes        │
│  REMAINING:            3 changes        │
│                                         │
│  [████████████████████████████] 100%    │
│                                         │
│  ⚠️ Use wisely - Limited to 3 lifetime  │
└─────────────────────────────────────────┘
```

**Current Entity Summary:**
```
┌─────────────────────────────────────────┐
│ 📋 Current Registered Details           │
├─────────────────────────────────────────┤
│ Type:     Partnership                   │
│ Scale:    MSME (₹50-250Cr)             │
│ Name:     PSR & CO Partnership          │
│ Brands:   PSR Premium, PSR Organic      │
│ Roles:    4 (2 Partners, 1 Mgr, 1 Staff)│
│ Locked:   28-Oct-2025 10:30 AM          │
└─────────────────────────────────────────┘
```

**Change Request Form:**
```
┌─────────────────────────────────────────┐
│ 🔧 What would you like to change?       │
├─────────────────────────────────────────┤
│                                         │
│ ☐ Entity Type                           │
│ ☐ Scale Category                        │
│ ☐ Entity Name                           │
│ ☐ Brands/Trademarks                     │
│ ☐ Partner/Director Details              │
│ ☐ Share Distribution                    │
│ ☐ Registered Address                    │
│ ☐ Contact Information                   │
│                                         │
│ 📝 Reason for Change (Required):        │
│ ┌─────────────────────────────────────┐ │
│ │ [Voice mic] Enter detailed reason   │ │
│ │ (Min 50 characters)                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 📎 Supporting Documents:                │
│ ┌─────────────────────────────────────┐ │
│ │ + Upload partnership deed amendment │ │
│ │ + Upload board resolution           │ │
│ │ + Upload registration certificate   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Verification Requirements (Red Warning):**
```
⚠️ MANDATORY VERIFICATION PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This change will trigger:

1. 👨‍⚖️ APP-APPOINTED VERIFIER
   • Independent professional appointed by app
   • Reviews documents & legitimacy
   • Fee: ₹5,000 (non-refundable)
   • Timeline: 24 hours for appointment

2. 🆔 COMPLETE KYC RE-VERIFICATION
   • All partners/directors re-submit:
     ✓ Aadhaar + PAN verification
     ✓ Address proof (latest)
     ✓ Bank statements (3 months)
     ✓ Business registration docs
   • Timeline: 48-72 hours processing

3. 🔐 MULTI-MEMBER OTP APPROVAL
   • Minimum 2 members must approve
   • Simultaneous OTP sharing required
   • All partners/directors must consent
   • Timeline: Immediate (when members ready)

4. 📊 AUDIT TRAIL UPDATE
   • Change logged permanently
   • Visible to regulators/auditors
   • Quota decremented (3→2→1→0)
   • Cannot be reversed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PROCESSING TIME: 3-4 BUSINESS DAYS
VERIFICATION FEE: ₹5,000 + Govt Fees (if any)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Cost Breakdown (Yellow Card):**
```
💰 ESTIMATED COSTS FOR THIS CHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App Verifier Fee:           ₹5,000
KYC Re-verification:        ₹2,000
Document Processing:        ₹1,000
Government Fees (if any):   ₹0-5,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ESTIMATED:            ₹8,000-13,000
Processing Time:            3-4 business days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Alternative: Proceed Without Changes (Green Card):**
```
✅ NO CHANGES NEEDED?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If current details are accurate:
• Zero verification fees
• Zero processing time
• All 3 changes preserved for future
• Immediate business operations
• Recommended if details are correct
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-Member Consent Section:**
```
┌─────────────────────────────────────────┐
│ 🔐 Multi-Member Approval Required       │
├─────────────────────────────────────────┤
│ ✓ Partner 1: Rajesh Kumar (50%)         │
│   Status: ⏳ Pending Consent             │
│                                         │
│ ✓ Partner 2: Priya Sharma (50%)         │
│   Status: ⏳ Pending Consent             │
├─────────────────────────────────────────┤
│ Both partners must approve to proceed   │
│ Simultaneous OTP sharing will be reqd.  │
└─────────────────────────────────────────┘
```

**Legal Acknowledgment:**
```
☐ I understand this consumes 1 of 3 changes
☐ I acknowledge ₹5,000 verifier fee
☐ I agree to complete KYC re-verification
☐ All members consent to this change
☐ I accept 3-4 day processing timeline
```

**Actions:**
```
┌────────────────────────────────────────┐
│ ← Cancel (Preserve Changes)            │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ✅ Proceed Without Changes (FREE)      │
│    (Recommended if details accurate)   │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🔄 Submit Change Request               │
│    (2-Member OTP + ₹5,000 Fee)         │
└────────────────────────────────────────┘
```

**Flow:**
- Cancel → Return to Screen 11
- Proceed Without Changes → Navigate to main dashboard
- Submit Change Request → Multi-member OTP modal (2 members) → Payment gateway (₹5,000) → Navigate to Screen 13 (Verification Status)

**Real-time Validation:**
- Reason must be minimum 50 characters
- At least 1 change checkbox must be selected
- All supporting documents must be uploaded
- All acknowledgment checkboxes must be checked
- Both members must consent before submission

**Example Scenarios:**

**Scenario 1: Name Change**
```
Change: PSR & CO → PSR & Associates
Reason: Rebranding after expansion to 3 states
Documents: Partnership deed amendment, Trademark cert
Cost: ₹5,000 + ₹2,000 + ₹1,000 = ₹8,000
Timeline: 3 days
Quota After: 2/3 remaining
```

**Scenario 2: Scale Change**
```
Change: MSME → Medium (turnover crossed ₹250Cr)
Reason: Business growth - now ₹280Cr annual turnover
Documents: Audited financials, ROC filing, Bank stmt
Cost: ₹5,000 + ₹2,000 + ₹1,000 = ₹8,000
Timeline: 4 days (extra for financial verification)
Quota After: 2/3 remaining
```

**Scenario 3: Partner Addition**
```
Change: 2 partners → 3 partners (new 16.67% each)
Reason: Strategic investor joining partnership
Documents: New partnership deed, KYC of new partner
Cost: ₹5,000 + ₹3,000 (3 KYCs) + ₹1,000 = ₹9,000
Timeline: 4 days (new member verification)
Quota After: 2/3 remaining
```

---

### Screen 13: Verification Status & Timeline
**Purpose:** Track verification progress in real-time

**Header:**
- Title: "⏳ Verification in Progress"
- Subtitle: "Change Request #CHG-2025-001234 | Est. Completion: 31-Oct-2025"

**Timeline Tracker (Vertical Progress):**
```
┌─────────────────────────────────────────┐
│ 📅 VERIFICATION TIMELINE                │
├─────────────────────────────────────────┤
│                                         │
│  ✅ STEP 1: Request Submitted           │
│  │  28-Oct-2025 02:30 PM               │
│  │  2-Member OTP: Verified ✓           │
│  │  Payment: ₹5,000 Received ✓         │
│  └─────────────────────────────────────│
│                                         │
│  🔄 STEP 2: Verifier Appointment (24h)  │
│  │  Status: ⏳ IN PROGRESS              │
│  │  Assigned: Adv. Suresh Reddy         │
│  │  Credentials: CS, 15 yrs exp         │
│  │  Contact: +91 XXXXX XX456            │
│  │  Est. Start: 29-Oct-2025 10:00 AM   │
│  └─────────────────────────────────────│
│                                         │
│  ⏳ STEP 3: KYC Re-Verification (48h)   │
│  │  Status: ⏳ PENDING                  │
│  │  Partners: Upload docs pending       │
│  │  Required: Aadhaar, PAN, Bank stmt  │
│  │  Deadline: 30-Oct-2025 05:00 PM     │
│  └─────────────────────────────────────│
│                                         │
│  ⏳ STEP 4: Document Review (12h)       │
│  │  Status: ⏳ QUEUED                   │
│  │  Reviewer: App verification team     │
│  │  Est. Start: 30-Oct-2025 06:00 PM   │
│  └─────────────────────────────────────│
│                                         │
│  ⏳ STEP 5: Final Approval (6h)         │
│  │  Status: ⏳ QUEUED                   │
│  │  Approver: System + Partners         │
│  │  Est. Complete: 31-Oct-2025 12:00PM │
│  └─────────────────────────────────────│
│                                         │
│  ⬜ STEP 6: Entity Update               │
│     Status: ⏳ PENDING                  │
│     Auto-update on approval             │
│                                         │
└─────────────────────────────────────────┘
```

**Change Details:**
```
┌─────────────────────────────────────────┐
│ 📝 Requested Changes                    │
├─────────────────────────────────────────┤
│ Field:        Entity Name               │
│ Current:      PSR & CO Partnership      │
│ Requested:    PSR & Associates          │
│                                         │
│ Reason:       Rebranding after expansion│
│               to 3 states (AP, TS, KA)  │
│                                         │
│ Documents:    ✅ 3 files uploaded       │
│               • Partnership_Deed.pdf    │
│               • Trademark_Cert.pdf      │
│               • Board_Resolution.pdf    │
└─────────────────────────────────────────┘
```

**Verifier Profile:**
```
┌─────────────────────────────────────────┐
│ 👨‍⚖️ Appointed Verifier                  │
├─────────────────────────────────────────┤
│ Name:         Adv. Suresh Reddy         │
│ Qualification: Company Secretary (CS)   │
│ Experience:   15 years corporate law    │
│ Rating:       ⭐⭐⭐⭐⭐ (4.9/5.0)         │
│ Verified:     2,456 entities            │
│ Success Rate: 98.7%                     │
│                                         │
│ Contact:      +91 98765 43210           │
│ Email:        suresh.reddy@verify.in    │
│ Office:       Hyderabad, Telangana      │
│                                         │
│ Status:       ✅ Accepted Assignment    │
│ Start Date:   29-Oct-2025 10:00 AM      │
└─────────────────────────────────────────┘
```

**KYC Upload Section:**
```
┌─────────────────────────────────────────┐
│ 🆔 KYC Re-Verification Required         │
├─────────────────────────────────────────┤
│                                         │
│ 👤 Partner 1: Rajesh Kumar              │
│    ✅ Aadhaar: Verified                 │
│    ✅ PAN: Verified                     │
│    ⏳ Bank Statement: Pending upload    │
│    ⏳ Address Proof: Pending upload     │
│                                         │
│ 👤 Partner 2: Priya Sharma              │
│    ⏳ Aadhaar: Pending verification     │
│    ⏳ PAN: Pending verification         │
│    ⏳ Bank Statement: Pending upload    │
│    ⏳ Address Proof: Pending upload     │
│                                         │
│ 📤 [Upload Documents] for Partner 2     │
│                                         │
│ ⚠️ All KYC must complete by 30-Oct 5PM │
└─────────────────────────────────────────┘
```

**Real-time Notifications:**
```
┌─────────────────────────────────────────┐
│ 🔔 Recent Updates                       │
├─────────────────────────────────────────┤
│ 10 mins ago:                            │
│ ✅ Verifier Adv. Suresh Reddy assigned  │
│                                         │
│ 25 mins ago:                            │
│ ✅ Payment of ₹5,000 confirmed          │
│                                         │
│ 35 mins ago:                            │
│ ✅ Partner 2 OTP verified successfully  │
│                                         │
│ 40 mins ago:                            │
│ ✅ Partner 1 OTP verified successfully  │
│                                         │
│ 45 mins ago:                            │
│ ℹ️ Change request submitted for review  │
└─────────────────────────────────────────┘
```

**Quota Status:**
```
┌─────────────────────────────────────────┐
│ 🔄 Change Quota Update                  │
├─────────────────────────────────────────┤
│ Before Request:   3/3 (100%)            │
│ In Progress:      1 change pending      │
│ After Approval:   2/3 (66.7%)           │
│                                         │
│ [████████████████░░░░░░░░] 66.7%        │
│                                         │
│ ⚠️ If approved, 2 changes will remain   │
└─────────────────────────────────────────┘
```

**Actions:**
```
┌────────────────────────────────────────┐
│ 📤 Upload Pending KYC Documents        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 💬 Contact Verifier (Chat/Call)        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🔔 Enable SMS/Email Notifications      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ❌ Withdraw Change Request             │
│    (Refund ₹5,000 - ₹500 processing)  │
└────────────────────────────────────────┘
```

**Status Indicators:**
- ✅ Green checkmark = Completed
- 🔄 Blue spinner = In Progress
- ⏳ Orange clock = Pending/Queued
- ⬜ Gray box = Not Started
- ❌ Red cross = Failed/Rejected

**Auto-refresh:** Page auto-refreshes every 30 seconds to show real-time status

**SMS/Email Notifications Sent:**
- Verifier assignment confirmation
- KYC upload reminders (24h, 12h, 6h before deadline)
- Document review started
- Approval/rejection notification
- Final entity update confirmation

**Withdrawal Policy:**
- Can withdraw anytime before "Final Approval" step
- Refund: ₹5,000 - ₹500 processing fee = ₹4,500
- Change quota restored (3/3 again)
- KYC uploads deleted for privacy

---

## Design Specifications (All 4 New Screens)

### Color Palette:
- **Gold Primary:** #D4AF37 (buttons, accents, headers)
- **Gold Secondary:** #C19A2E (gradients, hovers)
- **Success Green:** #27AE60 (completed steps, approvals)
- **Warning Yellow:** #F39C12 (pending, cautions)
- **Error Red:** #E74C3C (warnings, rejections)
- **Info Blue:** #3498DB (information cards, insights)
- **Background Ivory:** #F7FAFC
- **Gradient Header:** #F7FAFC → #D9F2FF

### Typography:
- **Font:** Inter (system fallback)
- **H1:** 32px bold (screen titles)
- **H2:** 24px bold (section headers)
- **H3:** 20px semibold (card titles)
- **Body:** 16px normal
- **Small:** 14px normal
- **Tiny:** 12px normal

### Spacing:
- **Grid:** 8px base unit
- **Card Padding:** 16px
- **Section Gap:** 24px
- **Button Height:** 48px (large), 40px (medium)

### Components:

**Square Buttons:**
- Border-radius: 8px
- Primary: Gold gradient bg (#D4AF37 → #C19A2E), white text
- Secondary: White bg, gold border (2px), gold text
- Disabled: 50% opacity, no hover
- Hover: Shimmer animation (150ms), shadow-lg, scale 1.02

**Cards:**
- Border: 2px solid #D4AF37/20
- Border-radius: 8px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Hover: Border-color #D4AF37, shadow-xl

**Badges:**
- Border-radius: 4px
- Padding: 4px 12px
- Success: Green bg, white text
- Warning: Yellow bg, dark text
- Error: Red bg, white text
- Info: Blue bg, white text

**Progress Bars:**
- Height: 12px
- Border-radius: 6px
- Background: #E0E0E0
- Fill: Gold gradient (#D4AF37 → #C19A2E)
- Animation: Smooth transition 300ms

**Timeline (Vertical):**
- Left line: 4px solid #D4AF37/30
- Active step: Green checkmark (24px)
- In-progress: Blue spinner (24px, rotating)
- Pending: Orange clock (24px)
- Spacing between steps: 32px

### Animations:

**Button Shimmer:**
```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
Duration: 1.5s infinite
```

**Timeline Step Pulse:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
Duration: 2s infinite (only on active/in-progress)
```

**Modal Slide-Up:**
```css
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 300ms ease-out
```

**Progress Fill:**
```css
transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Multi-Member OTP Modal:

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🔐 Multi-Member OTP Verification        │
├─────────────────────────────────────────┤
│                                         │
│ Partner 1: Rajesh Kumar                 │
│ ┌───────────────────────────────┐       │
│ │ [_] [_] [_] [_] [_] [_]       │       │
│ └───────────────────────────────┘       │
│ Status: ⏳ Waiting for OTP               │
│                                         │
│ Partner 2: Priya Sharma                 │
│ ┌───────────────────────────────┐       │
│ │ [_] [_] [_] [_] [_] [_]       │       │
│ └───────────────────────────────┘       │
│ Status: ⏳ Waiting for OTP               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ ℹ️ Both OTPs must be entered            │
│    simultaneously for approval          │
│                                         │
│ OTP sent to:                            │
│ • +91 98765 43210 (Rajesh)              │
│ • +91 98765 43211 (Priya)               │
│                                         │
│ ⏰ Expires in: 04:45                    │
│                                         │
│ ┌──────────────┐  ┌──────────────────┐ │
│ │ Resend OTPs  │  │ ✓ Verify Both    │ │
│ └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────┘
```

**Shimmer Effect on OTP Slots:**
- Empty: Border #D4AF37/30
- Filled: Border #D4AF37, gold shimmer background
- Complete (6 digits): Green checkmark next to name

**Simultaneous Verification Logic:**
- Both OTPs must be entered
- Both must be verified together (single verify button)
- If one fails, both must re-enter
- 3 attempts max (then 15-min lockout)

### Voice Input:

**Mic Button:**
- Icon: Lucide `<Mic />` (20px)
- Position: Right side of text inputs
- Idle: Gold icon, 50% opacity
- Listening: Red icon, pulsing animation
- Success: Green checkmark (1s), then reset

**Languages:**
- EN: en-IN (English - India)
- HI: hi-IN (Hindi - India)
- TE: te-IN (Telugu - India)

**Visual Feedback:**
- Toast: "🎤 Listening..." (blue)
- Toast: "✅ Voice captured!" (green, 2s)
- Toast: "❌ Voice input failed" (red, 2s)

### Responsive Design:

**Mobile-First (375px):**
- Single column layout
- Full-width cards
- Stacked buttons
- Collapsible sections for long content

**Tablet (768px):**
- Two-column grid where appropriate
- Side-by-side buttons
- Wider cards

**Desktop (1024px+):**
- Three-column grid for stats
- Horizontal timeline option
- Larger modals (max-width: 600px)

---

## Interactions & User Flows

### Flow 1: Register → Lock → Operate (No Changes)
```
Screen 1-8 (Existing) → Screen 9 (Confirm Lock)
→ 2-Member OTP → Screen 10 (Success)
→ Screen 11 (Share Permissions) → 2-Member OTP
→ Main Dashboard (Active, 3/3 changes preserved)
```
**Time:** 10-15 minutes  
**Cost:** ₹0  
**Outcome:** Immediate operations, all changes available

### Flow 2: Register → Lock → Request Change → Verify
```
Screen 1-8 → Screen 9 → Screen 10 (Success)
→ Screen 12 (Request Change) → Fill form
→ Upload docs → 2-Member OTP → Pay ₹5,000
→ Screen 13 (Verification) → Upload KYC
→ Verifier reviews (48-72h) → Approval
→ Entity updated → Quota: 2/3 remaining
```
**Time:** 3-4 business days  
**Cost:** ₹5,000 + KYC (₹2,000) = ₹7,000-13,000  
**Outcome:** Change approved, 2 changes left

### Flow 3: Individual Business (Exception)
```
Screen 1-8 → Screen 9 → Single OTP (Owner only)
→ Screen 10 → Screen 11 (Owner: Full permissions, Staff: View-only)
→ Single OTP → Dashboard
```
**Time:** 5-10 minutes  
**Cost:** ₹0  
**Outcome:** Owner full control, no multi-member requirement

### Flow 4: Withdraw Change Request
```
Screen 13 (Verification) → Withdraw button
→ Confirm withdrawal → Refund ₹4,500 (₹500 processing fee)
→ Quota restored to 3/3 → Screen 10
```
**Time:** 1-2 business days (refund)  
**Cost:** -₹500 (processing fee retained)  
**Outcome:** Change cancelled, quota restored

---

## Legal & Compliance

### Legal Basis for 3-Change Limit:
- **Companies Act 2013:** Major entity changes require ROC approval
- **Partnership Act 1932:** Partnership deed amendments need registrar filing
- **Co-operative Act:** Bye-law changes need registrar approval
- **Trust Act 1882:** Trust deed amendments require court/settlement approval
- **MSME Act:** Scale changes need MSME portal update
- **Fraud Prevention:** Limits frequent changes to prevent shell company abuse

### Multi-Member Approval Justification:
- **Partnership Act 1932 Sec 18:** Major acts need all partner consent
- **Companies Act 2013 Sec 179:** Board resolutions need quorum
- **Co-operative Act:** Democratic decisions need member voting
- **ISO 27001:** Least privilege + dual control for high-risk actions
- **Fraud Prevention:** Prevents single-member unauthorized changes

### KYC Re-verification Rationale:
- **PMLA (Prevention of Money Laundering Act):** KYC for entity changes
- **IT Act:** Digital verification for online entities
- **Companies Act Sec 12:** Director KYC for directorship changes
- **GDPR Art 32:** Security measures for data changes
- **ISO 27001 A.9.2.1:** User access provisioning on role changes

### Verifier Appointment:
- **Companies Act:** Chartered Accountant verification for audits
- **ICAI/ICSI Standards:** Professional verification for compliance
- **MSME Act:** Expert verification for scale categorization
- **Fraud Prevention:** Independent third-party reduces collusion risk

---

## AI Grok Insights (Contextual)

**Screen 9 (Registration Lock):**
```
🤖 AI Grok: "Partnership entities with equal partners
require mutual consent for all major decisions. The
3-change limit ensures stability and prevents frequent
restructuring that could harm creditors. Plan carefully!"
```

**Screen 11 (Share Permissions):**
```
🤖 AI Grok: "50% partnership = equal permissions per
Partnership Act 1932. Both partners have unlimited
liability, so both must approve financial decisions.
ISO 27001 enforces least privilege for staff (view-only)."
```

**Screen 12 (Change Request):**
```
🤖 AI Grok: "Name change requires partnership deed
amendment + registrar filing. Budget ₹8,000-10,000 and
3-4 days. If rebranding, also update GST, bank accounts,
contracts. Alternative: Use DBA (Doing Business As) to
avoid quota consumption."
```

**Screen 13 (Verification):**
```
🤖 AI Grok: "Verifier Adv. Suresh Reddy has 98.7% approval
rate (2,456 entities verified). KYC deadline is critical -
missing it will delay 24 hours. Upload bank statements
(last 3 months) and latest address proof to expedite."
```

---

## Mock Data Examples

### Example 1: Partnership (50-50)
```javascript
{
  entityType: 'Partnership',
  scale: 'MSME',
  name: 'PSR & CO Partnership',
  partners: [
    { name: 'Rajesh Kumar', share: 50, position: 'Managing Partner' },
    { name: 'Priya Sharma', share: 50, position: 'Partner' }
  ],
  staff: [
    { name: 'Suresh Rao', role: 'Manager (Ops)', share: 0 },
    { name: 'Ramesh', role: 'Salesman', share: 0 }
  ],
  changeQuota: { total: 3, used: 0, remaining: 3 },
  permissions: {
    rajeshKumar: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: true },
    priyaSharma: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: true },
    sureshRao: { view: 'OPS', suggest: true, edit: 'LIMITED', approve: false, multiOTP: false },
    ramesh: { view: 'BILLS', suggest: true, edit: false, approve: false, multiOTP: false }
  }
}
```

### Example 2: Private Company (Board)
```javascript
{
  entityType: 'Private Company',
  scale: 'Large',
  name: 'Kakatiya Traders Pvt Ltd',
  directors: [
    { name: 'Venkat Rao', share: 40, position: 'Managing Director' },
    { name: 'Lakshmi Devi', share: 30, position: 'Director' },
    { name: 'Anand Kumar', share: 20, position: 'Director' },
    { name: 'Radha Reddy', share: 10, position: 'Director' }
  ],
  cs: { name: 'Sudhir Menon', position: 'Company Secretary' },
  changeQuota: { total: 3, used: 1, remaining: 2 },
  permissions: {
    venkatRao: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: true, quorum: '3/4' },
    lakshmiDevi: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: true, quorum: '3/4' },
    anandKumar: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: true, quorum: '3/4' },
    radhaReddy: { view: 'FULL', suggest: true, edit: false, approve: true, multiOTP: true, quorum: '3/4' },
    sudhirMenon: { view: 'FULL', suggest: true, edit: 'COMPLIANCE', approve: false, multiOTP: false }
  }
}
```

### Example 3: Individual (Exception)
```javascript
{
  entityType: 'Individual',
  scale: 'Small',
  name: 'Sole Trader PSR',
  owner: { name: 'Prakash Reddy', share: 100, position: 'Sole Proprietor' },
  staff: [
    { name: 'Worker 1', role: 'Laborer', share: 0 }
  ],
  changeQuota: { total: 3, used: 0, remaining: 3 },
  permissions: {
    prakashReddy: { view: 'FULL', suggest: true, edit: true, approve: true, multiOTP: false }, // Exception!
    worker1: { view: 'LIMITED', suggest: true, edit: false, approve: false, multiOTP: false }
  }
}
```

---

## Component List (New Screens)

**Screen 9:**
- RegistrationConfirmCard
- ChangeQuotaBadge
- LockWarningCard
- LegalAcknowledgmentCheckboxGroup
- MultiMemberOTPModal
- ConfirmLockButton (gold shimmer)

**Screen 10:**
- SuccessCard (green gradient)
- ChangeQuotaDashboard
- QuickStatsGrid
- NextStepsCard
- ChangePolicyWarning
- ProceedButton
- RequestChangeButton

**Screen 11:**
- ShareBasedPermissionCard (per member)
- PermissionMatrixTable
- MultiMemberApprovalMatrix
- LegalJustificationCard
- ExceptionNoticeCard
- AIGrokProportionateInsight
- ProportionateFormulaDisplay
- SavePermissionsButton (2-member OTP)

**Screen 12:**
- ChangeQuotaStatusCard (large, centered)
- CurrentEntitySummaryCard
- ChangeRequestForm (checkboxes + textarea + file upload)
- VerificationRequirementsWarning
- CostBreakdownCard
- ProceedWithoutChangesCard
- MultiMemberConsentSection
- LegalAcknowledgmentCheckboxes
- SubmitChangeRequestButton (2-member OTP)

**Screen 13:**
- TimelineTrackerVertical (6 steps)
- ChangeDetailsCard
- VerifierProfileCard
- KYCUploadSection
- RealtimeNotificationsCard
- QuotaStatusUpdateCard
- UploadKYCButton
- ContactVerifierButton
- EnableNotificationsButton
- WithdrawRequestButton

**Shared Components:**
- MultiMemberOTPModal (used in Screens 9, 11, 12)
- VoiceInputButton (mic icon)
- LanguageToggle (globe icon)
- ProgressBar (quota visualization)
- StatusBadge (success/warning/error/info)
- ToastNotification (sonner)

---

## Success Criteria

✅ **Registration Lock:** Entity details locked after confirmation  
✅ **Change Quota:** 3-change limit enforced and tracked  
✅ **Verification Flow:** App verifier + KYC mandatory for changes  
✅ **Multi-Member OTP:** 2+ member approval for all entity changes  
✅ **Individual Exception:** Single OTP for sole proprietors  
✅ **Proportionate Permissions:** Auto-calculated from share % and position  
✅ **Real-time Tracking:** Verification status visible with timeline  
✅ **Cost Transparency:** ₹5,000 fee + KYC costs clearly shown  
✅ **Audit Trail:** All changes logged with quota decrements  
✅ **Security:** KYC re-verification enforced for compliance  

---

## Technical Notes

**State Management:**
```typescript
const [changeQuota, setChangeQuota] = useState({ total: 3, used: 0, remaining: 3 });
const [isLocked, setIsLocked] = useState(false);
const [verificationStatus, setVerificationStatus] = useState('PENDING');
const [multiMemberOTPs, setMultiMemberOTPs] = useState({});
```

**APIs Required:**
- `POST /api/entities/lock` - Lock entity after registration
- `POST /api/entities/change-request` - Submit change request
- `POST /api/verification/assign-verifier` - Assign app verifier
- `POST /api/verification/kyc-upload` - Upload KYC documents
- `GET /api/verification/status/:requestId` - Get verification status
- `POST /api/verification/withdraw` - Withdraw change request
- `POST /api/auth/multi-member-otp` - Verify multiple OTPs simultaneously

**Database Fields:**
```sql
ALTER TABLE business_entities ADD COLUMN:
- is_locked BOOLEAN DEFAULT FALSE
- change_quota_total INTEGER DEFAULT 3
- change_quota_used INTEGER DEFAULT 0
- change_quota_remaining INTEGER DEFAULT 3
- locked_at TIMESTAMP
- last_change_at TIMESTAMP
```

**Validation Rules:**
- Change request reason: Min 50 characters
- Supporting documents: Min 1 file required
- KYC uploads: All partners must complete
- Multi-member OTP: All must verify simultaneously
- Change quota: Must have remaining > 0
- Locked status: Cannot edit if locked without change request

---

**END OF FIGMA PROMPT**

---

**Summary:** This prompt extends the existing 8-screen prototype with 4 additional screens for registration lock, change management (max 3 lifetime), app verifier appointment, KYC re-verification, and multi-member OTP approval. All permissions are proportionate to share % and position. Individual businesses are exempted from multi-member approval. The design maintains TRADIE's gold gradient aesthetic with square shimmer buttons, voice input, and multi-language support.
