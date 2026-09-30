# Role-Based Gating - Quick Start Guide

## 🚀 Launch the Dashboard

From the **TRADIE Welcome Screen**, click:

```
🔒 Role-Based Gating (Expert)
```

Or set mode directly:
```typescript
setMode('entity-rectification-role-gated');
```

---

## 🎭 Try Different Roles

### **Step 1: Select an Entity**

Click any entity in the left sidebar:
- **PSR & Co** (Partnership)
- **Ravindra & Sons** (Family Enterprise)
- **Kakatiya Traders Pvt. Ltd.** (Private Limited)

### **Step 2: Change Your Role**

Use the **"Acting As"** dropdown in the sidebar:

```
┌────────────────────────────────┐
│ Acting As (Role-based Gating)  │
│                                 │
│ [Managing Partner — Anita Rao ▼]│
│                                 │
│ Shareholding: 40% [Privileged] │
└────────────────────────────────┘
```

### **Step 3: Observe Gating**

Watch how buttons change based on your selected role!

---

## 🔒 Gating Scenarios to Test

### **Scenario 1: Privileged Role (Full Access)**

```
Acting As: Managing Partner (Anita Rao)
Share: 40%
Privileged: ✅ Yes

Expected:
✅ [Request Structural Change] → ENABLED
✅ [Propose & Authorize (OTP)] → ENABLED
✅ Appears in approver dropdowns
✅ Can bypass combined share threshold
```

**Try It:**
1. Select "Managing Partner" from dropdown
2. Click "Request Structural Change"
3. Modal opens with OTP form
4. See "Managing Partner" in both approver dropdowns

---

### **Scenario 2: High Share (No Privilege)**

```
Acting As: Partner (Vikram)
Share: 35%
Privileged: ❌ No

Expected:
✅ [Request Structural Change] → ENABLED (35% ≥ 10%)
✅ [Propose & Authorize (OTP)] → ENABLED
✅ Appears in approver dropdowns
✅ Combined share must be ≥20% with another approver
```

**Try It:**
1. Select "Partner (Vikram)" from dropdown
2. Click "Request Structural Change"
3. Modal opens (you can initiate)
4. Try selecting:
   - Approver 1: Vikram (35%)
   - Approver 2: Leela (25%)
   - **Result:** Submit button ENABLED (60% combined ≥ 20%)

---

### **Scenario 3: Low Share (Cannot Act)**

```
Acting As: Auditor
Share: 0%
Privileged: ❌ No

Expected:
❌ [Request Structural Change 🔒] → DISABLED
❌ [Propose & Authorize (OTP) 🔒] → DISABLED
❌ Does NOT appear in approver dropdowns
```

**Try It:**
1. Select "Auditor" from dropdown
2. **Observe:** 
   - "Request Structural Change" button shows lock icon 🔒
   - Hover over button → Tooltip: *"Requires privileged role or ≥10% share"*
3. Try to initiate → Button is disabled

---

### **Scenario 4: Privileged Role (0% Share)**

```
Acting As: Company Secretary (CS Sharma)
Share: 0%
Privileged: ✅ Yes

Expected:
✅ [Request Structural Change] → ENABLED (privileged bypasses share)
✅ [Propose & Authorize (OTP)] → ENABLED
✅ Appears in approver dropdowns with "(Privileged)" tag
✅ Can bypass combined share threshold
```

**Try It:**
1. Switch to entity: **Kakatiya Traders Pvt. Ltd.**
2. Select "Company Secretary (CS Sharma)" from dropdown
3. Observe: Even with 0% share, button is ENABLED
4. Click "Request Structural Change"
5. In approver dropdowns, see:
   - `Company Secretary — CS Sharma • 0% (Privileged)`

---

## ✅ Combined Share Validation

### **Test Case 1: Valid Combination**

```
Approver 1: Vikram (Partner, 35%)
Approver 2: Leela (Partner, 25%)
Combined: 60% ≥ 20% ✅

Result: [Verify & Record Change] → ENABLED
```

### **Test Case 2: Invalid Combination**

```
Approver 1: Member A (8%)
Approver 2: Member B (10%)
Combined: 18% < 20% ❌

Result: [Verify & Record Change] → DISABLED
Tooltip: "Need combined ≥20% unless a privileged approver is included"
```

### **Test Case 3: Privileged Saves the Day**

```
Approver 1: Director (45%, Privileged ✅)
Approver 2: Member C (5%)
Combined: 50% (but Director is privileged)

Result: [Verify & Record Change] → ENABLED (privileged bypass)
```

---

## 📊 Permissions Matrix (Profile Tab)

Click the **"Profile & Compliance"** tab to see the full permissions table:

| Role | Name | Share % | Effective Rights |
|------|------|---------|------------------|
| Managing Partner | Anita Rao | 40% | Initiate, Approve, Finalize [Privileged] |
| Partner | Vikram | 35% | Initiate, Approve |
| Partner | Leela | 25% | Initiate, Approve |
| Auditor | Ext. Auditor | 0% | *(none)* |

**What to Look For:**
- "Privileged" chip next to role name
- "Effective Rights" column shows what each role can do
- Footer explains gating policy thresholds

---

## 🧪 Full Workflow Test

### **Step-by-Step: Propose & Approve a Change**

1. **Select Entity:** PSR & Co
2. **Acting As:** Managing Partner (Anita Rao)
3. **Navigate to:** "Data Rectification Requests" tab
4. **Click:** "Propose & Authorize (OTP)"
5. **Fill OTP Modal:**
   - Description: "Update registered address to new Mumbai office"
   - Approver 1: Vikram (Partner, 35%)
   - Approver 2: Leela (Partner, 25%)
   - OTP 1: 123456
   - OTP 2: 654321
