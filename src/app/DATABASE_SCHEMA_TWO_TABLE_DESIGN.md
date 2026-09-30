# 🗄️ Two-Table Database Design - Producer Ledger & Staff Management

## 📋 Overview

This document describes the **normalized two-table architecture** that separates customer transaction data (Producer Ledger) from internal staff operations (Staff Management).

**Design Principle**: **Producers are customers**. Internal staff role assignments belong in a separate, commission-agent-controlled module.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRADIE DATABASE ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│    PRODUCER_LEDGER TABLE     │    │    STAFF_ROLES TABLE         │
│    (Customer Transactions)   │    │    (Internal Operations)     │
├──────────────────────────────┤    ├──────────────────────────────┤
│ • ProducerID (PK)            │    │ • StaffID (PK)               │
│ • ProducerName               │    │ • StaffName                  │
│ • VillagePlace               │    │ • AssignedRoles (Array)      │
│ • Date                       │    │ • Permissions (Array)        │
│ • TransactionType            │    │ • AssociatedVillage          │
│ • CreditAmount               │    │ • ActiveStatus               │
│ • DebitAmount                │    │ • Notes                      │
│ • Purpose                    │    │ • ContactNumber              │
│ • BalanceAfter               │    │ • JoinDate                   │
│ • RiskRanking                │    │ • LastModified               │
│ • OTPStatus                  │    │ • ModifiedBy                 │
│ • AuthorizedBy               │    └──────────────────────────────┘
│ • RoleNotes (context)        │              ↑
│ • AIAlertFlag                │              │
│ • RecordCreatedBy            │              │ Optional Link
│ • RecordAccessPerm           │              │ (for audit)
│ • AIInsights                 │              │
│ • Chronology                 │    ┌─────────┴──────────┐
└──────────────────────────────┘    │ STAFF_ASSIGNMENTS  │
         ↓                          │ (Optional Bridge)  │
    Customer View                   │ • TransactionID    │
    (Public Ledger)                 │ • StaffID          │
                                    │ • AssignmentDate   │
                                    └────────────────────┘
                                         Internal View
                                         (Agent Only)
```

---

## 📊 Table 1: PRODUCER_LEDGER (Customer Transactions)

### Purpose
Track all financial transactions with producers (customers), including credits, debits, sales, and expenses.

### Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **ProducerID** | VARCHAR(50) | NOT NULL | Producer identifier |
| **ProducerName** | VARCHAR(100) | NOT NULL | Producer full name |
| **VillagePlace** | VARCHAR(100) | NOT NULL | Village/location |
| **Date** | TIMESTAMP | NOT NULL | Transaction date |
| **TransactionType** | ENUM | NOT NULL | Credit, Debit, Sale, Expense |
| **CreditAmount** | DECIMAL(12,2) | NULL | Amount credited to producer |
| **DebitAmount** | DECIMAL(12,2) | NULL | Amount debited from producer |
| **Purpose** | VARCHAR(200) | NOT NULL | Transaction description |
| **BalanceAfter** | DECIMAL(12,2) | NOT NULL | Balance after transaction |
| **RiskRanking** | ENUM | NOT NULL | Low, Medium, High, Critical |
| **OTPStatus** | ENUM | NOT NULL | Confirmed, Pending, Closed, N/A |
| **AuthorizedBy** | VARCHAR(100) | NOT NULL | Who approved transaction |
| **RoleNotes** | VARCHAR(200) | NULL | Transaction context notes |
| **AIAlertFlag** | BOOLEAN | DEFAULT FALSE | AI risk flag |
| **RecordCreatedBy** | VARCHAR(100) | NOT NULL | Who created record |
| **RecordAccessPerm** | ENUM | NOT NULL | AgentOnly, MarketOnly, etc. |
| **AIInsights** | TEXT | NULL | AI-generated insights |
| **Chronology** | INTEGER | NOT NULL, UNIQUE | Immutable sequence number |

### Primary Key
```sql
PRIMARY KEY (ProducerID, Chronology)
```

### Indexes
```sql
CREATE INDEX idx_producer_id ON producer_ledger(ProducerID);
CREATE INDEX idx_date ON producer_ledger(Date);
CREATE INDEX idx_transaction_type ON producer_ledger(TransactionType);
CREATE INDEX idx_risk_ranking ON producer_ledger(RiskRanking);
CREATE INDEX idx_ai_alert ON producer_ledger(AIAlertFlag);
CREATE UNIQUE INDEX idx_chronology ON producer_ledger(Chronology);
```

### Sample Data
```sql
INSERT INTO producer_ledger VALUES
(1, 'Chandra Sekhar', 'Guntur', '2025-02-12', 'Credit', 20000.00, NULL, 
 'Pesticides', 980000.00, 'Medium', 'Confirmed', 'Commission Agent', 
 'Initial credit', FALSE, 'Agent1', 'AgentOnly', 'Increased borrow frequency', 1),

