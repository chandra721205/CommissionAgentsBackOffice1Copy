import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  Search, Filter, Clock, CheckCircle2, AlertCircle, Edit, Eye, 
  TrendingUp, DollarSign, Package, Calendar, MapPin, Phone,
  CreditCard, User, Building2, FileText, Smartphone, Wallet, AlertTriangle,
  History, Brain
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';

interface BuyerDashboardProps {
  userRole: string;
}

interface BuyerRecord {
  id: string;
  serialNo: string;
  date: string;
  buyerName: string;
  company: string;
  brand: string;
  address: string;
  contacts: { name: string; phone: string; designation: string }[];
  status: 'waiting' | 'confirmed' | 'pending' | 'changed' | 'alert';
  totalAmount: number;
  productAmount: number;
  packagingAmount: number;
  commodity: string;
  weight: number;
  unit: string;
  packaging: string;
  paymentMethod: string;
  paymentDetails: string;
  dueDate: string;
  dueDateLogic: string;
  agentName: string;
  editCount: number;
  submittedAt: string;
  auditorNotes?: string;
  paymentHistory?: { date: string; amount: number; method: string; status: string }[];
  aiRisk?: number;
}

export function BuyerDashboard({ userRole }: BuyerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<BuyerRecord | null>(null);

  const stats = [
    { label: 'Waiting Authorization', value: 12, icon: Clock, color: 'bg-amber-500', trend: '+3', ribbon: 'border-l-amber-500' },
    { label: 'Confirmed Bills', value: 145, icon: CheckCircle2, color: 'bg-green-500', trend: '+12', ribbon: 'border-l-green-500' },
    { label: 'Pending Changes', value: 8, icon: AlertCircle, color: 'bg-blue-500', trend: '-2', ribbon: 'border-l-blue-500' },
    { label: 'AI Alerts', value: 3, icon: AlertTriangle, color: 'bg-red-500', trend: '+1', ribbon: 'border-l-red-500' },
  ];

  const buyers: BuyerRecord[] = [
    {
      id: '1',
      serialNo: 'TRD-2025-001',
      date: '2025-10-27',
      buyerName: 'Rajesh Kumar',
      company: 'Kumar Traders Ltd',
      brand: 'Brand A - Premium',
      address: '123 Market Street, Mumbai, Maharashtra 400001, India',
      contacts: [
        { name: 'Rajesh Kumar', phone: '+91 98765 43210', designation: 'Owner' },
        { name: 'Priya Kumar', phone: '+91 98765 43211', designation: 'Manager' },
      ],
      status: 'waiting',
      totalAmount: 127500,
      productAmount: 125000,
      packagingAmount: 2500,
      commodity: 'Wheat',
      weight: 5000,
      unit: 'Kgs',
      packaging: 'Jute Bags (50kg)',
      paymentMethod: 'Bank Wire (NEFT)',
      paymentDetails: 'A/C: 123456789, IFSC: HDFC0001234',
      dueDate: '2025-11-03',
      dueDateLogic: 'Regulatory (7 days)',
      agentName: 'Agent A',
      editCount: 0,
      submittedAt: '2025-10-27 09:30 AM',
      auditorNotes: 'First-time buyer, verified documents.',
      aiRisk: 15,
      paymentHistory: [],
    },
    {
      id: '2',
      serialNo: 'TRD-2025-002',
      date: '2025-10-27',
      buyerName: 'Priya Sharma',
      company: 'Sharma Exports',
      brand: 'Brand B - Standard',
      address: '456 Commerce Road, Delhi 110001, India',
      contacts: [
        { name: 'Priya Sharma', phone: '+91 87654 32109', designation: 'CEO' },
      ],
      status: 'confirmed',
      totalAmount: 91200,
      productAmount: 89500,
      packagingAmount: 1700,
      commodity: 'Rice',
      weight: 3500,
      unit: 'Kgs',
      packaging: 'PP Bags (25kg)',
      paymentMethod: 'UPI',
      paymentDetails: 'UPI: priya@oksbi',
      dueDate: '2025-11-01',
      dueDateLogic: 'Association Rule (15 days)',
      agentName: 'Agent B',
      editCount: 0,
      submittedAt: '2025-10-27 08:15 AM',
      auditorNotes: 'Regular customer, good payment history.',
      aiRisk: 5,
      paymentHistory: [
        { date: '2025-10-15', amount: 85000, method: 'UPI', status: 'completed' },
        { date: '2025-09-20', amount: 92000, method: 'UPI', status: 'completed' },
      ],
    },
    {
      id: '3',
      serialNo: 'TRD-2025-003',
      date: '2025-10-26',
      buyerName: 'Amit Patel',
      company: 'Patel Foods & Co',
      brand: 'Generic',
      address: '789 Industrial Area, Ahmedabad, Gujarat 380001, India',
      contacts: [
        { name: 'Amit Patel', phone: '+91 76543 21098', designation: 'Director' },
        { name: 'Neha Patel', phone: '+91 76543 21099', designation: 'Accounts Manager' },
      ],
      status: 'pending',
      totalAmount: 158400,
      productAmount: 156000,
      packagingAmount: 2400,
      commodity: 'Pulses',
      weight: 6200,
      unit: 'Kgs',
      packaging: 'Jute Bags',
      paymentMethod: 'Cheque',
      paymentDetails: 'Cheque on delivery',
      dueDate: '2025-11-05',
      dueDateLogic: 'Mutual Agreement (30 days)',
      agentName: 'Agent A',
      editCount: 2,
      submittedAt: '2025-10-26 03:45 PM',
      auditorNotes: 'Changed weight twice, verify with agent.',
      aiRisk: 35,
      paymentHistory: [
        { date: '2025-10-10', amount: 145000, method: 'Cheque', status: 'pending' },
      ],
    },
    {
      id: '4',
      serialNo: 'TRD-2025-004',
      date: '2025-10-26',
      buyerName: 'Sunita Reddy',
      company: 'Reddy Commodities',
      brand: 'Brand A - Premium',
      address: '321 Trade Center, Hyderabad, Telangana 500001, India',
      contacts: [
        { name: 'Sunita Reddy', phone: '+91 65432 10987', designation: 'Managing Director' },
      ],
      status: 'alert',
      totalAmount: 236800,
      productAmount: 234000,
      packagingAmount: 2800,
      commodity: 'Spices',
      weight: 2000,
      unit: 'Kgs',
      packaging: 'Cardboard Boxes',
      paymentMethod: 'Bank Wire (NEFT)',
      paymentDetails: 'A/C: 987654321, IFSC: ICIC0001234',
      dueDate: '2025-11-02',
      dueDateLogic: 'Custom (5 days)',
      agentName: 'Agent C',
      editCount: 5,
      submittedAt: '2025-10-26 11:20 AM',
      auditorNotes: 'AI Alert: Multiple corrections by agent. Investigate pattern.',
      aiRisk: 72,
      paymentHistory: [
        { date: '2025-09-15', amount: 220000, method: 'Bank Wire', status: 'delayed' },
        { date: '2025-08-20', amount: 210000, method: 'Bank Wire', status: 'completed' },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      waiting: { label: 'Waiting Authorization', className: 'bg-amber-500 text-white', icon: Clock },
      confirmed: { label: 'Confirmed', className: 'bg-green-500 text-white', icon: CheckCircle2 },
      pending: { label: 'Pending Changes', className: 'bg-blue-500 text-white', icon: AlertCircle },
      changed: { label: 'Change Submitted', className: 'bg-indigo-500 text-white', icon: Edit },
      alert: { label: 'AI Alert', className: 'bg-red-500 text-white animate-pulse', icon: AlertTriangle },
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentIcon = (method: string) => {
    if (method.includes('UPI') || method.includes('PhonePe') || method.includes('GPay')) return Smartphone;
    if (method.includes('Wallet') || method.includes('Paytm')) return Wallet;
    if (method.includes('Card')) return CreditCard;
    return DollarSign;
  };

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = buyer.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buyer.serialNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || buyer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canViewDetails = ['admin', 'manager', 'auditor', 'operator'].includes(userRole);
  const canEdit = ['admin', 'manager'].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Stats Cards with Color Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 ${stat.ribbon}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-slate-900">{stat.value}</p>
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
          <CardTitle>Buyer Records</CardTitle>
          <CardDescription>All buyer records from weighing operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by buyer name, company, or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting Authorization</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending Changes</SelectItem>
                <SelectItem value="changed">Changed</SelectItem>
                <SelectItem value="alert">AI Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buyer Records */}
          <div className="space-y-3">
            {filteredBuyers.map((buyer) => {
              const PaymentIcon = getPaymentIcon(buyer.paymentMethod);
              return (
                <Card key={buyer.id} className={`border-l-4 hover:shadow-md transition-shadow ${
                  buyer.status === 'waiting' ? 'border-l-amber-500' :
                  buyer.status === 'confirmed' ? 'border-l-green-500' :
                  buyer.status === 'pending' ? 'border-l-blue-500' :
                  buyer.status === 'changed' ? 'border-l-indigo-500' :
                  'border-l-red-500'
                }`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-slate-900">{buyer.buyerName}</h3>
                              {getStatusBadge(buyer.status)}
                              {buyer.editCount > 2 && (
                                <Badge variant="outline" className="border-red-500 text-red-600 gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {buyer.editCount} edits
                                </Badge>
                              )}
                              {buyer.aiRisk && buyer.aiRisk > 50 && (
                                <Badge className="bg-red-500 text-white gap-1 animate-pulse">
                                  <Brain className="w-3 h-3" />
                                  Risk {buyer.aiRisk}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{buyer.company}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">{buyer.serialNo}</Badge>
                              <Badge variant="secondary" className="text-xs">{buyer.brand}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Date</p>
                              <p className="text-slate-700">{buyer.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Commodity</p>
                              <p className="text-slate-700">{buyer.commodity} ({buyer.weight} {buyer.unit})</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Total Amount</p>
                              <p className="text-slate-900">₹{buyer.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <PaymentIcon className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Payment</p>
                              <p className="text-slate-700 text-xs">{buyer.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Due: {buyer.dueDate}</span>
                          <span>•</span>
                          <span>Agent: {buyer.agentName}</span>
                          <span>•</span>
                          <span>Submitted: {buyer.submittedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canViewDetails && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setSelectedRecord(buyer)}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Buyer Record Details
                                  {getStatusBadge(buyer.status)}
                                </DialogTitle>
                                <DialogDescription>
                                  Serial: {buyer.serialNo} • Date: {buyer.date}
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="details" className="mt-4">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="payment">Payment Info</TabsTrigger>
                                  <TabsTrigger value="history">
                                    <History className="w-4 h-4 mr-2" />
                                    History
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4 mt-4">
                                  <Card>
                                    <CardHeader className="bg-slate-50">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Buyer Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <p className="text-slate-500">Buyer Name</p>
                                          <p className="text-slate-900">{buyer.buyerName}</p>
                                        </div>
                                        <div>
                                          <p className="text-slate-500">Company</p>
                                          <p className="text-slate-900">{buyer.company}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <p className="text-slate-500">Brand</p>
                                          <p className="text-slate-900">{buyer.brand}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <p className="text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Address
                                          </p>
                                          <p className="text-slate-900">{buyer.address}</p>
                                        </div>
                                      </div>

                                      <Separator />

                                      <div>
                                        <p className="text-slate-500 mb-2 flex items-center gap-1">
                                          <Phone className="w-3 h-3" />
                                          Authorized Contacts
                                        </p>
                                        {buyer.contacts.map((contact, idx) => (
                                          <div key={idx} className="p-2 bg-slate-50 rounded mb-2">
                                            <p className="text-sm text-slate-900">{contact.name}</p>
                                            <p className="text-xs text-slate-600">{contact.phone} • {contact.designation}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="bg-slate-50">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Commodity Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <p className="text-slate-500">Commodity</p>
                                          <p className="text-slate-900">{buyer.commodity}</p>
                                        </div>
                                        <div>
                                          <p className="text-slate-500">Quantity</p>
                                          <p className="text-slate-900">{buyer.weight} {buyer.unit}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <p className="text-slate-500">Packaging</p>
                                          <p className="text-slate-900">{buyer.packaging}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {buyer.auditorNotes && (
                                    <Alert className="border-purple-500 bg-purple-50">
                                      <FileText className="h-4 w-4 text-purple-600" />
                                      <AlertDescription className="text-purple-800">
                                        <strong>Auditor Notes:</strong> {buyer.auditorNotes}
                                      </AlertDescription>
                                    </Alert>
                                  )}

                                  {buyer.aiRisk && buyer.aiRisk > 50 && (
                                    <Alert className="border-red-500 bg-red-50">
                                      <Brain className="h-4 w-4 text-red-600" />
                                      <AlertDescription className="text-red-800">
                                        <strong>AI Risk Alert:</strong> This record has {buyer.editCount} corrections and {buyer.aiRisk}% risk score. Manual review recommended.
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </TabsContent>

                                <TabsContent value="payment" className="space-y-4 mt-4">
                                  <Card>
                                    <CardHeader className="bg-slate-50">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Financial Breakdown
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <p className="text-xs text-green-700">Product Amount</p>
                                          <p className="text-green-900">₹{buyer.productAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                          <p className="text-xs text-blue-700">Packaging Amount</p>
                                          <p className="text-blue-900">₹{buyer.packagingAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="col-span-2 p-3 bg-amber-50 rounded-lg border-2 border-amber-200">
                                          <p className="text-xs text-amber-700">Total Payable</p>
                                          <p className="text-amber-900">₹{buyer.totalAmount.toLocaleString()}</p>
                                        </div>
                                      </div>

                                      <Separator />

                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Payment Method</span>
                                          <span className="text-slate-900">{buyer.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Payment Details</span>
                                          <span className="text-slate-900 text-xs">{buyer.paymentDetails}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Due Date Logic</span>
                                          <span className="text-slate-900">{buyer.dueDateLogic}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Payment Due</span>
                                          <Badge className="bg-amber-500">{buyer.dueDate}</Badge>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="history" className="space-y-4 mt-4">
                                  <Card>
                                    <CardHeader className="bg-slate-50">
                                      <CardTitle className="text-base">Payment History</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                      {buyer.paymentHistory && buyer.paymentHistory.length > 0 ? (
                                        <div className="space-y-2">
                                          {buyer.paymentHistory.map((payment, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                              <div>
                                                <p className="text-sm text-slate-900">₹{payment.amount.toLocaleString()}</p>
                                                <p className="text-xs text-slate-600">{payment.date} • {payment.method}</p>
                                              </div>
                                              <Badge className={
                                                payment.status === 'completed' ? 'bg-green-500' :
                                                payment.status === 'pending' ? 'bg-amber-500' :
                                                'bg-red-500'
                                              }>
                                                {payment.status}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-slate-500 text-center py-6">No payment history available</p>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="bg-slate-50">
                                      <CardTitle className="text-base">Edit History</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                      <p className="text-sm text-slate-600">
                                        This record has been edited <strong>{buyer.editCount} times</strong>
                                      </p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        )}
                        {canEdit && (
                          <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
