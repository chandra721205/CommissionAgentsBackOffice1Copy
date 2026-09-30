import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  Building2, Users, Shield, Edit3, MessageSquare, CheckCircle2, 
  Eye, Lock, ChevronRight, Mic, Globe, Plus, X, Download,
  AlertTriangle, Fingerprint, Clock, Filter, Search, Info
} from 'lucide-react';

// Types and interfaces
type EntityType = 'Individual' | 'Partnership' | 'Family Enterprise' | 'Co-operative' | 'Society' | 'Trust' | 'Private Company' | 'Enterprise';
type ScaleCategory = 'Small' | 'MSME' | 'Medium' | 'Large';
type Language = 'EN' | 'HI' | 'TE';

interface EntityData {
  type: EntityType;
  scale: ScaleCategory;
  name: string;
  brands: string[];
  address: string;
  contacts: { mobile: string; email: string }[];
}

interface RoleAssignment {
  entityType: EntityType;
  scale: ScaleCategory;
  roles: string[];
  customRoles: string[];
}

interface Permission {
  view: 'Full' | 'Read-Only' | 'Limited';
  suggest: boolean;
  rectify: boolean;
  correct: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  by: string;
  role: string;
  field: string;
  oldValue: string;
  newValue: string;
  justification: string;
  visibleTo: string[];
}

interface Suggestion {
  id: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  suggestedBy: string;
}

// Entity examples data
const entityExamples = [
  { type: 'Individual', scale: 'Small', name: 'Sole Trader PSR' },
  { type: 'Individual', scale: 'MSME', name: 'PSR Enterprises' },
  { type: 'Partnership', scale: 'Small', name: 'Kumar & Associates' },
  { type: 'Partnership', scale: 'MSME', name: 'PSR & CO Partnership' },
  { type: 'Partnership', scale: 'Medium', name: 'United Traders Partnership' },
  { type: 'Family Enterprise', scale: 'Small', name: 'Ravindra & Sons Family Enterprise' },
  { type: 'Family Enterprise', scale: 'MSME', name: 'Reddy Family Enterprises' },
  { type: 'Co-operative', scale: 'MSME', name: 'Guntur Farmers Co-operative' },
  { type: 'Co-operative', scale: 'Medium', name: 'Kakatiya Co-op Society' },
  { type: 'Co-operative', scale: 'Large', name: 'AP State Co-operative Federation' },
  { type: 'Society', scale: 'Small', name: 'Guntur Traders Society' },
  { type: 'Society', scale: 'MSME', name: 'Agricultural Producers Society' },
  { type: 'Trust', scale: 'Small', name: 'Community Agri Trust' },
  { type: 'Trust', scale: 'MSME', name: 'Agri Trust Enterprises' },
  { type: 'Private Company', scale: 'MSME', name: 'Kakatiya Agro Pvt Ltd' },
  { type: 'Private Company', scale: 'Medium', name: 'Southern Traders Pvt Ltd' },
  { type: 'Private Company', scale: 'Large', name: 'Kakatiya Traders Pvt Ltd' },
  { type: 'Enterprise', scale: 'Small', name: 'Local Agri Enterprise' },
  { type: 'Enterprise', scale: 'MSME', name: 'Regional Trading Enterprise' },
  { type: 'Enterprise', scale: 'Medium', name: 'Generic Agri Enterprise' },
  { type: 'Enterprise', scale: 'Large', name: 'National Commodity Enterprise' },
];

// Role definitions by entity type
const rolesByEntity: Record<EntityType, { roles: string[]; description: string }> = {
  'Individual': {
    roles: ['Owner (Sole)', 'Laborer', 'Watchman'],
    description: 'Sole proprietor with personal liability'
  },
  'Partnership': {
    roles: ['Partners (2+ Equal)', 'Manager (Ops)', 'Salesman', 'Staff'],
    description: 'Partnership Act 1932 - Unlimited liability'
  },
  'Family Enterprise': {
    roles: ['Family Head (Owner)', 'Family Members', 'Weighing Laborer', 'Staff'],
    description: 'Family-run informal enterprise'
  },
  'Co-operative': {
    roles: ['Board (Elected)', 'Secretary (Compliance)', 'Members (General)', 'Sample Mover', 'Staff'],
    description: 'Co-operative Societies Act - Member-owned'
  },
  'Society': {
    roles: ['Governing Body', 'Secretary', 'Members', 'Quality Supervisor', 'Staff'],
    description: 'Societies Registration Act 1860'
  },
  'Trust': {
    roles: ['Trustees (Fiduciary)', 'Settlor (Founder)', 'Beneficiaries', 'Receiver', 'Staff'],
    description: 'Indian Trusts Act 1882'
  },
  'Private Company': {
    roles: ['Directors (Board)', 'Company Secretary (CS)', 'Shareholders', 'Laborer', 'Staff'],
    description: 'Companies Act 2013 - Limited liability'
  },
  'Enterprise': {
    roles: ['Owner/Manager', 'Multi-Role Staff', 'Salesman', 'Laborer', 'Undefined Custom'],
    description: 'General business entity'
  }
};

