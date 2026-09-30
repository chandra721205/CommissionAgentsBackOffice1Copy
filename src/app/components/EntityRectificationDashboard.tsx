import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Users, 
  Eye, 
  EyeOff, 
  Download,
  Clock,
  Edit3,
  UserCheck,
  Scale,
  Settings,
  Upload,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EntityData {
  id: string;
  type: string;
  scaleCategory: string;
  registrationDate: string;
  lastVerificationDate: string;
  status: 'Active' | 'Under Rectification' | 'Locked';
}

interface ChangeRecord {
  changeNo: number;
  date: string;
  modifiedBy: string;
  verifiedBy: string[];
  changeType: string;
  status: 'Approved' | 'Pending Verification' | 'Denied';
}

interface PermissionRole {
  role: string;
  sharePercentage: number;
  dataRectificationRights: boolean;
  auditControl: boolean;
  otpRequired: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  approvers: string[];
  status: string;
  details: string;
}

export default function EntityRectificationDashboard() {
  const [viewMode, setViewMode] = useState<'Auditor' | 'Management' | 'Public'>('Management');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otp1Verified, setOtp1Verified] = useState(false);
  const [otp2Verified, setOtp2Verified] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Mock entity data
  const entityData: EntityData = {
    id: 'ENT-2024-00847',
    type: 'Private Limited Company',
    scaleCategory: 'Medium Enterprise',
    registrationDate: '2023-06-15',
    lastVerificationDate: '2024-10-01',
    status: 'Active'
  };

  // Change history
  const changeHistory: ChangeRecord[] = [
    {
      changeNo: 1,
      date: '2024-03-15',
      modifiedBy: 'Rajesh Kumar (Director)',
      verifiedBy: ['Priya Sharma', 'Amit Patel'],
      changeType: 'Director Addition',
      status: 'Approved'
    },
    {
      changeNo: 2,
      date: '2024-08-22',
      modifiedBy: 'Priya Sharma (Director)',
      verifiedBy: ['Rajesh Kumar', 'Amit Patel'],
      changeType: 'Registered Office Change',
      status: 'Approved'
    }
  ];

  const changesUsed = changeHistory.length;
  const changesAllowed = 3;
  const changesRemaining = changesAllowed - changesUsed;

  // Permission matrix
  const permissionMatrix: PermissionRole[] = [
    { role: 'Managing Director', sharePercentage: 45, dataRectificationRights: true, auditControl: true, otpRequired: true },
    { role: 'Director 2', sharePercentage: 30, dataRectificationRights: true, auditControl: false, otpRequired: true },
    { role: 'Director 3', sharePercentage: 25, dataRectificationRights: true, auditControl: false, otpRequired: true },
    { role: 'Statutory Auditor', sharePercentage: 0, dataRectificationRights: false, auditControl: true, otpRequired: false }
  ];

  // Audit logs
  const auditLogs: AuditLog[] = [
    {
      id: 'AUD-001',
      timestamp: '2024-08-22 14:30:00',
      action: 'Registered Office Change',
      performedBy: 'Priya Sharma',
      approvers: ['Rajesh Kumar', 'Amit Patel'],
      status: 'Approved',
      details: 'Changed registered office address from Mumbai to Pune'
    },
    {
      id: 'AUD-002',
      timestamp: '2024-03-15 10:15:00',
      action: 'Director Addition',
      performedBy: 'Rajesh Kumar',
      approvers: ['Priya Sharma', 'Amit Patel'],
      status: 'Approved',
      details: 'Added new director: Mr. Suresh Iyer'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500';
      case 'Under Rectification':
        return 'bg-amber-500';
      case 'Locked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Under Rectification':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Locked':
        return <Lock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleOtpSubmit = () => {
    if (otpStep === 1) {
      setOtpStep(2);
    } else if (otpStep === 2) {
      // Simulate OTP sending
      setTimeout(() => setOtp1Verified(true), 1500);
      setTimeout(() => setOtp2Verified(true), 2500);
      setTimeout(() => {
        setOtpStep(3);
      }, 3000);
    }
  };

  const maskData = (data: string, mask: boolean) => {
    if (!mask) return data;
    return '••••••••';
  };

  const shouldMaskData = viewMode === 'Public';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#D9F2FF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-slate-800 mb-2">Entity Rectification & Control Dashboard</h1>
            <p className="text-slate-600">Manage entity structural changes and compliance verification</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200 shadow-sm">
            <Button
              variant={viewMode === 'Auditor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('Auditor')}
              className={viewMode === 'Auditor' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}
            >
              <Shield className="w-4 h-4 mr-2" />
              Auditor
            </Button>
            <Button
              variant={viewMode === 'Management' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('Management')}
              className={viewMode === 'Management' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
            >
              <Users className="w-4 h-4 mr-2" />
              Management
            </Button>
            <Button
              variant={viewMode === 'Public' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('Public')}
              className={viewMode === 'Public' ? 'bg-gradient-to-r from-slate-600 to-slate-700' : ''}
            >
              {shouldMaskData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Public
            </Button>
          </div>
        </div>

        {/* 1. Entity Overview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#F7FAFC] via-[#D9F2FF] to-[#D4AF37]" />
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-[#D4AF37]" />
                    Registered Business Entity
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                      <Lock className="w-3 h-3 mr-1" />
                      {entityData.id}
                    </Badge>
                    <Badge className={`${getStatusColor(entityData.status)} text-white`}>
                      {getStatusIcon(entityData.status)}
                      <span className="ml-1">{entityData.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <AlertDescription className="text-amber-800 ml-2">
                  Entity structure changes allowed only <strong>3 times</strong> post registration. Further changes require full KYC re-verification.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <p className="text-slate-600 mb-1">Entity Type</p>
                  <p className="text-slate-800">{maskData(entityData.type, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <p className="text-slate-600 mb-1">Scale Category</p>
                  <p className="text-slate-800">{maskData(entityData.scaleCategory, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <p className="text-slate-600 mb-1">Registration Date</p>
                  <p className="text-slate-800">{maskData(entityData.registrationDate, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <p className="text-slate-600 mb-1">Last Verification</p>
                  <p className="text-slate-800">{maskData(entityData.lastVerificationDate, shouldMaskData)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Change Management Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                Change Management Tracker
              </CardTitle>
              <CardDescription>Track structural modifications to your entity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Change Attempts Used</span>
                  <span className="text-slate-900">
                    <strong className="text-[#D4AF37]">{changesUsed}</strong> / {changesAllowed}
                  </span>
                </div>
                <Progress 
                  value={(changesUsed / changesAllowed) * 100} 
                  className="h-3"
                />
                <p className="text-slate-600">
                  {changesRemaining > 0 
                    ? `${changesRemaining} change${changesRemaining > 1 ? 's' : ''} remaining before full re-verification required`
                    : 'Change limit reached - re-verification required for further changes'
                  }
                </p>
              </div>

              <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                    disabled={changesUsed >= changesAllowed}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Request Structural Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request Entity Structural Change</DialogTitle>
                    <DialogDescription>
                      Submit your change request. This will require 2-member OTP approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Change Type</Label>
                      <select className="w-full p-2 border border-slate-300 rounded-lg">
                        <option>Director Addition/Removal</option>
                        <option>Registered Office Change</option>
                        <option>Share Capital Modification</option>
                        <option>Name Change</option>
                        <option>Business Activity Change</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Change Details</Label>
                      <Textarea 
                        placeholder="Describe the structural change in detail..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supporting Documents</Label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-slate-500">PDF, DOC, DOCX (max 10MB)</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                      onClick={() => {
                        setChangeRequestOpen(false);
                        setOtpDialogOpen(true);
                        setOtpStep(1);
                      }}
                    >
                      Submit for Approval
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Change History Cards */}
              <div className="space-y-4">
                <h3 className="text-slate-700">Change History</h3>
                {changeHistory.map((change) => (
                  <motion.div
                    key={change.changeNo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-white">
                            Change #{change.changeNo}
                          </Badge>
                          <Badge className={
                            change.status === 'Approved' ? 'bg-emerald-500' :
                            change.status === 'Pending Verification' ? 'bg-amber-500' :
                            'bg-red-500'
                          }>
                            {change.status}
                          </Badge>
                        </div>
                        <p className="text-slate-800 mb-1">{change.changeType}</p>
                        <p className="text-slate-600">{maskData(change.date, shouldMaskData)} • Modified by {maskData(change.modifiedBy, shouldMaskData)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-slate-600">Verified by:</p>
                          {change.verifiedBy.map((verifier, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{maskData(verifier, shouldMaskData)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Permissions & Control Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                Permissions & Control Matrix
              </CardTitle>
              <CardDescription>Role-based permissions proportional to shareholding</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <AlertDescription className="text-blue-800 ml-2">
                  Minimum 2-member OTP approval required for all data rectifications
                </AlertDescription>
              </Alert>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Share %</TableHead>
                      <TableHead>Data Rectification</TableHead>
                      <TableHead>Audit Control</TableHead>
                      <TableHead>OTP Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionMatrix.map((permission, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{maskData(permission.role, shouldMaskData)}</TableCell>
                        <TableCell>
                          {permission.sharePercentage > 0 ? (
                            <Badge variant="outline" className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-100">
                              {permission.sharePercentage}%
                            </Badge>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {permission.dataRectificationRights ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {permission.auditControl ? (
                            <Shield className="w-5 h-5 text-blue-600" />
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {permission.otpRequired ? (
                            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Required</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800">
                  <strong>Exception:</strong> Individual Proprietor entities have single authority and do not require multi-member approval.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. OTP Authorization Modal */}
        <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>2-Member OTP Authorization</DialogTitle>
              <DialogDescription>
                Multi-factor authorization required for structural changes
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {otpStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <Alert className="bg-blue-50 border-blue-200">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      Select two authorized members to approve this change
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>First Approver</Label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg">
                      <option>Rajesh Kumar (Managing Director)</option>
                      <option>Priya Sharma (Director)</option>
                      <option>Amit Patel (Director)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Second Approver</Label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg">
                      <option>Priya Sharma (Director)</option>
                      <option>Amit Patel (Director)</option>
                      <option>Rajesh Kumar (Managing Director)</option>
                    </select>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                    onClick={() => setOtpStep(2)}
                  >
                    Proceed to OTP Verification
                  </Button>
                </motion.div>
              )}

              {otpStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center relative">
                        <AnimatePresence>
                          {!otp1Verified ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Clock className="w-8 h-8 text-slate-400" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <h4 className="text-slate-800 mb-2">Rajesh Kumar</h4>
                      <p className="text-slate-600 mb-3">Managing Director</p>
                      {otp1Verified ? (
                        <Badge className="bg-emerald-500">OTP Verified</Badge>
                      ) : (
                        <Badge variant="outline">OTP Sent</Badge>
                      )}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center">
                        <AnimatePresence>
                          {!otp2Verified ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Clock className="w-8 h-8 text-slate-400" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <h4 className="text-slate-800 mb-2">Priya Sharma</h4>
                      <p className="text-slate-600 mb-3">Director</p>
                      {otp2Verified ? (
                        <Badge className="bg-emerald-500">OTP Verified</Badge>
                      ) : (
                        <Badge variant="outline">OTP Sent</Badge>
                      )}
                    </div>
                  </div>

                  {!otp1Verified && !otp2Verified && (
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                      onClick={handleOtpSubmit}
                    >
                      Send OTP to Both Approvers
                    </Button>
                  )}

                  {otp1Verified && otp2Verified && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-slate-800 mb-2">Authorization Complete</h3>
                      <p className="text-slate-600 mb-4">
                        Change has been recorded in the audit trail
                      </p>
                      <p className="text-slate-500">
                        All structural modifications are logged and subject to compliance verification
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 5. Verification & Re-KYC Section */}
        {changesUsed >= changesAllowed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-red-300 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Re-Verification Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <AlertDescription className="text-red-800 ml-2">
                    Entity change limit reached. Future changes require full KYC re-verification and app-appointed verifier review.
                  </AlertDescription>
                </Alert>

                <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Initiate Re-Verification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>KYC Re-Verification Process</DialogTitle>
                      <DialogDescription>
                        Complete all steps to enable further entity modifications
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">1</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-1">Upload KYC Documents</h4>
                            <p className="text-slate-600">Updated incorporation certificate, PAN, address proof</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center">2</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-1">Assign Verification Officer</h4>
                            <p className="text-slate-600">Platform will assign independent verifier</p>
                          </div>
                          <Badge variant="outline">Pending</Badge>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center">3</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-1">Schedule Digital Interview</h4>
                            <p className="text-slate-600">Video verification with authorized signatories</p>
                          </div>
                          <Button size="sm" variant="outline" disabled>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center">4</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-1">Compliance Review</h4>
                            <p className="text-slate-600">Final verification and approval</p>
                          </div>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800">
                          <strong>Estimated Timeline:</strong> 5-7 business days for complete re-verification
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 6. Audit & Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                    Audit Trail & Change Logs
                  </CardTitle>
                  <CardDescription>Complete history of entity modifications</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div 
                      className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 cursor-pointer hover:from-slate-100 hover:to-slate-200 transition-colors"
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="bg-white">
                              {maskData(log.id, shouldMaskData)}
                            </Badge>
                            <Badge className="bg-emerald-500">{log.status}</Badge>
                          </div>
                          <h4 className="text-slate-800 mb-1">{log.action}</h4>
                          <p className="text-slate-600">
                            {maskData(log.timestamp, shouldMaskData)} • By {maskData(log.performedBy, shouldMaskData)}
                          </p>
                        </div>
                        {expandedLog === log.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLog === log.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-200"
                        >
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-slate-600 mb-2">Change Details:</p>
                              <p className="text-slate-800">{maskData(log.details, shouldMaskData)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 mb-2">Approved By:</p>
                              <div className="flex flex-wrap gap-2">
                                {log.approvers.map((approver, idx) => (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-emerald-800">{maskData(approver, shouldMaskData)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Change Certificate
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
