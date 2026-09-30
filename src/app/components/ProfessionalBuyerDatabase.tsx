import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Building2, User, Phone, Mail, MapPin, Calendar, FileText, 
  DollarSign, Package, CreditCard, CheckCircle2, Clock, 
  AlertTriangle, Eye, Edit, Trash2, Plus, Download, Search,
  Shield, TrendingUp, BarChart3, Wallet, Globe, Scale
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface BuyerRecord {
  serialNo: string;
  date: string;
  buyerName: string;
  brandName: string;
  companyNames: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  authorizedPersons: {
    name: string;
    designation: string;
    mobile: string;
    email: string;
    isPrimary: boolean;
  }[];
  volume: {
    quantity: number;
    unit: 'Bags' | 'Nos' | 'Quintal' | 'Kg' | 'Crate' | 'Box';
    measurement: string;
    weightKg: number;
  };
  pricing: {
    pricePerUnit: number;
    numberOfUnits: number;
    amount: number;
  };
  packaging: {
    quantity: number;
    pricePerItem: number;
    totalPackagingCost: number;
    material: string;
  };
  totalPayable: number;
  debitDetails: {
    paymentMethod: string;
    country: string;
    chequeNo?: string;
    utrNo?: string;
    transactionId?: string;
    bankName?: string;
    accountNo?: string;
  };
  dueDate: {
    type: 'Regulatory' | 'Association' | 'Agreed' | 'Net-30' | 'Net-60' | 'Net-90' | 'COD';
    date: string;
    days: number;
    authority?: string;
    notes?: string;
  };
  status: 'Pending' | 'Waiting' | 'Approved' | 'Confirmed';
  createdBy: string;
  approvedBy?: string;
}

type ViewMode = 'agent' | 'authorized';