// Translations
const translations = {
  EN: {
    title: 'Business Entity & Role Permissions',
    entitySetup: 'Entity Setup',
    roleAssignment: 'Role Assignment',
    permissionsDashboard: 'Permissions Dashboard',
    dataRectification: 'Data Rectification',
    suggestions: 'Suggestions & Corrections',
    visibilityLog: 'Visibility Log',
    confidentiality: 'Confidentiality View',
    otpAuth: 'OTP Authentication',
    save: 'Save',
    next: 'Next',
    back: 'Back',
    assign: 'Assign',
    rectify: 'Rectify',
    approve: 'Approve',
    reject: 'Reject',
    submit: 'Submit',
    verify: 'Verify',
    export: 'Export Log',
  },
  HI: {
    title: 'व्यावसायिक इकाई और भूमिका अनुमतियाँ',
    entitySetup: 'इकाई सेटअप',
    roleAssignment: 'भूमिका असाइनमेंट',
    permissionsDashboard: 'अनुमति डैशबोर्ड',
    dataRectification: 'डेटा सुधार',
    suggestions: 'सुझाव और सुधार',
    visibilityLog: 'दृश्यता लॉग',
    confidentiality: 'गोपनीयता दृश्य',
    otpAuth: 'OTP प्रमाणीकरण',
    save: 'सहेजें',
    next: 'आगे',
    back: 'पीछे',
    assign: 'असाइन करें',
    rectify: 'सुधारें',
    approve: 'स्वीकृत करें',
    reject: 'अस्वीकार करें',
    submit: 'जमा करें',
    verify: 'सत्यापित करें',
    export: 'लॉग निर्यात करें',
  },
  TE: {
    title: 'వ్యాపార సంస్థ & పాత్ర అనుమతులు',
    entitySetup: 'సంస్థ సెటప్',
    roleAssignment: 'పాత్ర కేటాయింపు',
    permissionsDashboard: 'అనుమతుల డాష్‌బోర్డ్',
    dataRectification: 'డేటా సవరణ',
    suggestions: 'సూచనలు & దిద్దుబాట్లు',
    visibilityLog: 'దృశ్యత లాగ్',
    confidentiality: 'గోప్యత వీక్షణ',
    otpAuth: 'OTP ప్రమాణీకరణ',
    save: 'సేవ్ చేయండి',
    next: 'తర్వాత',
    back: 'వెనుకకు',
    assign: 'కేటాయించండి',
    rectify: 'సరిచేయండి',
    approve: 'ఆమోదించండి',
    reject: 'తిరస్కరించండి',
    submit: 'సమర్పించండి',
    verify: 'ధృవీకరించండి',
    export: 'లాగ్ ఎగుమతి',
  }
};

