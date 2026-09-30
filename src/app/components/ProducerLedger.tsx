import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Search, Filter, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle2, Clock, XCircle, Users, MapPin, Calendar as CalendarIcon,
  IndianRupee, Plus, Download, FileText, Shield, Bot, Eye, 
  UserCheck, ArrowUpDown, ChevronDown, MoreHorizontal, Sparkles, Bell
} from 'lucide-react';
import { format } from 'date-fns';

// Types
type TransactionType = 'Credit' | 'Sale' | 'Expense' | 'Debit';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type OTPStatus = 'Confirmed' | 'Pending' | 'Closed' | 'N/A';
type AccessPermission = 'AgentOnly' | 'MarketOnly' | 'AgentAndAdmin' | 'AgentAndExpense' | 'PublicView';

interface Transaction {
  id: string;
  producerName: string;
  producerId: string;
  village: string;
  date: Date;
  type: TransactionType;
  creditAmount: number;
  debitAmount: number;
  purpose: string;
  balance: number;
  riskRanking: RiskLevel;
  otpStatus: OTPStatus;
  authorizedBy: string;
  roleNotes: string;
  notes: string;
  aiFlags?: string[];
  aiAlertFlag: boolean;
  aiInsights: string;
  otpCode?: string;
  recordCreatedBy: string;
  recordAccessPerm: AccessPermission;
  chronology: number;
}

interface ProducerSummary {
  producerId: string;
  producerName: string;
  village: string;
  totalCredit: number;
  totalDebit: number;
  currentBalance: number;
  riskLevel: RiskLevel;
  lastTransactionDate: Date;
  transactionCount: number;
  aiAlerts: string[];
}

// Mock data generator - Matches refined CSV structure exactly
const generateMockTransactions = (): Transaction[] => {
  // Exact data from refined CSV structure
  const transactions: Transaction[] = [
    {
      id: 'T001',
      producerId: '1',
      producerName: 'Chandra Sekhar',
      village: 'Guntur',
      date: new Date('2025-02-12'),
      type: 'Credit',
      creditAmount: 20000,
      debitAmount: 0,
      purpose: 'Pesticides',
      balance: 980000,
      riskRanking: 'Medium',
      otpStatus: 'Confirmed',
      authorizedBy: 'Commission Agent',
      roleNotes: 'Initial credit',
      notes: 'Initial credit',
      aiAlertFlag: false,
      aiInsights: 'Increased borrow frequency',
      recordCreatedBy: 'Agent1',
      recordAccessPerm: 'AgentOnly',
      chronology: 1
    },
    {
      id: 'T002',
      producerId: '1',
      producerName: 'Chandra Sekhar',
      village: 'Guntur',
      date: new Date('2025-03-04'),
      type: 'Credit',
      creditAmount: 28000,
      debitAmount: 0,
      purpose: 'Shade nets & carpets',
      balance: 952000,
      riskRanking: 'Medium',
      otpStatus: 'Confirmed',
      authorizedBy: 'Commission Agent',
      roleNotes: '',
      notes: '',
      aiAlertFlag: false,
      aiInsights: 'Normal activity',
      recordCreatedBy: 'Agent1',
      recordAccessPerm: 'AgentOnly',
      chronology: 2
    },
    {
      id: 'T003',
      producerId: '1',
      producerName: 'Chandra Sekhar',
      village: 'Guntur',
      date: new Date('2025-03-15'),
      type: 'Credit',
      creditAmount: 13000,
      debitAmount: 0,
      purpose: 'Watering',
      balance: 939000,
      riskRanking: 'High',
      otpStatus: 'Confirmed',
      authorizedBy: 'Commission Agent',
      roleNotes: 'High-frequency requests',
      notes: 'High-frequency requests',
      aiFlags: ['High request frequency', 'Escalating credit pattern'],
      aiAlertFlag: true,
      aiInsights: 'Increase in risk flag',
      recordCreatedBy: 'Agent1',
      recordAccessPerm: 'AgentAndAdmin',
      chronology: 3
    },
    {
      id: 'T004',
      producerId: '1',
      producerName: 'Chandra Sekhar',
      village: 'Guntur',
      date: new Date('2025-03-30'),
      type: 'Sale',
      creditAmount: 0,
      debitAmount: 42000,
      purpose: 'Sale of chillies',
      balance: 981000,
      riskRanking: 'Low',
      otpStatus: 'Closed',
      authorizedBy: 'Market Receiver',
      roleNotes: 'Sale proceeds',
      notes: 'Sale proceeds',
      aiAlertFlag: false,
      aiInsights: 'Positive sale event',
      recordCreatedBy: 'Agent2',
      recordAccessPerm: 'MarketOnly',
      chronology: 4
    },
    {
      id: 'T005',
      producerId: '1',
      producerName: 'Chandra Sekhar',
      village: 'Guntur',
      date: new Date('2025-04-01'),
      type: 'Expense',
      creditAmount: 0,
      debitAmount: 8000,
      purpose: 'Market yard labor',
      balance: 973000,
      riskRanking: 'Low',
      otpStatus: 'N/A',
      authorizedBy: 'Expense Approver',
      roleNotes: 'Deducted from sales',
      notes: 'Deducted from sales',
      aiAlertFlag: false,
      aiInsights: '',
      recordCreatedBy: 'Agent3',
      recordAccessPerm: 'AgentAndExpense',
      chronology: 5
    },
    {
      id: 'T006',
      producerId: '2',
      producerName: 'Ravi Kumar',
      village: 'Gurajepalli',
      date: new Date('2025-04-02'),
      type: 'Expense',
      creditAmount: 0,
      debitAmount: 5000,
      purpose: 'Storage-moving',
      balance: 315000,
      riskRanking: 'Medium',
      otpStatus: 'N/A',
      authorizedBy: 'Supervisor',
      roleNotes: 'Paid to sample mover',
      notes: 'Paid to sample mover',
      aiAlertFlag: false,
      aiInsights: 'Expense recorded',
      recordCreatedBy: 'Agent2',
      recordAccessPerm: 'AgentAndAdmin',
      chronology: 6
    }
  ];

  return transactions;
};

