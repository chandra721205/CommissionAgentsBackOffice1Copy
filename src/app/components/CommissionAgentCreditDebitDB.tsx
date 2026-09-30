import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Search, Filter, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle2, Clock, XCircle, Users, MapPin, Calendar,
  IndianRupee, Plus, Download, BookOpen, Shield, Bot, Eye, 
  ArrowUpDown, MoreHorizontal, Sparkles, Bell, DollarSign,
  CreditCard, Wallet, Receipt, Package, Scale, Calculator,
  UserCheck, Building2, Phone, Mail, Tag, Hash, FileText,
  Activity, Target, Percent, ChevronRight, Info
} from 'lucide-react';
import { format } from 'date-fns';

// Types
type TransactionType = 'Credit Advance' | 'Debit Sales' | 'Debit Expenditure' | 'Credit Refund' | 'Partial Debit';
type PaymentMethod = 'UPI' | 'IMPS' | 'NEFT' | 'Cheque' | 'ACH' | 'Wire' | 'SEPA' | 'Crypto';
type DueDateType = 'Regulatory' | 'Association' | 'Agreed' | 'Net30' | 'Net60' | 'Net90' | 'COD';
type Status = 'Pending' | 'Waiting' | 'Confirmed';
type StaffRole = 'Watchman' | 'Receiver' | 'Laborer' | 'Salesman' | 'Weighing Laborer' | 'Quality Supervisor' | 'Sample Mover' | 'Undefined Custom' | 'Multi-Role';
type Measurement = 'Quintal' | 'Kg' | 'Bag' | 'Nos' | 'Crate' | 'Tray';
type PackagingType = 'Fixed' | 'Dynamic';
type PackagingMaterial = 'Jute' | 'PP' | 'Plastic' | 'Gunny';

interface Contact {
  mobile: string;
  email?: string;
  whatsapp?: boolean;
}

interface JustificationEntry {
  change: string;
  reason: string;
  by: string;
  timestamp: Date;
  otp_hash?: string;
}

interface Transaction {
  id: string;
  serialNo: number;
  txnDate: Date;
  billNo: string;
  producerName: string;
  producerBrands?: string[];
  producerAddress: string;
  producerContacts: Contact[];
  agentName: string;
  agentStaffRole: StaffRole;
  buyerName?: string;
  buyerBrands?: string[];
  buyerAddress?: string;
  buyerContacts?: Contact[];
  txnType: TransactionType;
  method: PaymentMethod;
  refDetails?: string;
  volumeUnits: number;
  measurement: Measurement;
  unitPrice: number;
  amount: number; // auto-calculated
  packagingType: PackagingType;
  packagingMaterial: PackagingMaterial;
  packagingQty: number;
  packagingRate: number;
  packagingAmount: number; // auto-calculated
  taxAmount: number; // 1% auto-calculated
  totalAmount: number; // auto-calculated
  dueDateType: DueDateType;
  dueDate: Date;
  receiptDate?: Date;
  daysPastDue: number; // auto-calculated
  status: Status;
  justificationLog: JustificationEntry[];
  aiInsights: string;
  villagePlace: string;
  createdBy: string;
  confirmedBy?: string;
  isBlockchainAppended: boolean;
}

interface AccountSummary {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  pendingAmount: number;
  overdueAmount: number;
  transactionCount: number;
}

