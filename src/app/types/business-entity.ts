// Business Entity Type Definitions for Commission Agent Management
// Compliant with Indian Partnership Act, Companies Act 2013, MSME Act

export type BusinessEntityType = 
  | 'Individual' // Sole proprietor (no formal registration; personal liability)
  | 'Partnership' // 2+ partners (Partnership Act 1932; unlimited liability)
  | 'Family Enterprise' // Family-run (informal; treated as proprietorship/partnership)
  | 'Co-operative' // Member-owned (Co-operative Societies Act; democratic control)
  | 'Society' // Non-profit (Societies Registration Act 1860; mutual benefit)
  | 'Trust' // Charitable/trust-based (Indian Trusts Act 1882; fiduciary duty)
  | 'Private Company' // Ltd liability (Companies Act 2013; min 2 directors)
  | 'Public Limited' // Public company (Companies Act 2013; can issue public shares)
  | 'LLP' // Limited Liability Partnership (LLP Act 2008)
  | 'Enterprise'; // General business (umbrella for unregistered; scale-based)

// MSME Act 2006 - Turnover/Employment thresholds
export type EntityScale = 
  | 'Small' // <₹50Cr turnover OR <100 employees
  | 'MSME' // ₹50-250Cr turnover OR 100-250 employees
  | 'Medium' // ₹250-500Cr turnover OR 250-500 employees
  | 'Large'; // >₹500Cr turnover OR >500 employees

export type EntityRole = 
  // Individual/Proprietorship
  | 'Owner' // Sole proprietor with full control
  | 'Proprietor'
  
  // Partnership
  | 'Partner'
  | 'Managing Partner'
  
  // Family Enterprise
  | 'Family Head'
  | 'Family Member'
  
  // Co-operative
  | 'Board Member' // Elected board member
  | 'Co-op Secretary' // Compliance officer for co-operative
  | 'Co-op Member' // General member with voting rights
  
  // Society
  | 'Governing Body Member' // Committee member
  | 'Society Secretary' // Administrative head
  | 'Society Member' // General member
  
  // Trust
  | 'Trustee' // Fiduciary duty holder
  | 'Settlor' // Founder of trust
  | 'Beneficiary' // Trust beneficiary
  
  // Company (Private/Public/LLP)
  | 'Director'
  | 'Managing Director'
  | 'Company Secretary'
  | 'Shareholder'
  | 'Independent Director'
  
  // Staff Roles (across all entity types)
  | 'Manager' // Operations manager
  | 'Commission Agent'
  | 'Watchman' // Security staff
  | 'Receiver' // Material receiver
  | 'Laborer' // General laborer
  | 'Salesman' // Sales staff
  | 'Weighing Laborer' // Weighment operator
  | 'Quality Supervisor' // Quality control
  | 'Sample Mover' // Sample handler
  | 'Multi-Role Staff' // Staff with multiple roles
  | 'Undefined Custom' // Custom role
  
  // Auditing & Compliance
  | 'Auditor'
  | 'Statutory Auditor'
  | 'Internal Auditor'
  | 'Compliance Officer'
  | 'Authorized Signatory'
  
  // System
  | 'Admin' // System administrator
  | 'Regulator'; // External regulator/oversight

export type PermissionLevel = 
  | 'Full Rectification' // Can directly edit with OTP
  | 'Suggest Corrections' // Can propose changes
  | 'View Only' // Read-only access
  | 'Approve Changes' // Can approve suggestions
  | 'Audit Access' // Full audit trail visibility
  | 'Restricted View'; // Limited data visibility

export type DataCategory = 
  | 'Financial Records'
  | 'Transaction Data'
  | 'Producer Information'
  | 'Buyer Information'
  | 'Commission Calculations'
  | 'Payment Records'
  | 'Contracts & Agreements'
  | 'Tax Documents'
  | 'Compliance Records'
  | 'Business Confidential';