// AI-powered insights generator
const generateAIInsights = (transactions: Transaction[]): string[] => {
  const insights: string[] = [];
  
  const pendingOTP = transactions.filter(t => t.otpStatus === 'Pending').length;
  if (pendingOTP > 0) {
    insights.push(`${pendingOTP} transaction(s) awaiting OTP confirmation`);
  }
  
  const highRisk = transactions.filter(t => t.riskRanking === 'High' || t.riskRanking === 'Critical').length;
  if (highRisk > 0) {
    insights.push(`${highRisk} high-risk transaction(s) detected`);
  }
  
  const recentCredits = transactions.filter(t => 
    t.type === 'Credit' && 
    (new Date().getTime() - t.date.getTime()) < 7 * 24 * 60 * 60 * 1000
  ).length;
  if (recentCredits > 3) {
    insights.push(`High credit activity: ${recentCredits} credits in last 7 days`);
  }
  
  return insights;
};

// Calculate producer summaries
const calculateProducerSummaries = (transactions: Transaction[]): ProducerSummary[] => {
  const producerMap = new Map<string, ProducerSummary>();
  
  transactions.forEach(t => {
    if (!producerMap.has(t.producerId)) {
      producerMap.set(t.producerId, {
        producerId: t.producerId,
        producerName: t.producerName,
        village: t.village,
        totalCredit: 0,
        totalDebit: 0,
        currentBalance: 0,
        riskLevel: 'Low',
        lastTransactionDate: t.date,
        transactionCount: 0,
        aiAlerts: []
      });
    }
    
    const summary = producerMap.get(t.producerId)!;
    summary.totalCredit += t.creditAmount;
    summary.totalDebit += t.debitAmount;
    summary.currentBalance = t.balance;
    summary.transactionCount += 1;
    
    if (t.date > summary.lastTransactionDate) {
      summary.lastTransactionDate = t.date;
      summary.riskLevel = t.riskRanking;
    }
    
    if (t.aiFlags && t.aiFlags.length > 0) {
      summary.aiAlerts.push(...t.aiFlags);
    }
  });
  
  return Array.from(producerMap.values());
};