6. **Observe:**
   - Submit button is ENABLED (60% combined ≥ 20%)
7. **Click:** "Verify & Record Change"
8. **Result:**
   - Change #2 added to history
   - Change attempts: 2/3
   - New entry appears in "Authorized Changes" tab

---

## 🔍 What to Check

### **1. Lock Icons**

- ❌ When role lacks permission → Button shows 🔒
- ✅ Tooltip explains reason on hover

### **2. Dropdown Filtering**

- Only eligible approvers appear
- Shows share % and "(Privileged)" tag
- Auditor does NOT appear (has no OTP rights)

### **3. Real-Time Validation**

- Submit button enables/disables based on selection
- Combined share calculated instantly
- Tooltip updates based on validation state

### **4. Visual Feedback**

```
Acting as: Partner (Vikram) • Share: 35%

[✅ Propose & Authorize (OTP)] ← Button enabled
```

vs.

```
Acting as: Auditor • Share: 0%

[🔒 Propose & Authorize (OTP)] ← Button disabled
Hover: "Requires privileged role or ≥10% share"
```

---

## 🎯 Policy Reference

Quick reminder of the governance rules:

```typescript
POLICY = {
  minShareToInitiate: 10%        // OR privileged role
  minShareToApprove: 10%         // OR privileged role
  minCombinedApprovalShare: 20%  // OR one privileged
  minApprovers: 2                // Dual-OTP required
}

PRIVILEGED_ROLES = [
  "Managing Partner", "Director", "Karta",
  "Company Secretary", "CFO", "Trustee",
  "Secretary", "Chairman"
]
```

---

## 🐛 Common Issues

### **Issue 1: "Submit button is disabled"**

**Cause:** Combined approval share < 20%

**Solution:**
- Choose approvers with higher combined share
- OR choose at least one privileged role

### **Issue 2: "I can't see my role in approver dropdown"**

**Cause:** Role doesn't meet approval criteria

**Checks:**
- Does role have OTP enabled? (otp: true)
- Is share ≥ 10% OR privileged role?

### **Issue 3: "Lock icon but I have high share"**

**Cause:** Change limit reached (3/3)

**Solution:**
- Click "Initiate Re-KYC & Verification"
- Complete KYC process to reset limit

---

## 📱 Mobile Testing

The dashboard is fully responsive (360×800):

### **Mobile Layout**

- Sidebar collapses to vertical cards
- Tabs scroll horizontally
- Modals adapt to viewport
- Touch-friendly buttons

### **Test on Mobile**

1. Resize browser to 360px width
2. Test role selector (should stack vertically)
3. Test OTP modal (should be scrollable)
4. Test tabs (should scroll horizontally)

---

## 🎓 Learning Path

### **Beginner**

1. ✅ Launch dashboard
2. ✅ Try different roles with "Acting As"
3. ✅ Observe lock icons
4. ✅ Check permissions matrix

### **Intermediate**

1. ✅ Complete full workflow (propose change)
2. ✅ Test combined share validation
3. ✅ Switch between entities
4. ✅ Review audit history

### **Advanced**

1. ✅ Understand privileged role bypass logic
2. ✅ Test edge cases (0% share privileged roles)
3. ✅ Review code implementation
4. ✅ Integrate with backend API

---

## 🚀 Next Steps

### **For Developers**

1. **Read:** `/ROLE_BASED_GATING_DOCUMENTATION.md` (full technical docs)
2. **Review:** `/components/EntityRectificationDashboardRoleGated.tsx` (source code)
3. **Integrate:** Backend API for real OTP validation
4. **Deploy:** Production with database-driven policies

### **For Business Users**

1. **Test:** All entity types with different roles
2. **Document:** Your organization's specific governance rules
3. **Customize:** Thresholds for your entity type
4. **Train:** Team on gating behavior

### **For Compliance Officers**

1. **Verify:** Alignment with Companies Act / LLP Act
2. **Audit:** Change history and approval flows
3. **Review:** Privileged role list for your jurisdiction
4. **Approve:** For production deployment

---

## ✨ Pro Tips

### **Tip 1: Fast Role Switching**

Use keyboard to quickly switch roles:
1. Click role dropdown
2. Type first letter (e.g., "M" for Managing Partner)
3. Press Enter

### **Tip 2: Test All Combinations**

Systematic testing matrix:

| Entity | Role | Share | Expected Initiate | Expected Approve |
|--------|------|-------|-------------------|------------------|
| PSR & Co | Managing Partner | 40% | ✅ | ✅ |
| PSR & Co | Partner | 35% | ✅ | ✅ |
| PSR & Co | Auditor | 0% | ❌ | ❌ |
| Kakatiya | Director | 45% | ✅ | ✅ |
| Kakatiya | CS | 0% | ✅ | ✅ |
| Ravindra | Karta | 51% | ✅ | ✅ |

### **Tip 3: Watch the Counters**

Track change attempts:
- 1/3 → Green progress bar
- 2/3 → Yellow progress bar
- 3/3 → Red progress bar + KYC required

---

## 🎉 Success Indicators

You've mastered the system when you can:

✅ Explain why CS with 0% share can initiate changes  
✅ Calculate if two approvers meet the 20% threshold  
✅ Predict when the lock icon will appear  
✅ Know which roles are privileged  
✅ Understand the audit trail entries  

---

## 📞 Quick Access

**File:** `/components/EntityRectificationDashboardRoleGated.tsx`

**Mode:** `'entity-rectification-role-gated'`

**Welcome Card:** "🔒 Role-Based Gating (Expert)"

---

*Quick Start Guide v1.0*  
*Ready to test in 5 minutes!* ⚡