// Helper functions for calculations
const calculateAmount = (unitPrice: number, volumeUnits: number) => unitPrice * volumeUnits;
const calculatePackaging = (qty: number, rate: number) => qty * rate;
const calculateTax = (amount: number) => amount * 0.01;
const calculateTotal = (amount: number, packaging: number, tax: number) => amount + packaging + tax;
const calculateDaysPastDue = (dueDate: Date, receiptDate?: Date) => {
  const compareDate = receiptDate || new Date();
  const diff = Math.floor((compareDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

// Generate AI insights
const generateAIInsight = (txn: Transaction): string => {
  const insights: string[] = [];
  
  if (txn.txnType === 'Credit Advance') {
    insights.push(`💰 Credit Advance of ₹${txn.totalAmount.toLocaleString('en-IN')} to ${txn.producerName}`);
    if (txn.totalAmount > 50000) {
      insights.push('⚠️ Large credit - Monitor closely');
    } else {
      insights.push('✅ Risk Low - Historical repayment rate 95%');
    }
  } else if (txn.txnType === 'Debit Sales') {
    insights.push(`📦 Sales debit ₹${txn.totalAmount.toLocaleString('en-IN')} from ${txn.producerName}`);
    insights.push('✅ Reducing outstanding balance');
  } else if (txn.txnType === 'Partial Debit') {
    insights.push(`📊 Partial payment ₹${txn.totalAmount.toLocaleString('en-IN')}`);
    insights.push('⚠️ Monitor remaining balance closely');
  } else if (txn.txnType === 'Debit Expenditure') {
    insights.push(`💸 Expense ₹${txn.totalAmount.toLocaleString('en-IN')} - ${txn.refDetails || 'Various costs'}`);
  }
  
  if (txn.daysPastDue > 7) {
    insights.push(`🚨 ALERT: ${txn.daysPastDue} days overdue - Escalate to producer`);
  } else if (txn.daysPastDue > 0) {
    insights.push(`⏰ ${txn.daysPastDue} days past due - Send reminder`);
  }
  
  return insights.join(' • ');
};

// Mock data generator
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      serialNo: 1,
      txnDate: new Date('2024-05-13'),
      billNo: 'YT-7685',
      producerName: 'Chandra Sekhar',
      producerBrands: ['Premium Chillies', 'Organic Farm'],
      producerAddress: 'Plot 45, Village Guntur, AP 522001',
      producerContacts: [{ mobile: '+91-9876543210', email: 'chandra@example.com', whatsapp: true }],
      agentName: 'Ravi Kumar',
      agentStaffRole: 'Salesman',
      buyerName: 'PSR Foods Pvt Ltd',
      buyerBrands: ['PSR Export'],
      buyerAddress: 'Market Yard Road, Guntur',
      buyerContacts: [{ mobile: '+91-9876500001', email: 'psr@example.com' }],
      txnType: 'Debit Sales',
      method: 'NEFT',
      refDetails: 'NEFT-UTR-2024051301',
      volumeUnits: 23,
      measurement: 'Bag',
      unitPrice: 5200,
      amount: 0,
      packagingType: 'Dynamic',
      packagingMaterial: 'Jute',
      packagingQty: 23,
      packagingRate: 3,
      packagingAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDateType: 'Net30',
      dueDate: new Date('2024-05-25'),
      receiptDate: new Date('2024-06-03'),
      daysPastDue: 0,
      status: 'Confirmed',
      justificationLog: [
        {
          change: 'Created bill',
          reason: 'Sale of 23 bags premium chillies',
          by: 'Ravi Kumar (Salesman)',
          timestamp: new Date('2024-05-13'),
          otp_hash: 'OTP-1234'
        }
      ],
      aiInsights: '',
      villagePlace: 'Guntur',
      createdBy: 'Ravi Kumar',
      confirmedBy: 'PSR Foods',
      isBlockchainAppended: true
    },
    {
      id: 'TXN002',
      serialNo: 2,
      txnDate: new Date('2025-04-15'),
      billNo: 'CA-8901',
      producerName: 'Venkata Rao',
      producerBrands: ['Organic Turmeric'],
      producerAddress: 'Village Gurajepalli, AP',
      producerContacts: [{ mobile: '+91-9876543211', whatsapp: true }],
      agentName: 'Suresh Babu',
      agentStaffRole: 'Salesman',
      txnType: 'Credit Advance',
      method: 'UPI',
      refDetails: 'UPI-REF-202504150001',
      volumeUnits: 50,
      measurement: 'Quintal',
      unitPrice: 8500,
      amount: 0,
      packagingType: 'Fixed',
      packagingMaterial: 'PP',
      packagingQty: 100,
      packagingRate: 2,
      packagingAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDateType: 'Net30',
      dueDate: new Date('2025-05-15'),
      daysPastDue: 0,
      status: 'Confirmed',
      justificationLog: [
        {
          change: 'Credit advance issued',
          reason: 'Seed and fertilizer purchase for turmeric',
          by: 'Suresh Babu (Salesman)',
          timestamp: new Date('2025-04-15'),
          otp_hash: 'OTP-5678'
        }
      ],
      aiInsights: '',
      villagePlace: 'Gurajepalli',
      createdBy: 'Suresh Babu',
      confirmedBy: 'Venkata Rao',
      isBlockchainAppended: true
    },
    {
      id: 'TXN003',
      serialNo: 3,
      txnDate: new Date('2025-10-20'),
      billNo: 'CA-9012',
      producerName: 'Prakash Reddy',
      producerAddress: 'Village Tenali, AP',
      producerContacts: [{ mobile: '+91-9876543212' }],
      agentName: 'Lakshmi Devi',
      agentStaffRole: 'Laborer',
      txnType: 'Debit Expenditure',
      method: 'UPI',
      refDetails: 'Market yard labor charges',
      volumeUnits: 100,
      measurement: 'Kg',
      unitPrice: 50,
      amount: 0,
      packagingType: 'Fixed',
      packagingMaterial: 'Jute',
      packagingQty: 0,
      packagingRate: 0,
      packagingAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDateType: 'COD',
      dueDate: new Date('2025-10-20'),
      receiptDate: new Date('2025-10-20'),
      daysPastDue: 0,
      status: 'Confirmed',
      justificationLog: [],
      aiInsights: '',
      villagePlace: 'Tenali',
      createdBy: 'Lakshmi Devi',
      confirmedBy: 'Prakash Reddy',
      isBlockchainAppended: true
    },
    {
      id: 'TXN004',
      serialNo: 4,
      txnDate: new Date('2025-10-22'),
      billNo: 'CA-9013',
      producerName: 'Suresh Babu',
      producerAddress: 'Village Chilakaluripet, AP',
      producerContacts: [{ mobile: '+91-9876543213', email: 'suresh@example.com' }],
      agentName: 'Ravi Kumar',
      agentStaffRole: 'Salesman',
      txnType: 'Credit Advance',
      method: 'Cheque',
      refDetails: 'Cheque No: 123456',
      volumeUnits: 30,
      measurement: 'Bag',
      unitPrice: 3000,
      amount: 0,
      packagingType: 'Dynamic',
      packagingMaterial: 'Gunny',
      packagingQty: 30,
      packagingRate: 5,
      packagingAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDateType: 'Net60',
      dueDate: new Date('2025-12-21'),
      daysPastDue: 0,
      status: 'Waiting',
      justificationLog: [
        {
          change: 'Credit advance requested',
          reason: 'Equipment purchase for coconut processing',
          by: 'Ravi Kumar (Salesman)',
          timestamp: new Date('2025-10-22')
        }
      ],
      aiInsights: '',
      villagePlace: 'Chilakaluripet',
      createdBy: 'Ravi Kumar',
      isBlockchainAppended: false
    },
    {
      id: 'TXN005',
      serialNo: 5,
      txnDate: new Date('2025-10-10'),
      billNo: 'CA-9014',
      producerName: 'Ramesh Kumar',
      producerAddress: 'Village Guntur, AP',
      producerContacts: [{ mobile: '+91-9876543214', whatsapp: true }],
      agentName: 'Suresh Babu',
      agentStaffRole: 'Salesman',
      buyerName: 'Green Export Ltd',
      buyerAddress: 'Export House, Guntur',
      buyerContacts: [{ mobile: '+91-9876500002' }],
      txnType: 'Partial Debit',
      method: 'NEFT',
      refDetails: 'Partial payment - NEFT-UTR-20251010',
      volumeUnits: 15,
      measurement: 'Bag',
      unitPrice: 4000,
      amount: 0,
      packagingType: 'Fixed',
      packagingMaterial: 'Jute',
      packagingQty: 15,
      packagingRate: 3,
      packagingAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDateType: 'Net30',
      dueDate: new Date('2025-10-05'),
      daysPastDue: 0,
      status: 'Confirmed',
      justificationLog: [
        {
          change: 'Partial payment received',
          reason: 'Buyer paid 50% advance, balance on delivery',
          by: 'Suresh Babu (Salesman)',
          timestamp: new Date('2025-10-10'),
          otp_hash: 'OTP-9012'
        }
      ],
      aiInsights: '',
      villagePlace: 'Guntur',
      createdBy: 'Suresh Babu',
      confirmedBy: 'Green Export Ltd',
      isBlockchainAppended: true
    }
  ];
  
  // Calculate auto-fields
  transactions.forEach(txn => {
    txn.amount = calculateAmount(txn.unitPrice, txn.volumeUnits);
    txn.packagingAmount = calculatePackaging(txn.packagingQty, txn.packagingRate);
    txn.taxAmount = calculateTax(txn.amount);
    txn.totalAmount = calculateTotal(txn.amount, txn.packagingAmount, txn.taxAmount);
    txn.daysPastDue = calculateDaysPastDue(txn.dueDate, txn.receiptDate);
    txn.aiInsights = generateAIInsight(txn);
  });
  
  return transactions;
};

