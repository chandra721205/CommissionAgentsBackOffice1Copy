import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { 
  Building, 
  Users, 
  Shield, 
  FileCheck, 
  History,
  Search,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Briefcase,
  UserCheck,
  Lock,
  Award,
  TrendingUp
} from 'lucide-react';
import { mockBusinessEntities, mockRectificationRequests } from '../services/business-entity-mock-data';
import { EntityAuditTrail } from './EntityAuditTrail';
import { EntityPermissionMatrix } from './EntityPermissionMatrix';
import { OTPAuthorizationDialog } from './OTPAuthorizationDialog';
import { BusinessEntity, EntityRole, DataRectificationRequest } from '../types/business-entity';

export function BusinessEntityManagement() {
  const [selectedEntity, setSelectedEntity] = useState<BusinessEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpAction, setOTPAction] = useState('');

  // Simulated current user
  const currentUser = {
    role: 'Admin' as EntityRole,
    name: 'System Administrator'
  };

  const filteredEntities = mockBusinessEntities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEntityTypeIcon = (type: string) => {
    if (type === 'Individual') return <UserCheck className="w-5 h-5 text-amber-600" />;
    if (type === 'Partnership') return <Briefcase className="w-5 h-5 text-blue-600" />;
    if (type === 'Family Enterprise') return <Users className="w-5 h-5 text-green-600" />;
    if (type === 'Co-operative') return <Users className="w-5 h-5 text-teal-600" />;
    if (type === 'Society') return <Users className="w-5 h-5 text-indigo-600" />;
    if (type === 'Trust') return <Shield className="w-5 h-5 text-rose-600" />;
    if (type.includes('Limited') || type.includes('Company')) return <Building className="w-5 h-5 text-purple-600" />;
    if (type === 'Enterprise') return <TrendingUp className="w-5 h-5 text-cyan-600" />;
    return <Building className="w-5 h-5 text-slate-600" />;
  };

  const getEntityTypeColor = (type: string) => {
    if (type === 'Individual') return 'from-amber-500 to-orange-600';
    if (type === 'Partnership') return 'from-blue-500 to-blue-600';
    if (type === 'Family Enterprise') return 'from-green-500 to-green-600';
    if (type === 'Co-operative') return 'from-teal-500 to-teal-600';
    if (type === 'Society') return 'from-indigo-500 to-indigo-600';
    if (type === 'Trust') return 'from-rose-500 to-rose-600';
    if (type.includes('Limited') || type.includes('Company')) return 'from-purple-500 to-purple-600';
    if (type === 'Enterprise') return 'from-cyan-500 to-cyan-600';
    return 'from-slate-500 to-slate-600';
  };

  const getScaleBadgeColor = (scale: string) => {
    switch (scale) {
      case 'Small': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'MSME': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Large': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-300';
      case 'Inactive': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Suspended': return 'bg-red-100 text-red-700 border-red-300';
      case 'Under Audit': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Non-Compliant': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleOTPVerify = (otp: string) => {
    console.log('OTP Verified:', otp, 'for action:', otpAction);
    // In production, this would trigger the actual data operation
  };

  const handleApproveRequest = (requestId: string) => {
    setOTPAction(`Approve rectification request ${requestId}`);
    setShowOTPDialog(true);
  };

  const pendingRequests = mockRectificationRequests.filter(req => req.status === 'Pending');
  const approvedRequests = mockRectificationRequests.filter(req => req.status === 'Approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-2xl text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl mb-1">Business Entity Management</h1>
                  <p className="text-blue-100 text-sm">
                    Role-Based Data Permissions • OTP Authorization • Audit Trail Compliance
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 border-white/40 text-white mb-2">
                Logged in as: {currentUser.name}
              </Badge>
              <p className="text-sm text-blue-100">Role: {currentUser.role}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-5 h-5" />
                <p className="text-sm text-blue-100">Total Entities</p>
              </div>
              <p className="text-3xl">{mockBusinessEntities.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm text-blue-100">Compliant</p>
              </div>
              <p className="text-3xl">
                {mockBusinessEntities.filter(e => e.complianceStatus === 'Compliant').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5" />
                <p className="text-sm text-blue-100">Pending Requests</p>
              </div>
              <p className="text-3xl">{pendingRequests.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5" />
                <p className="text-sm text-blue-100">Total Roles</p>
              </div>
              <p className="text-3xl">
                {mockBusinessEntities.reduce((sum, e) => sum + e.assignedRoles.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Entity List */}
          <div className="col-span-4">
            <Card className="border-2 shadow-lg h-full">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Entities
                </CardTitle>
                <CardDescription>Select an entity to manage</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Entity Cards */}
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <div className="space-y-3 pr-3">
                    {filteredEntities.map(entity => (
                      <Card
                        key={entity.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedEntity?.id === entity.id
                            ? 'border-2 border-blue-500 bg-blue-50'
                            : 'border hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedEntity(entity)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getEntityTypeIcon(entity.entityType)}
                              <div>
                                <p className="text-sm">{entity.name}</p>
                                <p className="text-xs text-slate-500">{entity.entityType}</p>
                              </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                              selectedEntity?.id === entity.id ? 'rotate-90' : ''
                            }`} />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${getScaleBadgeColor(entity.entityScale)} border text-xs`}>
                              {entity.entityScale}
                            </Badge>
                            <Badge className={`${getStatusColor(entity.activeStatus)} border text-xs`}>
                              {entity.activeStatus}
                            </Badge>
                            <Badge className={`${getComplianceColor(entity.complianceStatus)} border text-xs`}>
                              {entity.complianceStatus}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            {entity.assignedRoles.length} roles • ₹{entity.turnover}Cr turnover
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Add New Entity Button */}
                <Button className="w-full mt-4 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4" />
                  Add New Entity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Entity Details */}
          <div className="col-span-8">
            {selectedEntity ? (
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  <TabsTrigger value="overview" className="gap-2">
                    <Building className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="gap-2">
                    <Users className="w-4 h-4" />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Permissions
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="gap-2">
                    <FileCheck className="w-4 h-4" />
                    Requests
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="gap-2">
                    <History className="w-4 h-4" />
                    Audit Trail
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <Card className="border-2 shadow-lg">
                    <CardHeader className={`bg-gradient-to-r ${getEntityTypeColor(selectedEntity.entityType)} text-white border-b-2`}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          {getEntityTypeIcon(selectedEntity.entityType)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{selectedEntity.name}</CardTitle>
                          <CardDescription className="text-white/80">
                            {selectedEntity.entityType} • {selectedEntity.entityScale} Scale
                          </CardDescription>
                          {selectedEntity.governanceModel && (
                            <p className="text-xs text-white/60 mt-1">
                              Governance: {selectedEntity.governanceModel}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-white/20 border-white/40 text-white">
                            ₹{selectedEntity.turnover}Cr
                          </Badge>
                          <p className="text-xs text-white/70 mt-1">{selectedEntity.employeeCount} Employees</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Registration Details */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm text-slate-600 mb-3">Registration Details</h3>
                          <div className="space-y-2">
                            {selectedEntity.registrationNumber && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Registration No:</span>
                                <span>{selectedEntity.registrationNumber}</span>
                              </div>
                            )}
                            {selectedEntity.gstin && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">GSTIN:</span>
                                <span>{selectedEntity.gstin}</span>
                              </div>
                            )}
                            {selectedEntity.pan && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">PAN:</span>
                                <span>{selectedEntity.pan}</span>
                              </div>
                            )}
                            {selectedEntity.incorporationDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Incorporation:</span>
                                <span>{new Date(selectedEntity.incorporationDate).toLocaleDateString('en-IN')}</span>
                              </div>
                            )}
                            {selectedEntity.cin && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">CIN:</span>
                                <span className="text-xs">{selectedEntity.cin}</span>
                              </div>
                            )}
                            {selectedEntity.msmeRegistration && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">MSME:</span>
                                <span className="text-xs">{selectedEntity.msmeRegistration}</span>
                              </div>
                            )}
                            {selectedEntity.coopRegistration && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Co-op Reg:</span>
                                <span className="text-xs">{selectedEntity.coopRegistration}</span>
                              </div>
                            )}
                            {selectedEntity.societyRegistration && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Society Reg:</span>
                                <span className="text-xs">{selectedEntity.societyRegistration}</span>
                              </div>
                            )}
                            {selectedEntity.trustDeed && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Trust Deed:</span>
                                <span className="text-xs">{selectedEntity.trustDeed}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm text-slate-600 mb-3">Contact Information</h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-slate-600">Email:</span>
                              <p className="text-blue-600">{selectedEntity.contactEmail}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Phone:</span>
                              <p>{selectedEntity.contactPhone}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Address:</span>
                              <p className="text-slate-700">{selectedEntity.registeredAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Brands & Applicable Laws */}
                      {(selectedEntity.brands || selectedEntity.applicableLaws) && (
                        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
                          {selectedEntity.brands && selectedEntity.brands.length > 0 && (
                            <div>
                              <h3 className="text-sm text-slate-600 mb-3">Brands</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEntity.brands.map((brand, idx) => (
                                  <Badge key={idx} className="bg-amber-100 text-amber-700 border-amber-300 border">
                                    {brand}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedEntity.applicableLaws && selectedEntity.applicableLaws.length > 0 && (
                            <div>
                              <h3 className="text-sm text-slate-600 mb-3">Applicable Laws & Standards</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEntity.applicableLaws.map((law, idx) => (
                                  <Badge key={idx} className="bg-blue-100 text-blue-700 border-blue-300 border text-xs">
                                    {law}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status & Compliance */}
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm text-slate-600 mb-3">Status & Scale</h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Entity Scale</p>
                              <Badge className={`${getScaleBadgeColor(selectedEntity.entityScale)} border`}>
                                {selectedEntity.entityScale}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Active Status</p>
                              <Badge className={`${getStatusColor(selectedEntity.activeStatus)} border`}>
                                {selectedEntity.activeStatus}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Compliance Status</p>
                              <Badge className={`${getComplianceColor(selectedEntity.complianceStatus)} border`}>
                                {selectedEntity.complianceStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm text-slate-600 mb-3">Audit Information</h3>
                          <div className="space-y-2 text-sm">
                            {selectedEntity.lastAuditDate && (
                              <div>
                                <span className="text-slate-600">Last Audit:</span>
                                <p>{new Date(selectedEntity.lastAuditDate).toLocaleDateString('en-IN')}</p>
                              </div>
                            )}
                            {selectedEntity.nextAuditDue && (
                              <div>
                                <span className="text-slate-600">Next Audit Due:</span>
                                <p className="text-orange-700">{new Date(selectedEntity.nextAuditDue).toLocaleDateString('en-IN')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl text-blue-700">{selectedEntity.assignedRoles.length}</p>
                          <p className="text-xs text-slate-600">Assigned Roles</p>
                        </div>
                        <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
                          <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl text-green-700">
                            {selectedEntity.assignedRoles.filter(r => r.isActive).length}
                          </p>
                          <p className="text-xs text-slate-600">Active Users</p>
                        </div>
                        <div className="text-center bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl text-purple-700">
                            {selectedEntity.assignedRoles.filter(r => r.otpEnabled).length}
                          </p>
                          <p className="text-xs text-slate-600">OTP Enabled</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles">
                  <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-green-600 to-blue-600 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>Role Assignments</CardTitle>
                            <CardDescription>
                              Manage user roles and permissions for {selectedEntity.name}
                            </CardDescription>
                          </div>
                        </div>
                        <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                          <Plus className="w-4 h-4" />
                          Assign Role
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {selectedEntity.assignedRoles.map(roleAssignment => (
                          <Card key={roleAssignment.id} className="border hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
                                      <UserCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p>{roleAssignment.personName}</p>
                                      <p className="text-sm text-slate-600">{roleAssignment.role}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                    <div>
                                      <p className="text-xs text-slate-500">Email</p>
                                      <p className="text-blue-600">{roleAssignment.personEmail}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Phone</p>
                                      <p>{roleAssignment.personPhone}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Assigned Date</p>
                                      <p>{new Date(roleAssignment.assignedDate).toLocaleDateString('en-IN')}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-3 mt-3">
                                    <Badge className={roleAssignment.isActive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-700'}>
                                      {roleAssignment.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    {roleAssignment.otpEnabled && (
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">
                                        <Shield className="w-3 h-3 mr-1" />
                                        OTP Enabled
                                      </Badge>
                                    )}
                                    {roleAssignment.digitalSignature && (
                                      <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">
                                        <Award className="w-3 h-3 mr-1" />
                                        Digital Signature
                                      </Badge>
                                    )}
                                  </div>

                                  {roleAssignment.lastOTPVerified && (
                                    <p className="text-xs text-slate-500 mt-2">
                                      Last OTP verified: {new Date(roleAssignment.lastOTPVerified).toLocaleString('en-IN')}
                                    </p>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions">
                  <EntityPermissionMatrix
                    entityType={selectedEntity.entityType}
                    roles={selectedEntity.assignedRoles.map(r => r.role)}
                  />
                </TabsContent>

                {/* Rectification Requests Tab */}
                <TabsContent value="requests">
                  <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-orange-600 to-yellow-600 p-3 rounded-xl">
                          <FileCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>Data Rectification Requests</CardTitle>
                          <CardDescription>
                            Review and approve data correction requests
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                          <TabsTrigger value="pending">
                            Pending ({pendingRequests.filter(r => r.entityId === selectedEntity.id).length})
                          </TabsTrigger>
                          <TabsTrigger value="approved">
                            Approved ({approvedRequests.filter(r => r.entityId === selectedEntity.id).length})
                          </TabsTrigger>
                          <TabsTrigger value="all">
                            All Requests
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                          <div className="space-y-4">
                            {mockRectificationRequests
                              .filter(req => req.entityId === selectedEntity.id && req.status === 'Pending')
                              .map(request => (
                                <Card key={request.id} className="border-2 border-orange-200 bg-orange-50/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <Badge className="bg-orange-100 text-orange-700 border-orange-300 mb-2">
                                          {request.status}
                                        </Badge>
                                        <p className="text-sm">{request.dataCategory} • {request.fieldName}</p>
                                        <p className="text-xs text-slate-500">
                                          Requested by {request.requestedBy} ({request.requestedByRole})
                                        </p>
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        {new Date(request.requestDate).toLocaleString('en-IN')}
                                      </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border mb-3">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Current Value</p>
                                          <p className="text-red-700">{request.currentValue}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Proposed Value</p>
                                          <p className="text-green-700">{request.proposedValue}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2 pt-2 border-t">
                                        <p className="text-xs text-slate-600"><strong>Justification:</strong></p>
                                        <p className="text-sm text-slate-700 mt-1">{request.justification}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {request.otpVerified ? (
                                          <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            OTP Verified
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-red-100 text-red-700 border-red-300 border text-xs">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            OTP Pending
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 hover:bg-red-50"
                                        >
                                          Reject
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                          onClick={() => handleApproveRequest(request.id)}
                                        >
                                          <Shield className="w-4 h-4" />
                                          Approve with OTP
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Approvers Status */}
                                    <div className="mt-3 pt-3 border-t">
                                      <p className="text-xs text-slate-600 mb-2">Approval Status:</p>
                                      <div className="flex gap-2">
                                        {request.approvers.map((approver, idx) => (
                                          <Badge
                                            key={idx}
                                            className={
                                              approver.status === 'Approved'
                                                ? 'bg-green-100 text-green-700 border-green-300 border text-xs'
                                                : 'bg-slate-100 text-slate-700 border-slate-300 border text-xs'
                                            }
                                          >
                                            {approver.approverRole}: {approver.status}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}

                            {mockRectificationRequests.filter(
                              req => req.entityId === selectedEntity.id && req.status === 'Pending'
                            ).length === 0 && (
                              <div className="text-center py-12 text-slate-500">
                                <FileCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>No pending requests</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="approved">
                          <div className="space-y-4">
                            {mockRectificationRequests
                              .filter(req => req.entityId === selectedEntity.id && req.status === 'Approved')
                              .map(request => (
                                <Card key={request.id} className="border-2 border-green-200 bg-green-50/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <Badge className="bg-green-100 text-green-700 border-green-300 mb-2">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          {request.status}
                                        </Badge>
                                        <p className="text-sm">{request.dataCategory} • {request.fieldName}</p>
                                        <p className="text-xs text-slate-500">
                                          Requested by {request.requestedBy} ({request.requestedByRole})
                                        </p>
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        {new Date(request.requestDate).toLocaleString('en-IN')}
                                      </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Old Value</p>
                                          <p className="line-through text-slate-500">{request.currentValue}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Updated Value</p>
                                          <p className="text-green-700">{request.proposedValue}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Approvers */}
                                    <div className="mt-3 space-y-2">
                                      {request.approvers.map((approver, idx) => (
                                        <div key={idx} className="bg-white p-2 rounded border text-xs">
                                          <div className="flex items-center justify-between">
                                            <span>
                                              <strong>{approver.approverRole}</strong> - {approver.approverName}
                                            </span>
                                            <div className="flex items-center gap-2">
                                              {approver.otpVerified && (
                                                <Badge className="bg-blue-100 text-blue-700 border-blue-300 border text-xs">
                                                  OTP ✓
                                                </Badge>
                                              )}
                                              <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs">
                                                {approver.status}
                                              </Badge>
                                            </div>
                                          </div>
                                          {approver.comments && (
                                            <p className="text-slate-600 mt-1">{approver.comments}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="all">
                          <div className="space-y-3">
                            {mockRectificationRequests
                              .filter(req => req.entityId === selectedEntity.id)
                              .map(request => (
                                <Card key={request.id} className="border">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm">{request.fieldName}</p>
                                        <p className="text-xs text-slate-500">{request.requestedBy}</p>
                                      </div>
                                      <Badge className={
                                        request.status === 'Approved'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-orange-100 text-orange-700'
                                      }>
                                        {request.status}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Audit Trail Tab */}
                <TabsContent value="audit">
                  <EntityAuditTrail
                    auditTrail={mockRectificationRequests
                      .filter(req => req.entityId === selectedEntity.id)
                      .flatMap(req => req.auditTrail)}
                    userRole={currentUser.role}
                    onExport={() => console.log('Export audit trail')}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-2 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-2">No Entity Selected</p>
                  <p className="text-slate-400 text-sm">Select a business entity from the list to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OTPAuthorizationDialog
        isOpen={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        onVerify={handleOTPVerify}
        userRole={currentUser.role}
        userName={currentUser.name}
        action={otpAction}
      />
    </div>
  );
}
