import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Clock, AlertTriangle, CheckCircle2, XCircle, RefreshCw, MessageSquare,
  User, Building2, Package, DollarSign, Calendar, CreditCard, MapPin, Phone, Brain
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface BuyerClass {
  value: string;
  label: string;
  description: string;
}

export function BuyerApprovalWait() {
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [selectedBuyerClass, setSelectedBuyerClass] = useState('');

  const buyerClasses: BuyerClass[] = [
    { value: 'stationary', label: 'Stationary', description: 'Fixed location buyer' },
    { value: 'non-local', label: 'Non-Local', description: 'Buyer from different region' },
    { value: 'remote', label: 'Remote', description: 'Remote/online buyer' },
    { value: '3rd-party', label: '3rd Party', description: 'Third-party intermediary' },
    { value: 'other', label: 'Other', description: 'Other buyer type' },
  ];

  const record = {
    serialNo: 'TRD-2025-B001',
    date: '2025-10-27',
    buyerName: 'Rajesh Kumar',
    company: 'Kumar Traders Ltd',
    brand: 'JJ&Co - Branch A',
    address: '123 Market Street, Mumbai, Maharashtra 400001, India',
    contacts: [
      { name: 'Rajesh Kumar', mobile: '+91 98765 43210', email: 'rajesh@kumartraders.com' },
      { name: 'Priya Kumar', mobile: '+91 98765 43211', email: 'priya@kumartraders.com' },
    ],
    commodity: 'Wheat',
    quantity: '50',
    unit: 'Quintal',
    weight: 5000,
    packaging: 'Jute Bags (10 x ₹5)',
    unitPrice: 22.00,
    productAmount: 1100.00,
    packagingAmount: 50.00,
    tax: 11.50,
    totalPayable: 1161.50,
    paymentMethod: 'Bank Wire (NEFT)',
    paymentDetails: 'A/C: 123456789, IFSC: HDFC0001234',
    dueDateType: 'Regulatory (15 days India Agri Act)',
    dueDate: '2025-11-11',
    daysRemaining: 3,
    submittedAt: '2025-10-27 09:30 AM',
    aiRisk: 12,
  };

  const getTimerColor = (days: number) => {
    if (days <= 1) return 'text-red-600';
    if (days <= 3) return 'text-amber-600';
    return 'text-orange-600';
  };

  const getAlertLevel = (days: number) => {
    if (days <= 1) return { color: 'border-red-500 bg-red-50', icon: 'text-red-600', text: 'text-red-800', level: 'CRITICAL' };
    if (days <= 3) return { color: 'border-amber-500 bg-amber-50', icon: 'text-amber-600', text: 'text-amber-800', level: 'WARNING' };
    return { color: 'border-orange-500 bg-orange-50', icon: 'text-orange-600', text: 'text-orange-800', level: 'INFO' };
  };

  const alert = getAlertLevel(record.daysRemaining);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Buyer Approval Wait</h1>
          <p className="text-slate-600 mt-1">Bill: {record.serialNo} • Submitted: {record.submittedAt}</p>
        </div>
        <Badge className="bg-orange-500 text-white gap-2 animate-pulse text-base px-4 py-2">
          <Clock className="w-5 h-5" />
          Waiting Authorization
        </Badge>
      </div>

      {/* Timer Alert */}
      <Alert className={`${alert.color} border-2`}>
        <AlertTriangle className={`h-5 w-5 ${alert.icon}`} />
        <AlertDescription className={alert.text}>
          <div className="flex items-center justify-between">
            <div>
              <strong>{alert.level}:</strong> Due in <span className={`${getTimerColor(record.daysRemaining)} text-xl font-bold`}>{record.daysRemaining} days</span>
              <br />
              {record.daysRemaining <= 1 && 'SMS sent to buyer. Email escalation triggered.'}
              {record.daysRemaining > 1 && record.daysRemaining <= 3 && 'Pre-due notification sent to buyer.'}
              {record.daysRemaining > 3 && 'Buyer authorization pending.'}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend OTP
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* AI Risk Assessment */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm">AI Risk Assessment</p>
                <p className="text-slate-900">Low Risk ({record.aiRisk}%)</p>
              </div>
            </div>
            <Alert className="border-blue-500 bg-blue-50 max-w-xs">
              <AlertDescription className="text-blue-800 text-xs">
                <strong>AI Insight:</strong> Extend due date by 7 days? Risk increases to {record.aiRisk + 2}%
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Bill Review Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
          <CardTitle>Bill Details - Full Review</CardTitle>
          <CardDescription>All fields reviewable before final approval</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Buyer Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-slate-900">Buyer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Buyer Name</p>
                <p className="text-slate-900">{record.buyerName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Company</p>
                <p className="text-slate-900">{record.company}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Brand</p>
                <p className="text-slate-900">{record.brand}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Buyer Class (Confidential)</p>
                <Select value={selectedBuyerClass} onValueChange={setSelectedBuyerClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer class" />
                  </SelectTrigger>
                  <SelectContent>
                    {buyerClasses.map((bc) => (
                      <SelectItem key={bc.value} value={bc.value}>
                        {bc.label} - {bc.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" />
                Address
              </p>
              <p className="text-slate-900 text-sm">{record.address}</p>
            </div>
          </div>

          <Separator />

          {/* Authorized Contacts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900">Authorized Contacts</h3>
            </div>
            {record.contacts.map((contact, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-900">{contact.name}</p>
                <p className="text-xs text-slate-600">{contact.mobile} • {contact.email}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Commodity Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="text-slate-900">Commodity Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Commodity</p>
                <p className="text-slate-900">{record.commodity}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Quantity</p>
                <p className="text-slate-900">{record.quantity} {record.unit}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Weight</p>
                <p className="text-slate-900">{record.weight} kg</p>
              </div>
              <div className="col-span-full p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Packaging</p>
                <p className="text-slate-900">{record.packaging}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <h3 className="text-slate-900">Financial Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700">Unit Price</p>
                <p className="text-green-900">₹{record.unitPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700">Product Amount</p>
                <p className="text-green-900">₹{record.productAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">Packaging</p>
                <p className="text-blue-900">₹{record.packagingAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">Tax (1%)</p>
                <p className="text-purple-900">₹{record.tax.toFixed(2)}</p>
              </div>
              <div className="col-span-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                <p className="text-sm text-amber-700">Total Payable</p>
                <p className="text-amber-900">₹{record.totalPayable.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-slate-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Payment Method (Country: India)</p>
                <p className="text-slate-900">{record.paymentMethod}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Payment Details (Debit Details)</p>
                <p className="text-slate-900 text-sm">{record.paymentDetails}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Due Date Type</p>
                <p className="text-slate-900">{record.dueDateType}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Payment Due
                </p>
                <p className="text-slate-900">{record.dueDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <Button variant="outline" size="lg" className="flex-1 gap-2">
          <RefreshCw className="w-4 h-4" />
          Resend OTP to Buyer
        </Button>
        <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="flex-1 gap-2 border-blue-500 text-blue-600">
              <MessageSquare className="w-4 h-4" />
              Request Value Change
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Value Changes</DialogTitle>
              <DialogDescription>Changes require justification and will be logged</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Field to Change</Label>
                <Select>
                  <SelectTrigger className="h-16">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="payment">Payment Method</SelectItem>
                    <SelectItem value="duedate">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>New Value</Label>
                <Input placeholder="Enter new value" />
              </div>
              <div className="space-y-2">
                <Label>Justification</Label>
                <Textarea placeholder="Explain why this change is needed..." rows={3} />
              </div>
              <Button className="w-full">Submit Change Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