export interface RolePermission {
  role: EntityRole;
  dataCategory: DataCategory;
  permissionLevel: PermissionLevel;
  requiresOTP: boolean;
  requiresApproval: boolean;
  approverRoles?: EntityRole[];
  confidentialityLevel: 'Public' | 'Internal' | 'Restricted' | 'Highly Confidential';
}

export interface BusinessEntity {
  id: string;
  name: string;
  entityType: BusinessEntityType;
  entityScale: EntityScale; // Small/MSME/Medium/Large
  registrationNumber?: string;
  gstin?: string;
  pan?: string;
  cin?: string; // Corporate Identification Number (for companies)
  msmeRegistration?: string;
  societyRegistration?: string; // For societies
  trustDeed?: string; // For trusts
  coopRegistration?: string; // For co-operatives
  incorporationDate?: string;
  registeredAddress: string;
  contactEmail: string;
  contactPhone: string;
  brands?: string[]; // Multiple brand names
  turnover?: number; // Annual turnover in ₹Cr
  employeeCount?: number; // Total employees
  assignedRoles: EntityRoleAssignment[];
  activeStatus: 'Active' | 'Inactive' | 'Suspended' | 'Under Audit';
  complianceStatus: 'Compliant' | 'Pending Review' | 'Non-Compliant';
  lastAuditDate?: string;
  nextAuditDue?: string;
  applicableLaws: string[]; // e.g., ["Companies Act 2013", "FSSAI", "APEDA"]
  governanceModel?: string; // e.g., "Board-managed", "Democratic", "Fiduciary"
  // Registration Lock & Change Management
  isLocked: boolean; // True after first registration
  lockedAt?: string; // Timestamp of lock
  changeQuota: ChangeQuota; // 3-change lifetime limit
  lastChangeAt?: string; // Last change request date
}

export interface EntityRoleAssignment {
  id: string;
  personName: string;
  personEmail: string;
  personPhone: string;
  role: EntityRole;
  assignedDate: string;
  assignedBy: string;
  isActive: boolean;
  permissions: RolePermission[];
  digitalSignature?: string;
  otpEnabled: boolean;
  lastOTPVerified?: string;
  // Share-based permissions
  sharePercentage?: number; // Ownership/stake percentage (0-100)
  position?: string; // Partner, Director, Manager, etc.
  liabilityLevel?: 'Unlimited' | 'Limited' | 'None'; // Liability type
}

export interface DataRectificationRequest {
  id: string;
  entityId: string;
  requestedBy: string;
  requestedByRole: EntityRole;
  dataCategory: DataCategory;
  fieldName: string;
  currentValue: string;
  proposedValue: string;
  justification: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  approvers: ApprovalRecord[];
  otpVerified: boolean;
  auditTrail: AuditTrailEntry[];
}

export interface ApprovalRecord {
  approverRole: EntityRole;
  approverName: string;
  approvalDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  otpVerified: boolean;
  comments?: string;
  digitalSignature?: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  action: 'Create' | 'Update' | 'Delete' | 'View' | 'Approve' | 'Reject' | 'Export';
  performedBy: string;
  performedByRole: EntityRole;
  entityId: string;
  dataCategory: DataCategory;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  deviceInfo: string;
  otpVerified: boolean;
  blockchainHash?: string;
  visibleTo: EntityRole[];
}

export interface OTPVerification {
  requestId: string;
  userId: string;
  userRole: EntityRole;
  otpCode: string;
  generatedAt: string;
  expiresAt: string;
  verifiedAt?: string;
  purpose: string;
  status: 'Pending' | 'Verified' | 'Expired' | 'Failed';
}

