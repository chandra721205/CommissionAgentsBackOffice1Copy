import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { useMediaQuery } from './hooks/useMediaQuery';
import {
  Search, Filter, Download, Upload, AlertTriangle, CheckCircle2, Clock,
  Shield, TrendingUp, DollarSign, Package, User, Building2, Phone, Mail,
  MapPin, Calendar, FileText, Zap, Info, Edit, X, Plus, Trash2,
  ChevronDown, ExternalLink, CreditCard, Smartphone, Wallet, Banknote,
  QrCode, Star, Brain, Lock, ArrowRight, Mic, Eye, Send, History,
  HelpCircle, Calculator, BarChart3, AlertCircle, CheckCircle, XCircle,
  Home, Menu, Settings, LogOut, ChevronRight, Flag, Award, Globe,
  FileCheck, FileClock, FileEdit, Sun, Moon, MessageCircle, Clipboard
} from 'lucide-react';

type Screen = 'buyer-db' | 'weighment-auth' | 'bill-approval' | 'finance' | 'audit' | 'analytics';
type AuthStatus = 'waiting-buyer' | 'modified' | 'authorized';
type PaymentMethod = 'upi' | 'imps' | 'neft' | 'cheque' | 'wire' | 'swift' | 'ach' | 'card' | 'crypto' | 'sepa' | 'paypal';

interface BuyerRecord {
  id: string;
  serialNo: number;
  dateCreated: string;
  buyerName: string;
  brands: {
    brandName: string;
    companies: string[];
  }[];
  address: string;
  authorizedPerson: string;
  contacts: {
    mobile: string;
    whatsapp: string;
    email: string;
  };
  debitDetails: {
    method: PaymentMethod;
    chequeNo?: string;
    upiId?: string;
    accountNo?: string;
    swiftCode?: string;
  };
  country: string;
  aiVerification: 'verified' | 'suspicious' | 'new-entrant';
  reliabilityScore: number;
  modificationCount: number;
}

interface WeighmentRecord {
  id: string;
  lotId: string;
  cropType: string;
  variety: string;
  quantity: number;
  weight: number;
  unit: string;
  pricePerUnit: number;
  packagingMaterial: string;
  packagingCost: number;
  totalAmount: number;
  dueDate: string;
  dueDateType: 'regulatory' | 'association' | 'custom' | 'ai-suggested';
  status: AuthStatus;
  buyer: string;
  agent: string;
  billAttachment?: string;
  aiInsight?: string;
  modificationHistory: {
    date: string;
    field: string;
    oldValue: string;
    newValue: string;
    justification: string;
    user: string;
  }[];
}

