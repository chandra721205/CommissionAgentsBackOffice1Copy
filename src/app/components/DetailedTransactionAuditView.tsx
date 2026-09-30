// ==========================================
// Detailed Transaction & Audit View
// Complete back-office transaction management
// ==========================================

import React, { useState, useEffect } from 'react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ScrollArea } from './ui/scroll-area';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Progress } from './ui/progress';
import {
  ChevronDown, ChevronUp, FileText, Download, Upload, Printer, Send,
  AlertTriangle, CheckCircle2, Clock, Edit, Eye, History, Calculator,
  MapPin, Phone, Mail, Building2, User, CreditCard, Banknote, Wallet,
  QrCode, DollarSign, Calendar, Bell, Flag, Brain, Shield, TrendingUp,
  Package, Scale, Info, ExternalLink, FileCheck, FileClock, FileEdit,
  Zap, Target, Award, AlertCircle, XCircle, HelpCircle, Sparkles
} from 'lucide-react';

// Import types
import {
  BillWithDetails,
  BillChangeRequest,
  BillAuthorization,
  Payment,
  AuditLog,
  AuthStatus,
  PaymentMethod,
  DiscrepancyFlag
} from '../types/database';

import { api, calculateDaysOverdue, formatCurrency, getStatusColorClass } from '../services/api';

interface DetailedTransactionAuditViewProps {
  billId: bigint;
  onClose?: () => void;
}