// Default Permission Templates per Business Entity Type
export const PARTNERSHIP_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Managing Partner': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Partner': {
    'Financial Records': 'View Only',
    'Transaction Data': 'Suggest Corrections',
    'Producer Information': 'Suggest Corrections',
    'Buyer Information': 'Suggest Corrections',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'View Only',
    'Compliance Records': 'View Only',
    'Business Confidential': 'Restricted View',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Producer Information': 'View Only',
    'Buyer Information': 'View Only',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Commission Agent': {
    'Financial Records': 'Suggest Corrections',
    'Transaction Data': 'Suggest Corrections',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'Restricted View',
    'Compliance Records': 'View Only',
    'Business Confidential': 'Restricted View',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Statutory Auditor': {},
  'Internal Auditor': {},
  'Family Head': {},
  'Family Member': {},
  'Director': {},
  'Managing Director': {},
  'Company Secretary': {},
  'Proprietor': {},
  'Manager': {},
  'Authorized Signatory': {},
  'Compliance Officer': {},
};

export const PRIVATE_COMPANY_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Managing Director': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Director': {
    'Financial Records': 'View Only',
    'Transaction Data': 'View Only',
    'Producer Information': 'Suggest Corrections',
    'Buyer Information': 'Suggest Corrections',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'View Only',
    'Compliance Records': 'View Only',
    'Business Confidential': 'View Only',
  },
  'Company Secretary': {
    'Financial Records': 'Approve Changes',
    'Transaction Data': 'Approve Changes',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Approve Changes',
    'Payment Records': 'Approve Changes',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Statutory Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Producer Information': 'View Only',
    'Buyer Information': 'View Only',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Contracts & Agreements': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Commission Agent': {
    'Financial Records': 'Restricted View',
    'Transaction Data': 'Suggest Corrections',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'View Only',
    'Payment Records': 'Restricted View',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'Restricted View',
    'Compliance Records': 'Restricted View',
    'Business Confidential': 'Restricted View',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Managing Partner': {},
  'Partner': {},
  'Auditor': {},
  'Internal Auditor': {},
  'Family Head': {},
  'Family Member': {},
  'Proprietor': {},
  'Manager': {},
  'Authorized Signatory': {},
  'Compliance Officer': {},
};

export const FAMILY_ENTERPRISE_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Family Head': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Family Member': {
    'Financial Records': 'Restricted View',
    'Transaction Data': 'Suggest Corrections',
    'Producer Information': 'Suggest Corrections',
    'Buyer Information': 'Suggest Corrections',
    'Commission Calculations': 'Restricted View',
    'Payment Records': 'Restricted View',
    'Contracts & Agreements': 'Restricted View',
    'Tax Documents': 'Restricted View',
    'Compliance Records': 'Restricted View',
    'Business Confidential': 'Restricted View',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Producer Information': 'View Only',
    'Buyer Information': 'View Only',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Commission Agent': {
    'Financial Records': 'Suggest Corrections',
    'Transaction Data': 'Suggest Corrections',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'View Only',
    'Tax Documents': 'Restricted View',
    'Compliance Records': 'View Only',
    'Business Confidential': 'Restricted View',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Managing Partner': {},
  'Partner': {},
  'Director': {},
  'Managing Director': {},
  'Company Secretary': {},
  'Statutory Auditor': {},
  'Internal Auditor': {},
  'Proprietor': {},
  'Manager': {},
  'Authorized Signatory': {},
  'Compliance Officer': {},
  'Owner': {},
  'Board Member': {},
  'Co-op Secretary': {},
  'Co-op Member': {},
  'Governing Body Member': {},
  'Society Secretary': {},
  'Society Member': {},
  'Trustee': {},
  'Settlor': {},
  'Beneficiary': {},
  'Shareholder': {},
  'Independent Director': {},
  'Watchman': {},
  'Receiver': {},
  'Laborer': {},
  'Salesman': {},
  'Weighing Laborer': {},
  'Quality Supervisor': {},
  'Sample Mover': {},
  'Multi-Role Staff': {},
  'Undefined Custom': {},
  'Regulator': {},
};

// Individual/Proprietorship Permissions
export const INDIVIDUAL_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Owner': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Proprietor': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Laborer': {
    'Transaction Data': 'View Only',
    'Producer Information': 'Restricted View',
    'Buyer Information': 'Restricted View',
  },
  'Watchman': {
    'Transaction Data': 'View Only',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
  },
  'Partner': {}, 'Managing Partner': {}, 'Family Head': {}, 'Family Member': {},
  'Board Member': {}, 'Co-op Secretary': {}, 'Co-op Member': {},
  'Governing Body Member': {}, 'Society Secretary': {}, 'Society Member': {},
  'Trustee': {}, 'Settlor': {}, 'Beneficiary': {},
  'Director': {}, 'Managing Director': {}, 'Company Secretary': {},
  'Shareholder': {}, 'Independent Director': {},
  'Manager': {}, 'Commission Agent': {}, 'Receiver': {},
  'Salesman': {}, 'Weighing Laborer': {}, 'Quality Supervisor': {},
  'Sample Mover': {}, 'Multi-Role Staff': {}, 'Undefined Custom': {},
  'Statutory Auditor': {}, 'Internal Auditor': {}, 'Compliance Officer': {},
  'Authorized Signatory': {}, 'Regulator': {},
};