(1, 'Chandra Sekhar', 'Guntur', '2025-03-04', 'Credit', 28000.00, NULL,
 'Shade nets & carpets', 952000.00, 'Medium', 'Confirmed', 'Commission Agent',
 NULL, FALSE, 'Agent1', 'AgentOnly', 'Normal activity', 2),

(1, 'Chandra Sekhar', 'Guntur', '2025-03-15', 'Credit', 13000.00, NULL,
 'Watering', 939000.00, 'High', 'Confirmed', 'Commission Agent',
 'High-frequency requests', TRUE, 'Agent1', 'AgentAndAdmin', 'Increase in risk flag', 3);
```

### Constraints
```sql
-- Ensure either credit or debit, not both
ALTER TABLE producer_ledger ADD CONSTRAINT chk_credit_or_debit
CHECK (
  (CreditAmount IS NOT NULL AND DebitAmount IS NULL) OR
  (CreditAmount IS NULL AND DebitAmount IS NOT NULL)
);

-- Chronology must be sequential
ALTER TABLE producer_ledger ADD CONSTRAINT chk_chronology_positive
CHECK (Chronology > 0);

-- Balance cannot be negative (optional - depends on business rules)
-- ALTER TABLE producer_ledger ADD CONSTRAINT chk_balance_positive
-- CHECK (BalanceAfter >= 0);
```

---

## 👥 Table 2: STAFF_ROLES (Internal Operations)

### Purpose
Manage internal staff members, their assigned roles, permissions, and village associations. **Not visible to producers.**

### Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **StaffID** | VARCHAR(50) | PRIMARY KEY | Unique staff identifier |
| **StaffName** | VARCHAR(100) | NOT NULL | Staff member full name |
| **AssignedRoles** | TEXT[] | NOT NULL | Array of roles |
| **Permissions** | TEXT[] | NOT NULL | Array of permissions |
| **AssociatedVillage** | VARCHAR(100) | NOT NULL | Primary village assignment |
| **ActiveStatus** | ENUM | NOT NULL | Active, Inactive, Pending |
| **Notes** | TEXT | NULL | Staff notes/description |
| **ContactNumber** | VARCHAR(20) | NULL | Phone number |
| **JoinDate** | DATE | NULL | Date of joining |
| **LastModified** | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| **ModifiedBy** | VARCHAR(100) | NULL | Who made last modification |

### Primary Key
```sql
PRIMARY KEY (StaffID)
```

### Indexes
```sql
CREATE INDEX idx_staff_name ON staff_roles(StaffName);
CREATE INDEX idx_village ON staff_roles(AssociatedVillage);
CREATE INDEX idx_active_status ON staff_roles(ActiveStatus);
CREATE INDEX idx_join_date ON staff_roles(JoinDate);
```

### Sample Data
```sql
INSERT INTO staff_roles VALUES
('ST101', 'G. Rama Rao', 
 ARRAY['Salesman', 'Weighing Laborer'], 
 ARRAY['MarketOnly'], 
 'Guntur', 'Active', 'Main market handler',
 '+91 98765 43210', '2024-01-15', '2025-03-15', 'Agent1'),

