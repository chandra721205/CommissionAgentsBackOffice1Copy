import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  History, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Filter,
  Search,
  Lock,
  Unlock,
  FileText,
  ExternalLink
} from 'lucide-react';
import { AuditTrailEntry, EntityRole } from '../types/business-entity';

interface EntityAuditTrailProps {
  auditTrail: AuditTrailEntry[];
  userRole: EntityRole;
  onExport?: () => void;
}

export function EntityAuditTrail({ auditTrail, userRole, onExport }: EntityAuditTrailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  // Filter audit trail based on user role visibility
  const visibleAuditTrail = auditTrail.filter(entry => 
    entry.visibleTo.includes(userRole)
  );

  const filteredAudit = visibleAuditTrail.filter(entry => {
    const matchesSearch = 
      entry.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.dataCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.fieldChanged?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === 'all' || entry.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Create': return <FileText className="w-4 h-4 text-green-600" />;
      case 'Update': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'Delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'View': return <Eye className="w-4 h-4 text-slate-600" />;
      case 'Approve': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Reject': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Export': return <Download className="w-4 h-4 text-purple-600" />;
      default: return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Create': return 'bg-green-100 text-green-700 border-green-200';
      case 'Update': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delete': return 'bg-red-100 text-red-700 border-red-200';
      case 'View': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Approve': return 'bg-green-100 text-green-700 border-green-200';
      case 'Reject': return 'bg-red-100 text-red-700 border-red-200';
      case 'Export': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-3 rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Audit Trail & Activity Log</CardTitle>
              <CardDescription>
                Immutable blockchain-anchored transaction history • Visible to: {userRole}
              </CardDescription>
            </div>
          </div>
          {onExport && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by user, category, or field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="all">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Approve">Approve</option>
            <option value="Reject">Reject</option>
            <option value="View">View</option>
            <option value="Export">Export</option>
          </select>
        </div>

        {/* Alert for Role-Based Visibility */}
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Confidentiality Notice:</strong> You are viewing audit logs authorized for your role ({userRole}). 
            Some entries may be hidden due to confidentiality restrictions as per Indian data protection norms.
          </AlertDescription>
        </Alert>

        {/* Audit Trail List */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredAudit.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No audit trail entries found</p>
              </div>
            ) : (
              filteredAudit.map((entry) => (
                <Card key={entry.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Action Icon */}
                      <div className="mt-1">
                        {getActionIcon(entry.action)}
                      </div>

                      {/* Entry Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${getActionColor(entry.action)} border`}>
                                {entry.action}
                              </Badge>
                              <span className="text-sm">{entry.dataCategory}</span>
                            </div>
                            <p className="text-sm text-slate-600">
                              By <strong>{entry.performedBy}</strong> ({entry.performedByRole})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Field Changes */}
                        {entry.fieldChanged && (
                          <div className="bg-slate-50 p-3 rounded-lg border mt-2">
                            <p className="text-xs text-slate-600 mb-1">Field: <strong>{entry.fieldChanged}</strong></p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-slate-500">Old Value</p>
                                <p className="text-red-700">{entry.oldValue || '-'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">New Value</p>
                                <p className="text-green-700">{entry.newValue || '-'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Technical Details */}
                        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">IP:</span>
                            <code className="bg-slate-100 px-2 py-1 rounded">{entry.ipAddress}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Device:</span>
                            <span className="text-slate-700">{entry.deviceInfo}</span>
                          </div>
                        </div>

                        {/* OTP & Blockchain Verification */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            {entry.otpVerified ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-700">OTP Verified</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-500">No OTP</span>
                              </>
                            )}
                          </div>
                          {entry.blockchainHash && (
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-blue-700">Blockchain: {entry.blockchainHash.slice(0, 12)}...</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Visibility Indicator */}
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Eye className="w-3 h-3" />
                            <span>Visible to: {entry.visibleTo.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl text-blue-600">{filteredAudit.length}</p>
            <p className="text-xs text-slate-500">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-green-600">
              {filteredAudit.filter(e => e.otpVerified).length}
            </p>
            <p className="text-xs text-slate-500">OTP Verified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-purple-600">
              {filteredAudit.filter(e => e.blockchainHash).length}
            </p>
            <p className="text-xs text-slate-500">Blockchain Anchored</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-orange-600">
              {filteredAudit.filter(e => e.action === 'Approve').length}
            </p>
            <p className="text-xs text-slate-500">Approvals</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
