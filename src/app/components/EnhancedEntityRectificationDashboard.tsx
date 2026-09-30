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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  FileText, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
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
  ChevronUp,
  Mic,
  Globe,
  QrCode,
  Brain,
  Sparkles,
  FileCheck,
  Link2,
  Video,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EntityData {
  id: string;
  type: string;
  scaleCategory: string;
  registrationDate: string;
  lastVerificationDate: string;
  status: 'Active' | 'Under Rectification' | 'Locked';
  blockchainHash?: string;
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
  memberName: string;
  sharePercentage: number;
  dataRectificationRights: 'View' | 'Suggest' | 'Rectify' | 'Full Edit';
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

export default function EnhancedEntityRectificationDashboard() {
  const [viewMode, setViewMode] = useState<'Auditor' | 'Management' | 'Public'>('Management');
  const [language, setLanguage] = useState<'EN' | 'HI' | 'TE'>('EN');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [blockchainQROpen, setBlockchainQROpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otp1Verified, setOtp1Verified] = useState(false);
  const [otp2Verified, setOtp2Verified] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [kycProgress, setKycProgress] = useState({ upload: 50, review: 25, approve: 0 });

  // Mock entity data
  const entityData: EntityData = {
    id: 'ENT-2024-00847',
    type: 'Private Limited Company',
    scaleCategory: 'MSME',
    registrationDate: '2023-06-15',
    lastVerificationDate: '2024-10-01',
    status: 'Active',
    blockchainHash: '0x7d3f8c92...a1b4e6'
  };

  // Language translations
  const translations = {
    EN: {
      title: 'Entity Rectification & Control Dashboard',
      subtitle: 'Manage entity structural changes and compliance verification',
      registered: 'Registered Business Entity',
      changeLimit: 'Entity structure changes allowed only 3 times post registration',
      requestChange: 'Request Structural Change',
      viewHistory: 'View History',
      initiateKYC: 'Initiate Re-Verification'
    },
    HI: {
      title: 'इकाई सुधार और नियंत्रण डैशबोर्ड',
      subtitle: 'इकाई संरचना परिवर्तन और अनुपालन सत्यापन प्रबंधित करें',
      registered: 'पंजीकृत व्यावसायिक इकाई',
      changeLimit: 'पंजीकरण के बाद केवल 3 बार इकाई संरचना परिवर्तन की अनुमति है',
      requestChange: 'संरचनात्मक परिवर्तन का अनुरोध करें',
      viewHistory: 'इतिहास देखें',
      initiateKYC: 'पुनः सत्यापन शुरू करें'
    },
    TE: {
      title: 'ఎంటిటీ రెక్టిఫికేషన్ & కంట్రోల్ డాష్‌బోర్డ్',
      subtitle: 'ఎంటిటీ నిర్మాణ మార్పులు మరియు సమ్మతి ధృవీకరణను నిర్వహించండి',
      registered: 'నమోదు చేసుకున్న వ్యాపార సంస్థ',
      changeLimit: 'నమోదు తర్వాత కేవలం 3 సార్లు మాత్రమే ఎంటిటీ నిర్మాణ మార్పులు అనుమతించబడతాయి',
      requestChange: 'నిర్మాణాత్మక మార్పును అభ్యర్థించండి',
      viewHistory: 'చరిత్రను చూడండి',
      initiateKYC: 'పునః ధృవీకరణను ప్రారంభించండి'
    }
  };

  const t = translations[language];

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
    { role: 'Managing Director', memberName: 'Rajesh Kumar', sharePercentage: 45, dataRectificationRights: 'Full Edit', auditControl: true, otpRequired: true },
    { role: 'Director 2', memberName: 'Priya Sharma', sharePercentage: 30, dataRectificationRights: 'Rectify', auditControl: false, otpRequired: true },
    { role: 'Director 3', memberName: 'Amit Patel', sharePercentage: 25, dataRectificationRights: 'Suggest', auditControl: false, otpRequired: true },
    { role: 'Statutory Auditor', memberName: 'CA Suresh Iyer', sharePercentage: 0, dataRectificationRights: 'View', auditControl: true, otpRequired: false }
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
        return 'bg-[#27AE60]';
      case 'Under Rectification':
        return 'bg-[#F4D03F]';
      case 'Locked':
        return 'bg-[#E74C3C]';
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
      // Simulate OTP sending with pulse animation
      setTimeout(() => setOtp1Verified(true), 1500);
      setTimeout(() => setOtp2Verified(true), 2500);
      setTimeout(() => {
        setOtpStep(3);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 3000);
    }
  };

  const maskData = (data: string, mask: boolean) => {
    if (!mask) return data;
    return '••••••••';
  };

  const shouldMaskData = viewMode === 'Public';

  const getRightsColor = (rights: string) => {
    switch (rights) {
      case 'View': return 'bg-slate-100 text-slate-700';
      case 'Suggest': return 'bg-blue-100 text-blue-700';
      case 'Rectify': return 'bg-amber-100 text-amber-700';
      case 'Full Edit': return 'bg-[#27AE60] text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Language Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-slate-800 mb-2">{t.title}</h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </div>
          
          {/* Control Bar */}
          <div className="flex flex-wrap gap-2">
            {/* Language Toggle */}
            <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              {(['EN', 'HI', 'TE'] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? 'bg-[#F4D03F] text-slate-900 hover:bg-[#F4D03F]/90' : ''}
                >
                  <Globe className="w-3 h-3 mr-1" />
                  {lang}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'Auditor' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('Auditor')}
                      className={viewMode === 'Auditor' ? 'bg-gradient-to-r from-[#27AE60] to-[#A5D6A7]' : ''}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Auditor View - Full Access</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'Management' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('Management')}
                      className={viewMode === 'Management' ? 'bg-gradient-to-r from-blue-600 to-[#E0F7FA]' : ''}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Management View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'Public' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('Public')}
                      className={viewMode === 'Public' ? 'bg-gradient-to-r from-slate-600 to-slate-700' : ''}
                    >
                      {shouldMaskData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Public View - Masked Data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* 1️⃣ Entity Overview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg overflow-hidden rounded-[20px]">
            <div className="h-2 bg-gradient-to-r from-[#E0F7FA] via-[#A5D6A7] to-[#F4D03F]" />
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-[#F4D03F]" />
                    {t.registered}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {/* Immutable ID with Blockchain Badge */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-100 text-slate-700 border-slate-300 cursor-pointer hover:bg-slate-200 transition-all"
                            onClick={() => setBlockchainQROpen(true)}
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            {entityData.id}
                            <Link2 className="w-3 h-3 ml-1" />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Immutable ID - Blockchain Locked</p>
                          <p className="text-xs text-slate-400">Click for verification QR</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Badge className={`${getStatusColor(entityData.status)} text-white`}>
                      {getStatusIcon(entityData.status)}
                      <span className="ml-1">{entityData.status}</span>
                    </Badge>

                    {changesUsed >= 2 && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {changesRemaining} Change{changesRemaining !== 1 ? 's' : ''} Left
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-[12px]">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <AlertDescription className="text-amber-800 ml-2">
                  {t.changeLimit}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[12px] border border-slate-200">
                  <p className="text-slate-600 mb-1 text-sm">Entity Type</p>
                  <p className="text-slate-800">{maskData(entityData.type, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[12px] border border-blue-200">
                  <p className="text-slate-600 mb-1 text-sm">Scale Category</p>
                  <p className="text-slate-800">{maskData(entityData.scaleCategory, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[12px] border border-emerald-200">
                  <p className="text-slate-600 mb-1 text-sm">Registration Date</p>
                  <p className="text-slate-800">{maskData(entityData.registrationDate, shouldMaskData)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[12px] border border-purple-200">
                  <p className="text-slate-600 mb-1 text-sm">Last Verification</p>
                  <p className="text-slate-800">{maskData(entityData.lastVerificationDate, shouldMaskData)}</p>
                </div>
              </div>

              {/* Grok AI Insight */}
              {viewMode !== 'Public' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-[12px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-violet-900 mb-1">
                        <strong>AI Insight:</strong> MSME Category Entity
                      </p>
                      <p className="text-violet-700 text-sm">
                        Your entity qualifies for fast-track compliance (2-day audit). {changesRemaining} structural change{changesRemaining !== 1 ? 's' : ''} remaining before KYC re-verification required.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Blockchain QR Modal */}
        <Dialog open={blockchainQROpen} onOpenChange={setBlockchainQROpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#F4D03F]" />
                Blockchain Verification
              </DialogTitle>
              <DialogDescription>
                Entity ID locked on Polygon blockchain
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[12px] flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-slate-800">Entity ID: <strong>{entityData.id}</strong></p>
                <p className="text-slate-600 text-sm">Blockchain Hash:</p>
                <code className="text-xs bg-slate-100 px-3 py-1 rounded text-slate-700">
                  {entityData.blockchainHash}
                </code>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge className="bg-[#27AE60] text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Polygon Locked
                  </Badge>
                  <Badge variant="outline">Immutable</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2️⃣ Change Management Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-[#F4D03F]" />
                Change Management Tracker
              </CardTitle>
              <CardDescription>Track structural modifications to your entity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Change Attempts Used</span>
                  <span className="text-slate-900">
                    <strong className="text-[#F4D03F]">{changesUsed}</strong> / {changesAllowed}
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress 
                    value={(changesUsed / changesAllowed) * 100} 
                    className="h-3"
                  />
                </motion.div>
                <p className="text-slate-600 text-sm">
                  {changesRemaining > 0 
                    ? `${changesRemaining} change${changesRemaining > 1 ? 's' : ''} remaining before full re-verification required`
                    : 'Change limit reached - re-verification required for further changes'
                  }
                </p>
              </div>

              <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full md:w-auto h-[48px] rounded-[8px] bg-gradient-to-r from-[#F4D03F] to-[#F39C12] hover:from-[#F39C12] hover:to-[#F4D03F] text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    disabled={changesUsed >= changesAllowed}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t.requestChange}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request Entity Structural Change</DialogTitle>
                    <DialogDescription>
                      Submit your change request. Requires 2-member OTP approval (Companies Act Sec 179).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Change Type</Label>
                      <select className="w-full h-[64px] p-4 border border-slate-300 rounded-[8px] text-base">
                        <option>Director Addition/Removal</option>
                        <option>Registered Office Change (Sec 12)</option>
                        <option>Share Capital Modification (Sec 61-62)</option>
                        <option>Name Change (Sec 13)</option>
                        <option>Business Activity Change</option>
                        <option>Partnership Deed Amendment</option>
                        <option>Trust Deed Modification</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Change Details</Label>
                      <div className="relative">
                        <Textarea 
                          placeholder="Describe the structural change in detail..."
                          className="min-h-[100px] pr-12 rounded-[8px]"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`absolute top-2 right-2 rounded-full ${voiceActive ? 'bg-red-100 text-red-600' : 'bg-slate-100'}`}
                          onClick={() => setVoiceActive(!voiceActive)}
                        >
                          <Mic className={`w-4 h-4 ${voiceActive ? 'animate-pulse' : ''}`} />
                        </Button>
                      </div>
                      {voiceActive && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-600 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                          Recording...
                        </motion.p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Supporting Documents</Label>
                      <div className="border-2 border-dashed border-slate-300 rounded-[12px] p-6 text-center hover:border-[#F4D03F] transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-slate-500 text-sm">PDF, DOC, DOCX (max 10MB)</p>
                        <Button size="sm" variant="ghost" className="mt-2">
                          <Mic className="w-3 h-3 mr-1" />
                          Describe via voice
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-[48px] rounded-[8px] bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] hover:from-[#A5D6A7] hover:to-[#27AE60] transition-all duration-300"
                      onClick={() => {
                        setChangeRequestOpen(false);
                        setOtpDialogOpen(true);
                        setOtpStep(1);
                        setOtp1Verified(false);
                        setOtp2Verified(false);
                      }}
                    >
                      Submit for 2-Member Approval
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Change History Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-700">Change History</h3>
                  <Button variant="outline" size="sm" className="rounded-[8px]">
                    <Download className="w-4 h-4 mr-2" />
                    {t.viewHistory}
                  </Button>
                </div>
                {changeHistory.map((change, idx) => (
                  <motion.div
                    key={change.changeNo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                    className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-[12px] border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-white">
                            Change #{change.changeNo}
                          </Badge>
                          <Badge className={
                            change.status === 'Approved' ? 'bg-[#27AE60]' :
                            change.status === 'Pending Verification' ? 'bg-[#F4D03F] text-slate-900' :
                            'bg-[#E74C3C]'
                          }>
                            {change.status}
                          </Badge>
                        </div>
                        <p className="text-slate-800 mb-1">{change.changeType}</p>
                        <p className="text-slate-600 text-sm">{maskData(change.date, shouldMaskData)} • Modified by {maskData(change.modifiedBy, shouldMaskData)}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <p className="text-slate-600 text-sm">OTP Verified by:</p>
                          {change.verifiedBy.map((verifier, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-[#27AE60] text-sm">
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

        {/* 3️⃣ Permissions & Control Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-[#F4D03F]" />
                Permissions & Control Matrix
              </CardTitle>
              <CardDescription>Role-based permissions proportional to shareholding (Companies Act compliance)</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-blue-50 border-blue-200 rounded-[12px]">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <AlertDescription className="text-blue-800 ml-2">
                  <strong>2-Member OTP Rule Active:</strong> Minimum 2 approvals required for all data rectifications (OTP shared to both)
                </AlertDescription>
              </Alert>

              <div className="overflow-x-auto rounded-[12px] border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <TableHead>Role</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Share %</TableHead>
                      <TableHead>Rectification Rights</TableHead>
                      <TableHead>Audit Control</TableHead>
                      <TableHead>OTP Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionMatrix.map((permission, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{permission.role}</TableCell>
                        <TableCell>{maskData(permission.memberName, shouldMaskData)}</TableCell>
                        <TableCell>
                          {permission.sharePercentage > 0 ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-gradient-to-r from-[#F4D03F]/20 to-amber-100">
                                {permission.sharePercentage}%
                              </Badge>
                              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#F4D03F] to-amber-500"
                                  style={{ width: `${permission.sharePercentage}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRightsColor(permission.dataRectificationRights)}>
                            {permission.dataRectificationRights}
                          </Badge>
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
                            <Badge className="bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] text-white">
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

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-[12px]">
                <p className="text-amber-800 text-sm">
                  <strong>Exception:</strong> Individual Proprietor entities have single authority (OTP from 1 member only). All other entity types require minimum 2-member OTP approval per governance norms.
                </p>
              </div>

              {/* Grok AI Insight for Permissions */}
              {viewMode === 'Auditor' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-[12px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-violet-900 mb-1">
                        <strong>AI Insight:</strong> Permissions Compliance Check
                      </p>
                      <p className="text-violet-700 text-sm">
                        Current permission matrix complies with Companies Act Sec 149-152. Managing Director (45%) has appropriate full edit rights. All other directors have proportional access.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 4️⃣ OTP Authorization Modal */}
        <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#F4D03F]" />
                2-Member OTP Authorization
              </DialogTitle>
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
                  <Alert className="bg-blue-50 border-blue-200 rounded-[12px]">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      Select two authorized members to approve this change
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>First Approver (Partner 1)</Label>
                    <select className="w-full h-[64px] p-4 border border-slate-300 rounded-[8px] text-base">
                      <option>Rajesh Kumar (Managing Director - 45%)</option>
                      <option>Priya Sharma (Director - 30%)</option>
                      <option>Amit Patel (Director - 25%)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Second Approver (Partner 2)</Label>
                    <select className="w-full h-[64px] p-4 border border-slate-300 rounded-[8px] text-base">
                      <option>Priya Sharma (Director - 30%)</option>
                      <option>Amit Patel (Director - 25%)</option>
                      <option>Rajesh Kumar (Managing Director - 45%)</option>
                    </select>
                  </div>

                  {/* Biometrics Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-slate-800">Enable Biometric 2FA</p>
                        <p className="text-slate-600 text-sm">Fingerprint/Face ID verification</p>
                      </div>
                    </div>
                    <input type="checkbox" className="w-12 h-6" />
                  </div>

                  <Button 
                    className="w-full h-[48px] rounded-[8px] bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] hover:from-[#A5D6A7] hover:to-[#27AE60] transition-all duration-300"
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
                    {/* Approver 1 OTP Ring */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[12px] border border-slate-200 text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white border-4 border-[#27AE60] flex items-center justify-center relative">
                        <AnimatePresence mode="wait">
                          {!otp1Verified ? (
                            <motion.div
                              key="waiting"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="relative"
                            >
                              <Clock className="w-10 h-10 text-slate-400" />
                              <motion.div
                                className="absolute inset-0 border-4 border-[#27AE60] rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{ 
                                  borderTopColor: 'transparent',
                                  borderRightColor: 'transparent'
                                }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="verified"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <CheckCircle2 className="w-10 h-10 text-[#27AE60]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <h4 className="text-slate-800 mb-2">Rajesh Kumar</h4>
                      <p className="text-slate-600 mb-3 text-sm">Managing Director</p>
                      {otp1Verified ? (
                        <Badge className="bg-[#27AE60]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          OTP Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">OTP Sent</Badge>
                      )}
                    </div>

                    {/* Approver 2 OTP Ring */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[12px] border border-slate-200 text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white border-4 border-[#27AE60] flex items-center justify-center relative">
                        <AnimatePresence mode="wait">
                          {!otp2Verified ? (
                            <motion.div
                              key="waiting"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="relative"
                            >
                              <Clock className="w-10 h-10 text-slate-400" />
                              <motion.div
                                className="absolute inset-0 border-4 border-[#27AE60] rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{ 
                                  borderTopColor: 'transparent',
                                  borderRightColor: 'transparent'
                                }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="verified"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <CheckCircle2 className="w-10 h-10 text-[#27AE60]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <h4 className="text-slate-800 mb-2">Priya Sharma</h4>
                      <p className="text-slate-600 mb-3 text-sm">Director</p>
                      {otp2Verified ? (
                        <Badge className="bg-[#27AE60]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          OTP Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">OTP Sent</Badge>
                      )}
                    </div>
                  </div>

                  {!otp1Verified && !otp2Verified && (
                    <Button 
                      className="w-full h-[48px] rounded-[8px] bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] hover:from-[#A5D6A7] hover:to-[#27AE60] transition-all duration-300"
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] flex items-center justify-center relative overflow-hidden"
                      >
                        <CheckCircle2 className="w-16 h-16 text-white z-10" />
                        {showSuccess && (
                          <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 bg-[#F4D03F] rounded-full"
                          />
                        )}
                      </motion.div>
                      <h3 className="text-slate-800 mb-2">Authorization Complete!</h3>
                      <p className="text-slate-600 mb-4">
                        Change has been recorded in the audit trail
                      </p>
                      <Alert className="bg-green-50 border-green-200 rounded-[12px]">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <AlertDescription className="text-green-800 ml-2">
                          All structural modifications logged and subject to compliance verification
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 5️⃣ Verification & Re-KYC Section */}
        {changesUsed >= changesAllowed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-[#E74C3C] shadow-lg rounded-[20px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#E74C3C]">
                  <AlertTriangle className="w-5 h-5" />
                  Re-Verification Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-gradient-to-r from-red-50 to-orange-50 border-[#E74C3C] rounded-[12px]">
                  <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
                  <AlertDescription className="text-red-800 ml-2">
                    ⚠ Entity change limit reached. Future changes require full KYC re-verification and app-appointed verifier review.
                  </AlertDescription>
                </Alert>

                <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto h-[48px] rounded-[8px] bg-gradient-to-r from-[#E74C3C] to-orange-600 hover:from-orange-600 hover:to-[#E74C3C] text-white transition-all duration-300">
                      <UserCheck className="w-4 h-4 mr-2" />
                      {t.initiateKYC}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>KYC Re-Verification Process</DialogTitle>
                      <DialogDescription>
                        Complete all steps to enable further entity modifications (5-7 business days)
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Progress Overview */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#27AE60] text-white flex items-center justify-center text-xl">
                            {kycProgress.upload}%
                          </div>
                          <p className="text-sm text-slate-600">Upload</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl">
                            {kycProgress.review}%
                          </div>
                          <p className="text-sm text-slate-600">Review</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-slate-300 text-white flex items-center justify-center text-xl">
                            {kycProgress.approve}%
                          </div>
                          <p className="text-sm text-slate-600">Approve</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-[12px] border border-green-200">
                          <div className="w-12 h-12 rounded-full bg-[#27AE60] text-white flex items-center justify-center flex-shrink-0 text-xl">1</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-2">Upload KYC Documents</h4>
                            <p className="text-slate-600 mb-3 text-sm">Updated incorporation certificate, PAN, address proof</p>
                            <div className="border-2 border-dashed border-green-300 rounded-[8px] p-4 text-center bg-white">
                              <Upload className="w-6 h-6 mx-auto mb-2 text-green-600" />
                              <p className="text-slate-600 text-sm mb-2">Drag files or click to upload</p>
                              <Button size="sm" variant="outline">
                                <Mic className="w-3 h-3 mr-1" />
                                Describe via voice
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[12px] border border-slate-200">
                          <div className="w-12 h-12 rounded-full bg-slate-300 text-white flex items-center justify-center flex-shrink-0 text-xl">2</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-2">Assign Verification Officer</h4>
                            <p className="text-slate-600 mb-3 text-sm">Platform will assign independent verifier (CA/CS/Advocate)</p>
                            <Badge variant="outline">Pending Document Upload</Badge>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[12px] border border-slate-200">
                          <div className="w-12 h-12 rounded-full bg-slate-300 text-white flex items-center justify-center flex-shrink-0 text-xl">3</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-2">Schedule Digital Interview</h4>
                            <p className="text-slate-600 mb-3 text-sm">Video verification with authorized signatories</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-slate-400" />
                              <select className="flex-1 h-[48px] p-2 border border-slate-300 rounded-[8px] text-sm" disabled>
                                <option>Select date & time</option>
                              </select>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                              <Video className="w-4 h-4" />
                              <span>Video interview via secure link</span>
                            </div>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[12px] border border-slate-200">
                          <div className="w-12 h-12 rounded-full bg-slate-300 text-white flex items-center justify-center flex-shrink-0 text-xl">4</div>
                          <div className="flex-1">
                            <h4 className="text-slate-800 mb-2">Compliance Review</h4>
                            <p className="text-slate-600 text-sm">Final verification and approval</p>
                            <Badge variant="outline" className="mt-2">Pending Previous Steps</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Grok AI Insight */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-[12px]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-violet-900 mb-1">
                              <strong>Grok AI Insight:</strong> MSME Scale—Fast-Track Audit
                            </p>
                            <p className="text-violet-700 text-sm">
                              As an MSME entity, you qualify for expedited re-verification (2 days instead of 7). Priority verifier assignment available.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                        <p className="text-blue-800 text-sm">
                          <strong>Estimated Timeline:</strong> 2-7 business days for complete re-verification (MSME: 2 days, Others: 5-7 days)
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 6️⃣ Audit & Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#F4D03F]" />
                    Audit Trail & Change Logs
                  </CardTitle>
                  <CardDescription>Complete timeline: Suggested → Verified → Approved → Locked</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-[8px]">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border border-slate-200 rounded-[12px] overflow-hidden">
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
                            <Badge className="bg-[#27AE60]">{log.status}</Badge>
                          </div>
                          <h4 className="text-slate-800 mb-1">{log.action}</h4>
                          <p className="text-slate-600 text-sm">
                            {maskData(log.timestamp, shouldMaskData)} • By {maskData(log.performedBy, shouldMaskData)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {log.approvers.slice(0, 2).map((approver, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] flex items-center justify-center text-white text-xs">
                                  {approver.charAt(0)}
                                </div>
                                <span className="text-xs text-slate-600">{maskData(approver, shouldMaskData)}</span>
                              </div>
                            ))}
                          </div>
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
                          transition={{ type: 'spring', stiffness: 100 }}
                          className="border-t border-slate-200"
                        >
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-slate-600 mb-2 text-sm">Change Details:</p>
                              <p className="text-slate-800">{maskData(log.details, shouldMaskData)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 mb-2 text-sm">Approved By:</p>
                              <div className="flex flex-wrap gap-2">
                                {log.approvers.map((approver, idx) => (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-[8px]">
                                    <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                                    <span className="text-green-800 text-sm">{maskData(approver, shouldMaskData)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-[8px]">
                              <Download className="w-4 h-4 mr-2" />
                              View Change Certificate (PDF)
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Grok AI Insight for Audit */}
              {viewMode === 'Auditor' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-[12px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-violet-900 mb-1">
                        <strong>AI Insight:</strong> Audit Trail Compliance
                      </p>
                      <p className="text-violet-700 text-sm">
                        All changes properly documented with 2-member OTP verification. Audit trail meets Companies Act reporting requirements. No anomalies detected.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 7️⃣ Confidentiality & GDPR Notice */}
        {viewMode === 'Public' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Alert className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300 rounded-[20px]">
              <Lock className="w-5 h-5 text-slate-600" />
              <AlertDescription className="text-slate-700 ml-2">
                <strong>Public View Active:</strong> Sensitive data fields are masked for confidentiality. Full access available in Management/Auditor views.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {viewMode !== 'Public' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 rounded-[20px]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-violet-900 mb-1">
                      <strong>Grok Insight:</strong> GDPR Purpose & Pvt Co Compliance
                    </p>
                    <p className="text-violet-700 text-sm">
                      As a Private Limited Company, director and shareholder data is restricted to authorized personnel only. This complies with GDPR data minimization principles and Indian data protection norms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