// Co-operative Society Permissions (Co-operative Societies Act)
export const COOPERATIVE_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Board Member': {
    'Financial Records': 'Approve Changes', // Democratic governance
    'Transaction Data': 'Approve Changes',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Approve Changes',
    'Payment Records': 'Approve Changes',
    'Contracts & Agreements': 'Approve Changes',
    'Tax Documents': 'View Only',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'View Only',
  },
  'Co-op Secretary': {
    'Financial Records': 'Suggest Corrections',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Suggest Corrections',
    'Payment Records': 'Suggest Corrections',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Restricted View',
  },
  'Co-op Member': {
    'Financial Records': 'View Only', // Transparency for members
    'Transaction Data': 'View Only',
    'Producer Information': 'View Only',
    'Buyer Information': 'Restricted View',
    'Commission Calculations': 'View Only',
    'Payment Records': 'Restricted View',
    'Contracts & Agreements': 'Restricted View',
    'Compliance Records': 'View Only',
  },
  'Quality Supervisor': {
    'Transaction Data': 'View Only',
    'Producer Information': 'View Only',
  },
  'Sample Mover': {
    'Transaction Data': 'Restricted View',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Owner': {}, 'Proprietor': {}, 'Partner': {}, 'Managing Partner': {},
  'Family Head': {}, 'Family Member': {},
  'Governing Body Member': {}, 'Society Secretary': {}, 'Society Member': {},
  'Trustee': {}, 'Settlor': {}, 'Beneficiary': {},
  'Director': {}, 'Managing Director': {}, 'Company Secretary': {},
  'Shareholder': {}, 'Independent Director': {},
  'Manager': {}, 'Commission Agent': {}, 'Watchman': {}, 'Receiver': {},
  'Laborer': {}, 'Salesman': {}, 'Weighing Laborer': {},
  'Multi-Role Staff': {}, 'Undefined Custom': {},
  'Statutory Auditor': {}, 'Internal Auditor': {}, 'Compliance Officer': {},
  'Authorized Signatory': {}, 'Regulator': {},
};