export default function EntityRolePermissionsPrototype() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [language, setLanguage] = useState<Language>('EN');
  const [isListening, setIsListening] = useState(false);
  const [entityData, setEntityData] = useState<EntityData>({
    type: 'Partnership',
    scale: 'MSME',
    name: '',
    brands: [],
    address: '',
    contacts: [{ mobile: '', email: '' }]
  });
  const [roleAssignment, setRoleAssignment] = useState<RoleAssignment>({
    entityType: 'Partnership',
    scale: 'MSME',
    roles: [],
    customRoles: []
  });
  const [permissions, setPermissions] = useState<Record<string, Permission>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'LOG001',
      timestamp: '2025-10-28 10:30:45',
      by: 'Rajesh Kumar',
      role: 'Partner',
      field: 'Bill Amount',
      oldValue: '₹50,000',
      newValue: '₹52,000',
      justification: 'Corrected calculation error per invoice #INV-2025-001',
      visibleTo: ['Owners', 'Auditors', 'Regulators']
    },
    {
      id: 'LOG002',
      timestamp: '2025-10-28 09:15:22',
      by: 'Priya Sharma',
      role: 'Manager (Ops)',
      field: 'Due Date',
      oldValue: '2025-11-15',
      newValue: '2025-11-20',
      justification: 'Extended due to transport delay',
      visibleTo: ['Owners', 'Auditors']
    }
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: 'SUG001',
      field: 'Payment Method',
      currentValue: 'Cash',
      suggestedValue: 'Bank Transfer',
      notes: 'For better audit trail and compliance',
      status: 'Pending',
      suggestedBy: 'Staff - Salesman'
    }
  ]);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [rectifyField, setRectifyField] = useState('');
  const [rectifyValue, setRectifyValue] = useState('');
  const [rectifyJustification, setRectifyJustification] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('All');

  const t = translations[language];

  // Voice input handler
  const handleVoiceInput = (field: string, setValue: (value: string) => void) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'HI' ? 'hi-IN' : language === 'TE' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening...', { duration: 2000 });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue(transcript);
        toast.success('Voice captured!', { duration: 2000 });
      };

      recognition.onerror = () => {
        toast.error('Voice input failed', { duration: 2000 });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice input not supported', { duration: 2000 });
    }
  };

  // Navigation
  const goToScreen = (screen: number) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // OTP verification
  const handleOTPVerify = () => {
    if (otpValue.length === 6) {
      toast.success('Authorized - Log Appended', { duration: 3000 });
      setShowOTPDialog(false);
      setOtpValue('');
      
      // Add to audit log
      const newLog: AuditLog = {
        id: `LOG${String(auditLogs.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString('en-IN'),
        by: 'Current User',
        role: roleAssignment.roles[0] || 'Admin',
        field: rectifyField,
        oldValue: '-',
        newValue: rectifyValue,
        justification: rectifyJustification,
        visibleTo: ['Owners', 'Auditors', 'Regulators']
      };
      setAuditLogs([newLog, ...auditLogs]);
      
      // Reset rectify fields
      setRectifyField('');
      setRectifyValue('');
      setRectifyJustification('');
    } else {
      toast.error('Invalid OTP', { duration: 2000 });
    }
  };

  // Render screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <Screen1EntitySetup />;
      case 2:
        return <Screen2RoleAssignment />;
      case 3:
        return <Screen3PermissionsDashboard />;
      case 4:
        return <Screen4DataRectification />;
      case 5:
        return <Screen5SuggestionsCorrections />;
      case 6:
        return <Screen6VisibilityLog />;
      case 7:
        return <Screen7ConfidentialityView />;
      case 8:
        return <Screen8OTPAuth />;
      default:
        return <Screen1EntitySetup />;
    }
  };

  // Screen 1: Entity Setup
  function Screen1EntitySetup() {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#D4AF37]" />
              Business Entity Type
            </CardTitle>
            <CardDescription>Select entity type and configure details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Entity Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entity Type</Label>
                <Select value={entityData.type} onValueChange={(value) => setEntityData({ ...entityData, type: value as EntityType })}>
                  <SelectTrigger className="h-16 bg-white border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Family Enterprise">Family Enterprise</SelectItem>
                    <SelectItem value="Co-operative">Co-operative</SelectItem>
                    <SelectItem value="Society">Society</SelectItem>
                    <SelectItem value="Trust">Trust</SelectItem>
                    <SelectItem value="Private Company">Private Company</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Scale Category</Label>
                <Select value={entityData.scale} onValueChange={(value) => setEntityData({ ...entityData, scale: value as ScaleCategory })}>
                  <SelectTrigger className="h-16 bg-white border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small (&lt;₹50Cr / &lt;100 emp)</SelectItem>
                    <SelectItem value="MSME">MSME (₹50-250Cr / 100-250 emp)</SelectItem>
                    <SelectItem value="Medium">Medium (₹250-500Cr / 250-500 emp)</SelectItem>
                    <SelectItem value="Large">Large (&gt;₹500Cr / &gt;500 emp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Examples */}
            <div className="p-4 bg-white/60 rounded-lg border border-[#D4AF37]/20">
              <p className="text-sm mb-2">Examples for {entityData.type} - {entityData.scale}:</p>
              <div className="flex flex-wrap gap-2">
                {entityExamples
                  .filter(ex => ex.type === entityData.type && ex.scale === entityData.scale)
                  .map((ex, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/20 border-[#D4AF37]/30">
                      {ex.name}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Entity Name */}
            <div className="space-y-2">
              <Label>Entity Name</Label>
              <div className="flex gap-2">
                <Input
                  value={entityData.name}
                  onChange={(e) => setEntityData({ ...entityData, name: e.target.value })}
                  placeholder="e.g., PSR & CO Partnership"
                  className="flex-1 h-12 border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
                  onClick={() => handleVoiceInput('entityName', (value) => setEntityData({ ...entityData, name: value }))}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                </Button>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <Label>Brands (Multi-Add)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Add brand name"
                  className="flex-1 h-12 border-2 border-[#D4AF37]/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newBrand.trim()) {
                      setEntityData({ ...entityData, brands: [...entityData.brands, newBrand.trim()] });
                      setNewBrand('');
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
                  onClick={() => handleVoiceInput('brand', (value) => setNewBrand(value))}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                </Button>
                <Button
                  onClick={() => {
                    if (newBrand.trim()) {
                      setEntityData({ ...entityData, brands: [...entityData.brands, newBrand.trim()] });
                      setNewBrand('');
                    }
                  }}
                  className="h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {entityData.brands.map((brand, idx) => (
                  <Badge key={idx} className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] text-white px-3 py-1 flex items-center gap-2">
                    {brand}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-200"
                      onClick={() => setEntityData({ ...entityData, brands: entityData.brands.filter((_, i) => i !== idx) })}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <div className="flex gap-2">
                <Textarea
                  value={entityData.address}
                  onChange={(e) => setEntityData({ ...entityData, address: e.target.value })}
                  placeholder="Enter complete address"
                  className="flex-1 min-h-[80px] border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
                  onClick={() => handleVoiceInput('address', (value) => setEntityData({ ...entityData, address: value }))}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                </Button>
              </div>
            </div>

            {/* Contacts */}
            <Accordion type="single" collapsible className="border-2 border-[#D4AF37]/20 rounded-lg">
              <AccordionItem value="contacts" className="border-0">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-[#D4AF37]/5">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    Contact Information ({entityData.contacts.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  {entityData.contacts.map((contact, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/60 rounded-lg border border-[#D4AF37]/10">
                      <div className="space-y-2">
                        <Label>Mobile</Label>
                        <Input
                          value={contact.mobile}
                          onChange={(e) => {
                            const newContacts = [...entityData.contacts];
                            newContacts[idx].mobile = e.target.value;
                            setEntityData({ ...entityData, contacts: newContacts });
                          }}
                          placeholder="+91 XXXXX XXXXX"
                          className="border-2 border-[#D4AF37]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = [...entityData.contacts];
                            newContacts[idx].email = e.target.value;
                            setEntityData({ ...entityData, contacts: newContacts });
                          }}
                          placeholder="email@example.com"
                          className="border-2 border-[#D4AF37]/20"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setEntityData({ ...entityData, contacts: [...entityData.contacts, { mobile: '', email: '' }] })}
                    className="w-full border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Save Button */}
            <Button
              onClick={() => {
                setShowOTPDialog(true);
                toast.info('Enter OTP to save entity');
              }}
              className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {t.save} Entity (OTP Required)
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 2: Role Assignment
  function Screen2RoleAssignment() {
    const availableRoles = rolesByEntity[entityData.type];

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#D4AF37]" />
              Assign Roles by Stake
            </CardTitle>
            <CardDescription>{availableRoles.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Entity Info */}
            <div className="p-4 bg-white/80 rounded-lg border-2 border-[#D4AF37]/20">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] text-white">
                  {entityData.type}
                </Badge>
                <Badge variant="outline" className="border-[#D4AF37]">
                  {entityData.scale}
                </Badge>
                <Badge variant="outline" className="border-blue-500">
                  {entityData.name || 'Unnamed Entity'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{availableRoles.description}</p>
            </div>

            {/* Available Roles */}
            <div className="space-y-4">
              <Label>Available Roles for {entityData.type}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRoles.roles.map((role, idx) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                      roleAssignment.roles.includes(role)
                        ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                    onClick={() => {
                      if (roleAssignment.roles.includes(role)) {
                        setRoleAssignment({
                          ...roleAssignment,
                          roles: roleAssignment.roles.filter(r => r !== role)
                        });
                      } else {
                        setRoleAssignment({
                          ...roleAssignment,
                          roles: [...roleAssignment.roles, role]
                        });
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        {roleAssignment.roles.includes(role) && (
                          <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Role Justifications */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p><strong>Justifications (Legal Basis):</strong></p>
                  {entityData.type === 'Partnership' && (
                    <>
                      <p>• <strong>Partners:</strong> Edit finances with mutual OTP (Partnership Act 1932 - Equal liability)</p>
                      <p>• <strong>Manager:</strong> Operational data management, suggestions to partners</p>
                      <p>• <strong>Staff:</strong> View-only access to prevent fraud</p>
                    </>
                  )}
                  {entityData.type === 'Private Company' && (
                    <>
                      <p>• <strong>Directors:</strong> Edit statutory records with board OTP (Sec 179 Companies Act 2013)</p>
                      <p>• <strong>Company Secretary:</strong> Compliance and ROC filings (Sec 149)</p>
                      <p>• <strong>Shareholders:</strong> View financials only</p>
                    </>
                  )}
                  {entityData.type === 'Co-operative' && (
                    <>
                      <p>• <strong>Board:</strong> Edit governance with quorum OTP (Co-operative Societies Act)</p>
                      <p>• <strong>Secretary:</strong> Compliance certification</p>
                      <p>• <strong>Members:</strong> Democratic voting rights</p>
                    </>
                  )}
                  {entityData.type === 'Trust' && (
                    <>
                      <p>• <strong>Trustees:</strong> Fiduciary duty with 2FA (Indian Trusts Act 1882)</p>
                      <p>• <strong>Settlor:</strong> Oversight and veto power</p>
                      <p>• <strong>Beneficiaries:</strong> View benefits only</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Roles */}
            <div className="space-y-2">
              <Label>Multi-Role Staff / Custom Roles</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => {
                    if (!roleAssignment.customRoles.includes(value)) {
                      setRoleAssignment({
                        ...roleAssignment,
                        customRoles: [...roleAssignment.customRoles, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-12 bg-white border-2 border-[#D4AF37]/20">
                    <SelectValue placeholder="Select additional roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Watchman">Watchman</SelectItem>
                    <SelectItem value="Receiver">Receiver</SelectItem>
                    <SelectItem value="Laborer">Laborer</SelectItem>
                    <SelectItem value="Salesman">Salesman</SelectItem>
                    <SelectItem value="Weighing Laborer">Weighing Laborer</SelectItem>
                    <SelectItem value="Quality Supervisor">Quality Supervisor</SelectItem>
                    <SelectItem value="Sample Mover">Sample Mover</SelectItem>
                    <SelectItem value="Undefined Custom">Undefined Custom</SelectItem>
                    <SelectItem value="Multi-Role (Laborer + Mover)">Multi-Role (Laborer + Mover)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {roleAssignment.customRoles.map((role, idx) => (
                  <Badge key={idx} variant="outline" className="border-[#D4AF37] flex items-center gap-2">
                    {role}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setRoleAssignment({
                        ...roleAssignment,
                        customRoles: roleAssignment.customRoles.filter((_, i) => i !== idx)
                      })}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(1)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => {
                  if (roleAssignment.roles.length === 0) {
                    toast.error('Please select at least one role');
                    return;
                  }
                  setShowOTPDialog(true);
                  toast.info('Enter OTP to assign roles');
                }}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                {t.assign} Roles (OTP)
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 3: Permissions Dashboard
  function Screen3PermissionsDashboard() {
    const allRoles = [...roleAssignment.roles, ...roleAssignment.customRoles];

    // Define permissions based on entity type and role
    const getPermissionsForRole = (role: string): Permission => {
      if (role.includes('Partner') || role.includes('Director') || role.includes('Owner') || role.includes('Head') || role.includes('Trustee')) {
        return { view: 'Full', suggest: true, rectify: true, correct: true };
      } else if (role.includes('Manager') || role.includes('Secretary') || role.includes('CS')) {
        return { view: 'Full', suggest: true, rectify: true, correct: false };
      } else if (role.includes('Member') || role.includes('Shareholder')) {
        return { view: 'Limited', suggest: true, rectify: false, correct: false };
      } else {
        return { view: 'Read-Only', suggest: true, rectify: false, correct: false };
      }
    };

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
              Role Permissions Overview
            </CardTitle>
            <CardDescription>View and manage permissions for all assigned roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Insight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-sm">
                    <strong>AI Grok Insight:</strong> {entityData.type === 'Private Company' 
                      ? 'Private Ltd requires Company Secretary for statutory filings (Section 149 Companies Act 2013). Ensure CS role is assigned with compliance permissions.'
                      : entityData.type === 'Partnership'
                      ? 'Partnership requires mutual consent for financial edits (Partnership Act 1932). 2FA with multiple partner approval recommended.'
                      : entityData.type === 'Co-operative'
                      ? 'Co-operative governance needs board quorum for major decisions (Co-operative Societies Act). Enable multi-member OTP approval.'
                      : 'Entity permissions configured based on legal requirements and best practices for governance.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Permission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allRoles.map((role, idx) => {
                const perms = getPermissionsForRole(role);
                return (
                  <Card key={idx} className="border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-lg">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C19A2E] flex items-center justify-center text-white flex-shrink-0">
                          {role.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{role}</h4>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">View Access:</span>
                          <Badge variant={perms.view === 'Full' ? 'default' : 'outline'} className={perms.view === 'Full' ? 'bg-[#27AE60]' : ''}>
                            {perms.view}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Can Suggest:</span>
                          {perms.suggest ? (
                            <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                          ) : (
                            <X className="w-5 h-5 text-[#E74C3C]" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Can Rectify (OTP):</span>
                          {perms.rectify ? (
                            <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                          ) : (
                            <X className="w-5 h-5 text-[#E74C3C]" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Can Approve (2FA):</span>
                          {perms.correct ? (
                            <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                          ) : (
                            <X className="w-5 h-5 text-[#E74C3C]" />
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {perms.correct 
                            ? '✓ Full authority with 2FA approval rights'
                            : perms.rectify
                            ? '✓ Can edit data with OTP verification'
                            : perms.suggest
                            ? '✓ Can flag issues and suggest changes'
                            : '✓ Read-only access for transparency'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Legal Compliance Summary */}
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p><strong>Compliance Summary:</strong></p>
                  <p>✓ Permissions aligned with {entityData.type === 'Partnership' ? 'Partnership Act 1932' : 
                    entityData.type === 'Private Company' ? 'Companies Act 2013 (Sec 149, 179)' :
                    entityData.type === 'Co-operative' ? 'Co-operative Societies Act' :
                    entityData.type === 'Trust' ? 'Indian Trusts Act 1882' :
                    entityData.type === 'Society' ? 'Societies Registration Act 1860' :
                    'applicable legal frameworks'}</p>
                  <p>✓ Least privilege principle (ISO 27001)</p>
                  <p>✓ Audit trail enabled (SOX-like compliance)</p>
                  <p>✓ Multi-level authorization for {entityData.scale} scale entities</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(2)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => goToScreen(4)}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                View Details
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => goToScreen(4)}
                className="flex-1 h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
              >
                Edit Permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 4: Data Rectification
  function Screen4DataRectification() {
    const sampleFields = [
      { name: 'Bill Amount', current: '₹50,000', type: 'number' },
      { name: 'Due Date', current: '2025-11-15', type: 'date' },
      { name: 'Payment Method', current: 'Cash', type: 'text' },
      { name: 'Commodity Weight', current: '1250 kg', type: 'text' },
      { name: 'Quality Grade', current: 'A+', type: 'text' },
    ];

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-[#D4AF37]" />
              Data Rectification
            </CardTitle>
            <CardDescription>Edit data fields with justification and OTP verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rectification Table */}
            <div className="border-2 border-[#D4AF37]/20 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
                    <TableHead>Field Name</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead className="text-center">Voice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleFields.map((field, idx) => (
                    <TableRow key={idx} className="hover:bg-[#D4AF37]/5 transition-colors">
                      <TableCell>{field.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{field.current}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder={`New ${field.name.toLowerCase()}`}
                          className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
                          onChange={(e) => {
                            setRectifyField(field.name);
                            setRectifyValue(e.target.value);
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVoiceInput(field.name, (value) => {
                            setRectifyField(field.name);
                            setRectifyValue(value);
                          })}
                        >
                          <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <Label>Justification Reason <span className="text-red-500">*</span></Label>
              <Select value={rectifyJustification} onValueChange={setRectifyJustification}>
                <SelectTrigger className="h-12 bg-white border-2 border-[#D4AF37]/20">
                  <SelectValue placeholder="Select reason for change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Error - Calculation Mistake">Error - Calculation Mistake</SelectItem>
                  <SelectItem value="Compliance - Legal Requirement">Compliance - Legal Requirement</SelectItem>
                  <SelectItem value="Update - New Information">Update - New Information</SelectItem>
                  <SelectItem value="Correction - Invoice Mismatch">Correction - Invoice Mismatch</SelectItem>
                  <SelectItem value="Adjustment - Transport Delay">Adjustment - Transport Delay</SelectItem>
                  <SelectItem value="Amendment - Quality Regrade">Amendment - Quality Regrade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add any additional context for this rectification..."
                  className="flex-1 border-2 border-[#D4AF37]/20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-2 border-[#D4AF37]/20"
                  onClick={() => handleVoiceInput('notes', (value) => {})}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                </Button>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="p-4 bg-white/80 border-2 border-[#D4AF37]/20 rounded-lg space-y-3">
              <Label>Visibility Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Visible to Owners</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Visible to Auditors</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Visible to Regulators</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Visible to Chain Stakeholders</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ Corrections visible to chain stakeholders (producer-agent-buyer) for transparency. 
                Confidential data remains internal (GDPR Art 5).
              </p>
            </div>

            {/* Warning */}
            {rectifyField && !rectifyJustification && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800"><strong>Justification Required!</strong></p>
                  <p className="text-xs text-red-600 mt-1">
                    All rectifications must include a justification reason for audit compliance (SOX/IFRS standards).
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(3)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => {
                  if (!rectifyField || !rectifyValue) {
                    toast.error('Please select a field and enter new value');
                    return;
                  }
                  if (!rectifyJustification) {
                    toast.error('Justification is required for rectification');
                    return;
                  }
                  setShowOTPDialog(true);
                }}
                disabled={!rectifyField || !rectifyValue || !rectifyJustification}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] disabled:opacity-50"
              >
                {t.rectify} with 2FA
                <Fingerprint className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 5: Suggestions & Corrections
  function Screen5SuggestionsCorrections() {
    const [newSuggestion, setNewSuggestion] = useState({
      field: '',
      suggestedValue: '',
      notes: ''
    });

    const handleApproveSuggestion = (id: string) => {
      setSuggestions(suggestions.map(s => 
        s.id === id ? { ...s, status: 'Approved' as const } : s
      ));
      toast.success('Correction approved and logged', { duration: 3000 });
      setShowOTPDialog(true);
    };

    const handleRejectSuggestion = (id: string) => {
      setSuggestions(suggestions.map(s => 
        s.id === id ? { ...s, status: 'Rejected' as const } : s
      ));
      toast.error('Suggestion rejected', { duration: 2000 });
    };

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
              Suggestions & Corrections
            </CardTitle>
            <CardDescription>Flag issues and manage correction workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Submit New Suggestion */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg">Submit New Suggestion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Field to Change</Label>
                  <Select value={newSuggestion.field} onValueChange={(value) => setNewSuggestion({ ...newSuggestion, field: value })}>
                    <SelectTrigger className="h-12 bg-white">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bill Amount">Bill Amount</SelectItem>
                      <SelectItem value="Due Date">Due Date</SelectItem>
                      <SelectItem value="Payment Method">Payment Method</SelectItem>
                      <SelectItem value="Quality Grade">Quality Grade</SelectItem>
                      <SelectItem value="Commodity Weight">Commodity Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Suggested Value</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSuggestion.suggestedValue}
                      onChange={(e) => setNewSuggestion({ ...newSuggestion, suggestedValue: e.target.value })}
                      placeholder="Enter suggested value"
                      className="flex-1 h-12"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => handleVoiceInput('suggestion', (value) => 
                        setNewSuggestion({ ...newSuggestion, suggestedValue: value })
                      )}
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes / Rationale</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={newSuggestion.notes}
                      onChange={(e) => setNewSuggestion({ ...newSuggestion, notes: e.target.value })}
                      placeholder="Explain why this change is needed..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => handleVoiceInput('notes', (value) => 
                        setNewSuggestion({ ...newSuggestion, notes: value })
                      )}
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#D4AF37]'}`} />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!newSuggestion.field || !newSuggestion.suggestedValue) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    const newSug: Suggestion = {
                      id: `SUG${String(suggestions.length + 1).padStart(3, '0')}`,
                      field: newSuggestion.field,
                      currentValue: '-',
                      suggestedValue: newSuggestion.suggestedValue,
                      notes: newSuggestion.notes,
                      status: 'Pending',
                      suggestedBy: 'Current User'
                    };
                    setSuggestions([newSug, ...suggestions]);
                    setNewSuggestion({ field: '', suggestedValue: '', notes: '' });
                    toast.success('Suggestion submitted for review');
                  }}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  {t.submit} Suggestion
                </Button>
              </CardContent>
            </Card>

            {/* Rationale Popups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Eye className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm"><strong>Correction Visibility:</strong></p>
                    <p className="text-xs text-gray-600 mt-1">
                      Approved corrections are visible to chain stakeholders (producer-agent-buyer) for transparency and dispute resolution per Contract Act.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm"><strong>Confidentiality:</strong></p>
                    <p className="text-xs text-gray-600 mt-1">
                      Internal financial data remains confidential to entity owners only (GDPR purpose limitation). Staff see redacted views.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-sm">
                    <strong>AI Grok Verification:</strong> {entityData.scale === 'Large' || entityData.scale === 'Medium'
                      ? 'High-scale entities require board/director approval for corrections. Multi-level 2FA recommended per governance requirements.'
                      : 'All corrections require OTP verification. Justification mandatory for audit compliance (ISO 27001 standards).'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Suggestions */}
            <div className="space-y-3">
              <h3>Pending Approval Workflow</h3>
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className={`border-2 ${
                  suggestion.status === 'Pending' ? 'border-yellow-300 bg-yellow-50' :
                  suggestion.status === 'Approved' ? 'border-green-300 bg-green-50' :
                  'border-red-300 bg-red-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className={
                          suggestion.status === 'Pending' ? 'bg-yellow-500' :
                          suggestion.status === 'Approved' ? 'bg-green-500' :
                          'bg-red-500'
                        }>
                          {suggestion.status}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">{suggestion.id}</span>
                      </div>
                      <span className="text-xs text-gray-500">{suggestion.suggestedBy}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Field:</p>
                          <p>{suggestion.field}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current:</p>
                          <p>{suggestion.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Suggested:</p>
                          <p className="text-blue-600">{suggestion.suggestedValue}</p>
                        </div>
                      </div>

                      {suggestion.notes && (
                        <div className="text-sm bg-white p-2 rounded border border-gray-200">
                          <p className="text-gray-500">Notes:</p>
                          <p>{suggestion.notes}</p>
                        </div>
                      )}

                      {suggestion.status === 'Pending' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => handleApproveSuggestion(suggestion.id)}
                            className="flex-1 bg-gradient-to-r from-[#27AE60] to-[#229954] hover:from-[#229954] hover:to-[#27AE60]"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {t.approve} (2FA)
                          </Button>
                          <Button
                            onClick={() => handleRejectSuggestion(suggestion.id)}
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            {t.reject}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(4)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => goToScreen(6)}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                View Audit Log
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 6: Visibility Log
  function Screen6VisibilityLog() {
    const filteredLogs = filterVisibility === 'All' 
      ? auditLogs 
      : auditLogs.filter(log => log.visibleTo.includes(filterVisibility));

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#D4AF37]" />
              Visibility & Audit Log
            </CardTitle>
            <CardDescription>Complete audit trail with visibility controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <Select value={filterVisibility} onValueChange={setFilterVisibility}>
                  <SelectTrigger className="h-12 bg-white border-2 border-[#D4AF37]/20">
                    <SelectValue placeholder="Filter by visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Logs</SelectItem>
                    <SelectItem value="Owners">Visible to Owners</SelectItem>
                    <SelectItem value="Auditors">Visible to Auditors</SelectItem>
                    <SelectItem value="Regulators">Visible to Regulators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="h-12 border-2 border-[#D4AF37]/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="h-12 border-2 border-[#D4AF37]/20"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                className="h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.export} PDF
              </Button>
            </div>

            {/* Audit Table */}
            <div className="border-2 border-[#D4AF37]/20 rounded-lg overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
                      <TableHead>Log ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>By (Role)</TableHead>
                      <TableHead>Field Changed</TableHead>
                      <TableHead>Old → New</TableHead>
                      <TableHead>Justification</TableHead>
                      <TableHead>Visible To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log, idx) => (
                      <TableRow 
                        key={log.id} 
                        className="hover:bg-[#D4AF37]/5 transition-colors cursor-pointer"
                        onClick={() => {
                          toast.info(`Viewing details for ${log.id}`, { duration: 2000 });
                        }}
                      >
                        <TableCell>
                          <Badge variant="outline" className="border-[#D4AF37]">
                            {log.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{log.by}</p>
                            <p className="text-xs text-gray-500">{log.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{log.field}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-red-600 line-through">{log.oldValue}</span>
                            <span>→</span>
                            <span className="text-green-600">{log.newValue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate" title={log.justification}>
                          {log.justification}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {log.visibleTo.map((v, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Log Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Total Logs</p>
                  <p className="text-2xl">{auditLogs.length}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Filtered Logs</p>
                  <p className="text-2xl">{filteredLogs.length}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Today's Changes</p>
                  <p className="text-2xl">
                    {auditLogs.filter(l => l.timestamp.includes('2025-10-28')).length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Redaction Notice */}
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm"><strong>Redacted View for Staff:</strong></p>
                  <p className="text-xs text-gray-600 mt-1">
                    Non-privileged roles see redacted audit logs with sensitive data masked. Full logs available only to owners, auditors, and regulators as per confidentiality settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(5)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => goToScreen(7)}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                Confidentiality Settings
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 7: Confidentiality View
  function Screen7ConfidentialityView() {
    const confidentialityRoles = [
      { role: 'Directors', access: 'Full - All financial & strategic data', level: 'high' },
      { role: 'Partners', access: 'Full - Partnership finances & operations', level: 'high' },
      { role: 'Company Secretary', access: 'Compliance & statutory records', level: 'medium' },
      { role: 'Managers', access: 'Operational data only', level: 'medium' },
      { role: 'Shareholders', access: 'Financial summaries & annual reports', level: 'medium' },
      { role: 'Members', access: 'Co-operative/Society records', level: 'medium' },
      { role: 'Staff', access: 'Task-specific data only (redacted)', level: 'low' },
      { role: 'Laborers', access: 'Weight/quality data relevant to work', level: 'low' },
    ];

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
              Confidentiality View
            </CardTitle>
            <CardDescription>Role-based data access and confidentiality settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Insight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-sm">
                    <strong>AI Grok Insight:</strong> {entityData.type === 'Family Enterprise'
                      ? 'Family Enterprise should limit financial data to Family Head only (trust-based governance). Staff access redacted to task-specific data.'
                      : entityData.type === 'Private Company'
                      ? 'Private Company confidentiality requires board-level approval for data sharing (Companies Act Sec 128). Shareholders limited to annual reports.'
                      : 'Confidentiality aligned with entity structure. Internal data protected per GDPR purpose limitation (Art 5).'}
                  </p>
                </div>
              </div>
            </div>

            {/* Confidentiality Matrix */}
            <div className="space-y-3">
              <h3>Role-Based Confidentiality Matrix</h3>
              {confidentialityRoles.map((item, idx) => (
                <Card 
                  key={idx} 
                  className={`border-2 ${
                    item.level === 'high' ? 'border-red-300 bg-red-50' :
                    item.level === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                    'border-green-300 bg-green-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.level === 'high' ? 'bg-red-500' :
                            item.level === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <h4>{item.role}</h4>
                          <Badge variant="outline" className={
                            item.level === 'high' ? 'border-red-500 text-red-700' :
                            item.level === 'medium' ? 'border-yellow-500 text-yellow-700' :
                            'border-green-500 text-green-700'
                          }>
                            {item.level === 'high' ? 'Full Access' :
                             item.level === 'medium' ? 'Limited Access' :
                             'Restricted Access'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.access}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-3"
                        onClick={() => {
                          setShowOTPDialog(true);
                          toast.info('OTP required to modify confidentiality settings');
                        }}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Confidentiality Badges */}
            <div className="p-4 bg-white/80 border-2 border-[#D4AF37]/20 rounded-lg">
              <Label className="mb-3 block">Confidentiality Badges</Label>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-500 text-white">Confidential to Directors</Badge>
                <Badge className="bg-orange-500 text-white">Confidential to Partners</Badge>
                <Badge className="bg-yellow-600 text-white">Confidential to Owners</Badge>
                <Badge className="bg-blue-500 text-white">Internal Only</Badge>
                <Badge className="bg-purple-500 text-white">Trustees Only</Badge>
                <Badge className="bg-green-600 text-white">Redacted for Staff</Badge>
              </div>
            </div>

            {/* Legal Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm"><strong>GDPR Compliance:</strong></p>
                    <p className="text-xs text-gray-600 mt-1">
                      Data minimization (Art 5) - Staff access limited to purpose. Confidential data encrypted and access-logged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm"><strong>ISO 27001:</strong></p>
                    <p className="text-xs text-gray-600 mt-1">
                      Need-to-know basis. Role-based access control (RBAC) with least privilege principle enforced.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-[#D4AF37]/20 justify-between"
                onClick={() => {
                  setShowOTPDialog(true);
                  toast.info('Configure role-based confidentiality');
                }}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Set Confidentiality Levels
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-[#D4AF37]/20 justify-between"
                onClick={() => {
                  setShowOTPDialog(true);
                  toast.info('Update data access permissions');
                }}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Update Access Permissions
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(6)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                onClick={() => goToScreen(8)}
                className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37]"
              >
                OTP Confirmation
                <Fingerprint className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screen 8: OTP/Auth Confirmation
  function Screen8OTPAuth() {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-6 h-6 text-[#D4AF37]" />
              {t.otpAuth}
            </CardTitle>
            <CardDescription>Secure authentication for all changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 2FA Toggle */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    <div>
                      <p>Enable Biometric 2FA</p>
                      <p className="text-sm text-gray-600">Enhanced security with biometric verification</p>
                    </div>
                  </div>
                  <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* OTP Input */}
            <div className="space-y-4">
              <Label>Enter 6-Digit OTP</Label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otpValue}
                  onChange={setOtpValue}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37]" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>OTP sent to +91 XXXXX XX123</span>
                <Button variant="link" className="text-[#D4AF37] p-0 h-auto">
                  Resend OTP
                </Button>
              </div>
              {otpValue.length === 6 && (
                <div className="flex items-center gap-2 justify-center text-green-600 animate-pulse">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">OTP Complete - Ready to verify</span>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p><strong>Security Features:</strong></p>
                  <ul className="space-y-1 text-gray-700">
                    <li>✓ OTP expires in 5 minutes</li>
                    <li>✓ Maximum 3 verification attempts</li>
                    <li>✓ All attempts logged for audit</li>
                    <li>✓ {twoFAEnabled ? 'Biometric 2FA enabled' : 'Biometric 2FA available'}</li>
                    <li>✓ Compliance: SOX, GDPR, ISO 27001</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <Label>Recent Authentication Activity</Label>
              <div className="space-y-2">
                {[
                  { action: 'Role Assignment', time: '2 mins ago', status: 'Success' },
                  { action: 'Data Rectification', time: '15 mins ago', status: 'Success' },
                  { action: 'Permission Update', time: '1 hour ago', status: 'Failed' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <Badge className={activity.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleOTPVerify}
              disabled={otpValue.length !== 6}
              className="w-full h-14 bg-gradient-to-r from-[#27AE60] to-[#229954] hover:from-[#229954] hover:to-[#27AE60] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {t.verify} & Authorize
            </Button>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => goToScreen(7)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                {t.back}
              </Button>
              <Button
                variant="outline"
                onClick={() => goToScreen(3)}
                className="flex-1 h-12 border-2 border-[#D4AF37]/20"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#C19A2E] flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>
            <p className="text-gray-600 mt-2">
              TRADIE v1 - Legal Entity Management with Role-Based Access Control
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <div className="flex gap-1 p-1 bg-white rounded-lg border-2 border-[#D4AF37]/20 shadow-sm">
              {(['EN', 'HI', 'TE'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? 'bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] text-white' : ''}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Screen Navigation Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { num: 1, name: t.entitySetup, icon: Building2 },
            { num: 2, name: t.roleAssignment, icon: Users },
            { num: 3, name: t.permissionsDashboard, icon: Shield },
            { num: 4, name: t.dataRectification, icon: Edit3 },
            { num: 5, name: t.suggestions, icon: MessageSquare },
            { num: 6, name: t.visibilityLog, icon: Eye },
            { num: 7, name: t.confidentiality, icon: Lock },
            { num: 8, name: t.otpAuth, icon: Fingerprint },
          ].map((screen) => {
            const Icon = screen.icon;
            return (
              <Button
                key={screen.num}
                variant={currentScreen === screen.num ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToScreen(screen.num)}
                className={`transition-all duration-200 ${
                  currentScreen === screen.num
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] text-white shadow-lg'
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{screen.name}</span>
                <span className="md:hidden">{screen.num}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {renderScreen()}
      </div>

      {/* OTP Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-[#D4AF37]" />
              Enter OTP to Continue
            </DialogTitle>
            <DialogDescription>
              Please enter the 6-digit OTP sent to your registered mobile number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otpValue}
                onChange={setOtpValue}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2 border-[#D4AF37]/30" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {twoFAEnabled && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                <span className="text-sm">2FA enabled - Biometric verification required</span>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOTPDialog(false);
                  setOtpValue('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleOTPVerify();
                  if (currentScreen === 1) goToScreen(2);
                  else if (currentScreen === 2) goToScreen(3);
                  else if (currentScreen === 4) goToScreen(5);
                }}
                disabled={otpValue.length !== 6}
                className="flex-1 bg-gradient-to-r from-[#27AE60] to-[#229954] hover:from-[#229954] hover:to-[#27AE60]"
              >
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8 p-6 bg-white/60 rounded-lg border-2 border-[#D4AF37]/20">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            <strong>TRADIE v1 - Business Entity & Role Permissions Prototype</strong>
          </p>
          <p className="text-xs text-gray-500">
            Expert CS/CA/Advocate Design | RBAC per Indian Acts | OTP/2FA Auth | Visibility & Confidentiality Justified
          </p>
          <p className="text-xs text-gray-400">
            Compliance: Companies Act 2013, Partnership Act 1932, Co-operative Societies Act, Indian Trusts Act 1882, GDPR, ISO 27001
          </p>
        </div>
      </div>
    </div>
  );
}
