import { BusinessEntity, EntityRoleAssignment, DataRectificationRequest, AuditTrailEntry, RolePermission } from '../types/business-entity';

export const mockBusinessEntities: BusinessEntity[] = [
  // Individual/Proprietorship - Small Scale
  {
    id: 'BE000',
    name: 'Sole Trader PSR',
    entityType: 'Individual',
    entityScale: 'Small',
    pan: 'AABCP9876L',
    gstin: '36AABCP9876L1Z0',
    msmeRegistration: 'MSME-TG-00-0001234',
    incorporationDate: '2020-01-10',
    registeredAddress: '12, Market Lane, Warangal, Telangana - 506001',
    contactEmail: 'psr.sole@gmail.com',
    contactPhone: '+91-870-2123456',
    brands: ['PSR Produce'],
    turnover: 8.5, // ₹8.5Cr
    employeeCount: 15,
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-03-31',
    nextAuditDue: '2025-03-31',
    applicableLaws: ['Income Tax Act 1961', 'GST Act 2017', 'MSME Act 2006'],
    governanceModel: 'Owner-managed',
    assignedRoles: [
      {
        id: 'RA000A',
        personName: 'PSR Reddy',
        personEmail: 'psr.sole@gmail.com',
        personPhone: '+91-98765-00001',
        role: 'Owner',
        assignedDate: '2020-01-10',
        assignedBy: 'Self',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T08:00:00Z',
        permissions: []
      },
      {
        id: 'RA000B',
        personName: 'Ramu (Laborer)',
        personEmail: 'ramu@laborpool.com',
        personPhone: '+91-98765-00002',
        role: 'Laborer',
        assignedDate: '2021-05-01',
        assignedBy: 'PSR Reddy',
        isActive: true,
        otpEnabled: false,
        permissions: []
      },
      {
        id: 'RA000C',
        personName: 'Venkat (Watchman)',
        personEmail: 'venkat@security.com',
        personPhone: '+91-98765-00003',
        role: 'Watchman',
        assignedDate: '2021-06-01',
        assignedBy: 'PSR Reddy',
        isActive: true,
        otpEnabled: false,
        permissions: []
      }
    ]
  },
  {
    id: 'BE001',
    name: 'PSR & CO',
    entityType: 'Partnership',
    registrationNumber: 'PART/2015/12345',
    gstin: '36AABCP1234F1Z5',
    pan: 'AABCP1234F',
    incorporationDate: '2015-03-15',
    registeredAddress: '45, Market Yard Road, Warangal, Telangana - 506002',
    contactEmail: 'partners@psrco.com',
    contactPhone: '+91-870-2456789',
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-09-15',
    nextAuditDue: '2025-09-15',
    assignedRoles: [
      {
        id: 'RA001',
        personName: 'Prasad Reddy',
        personEmail: 'prasad@psrco.com',
        personPhone: '+91-98765-43210',
        role: 'Managing Partner',
        assignedDate: '2015-03-15',
        assignedBy: 'System',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T10:30:00Z',
        permissions: [
          {
            role: 'Managing Partner',
            dataCategory: 'Financial Records',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          },
          {
            role: 'Managing Partner',
            dataCategory: 'Transaction Data',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Internal'
          }
        ]
      },
      {
        id: 'RA002',
        personName: 'Suresh Kumar',
        personEmail: 'suresh@psrco.com',
        personPhone: '+91-98765-43211',
        role: 'Partner',
        assignedDate: '2015-03-15',
        assignedBy: 'Prasad Reddy',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-27T14:20:00Z',
        permissions: [
          {
            role: 'Partner',
            dataCategory: 'Financial Records',
            permissionLevel: 'View Only',
            requiresOTP: false,
            requiresApproval: false,
            confidentialityLevel: 'Internal'
          },
          {
            role: 'Partner',
            dataCategory: 'Transaction Data',
            permissionLevel: 'Suggest Corrections',
            requiresOTP: true,
            requiresApproval: true,
            approverRoles: ['Managing Partner', 'Auditor'],
            confidentialityLevel: 'Internal'
          }
        ]
      },
      {
        id: 'RA003',
        personName: 'CA Ramesh Gupta',
        personEmail: 'ramesh@auditfirm.com',
        personPhone: '+91-98765-43212',
        role: 'Auditor',
        assignedDate: '2023-04-01',
        assignedBy: 'Prasad Reddy',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T09:15:00Z',
        permissions: [
          {
            role: 'Auditor',
            dataCategory: 'Financial Records',
            permissionLevel: 'Audit Access',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      }
    ]
  },
  {
    id: 'BE002',
    name: 'Ravindra & Son',
    entityType: 'Family Enterprise',
    pan: 'AABCR5678G',
    gstin: '36AABCR5678G1Z9',
    incorporationDate: '2010-06-20',
    registeredAddress: '78, Agriculture Market, Karimnagar, Telangana - 505001',
    contactEmail: 'contact@ravindrason.com',
    contactPhone: '+91-878-2234567',
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-08-20',
    nextAuditDue: '2025-08-20',
    assignedRoles: [
      {
        id: 'RA004',
        personName: 'Ravindra Rao',
        personEmail: 'ravindra@ravindrason.com',
        personPhone: '+91-98765-54321',
        role: 'Family Head',
        assignedDate: '2010-06-20',
        assignedBy: 'System',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T08:45:00Z',
        permissions: [
          {
            role: 'Family Head',
            dataCategory: 'Financial Records',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          },
          {
            role: 'Family Head',
            dataCategory: 'Business Confidential',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      },
      {
        id: 'RA005',
        personName: 'Kiran Rao',
        personEmail: 'kiran@ravindrason.com',
        personPhone: '+91-98765-54322',
        role: 'Family Member',
        assignedDate: '2020-01-15',
        assignedBy: 'Ravindra Rao',
        isActive: true,
        otpEnabled: true,
        permissions: [
          {
            role: 'Family Member',
            dataCategory: 'Transaction Data',
            permissionLevel: 'Suggest Corrections',
            requiresOTP: true,
            requiresApproval: true,
            approverRoles: ['Family Head', 'Auditor'],
            confidentialityLevel: 'Internal'
          }
        ]
      },
      {
        id: 'RA006',
        personName: 'CA Lakshmi Devi',
        personEmail: 'lakshmi@auditservices.com',
        personPhone: '+91-98765-54323',
        role: 'Auditor',
        assignedDate: '2023-05-01',
        assignedBy: 'Ravindra Rao',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-27T16:30:00Z',
        permissions: [
          {
            role: 'Auditor',
            dataCategory: 'Financial Records',
            permissionLevel: 'Audit Access',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      }
    ]
  },
  {
    id: 'BE003',
    name: 'Kakatiya Traders Pvt Ltd',
    entityType: 'Private Limited',
    registrationNumber: 'U51909TG2018PTC123456',
    gstin: '36AABCK1234M1ZP',
    pan: 'AABCK1234M',
    incorporationDate: '2018-09-10',
    registeredAddress: 'Plot No. 456, Industrial Estate, Warangal, Telangana - 506015',
    contactEmail: 'info@kakatiyatraders.com',
    contactPhone: '+91-870-2987654',
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-03-31',
    nextAuditDue: '2025-03-31',
    assignedRoles: [
      {
        id: 'RA007',
        personName: 'Kumar Naidu',
        personEmail: 'kumar@kakatiyatraders.com',
        personPhone: '+91-98765-67890',
        role: 'Managing Director',
        assignedDate: '2018-09-10',
        assignedBy: 'Board of Directors',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T11:00:00Z',
        digitalSignature: 'DSC_KN_20181001',
        permissions: [
          {
            role: 'Managing Director',
            dataCategory: 'Financial Records',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      },
      {
        id: 'RA008',
        personName: 'Srinivas Reddy',
        personEmail: 'srinivas@kakatiyatraders.com',
        personPhone: '+91-98765-67891',
        role: 'Director',
        assignedDate: '2018-09-10',
        assignedBy: 'Board of Directors',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-27T09:30:00Z',
        digitalSignature: 'DSC_SR_20181001',
        permissions: [
          {
            role: 'Director',
            dataCategory: 'Financial Records',
            permissionLevel: 'View Only',
            requiresOTP: false,
            requiresApproval: false,
            confidentialityLevel: 'Internal'
          }
        ]
      },
      {
        id: 'RA009',
        personName: 'CS Priya Sharma',
        personEmail: 'priya@kakatiyatraders.com',
        personPhone: '+91-98765-67892',
        role: 'Company Secretary',
        assignedDate: '2018-09-15',
        assignedBy: 'Board of Directors',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T10:00:00Z',
        digitalSignature: 'DSC_PS_20181015',
        permissions: [
          {
            role: 'Company Secretary',
            dataCategory: 'Compliance Records',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          },
          {
            role: 'Company Secretary',
            dataCategory: 'Contracts & Agreements',
            permissionLevel: 'Full Rectification',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      },
      {
        id: 'RA010',
        personName: 'CA Venkat Rao',
        personEmail: 'venkat@statutoryaudit.com',
        personPhone: '+91-98765-67893',
        role: 'Statutory Auditor',
        assignedDate: '2024-04-01',
        assignedBy: 'Annual General Meeting',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T08:00:00Z',
        digitalSignature: 'DSC_VR_20240401',
        permissions: [
          {
            role: 'Statutory Auditor',
            dataCategory: 'Financial Records',
            permissionLevel: 'Audit Access',
            requiresOTP: true,
            requiresApproval: false,
            confidentialityLevel: 'Highly Confidential'
          }
        ]
      }
    ]
  },
  
  // Co-operative Society - Medium Scale
  {
    id: 'BE004',
    name: 'Kakatiya Co-operative Society',
    entityType: 'Co-operative',
    entityScale: 'Medium',
    coopRegistration: 'COOP/TG/2012/5678',
    gstin: '36AABCK5678C1Z1',
    pan: 'AABCK5678C',
    incorporationDate: '2012-04-15',
    registeredAddress: 'Co-op Building, Agricultural Market, Warangal, Telangana - 506004',
    contactEmail: 'info@kakatiyacoop.org',
    contactPhone: '+91-870-2445566',
    brands: ['Kakatiya Fresh', 'Co-op Organics'],
    turnover: 285, // ₹285Cr
    employeeCount: 320,
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-06-30',
    nextAuditDue: '2025-06-30',
    applicableLaws: ['Co-operative Societies Act', 'MSME Act 2006', 'FSSAI', 'APEDA'],
    governanceModel: 'Democratic Board-managed',
    assignedRoles: [
      {
        id: 'RA011',
        personName: 'Ramesh Kumar (Board Chair)',
        personEmail: 'ramesh@kakatiyacoop.org',
        personPhone: '+91-98765-78901',
        role: 'Board Member',
        assignedDate: '2023-01-01',
        assignedBy: 'Members Election',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T07:30:00Z',
        permissions: []
      },
      {
        id: 'RA012',
        personName: 'Sita Devi (Secretary)',
        personEmail: 'secretary@kakatiyacoop.org',
        personPhone: '+91-98765-78902',
        role: 'Co-op Secretary',
        assignedDate: '2022-07-01',
        assignedBy: 'Board',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-27T15:00:00Z',
        permissions: []
      },
      {
        id: 'RA013',
        personName: 'Nagarjuna (Member Representative)',
        personEmail: 'nag@kakatiyacoop.org',
        personPhone: '+91-98765-78903',
        role: 'Co-op Member',
        assignedDate: '2015-03-01',
        assignedBy: 'Membership',
        isActive: true,
        otpEnabled: false,
        permissions: []
      },
      {
        id: 'RA014',
        personName: 'Krishna (Quality Supervisor)',
        personEmail: 'krishna@kakatiyacoop.org',
        personPhone: '+91-98765-78904',
        role: 'Quality Supervisor',
        assignedDate: '2020-05-01',
        assignedBy: 'Board',
        isActive: true,
        otpEnabled: false,
        permissions: []
      }
    ]
  },

  // Society - Small Scale (Non-profit)
  {
    id: 'BE005',
    name: 'Guntur Traders Society',
    entityType: 'Society',
    entityScale: 'Small',
    societyRegistration: 'SOC/AP/1998/1234',
    pan: 'AABCG1234S',
    gstin: '37AABCG1234S1Z5',
    incorporationDate: '1998-11-20',
    registeredAddress: '45, Society Bhavan, Guntur, Andhra Pradesh - 522001',
    contactEmail: 'info@gunturtraders.org',
    contactPhone: '+91-863-2234455',
    brands: ['Guntur Community Traders'],
    turnover: 12, // ₹12Cr
    employeeCount: 25,
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-04-15',
    nextAuditDue: '2025-04-15',
    applicableLaws: ['Societies Registration Act 1860', 'Income Tax Act 1961 (Section 12A)'],
    governanceModel: 'Committee-managed',
    assignedRoles: [
      {
        id: 'RA015',
        personName: 'Venkateswara Rao (President)',
        personEmail: 'president@gunturtraders.org',
        personPhone: '+91-98765-88801',
        role: 'Governing Body Member',
        assignedDate: '2022-01-01',
        assignedBy: 'General Body Election',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-25T10:00:00Z',
        permissions: []
      },
      {
        id: 'RA016',
        personName: 'Madhavi (Secretary)',
        personEmail: 'secretary@gunturtraders.org',
        personPhone: '+91-98765-88802',
        role: 'Society Secretary',
        assignedDate: '2021-06-01',
        assignedBy: 'Governing Body',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-26T14:30:00Z',
        permissions: []
      },
      {
        id: 'RA017',
        personName: 'Rajesh (Member)',
        personEmail: 'rajesh@gunturtraders.org',
        personPhone: '+91-98765-88803',
        role: 'Society Member',
        assignedDate: '2010-03-01',
        assignedBy: 'Membership Committee',
        isActive: true,
        otpEnabled: false,
        permissions: []
      }
    ]
  },

  // Trust - MSME Scale
  {
    id: 'BE006',
    name: 'Agri Trust Enterprises',
    entityType: 'Trust',
    entityScale: 'MSME',
    trustDeed: 'TRUST/KA/2005/TR-789',
    pan: 'AABCA7890T',
    incorporationDate: '2005-08-10',
    registeredAddress: 'Trust Office, Agricultural Complex, Bangalore Rural, Karnataka - 560065',
    contactEmail: 'trustees@agritrust.org',
    contactPhone: '+91-80-28765432',
    brands: ['Agri Trust Produce', 'Farmers Welfare Products'],
    turnover: 145, // ₹145Cr
    employeeCount: 180,
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-03-31',
    nextAuditDue: '2025-03-31',
    applicableLaws: ['Indian Trusts Act 1882', 'Income Tax Act 1961 (Section 11)', 'FCRA (if foreign donations)'],
    governanceModel: 'Fiduciary Trust-managed',
    assignedRoles: [
      {
        id: 'RA018',
        personName: 'Dr. Subramaniam (Chief Trustee)',
        personEmail: 'subramaniam@agritrust.org',
        personPhone: '+91-98765-98801',
        role: 'Trustee',
        assignedDate: '2005-08-10',
        assignedBy: 'Trust Deed',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T06:45:00Z',
        digitalSignature: 'DSC_SUB_20050810',
        permissions: []
      },
      {
        id: 'RA019',
        personName: 'Late Sri Krishnamurthy (Founder)',
        personEmail: 'founder@agritrust.org',
        personPhone: '+91-98765-98802',
        role: 'Settlor',
        assignedDate: '2005-08-10',
        assignedBy: 'Trust Deed',
        isActive: false,
        otpEnabled: false,
        permissions: []
      },
      {
        id: 'RA020',
        personName: 'Farmers Welfare Group',
        personEmail: 'beneficiaries@agritrust.org',
        personPhone: '+91-98765-98803',
        role: 'Beneficiary',
        assignedDate: '2005-08-10',
        assignedBy: 'Trust Deed',
        isActive: true,
        otpEnabled: false,
        permissions: []
      },
      {
        id: 'RA021',
        personName: 'Ganesh (Receiver)',
        personEmail: 'ganesh@agritrust.org',
        personPhone: '+91-98765-98804',
        role: 'Receiver',
        assignedDate: '2018-04-01',
        assignedBy: 'Trustees',
        isActive: true,
        otpEnabled: false,
        permissions: []
      }
    ]
  },

  // Enterprise - Large Scale (Hybrid Model)
  {
    id: 'BE007',
    name: 'Generic Agri Enterprise Pvt Ltd',
    entityType: 'Enterprise',
    entityScale: 'Large',
    registrationNumber: 'U01100KA2010PTC055678',
    gstin: '29AABCE5567M1ZQ',
    pan: 'AABCE5567M',
    cin: 'U01100KA2010PTC055678',
    incorporationDate: '2010-02-20',
    registeredAddress: 'Enterprise Tower, Whitefield, Bangalore, Karnataka - 560066',
    contactEmail: 'contact@genericagri.com',
    contactPhone: '+91-80-41234567',
    brands: ['GenAgri Premium', 'FarmFresh', 'Organic Plus'],
    turnover: 850, // ₹850Cr
    employeeCount: 1200,
    activeStatus: 'Active',
    complianceStatus: 'Compliant',
    lastAuditDate: '2024-03-31',
    nextAuditDue: '2025-03-31',
    applicableLaws: ['Companies Act 2013', 'FSSAI', 'APEDA', 'ISO 22000', 'HACCP'],
    governanceModel: 'Hybrid Owner-Board',
    assignedRoles: [
      {
        id: 'RA022',
        personName: 'Anil Kumar (CEO)',
        personEmail: 'anil@genericagri.com',
        personPhone: '+91-98765-12301',
        role: 'Owner',
        assignedDate: '2010-02-20',
        assignedBy: 'Board',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-28T09:00:00Z',
        digitalSignature: 'DSC_AK_20100220',
        permissions: []
      },
      {
        id: 'RA023',
        personName: 'Priya Sharma (COO)',
        personEmail: 'priya@genericagri.com',
        personPhone: '+91-98765-12302',
        role: 'Manager',
        assignedDate: '2015-06-01',
        assignedBy: 'CEO',
        isActive: true,
        otpEnabled: true,
        lastOTPVerified: '2024-10-27T16:00:00Z',
        permissions: []
      },
      {
        id: 'RA024',
        personName: 'Rajiv (Multi-Role Staff)',
        personEmail: 'rajiv@genericagri.com',
        personPhone: '+91-98765-12303',
        role: 'Multi-Role Staff',
        assignedDate: '2018-03-15',
        assignedBy: 'Manager',
        isActive: true,
        otpEnabled: false,
        permissions: []
      },
      {
        id: 'RA025',
        personName: 'Sunil (Salesman)',
        personEmail: 'sunil@genericagri.com',
        personPhone: '+91-98765-12304',
        role: 'Salesman',
        assignedDate: '2019-07-01',
        assignedBy: 'Manager',
        isActive: true,
        otpEnabled: false,
        permissions: []
      }
    ]
  }
];

export const mockRectificationRequests: DataRectificationRequest[] = [
  {
    id: 'RR001',
    entityId: 'BE001',
    requestedBy: 'Suresh Kumar',
    requestedByRole: 'Partner',
    dataCategory: 'Transaction Data',
    fieldName: 'Producer Payment Amount',
    currentValue: '₹2,45,000',
    proposedValue: '₹2,50,000',
    justification: 'Correction needed due to quality premium not included in original calculation. Verified with weighment slip #WS-2024-1234.',
    requestDate: '2024-10-27T14:30:00Z',
    status: 'Pending',
    otpVerified: true,
    approvers: [
      {
        approverRole: 'Managing Partner',
        approverName: 'Prasad Reddy',
        status: 'Pending',
        otpVerified: false
      },
      {
        approverRole: 'Auditor',
        approverName: 'CA Ramesh Gupta',
        status: 'Pending',
        otpVerified: false
      }
    ],
    auditTrail: [
      {
        id: 'AT001',
        timestamp: '2024-10-27T14:30:00Z',
        action: 'Create',
        performedBy: 'Suresh Kumar',
        performedByRole: 'Partner',
        entityId: 'BE001',
        dataCategory: 'Transaction Data',
        fieldChanged: 'Producer Payment Amount',
        oldValue: '₹2,45,000',
        newValue: '₹2,50,000',
        ipAddress: '103.56.78.90',
        deviceInfo: 'Chrome 119.0, Windows 10',
        otpVerified: true,
        visibleTo: ['Managing Partner', 'Partner', 'Auditor', 'Admin']
      }
    ]
  },
  {
    id: 'RR002',
    entityId: 'BE002',
    requestedBy: 'Kiran Rao',
    requestedByRole: 'Family Member',
    dataCategory: 'Producer Information',
    fieldName: 'Producer Contact Number',
    currentValue: '+91-98765-11111',
    proposedValue: '+91-98765-22222',
    justification: 'Producer updated contact number. Verified via phone call on 2024-10-26.',
    requestDate: '2024-10-26T10:15:00Z',
    status: 'Approved',
    otpVerified: true,
    approvers: [
      {
        approverRole: 'Family Head',
        approverName: 'Ravindra Rao',
        approvalDate: '2024-10-26T15:30:00Z',
        status: 'Approved',
        otpVerified: true,
        comments: 'Verified and approved.',
        digitalSignature: 'SIG_RR_20241026'
      },
      {
        approverRole: 'Auditor',
        approverName: 'CA Lakshmi Devi',
        approvalDate: '2024-10-26T16:00:00Z',
        status: 'Approved',
        otpVerified: true,
        comments: 'No audit concerns. Approved.'
      }
    ],
    auditTrail: [
      {
        id: 'AT002',
        timestamp: '2024-10-26T10:15:00Z',
        action: 'Create',
        performedBy: 'Kiran Rao',
        performedByRole: 'Family Member',
        entityId: 'BE002',
        dataCategory: 'Producer Information',
        fieldChanged: 'Producer Contact Number',
        oldValue: '+91-98765-11111',
        newValue: '+91-98765-22222',
        ipAddress: '103.56.78.91',
        deviceInfo: 'Safari 17.0, macOS 14',
        otpVerified: true,
        visibleTo: ['Family Head', 'Family Member', 'Auditor', 'Admin']
      },
      {
        id: 'AT003',
        timestamp: '2024-10-26T15:30:00Z',
        action: 'Approve',
        performedBy: 'Ravindra Rao',
        performedByRole: 'Family Head',
        entityId: 'BE002',
        dataCategory: 'Producer Information',
        ipAddress: '103.56.78.92',
        deviceInfo: 'Chrome 119.0, Android 13',
        otpVerified: true,
        blockchainHash: '0xabcd1234567890ef',
        visibleTo: ['Family Head', 'Auditor', 'Admin']
      }
    ]
  },
  {
    id: 'RR003',
    entityId: 'BE003',
    requestedBy: 'Kumar Naidu',
    requestedByRole: 'Managing Director',
    dataCategory: 'Financial Records',
    fieldName: 'Commission Rate',
    currentValue: '2.5%',
    proposedValue: '2.75%',
    justification: 'Board resolution dated 2024-10-25 approved revised commission structure for premium grade produce.',
    requestDate: '2024-10-25T11:00:00Z',
    status: 'Approved',
    otpVerified: true,
    approvers: [
      {
        approverRole: 'Company Secretary',
        approverName: 'CS Priya Sharma',
        approvalDate: '2024-10-25T14:00:00Z',
        status: 'Approved',
        otpVerified: true,
        comments: 'Verified against Board Resolution BR-2024-045. Compliant with Companies Act.',
        digitalSignature: 'DSC_PS_20241025'
      },
      {
        approverRole: 'Statutory Auditor',
        approverName: 'CA Venkat Rao',
        approvalDate: '2024-10-25T16:30:00Z',
        status: 'Approved',
        otpVerified: true,
        comments: 'Audited and approved. Within permissible limits.',
        digitalSignature: 'DSC_VR_20241025'
      }
    ],
    auditTrail: [
      {
        id: 'AT004',
        timestamp: '2024-10-25T11:00:00Z',
        action: 'Create',
        performedBy: 'Kumar Naidu',
        performedByRole: 'Managing Director',
        entityId: 'BE003',
        dataCategory: 'Financial Records',
        fieldChanged: 'Commission Rate',
        oldValue: '2.5%',
        newValue: '2.75%',
        ipAddress: '103.56.78.93',
        deviceInfo: 'Chrome 119.0, Windows 11',
        otpVerified: true,
        visibleTo: ['Managing Director', 'Director', 'Company Secretary', 'Statutory Auditor', 'Admin']
      },
      {
        id: 'AT005',
        timestamp: '2024-10-25T14:00:00Z',
        action: 'Approve',
        performedBy: 'CS Priya Sharma',
        performedByRole: 'Company Secretary',
        entityId: 'BE003',
        dataCategory: 'Financial Records',
        ipAddress: '103.56.78.94',
        deviceInfo: 'Firefox 120.0, Windows 11',
        otpVerified: true,
        blockchainHash: '0x1234abcdef567890',
        visibleTo: ['Managing Director', 'Company Secretary', 'Statutory Auditor', 'Admin']
      }
    ]
  }
];
