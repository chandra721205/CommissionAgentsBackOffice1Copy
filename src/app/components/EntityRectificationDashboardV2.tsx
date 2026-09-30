import React, { useState, useMemo } from 'react';
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
  Globe,
  QrCode,
  Brain,
  Sparkles,
  Link2,
  Mic,
  Building,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// -------------------------------------------------------------
// TRADIE Entity Rectification & Control Dashboard
// Complete post-registration governance system with:
// - 3-attempt change limit enforcement
// - Dual-OTP approval workflows
// - Role-based permissions matrix
// - Multi-language support (EN/HI/TE)
// - Blockchain verification
// - AI-powered insights
// - Responsive design (mobile 360×800, web 1440×1024)
// -------------------------------------------------------------

interface EntityData {
  id: string;
  name: string;
  type: string;
  scale: string;
  registrationDate: string;
  lastVerificationDate: string;
  status: 'Active' | 'Under Rectification' | 'Locked';
  blockchainHash?: string;
}

interface ChangeRecord {
  number: number;
  date: string;
  modifiedBy: string;
  approvers: string[];
  changeType: string;
  status: 'Approved' | 'Pending' | 'Denied';
}

interface PermissionRole {
  role: string;
  share: number;
  rectificationRights: string;
  auditControl: string;
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

export default function EntityRectificationDashboardV2() {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ENT-PSR-001');
  const [viewMode, setViewMode] = useState<'Management' | 'Auditor' | 'Public'>('Management');
  const [language, setLanguage] = useState<'EN' | 'HI' | 'TE'>('EN');
  const [activeTab, setActiveTab] = useState<'profile' | 'rectification' | 'authorized' | 'audit'>('profile');
  
  // Dialog states
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [blockchainQROpen, setBlockchainQROpen] = useState(false);
  
  // OTP workflow
  const [otpStep, setOtpStep] = useState(1);
  const [otpData, setOtpData] = useState({
    details: '',
    otp1: '',
    otp2: '',
    approver1: '',
    approver2: ''
  });
  const [otp1Verified, setOtp1Verified] = useState(false);
  const [otp2Verified, setOtp2Verified] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  // Language translations
  const translations = {
    EN: {
      title: 'Entity Rectification & Control Dashboard',
      subtitle: 'Post-registration governance with dual-OTP approvals and audit-ready logs',
      registeredAgents: 'Registered Commission Agents',
      entityOverview: 'Entity Overview',
      immutableID: 'Immutable Entity ID',
      entityType: 'Entity Type',
      scaleCategory: 'Scale Category',
      registrationDate: 'Registration Date',
      lastVerification: 'Last Verification',
      changeLimit: 'Entity structure changes allowed only 3 times post registration. Further changes require full KYC re-verification.',
      changeTracker: 'Change Management Tracker',
      requestChange: 'Request Structural Change',
      changeHistory: 'Change History',
      permissions: 'Permissions & Control Matrix',
      role: 'Role',
      share: 'Share %',
      rectificationRights: 'Data Rectification Rights',
      auditControl: 'Audit Control',
      otpRequired: 'OTP Required',
      required: 'Required',
      no: 'No',
      initiateKYC: 'Initiate Re-KYC & Verification'
    },
    HI: {
      title: 'इकाई सुधार और नियंत्रण डैशबोर्ड',
      subtitle: 'पंजीकरण के बाद दोहरे-ओटीपी अनुमोदन और लेखा परीक्षा के साथ शासन',
      registeredAgents: 'पंजीकृत कमीशन एजेंट',
      entityOverview: 'इकाई अवलोकन',
      immutableID: 'अपरिवर्तनीय इकाई आईडी',
      entityType: 'इकाई प्रकार',
      scaleCategory: 'पैमाने की श्रेणी',
      registrationDate: 'पंजीकरण तिथि',
      lastVerification: 'अंतिम सत्यापन',
      changeLimit: 'पंजीकरण के बाद केवल 3 बार इकाई संरचना परिवर्तन की अनुमति है। आगे के परिवर्तनों के लिए पूर्ण केवाईसी पुनः सत्यापन आवश्यक है।',
      changeTracker: 'परिवर्तन प्रबंधन ट्रैकर',
      requestChange: 'संरचनात्मक परिवर्तन का अनुरोध करें',
      changeHistory: 'परिवर्तन इतिहास',
      permissions: 'अनुमतियाँ और नियंत्रण मैट्रिक्स',
      role: 'भूमिका',
      share: 'शेयर %',
      rectificationRights: 'डेटा सुधार अधिकार',
      auditControl: 'लेखा परीक्षा नियंत्रण',
      otpRequired: 'ओटीपी आवश्यक',
      required: 'आवश्यक',
      no: 'नहीं',
      initiateKYC: 'पुनः केवाईसी और सत्यापन शुरू करें'
    },
    TE: {
      title: 'ఎంటిటీ రెక్టిఫికేషన్ & కంట్రోల్ డాష్‌బోర్డ్',
      subtitle: 'నమోదు తర్వాత ద్వంద్వ-OTP ఆమోదాలు మరియు ఆడిట్-రెడీ లాగ్‌లతో పాలన',
      registeredAgents: 'నమోదు చేసుకున్న కమిషన్ ఏజెంట్లు',
      entityOverview: 'ఎంటిటీ అవలోకనం',
      immutableID: 'మార్చలేని ఎంటిటీ ID',
      entityType: 'ఎంటిటీ రకం',
      scaleCategory: 'స్కేల్ వర్గం',
      registrationDate: 'నమోదు తేదీ',
      lastVerification: 'చివరి ధృవీకరణ',
      changeLimit: 'నమోదు తర్వాత కేవలం 3 సార్లు మాత్రమే ఎంటిటీ నిర్మాణ మార్పులు అనుమతించబడతాయి। తదుపరి మార్పులకు పూర్తి KYC పునః ధృవీకరణ అవసరం।',
      changeTracker: 'మార్పు నిర్వహణ ట్రాకర్',
      requestChange: 'నిర్మాణాత్మక మార్పును అభ్యర్థించండి',
      changeHistory: 'మార్పు చరిత్ర',
      permissions: 'అనుమతులు & నియంత్రణ మాట్రిక్స్',
      role: 'పాత్ర',
      share: 'వాటా %',
      rectificationRights: 'డేటా రెక్టిఫికేషన్ హక్కులు',
      auditControl: 'ఆడిట్ నియంత్రణ',
      otpRequired: 'OTP అవసరం',
      required: 'అవసరం',
      no: 'కాదు',
      initiateKYC: 'పునః KYC & ధృవీకరణను ప్రారంభించండి'
    }
  };

  const t = translations[language];

  // Mock entities data
  const entities: EntityData[] = [
    {
      id: 'ENT-PSR-001',
      name: 'PSR & Co',
      type: 'Partnership',
      scale: 'MSME',
      status: 'Active',
      registrationDate: '2024-04-12',
      lastVerificationDate: '2025-03-05',
      blockchainHash: '0x7a3f9c84...b2e5d7'
    },
    {
      id: 'ENT-RSN-002',
      name: 'Ravindra & Sons',
      type: 'Family Enterprise',
      scale: 'Small',
      status: 'Active',
      registrationDate: '2023-11-03',
      lastVerificationDate: '2025-01-22',
      blockchainHash: '0x9b4e7d12...c3f6a8'
    },
    {
      id: 'ENT-KAT-003',
      name: 'Kakatiya Traders Pvt. Ltd.',
      type: 'Private Limited Company',
      scale: 'Medium',
      status: 'Active',
      registrationDate: '2022-08-19',
      lastVerificationDate: '2024-12-14',
      blockchainHash: '0x2c7d8e45...a1b9f3'
    }
  ];

  const selectedEntity = useMemo(() => 
    entities.find(e => e.id === selectedEntityId) || entities[0],
    [selectedEntityId]
  );

  // Change history by entity
  const changeHistoryMap: Record<string, ChangeRecord[]> = {
    'ENT-PSR-001': [
      {
        number: 1,
        date: '2025-06-18',
        modifiedBy: 'Managing Partner',
        approvers: ['Partner A', 'Partner B'],
        changeType: 'Registered Office Change',
        status: 'Approved'
      }
    ],
    'ENT-RSN-002': [
      {
        number: 1,
        date: '2024-09-07',
        modifiedBy: 'Karta',
        approvers: ['Karta', 'Member A'],
        changeType: 'Member Addition',
        status: 'Approved'
      },
      {
        number: 2,
        date: '2025-05-29',
        modifiedBy: 'Member A',
        approvers: ['Karta', 'Member A'],
        changeType: 'Business Name Change',
        status: 'Approved'
      }
    ],
    'ENT-KAT-003': [
      {
        number: 1,
        date: '2023-12-10',
        modifiedBy: 'Director',
        approvers: ['Director A', 'CS'],
        changeType: 'Director Addition',
        status: 'Approved'
      },
      {
        number: 2,
        date: '2024-06-02',
        modifiedBy: 'CS',
        approvers: ['Director A', 'CFO'],
        changeType: 'Share Capital Modification',
        status: 'Approved'
      },
      {
        number: 3,
        date: '2025-03-11',
        modifiedBy: 'CFO',
        approvers: ['Director A', 'Director B'],
        changeType: 'Registered Office Change',
        status: 'Approved'
      }
    ]
  };

  const changeHistory = changeHistoryMap[selectedEntityId] || [];
  const changesUsed = changeHistory.length;
  const changesAllowed = 3;
  const changesRemaining = changesAllowed - changesUsed;
  const changeLimitReached = changesUsed >= changesAllowed;

  // Permission matrix by entity type
  const permissionMatrixMap: Record<string, PermissionRole[]> = {
    'ENT-PSR-001': [
      { role: 'Managing Partner', share: 40, rectificationRights: 'Finalize', auditControl: 'Approve', otpRequired: true },
      { role: 'Partner', share: 35, rectificationRights: 'Propose', auditControl: 'Review', otpRequired: true },
      { role: 'Auditor', share: 0, rectificationRights: 'Suggest', auditControl: 'Audit Trail', otpRequired: false }
    ],
    'ENT-RSN-002': [
      { role: 'Karta', share: 51, rectificationRights: 'Finalize', auditControl: 'Approve', otpRequired: true },
      { role: 'Member', share: 25, rectificationRights: 'Request', auditControl: 'Review', otpRequired: true },
      { role: 'Auditor', share: 0, rectificationRights: 'Suggest', auditControl: 'Audit Trail', otpRequired: false }
    ],
    'ENT-KAT-003': [
      { role: 'Director', share: 45, rectificationRights: 'Finalize', auditControl: 'Approve', otpRequired: true },
      { role: 'Company Secretary', share: 0, rectificationRights: 'Rectify Ops', auditControl: 'Compliance', otpRequired: true },
      { role: 'CFO', share: 0, rectificationRights: 'Rectify Financials', auditControl: 'Approve Financials', otpRequired: true },
      { role: 'Auditor', share: 0, rectificationRights: 'Suggest', auditControl: 'Audit Trail', otpRequired: false }
    ]
  };

  const permissionMatrix = permissionMatrixMap[selectedEntityId] || [];

  const maskData = (data: string) => (viewMode === 'Public' ? '••••••' : data);

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
    if (!otpData.details || !otpData.otp1 || !otpData.otp2 || !otpData.approver1 || !otpData.approver2) {
      return;
    }

    // Simulate OTP verification
    setTimeout(() => setOtp1Verified(true), 1500);
    setTimeout(() => setOtp2Verified(true), 2500);
    setTimeout(() => {
      setOtpDialogOpen(false);
      setOtp1Verified(false);
      setOtp2Verified(false);
      setOtpData({ details: '', otp1: '', otp2: '', approver1: '', approver2: '' });
      // In real app, would update change history here
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-slate-800 mb-2">{t.title}</h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </div>
          
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
            <TooltipProvider>
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'Auditor' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('Auditor')}
                      className={viewMode === 'Auditor' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : ''}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Auditor View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'Management' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('Management')}
                      className={viewMode === 'Management' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : ''}
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
                      className={viewMode === 'Public' ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white' : ''}
                    >
                      {viewMode === 'Public' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Public View (Masked)</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Entities List */}
          <aside className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#F7FAFC] via-[#D9F2FF] to-[#D4AF37]" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                  {t.registeredAgents}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {entities.map((entity) => (
                  <button
                    key={entity.id}
                    onClick={() => setSelectedEntityId(entity.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      selectedEntityId === entity.id
                        ? 'border-[#D4AF37] bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] shadow-md'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-slate-900 mb-1">{entity.name}</div>
                        <div className="text-xs text-slate-600">{entity.type} • {entity.scale}</div>
                      </div>
                      <Badge className={`${getStatusColor(entity.status)} text-white text-xs`}>
                        {getStatusIcon(entity.status)}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{entity.id}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Main Panel */}
          <main className="lg:col-span-9 space-y-6">
            {/* Entity Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px] overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-[#F7FAFC] via-[#D9F2FF] to-[#D4AF37]" />
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-[#D4AF37]" />
                        {t.entityOverview}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
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
                                {selectedEntity.id}
                                <Link2 className="w-3 h-3 ml-1" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Immutable ID - Blockchain Locked</p>
                              <p className="text-xs text-slate-400">Click for verification QR</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Badge className={`${getStatusColor(selectedEntity.status)} text-white`}>
                          {getStatusIcon(selectedEntity.status)}
                          <span className="ml-1">{selectedEntity.status}</span>
                        </Badge>

                        {changesUsed >= 2 && (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {changesRemaining} Change{changesRemaining !== 1 ? 's' : ''} Left
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      {changeLimitReached ? (
                        <Button
                          onClick={() => setKycDialogOpen(true)}
                          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {t.initiateKYC}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setChangeRequestOpen(true)}
                          className="bg-gradient-to-r from-[#F4D03F] to-[#F39C12] hover:from-[#F39C12] hover:to-[#F4D03F] text-slate-900 shadow-lg"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          {t.requestChange}
                        </Button>
                      )}
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
                      <p className="text-slate-600 mb-1 text-sm">{t.entityType}</p>
                      <p className="text-slate-800">{maskData(selectedEntity.type)}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[12px] border border-blue-200">
                      <p className="text-slate-600 mb-1 text-sm">{t.scaleCategory}</p>
                      <p className="text-slate-800">{maskData(selectedEntity.scale)}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[12px] border border-emerald-200">
                      <p className="text-slate-600 mb-1 text-sm">{t.registrationDate}</p>
                      <p className="text-slate-800">{maskData(selectedEntity.registrationDate)}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[12px] border border-purple-200">
                      <p className="text-slate-600 mb-1 text-sm">{t.lastVerification}</p>
                      <p className="text-slate-800">{maskData(selectedEntity.lastVerificationDate)}</p>
                    </div>
                  </div>

                  {/* Change Progress Tracker */}
                  <div className="space-y-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[12px] border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 text-sm">Change Attempts Used</span>
                      <span className="text-slate-900">
                        <strong className="text-[#D4AF37] text-lg">{changesUsed}</strong> / {changesAllowed}
                      </span>
                    </div>
                    <Progress 
                      value={(changesUsed / changesAllowed) * 100} 
                      className="h-3"
                    />
                    <p className="text-slate-600 text-xs">
                      {changesRemaining > 0 
                        ? `${changesRemaining} change${changesRemaining > 1 ? 's' : ''} remaining before full re-verification required`
                        : 'Change limit reached - re-verification required for further changes'
                      }
                    </p>
                  </div>

                  {/* AI Insight */}
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
                            <strong>AI Insight:</strong> {selectedEntity.scale} Category Entity
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

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-[12px] p-1">
                  <TabsTrigger value="profile" className="rounded-[8px]">
                    Profile & Compliance
                  </TabsTrigger>
                  <TabsTrigger value="rectification" className="rounded-[8px]">
                    Data Rectification
                  </TabsTrigger>
                  <TabsTrigger value="authorized" className="rounded-[8px]">
                    Authorized Changes
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="rounded-[8px]">
                    Audit History
                  </TabsTrigger>
                </TabsList>

                {/* Profile & Compliance Tab */}
                <TabsContent value="profile">
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-[#D4AF37]" />
                        {t.permissions}
                      </CardTitle>
                      <CardDescription>Role-based permissions proportional to shareholding</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-4 bg-blue-50 border-blue-200 rounded-[12px]">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <AlertDescription className="text-blue-800 ml-2 text-sm">
                          Minimum 2-member OTP approval required for all data rectifications
                        </AlertDescription>
                      </Alert>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.role}</TableHead>
                              <TableHead>{t.share}</TableHead>
                              <TableHead>{t.rectificationRights}</TableHead>
                              <TableHead>{t.auditControl}</TableHead>
                              <TableHead>{t.otpRequired}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {permissionMatrix.map((permission, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-sm text-slate-800">{maskData(permission.role)}</TableCell>
                                <TableCell>
                                  {permission.share > 0 ? (
                                    <Badge variant="outline" className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-100 text-xs">
                                      {permission.share}%
                                    </Badge>
                                  ) : (
                                    <span className="text-slate-400 text-xs">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">{permission.rectificationRights}</TableCell>
                                <TableCell className="text-sm">{permission.auditControl}</TableCell>
                                <TableCell>
                                  {permission.otpRequired ? (
                                    <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
                                      {t.required}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">{t.no}</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-[12px]">
                        <p className="text-amber-800 text-sm">
                          <strong>Exception:</strong> Individual Proprietor entities have single authority and do not require multi-member approval.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Data Rectification Tab */}
                <TabsContent value="rectification">
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                        Propose a Data Rectification
                      </CardTitle>
                      <CardDescription>Submit change requests for sensitive fields</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-slate-500">Sensitive Field</Label>
                          <Input 
                            className="mt-1 rounded-[8px]" 
                            placeholder="e.g., Registered Address" 
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Proposed Change</Label>
                          <Input 
                            className="mt-1 rounded-[8px]" 
                            placeholder="New Address" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs text-slate-500">Justification (for audit)</Label>
                          <Textarea 
                            className="mt-1 rounded-[8px]" 
                            rows={3} 
                            placeholder="Legal/compliance justification, supporting docs reference" 
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => setOtpDialogOpen(true)}
                        disabled={changeLimitReached}
                        className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-[8px]"
                      >
                        Propose & Authorize (OTP)
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Authorized Changes Tab */}
                <TabsContent value="authorized">
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                        {t.changeHistory}
                      </CardTitle>
                      <CardDescription>Track all approved structural modifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {changeHistory.filter(h => h.status === 'Approved').map((change) => (
                        <motion.div
                          key={change.number}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="grid grid-cols-1 gap-2 rounded-[12px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:grid-cols-5"
                        >
                          <div className="text-sm text-slate-900"><strong>Change #{change.number}</strong></div>
                          <div className="text-sm text-slate-600">Date: {maskData(change.date)}</div>
                          <div className="text-sm text-slate-600">By: {maskData(change.modifiedBy)}</div>
                          <div className="text-sm text-slate-600 md:col-span-2">
                            Approvers: {change.approvers.map(a => maskData(a)).join(', ')}
                          </div>
                        </motion.div>
                      ))}
                      {changeHistory.filter(h => h.status === 'Approved').length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          No authorized changes yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Audit History Tab */}
                <TabsContent value="audit">
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-[20px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#D4AF37]" />
                        Audit History
                      </CardTitle>
                      <CardDescription>Complete audit trail with timestamps and OTP verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="relative ml-2 border-l border-slate-200">
                        {changeHistory.map((change) => (
                          <li key={change.number} className="ml-6 mb-6">
                            <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border border-white bg-emerald-500" />
                            <div className="rounded-[12px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-slate-900"><strong>Change #{change.number} • {change.status}</strong></div>
                                <div className="text-xs text-slate-500">{maskData(change.date)}</div>
                              </div>
                              <div className="text-sm text-slate-700 mb-1">Type: {change.changeType}</div>
                              <div className="text-sm text-slate-700 mb-1">By: {maskData(change.modifiedBy)}</div>
                              <div className="text-xs text-slate-600">
                                OTP Verified by: {change.approvers.map(a => maskData(a)).join(', ')}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-4 text-xs text-slate-500 text-center">
                        All corrections are logged with timestamp, approvers, and OTP verification status.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>
      </div>

      {/* OTP Authorization Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              Authorize Change – Dual OTP Required
            </DialogTitle>
            <DialogDescription>
              Multi-factor authorization required for structural changes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-xs text-slate-500">Describe the proposed change</Label>
              <div className="relative">
                <Textarea
                  className="mt-1 rounded-[8px] pr-12"
                  rows={3}
                  placeholder="e.g., Update registered address; attach board resolution no. …"
                  value={otpData.details}
                  onChange={(e) => setOtpData({ ...otpData, details: e.target.value })}
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
                  className="text-sm text-red-600 flex items-center gap-2 mt-2"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Recording...
                </motion.p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Approver 1 (Name/Role)</Label>
                <Input
                  className="mt-1 rounded-[8px]"
                  placeholder="e.g., Managing Partner"
                  value={otpData.approver1}
                  onChange={(e) => setOtpData({ ...otpData, approver1: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Approver 2 (Name/Role)</Label>
                <Input
                  className="mt-1 rounded-[8px]"
                  placeholder="e.g., Partner"
                  value={otpData.approver2}
                  onChange={(e) => setOtpData({ ...otpData, approver2: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">OTP for Approver 1</Label>
                <Input
                  className="mt-1 rounded-[8px]"
                  placeholder="Enter 6-digit OTP"
                  value={otpData.otp1}
                  onChange={(e) => setOtpData({ ...otpData, otp1: e.target.value })}
                />
                {otp1Verified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 flex items-center gap-2 text-emerald-600 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    OTP Verified
                  </motion.div>
                )}
              </div>
              <div>
                <Label className="text-xs text-slate-500">OTP for Approver 2</Label>
                <Input
                  className="mt-1 rounded-[8px]"
                  placeholder="Enter 6-digit OTP"
                  value={otpData.otp2}
                  onChange={(e) => setOtpData({ ...otpData, otp2: e.target.value })}
                />
                {otp2Verified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 flex items-center gap-2 text-emerald-600 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    OTP Verified
                  </motion.div>
                )}
              </div>
            </div>
            <div className="rounded-[12px] bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-100">
              Dual-approval rule: Minimum two members must approve via OTP. Individuals are exempt (single OTP).
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setOtpDialogOpen(false)}
                className="flex-1 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleOtpSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-[8px]"
              >
                Verify & Record Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KYC Re-verification Dialog */}
      <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Full KYC Re-verification Required
            </DialogTitle>
            <DialogDescription>
              Change limit reached (3/3). Further changes locked until re-verification completes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Assign Verification Officer</Label>
                <Input className="mt-1 rounded-[8px]" placeholder="Officer Name" />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Schedule Interview</Label>
                <Input type="datetime-local" className="mt-1 rounded-[8px]" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs text-slate-500">Upload KYC Documents (PDF/Images)</Label>
                <div className="mt-1 flex w-full items-center justify-between rounded-[12px] border border-dashed border-slate-300 p-6 text-sm text-slate-600 hover:border-[#D4AF37] transition-colors cursor-pointer">
                  <span>Drag & drop files here or click to upload</span>
                  <Button variant="outline" size="sm" className="rounded-[8px]">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-[12px] bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-100">
              Change limit reached (3/3). Further structural changes are locked until re-verification completes.
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setKycDialogOpen(false)}
                className="flex-1 rounded-[8px]"
              >
                Close
              </Button>
              <Button
                onClick={() => setKycDialogOpen(false)}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg rounded-[8px]"
              >
                Submit Verification Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blockchain QR Verification Dialog */}
      <Dialog open={blockchainQROpen} onOpenChange={setBlockchainQROpen}>
        <DialogContent className="max-w-md rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#D4AF37]" />
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
              <p className="text-slate-800 text-sm">Entity ID: <strong>{selectedEntity.id}</strong></p>
              <p className="text-slate-600 text-xs">Blockchain Hash:</p>
              <code className="text-xs bg-slate-100 px-3 py-1 rounded text-slate-700">
                {selectedEntity.blockchainHash}
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
    </div>
  );
}