('ST102', 'S. Suresh',
 ARRAY['Quality Supervisor', 'Receiver'],
 ARRAY['AgentAndAdmin'],
 'Gurajepalli', 'Active', 'Quality, receiving',
 '+91 98765 43211', '2024-02-20', '2025-04-01', 'Agent1'),

('ST103', 'A. Sridevi',
 ARRAY['Watchman', 'Laborer', 'Sample Mover'],
 ARRAY['StorageOnly'],
 'Bommalapuram', 'Active', 'Handles movement',
 '+91 98765 43212', '2024-03-10', '2025-03-28', 'Agent2');
```

### Role Options (Reference Data)
```sql
-- Valid roles (enforced via application or CHECK constraint)
VALID_ROLES = [
  'Salesman',
  'Weighing Laborer',
  'Quality Supervisor',
  'Receiver',
  'Watchman',
  'Laborer',
  'Sample Mover',
  'Expense Approver',
  'Supervisor',
  'Other'
]
```

### Permission Options (Reference Data)
```sql
-- Valid permissions
VALID_PERMISSIONS = [
  'AgentOnly',
  'MarketOnly',
  'AgentAndAdmin',
  'AgentAndExpense',
  'StorageOnly',
  'Flexible'
]
```

---

## 🔗 Table 3: STAFF_ASSIGNMENTS (Optional Bridge Table)

### Purpose
**Optional**: Link specific staff members to specific transactions for detailed audit trails. Use only if you need to track exactly which staff member handled each transaction.

### Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **AssignmentID** | SERIAL | PRIMARY KEY | Auto-increment ID |
| **TransactionID** | INTEGER | NOT NULL, FK | References Chronology in producer_ledger |
| **StaffID** | VARCHAR(50) | NOT NULL, FK | References staff_roles.StaffID |
| **AssignmentDate** | TIMESTAMP | DEFAULT NOW() | When staff was assigned |
| **AssignmentType** | ENUM | NOT NULL | Primary, Secondary, Approver |
| **Notes** | TEXT | NULL | Assignment notes |

### Foreign Keys
```sql
ALTER TABLE staff_assignments
ADD CONSTRAINT fk_transaction
FOREIGN KEY (TransactionID) REFERENCES producer_ledger(Chronology)
ON DELETE CASCADE;

ALTER TABLE staff_assignments
ADD CONSTRAINT fk_staff
FOREIGN KEY (StaffID) REFERENCES staff_roles(StaffID)
ON DELETE CASCADE;
```

### Indexes
```sql
CREATE INDEX idx_transaction ON staff_assignments(TransactionID);
CREATE INDEX idx_staff ON staff_assignments(StaffID);
CREATE INDEX idx_assignment_date ON staff_assignments(AssignmentDate);
```

### Sample Data
```sql
-- Transaction 1 (Chronology 1) handled by two staff members
INSERT INTO staff_assignments VALUES
(1, 1, 'ST101', '2025-02-12 10:00:00', 'Primary', 'Bill entry'),
(2, 1, 'ST102', '2025-02-12 10:15:00', 'Approver', 'Credit authorization');

-- Transaction 3 (Chronology 3) handled by one staff member
INSERT INTO staff_assignments VALUES
(3, 3, 'ST101', '2025-03-15 14:30:00', 'Primary', 'High-risk credit');
```

---

## 🔄 How the Tables Work Together

### Scenario 1: Producer Views Their Ledger
```sql
-- Customer-facing query (NO staff roles exposed)
SELECT 
  ProducerID,
  ProducerName,
  VillagePlace,
  Date,
  TransactionType,
  CreditAmount,
  DebitAmount,
  Purpose,
  BalanceAfter,
  RiskRanking,
  OTPStatus,
  AuthorizedBy,
  RoleNotes,  -- Transaction context only
  AIInsights
FROM producer_ledger
WHERE ProducerID = 1
ORDER BY Chronology DESC;
```

**Result**: Clean customer view with NO internal staff information

### Scenario 2: Commission Agent Reviews Staff Performance
```sql
-- Internal query (commission agent only)
SELECT 
  s.StaffID,
  s.StaffName,
  s.AssignedRoles,
  s.Permissions,
  s.AssociatedVillage,
  s.ActiveStatus,
  COUNT(sa.TransactionID) as TransactionsHandled