// Society Permissions (Societies Registration Act 1860)
export const SOCIETY_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Governing Body Member': {
    'Financial Records': 'Approve Changes',
    'Transaction Data': 'Approve Changes',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Approve Changes',
    'Payment Records': 'Approve Changes',
    'Contracts & Agreements': 'Approve Changes',
    'Tax Documents': 'View Only',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'View Only',
  },
  'Society Secretary': {
    'Financial Records': 'Suggest Corrections',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Suggest Corrections',
    'Payment Records': 'Suggest Corrections',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Restricted View',
  },
  'Society Member': {
    'Financial Records': 'Restricted View', // Summary view for non-profit
    'Transaction Data': 'View Only',
    'Producer Information': 'View Only',
    'Compliance Records': 'View Only',
  },
  'Quality Supervisor': {
    'Transaction Data': 'View Only',
    'Producer Information': 'View Only',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Owner': {}, 'Proprietor': {}, 'Partner': {}, 'Managing Partner': {},
  'Family Head': {}, 'Family Member': {},
  'Board Member': {}, 'Co-op Secretary': {}, 'Co-op Member': {},
  'Trustee': {}, 'Settlor': {}, 'Beneficiary': {},
  'Director': {}, 'Managing Director': {}, 'Company Secretary': {},
  'Shareholder': {}, 'Independent Director': {},
  'Manager': {}, 'Commission Agent': {}, 'Watchman': {}, 'Receiver': {},
  'Laborer': {}, 'Salesman': {}, 'Weighing Laborer': {}, 'Sample Mover': {},
  'Multi-Role Staff': {}, 'Undefined Custom': {},
  'Statutory Auditor': {}, 'Internal Auditor': {}, 'Compliance Officer': {},
  'Authorized Signatory': {}, 'Regulator': {},
};

// Trust Permissions (Indian Trusts Act 1882)
export const TRUST_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Trustee': {
    'Financial Records': 'Full Rectification', // Fiduciary duty
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Settlor': {
    'Financial Records': 'View Only', // Oversight role
    'Transaction Data': 'View Only',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'View Only',
    'Compliance Records': 'View Only',
    'Business Confidential': 'View Only',
  },
  'Beneficiary': {
    'Financial Records': 'Restricted View', // Limited to benefits
    'Payment Records': 'Restricted View',
  },
  'Receiver': {
    'Transaction Data': 'View Only',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
    'Business Confidential': 'Audit Access',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Owner': {}, 'Proprietor': {}, 'Partner': {}, 'Managing Partner': {},
  'Family Head': {}, 'Family Member': {},
  'Board Member': {}, 'Co-op Secretary': {}, 'Co-op Member': {},
  'Governing Body Member': {}, 'Society Secretary': {}, 'Society Member': {},
  'Director': {}, 'Managing Director': {}, 'Company Secretary': {},
  'Shareholder': {}, 'Independent Director': {},
  'Manager': {}, 'Commission Agent': {}, 'Watchman': {},
  'Laborer': {}, 'Salesman': {}, 'Weighing Laborer': {},
  'Quality Supervisor': {}, 'Sample Mover': {},
  'Multi-Role Staff': {}, 'Undefined Custom': {},
  'Statutory Auditor': {}, 'Internal Auditor': {}, 'Compliance Officer': {},
  'Authorized Signatory': {}, 'Regulator': {},
};

// Enterprise Permissions (Hybrid/General business)
export const ENTERPRISE_PERMISSIONS: Record<EntityRole, Partial<Record<DataCategory, PermissionLevel>>> = {
  'Owner': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Manager': {
    'Financial Records': 'Suggest Corrections',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'View Only',
    'Payment Records': 'View Only',
    'Contracts & Agreements': 'Suggest Corrections',
    'Compliance Records': 'Suggest Corrections',
  },
  'Multi-Role Staff': {
    'Transaction Data': 'View Only',
    'Producer Information': 'View Only',
    'Buyer Information': 'Restricted View',
  },
  'Salesman': {
    'Transaction Data': 'View Only',
    'Buyer Information': 'View Only',
  },
  'Auditor': {
    'Financial Records': 'Audit Access',
    'Transaction Data': 'Audit Access',
    'Commission Calculations': 'Audit Access',
    'Payment Records': 'Audit Access',
    'Tax Documents': 'Audit Access',
    'Compliance Records': 'Audit Access',
  },
  'Admin': {
    'Financial Records': 'Full Rectification',
    'Transaction Data': 'Full Rectification',
    'Producer Information': 'Full Rectification',
    'Buyer Information': 'Full Rectification',
    'Commission Calculations': 'Full Rectification',
    'Payment Records': 'Full Rectification',
    'Contracts & Agreements': 'Full Rectification',
    'Tax Documents': 'Full Rectification',
    'Compliance Records': 'Full Rectification',
    'Business Confidential': 'Full Rectification',
  },
  'Proprietor': {}, 'Partner': {}, 'Managing Partner': {},
  'Family Head': {}, 'Family Member': {},
  'Board Member': {}, 'Co-op Secretary': {}, 'Co-op Member': {},
  'Governing Body Member': {}, 'Society Secretary': {}, 'Society Member': {},
  'Trustee': {}, 'Settlor': {}, 'Beneficiary': {},
  'Director': {}, 'Managing Director': {}, 'Company Secretary': {},
  'Shareholder': {}, 'Independent Director': {},
  'Commission Agent': {}, 'Watchman': {}, 'Receiver': {},
  'Laborer': {}, 'Weighing Laborer': {},
  'Quality Supervisor': {}, 'Sample Mover': {},
  'Undefined Custom': {},
  'Statutory Auditor': {}, 'Internal Auditor': {}, 'Compliance Officer': {},
  'Authorized Signatory': {}, 'Regulator': {},
};

