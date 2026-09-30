import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Edit, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Shield,
  FileCheck
} from 'lucide-react';
import { EntityRole, DataCategory, PermissionLevel, RolePermission, BusinessEntityType } from '../types/business-entity';

interface EntityPermissionMatrixProps {
  entityType: BusinessEntityType;
  roles: EntityRole[];
  onPermissionChange?: (role: EntityRole, category: DataCategory, level: PermissionLevel) => void;
}

const dataCategories: DataCategory[] = [
  'Financial Records',
  'Transaction Data',
  'Producer Information',
  'Buyer Information',
  'Commission Calculations',
  'Payment Records',
  'Contracts & Agreements',
  'Tax Documents',
  'Compliance Records',
  'Business Confidential'
];

const permissionLevels: PermissionLevel[] = [
  'Full Rectification',
  'Approve Changes',
  'Suggest Corrections',
  'View Only',
  'Audit Access',
  'Restricted View'
];

export function EntityPermissionMatrix({ entityType, roles, onPermissionChange }: EntityPermissionMatrixProps) {
  const [selectedRole, setSelectedRole] = useState<EntityRole | null>(roles[0] || null);

  const getPermissionIcon = (level: PermissionLevel) => {
    switch (level) {
      case 'Full Rectification': return <Edit className="w-4 h-4 text-red-600" />;
      case 'Approve Changes': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Suggest Corrections': return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'View Only': return <Eye className="w-4 h-4 text-slate-600" />;
      case 'Audit Access': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'Restricted View': return <Lock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getPermissionColor = (level: PermissionLevel) => {
    switch (level) {
      case 'Full Rectification': return 'bg-red-100 text-red-700 border-red-300';
      case 'Approve Changes': return 'bg-green-100 text-green-700 border-green-300';
      case 'Suggest Corrections': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'View Only': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Audit Access': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Restricted View': return 'bg-orange-100 text-orange-700 border-orange-300';
    }
  };

  const getConfidentialityLevel = (category: DataCategory): string => {
    const highlyConfidential = ['Financial Records', 'Tax Documents', 'Business Confidential'];
    const restricted = ['Payment Records', 'Commission Calculations', 'Contracts & Agreements'];
    const internal = ['Transaction Data', 'Compliance Records'];
    
    if (highlyConfidential.includes(category)) return 'Highly Confidential';
    if (restricted.includes(category)) return 'Restricted';
    if (internal.includes(category)) return 'Internal';
    return 'Public';
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'Highly Confidential': return 'text-red-700 bg-red-50 border-red-300';
      case 'Restricted': return 'text-orange-700 bg-orange-50 border-orange-300';
      case 'Internal': return 'text-blue-700 bg-blue-50 border-blue-300';
      default: return 'text-slate-700 bg-slate-50 border-slate-300';
    }
  };

  // Get default permission for role-category combination based on entity type
  const getDefaultPermission = (role: EntityRole, category: DataCategory): PermissionLevel => {
    // Partnership permissions
    if (entityType === 'Partnership') {
      if (role === 'Managing Partner') return 'Full Rectification';
      if (role === 'Partner') {
        if (['Financial Records', 'Commission Calculations', 'Payment Records'].includes(category)) {
          return 'View Only';
        }
        return 'Suggest Corrections';
      }
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
      if (role === 'Commission Agent') {
        if (['Producer Information', 'Buyer Information'].includes(category)) {
          return 'Full Rectification';
        }
        return category.includes('Financial') ? 'Restricted View' : 'Suggest Corrections';
      }
    }

    // Private Limited Company permissions
    if (entityType === 'Private Limited') {
      if (role === 'Managing Director') return 'Full Rectification';
      if (role === 'Director') return 'View Only';
      if (role === 'Company Secretary') {
        if (['Compliance Records', 'Contracts & Agreements', 'Tax Documents'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Approve Changes';
      }
      if (role === 'Statutory Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
      if (role === 'Commission Agent') {
        if (['Producer Information', 'Buyer Information'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Restricted View';
      }
    }

    // Family Enterprise permissions
    if (entityType === 'Family Enterprise') {
      if (role === 'Family Head') return 'Full Rectification';
      if (role === 'Family Member') {
        if (category === 'Business Confidential') return 'Restricted View';
        return 'Suggest Corrections';
      }
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
      if (role === 'Commission Agent') {
        if (['Producer Information', 'Buyer Information'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Suggest Corrections';
      }
    }

    // Individual/Proprietorship permissions
    if (entityType === 'Individual') {
      if (role === 'Owner' || role === 'Proprietor') return 'Full Rectification';
      if (role === 'Laborer' || role === 'Watchman') return category.includes('Transaction') ? 'View Only' : 'Restricted View';
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
    }

    // Co-operative Society permissions
    if (entityType === 'Co-operative') {
      if (role === 'Board Member') {
        if (category.includes('Compliance')) return 'Full Rectification';
        return 'Approve Changes';
      }
      if (role === 'Co-op Secretary') {
        if (['Contracts & Agreements', 'Tax Documents', 'Compliance Records'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Suggest Corrections';
      }
      if (role === 'Co-op Member') return category.includes('Financial') ? 'View Only' : 'Restricted View';
      if (role === 'Quality Supervisor' || role === 'Sample Mover') return 'View Only';
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
    }

    // Society permissions
    if (entityType === 'Society') {
      if (role === 'Governing Body Member') {
        if (category.includes('Compliance')) return 'Full Rectification';
        return 'Approve Changes';
      }
      if (role === 'Society Secretary') {
        if (['Contracts & Agreements', 'Tax Documents', 'Compliance Records'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Suggest Corrections';
      }
      if (role === 'Society Member') return category.includes('Financial') ? 'Restricted View' : 'View Only';
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
    }

    // Trust permissions
    if (entityType === 'Trust') {
      if (role === 'Trustee') return 'Full Rectification'; // Fiduciary duty
      if (role === 'Settlor') return category.includes('Financial') || category.includes('Compliance') ? 'View Only' : 'Restricted View';
      if (role === 'Beneficiary') return category.includes('Payment') ? 'Restricted View' : 'Restricted View';
      if (role === 'Receiver') return 'View Only';
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
    }

    // Enterprise (Hybrid) permissions
    if (entityType === 'Enterprise') {
      if (role === 'Owner') return 'Full Rectification';
      if (role === 'Manager') {
        if (['Producer Information', 'Buyer Information', 'Transaction Data'].includes(category)) {
          return 'Full Rectification';
        }
        return 'Suggest Corrections';
      }
      if (role === 'Multi-Role Staff' || role === 'Salesman') return 'View Only';
      if (role === 'Auditor') return 'Audit Access';
      if (role === 'Admin') return 'Full Rectification';
    }

    return 'View Only';
  };

  const requiresOTP = (level: PermissionLevel): boolean => {
    return ['Full Rectification', 'Approve Changes'].includes(level);
  };

  const requiresApproval = (role: EntityRole, level: PermissionLevel): boolean => {
    if (level === 'Suggest Corrections') return true;
    if (level === 'Full Rectification' && !['Managing Partner', 'Managing Director', 'Family Head', 'Admin'].includes(role)) {
      return true;
    }
    return false;
  };

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Permission Matrix & Access Control</CardTitle>
            <CardDescription>
              Role-based data rectification & view permissions • Entity Type: <strong>{entityType}</strong>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Legal Compliance Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Indian Legal Framework Compliance:</strong> This permission matrix is designed to comply with:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Companies Act, 2013 (Private/Public Limited Companies)</li>
              <li>Indian Partnership Act, 1932 (Partnership Firms)</li>
              <li>Co-operative Societies Act (Co-operative Societies)</li>
              <li>Societies Registration Act, 1860 (Societies)</li>
              <li>Indian Trusts Act, 1882 (Trusts)</li>
              <li>MSME Development Act, 2006 (MSME Entities)</li>
              <li>Indian Auditing Standards & Best Practices (SOX/IFRS for agri-business)</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Role Selector */}
        <div className="mb-6">
          <p className="text-sm mb-3">Select Role to View Permissions:</p>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                onClick={() => setSelectedRole(role)}
                className={selectedRole === role ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {selectedRole && (
          <div className="space-y-4">
            {/* Permission Legend */}
            <Card className="border bg-slate-50">
              <CardContent className="p-4">
                <p className="text-sm mb-3">Permission Levels:</p>
                <div className="grid grid-cols-3 gap-3">
                  {permissionLevels.map(level => (
                    <div key={level} className="flex items-center gap-2">
                      {getPermissionIcon(level)}
                      <span className="text-xs">{level}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3 border-b">Data Category</th>
                    <th className="text-left p-3 border-b">Permission Level</th>
                    <th className="text-center p-3 border-b">OTP Required</th>
                    <th className="text-center p-3 border-b">Approval Required</th>
                    <th className="text-left p-3 border-b">Confidentiality</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCategories.map(category => {
                    const permission = getDefaultPermission(selectedRole, category);
                    const needsOTP = requiresOTP(permission);
                    const needsApproval = requiresApproval(selectedRole, permission);
                    const confidentiality = getConfidentialityLevel(category);

                    return (
                      <tr key={category} className="border-b hover:bg-slate-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {category.includes('Financial') && <Lock className="w-4 h-4 text-red-500" />}
                            <span className="text-sm">{category}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={`${getPermissionColor(permission)} border text-xs`}>
                            <span className="flex items-center gap-1">
                              {getPermissionIcon(permission)}
                              {permission}
                            </span>
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {needsOTP ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {needsApproval ? (
                            <CheckCircle2 className="w-5 h-5 text-orange-600 mx-auto" />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge className={`${getConfidentialityColor(confidentiality)} border text-xs`}>
                            {confidentiality}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Approval Workflow Info */}
            {entityType === 'Partnership' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>Partnership Approval Workflow:</strong> All corrections suggested by Partners must be approved by 
                  Managing Partner + Auditor as per partnership deed and Indian Partnership Act, 1932.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Private Limited' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>Companies Act Compliance:</strong> Critical financial data changes require Company Secretary approval 
                  + Statutory Auditor sign-off. Board resolution may be required for certain categories as per Companies Act, 2013.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Family Enterprise' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>Family Governance:</strong> All data corrections by family members require Family Head approval. 
                  Sensitive business information is restricted to family governance circle and authorized auditors only.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Co-operative' && (
              <Alert className="border-teal-200 bg-teal-50">
                <AlertTriangle className="h-4 w-4 text-teal-600" />
                <AlertDescription className="text-teal-800 text-sm">
                  <strong>Democratic Co-operative Governance:</strong> Major decisions require Board quorum (2FA approval). 
                  All members have transparency rights to financial records. Compliance per Co-operative Societies Act.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Society' && (
              <Alert className="border-indigo-200 bg-indigo-50">
                <AlertTriangle className="h-4 w-4 text-indigo-600" />
                <AlertDescription className="text-indigo-800 text-sm">
                  <strong>Society Governance (Non-Profit):</strong> Governing Body committee reviews all corrections. 
                  Members have limited view rights per Societies Registration Act, 1860. Annual returns mandatory.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Trust' && (
              <Alert className="border-rose-200 bg-rose-50">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <AlertDescription className="text-rose-800 text-sm">
                  <strong>Fiduciary Trust Duty:</strong> Trustees have full responsibility under Indian Trusts Act, 1882. 
                  All changes must serve beneficiaries' interests. Settlor retains oversight. Audit trail mandatory.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Individual' && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <strong>Sole Proprietorship:</strong> Owner has full control with personal liability. 
                  Staff have limited view-only access. OTP required for all owner rectifications.
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'Enterprise' && (
              <Alert className="border-cyan-200 bg-cyan-50">
                <AlertTriangle className="h-4 w-4 text-cyan-600" />
                <AlertDescription className="text-cyan-800 text-sm">
                  <strong>Hybrid Enterprise Model:</strong> Owner-Manager dual control with flexible role assignment. 
                  Scale-based compliance (Large entities require stricter controls). Multi-role staff supported.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
