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
import { 
  Search, Filter, Download, Upload, AlertTriangle, CheckCircle2, Clock, 
  Shield, TrendingUp, DollarSign, Package, User, Building2, Phone, Mail, 
  MapPin, Calendar, FileText, Zap, Info, Edit, X, Plus, Trash2, 
  ChevronDown, ExternalLink, CreditCard, Smartphone, Wallet, Banknote,
  QrCode, Star, Brain, Lock, ArrowRight, Mic, Eye, Send, History,
  HelpCircle, Calculator, BarChart3, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

type Screen = 'overview' | 'add-edit' | 'detail' | 'payment-config' | 'overdue-mgmt';
type BillStatus = 'pending' | 'approved' | 'overdue' | 'change-requested';
type PaymentMethod = 'cheque' | 'bank-wire' | 'upi' | 'cash' | 'card' | 'digital-wallet';

interface BuyerRecord {
  id: string;
  serialNo: number;
  date: string;
  billNo: string;
  buyerName: string;
  brands: string[];
  address: string;
  contacts: {
    number: string;
    email: string;
    isPrimary: boolean;
  }[];
  companyAssociation: string;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    chequeNo?: string;
    accountNo?: string;
    bankName?: string;
    ifsc?: string;
    refNo?: string;
    upiId?: string;
    transactionRef?: string;
    cardProvider?: string;
    lastFourDigits?: string;
    walletName?: string;
    receiptNo?: string;
    witnessName?: string;
  };
  documents: string[];
  commodity: string;
  units: number;
  measurement: string;
  weightPerUnit: number;
  totalWeight: number;
  unitPrice: number;
  amount: number;
  packagingCost: number;
  totalAmount: number;
  dueDate: string;
  dueDateType: 'regulatory' | 'association' | 'agreement' | 'manual';
  receiptDate?: string;
  daysPastDue: number;
  status: BillStatus;
  auditorNotes: {
    date: string;
    user: string;
    note: string;
    type: 'edit' | 'approval' | 'justification';
  }[];
  aiInsights: {
    riskLevel: 'low' | 'medium' | 'high';
    recoveryProbability: number;
    recommendation: string;
    behaviorPattern?: string;
  };
}