// ============================================
// ENHANCED: Registration Lock & Change Management
// ============================================

export interface ChangeQuota {
  total: number; // Total allowed changes (default: 3)
  used: number; // Changes consumed so far
  remaining: number; // Changes left
  history: ChangeHistory[]; // All change requests
}

export interface ChangeHistory {
  id: string; // CHG-2025-001234
  changeNumber: number; // 1, 2, or 3
  requestedAt: string; // Timestamp
  requestedBy: string; // User name
  requestedByRole: EntityRole;
  changeType: 'Entity Type' | 'Scale Category' | 'Entity Name' | 'Brands' | 'Partners/Directors' | 'Share Distribution' | 'Address' | 'Contacts' | 'Other';
  reason: string; // Detailed justification (min 50 chars)
  supportingDocuments: DocumentUpload[];
  status: 'Pending' | 'Under Verification' | 'Approved' | 'Rejected' | 'Withdrawn';
  verifier?: VerifierProfile; // App-appointed verifier
  kycStatus?: KYCStatus; // KYC re-verification status
  approvalStatus?: 'Awaiting Multi-Member OTP' | 'Approved' | 'Rejected';
  completedAt?: string; // Timestamp of completion
  costBreakdown?: CostBreakdown;
}

export interface VerifierProfile {
  id: string;
  name: string;
  qualification: 'Company Secretary (CS)' | 'Chartered Accountant (CA)' | 'Advocate' | 'Certified Professional';
  experience: number; // Years
  rating: number; // 0-5.0
  totalVerifications: number;
  successRate: number; // Percentage
  contactPhone: string;
  contactEmail: string;
  office: string; // City/state
  assignedAt: string;
  status: 'Assigned' | 'Reviewing' | 'Completed' | 'Rejected';
}

export interface KYCStatus {
  members: MemberKYC[]; // All partners/directors/trustees
  overallStatus: 'Pending' | 'Partially Complete' | 'Complete' | 'Expired';
  deadline: string; // 48-72 hours from request
}

export interface MemberKYC {
  memberId: string;
  memberName: string;
  memberRole: EntityRole;
  sharePercentage?: number;
  aadhaarStatus: 'Pending' | 'Uploaded' | 'Verified' | 'Failed';
  panStatus: 'Pending' | 'Uploaded' | 'Verified' | 'Failed';
  bankStatementStatus: 'Pending' | 'Uploaded' | 'Verified' | 'Failed';
  addressProofStatus: 'Pending' | 'Uploaded' | 'Verified' | 'Failed';
  uploadedAt?: string;
  verifiedAt?: string;
}

