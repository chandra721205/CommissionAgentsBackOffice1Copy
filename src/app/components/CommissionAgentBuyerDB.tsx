import { useState } from 'react';
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
import { Progress } from './ui/progress';
import { 
  Mic, Search, AlertTriangle, CheckCircle2, Lock, ArrowRight, Star, 
  Brain, QrCode, Download, Clock, Shield, TrendingUp, DollarSign, 
  Package, User, Building2, Phone, Mail, MapPin, Calendar, FileText, 
  Zap, Info, Edit, X, Plus, Trash2, ChevronDown, Filter, ExternalLink
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

type Screen = 1 | 2 | 3 | 4 | 5 | 6;
type BillStatus = 'Pending' | 'Waiting' | 'Confirmed';

interface BuyerBill {
  sNo: number;
  serialNo: string;
  date: string;
  billNo: string;
  buyerName: string;
  buyerBrands: string[];
  address: string;
  authorizedContacts: {
    mobile: string;
    email: string;
    whatsapp: boolean;
    isPrimary: boolean;
  }[];
  debitMethod: string;
  debitRef: string;
  volumeUnits: number;
  volumeMeasurement: string;
  unitPrice: number;
  amount: number;
  packagingType: 'Fixed' | 'Dynamic';
  packagingMaterial: string;
  packagingQty: number;
  packagingRate: number;
  packagingAmount: number;
  taxAmount: number;
  totalPayable: number;
  dueType: string;
  dueDate: string;
  receiptDate: string;
  daysPastDue: number;
  status: BillStatus;
  buyerClass?: string;
  justificationLog: {
    change: string;
    reason: string;
    by: string;
    timestamp: string;
    twoFAHash: string;
  }[];
  aiInsights: string;
  ratingChange?: number;
  blockchainAppended: boolean;
}

export function CommissionAgentBuyerDB() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [voiceActive, setVoiceActive] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [tokens, setTokens] = useState(1250);
  const [selectedBill, setSelectedBill] = useState<BuyerBill | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state for new entry
  const [formData, setFormData] = useState({
    serialNo: 'TRD-2025-001',
    billNo: 'YT-7685',
    buyerName: '',
    buyerBrands: [''],
    address: '',
    contacts: [{
      mobile: '',
      email: '',
      whatsapp: false,
      isPrimary: true,
    }],
    debitCountry: 'India',
    debitMethod: '',
    debitRef: '',
    volumeUnits: 0,
    volumeMeasurement: '',
    unitPrice: 0,
    packagingType: 'Fixed' as 'Fixed' | 'Dynamic',
    packagingMaterial: 'Jute',
    packagingQty: 0,
    packagingRate: 5,
    dueType: 'Net-30',
    dueDays: 30,
    dueDate: '',
  });

  // Sample bills (from Excel + enhancements)
  const [bills, setBills] = useState<BuyerBill[]>([
    {
      sNo: 1,
      serialNo: 'TRD-2024-001',
      date: '2024-05-13',
      billNo: 'YT-7685',
      buyerName: 'PSR',
      buyerBrands: ['JJ&Co', 'Sub-Branch A', 'Sub-Branch B'],
      address: 'GGFFH',
      authorizedContacts: [
        { mobile: '678785664', email: 'psr@jjco.com', whatsapp: true, isPrimary: true },
      ],
      debitMethod: 'Cheque',
      debitRef: 'IVDF-23145',
      volumeUnits: 23,
      volumeMeasurement: 'Quintal',
      unitPrice: 1200,
      amount: 27600,
      packagingType: 'Fixed',
      packagingMaterial: 'Jute',
      packagingQty: 10,
      packagingRate: 5,
      packagingAmount: 50,
      taxAmount: 276,
      totalPayable: 27926,
      dueType: 'Net-30',
      dueDate: '2024-05-28',
      receiptDate: '2024-06-06',
      daysPastDue: 9,
      status: 'Waiting',
      justificationLog: [],
      aiInsights: 'Grok: 9 Days Past—Predict 75% Recovery if Notify Now',
      blockchainAppended: false,
    },
    {
      sNo: 2,
      serialNo: 'TRD-2025-002',
      date: '2025-10-27',
      billNo: 'YT-7686',
      buyerName: 'Kumar Traders',
      buyerBrands: ['Kumar Traders Pvt Ltd'],
      address: '123 Gandhi Nagar, Ahmedabad',
      authorizedContacts: [
        { mobile: '+91-9876543210', email: 'kumar@traders.com', whatsapp: true, isPrimary: true },
      ],
      debitMethod: 'UPI',
      debitRef: 'UTR-HDFC987666',
      volumeUnits: 50,
      volumeMeasurement: '50kg Bag',
      unitPrice: 22,
      amount: 1100,
      packagingType: 'Dynamic',
      packagingMaterial: 'PP',
      packagingQty: 10,
      packagingRate: 3,
      packagingAmount: 30,
      taxAmount: 11,
      totalPayable: 1141,
      dueType: 'Regulatory',
      dueDate: '2025-11-11',
      receiptDate: '',
      daysPastDue: 0,
      status: 'Pending',
      justificationLog: [],
      aiInsights: 'Grok: Low Risk—Hist Recovery 92%',
      blockchainAppended: false,
    },
  ]);

  const VoiceButton = ({ field }: { field: string }) => (
    <button
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
        voiceActive === field 
          ? 'bg-red-500 text-white scale-110' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
      onClick={() => {
        setVoiceActive(voiceActive === field ? null : field);
        setTimeout(() => setVoiceActive(null), 2000);
      }}
    >
      <Mic className="w-4 h-4" />
    </button>
  );

  const calculateAmount = () => {
    return formData.volumeUnits * formData.unitPrice;
  };

  const calculatePackaging = () => {
    return formData.packagingQty * formData.packagingRate;
  };

  const calculateTotal = () => {
    const amount = calculateAmount();
    const packaging = calculatePackaging();
    const tax = amount * 0.01;
    return amount + packaging + tax;
  };

  const getStatusColor = (status: BillStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500';
      case 'Waiting': return 'bg-orange-500 animate-pulse';
      case 'Confirmed': return 'bg-green-500';
    }
  };

  const getStatusBadge = (status: BillStatus) => {
    const colors = {
      Pending: 'bg-amber-500',
      Waiting: 'bg-orange-500',
      Confirmed: 'bg-green-500',
    };
    return (
      <Badge className={`${colors[status]} text-white`}>
        {status}
      </Badge>
    );
  };

  const paymentMethodsByCountry: Record<string, string[]> = {
    India: ['UPI', 'IMPS', 'NEFT', 'RTGS', 'Cheque', 'Demand Draft'],
    USA: ['ACH', 'Wire Transfer', 'Zelle', 'Check', 'PayPal'],
    UK: ['BACS', 'CHAPS', 'Faster Payments', 'Cheque'],
    EU: ['SEPA', 'iDEAL', 'Sofort', 'Direct Debit'],
    Global: ['SWIFT', 'Cryptocurrency (USDT)', 'PayPal'],
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.billNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Screen 1: Weighing End Auto-Entry Form
  const Screen1 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            New Bill Entry
          </h2>
          <p className="text-sm text-slate-600">Lot: CHL-2025-001</p>
        </div>
        <Badge className="bg-amber-500 text-white h-8 px-3">
          Pending Authorization
        </Badge>
      </div>

      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-5 space-y-4">
          {/* Auto-generated fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Serial No (Auto)</Label>
              <Input value={formData.serialNo} disabled className="h-12 bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Bill No (Auto)</Label>
              <Input value={formData.billNo} disabled className="h-12 bg-slate-100" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Date (Timestamp)</Label>
            <Input value={new Date().toLocaleDateString()} disabled className="h-12 bg-slate-100" />
          </div>

          {/* Buyer Name with Multi-Brand */}
          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600">Buyer Name (Primary)</Label>
            <Input 
              value={formData.buyerName}
              onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
              className="h-12 pr-12"
              placeholder="Enter buyer name"
            />
            <VoiceButton field="buyerName" />
          </div>

          <Accordion type="single" collapsible className="border rounded-lg">
            <AccordionItem value="brands" className="border-0">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Multi-Brand Companies ({formData.buyerBrands.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-2">
                {formData.buyerBrands.map((brand, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={brand}
                      onChange={(e) => {
                        const updated = [...formData.buyerBrands];
                        updated[index] = e.target.value;
                        setFormData({...formData, buyerBrands: updated});
                      }}
                      placeholder={`Company ${index + 1} (e.g., JJ&Co Branch A)`}
                      className="h-10"
                    />
                    {index > 0 && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          const updated = formData.buyerBrands.filter((_, i) => i !== index);
                          setFormData({...formData, buyerBrands: updated});
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFormData({...formData, buyerBrands: [...formData.buyerBrands, '']})}
                  className="w-full gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Add Sub-Company
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Address */}
          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600">Address (Geo-Auto)</Label>
            <Textarea 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="pr-12 min-h-20"
              placeholder="Enter address"
            />
            <VoiceButton field="address" />
          </div>

          {/* Multi-Contacts */}
          <Accordion type="single" collapsible className="border rounded-lg">
            <AccordionItem value="contacts" className="border-0">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Authorized Contacts ({formData.contacts.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                {formData.contacts.map((contact, index) => (
                  <Card key={index} className="p-3 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={contact.isPrimary ? 'default' : 'outline'}>
                          {contact.isPrimary ? 'Primary' : 'Secondary'}
                        </Badge>
                        {!contact.isPrimary && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updated = formData.contacts.filter((_, i) => i !== index);
                              setFormData({...formData, contacts: updated});
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Mobile (e.g., +91-XXXXXXXXXX)"
                        value={contact.mobile}
                        onChange={(e) => {
                          const updated = [...formData.contacts];
                          updated[index].mobile = e.target.value;
                          setFormData({...formData, contacts: updated});
                        }}
                        className="h-10"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const updated = [...formData.contacts];
                          updated[index].email = e.target.value;
                          setFormData({...formData, contacts: updated});
                        }}
                        className="h-10"
                      />
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={contact.whatsapp}
                          onCheckedChange={(checked) => {
                            const updated = [...formData.contacts];
                            updated[index].whatsapp = checked;
                            setFormData({...formData, contacts: updated});
                          }}
                        />
                        <Label className="text-xs">WhatsApp Available</Label>
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.contacts.length < 5 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({
                      ...formData, 
                      contacts: [...formData.contacts, { mobile: '', email: '', whatsapp: false, isPrimary: false }]
                    })}
                    className="w-full gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Contact (Max 5)
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Debit Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Country</Label>
              <Select 
                value={formData.debitCountry}
                onValueChange={(v) => setFormData({...formData, debitCountry: v, debitMethod: ''})}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">🇮🇳 India</SelectItem>
                  <SelectItem value="USA">🇺🇸 United States</SelectItem>
                  <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="EU">🇪🇺 European Union</SelectItem>
                  <SelectItem value="Global">🌍 Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Payment Method</Label>
              <Select 
                value={formData.debitMethod}
                onValueChange={(v) => setFormData({...formData, debitMethod: v})}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodsByCountry[formData.debitCountry]?.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600">Debit Ref (Cheque No / UTR)</Label>
            <Input 
              value={formData.debitRef}
              onChange={(e) => setFormData({...formData, debitRef: e.target.value})}
              className="h-12 pr-12"
              placeholder="e.g., IVDF-23145 or UTR-HDFC987666"
            />
            <VoiceButton field="debitRef" />
          </div>

          <Separator />

          {/* Volume & Measurement */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 relative">
              <Label className="text-xs text-slate-600">Volume Units (Bags/Nos)</Label>
              <Input 
                type="number"
                value={formData.volumeUnits || ''}
                onChange={(e) => setFormData({...formData, volumeUnits: parseFloat(e.target.value) || 0})}
                className="h-12 pr-12"
                placeholder="e.g., 23"
              />
              <VoiceButton field="volumeUnits" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Measurement</Label>
              <Select 
                value={formData.volumeMeasurement}
                onValueChange={(v) => setFormData({...formData, volumeMeasurement: v})}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <div className="px-3 py-2 text-xs font-bold text-slate-500 sticky top-0 bg-white">
                    Grains/Pulses
                  </div>
                  <SelectItem value="Quintal">Quintal</SelectItem>
                  <SelectItem value="50kg Bag">50kg Bag</SelectItem>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Spices</div>
                  <SelectItem value="25kg Bag">25kg Bag (Spices)</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Fruits/Vegetables</div>
                  <SelectItem value="Crate (20kg)">Crate (20kg Mango)</SelectItem>
                  <SelectItem value="Box (10kg)">Box (10kg Tomato)</SelectItem>
                  <SelectItem value="Nos">Nos</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Coconut</div>
                  <SelectItem value="Nos">Nos</SelectItem>
                  <SelectItem value="100 Nos">100 Nos</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Mushroom</div>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <SelectItem value="Tray (5kg)">Tray (5kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600">Unit Price (₹)</Label>
            <Input 
              type="number"
              value={formData.unitPrice || ''}
              onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})}
              className="h-12 pr-12"
              placeholder="e.g., 22"
            />
            <VoiceButton field="unitPrice" />
          </div>

          {/* Auto-calc Amount */}
          <Alert className="border-green-500 bg-green-50">
            <DollarSign className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 text-sm">
              <strong>Amount (Auto):</strong> {formData.volumeUnits} units × ₹{formData.unitPrice} = <strong>₹{calculateAmount()}</strong>
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Packaging Toggle */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-900">Packaging Type</Label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${formData.packagingType === 'Fixed' ? 'font-bold' : 'text-slate-500'}`}>
                  Fixed
                </span>
                <Switch 
                  checked={formData.packagingType === 'Dynamic'}
                  onCheckedChange={(checked) => setFormData({...formData, packagingType: checked ? 'Dynamic' : 'Fixed'})}
                />
                <span className={`text-xs ${formData.packagingType === 'Dynamic' ? 'font-bold' : 'text-slate-500'}`}>
                  Dynamic
                </span>
              </div>
            </div>

            {formData.packagingType === 'Fixed' ? (
              <Select defaultValue="jute">
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jute">Jute Bag - ₹5/bag (Standard)</SelectItem>
                  <SelectItem value="pp">PP Bag - ₹3/bag</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <Select 
                  value={formData.packagingMaterial}
                  onValueChange={(v) => setFormData({...formData, packagingMaterial: v})}
                >
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jute">Jute</SelectItem>
                    <SelectItem value="PP">PP</SelectItem>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="Gunny">Gunny</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number"
                  value={formData.packagingQty || ''}
                  onChange={(e) => setFormData({...formData, packagingQty: parseFloat(e.target.value) || 0})}
                  className="h-12"
                  placeholder="Qty"
                />
                <Input 
                  type="number"
                  value={formData.packagingRate || ''}
                  onChange={(e) => setFormData({...formData, packagingRate: parseFloat(e.target.value) || 0})}
                  className="h-12"
                  placeholder="Rate"
                />
              </div>
            )}

            <Alert className="border-purple-500 bg-purple-100">
              <Package className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 text-sm">
                <strong>Packaging (Auto):</strong> {formData.packagingQty} × ₹{formData.packagingRate} = <strong>₹{calculatePackaging()}</strong>
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Total Payable */}
          <div className="space-y-2">
            <Alert className="border-blue-500 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                <strong>Formula:</strong> Amount (₹{calculateAmount()}) + Packaging (₹{calculatePackaging()}) + Tax 1% (₹{(calculateAmount() * 0.01).toFixed(2)})
              </AlertDescription>
            </Alert>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <p className="text-white text-sm mb-1">Total Payable</p>
              <p className="text-white text-3xl font-bold">₹{calculateTotal().toFixed(2)}</p>
            </div>
          </div>

          {/* AI Insight */}
          <Alert className="border-green-500 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 text-sm">
              <strong>Grok:</strong> Low Risk—Historical Recovery 92%
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12">
              Save Draft
            </Button>
            <Button 
              className="h-12 bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A] font-bold"
              onClick={() => setCurrentScreen(2)}
            >
              2FA Save & View Table
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 2: Pending Authorization Table (Excel-like)
  const Screen2 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Pending Bills Database
          </h2>
          <p className="text-sm text-slate-600">Commission Agent View</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by buyer name or bill no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] h-12">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Waiting">Waiting</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Excel-like Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-bold">S.No</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Bill No</TableHead>
                  <TableHead className="font-bold">Buyer Name</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Contact</TableHead>
                  <TableHead className="font-bold">Debit Details</TableHead>
                  <TableHead className="font-bold text-right">Units</TableHead>
                  <TableHead className="font-bold">Measurement</TableHead>
                  <TableHead className="font-bold text-right">Amount (₹)</TableHead>
                  <TableHead className="font-bold text-right">Packing (₹)</TableHead>
                  <TableHead className="font-bold text-right">Total (₹)</TableHead>
                  <TableHead className="font-bold">Due Date</TableHead>
                  <TableHead className="font-bold">Receipt Date</TableHead>
                  <TableHead className="font-bold text-center">Days Past</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold">AI Insights</TableHead>
                  <TableHead className="font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow 
                    key={bill.sNo}
                    className={`cursor-pointer hover:bg-slate-50 border-l-4 ${
                      bill.status === 'Pending' ? 'border-l-amber-500' :
                      bill.status === 'Waiting' ? 'border-l-orange-500' :
                      'border-l-green-500'
                    }`}
                    onClick={() => {
                      setSelectedBill(bill);
                      if (bill.status !== 'Confirmed') {
                        setShowEditModal(true);
                      }
                    }}
                  >
                    <TableCell className="font-mono">{bill.sNo}</TableCell>
                    <TableCell className="whitespace-nowrap">{bill.date}</TableCell>
                    <TableCell className="font-bold text-blue-600">{bill.billNo}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{bill.buyerName}</p>
                        <p className="text-xs text-slate-500">{bill.buyerBrands.length} brands</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{bill.address}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{bill.authorizedContacts[0].mobile}</p>
                        <p className="text-xs text-slate-500">{bill.authorizedContacts[0].email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs">{bill.debitMethod}</Badge>
                        <p className="text-xs text-slate-600 mt-1">{bill.debitRef}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">{bill.volumeUnits}</TableCell>
                    <TableCell>{bill.volumeMeasurement}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {bill.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{bill.packagingAmount}</TableCell>
                    <TableCell className="text-right font-bold text-blue-600 text-lg">
                      {bill.totalPayable.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{bill.dueDate}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {bill.receiptDate || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={bill.daysPastDue > 0 ? 'bg-red-500 text-white' : 'bg-slate-200'}>
                        {bill.daysPastDue}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(bill.status)}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <Alert className="border-purple-500 bg-purple-50 p-2 m-0">
                        <Brain className="h-3 w-3 text-purple-600" />
                        <AlertDescription className="text-xs text-purple-900">
                          {bill.aiInsights}
                        </AlertDescription>
                      </Alert>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBill(bill);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        {bill.status === 'Waiting' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBill(bill);
                              setCurrentScreen(5);
                            }}
                          >
                            Approve
                          </Button>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
            <p className="text-sm text-slate-600">Total Bills</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {bills.filter(b => b.status === 'Pending').length}
            </p>
            <p className="text-sm text-slate-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {bills.filter(b => b.status === 'Waiting').length}
            </p>
            <p className="text-sm text-slate-600">Waiting</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              ₹{bills.reduce((sum, b) => sum + b.totalPayable, 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Total Payable</p>
          </CardContent>
        </Card>
      </div>

      <Button 
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setCurrentScreen(1)}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Bill Entry
      </Button>
    </div>
  );

  // Screen 3: Edit/Justify Modal (shown as dialog)
  const EditJustifyModal = () => (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Bill with Justification</DialogTitle>
          <DialogDescription>
            Bill No: {selectedBill?.billNo} | {selectedBill?.buyerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-amber-500 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900 text-sm">
              All changes require 2FA authorization and justification
            </AlertDescription>
          </Alert>

          {selectedBill?.status === 'Confirmed' ? (
            <Alert className="border-red-500 bg-red-50">
              <Lock className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Locked:</strong> This bill is confirmed and cannot be edited (Blockchain Appended)
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    defaultValue={selectedBill?.amount}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Payable (₹)</Label>
                  <Input
                    type="number"
                    defaultValue={selectedBill?.totalPayable}
                    className="h-12"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Justification Reason *</Label>
                <Select defaultValue="quality">
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality Mismatch</SelectItem>
                    <SelectItem value="agreement">Agreement Change</SelectItem>
                    <SelectItem value="measurement">Measurement Error</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <Label>Detailed Notes *</Label>
                <Textarea
                  placeholder="Enter detailed justification for this change..."
                  className="min-h-24 pr-12"
                />
                <VoiceButton field="justifyNotes" />
              </div>

              {/* Warning if repeat */}
              {selectedBill && selectedBill.justificationLog.length >= 3 && (
                <Alert className="border-red-500 bg-red-50 animate-in fade-in-0">
                  <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                  <AlertDescription className="text-red-900">
                    <strong>Warning:</strong> Pattern Detected - {selectedBill.justificationLog.length} changes this month
                    <br />
                    <strong>Grok Insight:</strong> Rating -0.5 stars | Precaution advised for next transaction
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="h-12 bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A] font-bold"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowWarning(true);
                    setTimeout(() => {
                      setShowWarning(false);
                      setCurrentScreen(4);
                    }, 3000);
                  }}
                >
                  Save with 2FA
                  <Shield className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Screen 4: Waiting for Buyer Auth
  const Screen4 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
        Waiting for Buyer Authorization
      </h2>

      <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-orange-500 text-white animate-pulse h-10 px-4">
              Waiting Authorization
            </Badge>
            <div className="text-right">
              <p className="text-sm text-slate-600">Due Date</p>
              <p className="text-2xl font-bold text-orange-600">{selectedBill?.dueDate}</p>
              <p className="text-xs text-slate-600 mt-1">{selectedBill?.daysPastDue} days past</p>
            </div>
          </div>

          <Progress value={selectedBill ? (selectedBill.daysPastDue / 30) * 100 : 0} className="h-2" />

          <Alert className={`border-${selectedBill && selectedBill.daysPastDue >= 7 ? 'red' : 'orange'}-500 bg-${selectedBill && selectedBill.daysPastDue >= 7 ? 'red' : 'orange'}-50`}>
            <Clock className={`h-4 w-4 text-${selectedBill && selectedBill.daysPastDue >= 7 ? 'red' : 'orange'}-600`} />
            <AlertDescription className={`text-${selectedBill && selectedBill.daysPastDue >= 7 ? 'red' : 'orange'}-900 text-sm`}>
              <strong>Day {selectedBill?.daysPastDue} Alert:</strong> {selectedBill && selectedBill.daysPastDue >= 7 ? 'Escalation required - Send reminder' : 'Pre-due notification sent'}
            </AlertDescription>
          </Alert>

          {/* Bill Review */}
          <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Bill Review Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Bill No</p>
                <p className="text-slate-900 font-bold">{selectedBill?.billNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Buyer</p>
                <p className="text-slate-900">{selectedBill?.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Volume</p>
                <p className="text-slate-900">{selectedBill?.volumeUnits} {selectedBill?.volumeMeasurement}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-green-600 font-bold">₹{selectedBill?.totalPayable.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Buyer Class */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Buyer Class (Confidential)</Label>
            <Select defaultValue="stationary">
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stationary">Stationary</SelectItem>
                <SelectItem value="non-local">Non-Local</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="third-party">3rd Party</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Due Date Type</Label>
            <Select defaultValue={selectedBill?.dueType || 'Net-30'}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regulatory">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    Regulatory (15 days)
                  </div>
                </SelectItem>
                <SelectItem value="Association">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Association (30 days)
                  </div>
                </SelectItem>
                <SelectItem value="Agreed">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Mutually Agreed
                  </div>
                </SelectItem>
                <SelectItem value="Net-30">Net-30</SelectItem>
                <SelectItem value="Net-60">Net-60</SelectItem>
                <SelectItem value="Net-90">Net-90</SelectItem>
                <SelectItem value="COD">COD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grok Insight */}
          <Alert className="border-blue-500 bg-blue-50">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              <strong>Grok Insight:</strong> {selectedBill?.aiInsights}
              <br />
              <strong>Suggestion:</strong> Extend to Net-45? Risk +2% based on historical data
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-blue-500 text-blue-600"
            >
              Resend 2FA OTP
            </Button>
            <Button 
              className="h-12 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setCurrentScreen(5)}
            >
              Proceed to Approval
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 5: Bill Approval
  const Screen5 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        Bill Approval & Authorization
      </h2>

      <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-base">Final Bill Review & Approval</CardTitle>
          <CardDescription>
            Verify all details before confirming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Complete Bill Table */}
          <div className="space-y-2 p-4 bg-white rounded-lg border border-green-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Complete Bill Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Serial No</p>
                <p className="text-slate-900 font-bold">{selectedBill?.serialNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Bill No</p>
                <p className="text-slate-900 font-bold">{selectedBill?.billNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-slate-900">{selectedBill?.date}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Buyer</p>
                <p className="text-slate-900 font-bold">{selectedBill?.buyerName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Brands ({selectedBill?.buyerBrands.length})</p>
                <p className="text-slate-900">{selectedBill?.buyerBrands.join(', ')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-slate-900">{selectedBill?.address}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contact</p>
                <p className="text-slate-900">{selectedBill?.authorizedContacts[0].mobile}</p>
                <p className="text-xs text-slate-600">{selectedBill?.authorizedContacts[0].email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Payment</p>
                <p className="text-slate-900">{selectedBill?.debitMethod}</p>
                <p className="text-xs text-slate-600">{selectedBill?.debitRef}</p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 p-4 bg-white rounded-lg border border-green-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Financial Breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Volume: {selectedBill?.volumeUnits} {selectedBill?.volumeMeasurement} × ₹{selectedBill?.unitPrice}</span>
              <span className="font-bold">₹{selectedBill?.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Packaging: {selectedBill?.packagingQty} {selectedBill?.packagingMaterial} × ₹{selectedBill?.packagingRate}</span>
              <span className="font-bold">₹{selectedBill?.packagingAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax (1%)</span>
              <span className="font-bold">₹{selectedBill?.taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-2">
              <span className="text-slate-900 font-bold">Total Payable</span>
              <span className="text-green-600 font-bold text-xl">₹{selectedBill?.totalPayable.toLocaleString()}</span>
            </div>
          </div>

          {/* 2FA OTP */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Label className="text-sm font-bold text-blue-900">2FA Authorization Required</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button variant="link" className="w-full text-blue-600" size="sm">
              Resend OTP
            </Button>
          </div>

          {/* Token Reward */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border-2 border-amber-400">
            <Zap className="w-8 h-8 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 font-bold">Tradie Token Reward</p>
              <p className="text-xs text-amber-700">+10 tokens on bill approval</p>
            </div>
            <Badge className="bg-amber-600 text-white text-lg px-4 py-2">+10</Badge>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-red-500 text-red-600 hover:bg-red-50"
            >
              Reject & Cascade Alert
            </Button>
            <Button 
              className="h-12 bg-[#27AE60] hover:bg-[#27AE60]/90 text-white font-bold"
              onClick={() => {
                setShowAnimation(true);
                setTokens(tokens + 10);
                setTimeout(() => {
                  setShowAnimation(false);
                  setCurrentScreen(6);
                }, 2000);
              }}
            >
              Approve & Append
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Animation */}
      {showAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-300">
          <Card className="w-[90%] max-w-sm">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto animate-in zoom-in-0 duration-500" />
              <h3 className="text-slate-900">Bill Approved!</h3>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
                <span className="text-2xl font-bold text-amber-600 animate-in zoom-in-0 duration-500">+10 TRADIE</span>
              </div>
              <p className="text-sm text-slate-600">Appending to confirmed ledger...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Screen 6: Confirmed Append & Insights
  const Screen6 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900 flex items-center gap-2">
          <Lock className="w-6 h-6 text-green-500" />
          Confirmed & Synced
        </h2>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="w-4 h-4" />
          View Blockchain QR
        </Button>
      </div>

      <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-[#27AE60] text-white h-10 px-4 gap-2">
              <Lock className="w-4 h-4" />
              Confirmed & Immutable
            </Badge>
            <Badge className="bg-purple-600 text-white h-10 px-4 gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Blockchain Appended
            </Badge>
          </div>

          {/* Blockchain Info */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
            <div className="flex items-start gap-3">
              <Shield className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-sm text-purple-900 font-bold">Polygon Blockchain Verification</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-700">TX Hash:</span>
                    <span className="text-purple-900 font-mono">0x7f3a...c9d2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Network:</span>
                    <span className="text-purple-900">Polygon Mumbai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Status:</span>
                    <Badge className="bg-green-600 text-white text-xs">Immutable</Badge>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-xs text-purple-600" size="sm">
                    View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              <QrCode className="w-16 h-16 text-purple-600" />
            </div>
          </div>

          {/* Immutable Ledger Table */}
          <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-slate-500" />
              Immutable Ledger Record
            </h3>
            <Alert className="border-slate-300 bg-slate-50">
              <Info className="h-4 w-4 text-slate-600" />
              <AlertDescription className="text-slate-700 text-xs">
                All fields are now locked and cannot be modified. Changes require new bill entry.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-3 text-sm opacity-75">
              {[
                ['Serial No', selectedBill?.serialNo],
                ['Bill No', selectedBill?.billNo],
                ['Buyer', selectedBill?.buyerName],
                ['Volume', `${selectedBill?.volumeUnits} ${selectedBill?.volumeMeasurement}`],
                ['Amount', `₹${selectedBill?.amount.toLocaleString()}`],
                ['Packaging', `₹${selectedBill?.packagingAmount}`],
                ['Tax (1%)', `₹${selectedBill?.taxAmount.toFixed(2)}`],
                ['Total', `₹${selectedBill?.totalPayable.toLocaleString()}`],
              ].map(([label, value], i) => (
                <div key={i} className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-slate-900 font-bold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yard Ledger Sync */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Yard Ledger Auto-Sync Complete
            </h3>
            <div className="space-y-2 text-xs">
              {[
                ['Tax Amount (1%)', `₹${selectedBill?.taxAmount.toFixed(2)}`, 'Synced'],
                ['Agent Commission (1%)', `₹${((selectedBill?.totalPayable || 0) * 0.01).toFixed(2)}`, 'Synced'],
                ['Bank Advance', 'Reflected', 'Updated'],
                ['Pending Balance', '₹0', 'Cleared'],
              ].map(([label, value, status], i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-slate-600">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-bold">{value}</span>
                    <Badge className="bg-green-500 text-white text-xs">{status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grok Insights Dashboard */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Grok AI Insights & Recovery Analytics
            </h3>
            <Alert className="border-green-500 bg-green-50">
              <Brain className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>Transaction Secure:</strong> Buyer X has 92% recovery rate
                <br />
                <strong>Recommendation:</strong> Standard terms (Net-30) approved for future transactions
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-xs text-slate-600">Recovery Rate</p>
              </div>
              <div className="p-3 bg-white rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">7 days</p>
                <p className="text-xs text-slate-600">Avg Payment Time</p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="w-3 h-3" />
              CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="w-3 h-3" />
              Audit Log
            </Button>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => setCurrentScreen(2)}
            >
              View All Bills
            </Button>
            <Button 
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setCurrentScreen(1)}
            >
              New Bill Entry
              <Plus className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Warning Popup
  const WarningPopup = () => (
    showWarning && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in-0">
        <Card className="border-4 border-red-500 bg-gradient-to-br from-red-50 to-pink-50 max-w-md w-full animate-in zoom-in-95 duration-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
              Rating & Pattern Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-red-500 bg-red-100">
              <Brain className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900 text-sm">
                <strong>Grok Pattern Detection:</strong> Multiple changes detected (3+ this month)
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-amber-300">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
                <Star className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-bold">Rating Impact</p>
                <p className="text-xs text-slate-600">4.5 → 4.0 (-0.5 stars)</p>
              </div>
            </div>

            <Alert className="border-purple-500 bg-purple-50">
              <Brain className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 text-sm">
                <strong>Precaution Advised:</strong> Assess buyer history before next transaction
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  );

  const screens = {
    1: <Screen1 />,
    2: <Screen2 />,
    3: null, // Modal
    4: <Screen4 />,
    5: <Screen5 />,
    6: <Screen6 />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Container */}
      <div className="max-w-[375px] mx-auto bg-white min-h-screen shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF] p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                TRADIE v1
              </h1>
              <p className="text-xs text-slate-600">Commission Agent DB</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg shadow-lg ${
              showAnimation ? 'animate-pulse' : ''
            }`}>
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{tokens}</span>
            </div>
          </div>

          {/* Screen Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 4, 5, 6].map((screen) => (
              <button
                key={screen}
                onClick={() => setCurrentScreen(screen as Screen)}
                className={`min-w-[40px] h-10 rounded-lg font-bold transition-all text-sm ${
                  currentScreen === screen
                    ? 'bg-[#F4D03F] text-[#4A4A4A] scale-110 shadow-lg'
                    : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {screen}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {screens[currentScreen]}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 p-4 text-center">
          <p className="text-white text-xs">
            Screen {currentScreen}/6 • Excel-View • 2FA • Blockchain
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Audited: Immutable • AI Insights • Multi-Country Payments
          </p>
        </div>
      </div>

      {/* Modals */}
      {EditJustifyModal()}
      {WarningPopup()}
    </div>
  );
}