const TradieV4Prototype = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('buyer-db');
  const [darkMode, setDarkMode] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRecord | null>(null);
  const [selectedWeighment, setSelectedWeighment] = useState<WeighmentRecord | null>(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [packagingType, setPackagingType] = useState<'fixed' | 'dynamic'>('fixed');
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1440px)');

  // Sample Buyer Data
  const [buyers, setBuyers] = useState<BuyerRecord[]>([
    {
      id: 'BYR-001',
      serialNo: 1,
      dateCreated: '2024-01-15',
      buyerName: 'PSR Enterprises',
      brands: [
        {
          brandName: 'JJ&Co',
          companies: ['JJ Main Ltd', 'JJ Sub-Branch A', 'JJ Sub-Branch B']
        },
        {
          brandName: 'GreenTrade',
          companies: ['GreenTrade Foods', 'GreenTrade Export']
        }
      ],
      address: 'GGFFH, Mumbai, Maharashtra 400001, India',
      authorizedPerson: 'Mr. Ramesh Kumar',
      contacts: {
        mobile: '+91-9876543210',
        whatsapp: '+91-9876543210',
        email: 'psr@example.com'
      },
      debitDetails: {
        method: 'cheque',
        chequeNo: 'IVDF-23145'
      },
      country: 'India',
      aiVerification: 'suspicious',
      reliabilityScore: 72,
      modificationCount: 3
    },
    {
      id: 'BYR-002',
      serialNo: 2,
      dateCreated: '2024-10-20',
      buyerName: 'Green Valley Trading',
      brands: [
        {
          brandName: 'Main Brand',
          companies: ['Green Valley Inc']
        }
      ],
      address: '123 Agri Park, Chennai, TN 600001, India',
      authorizedPerson: 'Ms. Priya Sharma',
      contacts: {
        mobile: '+91-9123456789',
        whatsapp: '+91-9123456789',
        email: 'gv@example.com'
      },
      debitDetails: {
        method: 'upi',
        upiId: 'greenvalley@okaxis'
      },
      country: 'India',
      aiVerification: 'verified',
      reliabilityScore: 95,
      modificationCount: 0
    },
    {
      id: 'BYR-003',
      serialNo: 3,
      dateCreated: '2024-10-27',
      buyerName: 'Dubai Trade Hub',
      brands: [
        {
          brandName: 'DTH Group',
          companies: ['DTH Trading LLC', 'DTH Exports']
        }
      ],
      address: 'Al Quoz, Dubai, UAE',
      authorizedPerson: 'Ahmed Al-Mansouri',
      contacts: {
        mobile: '+971-50-1234567',
        whatsapp: '+971-50-1234567',
        email: 'ahmed@dthhub.ae'
      },
      debitDetails: {
        method: 'swift',
        swiftCode: 'BOMLAEAD'
      },
      country: 'UAE',
      aiVerification: 'new-entrant',
      reliabilityScore: 50,
      modificationCount: 0
    }
  ]);

  // Sample Weighment Data
  const [weighments, setWeighments] = useState<WeighmentRecord[]>([
    {
      id: 'WGT-001',
      lotId: 'LOT-2024-789',
      cropType: 'Coconut',
      variety: 'West Coast Tall',
      quantity: 50,
      weight: 5000,
      unit: 'Kg',
      pricePerUnit: 22,
      packagingMaterial: 'Jute Bags',
      packagingCost: 50,
      totalAmount: 1150,
      dueDate: '2024-11-15',
      dueDateType: 'regulatory',
      status: 'waiting-buyer',
      buyer: 'PSR Enterprises',
      agent: 'Agent Sharma',
      billAttachment: 'bill_789.pdf',
      aiInsight: 'Buyer X modified 3 weighments in last 30 days across 4 agents — Reliability ↓ 10%.',
      modificationHistory: []
    },
    {
      id: 'WGT-002',
      lotId: 'LOT-2024-790',
      cropType: 'Rice',
      variety: 'Basmati',
      quantity: 100,
      weight: 10000,
      unit: 'Kg',
      pricePerUnit: 45,
      packagingMaterial: 'Plastic Bags',
      packagingCost: 150,
      totalAmount: 4650,
      dueDate: '2024-11-20',
      dueDateType: 'association',
      status: 'modified',
      buyer: 'Green Valley Trading',
      agent: 'Agent Patel',
      aiInsight: 'Modification requested: Price adjusted from ₹50 to ₹45 per kg.',
      modificationHistory: [
        {
          date: '2024-10-27 14:30',
          field: 'Price Per Unit',
          oldValue: '50',
          newValue: '45',
          justification: 'Quality grade lower than expected - agreed with buyer',
          user: 'Agent Patel'
        }
      ]
    },
    {
      id: 'WGT-003',
      lotId: 'LOT-2024-791',
      cropType: 'Turmeric',
      variety: 'Finger',
      quantity: 25,
      weight: 2500,
      unit: 'Kg',
      pricePerUnit: 120,
      packagingMaterial: 'Carton Boxes',
      packagingCost: 75,
      totalAmount: 3075,
      dueDate: '2024-11-10',
      dueDateType: 'custom',
      status: 'authorized',
      buyer: 'Dubai Trade Hub',
      agent: 'Agent Khan',
      modificationHistory: []
    }
  ]);

  // Country Payment Methods
  const countryPaymentMethods: Record<string, PaymentMethod[]> = {
    'India': ['upi', 'imps', 'neft', 'cheque'],
    'UAE': ['wire', 'swift'],
    'USA': ['ach', 'card', 'crypto'],
    'EU': ['sepa', 'wire', 'paypal'],
    'UK': ['wire', 'sepa']
  };

  // Commodity Measurement Presets
  const commodityMeasurements: Record<string, string[]> = {
    'Grains': ['Kg', 'Quintal', 'MT (Metric Ton)'],
    'Fruits': ['Box', 'Crate', 'Kg'],
    'Vegetables': ['Bag', 'Kg'],
    'Spices': ['Gram', 'Kg', 'Bag']
  };

  // Due Date Type Tooltips
  const dueDateTooltips: Record<string, string> = {
    'regulatory': 'As per India Agricultural Produce Marketing Act - Standard 15 days from delivery',
    'association': 'APEDA Association Guidelines - Standard 30 days from delivery',
    'custom': 'Mutually agreed payment terms between Commission Agent and Buyer',
    'ai-suggested': 'AI calculated based on historical settlement patterns of this buyer (avg 22 days)'
  };

  // AI Verification Badges
  const getAIBadge = (verification: string, score: number) => {
    switch (verification) {
      case 'verified':
        return <Badge className="bg-green-500 text-white">✓ Verified ({score}%)</Badge>;
      case 'suspicious':
        return <Badge className="bg-red-500 text-white">⚠ Suspicious ({score}%)</Badge>;
      case 'new-entrant':
        return <Badge className="bg-blue-500 text-white">★ New Entrant ({score}%)</Badge>;
      default:
        return null;
    }
  };

  // Status Indicators
  const getStatusBadge = (status: AuthStatus) => {
    switch (status) {
      case 'waiting-buyer':
        return <Badge className="bg-yellow-500 text-white">🕓 Waiting for Buyer Authorization</Badge>;
      case 'modified':
        return <Badge className="bg-orange-500 text-white">🟡 Modified (Pending Justification)</Badge>;
      case 'authorized':
        return <Badge className="bg-green-500 text-white">🟢 Authorized (Appended to Final Ledger)</Badge>;
      default:
        return null;
    }
  };

  // Header Component
  const Header = () => (
    <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8960F] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!isMobile && (
                <div>
                  <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    TRADIE v4.0
                  </h1>
                  <p className="text-xs text-gray-500">Buyer Database & Authorization</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {darkMode ? 'Light' : 'Dark'} Mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="relative"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#009688] rounded-full" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Assistant (Grok)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isMobile && (
              <div className="flex items-center gap-2 ml-4">
                <Avatar>
                  <User className="w-5 h-5" />
                </Avatar>
                <div className="text-sm">
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Agent Sharma
                  </div>
                  <div className="text-xs text-gray-500">Commission Agent</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumbs (Desktop Only) */}
        {!isMobile && (
          <div className="pb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="cursor-pointer" onClick={() => setCurrentScreen('buyer-db')}>
                    Home
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-[#D4AF37]">
                    {currentScreen === 'buyer-db' && 'Buyer Database'}
                    {currentScreen === 'weighment-auth' && 'Weighment Authorization'}
                    {currentScreen === 'bill-approval' && 'Bill Approval'}
                    {currentScreen === 'finance' && 'Finance'}
                    {currentScreen === 'audit' && 'Audit Logs'}
                    {currentScreen === 'analytics' && 'Analytics'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </div>
    </header>
  );

  // Sidebar (Desktop Only)
  const Sidebar = () => {
    if (isMobile) return null;

    const menuItems = [
      { icon: BarChart3, label: 'Dashboard', screen: 'buyer-db' as Screen },
      { icon: FileCheck, label: 'Transactions', screen: 'weighment-auth' as Screen },
      { icon: FileClock, label: 'Pending Approvals', screen: 'bill-approval' as Screen },
      { icon: DollarSign, label: 'Finance', screen: 'finance' as Screen },
      { icon: FileEdit, label: 'Audit', screen: 'audit' as Screen },
      { icon: Brain, label: 'AI Reports', screen: 'analytics' as Screen },
      { icon: Settings, label: 'Settings', screen: 'buyer-db' as Screen }
    ];

    return (
      <aside className={`w-64 border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} h-[calc(100vh-64px)] sticky top-16`}>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={currentScreen === item.screen ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                currentScreen === item.screen 
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-white' 
                  : darkMode ? 'text-gray-300 hover:bg-gray-800' : ''
              }`}
              onClick={() => setCurrentScreen(item.screen)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
    );
  };

  // Mobile Bottom Navigation
  const MobileNav = () => {
    if (!isMobile) return null;

    const navItems = [
      { icon: Home, label: 'Home', screen: 'buyer-db' as Screen },
      { icon: Package, label: 'Weighment', screen: 'weighment-auth' as Screen },
      { icon: FileCheck, label: 'Bills', screen: 'bill-approval' as Screen },
      { icon: DollarSign, label: 'Finance', screen: 'finance' as Screen },
      { icon: User, label: 'Profile', screen: 'audit' as Screen }
    ];

    return (
      <div className={`fixed bottom-0 left-0 right-0 border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} z-50`}>
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentScreen === item.screen
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Avatar Component
  const Avatar = ({ children }: { children: React.ReactNode }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
      darkMode ? 'bg-gray-800' : 'bg-gray-200'
    }`}>
      {children}
    </div>
  );

  // ==================== SCREEN 1: BUYER DATABASE ====================
  const BuyerDatabaseScreen = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <User className="w-5 h-5 text-[#D4AF37]" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {buyers.length}
            </div>
            <div className="text-xs text-gray-500">Total Buyers</div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className={`text-2xl font-bold text-green-600`}>
              {buyers.filter(b => b.aiVerification === 'verified').length}
            </div>
            <div className="text-xs text-gray-500">Verified</div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className={`text-2xl font-bold text-red-600`}>
              {buyers.filter(b => b.aiVerification === 'suspicious').length}
            </div>
            <div className="text-xs text-gray-500">Suspicious</div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold text-blue-600`}>
              {buyers.filter(b => b.aiVerification === 'new-entrant').length}
            </div>
            <div className="text-xs text-gray-500">New Entrants</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search buyer name, serial no..."
                className={`pl-10 ${darkMode ? 'bg-gray-900 border-gray-700' : ''}`}
              />
            </div>
            <Button variant="outline" className={darkMode ? 'border-gray-700' : ''}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className={darkMode ? 'border-gray-700' : ''}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className={darkMode ? 'border-gray-700' : ''}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Records - Mobile Cards / Desktop Table */}
      {isMobile ? (
        <div className="space-y-4">
          {buyers.map((buyer) => (
            <Card 
              key={buyer.id} 
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                darkMode ? 'bg-gray-800 border-gray-700' : ''
              }`}
              onClick={() => setSelectedBuyer(buyer)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {buyer.buyerName}
                    </div>
                    <div className="text-xs text-gray-500">#{buyer.serialNo} • {buyer.dateCreated}</div>
                  </div>
                  {getAIBadge(buyer.aiVerification, buyer.reliabilityScore)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {buyer.brands.length} Brand(s)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {buyer.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {buyer.contacts.mobile}
                    </span>
                  </div>
                </div>

                {buyer.modificationCount > 0 && (
                  <Alert className="mt-3 border-red-500 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-xs text-red-700">
                      {buyer.modificationCount} modifications in last 30 days
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={darkMode ? 'border-gray-700' : ''}>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Brands</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>AI Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyers.map((buyer) => (
                    <TableRow 
                      key={buyer.id} 
                      className={`cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedBuyer(buyer)}
                    >
                      <TableCell className="font-mono">#{buyer.serialNo}</TableCell>
                      <TableCell>{buyer.dateCreated}</TableCell>
                      <TableCell className="font-semibold">{buyer.buyerName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buyer.brands.map((brand, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {brand.brandName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          {buyer.country}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{buyer.contacts.mobile}</TableCell>
                      <TableCell className="capitalize">{buyer.debitDetails.method}</TableCell>
                      <TableCell>{getAIBadge(buyer.aiVerification, buyer.reliabilityScore)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==================== SCREEN 2: WEIGHMENT AUTHORIZATION ====================
  const WeighmentAuthScreen = () => (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-l-4 border-l-yellow-500 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {weighments.filter(w => w.status === 'waiting-buyer').length}
                </div>
                <div className="text-sm text-gray-500">Waiting Buyer Auth</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {weighments.filter(w => w.status === 'modified').length}
                </div>
                <div className="text-sm text-gray-500">Modified (Pending)</div>
              </div>
              <Edit className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-green-500 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {weighments.filter(w => w.status === 'authorized').length}
                </div>
                <div className="text-sm text-gray-500">Authorized</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weighment Records */}
      <div className="space-y-4">
        {weighments.map((weighment) => (
          <Card 
            key={weighment.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} ${
              weighment.status === 'modified' ? 'border-l-4 border-l-orange-500' :
              weighment.status === 'authorized' ? 'border-l-4 border-l-green-500' :
              'border-l-4 border-l-yellow-500'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{weighment.cropType} - {weighment.variety}</CardTitle>
                  <CardDescription>Lot ID: {weighment.lotId}</CardDescription>
                </div>
                {getStatusBadge(weighment.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Quantity</div>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weighment.quantity} {weighment.unit}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Weight</div>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weighment.weight} Kg
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Price/Unit</div>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{weighment.pricePerUnit}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total Amount</div>
                  <div className="font-bold text-[#D4AF37] text-lg">
                    ₹{weighment.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-xs font-semibold mb-2 text-gray-500">Calculation Breakdown:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Units: {weighment.quantity} × ₹{weighment.pricePerUnit}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{weighment.quantity * weighment.pricePerUnit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Packaging: {weighment.packagingMaterial}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{weighment.packagingCost}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total Payable:</span>
                    <span className="text-[#D4AF37]">₹{weighment.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Due Date Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Due Date: <span className="font-semibold">{weighment.dueDate}</span>
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="capitalize cursor-help">
                        {weighment.dueDateType.replace('-', ' ')}
                        <HelpCircle className="w-3 h-3 ml-1" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{dueDateTooltips[weighment.dueDateType]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* AI Insight */}
              {weighment.aiInsight && (
                <Alert className="border-[#009688] bg-[#009688]/10">
                  <Brain className="w-4 h-4 text-[#009688]" />
                  <AlertDescription className="text-sm">
                    <strong>AI Insight:</strong> {weighment.aiInsight}
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {weighment.status === 'waiting-buyer' && (
                  <>
                    <Button 
                      className="bg-[#D4AF37] hover:bg-[#B8960F]"
                      onClick={() => {
                        setSelectedWeighment(weighment);
                        setShow2FA(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Bill
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedWeighment(weighment);
                        setShowChangeModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Request Change
                    </Button>
                  </>
                )}
                {weighment.status === 'modified' && (
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    View Change History
                  </Button>
                )}
                {weighment.billAttachment && (
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Bill PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ==================== SCREEN 3-7: Additional Screens (Abbreviated for length) ====================
  
  const BillApprovalScreen = () => (
    <div className="space-y-6">
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Bill Approval Center</CardTitle>
          <CardDescription>Review and authorize pending bills with 2FA verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Bill approval interface - Select weighment from Authorization Queue to approve
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FinanceScreen = () => (
    <div className="space-y-6">
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Finance Dashboard</CardTitle>
          <CardDescription>Payment calculations, due dates, and financial analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Packaging Configuration */}
          <div>
            <Label>Packaging Type</Label>
            <div className="flex gap-4 mt-2">
              <Button
                variant={packagingType === 'fixed' ? 'default' : 'outline'}
                onClick={() => setPackagingType('fixed')}
              >
                Fixed
              </Button>
              <Button
                variant={packagingType === 'dynamic' ? 'default' : 'outline'}
                onClick={() => setPackagingType('dynamic')}
              >
                Dynamic
              </Button>
            </div>
          </div>

          {packagingType === 'dynamic' && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label>Weight per Bag (kg)</Label>
                <Input type="number" placeholder="50" />
              </div>
              <div>
                <Label>Material Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jute">Jute</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cost per Unit (₹)</Label>
                <Input type="number" placeholder="5" />
              </div>
            </div>
          )}

          {/* Country Payment Methods */}
          <div>
            <Label>Select Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">🇮🇳 India</SelectItem>
                <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                <SelectItem value="USA">🇺🇸 USA</SelectItem>
                <SelectItem value="EU">🇪🇺 EU</SelectItem>
                <SelectItem value="UK">🇬🇧 UK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Available Payment Methods for {selectedCountry}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {countryPaymentMethods[selectedCountry]?.map((method) => (
                <Badge key={method} variant="outline" className="capitalize">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AuditScreen = () => (
    <div className="space-y-6">
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Audit & Regulatory Logs</CardTitle>
          <CardDescription>Complete transaction history with AI analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className={darkMode ? 'border-gray-700' : ''}>
                <TableHead>Entry ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lot ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Auth Status</TableHead>
                <TableHead>AI Risk Flag</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weighments.map((w) => (
                <TableRow key={w.id} className={darkMode ? 'border-gray-700' : ''}>
                  <TableCell className="font-mono">{w.id}</TableCell>
                  <TableCell>2024-10-27</TableCell>
                  <TableCell>{w.lotId}</TableCell>
                  <TableCell>{w.buyer}</TableCell>
                  <TableCell>{w.agent}</TableCell>
                  <TableCell>{getStatusBadge(w.status)}</TableCell>
                  <TableCell>
                    {w.modificationHistory.length > 0 ? (
                      <Badge className="bg-red-500">⚠ Flagged</Badge>
                    ) : (
                      <Badge className="bg-green-500">✓ Clear</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <History className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const AnalyticsScreen = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`bg-gradient-to-br from-[#009688] to-[#00796B] text-white ${darkMode ? 'border-gray-700' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">22 days</div>
            <div className="text-sm opacity-90">Avg Settlement Time</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-[#D4AF37] to-[#B8960F] text-white ${darkMode ? 'border-gray-700' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Flag className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">12%</div>
            <div className="text-sm opacity-90">Discrepancy Ratio</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-red-500 to-red-600 text-white ${darkMode ? 'border-gray-700' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm opacity-90">Multi-Agent Flags</div>
          </CardContent>
        </Card>
      </div>

      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Top 3 Buyers Flagged by Multiple Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {buyers.filter(b => b.modificationCount > 0).map((buyer) => (
              <div key={buyer.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {buyer.buyerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {buyer.modificationCount} modifications across 4 agents
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white">
                    Reliability ↓ {100 - buyer.reliabilityScore}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 2FA Modal
  const TwoFAModal = () => (
    <Dialog open={show2FA} onOpenChange={setShow2FA}>
      <DialogContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <DialogHeader>
          <DialogTitle className={darkMode ? 'text-white' : ''}>
            2FA Verification Required
          </DialogTitle>
          <DialogDescription>
            Enter OTP sent to Buyer and Commission Agent
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Buyer OTP</Label>
            <div className="flex justify-center mt-2">
              <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          
          <div>
            <Label>Agent OTP</Label>
            <div className="flex justify-center mt-2">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1 bg-[#D4AF37] hover:bg-[#B8960F]"
              onClick={() => {
                setShow2FA(false);
                if (selectedWeighment) {
                  setWeighments(weighments.map(w =>
                    w.id === selectedWeighment.id
                      ? { ...w, status: 'authorized' as AuthStatus }
                      : w
                  ));
                }
              }}
            >
              Verify & Approve
            </Button>
            <Button variant="outline" onClick={() => setShow2FA(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Change Request Modal
  const ChangeRequestModal = () => (
    <Dialog open={showChangeModal} onOpenChange={setShowChangeModal}>
      <DialogContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <DialogHeader>
          <DialogTitle className={darkMode ? 'text-white' : ''}>
            Request Change - {selectedWeighment?.lotId}
          </DialogTitle>
          <DialogDescription>
            Provide mandatory justification for requested changes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Field to Modify</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price Per Unit</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="packaging">Packaging Cost</SelectItem>
                <SelectItem value="duedate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>New Value</Label>
            <Input placeholder="Enter new value" />
          </div>

          <div>
            <Label>Justification (Mandatory) *</Label>
            <Textarea
              placeholder="Explain reason for change..."
              rows={4}
              className={darkMode ? 'bg-gray-900 border-gray-700' : ''}
            />
          </div>

          <Alert className="border-[#009688] bg-[#009688]/10">
            <Info className="w-4 h-4 text-[#009688]" />
            <AlertDescription className="text-xs">
              <strong>Note:</strong> Frequent change patterns are tracked by AI and may affect buyer/agent ratings.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-[#009688] hover:bg-[#00796B]"
              onClick={() => setShowChangeModal(false)}
            >
              Submit Change Request
            </Button>
            <Button variant="outline" onClick={() => setShowChangeModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // AI Assistant Floating Button
  const AIAssistantButton = () => {
    if (!showAIAssistant) return null;

    return (
      <div className={`fixed bottom-20 md:bottom-6 right-6 w-80 rounded-2xl shadow-2xl border-2 border-[#009688] ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } z-50`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#009688] to-[#00796B] rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Grok AI Assistant
                </div>
                <div className="text-xs text-green-500">● Online</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowAIAssistant(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} mb-3`}>
            <p className="text-sm">
              👋 Hi! I'm your AI assistant. I can help you with:
              <br />
              • Buyer risk analysis
              <br />
              • Payment predictions
              <br />
              • Compliance checks
              <br />
              • Pattern detection
            </p>
          </div>

          <Input
            placeholder="Ask me anything..."
            className={darkMode ? 'bg-gray-900 border-gray-700' : ''}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-[#FFFEF5]'}`}>
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'p-6'} ${isMobile ? 'p-4' : ''}`}>
          <div className="container mx-auto max-w-7xl">
            {currentScreen === 'buyer-db' && <BuyerDatabaseScreen />}
            {currentScreen === 'weighment-auth' && <WeighmentAuthScreen />}
            {currentScreen === 'bill-approval' && <BillApprovalScreen />}
            {currentScreen === 'finance' && <FinanceScreen />}
            {currentScreen === 'audit' && <AuditScreen />}
            {currentScreen === 'analytics' && <AnalyticsScreen />}
          </div>
        </main>
      </div>

      <MobileNav />
      <TwoFAModal />
      <ChangeRequestModal />
      <AIAssistantButton />
    </div>
  );
};

export default TradieV4Prototype;