export interface DocumentUpload {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'DOCX';
  fileSize: number; // bytes
  uploadedAt: string;
  uploadedBy: string;
  documentType: 'Partnership Deed' | 'Board Resolution' | 'Registration Certificate' | 'Financial Statements' | 'Trademark Certificate' | 'Other';
  url: string;
}

export interface CostBreakdown {
  appVerifierFee: number; // ₹5,000 standard
  kycReverificationFee: number; // ₹2,000-3,000
  documentProcessingFee: number; // ₹1,000
  governmentFees: number; // Variable
  totalEstimated: number;
  actualPaid?: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  paymentId?: string;
  paidAt?: string;
}

// ============================================
// ENHANCED: Multi-Member OTP Approval
// ============================================

export interface MultiMemberOTPRequest {
  requestId: string;
  requestType: 'Registration Lock' | 'Permission Save' | 'Entity Change' | 'Financial Edit';
  initiatedBy: string;
  initiatedByRole: EntityRole;
  initiatedAt: string;
  requiredMembers: number; // Minimum 2 (except Individual)
  memberOTPs: MemberOTP[];
  status: 'Pending' | 'Partially Verified' | 'Fully Verified' | 'Failed' | 'Expired';
  expiresAt: string; // 5 minutes from generation
  verifiedAt?: string;
}

export interface MemberOTP {
  memberId: string;
  memberName: string;
  memberRole: EntityRole;
  sharePercentage?: number;
  otpCode: string; // 6-digit
  sentTo: string; // Phone number
  sentAt: string;
  verifiedAt?: string;
  status: 'Pending' | 'Verified' | 'Expired' | 'Failed';
  attempts: number; // Max 3
}

// ============================================
// ENHANCED: Verification Timeline Tracking
// ============================================

export interface VerificationTimeline {
  requestId: string;
  steps: VerificationStep[];
  currentStep: number; // 1-6
  estimatedCompletion: string;
  actualCompletion?: string;
  totalDuration?: number; // Hours
}

export interface VerificationStep {
  stepNumber: number; // 1-6
  stepName: 'Request Submitted' | 'Verifier Appointment' | 'KYC Re-Verification' | 'Document Review' | 'Final Approval' | 'Entity Update';
  status: 'Completed' | 'In Progress' | 'Pending' | 'Queued' | 'Failed';
  estimatedDuration: number; // Hours
  startedAt?: string;
  completedAt?: string;
  assignedTo?: string; // Verifier name or System
  notes?: string;
}

// ============================================
// ENHANCED: Share-Based Proportionate Permissions
// ============================================

export interface ProportionatePermission {
  memberId: string;
  memberName: string;
  role: EntityRole;
  sharePercentage: number; // 0-100
  position: string; // Managing Partner, Director, Manager, Staff
  liabilityLevel: 'Unlimited' | 'Limited' | 'None';
  calculatedPermissions: {
    viewAccess: 'FULL' | 'LIMITED' | 'READ-ONLY' | 'NONE';
    suggestRights: boolean;
    editRectify: boolean | 'LIMITED'; // Boolean or limited scope
    approveChanges: boolean;
    financialAccess: 'FULL' | 'READ-ONLY' | 'NONE';
    multiApprovalRequired: boolean; // Requires other members
  };
  authenticationRequired: {
    individualOTP: boolean;
    otherMembersOTP: string[]; // IDs of other members needed
    biometric2FA: boolean;
  };
}

// ============================================
// ENHANCED: Exception for Individual Business
// ============================================

export interface IndividualBusinessException {
  entityId: string;
  entityType: 'Individual'; // Only for Individual
  ownerName: string;
  ownerRole: 'Owner' | 'Proprietor';
  sharePercentage: 100; // Always 100%
  singleOTPOnly: boolean; // True - no multi-member required
  fullControl: boolean; // True - owner has full access
  staffPermissions: {
    role: EntityRole;
    viewOnly: boolean; // True - staff never edit
    noApprovalRights: boolean; // True
  }[];
}