const DetailedTransactionAuditView: React.FC<DetailedTransactionAuditViewProps> = ({
  billId,
  onClose
}) => {
  // State Management
  const [bill, setBill] = useState<BillWithDetails | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    buyer: true,
    contacts: false,
    commodity: true,
    pricing: true,
    payment: true,
    audit: false
  });

  // Edit States
  const [editedValues, setEditedValues] = useState<any>({});
  const [justificationNote, setJustificationNote] = useState('');
  const [auditorNote, setAuditorNote] = useState('');

  // Modal States
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showOverdueJustifyModal, setShowOverdueJustifyModal] = useState(false);
  const [showAIInsightModal, setShowAIInsightModal] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  // AI Insights
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Load transaction data
  useEffect(() => {
    loadTransactionData();
  }, [billId]);

  const loadTransactionData = async () => {
    setLoading(true);
    try {
      const [billData, paymentData, auditData] = await Promise.all([
        api.getBillById(billId),
        api.getBillPayments(billId),
        api.getAuditLog('BILL', billId)
      ]);

      setBill(billData);
      setPayments(paymentData);
      setAuditTrail(auditData);

      // Load AI insights for buyer
      if (billData.buyer_entity_id) {
        const insights = await api.getBuyerAIInsights(billData.buyer_entity_id);
        setAiInsights(insights);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate days past due
  const daysOverdue = bill ? calculateDaysOverdue(new Date(bill.due_date)) : 0;
  const isOverdue = daysOverdue > 0;
  const isSeverelyOverdue = daysOverdue >= 7;

  // Payment status
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalDue = bill?.total_payable || 0;
  const isPaidInFull = totalPaid >= totalDue;
  const remainingBalance = totalDue - totalPaid;

  // Status Badge Component
  const getStatusBadge = (status: AuthStatus) => {
    const configs = {
      [AuthStatus.PENDING_BUYER]: { 
        bg: 'bg-yellow-500', 
        icon: Clock, 
        label: 'Pending',
        pulse: true 
      },
      [AuthStatus.PENDING_AGENT]: { 
        bg: 'bg-blue-500', 
        icon: Clock, 
        label: 'Pending Agent' 
      },
      [AuthStatus.MODIFIED_NEEDS_JUSTIFICATION]: { 
        bg: 'bg-orange-500', 
        icon: Edit, 
        label: 'Change Requested',
        pulse: true 
      },
      [AuthStatus.AUTHORIZED]: { 
        bg: 'bg-green-500', 
        icon: CheckCircle2, 
        label: 'Approved' 
      },
      [AuthStatus.REJECTED]: { 
        bg: 'bg-red-500', 
        icon: XCircle, 
        label: 'Rejected' 
      }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.bg} text-white ${config.pulse ? 'animate-pulse' : ''}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Payment Method Icon
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const icons: Record<PaymentMethod, any> = {
      UPI: QrCode,
      IMPS: Zap,
      NEFT: Building2,
      CHEQUE: FileCheck,
      ACH: Building2,
      SEPA: Building2,
      WIRE: Building2,
      SWIFT: Building2,
      CARD: CreditCard,
      PAYPAL: Wallet,
      CASH: Banknote,
      CRYPTO: Target
    };
    const Icon = icons[method] || DollarSign;
    return <Icon className="w-4 h-4" />;
  };

  // Send Reminder
  const handleSendReminder = async () => {
    try {
      // API call to send reminder
      console.log('Sending reminder for bill:', billId);
      setShowReminderModal(false);
      // Show success toast
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <AlertDescription>Transaction not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Status Strip */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Detail</h1>
          <p className="text-gray-500">Bill #{bill.id.toString()} • {new Date(bill.created_at).toLocaleDateString()}</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            ← Back to List
          </Button>
        )}
      </div>

      {/* Status Strip */}
      <Card className={`border-l-4 ${
        isSeverelyOverdue ? 'border-l-red-500 bg-red-50 animate-pulse' :
        isOverdue ? 'border-l-orange-500 bg-orange-50' :
        bill.status === AuthStatus.AUTHORIZED ? 'border-l-green-500 bg-green-50' :
        bill.status === AuthStatus.MODIFIED_NEEDS_JUSTIFICATION ? 'border-l-blue-500 bg-blue-50' :
        'border-l-yellow-500 bg-yellow-50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusBadge(bill.status)}
              
              {isOverdue && (
                <Badge className={`${isSeverelyOverdue ? 'bg-red-600 animate-pulse' : 'bg-orange-500'} text-white`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {daysOverdue} Days Overdue
                </Badge>
              )}

              {!isPaidInFull && (
                <Badge className="bg-purple-500 text-white">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {formatCurrency(remainingBalance)} Due
                </Badge>
              )}

              {isPaidInFull && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid in Full
                </Badge>
              )}

              {bill.discrepancy_flag !== DiscrepancyFlag.NONE && (
                <Badge className={
                  bill.discrepancy_flag === DiscrepancyFlag.HIGH ? 'bg-red-600' :
                  bill.discrepancy_flag === DiscrepancyFlag.MEDIUM ? 'bg-orange-500' :
                  'bg-yellow-500'
                }>
                  <Flag className="w-3 h-3 mr-1" />
                  {bill.discrepancy_flag} Risk
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. Transaction Detail Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Transaction Details</CardTitle>
                  <CardDescription>
                    Serial: #{bill.id.toString()} • Lot: {bill.lot?.token_id}
                  </CardDescription>
                </div>
                {bill.status !== AuthStatus.AUTHORIZED && (
                  <Button
                    variant={editing ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editing ? 'Cancel Edit' : 'Edit'}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Buyer Information */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('buyer')}
                  className="flex items-center justify-between w-full text-left font-semibold text-lg"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Buyer Information
                  </span>
                  {expandedSections.buyer ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {expandedSections.buyer && (
                  <div className="pl-7 space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Buyer Name</Label>
                      <div className="font-semibold text-lg">{bill.buyer_entity?.display_name}</div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Brand / Company</Label>
                      <div className="font-medium">{bill.buyer_entity?.company?.brand_name}</div>
                      {bill.buyer_entity?.company?.legal_name && (
                        <div className="text-sm text-gray-600">Legal: {bill.buyer_entity.company.legal_name}</div>
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <Label className="text-xs text-gray-500">Address</Label>
                        <div className="text-sm">
                          {bill.buyer_entity?.company?.address_line}
                          {bill.buyer_entity?.company?.city && `, ${bill.buyer_entity.company.city}`}
                          {bill.buyer_entity?.company?.state_region && `, ${bill.buyer_entity.company.state_region}`}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Contacts */}
                    <button
                      onClick={() => toggleSection('contacts')}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <User className="w-4 h-4" />
                      {expandedSections.contacts ? 'Hide' : 'Show'} Authorized Contacts ({bill.buyer_entity?.contacts?.length || 0})
                    </button>

                    {expandedSections.contacts && bill.buyer_entity?.contacts && (
                      <div className="space-y-2 mt-2 pl-6 border-l-2 border-blue-200">
                        {bill.buyer_entity.contacts.map((contact) => (
                          <div key={contact.id} className="text-sm">
                            <div className="font-semibold">{contact.name}</div>
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            )}
                            {contact.is_authorized && (
                              <Badge variant="outline" className="text-xs mt-1">
                                <Shield className="w-3 h-3 mr-1" />
                                Authorized
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Commodity Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    Commodity Details
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Editable by auditor or if change requested</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Commodity</Label>
                    <div className="font-semibold">{bill.lot?.commodity}</div>
                    {bill.lot?.variety && (
                      <div className="text-sm text-gray-600">Variety: {bill.lot.variety}</div>
                    )}
                  </div>

                  <div>
                    <Label>Quality Grade</Label>
                    <div className="font-semibold">{bill.lot?.quality_grade || 'Standard'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-1">
                      Quantity
                      {editing && <Calculator className="w-3 h-3 text-blue-500" />}
                    </Label>
                    {editing ? (
                      <Input
                        type="number"
                        value={editedValues.quantity_units || bill.quantity_units}
                        onChange={(e) => setEditedValues({ ...editedValues, quantity_units: e.target.value })}
                      />
                    ) : (
                      <div className="font-semibold text-lg">{bill.quantity_units}</div>
                    )}
                  </div>

                  <div>
                    <Label>Unit</Label>
                    {editing ? (
                      <Select defaultValue="Kg">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kg">Kilogram (Kg)</SelectItem>
                          <SelectItem value="MT">Metric Ton (MT)</SelectItem>
                          <SelectItem value="Quintal">Quintal</SelectItem>
                          <SelectItem value="Bag">Bag</SelectItem>
                          <SelectItem value="Crate">Crate</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-semibold text-lg">Kg</div>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      Weight
                    </Label>
                    <div className="font-semibold text-lg">
                      {bill.weighment?.net_weight ? `${bill.weighment.net_weight} Kg` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  Pricing Breakdown
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Price per Unit</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Calculator className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Base rate per kilogram</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {editing ? (
                      <Input
                        type="number"
                        className="w-32"
                        value={editedValues.price_per_unit || bill.price_per_unit}
                        onChange={(e) => setEditedValues({ ...editedValues, price_per_unit: e.target.value })}
                      />
                    ) : (
                      <span className="font-semibold">{formatCurrency(Number(bill.price_per_unit))}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Quantity × Rate</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Calculator className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{bill.quantity_units} × {formatCurrency(Number(bill.price_per_unit))}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(Number(bill.quantity_units) * Number(bill.price_per_unit))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Packaging Cost</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Calculator className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Bags, crates, materials</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {editing ? (
                      <Input
                        type="number"
                        className="w-32"
                        value={editedValues.packaging_cost || bill.packaging_cost}
                        onChange={(e) => setEditedValues({ ...editedValues, packaging_cost: e.target.value })}
                      />
                    ) : (
                      <span className="font-semibold">{formatCurrency(Number(bill.packaging_cost))}</span>
                    )}
                  </div>

                  {bill.items && bill.items.length > 0 && (
                    <>
                      <Separator className="my-2" />
                      {bill.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-medium">
                            {formatCurrency(Number(item.qty) * Number(item.unit_price))}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Payable</span>
                    <span className="text-green-600">{formatCurrency(totalDue)}</span>
                  </div>
                </div>
              </div>

              {editing && (
                <Alert className="border-orange-500 bg-orange-50">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Justification Required</p>
                      <Textarea
                        placeholder="Explain the reason for these changes..."
                        value={justificationNote}
                        onChange={(e) => setJustificationNote(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Submit Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Payment & Overdue Section */}
          <Card className={isOverdue ? 'border-2 border-red-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment & Due Date
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Payment Methods */}
              <div>
                <Label>Payment Method(s)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bill.buyer_entity?.pay_prefs?.map((pref) => (
                    <HoverCard key={pref.id}>
                      <HoverCardTrigger asChild>
                        <Badge variant="outline" className="cursor-pointer">
                          {getPaymentMethodIcon(pref.method)}
                          <span className="ml-2">{pref.method}</span>
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2 text-sm">
                          <div className="font-semibold">{pref.method} Details</div>
                          {pref.details_json && (
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(pref.details_json, null, 2)}
                            </pre>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{new Date(bill.due_date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {bill.due_date_type.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <Label>Days Past Due</Label>
                  <div className={`text-2xl font-bold ${
                    daysOverdue > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {daysOverdue > 0 ? `+${daysOverdue}` : '0'} days
                  </div>
                  {daysOverdue > 0 && (
                    <Badge className="bg-red-500 text-white mt-1">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>

              {/* Payment Received */}
              <div>
                <Label>Payments Received</Label>
                {payments.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.method)}
                          <div>
                            <div className="font-medium">{formatCurrency(Number(payment.amount))}</div>
                            <div className="text-xs text-gray-600">
                              {new Date(payment.paid_at).toLocaleDateString()}
                              {payment.reference && ` • Ref: ${payment.reference}`}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded font-semibold">
                      <span>Remaining Balance:</span>
                      <span className={remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(remainingBalance)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Alert className="mt-2">
                    <Clock className="w-4 h-4" />
                    <AlertDescription>No payments received yet</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Overdue Actions */}
              {isOverdue && (
                <div className="space-y-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-semibold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Overdue Actions Required
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowReminderModal(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowOverdueJustifyModal(true)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Justify Overdue
                    </Button>

                    {isSeverelyOverdue && (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Escalate to Association
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAIInsightModal(true)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI Insight
                    </Button>
                  </div>
                </div>
              )}

              {/* Receipt Upload */}
              <div>
                <Button variant="outline" size="sm" onClick={() => setShowReceiptUpload(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Payment Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Switches & Actions */}
          {bill.status !== AuthStatus.AUTHORIZED && (
            <Card>
              <CardHeader>
                <CardTitle>Authorization Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">2FA/OTP Verification</div>
                      <div className="text-sm text-gray-600">Require OTP for approval</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar - Audit & Insights */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          {aiInsights && (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Behavioral Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Reliability Score</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={aiInsights.reliability_score || 0} className="flex-1" />
                    <span className="font-bold text-lg">{aiInsights.reliability_score}%</span>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Settlement Time:</span>
                    <span className="font-semibold">{aiInsights.avg_settlement_days || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discrepancy Ratio:</span>
                    <span className="font-semibold">{aiInsights.discrepancy_ratio || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-Time Payments:</span>
                    <span className="font-semibold">{aiInsights.on_time_ratio || 0}%</span>
                  </div>
                </div>

                {aiInsights.warnings && aiInsights.warnings.length > 0 && (
                  <Alert className="border-yellow-500 bg-yellow-50">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-xs">
                      {aiInsights.warnings.map((w: string, i: number) => (
                        <div key={i}>⚠️ {w}</div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAIInsightModal(true)}
                >
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Audit Trail
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => toggleSection('audit')}>
                  {expandedSections.audit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>

            {expandedSections.audit && (
              <CardContent>
                <ScrollArea className="h-96">
                  {auditTrail.length > 0 ? (
                    <div className="space-y-3">
                      {auditTrail.map((log) => (
                        <div key={log.id} className="border-l-2 border-blue-200 pl-3 pb-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(log.created_at).toLocaleString()}</span>
                            <Badge variant="outline" className="text-xs">{log.action}</Badge>
                          </div>
                          <div className="font-medium text-sm mt-1">{log.entity}</div>
                          {log.before_json && log.after_json && (
                            <div className="text-xs text-gray-600 mt-1">
                              Changed by User #{log.actor_user_id?.toString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8 text-sm">
                      No audit entries yet
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            )}
          </Card>

          {/* Auditor Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileEdit className="w-5 h-5" />
                Auditor Notes
              </CardTitle>
              <CardDescription className="text-xs">
                Internal notes (not visible to buyer/agent)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Add internal notes..."
                value={auditorNote}
                onChange={(e) => setAuditorNote(e.target.value)}
                rows={4}
              />
              <Button size="sm" className="w-full">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Note
              </Button>
            </CardContent>
          </Card>

          {/* Change Requests */}
          {bill.changes && bill.changes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Change Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bill.changes.map((change) => (
                    <div key={change.id} className="p-3 bg-orange-50 rounded border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-orange-500 text-white">{change.status}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(change.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold">{change.field_name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="line-through">{change.old_value}</span>
                          <span>→</span>
                          <span className="font-semibold text-green-600">{change.new_value}</span>
                        </div>
                        <div className="mt-2 text-xs">
                          <strong>Reason:</strong> {change.justification}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      
      {/* Send Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Automated notification will be sent to buyer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notification Channel</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Bell className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Reminder will include: Bill amount, due date, days overdue, and payment instructions
              </AlertDescription>
            </Alert>

            <Button onClick={handleSendReminder} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Reminder Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overdue Justification Modal */}
      <Dialog open={showOverdueJustifyModal} onOpenChange={setShowOverdueJustifyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justify Overdue Payment</DialogTitle>
            <DialogDescription>
              Document reason for delayed payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>History of Notes</Label>
              <ScrollArea className="h-32 border rounded p-2 mt-2">
                <div className="space-y-2 text-sm">
                  <div className="text-xs text-gray-500">No previous notes</div>
                </div>
              </ScrollArea>
            </div>

            <div>
              <Label>New Note</Label>
              <Textarea
                placeholder="Explain reason for overdue payment..."
                rows={4}
                className="mt-2"
              />
            </div>

            <Button className="w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Justification
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Insight Modal */}
      <Dialog open={showAIInsightModal} onOpenChange={setShowAIInsightModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI Behavioral Analysis
            </DialogTitle>
            <DialogDescription>
              Comprehensive buyer and agent ratings with historical patterns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="border-purple-500 bg-purple-50">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">Pattern Detection Results</div>
                  <div className="text-sm">
                    • {daysOverdue} days overdue (current transaction)
                    <br />
                    • Historical avg: {aiInsights?.avg_settlement_days || 0} days
                    <br />
                    • Reliability trend: {aiInsights?.reliability_score >= 80 ? '↗ Improving' : '↘ Declining'}
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {isSeverelyOverdue && (
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription>
                  <div className="font-semibold text-red-700">Chronic Overdue Pattern Detected</div>
                  <div className="text-sm text-red-600 mt-1">
                    This buyer has consistently delayed payments. Consider:
                    <ul className="list-disc list-inside mt-2">
                      <li>Requiring advance payment</li>
                      <li>Reducing credit limit</li>
                      <li>Escalating to association</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {aiInsights?.on_time_ratio || 0}%
                    </div>
                    <div className="text-sm text-gray-600">On-Time Payments</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {aiInsights?.discrepancy_ratio || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Dispute Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Full Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Upload Modal */}
      <Dialog open={showReceiptUpload} onOpenChange={setShowReceiptUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Attach proof of payment (image, PDF, screenshot)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600">
                Drag and drop file here, or click to browse
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Supported: JPG, PNG, PDF (max 5MB)
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Reference</Label>
              <Input placeholder="Transaction ID / Cheque No / Reference..." />
            </div>

            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedTransactionAuditView;