export default function ProducerLedger() {
  const allTransactions = useMemo(() => generateMockTransactions(), []);
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions);
  const [selectedProducer, setSelectedProducer] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAccessPerm, setSelectedAccessPerm] = useState<string>('all');
  const [showAIAlertsOnly, setShowAIAlertsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentView, setCurrentView] = useState<'transactions' | 'summary'>('transactions');
  const [sortBy, setSortBy] = useState<'chronology' | 'date'>('chronology');
  
  // Get unique values for filters
  const producers = useMemo(() => {
    const uniqueProducers = new Map<string, { id: string; name: string }>();
    allTransactions.forEach(t => {
      if (!uniqueProducers.has(t.producerId)) {
        uniqueProducers.set(t.producerId, { id: t.producerId, name: t.producerName });
      }
    });
    return Array.from(uniqueProducers.values());
  }, [allTransactions]);
  
  const villages = useMemo(() => 
    Array.from(new Set(allTransactions.map(t => t.village).filter(v => v))),
    [allTransactions]
  );
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions.filter(t => {
      if (selectedProducer !== 'all' && t.producerId !== selectedProducer) return false;
      if (selectedVillage !== 'all' && t.village !== selectedVillage) return false;
      if (selectedRisk !== 'all' && t.riskRanking !== selectedRisk) return false;
      if (selectedType !== 'all' && t.type !== selectedType) return false;
      if (selectedAccessPerm !== 'all' && t.recordAccessPerm !== selectedAccessPerm) return false;
      if (showAIAlertsOnly && !t.aiAlertFlag) return false;
      if (searchQuery && !t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.producerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    
    // Sort by chronology or date
    return filtered.sort((a, b) => {
      if (sortBy === 'chronology') {
        return b.chronology - a.chronology; // Descending
      } else {
        return b.date.getTime() - a.date.getTime(); // Descending by date
      }
    });
  }, [allTransactions, selectedProducer, selectedVillage, selectedRisk, selectedType, selectedAccessPerm, showAIAlertsOnly, searchQuery, sortBy]);
  
  const aiInsights = useMemo(() => generateAIInsights(filteredTransactions), [filteredTransactions]);
  
  // Count AI alerts
  const aiAlertCount = useMemo(() => 
    allTransactions.filter(t => t.aiAlertFlag).length,
    [allTransactions]
  );
  const producerSummaries = useMemo(() => calculateProducerSummaries(allTransactions), [allTransactions]);
  
  // Helper functions
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
    }
  };
  
  const getOTPStatusColor = (status: OTPStatus) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Closed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'N/A': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getOTPIcon = (status: OTPStatus) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="w-3 h-3" />;
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Closed': return <XCircle className="w-3 h-3" />;
      case 'N/A': return null;
    }
  };
  
  const getAccessPermColor = (perm: AccessPermission) => {
    switch (perm) {
      case 'AgentOnly': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'MarketOnly': return 'text-green-600 bg-green-50 border-green-200';
      case 'AgentAndAdmin': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'AgentAndExpense': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'PublicView': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getAccessPermIcon = (perm: AccessPermission) => {
    switch (perm) {
      case 'AgentOnly': return '🔐';
      case 'MarketOnly': return '🏪';
      case 'AgentAndAdmin': return '👥';
      case 'AgentAndExpense': return '💰';
      case 'PublicView': return '👁️';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#D9F2FF] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4E4B0] flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Producer Ledger
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered producer transaction tracking with access controls & OTP validation
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              onClick={() => setShowAddTransaction(true)}
              className="gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4E4B0] text-gray-900"
            >
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* AI Insights Banner */}
        {aiInsights.length > 0 && (
          <Alert className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <Bot className="w-5 h-5 text-purple-600" />
            <AlertDescription>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI Insights
                </span>
                <div className="flex-1">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {aiInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="transactions">Transaction Ledger</TabsTrigger>
            <TabsTrigger value="summary">Producer Summary</TabsTrigger>
          </TabsList>

          {/* Transaction Ledger View */}
          <TabsContent value="transactions" className="space-y-4">
            {/* Filters */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top row - AI Alert Filter and Sort */}
                  <div className="flex items-center justify-between gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={showAIAlertsOnly}
                        onCheckedChange={setShowAIAlertsOnly}
                        id="ai-alerts"
                      />
                      <Label htmlFor="ai-alerts" className="flex items-center gap-2 cursor-pointer">
                        <Bell className="w-4 h-4 text-purple-600" />
                        <span>Show AI Alert Flags Only</span>
                        {aiAlertCount > 0 && (
                          <Badge className="bg-red-500 text-white">
                            {aiAlertCount} Alert{aiAlertCount !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-600">Sort by:</Label>
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chronology">📋 Chronology</SelectItem>
                          <SelectItem value="date">📅 Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Main filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search purpose, producer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Producer</Label>
                    <Select value={selectedProducer} onValueChange={setSelectedProducer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Producers</SelectItem>
                        {producers.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Village</Label>
                    <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Villages</SelectItem>
                        {villages.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Risk Level</Label>
                    <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                        <SelectItem value="Debit">Debit</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Access Permission</Label>
                    <Select value={selectedAccessPerm} onValueChange={setSelectedAccessPerm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Permissions</SelectItem>
                        <SelectItem value="AgentOnly">🔐 Agent Only</SelectItem>
                        <SelectItem value="MarketOnly">🏪 Market Only</SelectItem>
                        <SelectItem value="AgentAndAdmin">👥 Agent & Admin</SelectItem>
                        <SelectItem value="AgentAndExpense">💰 Agent & Expense</SelectItem>
                        <SelectItem value="PublicView">👁️ Public View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                </div>
                
                {(selectedProducer !== 'all' || selectedVillage !== 'all' || selectedRisk !== 'all' || selectedType !== 'all' || selectedAccessPerm !== 'all' || showAIAlertsOnly || searchQuery) && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Showing {filteredTransactions.length} of {allTransactions.length} transactions
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProducer('all');
                        setSelectedVillage('all');
                        setSelectedRisk('all');
                        setSelectedType('all');
                        setSelectedAccessPerm('all');
                        setShowAIAlertsOnly(false);
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Table */}
            <Card className="border-2">
              <ScrollArea className="w-full">
                <div className="min-w-[1400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>Producer</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>OTP</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>AI Alert</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          className={`hover:bg-blue-50/50 cursor-pointer ${transaction.aiAlertFlag ? 'bg-red-50/30' : ''}`}
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <TableCell className="font-mono text-xs text-gray-500">
                            {transaction.producerId}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.chronology}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              {transaction.producerName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {transaction.village}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(transaction.date, 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.type === 'Credit' ? 'default' : 
                                      transaction.type === 'Sale' ? 'secondary' : 'outline'}
                              className="gap-1"
                            >
                              {transaction.type === 'Credit' && <TrendingUp className="w-3 h-3" />}
                              {transaction.type === 'Sale' && <TrendingDown className="w-3 h-3" />}
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {transaction.creditAmount > 0 ? formatCurrency(transaction.creditAmount) : '—'}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {transaction.debitAmount > 0 ? formatCurrency(transaction.debitAmount) : '—'}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-sm" title={transaction.purpose}>
                              {transaction.purpose}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(transaction.balance)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`gap-1 ${getRiskColor(transaction.riskRanking)}`}>
                              {transaction.riskRanking === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                              {transaction.riskRanking}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`gap-1 ${getOTPStatusColor(transaction.otpStatus)}`}>
                              {getOTPIcon(transaction.otpStatus)}
                              {transaction.otpStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getAccessPermColor(transaction.recordAccessPerm)}`}>
                              {getAccessPermIcon(transaction.recordAccessPerm)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.aiAlertFlag ? (
                              <Badge className="bg-red-100 text-red-700 gap-1">
                                <Bell className="w-3 h-3" />
                                Alert
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {transaction.recordCreatedBy}
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
            </Card>
          </TabsContent>

          {/* Producer Summary View */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {producerSummaries.map((summary) => (
                <Card 
                  key={summary.producerId}
                  className="border-2 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-400" />
                          {summary.producerName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3" />
                          {summary.village}
                        </CardDescription>
                      </div>
                      <Badge className={getRiskColor(summary.riskLevel)}>
                        {summary.riskLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">Total Credit</div>
                        <div className="text-green-600">
                          {formatCurrency(summary.totalCredit)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">Total Debit</div>
                        <div className="text-red-600">
                          {formatCurrency(summary.totalDebit)}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Current Balance</div>
                      <div className={`text-xl ${summary.currentBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {formatCurrency(summary.currentBalance)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-600">Transactions</div>
                        <div>{summary.transactionCount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Last Activity</div>
                        <div className="text-xs">{format(summary.lastTransactionDate, 'dd MMM')}</div>
                      </div>
                    </div>
                    
                    {summary.aiAlerts.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-purple-600">
                            <Bot className="w-3 h-3" />
                            AI Alerts
                          </div>
                          <div className="space-y-1">
                            {summary.aiAlerts.slice(0, 2).map((alert, idx) => (
                              <div key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                <span>{alert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedProducer(summary.producerId);
                        setCurrentView('transactions');
                      }}
                    >
                      View Transactions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Transaction Detail Dialog */}
        {selectedTransaction && (
          <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transaction Details
                  {selectedTransaction.aiAlertFlag && (
                    <Badge className="bg-red-100 text-red-700 gap-1">
                      <Bell className="w-3 h-3" />
                      AI Alert
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <span>Transaction ID: {selectedTransaction.id}</span>
                  <span>•</span>
                  <span>Chronology: #{selectedTransaction.chronology}</span>
                  <span>•</span>
                  <span>Producer ID: {selectedTransaction.producerId}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Producer</Label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {selectedTransaction.producerName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Village</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedTransaction.village}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Date</Label>
                    <div>{format(selectedTransaction.date, 'dd MMMM yyyy')}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Type</Label>
                    <Badge variant={selectedTransaction.type === 'Credit' ? 'default' : 'secondary'}>
                      {selectedTransaction.type}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Credit Amount</Label>
                    <div className="text-lg text-green-600">
                      {selectedTransaction.creditAmount > 0 ? formatCurrency(selectedTransaction.creditAmount) : '—'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Debit Amount</Label>
                    <div className="text-lg text-red-600">
                      {selectedTransaction.debitAmount > 0 ? formatCurrency(selectedTransaction.debitAmount) : '—'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Purpose / Description</Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedTransaction.purpose}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Remaining Balance</Label>
                  <div className="text-2xl">{formatCurrency(selectedTransaction.balance)}</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Risk Ranking</Label>
                    <Badge className={getRiskColor(selectedTransaction.riskRanking)}>
                      {selectedTransaction.riskRanking}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">OTP Status</Label>
                    <Badge className={getOTPStatusColor(selectedTransaction.otpStatus)}>
                      {getOTPIcon(selectedTransaction.otpStatus)}
                      {selectedTransaction.otpStatus}
                    </Badge>
                  </div>
                </div>
                
                {selectedTransaction.otpCode && (
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">OTP Code (Last 4)</Label>
                    <div className="font-mono text-sm">****{selectedTransaction.otpCode.slice(-4)}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Authorized By</Label>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      {selectedTransaction.authorizedBy}
                    </div>
                  </div>
                  
                  {selectedTransaction.roleNotes && (
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Transaction Notes</Label>
                      <div className="text-sm text-gray-600">
                        {selectedTransaction.roleNotes}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Access Control & Record Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Record Access Permission</Label>
                    <Badge className={`${getAccessPermColor(selectedTransaction.recordAccessPerm)} text-sm`}>
                      {getAccessPermIcon(selectedTransaction.recordAccessPerm)} {selectedTransaction.recordAccessPerm}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Created By</Label>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedTransaction.recordCreatedBy}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* AI Insights */}
                {selectedTransaction.aiInsights && (
                  <div className="space-y-2">
                    <Label className="text-xs text-purple-600 flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      AI Insights
                    </Label>
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <p className="text-sm text-purple-900">{selectedTransaction.aiInsights}</p>
                    </div>
                  </div>
                )}
                
                {selectedTransaction.aiFlags && selectedTransaction.aiFlags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      AI Alert Flags
                    </Label>
                    <div className="space-y-1">
                      {selectedTransaction.aiFlags.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-red-50 rounded text-xs border border-red-200">
                          <Bell className="w-3 h-3 mt-0.5 text-red-600" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Notes</Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedTransaction.notes}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