export default function CommissionAgentCreditDebitDB() {
  const allTransactions = useMemo(() => generateMockTransactions(), []);
  const [transactions] = useState<Transaction[]>(allTransactions);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAIAlerts, setShowAIAlerts] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'ledger' | 'summary'>('ledger');
  
  // Calculate account summary
  const accountSummary = useMemo((): AccountSummary => {
    let totalCredits = 0;
    let totalDebits = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;
    
    transactions.forEach(txn => {
      if (txn.txnType === 'Credit Advance' || txn.txnType === 'Credit Refund') {
        totalCredits += txn.totalAmount;
      } else {
        totalDebits += txn.totalAmount;
      }
      
      if (txn.status === 'Pending' || txn.status === 'Waiting') {
        pendingAmount += txn.totalAmount;
      }
      
      if (txn.daysPastDue > 0 && !txn.receiptDate) {
        overdueAmount += txn.totalAmount;
      }
    });
    
    return {
      totalCredits,
      totalDebits,
      netBalance: totalDebits - totalCredits, // Positive = money owed to agent
      pendingAmount,
      overdueAmount,
      transactionCount: transactions.length
    };
  }, [transactions]);
  
  // Get unique values for filters
  const villages = useMemo(() => 
    Array.from(new Set(transactions.map(t => t.villagePlace))).sort(),
    [transactions]
  );
  
  const roles = useMemo(() => 
    Array.from(new Set(transactions.map(t => t.agentStaffRole))).sort(),
    [transactions]
  );
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (searchQuery && !t.producerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.billNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterVillage !== 'all' && t.villagePlace !== filterVillage) return false;
      if (filterRole !== 'all' && t.agentStaffRole !== filterRole) return false;
      if (filterType !== 'all' && t.txnType !== filterType) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      return true;
    });
  }, [transactions, searchQuery, filterVillage, filterRole, filterType, filterStatus]);
  
  // AI Alerts
  const aiAlerts = useMemo(() => {
    const alerts: string[] = [];
    
    const overdueCount = transactions.filter(t => t.daysPastDue > 7 && !t.receiptDate).length;
    if (overdueCount > 0) {
      alerts.push(`🚨 ${overdueCount} transaction(s) seriously overdue (>7 days) - Escalate now!`);
    }
    
    const pendingCredits = transactions.filter(t => t.txnType === 'Credit Advance' && t.status !== 'Confirmed').length;
    if (pendingCredits > 0) {
      alerts.push(`⏰ ${pendingCredits} credit advance(s) awaiting confirmation - Send OTP`);
    }
    
    const largeCredits = transactions.filter(t => t.txnType === 'Credit Advance' && t.totalAmount > 50000).length;
    if (largeCredits > 0) {
      alerts.push(`⚠️ ${largeCredits} large credit(s) issued (>₹50K) - Monitor repayment closely`);
    }
    
    return alerts;
  }, [transactions]);
  
  // Helper functions
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'Waiting': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };
  
  const getTypeColor = (type: TransactionType) => {
    if (type.includes('Credit')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (type.includes('Debit')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getDueDateTypeLabel = (type: DueDateType) => {
    const labels: Record<DueDateType, string> = {
      'Regulatory': '📋 Regulatory (15d)',
      'Association': '🏛️ Association (30d)',
      'Agreed': '🤝 Agreed (Custom)',
      'Net30': '📅 Net-30',
      'Net60': '📅 Net-60',
      'Net90': '📅 Net-90',
      'COD': '💰 Cash on Delivery'
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#D9F2FF] p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4E4B0] flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              Commission Agent Credit/Debit Ledger
            </h1>
            <p className="text-gray-600 mt-1">
              👋 Simple & Clear - Like Your School Notebook! Track Credits & Debits with AI Help
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4E4B0] text-gray-900"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* AI Alerts Banner */}
        {showAIAlerts && aiAlerts.length > 0 && (
          <Alert className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <Bot className="w-5 h-5 text-purple-600" />
            <AlertDescription>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-100 text-purple-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Grok AI Assistant
                    </Badge>
                    <span className="text-sm font-medium">Smart Alerts for You:</span>
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {aiAlerts.map((alert, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAIAlerts(false)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-4 h-4" />
                Total Credits Given
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-900">{formatCurrency(accountSummary.totalCredits)}</div>
              <p className="text-xs text-blue-600 mt-1">💰 Money you gave to producers</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <TrendingDown className="w-4 h-4" />
                Total Debits Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-900">{formatCurrency(accountSummary.totalDebits)}</div>
              <p className="text-xs text-green-600 mt-1">💵 Money you got back from sales</p>
            </CardContent>
          </Card>
          
          <Card className={`border-2 ${accountSummary.netBalance >= 0 ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' : 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${accountSummary.netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                <Calculator className="w-4 h-4" />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl ${accountSummary.netBalance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatCurrency(Math.abs(accountSummary.netBalance))}
              </div>
              <p className={`text-xs mt-1 ${accountSummary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {accountSummary.netBalance >= 0 ? '✅ Producers owe you' : '⚠️ You owe producers'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-4 h-4" />
                Overdue Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-900">{formatCurrency(accountSummary.overdueAmount)}</div>
              <p className="text-xs text-orange-600 mt-1">🚨 Late payments - need follow-up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ledger">📖 Transaction Ledger</TabsTrigger>
            <TabsTrigger value="summary">📊 Producer Summary</TabsTrigger>
          </TabsList>

          {/* Ledger View */}
          <TabsContent value="ledger" className="space-y-4">
            {/* Filters */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  🔍 Find What You Need (Easy Filters)
                </CardTitle>
                <CardDescription>
                  Use these simple boxes to find exactly what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Search className="w-4 h-4" />
                      Search Name or Bill #
                    </Label>
                    <Input
                      placeholder="Type name or bill number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      Village/Place
                    </Label>
                    <Select value={filterVillage} onValueChange={setFilterVillage}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">🌍 All Villages</SelectItem>
                        {villages.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      Staff Role
                    </Label>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">👥 All Roles</SelectItem>
                        {roles.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Transaction Type
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">📋 All Types</SelectItem>
                        <SelectItem value="Credit Advance">💰 Credit Advance</SelectItem>
                        <SelectItem value="Debit Sales">📦 Debit Sales</SelectItem>
                        <SelectItem value="Debit Expenditure">💸 Debit Expense</SelectItem>
                        <SelectItem value="Partial Debit">📊 Partial Debit</SelectItem>
                        <SelectItem value="Credit Refund">↩️ Credit Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      Status
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">🎯 All Status</SelectItem>
                        <SelectItem value="Pending">⏳ Pending</SelectItem>
                        <SelectItem value="Waiting">⏰ Waiting</SelectItem>
                        <SelectItem value="Confirmed">✅ Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {(searchQuery || filterVillage !== 'all' || filterRole !== 'all' || filterType !== 'all' || filterStatus !== 'all') && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-sm">
                      Showing {filteredTransactions.length} of {transactions.length} transactions
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterVillage('all');
                        setFilterRole('all');
                        setFilterType('all');
                        setFilterStatus('all');
                      }}
                      className="text-xs"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Table */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    📚 Your Transaction Book (Like a Story!)
                  </span>
                  <Badge className="bg-blue-100 text-blue-700">
                    {filteredTransactions.length} Entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[1600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
                          <TableHead className="w-[60px]">#</TableHead>
                          <TableHead>📅 Date</TableHead>
                          <TableHead>📋 Bill No</TableHead>
                          <TableHead>👤 Producer</TableHead>
                          <TableHead>📍 Village</TableHead>
                          <TableHead>🏷️ Type</TableHead>
                          <TableHead className="text-right">💰 Amount</TableHead>
                          <TableHead className="text-right">📦 Packaging</TableHead>
                          <TableHead className="text-right">💵 Total</TableHead>
                          <TableHead>📅 Due Date</TableHead>
                          <TableHead className="text-right">⏱️ Days</TableHead>
                          <TableHead>✅ Status</TableHead>
                          <TableHead>👥 Role</TableHead>
                          <TableHead>🔧 Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((txn) => (
                          <TableRow 
                            key={txn.id}
                            className="hover:bg-blue-50/50 cursor-pointer"
                            onClick={() => setSelectedTxn(txn)}
                          >
                            <TableCell className="font-mono text-sm">{txn.serialNo}</TableCell>
                            <TableCell className="text-sm">
                              {format(txn.txnDate, 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{txn.billNo}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{txn.producerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {txn.villagePlace}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getTypeColor(txn.txnType)} text-xs`}>
                                {txn.txnType.includes('Credit') && '💰'}
                                {txn.txnType.includes('Debit') && '📦'}
                                {txn.txnType}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right ${txn.txnType.includes('Credit') ? 'text-blue-600' : 'text-green-600'}`}>
                              {formatCurrency(txn.amount)}
                            </TableCell>
                            <TableCell className="text-right text-sm text-gray-600">
                              {formatCurrency(txn.packagingAmount)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(txn.totalAmount)}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex flex-col gap-0.5">
                                <span>{getDueDateTypeLabel(txn.dueDateType)}</span>
                                <span className="text-xs text-gray-500">{format(txn.dueDate, 'dd MMM')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {txn.daysPastDue > 0 ? (
                                <Badge className={`${txn.daysPastDue > 7 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  🚨 {txn.daysPastDue}d
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(txn.status)}>
                                {txn.status === 'Confirmed' && '✅'}
                                {txn.status === 'Waiting' && '⏰'}
                                {txn.status === 'Pending' && '⏳'}
                                {txn.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {txn.agentStaffRole}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  📊 Quick Summary - See Everything at a Glance!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-blue-900">Total Transactions</h3>
                      <Hash className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl text-blue-900">{accountSummary.transactionCount}</div>
                    <p className="text-sm text-blue-600 mt-2">📝 Total entries in your book</p>
                  </div>
                  
                  <div className="p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-yellow-900">Pending Confirmation</h3>
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-3xl text-yellow-900">{formatCurrency(accountSummary.pendingAmount)}</div>
                    <p className="text-sm text-yellow-600 mt-2">⏳ Waiting for OTP approval</p>
                  </div>
                  
                  <div className="p-6 rounded-lg border-2 border-purple-200 bg-purple-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-purple-900">AI Insights Active</h3>
                      <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl text-purple-900">
                      {transactions.filter(t => t.aiInsights).length}
                    </div>
                    <p className="text-sm text-purple-600 mt-2">🤖 Smart tips helping you</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction Detail Dialog */}
        {selectedTxn && (
          <Dialog open={!!selectedTxn} onOpenChange={() => setSelectedTxn(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  📝 Transaction Details - Everything About This Entry
                </DialogTitle>
                <DialogDescription>
                  Bill No: {selectedTxn.billNo} • Serial: {selectedTxn.serialNo}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      Transaction Date
                    </Label>
                    <div className="text-lg">{format(selectedTxn.txnDate, 'dd MMMM yyyy')}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      Type
                    </Label>
                    <Badge className={`${getTypeColor(selectedTxn.txnType)} text-sm`}>
                      {selectedTxn.txnType}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                {/* Producer Info */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    👨‍🌾 Producer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-600">Name</Label>
                      <div className="text-sm mt-1">{selectedTxn.producerName}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Village</Label>
                      <div className="text-sm mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {selectedTxn.villagePlace}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">Address</Label>
                      <div className="text-sm mt-1">{selectedTxn.producerAddress}</div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">Contacts</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTxn.producerContacts.map((contact, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.mobile}
                            {contact.whatsapp && ' (WhatsApp ✓)'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Transaction Details */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm">
                    <Calculator className="w-4 h-4" />
                    🧮 Amount Calculation (Step by Step)
                  </h4>
                  <div className="space-y-2 p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {selectedTxn.volumeUnits} {selectedTxn.measurement} × {formatCurrency(selectedTxn.unitPrice)} per unit
                      </span>
                      <span className="text-green-600">{formatCurrency(selectedTxn.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Packaging ({selectedTxn.packagingQty} {selectedTxn.packagingMaterial} × {formatCurrency(selectedTxn.packagingRate)})
                      </span>
                      <span className="text-green-600">+ {formatCurrency(selectedTxn.packagingAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tax (1% market fee)</span>
                      <span className="text-green-600">+ {formatCurrency(selectedTxn.taxAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">💵 Total Amount</span>
                      <span className="text-xl text-green-900">{formatCurrency(selectedTxn.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1.5">
                      <CreditCard className="w-3 h-3" />
                      Payment Method
                    </Label>
                    <Badge variant="outline" className="text-sm">
                      {selectedTxn.method}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Reference</Label>
                    <div className="text-sm font-mono">{selectedTxn.refDetails || '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Due Date Type</Label>
                    <div className="text-sm">{getDueDateTypeLabel(selectedTxn.dueDateType)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Due Date</Label>
                    <div className="text-sm">{format(selectedTxn.dueDate, 'dd MMM yyyy')}</div>
                  </div>
                </div>
                
                {selectedTxn.daysPastDue > 0 && (
                  <Alert className="border-2 border-orange-200 bg-orange-50">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      🚨 This payment is <strong>{selectedTxn.daysPastDue} days overdue</strong>! 
                      {selectedTxn.daysPastDue > 7 ? ' Need urgent follow-up!' : ' Send a friendly reminder.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Separator />
                
                {/* AI Insights */}
                <div className="space-y-2">
                  <Label className="text-xs text-purple-600 flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    🤖 Grok AI Says (Smart Helper)
                  </Label>
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <p className="text-sm text-purple-900">{selectedTxn.aiInsights}</p>
                  </div>
                </div>
                
                {/* Staff Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Created By</Label>
                    <div className="text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      {selectedTxn.createdBy}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Staff Role</Label>
                    <Badge variant="outline">{selectedTxn.agentStaffRole}</Badge>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Current Status:</span>
                  </div>
                  <Badge className={`${getStatusColor(selectedTxn.status)} text-sm`}>
                    {selectedTxn.status}
                  </Badge>
                </div>
                
                {selectedTxn.isBlockchainAppended && (
                  <Alert className="border-2 border-green-200 bg-green-50">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      🔐 This transaction is safely stored on blockchain - Cannot be changed!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTxn(null)}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#F4E4B0] text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