FROM staff_roles s
LEFT JOIN staff_assignments sa ON s.StaffID = sa.StaffID
WHERE s.ActiveStatus = 'Active'
GROUP BY s.StaffID
ORDER BY TransactionsHandled DESC;
```

**Result**: Staff performance metrics (internal use only)

### Scenario 3: Audit Trail - Who Handled a Transaction?
```sql
-- Audit query (if using staff_assignments table)
SELECT 
  pl.Chronology,
  pl.ProducerName,
  pl.Date,
  pl.TransactionType,
  pl.Purpose,
  sr.StaffName,
  sr.AssignedRoles,
  sa.AssignmentType
FROM producer_ledger pl
JOIN staff_assignments sa ON pl.Chronology = sa.TransactionID
JOIN staff_roles sr ON sa.StaffID = sr.StaffID
WHERE pl.ProducerID = 1
ORDER BY pl.Chronology DESC;
```

**Result**: Complete audit trail linking transactions to staff

### Scenario 4: Find All Transactions Authorized by a Specific Person
```sql
-- Query by authorizer (from producer ledger)
SELECT 
  ProducerID,
  ProducerName,
  Date,
  TransactionType,
  CreditAmount + COALESCE(DebitAmount, 0) as Amount,
  Purpose,
  AuthorizedBy
FROM producer_ledger
WHERE AuthorizedBy = 'Commission Agent'
  AND Date >= '2025-02-01'
ORDER BY Date DESC;
```

### Scenario 5: Village-Specific Staff Roster
```sql
-- Get all active staff for a specific village
SELECT 
  StaffID,
  StaffName,
  array_to_string(AssignedRoles, ', ') as Roles,
  array_to_string(Permissions, ', ') as Permissions,
  ContactNumber
FROM staff_roles
WHERE AssociatedVillage = 'Guntur'
  AND ActiveStatus = 'Active'
ORDER BY StaffName;
```

---

## 📈 Advanced Queries

### Query 1: Producer Risk Analysis (Customer Data Only)
```sql
SELECT 
  ProducerID,
  ProducerName,
  VillagePlace,
  COUNT(*) as TotalTransactions,
  SUM(CASE WHEN TransactionType = 'Credit' THEN CreditAmount ELSE 0 END) as TotalCredit,
  SUM(CASE WHEN TransactionType IN ('Sale', 'Expense') THEN DebitAmount ELSE 0 END) as TotalDebit,
  MAX(BalanceAfter) as CurrentBalance,
  MAX(RiskRanking) as HighestRisk,
  SUM(CASE WHEN AIAlertFlag = TRUE THEN 1 ELSE 0 END) as AIAlerts
FROM producer_ledger
GROUP BY ProducerID, ProducerName, VillagePlace
HAVING SUM(CASE WHEN AIAlertFlag = TRUE THEN 1 ELSE 0 END) > 0
ORDER BY AIAlerts DESC;
```

### Query 2: Staff Workload Distribution (Internal Only)
```sql
WITH staff_workload AS (
  SELECT 
    sr.StaffID,
    sr.StaffName,
    sr.AssociatedVillage,
    COUNT(sa.TransactionID) as TransactionsHandled,
    COUNT(DISTINCT DATE(sa.AssignmentDate)) as ActiveDays
  FROM staff_roles sr
  LEFT JOIN staff_assignments sa ON sr.StaffID = sa.StaffID
  WHERE sr.ActiveStatus = 'Active'
    AND sa.AssignmentDate >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY sr.StaffID, sr.StaffName, sr.AssociatedVillage
)
SELECT 
  StaffName,
  AssociatedVillage,
  TransactionsHandled,
  ActiveDays,
  ROUND(TransactionsHandled::NUMERIC / NULLIF(ActiveDays, 0), 2) as AvgTransactionsPerDay