export function ProfessionalBuyerDatabase() {
  const [viewMode, setViewMode] = useState<ViewMode>('agent');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BuyerRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<BuyerRecord>>({
    serialNo: `TRD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    buyerName: '',
    brandName: '',
    companyNames: [],
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
    },
    authorizedPersons: [{
      name: '',
      designation: '',
      mobile: '',
      email: '',
      isPrimary: true,
    }],
    volume: {
      quantity: 0,
      unit: 'Bags',
      measurement: '',
      weightKg: 0,
    },
    pricing: {
      pricePerUnit: 0,
      numberOfUnits: 0,
      amount: 0,
    },
    packaging: {
      quantity: 0,
      pricePerItem: 0,
      totalPackagingCost: 0,
      material: 'Jute Bag',
    },
    totalPayable: 0,
    debitDetails: {
      paymentMethod: '',
      country: 'India',
    },
    dueDate: {
      type: 'Net-30',
      date: '',
      days: 30,
    },
    status: 'Pending',
    createdBy: 'Current User',
  });

  // Sample data
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([
    {
      serialNo: 'TRD-2025-0001',
      date: '2025-10-27',
      buyerName: 'Sunita Reddy',
      brandName: 'JJ & Company',
      companyNames: ['JJ & Co Branch A', 'JJ & Co Branch B', 'JJ Exports Ltd'],
      address: {
        street: '123 Market Road',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        pincode: '500001',
      },
      authorizedPersons: [
        {
          name: 'Rajesh Kumar',
          designation: 'Purchase Manager',
          mobile: '+91-9876543210',
          email: 'rajesh@jjco.com',
          isPrimary: true,
        },
        {
          name: 'Priya Sharma',
          designation: 'Finance Head',
          mobile: '+91-9876543211',
          email: 'priya@jjco.com',
          isPrimary: false,
        },
      ],
      volume: {
        quantity: 50,
        unit: 'Bags',
        measurement: 'Quintal',
        weightKg: 5000,
      },
      pricing: {
        pricePerUnit: 22,
        numberOfUnits: 50,
        amount: 1100,
      },
      packaging: {
        quantity: 10,
        pricePerItem: 5,
        totalPackagingCost: 50,
        material: 'Jute Bag',
      },
      totalPayable: 1150,
      debitDetails: {
        paymentMethod: 'UPI',
        country: 'India',
        utrNo: 'UTR202510270001',
      },
      dueDate: {
        type: 'Net-30',
        date: '2025-11-26',
        days: 30,
        notes: 'Standard payment terms',
      },
      status: 'Approved',
      createdBy: 'Agent A',
      approvedBy: 'Admin User',
    },
    {
      serialNo: 'TRD-2025-0002',
      date: '2025-10-26',
      buyerName: 'Amit Patel',
      brandName: 'Kumar Traders',
      companyNames: ['Kumar Traders Pvt Ltd', 'Kumar Exports'],
      address: {
        street: '456 Gandhi Nagar',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        pincode: '380001',
      },
      authorizedPersons: [
        {
          name: 'Amit Patel',
          designation: 'Owner',
          mobile: '+91-9876543220',
          email: 'amit@kumartraders.com',
          isPrimary: true,
        },
      ],
      volume: {
        quantity: 100,
        unit: 'Nos',
        measurement: 'Coconut',
        weightKg: 8000,
      },
      pricing: {
        pricePerUnit: 15,
        numberOfUnits: 100,
        amount: 1500,
      },
      packaging: {
        quantity: 20,
        pricePerItem: 3,
        totalPackagingCost: 60,
        material: 'Plastic Crate',
      },
      totalPayable: 1560,
      debitDetails: {
        paymentMethod: 'NEFT',
        country: 'India',
        utrNo: 'NEFT202510260001',
        bankName: 'HDFC Bank',
      },
      dueDate: {
        type: 'Regulatory',
        date: '2025-11-10',
        days: 15,
        authority: 'India Agriculture Act - 15 Days',
        notes: 'Statutory requirement for agricultural commodities',
      },
      status: 'Waiting',
      createdBy: 'Agent B',
    },
  ]);

  // Payment methods by country
  const paymentMethodsByCountry: Record<string, string[]> = {
    India: ['UPI', 'IMPS', 'NEFT', 'RTGS', 'Cheque', 'Demand Draft', 'Cash'],
    USA: ['ACH', 'Wire Transfer', 'Zelle', 'Check', 'PayPal', 'Credit Card'],
    UK: ['BACS', 'CHAPS', 'Faster Payments', 'Cheque', 'Card Payment'],
    EU: ['SEPA', 'iDEAL', 'Sofort', 'Direct Debit', 'Wire Transfer'],
    Global: ['SWIFT', 'Cryptocurrency (USDT)', 'PayPal', 'Western Union'],
  };

  // Calculation helpers
  const calculateAmount = () => {
    const amount = (formData.pricing?.pricePerUnit || 0) * (formData.pricing?.numberOfUnits || 0);
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing!,
        amount,
      },
    });
  };

  const calculatePackaging = () => {
    const totalPackagingCost = (formData.packaging?.quantity || 0) * (formData.packaging?.pricePerItem || 0);
    setFormData({
      ...formData,
      packaging: {
        ...formData.packaging!,
        totalPackagingCost,
      },
    });
  };

  const calculateTotal = () => {
    const amount = formData.pricing?.amount || 0;
    const packagingCost = formData.packaging?.totalPackagingCost || 0;
    const totalPayable = amount + packagingCost;
    setFormData({
      ...formData,
      totalPayable,
    });
  };

  const addCompanyName = () => {
    if (!formData.companyNames) {
      setFormData({ ...formData, companyNames: [] });
    }
    setFormData({
      ...formData,
      companyNames: [...(formData.companyNames || []), ''],
    });
  };

  const updateCompanyName = (index: number, value: string) => {
    const updated = [...(formData.companyNames || [])];
    updated[index] = value;
    setFormData({ ...formData, companyNames: updated });
  };

  const removeCompanyName = (index: number) => {
    const updated = (formData.companyNames || []).filter((_, i) => i !== index);
    setFormData({ ...formData, companyNames: updated });
  };

  const addAuthorizedPerson = () => {
    setFormData({
      ...formData,
      authorizedPersons: [
        ...(formData.authorizedPersons || []),
        { name: '', designation: '', mobile: '', email: '', isPrimary: false },
      ],
    });
  };

  const updateAuthorizedPerson = (index: number, field: string, value: any) => {
    const updated = [...(formData.authorizedPersons || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, authorizedPersons: updated });
  };

  const removeAuthorizedPerson = (index: number) => {
    const updated = (formData.authorizedPersons || []).filter((_, i) => i !== index);
    setFormData({ ...formData, authorizedPersons: updated });
  };

  const handleSubmit = () => {
    const newRecord: BuyerRecord = formData as BuyerRecord;
    if (editingRecord) {
      setBuyerRecords(buyerRecords.map(r => r.serialNo === editingRecord.serialNo ? newRecord : r));
    } else {
      setBuyerRecords([...buyerRecords, newRecord]);
    }
    setShowForm(false);
    setEditingRecord(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      serialNo: `TRD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      buyerName: '',
      brandName: '',
      companyNames: [],
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      },
      authorizedPersons: [{
        name: '',
        designation: '',
        mobile: '',
        email: '',
        isPrimary: true,
      }],
      volume: {
        quantity: 0,
        unit: 'Bags',
        measurement: '',
        weightKg: 0,
      },
      pricing: {
        pricePerUnit: 0,
        numberOfUnits: 0,
        amount: 0,
      },
      packaging: {
        quantity: 0,
        pricePerItem: 0,
        totalPackagingCost: 0,
        material: 'Jute Bag',
      },
      totalPayable: 0,
      debitDetails: {
        paymentMethod: '',
        country: 'India',
      },
      dueDate: {
        type: 'Net-30',
        date: '',
        days: 30,
      },
      status: 'Pending',
      createdBy: 'Current User',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      Pending: { color: 'bg-amber-500', icon: Clock },
      Waiting: { color: 'bg-orange-500', icon: Clock },
      Approved: { color: 'bg-blue-500', icon: CheckCircle2 },
      Confirmed: { color: 'bg-green-500', icon: CheckCircle2 },
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredRecords = buyerRecords.filter(record => 
    record.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Professional Buyer Database
          </h1>
          <p className="text-slate-600 mt-1">Auditor-Approved Record Management System</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'agent' ? 'default' : 'outline'}
            onClick={() => setViewMode('agent')}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Agent View
          </Button>
          <Button
            variant={viewMode === 'authorized' ? 'default' : 'outline'}
            onClick={() => setViewMode('authorized')}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            Authorized View
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-slate-600">Total Records</p>
            </div>
            <p className="text-slate-900 text-2xl font-bold">{buyerRecords.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-xs text-slate-600">Total Payable</p>
            </div>
            <p className="text-slate-900 text-2xl font-bold">
              ₹{buyerRecords.reduce((sum, r) => sum + r.totalPayable, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-slate-600">Pending Approval</p>
            </div>
            <p className="text-slate-900 text-2xl font-bold">
              {buyerRecords.filter(r => r.status === 'Pending' || r.status === 'Waiting').length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-slate-600">Active Buyers</p>
            </div>
            <p className="text-slate-900 text-2xl font-bold">
              {new Set(buyerRecords.map(r => r.buyerName)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by buyer name, serial no, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? 'Edit Buyer Record' : 'New Buyer Record'}
                </DialogTitle>
                <DialogDescription>
                  Complete all fields as per accounting and auditing standards
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="transaction">Transaction</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Serial Number (Auto-Generated)</Label>
                      <Input value={formData.serialNo} disabled className="bg-slate-100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Buyer Name *</Label>
                    <Input
                      placeholder="Enter buyer name"
                      value={formData.buyerName}
                      onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Brand Name *</Label>
                    <Input
                      placeholder="Enter brand name"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Company Names under Brand</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addCompanyName}
                        className="gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Company
                      </Button>
                    </div>
                    {(formData.companyNames || []).map((company, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Company ${index + 1}`}
                          value={company}
                          onChange={(e) => updateCompanyName(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeCompanyName(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Address Details</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          placeholder="Enter street address"
                          value={formData.address?.street}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address!, street: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          placeholder="City"
                          value={formData.address?.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address!, city: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          placeholder="State"
                          value={formData.address?.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address!, state: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select
                          value={formData.address?.country}
                          onValueChange={(v) => setFormData({
                            ...formData,
                            address: { ...formData.address!, country: v }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="EU">European Union</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input
                          placeholder="Pincode"
                          value={formData.address?.pincode}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address!, pincode: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Authorized Persons</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addAuthorizedPerson}
                        className="gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Person
                      </Button>
                    </div>
                    {(formData.authorizedPersons || []).map((person, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant={person.isPrimary ? 'default' : 'outline'}>
                              {person.isPrimary ? 'Primary Contact' : 'Secondary Contact'}
                            </Badge>
                            {!person.isPrimary && (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeAuthorizedPerson(index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                placeholder="Full name"
                                value={person.name}
                                onChange={(e) => updateAuthorizedPerson(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Designation</Label>
                              <Input
                                placeholder="Job title"
                                value={person.designation}
                                onChange={(e) => updateAuthorizedPerson(index, 'designation', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Mobile Number</Label>
                              <Input
                                placeholder="+91-XXXXXXXXXX"
                                value={person.mobile}
                                onChange={(e) => updateAuthorizedPerson(index, 'mobile', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                value={person.email}
                                onChange={(e) => updateAuthorizedPerson(index, 'email', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Transaction Tab */}
                <TabsContent value="transaction" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Volume Details</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          value={formData.volume?.quantity || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            volume: { ...formData.volume!, quantity: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select
                          value={formData.volume?.unit}
                          onValueChange={(v: any) => setFormData({
                            ...formData,
                            volume: { ...formData.volume!, unit: v }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bags">Bags</SelectItem>
                            <SelectItem value="Nos">Nos</SelectItem>
                            <SelectItem value="Quintal">Quintal</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Crate">Crate</SelectItem>
                            <SelectItem value="Box">Box</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Measurement Type</Label>
                        <Input
                          placeholder="e.g., Rice, Wheat, Coconut"
                          value={formData.volume?.measurement}
                          onChange={(e) => setFormData({
                            ...formData,
                            volume: { ...formData.volume!, measurement: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Weight (Kg)</Label>
                        <Input
                          type="number"
                          placeholder="Weight in kg"
                          value={formData.volume?.weightKg || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            volume: { ...formData.volume!, weightKg: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base font-bold">Pricing Details</Label>
                    <Alert className="border-blue-500 bg-blue-50">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-900 text-sm">
                        <strong>Formula:</strong> Amount = Price per Unit × Number of Units
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Price per Unit (₹)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 22"
                          value={formData.pricing?.pricePerUnit || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              pricing: { ...formData.pricing!, pricePerUnit: parseFloat(e.target.value) || 0 }
                            });
                          }}
                          onBlur={calculateAmount}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Number of Units</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 50"
                          value={formData.pricing?.numberOfUnits || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              pricing: { ...formData.pricing!, numberOfUnits: parseFloat(e.target.value) || 0 }
                            });
                          }}
                          onBlur={calculateAmount}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.pricing?.amount || 0}
                          disabled
                          className="bg-green-50 font-bold text-green-900"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      Example: 50 units × ₹22 = ₹{(formData.pricing?.pricePerUnit || 0) * (formData.pricing?.numberOfUnits || 0)}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base font-bold">Packaging Details</Label>
                    <Alert className="border-purple-500 bg-purple-50">
                      <Package className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-900 text-sm">
                        <strong>Formula:</strong> Packaging Cost = Quantity × Price per Item
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Material Type</Label>
                        <Select
                          value={formData.packaging?.material}
                          onValueChange={(v) => setFormData({
                            ...formData,
                            packaging: { ...formData.packaging!, material: v }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Jute Bag">Jute Bag</SelectItem>
                            <SelectItem value="PP Bag">PP Bag</SelectItem>
                            <SelectItem value="Plastic Crate">Plastic Crate</SelectItem>
                            <SelectItem value="Wooden Box">Wooden Box</SelectItem>
                            <SelectItem value="Gunny Bag">Gunny Bag</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 10"
                          value={formData.packaging?.quantity || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging!, quantity: parseFloat(e.target.value) || 0 }
                            });
                          }}
                          onBlur={calculatePackaging}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price per Item (₹)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 5"
                          value={formData.packaging?.pricePerItem || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging!, pricePerItem: parseFloat(e.target.value) || 0 }
                            });
                          }}
                          onBlur={calculatePackaging}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Packaging Cost (₹)</Label>
                        <Input
                          type="number"
                          value={formData.packaging?.totalPackagingCost || 0}
                          disabled
                          className="bg-blue-50 font-bold text-blue-900"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      Example: 10 bags × ₹5 = ₹{(formData.packaging?.quantity || 0) * (formData.packaging?.pricePerItem || 0)}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base font-bold">Total Payable</Label>
                    <Alert className="border-green-500 bg-green-50">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900">
                        <strong>Formula:</strong> Total = Amount + Packaging Cost
                        <br />
                        ₹{formData.pricing?.amount || 0} + ₹{formData.packaging?.totalPackagingCost || 0} = ₹{(formData.pricing?.amount || 0) + (formData.packaging?.totalPackagingCost || 0)}
                      </AlertDescription>
                    </Alert>
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                      <p className="text-white text-sm mb-1">Total Amount Payable</p>
                      <p className="text-white text-3xl font-bold">
                        ₹{((formData.pricing?.amount || 0) + (formData.packaging?.totalPackagingCost || 0)).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={calculateTotal}
                      className="w-full"
                    >
                      Recalculate Total
                    </Button>
                  </div>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Payment Details</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select
                          value={formData.debitDetails?.country}
                          onValueChange={(v) => setFormData({
                            ...formData,
                            debitDetails: { ...formData.debitDetails!, country: v, paymentMethod: '' }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="EU">European Union</SelectItem>
                            <SelectItem value="Global">Global</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select
                          value={formData.debitDetails?.paymentMethod}
                          onValueChange={(v) => setFormData({
                            ...formData,
                            debitDetails: { ...formData.debitDetails!, paymentMethod: v }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethodsByCountry[formData.debitDetails?.country || 'India']?.map((method) => (
                              <SelectItem key={method} value={method}>{method}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cheque Number (if applicable)</Label>
                      <Input
                        placeholder="Enter cheque number"
                        value={formData.debitDetails?.chequeNo || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          debitDetails: { ...formData.debitDetails!, chequeNo: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>UTR/Transaction ID</Label>
                      <Input
                        placeholder="Enter UTR or transaction ID"
                        value={formData.debitDetails?.utrNo || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          debitDetails: { ...formData.debitDetails!, utrNo: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input
                        placeholder="Enter bank name"
                        value={formData.debitDetails?.bankName || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          debitDetails: { ...formData.debitDetails!, bankName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number (Last 4 digits)</Label>
                      <Input
                        placeholder="XXXX"
                        maxLength={4}
                        value={formData.debitDetails?.accountNo || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          debitDetails: { ...formData.debitDetails!, accountNo: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Terms Tab */}
                <TabsContent value="terms" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Due Date & Payment Terms</Label>
                    <Alert className="border-amber-500 bg-amber-50">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-900 text-sm">
                        Due dates must be defined by regulatory authorities, trade associations, or mutually agreed terms
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label>Due Date Type *</Label>
                      <Select
                        value={formData.dueDate?.type}
                        onValueChange={(v: any) => {
                          let days = 30;
                          let authority = '';
                          if (v === 'Regulatory') {
                            days = 15;
                            authority = 'India Agriculture Act - 15 Days';
                          } else if (v === 'Association') {
                            days = 30;
                            authority = 'APEDA Standard Terms';
                          } else if (v === 'Net-30') days = 30;
                          else if (v === 'Net-60') days = 60;
                          else if (v === 'Net-90') days = 90;
                          else if (v === 'COD') days = 0;

                          const dueDate = new Date();
                          dueDate.setDate(dueDate.getDate() + days);

                          setFormData({
                            ...formData,
                            dueDate: {
                              type: v,
                              date: dueDate.toISOString().split('T')[0],
                              days,
                              authority,
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regulatory">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-red-600" />
                              Regulatory (15 days - India Agri Act)
                            </div>
                          </SelectItem>
                          <SelectItem value="Association">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              Trade Association (30 days - APEDA)
                            </div>
                          </SelectItem>
                          <SelectItem value="Agreed">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-600" />
                              Mutually Agreed (Custom)
                            </div>
                          </SelectItem>
                          <SelectItem value="Net-30">Net-30 (30 days)</SelectItem>
                          <SelectItem value="Net-60">Net-60 (60 days)</SelectItem>
                          <SelectItem value="Net-90">Net-90 (90 days)</SelectItem>
                          <SelectItem value="COD">COD (Cash on Delivery)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.dueDate?.type === 'Regulatory' && (
                      <Alert className="border-red-500 bg-red-50">
                        <Shield className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-900 text-sm">
                          <strong>Regulatory Requirement:</strong> India Agriculture Marketing Act mandates payment within 15 days for agricultural commodities
                        </AlertDescription>
                      </Alert>
                    )}

                    {formData.dueDate?.type === 'Association' && (
                      <Alert className="border-blue-500 bg-blue-50">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900 text-sm">
                          <strong>Trade Association:</strong> APEDA standard payment terms - 30 days from invoice date
                        </AlertDescription>
                      </Alert>
                    )}

                    {formData.dueDate?.type === 'Agreed' && (
                      <div className="space-y-2">
                        <Label>Custom Days</Label>
                        <Input
                          type="number"
                          placeholder="Enter number of days"
                          value={formData.dueDate?.days || ''}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 0;
                            const dueDate = new Date();
                            dueDate.setDate(dueDate.getDate() + days);
                            setFormData({
                              ...formData,
                              dueDate: {
                                ...formData.dueDate!,
                                days,
                                date: dueDate.toISOString().split('T')[0],
                              }
                            });
                          }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Payment Due Date</Label>
                        <Input
                          type="date"
                          value={formData.dueDate?.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            dueDate: { ...formData.dueDate!, date: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Days to Pay</Label>
                        <Input
                          type="number"
                          value={formData.dueDate?.days || 0}
                          disabled
                          className="bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        placeholder="Enter any additional terms or conditions..."
                        value={formData.dueDate?.notes || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          dueDate: { ...formData.dueDate!, notes: e.target.value }
                        })}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-bold text-blue-900 mb-3">Payment Terms Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Type:</span>
                        <span className="text-blue-900 font-bold">{formData.dueDate?.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Due Date:</span>
                        <span className="text-blue-900 font-bold">{formData.dueDate?.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Days:</span>
                        <span className="text-blue-900 font-bold">{formData.dueDate?.days} days</span>
                      </div>
                      {formData.dueDate?.authority && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Authority:</span>
                          <span className="text-blue-900 font-bold text-xs">{formData.dueDate.authority}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecord(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {editingRecord ? 'Update Record' : 'Create Record'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Buyer Records Database
          </CardTitle>
          <CardDescription>
            {viewMode === 'agent' ? 'Commission Agent View' : 'Authorized Person View'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer / Brand</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Packaging</TableHead>
                  <TableHead>Total Payable</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.serialNo}>
                    <TableCell className="font-mono text-sm">{record.serialNo}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{record.buyerName}</p>
                        <p className="text-xs text-slate-600">{record.brandName}</p>
                        <p className="text-xs text-slate-500">
                          {record.companyNames.length} companies
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{record.volume.quantity} {record.volume.unit}</p>
                        <p className="text-xs text-slate-600">{record.volume.measurement}</p>
                        <p className="text-xs text-slate-500">{record.volume.weightKg} kg</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      ₹{record.pricing.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">₹{record.packaging.totalPackagingCost}</p>
                        <p className="text-xs text-slate-500">{record.packaging.material}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg text-blue-600">
                      ₹{record.totalPayable.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{record.debitDetails.paymentMethod}</Badge>
                        <p className="text-xs text-slate-500 mt-1">{record.debitDetails.country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-bold">{new Date(record.dueDate.date).toLocaleDateString()}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {record.dueDate.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        {viewMode === 'agent' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