const ExpertBuyerDatabase = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  const [selectedRecord, setSelectedRecord] = useState<BuyerRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState<BillStatus | 'all'>('all');
  const [filterCommodity, setFilterCommodity] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [showGrokInsight, setShowGrokInsight] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // Sample Data
  const [records, setRecords] = useState<BuyerRecord[]>([
    {
      id: 'BR-001',
      serialNo: 1,
      date: '2024-05-13',
      billNo: 'YT-7685',
      buyerName: 'PSR Enterprises',
      brands: ['JJ&Co', 'Sub-Branch A', 'Sub-Branch B'],
      address: 'GGFFH, Mumbai, Maharashtra 400001',
      contacts: [
        { number: '+91-9876543210', email: 'psr@example.com', isPrimary: true },
        { number: '+91-9876543211', email: 'psr.sales@example.com', isPrimary: false }
      ],
      companyAssociation: 'APEDA Registered',
      paymentMethod: 'cheque',
      paymentDetails: {
        chequeNo: 'IVDF-23145',
        bankName: 'HDFC Bank',
        refNo: 'REF-789456'
      },
      documents: ['cheque_scan.pdf', 'payment_receipt.pdf'],
      commodity: 'Coconut West Coast Tall',
      units: 23,
      measurement: 'Quintal',
      weightPerUnit: 100,
      totalWeight: 2300,
      unitPrice: 1200,
      amount: 27600,
      packagingCost: 50,
      totalAmount: 27926,
      dueDate: '2024-05-28',
      dueDateType: 'regulatory',
      receiptDate: '2024-06-06',
      daysPastDue: 9,
      status: 'overdue',
      auditorNotes: [
        {
          date: '2024-05-13',
          user: 'Agent Sharma',
          note: 'Initial entry created. Payment by cheque.',
          type: 'edit'
        },
        {
          date: '2024-05-29',
          user: 'Auditor Khan',
          note: 'Payment overdue by 1 day. Buyer contacted.',
          type: 'justification'
        }
      ],
      aiInsights: {
        riskLevel: 'medium',
        recoveryProbability: 75,
        recommendation: 'Grok: 9 Days Past—Predict 75% Recovery if Notify Now. Buyer has 87% historical payment rate.',
        behaviorPattern: 'Persistent late payment pattern detected (3 times in last 6 months)'
      }
    },
    {
      id: 'BR-002',
      serialNo: 2,
      date: '2024-10-15',
      billNo: 'YT-7890',
      buyerName: 'Green Valley Trading',
      brands: ['Main Brand'],
      address: '123 Agri Park, Chennai, TN 600001',
      contacts: [
        { number: '+91-9123456789', email: 'gv@example.com', isPrimary: true }
      ],
      companyAssociation: 'Independent Trader',
      paymentMethod: 'upi',
      paymentDetails: {
        upiId: 'greenvalley@okaxis',
        transactionRef: 'TXN987654321'
      },
      documents: ['upi_receipt.pdf'],
      commodity: 'Rice Basmati',
      units: 50,
      measurement: '50kg Bag',
      weightPerUnit: 50,
      totalWeight: 2500,
      unitPrice: 3500,
      amount: 175000,
      packagingCost: 250,
      totalAmount: 176500,
      dueDate: '2024-10-30',
      dueDateType: 'association',
      status: 'approved',
      daysPastDue: 0,
      auditorNotes: [
        {
          date: '2024-10-15',
          user: 'Agent Patel',
          note: 'Entry approved. UPI payment verified.',
          type: 'approval'
        }
      ],
      aiInsights: {
        riskLevel: 'low',
        recoveryProbability: 98,
        recommendation: 'Grok: Excellent buyer. 98% on-time payment history. Recommended for credit extension.',
        behaviorPattern: 'Consistent timely payments'
      }
    }
  ]);

  const commodities = ['Coconut West Coast Tall', 'Rice Basmati', 'Wheat', 'Turmeric', 'Cardamom'];
  const brands = ['JJ&Co', 'Sub-Branch A', 'Sub-Branch B', 'Main Brand', 'All'];
  const measurements = ['Quintal', '50kg Bag', 'Kg', 'Metric Ton', 'Nos'];

  // Payment Method Icons
  const paymentIcons: Record<PaymentMethod, any> = {
    'cheque': FileText,
    'bank-wire': Building2,
    'upi': Smartphone,
    'cash': Banknote,
    'card': CreditCard,
    'digital-wallet': Wallet
  };

  // Status Colors
  const statusColors: Record<BillStatus, string> = {
    'pending': 'bg-amber-500',
    'approved': 'bg-green-500',
    'overdue': 'bg-red-500',
    'change-requested': 'bg-blue-500'
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.billNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || record.brands.some(b => b === filterBrand);
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesCommodity = filterCommodity === 'all' || record.commodity === filterCommodity;
    const matchesPayment = filterPayment === 'all' || record.paymentMethod === filterPayment;
    
    return matchesSearch && matchesBrand && matchesStatus && matchesCommodity && matchesPayment;
  });

  // Calculate stats
  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    approved: records.filter(r => r.status === 'approved').length,
    overdue: records.filter(r => r.status === 'overdue').length,
    changeRequested: records.filter(r => r.status === 'change-requested').length,
    totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0),
    overdueAmount: records.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.totalAmount, 0)
  };

  // ==================== SCREEN 1: BUYER ENTRY OVERVIEW ====================
  const OverviewScreen = () => (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Buyer Database - Overview</h1>
          <p className="text-sm text-gray-600">Comprehensive buyer transaction management with AI insights</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={() => {
            setSelectedRecord(null);
            setCurrentScreen('add-edit');
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total Records</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-gray-600">Approved</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.changeRequested}</div>
            <div className="text-xs text-gray-600">Change Requested</div>
          </CardContent>
        </Card>
      </div>

      {/* Grok AI System Insight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">Grok AI System Insights</span>
                <Badge className="bg-purple-600 text-white">Real-time</Badge>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                ⚠️ <strong>Alert:</strong> {stats.overdue} records overdue totaling ₹{stats.overdueAmount.toLocaleString()}. 
                Recommend immediate action on 9+ day delays.
              </p>
              <p className="text-sm text-gray-700">
                📊 <strong>Pattern Detected:</strong> PSR Enterprises shows persistent late payment (3x in 6 months). 
                Consider stricter terms or advance payment requirement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search buyer or bill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Brand Filter */}
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by brand..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as BillStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="change-requested">Change Requested</SelectItem>
              </SelectContent>
            </Select>

            {/* Commodity Filter */}
            <Select value={filterCommodity} onValueChange={setFilterCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by commodity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commodities</SelectItem>
                {commodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank-wire">Bank Wire</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="digital-wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredRecords.length} of {records.length} records
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Bill No</TableHead>
                  <TableHead>Buyer Name</TableHead>
                  <TableHead>Brands</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const PaymentIcon = paymentIcons[record.paymentMethod];
                  return (
                    <TableRow 
                      key={record.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        record.status === 'overdue' ? 'bg-red-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedRecord(record);
                        setCurrentScreen('detail');
                      }}
                    >
                      <TableCell className="font-mono text-sm">{record.serialNo}</TableCell>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-mono font-semibold text-blue-600">{record.billNo}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">{record.buyerName}</div>
                        <div className="text-xs text-gray-500">{record.address.split(',')[0]}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.brands.slice(0, 2).map((brand, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {brand}
                            </Badge>
                          ))}
                          {record.brands.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{record.brands.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{record.contacts[0]?.number}</div>
                        <div className="text-xs text-gray-500">{record.contacts[0]?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm capitalize">{record.paymentMethod.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.commodity}</TableCell>
                      <TableCell className="text-sm">
                        {record.units} {record.measurement}
                      </TableCell>
                      <TableCell className="font-semibold">₹{record.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-green-600">₹{record.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">{record.dueDate}</div>
                        {record.daysPastDue > 0 && (
                          <Badge className="bg-red-500 text-white text-xs mt-1">
                            {record.daysPastDue}d overdue
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[record.status]} text-white capitalize`}>
                          {record.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              setCurrentScreen('detail');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              setCurrentScreen('add-edit');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== SCREEN 2: ADD/EDIT BUYER RECORD ====================
  const AddEditScreen = () => {
    const isEdit = selectedRecord !== null;
    const [formData, setFormData] = useState<Partial<BuyerRecord>>(
      selectedRecord || {
        buyerName: '',
        brands: [''],
        address: '',
        contacts: [{ number: '', email: '', isPrimary: true }],
        companyAssociation: '',
        paymentMethod: 'cheque',
        paymentDetails: {},
        documents: [],
        commodity: '',
        units: 0,
        measurement: 'Quintal',
        weightPerUnit: 0,
        totalWeight: 0,
        unitPrice: 0,
        amount: 0,
        packagingCost: 0,
        totalAmount: 0,
        dueDate: '',
        dueDateType: 'regulatory',
        status: 'pending'
      }
    );

    // Auto-calculate amounts
    const calculateAmounts = () => {
      const amount = (formData.units || 0) * (formData.unitPrice || 0);
      const totalAmount = amount + (formData.packagingCost || 0);
      setFormData(prev => ({ ...prev, amount, totalAmount }));
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">{isEdit ? 'Edit' : 'Add New'} Buyer Record</h2>
            <p className="text-sm text-gray-600">Complete all fields for accurate record keeping</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentScreen('overview')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buyer Details Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Buyer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Buyer Name *</Label>
                  <Input
                    value={formData.buyerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyerName: e.target.value }))}
                    placeholder="Enter buyer/company name"
                  />
                </div>

                <div>
                  <Label>Brand/Multi-Company Dropdown</Label>
                  <div className="space-y-2">
                    {formData.brands?.map((brand, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={brand}
                          onChange={(e) => {
                            const newBrands = [...(formData.brands || [])];
                            newBrands[index] = e.target.value;
                            setFormData(prev => ({ ...prev, brands: newBrands }));
                          }}
                          placeholder={`Brand ${index + 1}`}
                        />
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newBrands = formData.brands?.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, brands: newBrands }));
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        brands: [...(prev.brands || []), '']
                      }))}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Brand
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Address *</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address with city, state, PIN"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Authorized Contacts (Add Multiple)</Label>
                  <div className="space-y-3">
                    {formData.contacts?.map((contact, index) => (
                      <Card key={index} className="p-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Phone Number</Label>
                            <Input
                              value={contact.number}
                              onChange={(e) => {
                                const newContacts = [...(formData.contacts || [])];
                                newContacts[index].number = e.target.value;
                                setFormData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                              placeholder="+91-XXXXXXXXXX"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => {
                                const newContacts = [...(formData.contacts || [])];
                                newContacts[index].email = e.target.value;
                                setFormData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                              placeholder="email@example.com"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={contact.isPrimary}
                              onChange={(e) => {
                                const newContacts = formData.contacts?.map((c, i) => ({
                                  ...c,
                                  isPrimary: i === index ? e.target.checked : false
                                }));
                                setFormData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                            />
                            <span className="text-xs text-gray-600">Primary Contact</span>
                          </div>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newContacts = formData.contacts?.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        contacts: [...(prev.contacts || []), { number: '', email: '', isPrimary: false }]
                      }))}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Company Association</Label>
                  <Select
                    value={formData.companyAssociation}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, companyAssociation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select association..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APEDA Registered">APEDA Registered</SelectItem>
                      <SelectItem value="Independent Trader">Independent Trader</SelectItem>
                      <SelectItem value="Cooperative Member">Cooperative Member</SelectItem>
                      <SelectItem value="FPO Member">FPO Member</SelectItem>
                      <SelectItem value="Export House">Export House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payment Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Debit/Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      paymentMethod: value as PaymentMethod,
                      paymentDetails: {}
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cheque">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Cheque
                        </div>
                      </SelectItem>
                      <SelectItem value="bank-wire">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Bank Wire/Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          UPI
                        </div>
                      </SelectItem>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4" />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          International Card
                        </div>
                      </SelectItem>
                      <SelectItem value="digital-wallet">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          Digital Wallet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Payment Fields */}
                {formData.paymentMethod === 'cheque' && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label>Cheque Number *</Label>
                      <Input
                        value={formData.paymentDetails?.chequeNo || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, chequeNo: e.target.value }
                        }))}
                        placeholder="Enter cheque number"
                      />
                    </div>
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        value={formData.paymentDetails?.bankName || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, bankName: e.target.value }
                        }))}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label>Upload Scanned Copy</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Cheque Scan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'bank-wire' && (
                  <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Account Number *</Label>
                        <Input
                          value={formData.paymentDetails?.accountNo || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, accountNo: e.target.value }
                          }))}
                          placeholder="Account number"
                        />
                      </div>
                      <div>
                        <Label>Bank Name *</Label>
                        <Input
                          value={formData.paymentDetails?.bankName || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, bankName: e.target.value }
                          }))}
                          placeholder="Bank name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>IFSC Code *</Label>
                        <Input
                          value={formData.paymentDetails?.ifsc || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, ifsc: e.target.value }
                          }))}
                          placeholder="IFSC code"
                        />
                      </div>
                      <div>
                        <Label>Reference Number *</Label>
                        <Input
                          value={formData.paymentDetails?.refNo || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, refNo: e.target.value }
                          }))}
                          placeholder="Transaction ref"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
                    <div>
                      <Label>UPI ID *</Label>
                      <Input
                        value={formData.paymentDetails?.upiId || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, upiId: e.target.value }
                        }))}
                        placeholder="user@bank"
                      />
                    </div>
                    <div>
                      <Label>Transaction Reference *</Label>
                      <Input
                        value={formData.paymentDetails?.transactionRef || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, transactionRef: e.target.value }
                        }))}
                        placeholder="UPI transaction ID"
                      />
                    </div>
                    <div>
                      <Label>Upload Receipt</Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload UPI Receipt
                      </Button>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-orange-50 rounded-lg">
                    <div>
                      <Label>Card Provider *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="rupay">RuPay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Last 4 Digits *</Label>
                        <Input
                          value={formData.paymentDetails?.lastFourDigits || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, lastFourDigits: e.target.value }
                          }))}
                          placeholder="XXXX"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label>Transaction Ref *</Label>
                        <Input
                          value={formData.paymentDetails?.transactionRef || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, transactionRef: e.target.value }
                          }))}
                          placeholder="Auth code"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'digital-wallet' && (
                  <div className="space-y-3 p-4 bg-pink-50 rounded-lg">
                    <div>
                      <Label>Wallet Name *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="googlepay">Google Pay</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Transaction/Receipt Number *</Label>
                      <Input
                        value={formData.paymentDetails?.receiptNo || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, receiptNo: e.target.value }
                        }))}
                        placeholder="Wallet transaction ID"
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cash' && (
                  <div className="space-y-3 p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <Label>Cash Receipt Number</Label>
                      <Input
                        value={formData.paymentDetails?.receiptNo || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, receiptNo: e.target.value }
                        }))}
                        placeholder="Receipt number"
                      />
                    </div>
                    <div>
                      <Label>Witness Name</Label>
                      <Input
                        value={formData.paymentDetails?.witnessName || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, witnessName: e.target.value }
                        }))}
                        placeholder="Name of witness"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <Label>Auditor Note (for payment edits/justifications)</Label>
                  <Textarea
                    placeholder="Add note for audit trail..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for any changes to approved records
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Commodity Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Commodity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Commodity Type *</Label>
                  <Select
                    value={formData.commodity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, commodity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map(commodity => (
                        <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Number of Units *</Label>
                    <Input
                      type="number"
                      value={formData.units}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, units: Number(e.target.value) }));
                        setTimeout(calculateAmounts, 100);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Measurement *</Label>
                    <Select
                      value={formData.measurement}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, measurement: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {measurements.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Weight/Unit (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weightPerUnit}
                      onChange={(e) => {
                        const weight = Number(e.target.value);
                        setFormData(prev => ({ 
                          ...prev, 
                          weightPerUnit: weight,
                          totalWeight: weight * (prev.units || 0)
                        }));
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Total Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.totalWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalWeight: Number(e.target.value) }))}
                    placeholder="Auto-filled or manual override"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated: {formData.units} × {formData.weightPerUnit} = {(formData.units || 0) * (formData.weightPerUnit || 0)} kg
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Pricing & Calculations
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Calculation Helper</DialogTitle>
                        <DialogDescription>
                          <div className="space-y-3 mt-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="font-semibold text-sm mb-1">Amount Formula</div>
                              <code className="text-xs">Amount = Units × Unit Price</code>
                              <div className="text-xs mt-1">Example: 23 × ₹1,200 = ₹27,600</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="font-semibold text-sm mb-1">Total Amount Formula</div>
                              <code className="text-xs">Total = Amount + Packaging Cost</code>
                              <div className="text-xs mt-1">Example: ₹27,600 + ₹50 = ₹27,650</div>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Unit Price (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }));
                      setTimeout(calculateAmounts, 100);
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Amount (Auto-calculated)</span>
                    <Calculator className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{formData.amount?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formData.units} units × ₹{formData.unitPrice} = ₹{formData.amount}
                  </div>
                </div>

                <div>
                  <Label>Packaging Cost (₹)</Label>
                  <Input
                    type="number"
                    value={formData.packagingCost}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, packagingCost: Number(e.target.value) }));
                      setTimeout(calculateAmounts, 100);
                    }}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter total packaging cost or units × material rate
                  </p>
                </div>

                <Separator />

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    ₹{formData.totalAmount?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ₹{formData.amount} (amount) + ₹{formData.packagingCost} (packaging) = ₹{formData.totalAmount}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Date Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Due Date Type *</Label>
                  <Select
                    value={formData.dueDateType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dueDateType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regulatory">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          By Regulatory Rule (15 days)
                        </div>
                      </SelectItem>
                      <SelectItem value="association">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          By Association Policy (30 days)
                        </div>
                      </SelectItem>
                      <SelectItem value="agreement">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          By Agreement (Custom)
                        </div>
                      </SelectItem>
                      <SelectItem value="manual">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Manual Selection
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Record Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Current Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as BillStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          Pending (Amber)
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Approved (Green)
                        </div>
                      </SelectItem>
                      <SelectItem value="overdue">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          Overdue (Red)
                        </div>
                      </SelectItem>
                      <SelectItem value="change-requested">
                        <div className="flex items-center gap-2">
                          <Edit className="w-4 h-4 text-blue-500" />
                          Change Requested (Blue)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    {formData.status === 'pending' && 'Record awaiting approval from commission agent or auditor.'}
                    {formData.status === 'approved' && 'Record is approved and locked. Edits require justification.'}
                    {formData.status === 'overdue' && 'Payment is past due date. Consider sending reminder.'}
                    {formData.status === 'change-requested' && 'Buyer has requested changes. All fields unlocked for editing.'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Grok AI Insight */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Grok AI Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700">
                  {formData.buyerName ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500 text-white">Low Risk</Badge>
                        <span className="text-xs">98% Recovery Probability</span>
                      </div>
                      <p className="text-xs">
                        <strong>Grok Analysis:</strong> New buyer profile. No historical data. 
                        Recommend standard payment terms with regular monitoring.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">Fill in buyer details to see AI risk assessment</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isEdit ? 'Update Record' : 'Save Record'}
                </Button>
                
                {isEdit && formData.status !== 'approved' && (
                  <Button variant="outline" className="w-full" onClick={() => setShow2FA(true)}>
                    <Lock className="w-4 h-4 mr-2" />
                    Approve with 2FA
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={() => setCurrentScreen('overview')}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-2 text-gray-700">
                  <li>• Add multiple brands for multi-company buyers</li>
                  <li>• Mark one contact as primary for communications</li>
                  <li>• Upload payment proofs for audit compliance</li>
                  <li>• Auto-calculations update in real-time</li>
                  <li>• Due date types follow regulatory/association rules</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // ==================== SCREEN 3: RECORD DETAIL/ACTIONS ====================
  const DetailScreen = () => {
    if (!selectedRecord) return null;

    const PaymentIcon = paymentIcons[selectedRecord.paymentMethod];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Bill Detail - {selectedRecord.billNo}</h2>
            <p className="text-sm text-gray-600">Complete transaction overview</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentScreen('add-edit');
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setCurrentScreen('overview')}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Detail Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview Card */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Transaction #{selectedRecord.billNo}</CardTitle>
                    <CardDescription className="mt-1">
                      Created on {selectedRecord.date} • Serial No: {selectedRecord.serialNo}
                    </CardDescription>
                  </div>
                  <Badge className={`${statusColors[selectedRecord.status]} text-white capitalize text-base px-3 py-1`}>
                    {selectedRecord.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Buyer Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Buyer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <div className="font-semibold text-gray-900">{selectedRecord.buyerName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Brands:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRecord.brands.map((brand, i) => (
                            <Badge key={i} variant="outline">{brand}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Association:</span>
                        <div className="font-semibold text-gray-900">{selectedRecord.companyAssociation}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="text-gray-900">{selectedRecord.address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Details
                    </h4>
                    <div className="space-y-3">
                      {selectedRecord.contacts.map((contact, i) => (
                        <div key={i} className="p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="text-sm font-semibold">{contact.number}</span>
                            {contact.isPrimary && (
                              <Badge className="bg-blue-500 text-white text-xs">Primary</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{contact.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <PaymentIcon className="w-4 h-4" />
                    Payment Method: {selectedRecord.paymentMethod.replace('-', ' ').toUpperCase()}
                  </h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedRecord.paymentMethod === 'cheque' && (
                        <>
                          <div>
                            <span className="text-gray-600">Cheque No:</span>
                            <div className="font-semibold">{selectedRecord.paymentDetails.chequeNo}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Bank:</span>
                            <div className="font-semibold">{selectedRecord.paymentDetails.bankName}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Reference:</span>
                            <div className="font-semibold">{selectedRecord.paymentDetails.refNo}</div>
                          </div>
                        </>
                      )}
                      {selectedRecord.paymentMethod === 'upi' && (
                        <>
                          <div>
                            <span className="text-gray-600">UPI ID:</span>
                            <div className="font-semibold">{selectedRecord.paymentDetails.upiId}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Transaction Ref:</span>
                            <div className="font-semibold">{selectedRecord.paymentDetails.transactionRef}</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Document Attachments */}
                    {selectedRecord.documents.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <span className="text-sm text-gray-600">Attached Documents:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedRecord.documents.map((doc, i) => (
                            <Button key={i} variant="outline" size="sm">
                              <FileText className="w-3 h-3 mr-2" />
                              {doc}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Commodity & Pricing */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Commodity Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <div className="font-semibold">{selectedRecord.commodity}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <div className="font-semibold">{selectedRecord.units} {selectedRecord.measurement}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Weight:</span>
                        <div className="font-semibold">{selectedRecord.totalWeight} kg</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Financial Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-semibold">₹{selectedRecord.unitPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">₹{selectedRecord.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Packaging:</span>
                        <span className="font-semibold">₹{selectedRecord.packagingCost}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-green-600 text-lg">₹{selectedRecord.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Due Date & Payment Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Payment Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <div className="font-semibold">{selectedRecord.dueDate}</div>
                      </div>
                      {selectedRecord.receiptDate && (
                        <div>
                          <span className="text-gray-600">Receipt Date:</span>
                          <div className="font-semibold">{selectedRecord.receiptDate}</div>
                        </div>
                      )}
                      {selectedRecord.daysPastDue > 0 && (
                        <Alert className="mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            <strong>{selectedRecord.daysPastDue} days past due</strong>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Due Date Type
                    </h4>
                    <Badge className="text-sm px-3 py-1 capitalize">
                      {selectedRecord.dueDateType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auditor Justification History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Auditor Justification History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="history">
                    <AccordionTrigger>
                      View Complete Audit Trail ({selectedRecord.auditorNotes.length} entries)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {selectedRecord.auditorNotes.map((note, i) => (
                          <div key={i} className="p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{note.user}</span>
                                <Badge className={
                                  note.type === 'edit' ? 'bg-blue-500' :
                                  note.type === 'approval' ? 'bg-green-500' :
                                  'bg-orange-500'
                                }>
                                  {note.type}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-600">{note.date}</span>
                            </div>
                            <p className="text-sm text-gray-700">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedRecord.status === 'pending' && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setShow2FA(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Approve with 2FA
                  </Button>
                )}

                {selectedRecord.status === 'overdue' && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                )}

                {selectedRecord.status !== 'approved' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCurrentScreen('add-edit')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Record
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Bill
                </Button>

                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>

                {selectedRecord.documents.length > 0 && (
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Proofs ({selectedRecord.documents.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Grok AI Insights */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Grok AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <Badge className={
                    selectedRecord.aiInsights.riskLevel === 'low' ? 'bg-green-500' :
                    selectedRecord.aiInsights.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {selectedRecord.aiInsights.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Recovery Probability:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${selectedRecord.aiInsights.recoveryProbability}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {selectedRecord.aiInsights.recoveryProbability}%
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">Recommendation:</div>
                  <p className="text-xs text-gray-700">{selectedRecord.aiInsights.recommendation}</p>
                </div>

                {selectedRecord.aiInsights.behaviorPattern && (
                  <>
                    <Separator />
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        <strong>Pattern Detected:</strong><br />
                        {selectedRecord.aiInsights.behaviorPattern}
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowGrokInsight(true)}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Overdue Badge (if applicable) */}
            {selectedRecord.daysPastDue > 0 && (
              <Card className="border-2 border-red-500 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <Clock className="w-4 h-4" />
                    Overdue Warning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {selectedRecord.daysPastDue}
                    </div>
                    <div className="text-sm text-red-700">Days Past Due</div>
                    <Separator className="my-3" />
                    <p className="text-xs text-gray-700 mb-3">
                      Payment was due on {selectedRecord.dueDate}. Immediate action recommended.
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Urgent Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 2FA Modal */}
        <Dialog open={show2FA} onOpenChange={setShow2FA}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>2FA Approval Required</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to your registered mobile number
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
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
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600"
                  onClick={() => {
                    setShow2FA(false);
                    setOtpValue('');
                    // Update status logic here
                  }}
                >
                  Verify & Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShow2FA(false);
                    setOtpValue('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Grok Detailed Insight Modal */}
        <Dialog open={showGrokInsight} onOpenChange={setShowGrokInsight}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Grok AI Detailed Analysis - {selectedRecord.billNo}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Buyer Profile Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Historical Payment Rate:</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Delay:</span>
                      <span className="font-semibold">5.2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Transactions:</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dispute Rate:</span>
                      <span className="font-semibold">4.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Behavior Patterns Detected
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Persistent late payment pattern (3 occurrences in 6 months)</li>
                    <li>• Payment delays typically 7-10 days</li>
                    <li>• Responds well to SMS reminders (85% success rate)</li>
                    <li>• Prefers cheque payment method</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    AI Recommendations
                  </h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Send SMS reminder immediately (75% recovery probability)</li>
                    <li>Follow up with phone call on day 12 if no response</li>
                    <li>Consider advance payment requirement for next transaction</li>
                    <li>Monitor closely for pattern escalation</li>
                    <li>Maintain professional relationship - 92% eventual recovery rate</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Predicted Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Day 10-12: Send first reminder (recommended)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Day 13-15: Follow-up contact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Day 16-18: Expected payment (75% probability)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentScreen === 'overview' && <OverviewScreen />}
        {currentScreen === 'add-edit' && <AddEditScreen />}
        {currentScreen === 'detail' && <DetailScreen />}
      </div>
    </div>
  );
};

export default ExpertBuyerDatabase;