FROM staff_workload
ORDER BY TransactionsHandled DESC;
```

### Query 3: Multi-Role Staff Analysis
```sql
SELECT 
  StaffID,
  StaffName,
  AssociatedVillage,
  array_length(AssignedRoles, 1) as NumberOfRoles,
  AssignedRoles,
  Permissions,
  ActiveStatus
FROM staff_roles
WHERE array_length(AssignedRoles, 1) > 2  -- Staff with 3+ roles
ORDER BY array_length(AssignedRoles, 1) DESC;
```

### Query 4: Village Transaction Summary with Staff Count
```sql
SELECT 
  pl.VillagePlace,
  COUNT(DISTINCT pl.ProducerID) as UniqueProducers,
  COUNT(pl.Chronology) as TotalTransactions,
  SUM(pl.CreditAmount) as TotalCredit,
  SUM(pl.DebitAmount) as TotalDebit,
  COUNT(DISTINCT sr.StaffID) as ActiveStaff
FROM producer_ledger pl
LEFT JOIN staff_roles sr ON pl.VillagePlace = sr.AssociatedVillage
WHERE sr.ActiveStatus = 'Active' OR sr.ActiveStatus IS NULL
GROUP BY pl.VillagePlace
ORDER BY TotalTransactions DESC;
```

---

## 🔐 Access Control & Security

### Row-Level Security (RLS) Policies

#### Producer Ledger - Customer View
```sql
-- Producers can only see their own transactions
CREATE POLICY producer_own_data ON producer_ledger
FOR SELECT
TO producer_role
USING (ProducerID = current_user_id());

-- Commission agents can see all
CREATE POLICY agent_full_access ON producer_ledger
FOR ALL
TO agent_role
USING (true);
```

#### Staff Roles - Internal Only
```sql
-- Staff table is NEVER visible to producers
CREATE POLICY staff_no_producer_access ON staff_roles
FOR ALL
TO producer_role
USING (false);

-- Commission agents have full access
CREATE POLICY staff_agent_access ON staff_roles
FOR ALL
TO agent_role
USING (true);

-- Admins have read access
CREATE POLICY staff_admin_read ON staff_roles
FOR SELECT
TO admin_role
USING (true);
```

### Application-Level Access Control

```typescript
// Example: TypeScript/Node.js access control
interface AccessControl {
  canViewProducerLedger(userId: string, producerId: string): boolean;
  canViewStaffRoles(userId: string): boolean;
  canModifyStaff(userId: string): boolean;
}

class TradieAccessControl implements AccessControl {
  canViewProducerLedger(userId: string, producerId: string): boolean {
    // Producers can see their own data
    if (userId === producerId) return true;
    
    // Commission agents can see all
    if (this.isCommissionAgent(userId)) return true;
    
    // Admins can see all
    if (this.isAdmin(userId)) return true;
    
    return false;
  }
  
  canViewStaffRoles(userId: string): boolean {
    // ONLY commission agents and admins
    return this.isCommissionAgent(userId) || this.isAdmin(userId);
  }
  
  canModifyStaff(userId: string): boolean {
    // ONLY commission agents can modify
    return this.isCommissionAgent(userId);
  }
}
```

---

## 📊 Database Views (Recommended)

### View 1: Customer-Friendly Ledger
```sql
CREATE VIEW v_producer_ledger_public AS
SELECT 
  ProducerID,
  ProducerName,
  VillagePlace,
  Date,
  TransactionType,
  COALESCE(CreditAmount, 0) as CreditAmount,
  COALESCE(DebitAmount, 0) as DebitAmount,
  Purpose,
  BalanceAfter,
  RiskRanking,
  OTPStatus,
  RoleNotes as Notes,  -- Renamed for clarity
  AIInsights
FROM producer_ledger
ORDER BY Chronology DESC;
```

### View 2: Internal Audit View (with Staff)
```sql
CREATE VIEW v_ledger_with_staff AS
SELECT 
  pl.*,
  string_agg(sr.StaffName || ' (' || sa.AssignmentType || ')', ', ') as StaffInvolved
FROM producer_ledger pl
LEFT JOIN staff_assignments sa ON pl.Chronology = sa.TransactionID
LEFT JOIN staff_roles sr ON sa.StaffID = sr.StaffID
GROUP BY pl.Chronology, pl.ProducerID  -- Include all PL fields
ORDER BY pl.Chronology DESC;
```

### View 3: Active Staff Directory
```sql
CREATE VIEW v_active_staff AS
SELECT 
  StaffID,
  StaffName,
  array_to_string(AssignedRoles, ', ') as Roles,
  array_to_string(Permissions, ', ') as Permissions,
  AssociatedVillage,
  ContactNumber
FROM staff_roles
WHERE ActiveStatus = 'Active'
ORDER BY StaffName;
```

---

## 🔄 Migration Script (From Old to New)

If you have existing data with `RolesAssigned` in producer ledger:

```sql
-- Step 1: Backup
CREATE TABLE producer_ledger_backup AS SELECT * FROM producer_ledger;

-- Step 2: Create new staff_roles table
CREATE TABLE staff_roles (
  StaffID VARCHAR(50) PRIMARY KEY,
  StaffName VARCHAR(100) NOT NULL,
  AssignedRoles TEXT[] NOT NULL,
  Permissions TEXT[] NOT NULL,
  AssociatedVillage VARCHAR(100) NOT NULL,
  ActiveStatus VARCHAR(20) NOT NULL,
  Notes TEXT,
  ContactNumber VARCHAR(20),
  JoinDate DATE,
  LastModified TIMESTAMP DEFAULT NOW(),
  ModifiedBy VARCHAR(100)
);

-- Step 3: Create staff_assignments bridge table (if needed)
CREATE TABLE staff_assignments (
  AssignmentID SERIAL PRIMARY KEY,
  TransactionID INTEGER NOT NULL,
  StaffID VARCHAR(50) NOT NULL,
  AssignmentDate TIMESTAMP DEFAULT NOW(),
  AssignmentType VARCHAR(20) NOT NULL,
  Notes TEXT
);

-- Step 4: Extract unique staff from role assignments (manual process)
-- This requires analysis of your existing RolesAssigned data

-- Step 5: Remove RolesAssigned column
ALTER TABLE producer_ledger DROP COLUMN IF EXISTS RolesAssigned;

-- Step 6: Verify
SELECT COUNT(*) FROM producer_ledger;
SELECT COUNT(*) FROM staff_roles;
```

---

## 📝 Best Practices

### 1. **Never Mix Customer & Staff Data**
- ✅ Producer Ledger = Customer transactions ONLY
- ✅ Staff Roles = Internal operations ONLY
- ❌ Do NOT add staff fields to producer ledger

### 2. **Use Bridge Table for Detailed Audit**
- If you need to track which staff handled which transaction, use `staff_assignments`
- Don't add staff references directly to producer ledger

### 3. **Maintain Clean Access Control**
- Producers should NEVER see staff_roles table
- Use database-level RLS policies
- Implement application-level checks

### 4. **Keep Chronology Immutable**
- Never update Chronology field
- Use it as blockchain anchor reference
- Sequential, gap-free numbering

### 5. **Regular Cleanup**
- Archive old inactive staff
- Maintain active staff list
- Regular permission audits

---

## ✅ Summary

### Producer Ledger Table (18 Fields)
**Purpose**: Customer transaction tracking  
**Access**: Producers see own data, agents see all  
**No Staff Roles**: Clean separation

### Staff Roles Table (11 Fields)
**Purpose**: Internal operations management  
**Access**: Commission agents & admins ONLY  
**Multi-role Support**: Array fields for flexibility

### Staff Assignments Table (6 Fields)
**Purpose**: Detailed audit trail (optional)  
**Access**: Internal only  
**Links**: Transactions ↔ Staff

---

**This two-table approach provides:**
✅ Clean normalization  
✅ Clear access control  
✅ Flexible role assignment  
✅ Scalable architecture  
✅ Privacy-compliant design  
✅ Comprehensive audit trails  

🎯 **Production Ready** for commodity trading platform!
