import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, Building2, MapPin, Phone, CreditCard, Package, 
  Calculator, Calendar, FileText, Plus, Trash2, Save, AlertCircle,
  Wallet, Banknote, CreditCard as CardIcon, Smartphone, Clock, Brain
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface BuyerFormProps {
  userRole: string;
}

export function BuyerForm({ userRole }: BuyerFormProps) {
  const [contacts, setContacts] = useState([{ id: 1, name: '', phone: '', designation: '' }]);
  const [selectedCountry, setSelectedCountry] = useState('india');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [packagingType, setPackagingType] = useState('');
  const [packagingCount, setPackagingCount] = useState('');
  const [packagingPrice, setPackagingPrice] = useState('');
  const [dueDateLogic, setDueDateLogic] = useState('regulatory');
  const [customDays, setCustomDays] = useState('');

  const canCreate = ['admin', 'manager', 'operator'].includes(userRole);

  if (!canCreate) {
    return (
      <Alert className="border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          You don't have permission to create new buyer entries. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  const brands = ['Brand A - Premium', 'Brand B - Standard', 'Brand C - Economy', 'Generic'];

  const paymentMethodsByCountry = {
    india: [
      { value: 'upi', label: 'UPI', icon: Smartphone },
      { value: 'neft', label: 'Bank Wire (NEFT/RTGS)', icon: Banknote },
      { value: 'cheque', label: 'Cheque', icon: FileText },
      { value: 'imps', label: 'IMPS', icon: Smartphone },
      { value: 'paytm', label: 'Paytm Wallet', icon: Wallet },
      { value: 'phonepe', label: 'PhonePe', icon: Smartphone },
      { value: 'gpay', label: 'Google Pay', icon: Smartphone },
      { value: 'cash', label: 'Cash', icon: Wallet },
    ],
    usa: [
      { value: 'ach', label: 'Bank Wire (ACH)', icon: Banknote },
      { value: 'cheque', label: 'Cheque', icon: FileText },
      { value: 'credit', label: 'Credit Card', icon: CardIcon },
      { value: 'debit', label: 'Debit Card', icon: CardIcon },
      { value: 'paypal', label: 'PayPal', icon: Wallet },
      { value: 'venmo', label: 'Venmo', icon: Smartphone },
      { value: 'zelle', label: 'Zelle', icon: Smartphone },
    ],
    uk: [
      { value: 'bacs', label: 'Bank Transfer (BACS)', icon: Banknote },
      { value: 'cheque', label: 'Cheque', icon: FileText },
      { value: 'credit', label: 'Credit Card', icon: CardIcon },
      { value: 'debit', label: 'Debit Card', icon: CardIcon },
      { value: 'paypal', label: 'PayPal', icon: Wallet },
    ],
    international: [
      { value: 'swift', label: 'International Wire (SWIFT)', icon: Banknote },
      { value: 'credit', label: 'Credit Card', icon: CardIcon },
      { value: 'paypal', label: 'PayPal', icon: Wallet },
    ],
  };

  const commodityConfig = {
    wheat: { 
      units: ['Bags', 'Quintal', 'Tons', 'Kgs'], 
      packaging: [
        { value: 'jute', label: 'Jute Bags (50kg)', type: 'fixed' },
        { value: 'pp', label: 'PP Bags (25kg)', type: 'fixed' },
        { value: 'gunny', label: 'Gunny Bags (100kg)', type: 'fixed' },
      ]
    },
    rice: { 
      units: ['Bags', 'Quintal', 'Tons', 'Kgs'], 
      packaging: [
        { value: 'jute', label: 'Jute Bags (50kg)', type: 'fixed' },
        { value: 'pp', label: 'PP Bags (25kg)', type: 'recommended' },
      ]
    },
    pulses: { 
      units: ['Bags', 'Quintal', 'Tons', 'Kgs'], 
      packaging: [
        { value: 'jute', label: 'Jute Bags', type: 'dynamic' },
        { value: 'pp', label: 'PP Bags', type: 'recommended' },
      ]
    },
    spices: { 
      units: ['Boxes', 'Kgs', 'Tons'], 
      packaging: [
        { value: 'cardboard', label: 'Cardboard Boxes', type: 'recommended' },
        { value: 'gunny', label: 'Gunny Bags', type: 'fixed' },
      ]
    },
  };

  const dueDateOptions = [
    { value: 'regulatory', label: 'Regulatory (7 days)', days: 7 },
    { value: 'association', label: 'Association Rule (15 days)', days: 15 },
    { value: 'mutual', label: 'Mutual Agreement (30 days)', days: 30 },
    { value: 'custom', label: 'Custom', days: null },
  ];

  const addContact = () => {
    setContacts([...contacts, { id: Date.now(), name: '', phone: '', designation: '' }]);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const calculateTotal = () => {
    const productAmount = parseFloat(quantity || '0') * parseFloat(pricePerUnit || '0');
    const packagingAmount = parseFloat(packagingCount || '0') * parseFloat(packagingPrice || '0');
    return productAmount + packagingAmount;
  };

  const calculateDueDate = () => {
    const option = dueDateOptions.find(d => d.value === dueDateLogic);
    if (dueDateLogic === 'custom' && customDays) {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(customDays));
      return date.toISOString().split('T')[0];
    } else if (option?.days) {
      const date = new Date();
      date.setDate(date.getDate() + option.days);
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <Alert className="border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          This form auto-creates a buyer record after weighing completion. Status will be <strong>"Waiting for Buyer Authorization"</strong> until 2FA approval is completed.
        </AlertDescription>
      </Alert>

      <form className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Buyer and transaction details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNo">Serial Number</Label>
                <Input id="serialNo" placeholder="Auto-generated: TRD-2025-XXX" disabled className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" defaultValue="2025-10-27" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="buyerName" placeholder="Enter buyer full name" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand / Company Selector *</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger id="brand">
                    <Building2 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="company" placeholder="Enter company name" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea id="address" placeholder="Enter complete address including street, city, state, postal code" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GST / Tax Number</Label>
                <Input id="gst" placeholder="Enter GST/Tax number" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authorized Contacts */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Authorized Contacts
                </CardTitle>
                <CardDescription>Add multiple contact persons</CardDescription>
              </div>
              <Button type="button" onClick={addContact} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {contacts.map((contact, index) => (
              <div key={contact.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Contact {index + 1}</Badge>
                  {contacts.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`contact-name-${contact.id}`}>Name *</Label>
                    <Input id={`contact-name-${contact.id}`} placeholder="Contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-phone-${contact.id}`}>Phone *</Label>
                    <Input id={`contact-phone-${contact.id}`} type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-designation-${contact.id}`}>Designation</Label>
                    <Input id={`contact-designation-${contact.id}`} placeholder="e.g., Manager" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commodity & Measurement */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Commodity & Measurement
            </CardTitle>
            <CardDescription>Commodity-specific volume and packaging details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity Type *</Label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger id="commodity">
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variety">Variety / Grade</Label>
                <Input id="variety" placeholder="e.g., Durum, Basmati" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="0" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCommodity && commodityConfig[selectedCommodity as keyof typeof commodityConfig]?.units.map((u) => (
                      <SelectItem key={u} value={u.toLowerCase()}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="override">Override Weight (kg)</Label>
                <Input id="override" type="number" placeholder="Manual override" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="packaging">Packaging Material *</Label>
              <Select value={packagingType} onValueChange={setPackagingType}>
                <SelectTrigger id="packaging">
                  <SelectValue placeholder="Select packaging" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCommodity && commodityConfig[selectedCommodity as keyof typeof commodityConfig]?.packaging.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {pkg.type === 'recommended' && <Brain className="w-3 h-3 mr-1 inline" />}
                        {pkg.type}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packagingCount">Packaging Count</Label>
                <Input 
                  id="packagingCount" 
                  type="number" 
                  placeholder="Number of bags/boxes"
                  value={packagingCount}
                  onChange={(e) => setPackagingCount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingPrice">Price per Unit (₹)</Label>
                <Input 
                  id="packagingPrice" 
                  type="number" 
                  placeholder="0"
                  value={packagingPrice}
                  onChange={(e) => setPackagingPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              Payment & Financial Details
            </CardTitle>
            <CardDescription>Country-specific payment methods and calculations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit (₹) *</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="pricePerUnit" 
                    type="number" 
                    placeholder="0.00"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Product Amount (₹)</Label>
                <Input 
                  id="amount" 
                  value={`₹${(parseFloat(quantity || '0') * parseFloat(pricePerUnit || '0')).toLocaleString()}`}
                  disabled 
                  className="bg-green-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packagingTotal">Packaging Amount (₹)</Label>
                <Input 
                  id="packagingTotal" 
                  value={`₹${(parseFloat(packagingCount || '0') * parseFloat(packagingPrice || '0')).toLocaleString()}`}
                  disabled 
                  className="bg-blue-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPayable">Total Payable (₹)</Label>
                <Input 
                  id="totalPayable" 
                  value={`₹${calculateTotal().toLocaleString()}`}
                  disabled 
                  className="bg-amber-50"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Payment Method * (Country: {selectedCountry.toUpperCase()})</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {paymentMethodsByCountry[selectedCountry as keyof typeof paymentMethodsByCountry]?.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.value}
                      type="button"
                      variant="outline"
                      className="flex flex-col gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <Icon className="w-5 h-5 text-slate-600" />
                      <span className="text-xs">{method.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDetails">Payment Account Details</Label>
              <Textarea id="paymentDetails" placeholder="Enter account number, UPI ID, or payment details" rows={2} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDateLogic">Payment Due Date Logic *</Label>
                <Select value={dueDateLogic} onValueChange={setDueDateLogic}>
                  <SelectTrigger id="dueDateLogic">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dueDateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {dueDateLogic === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customDays">Custom Days</Label>
                  <Input 
                    id="customDays" 
                    type="number" 
                    placeholder="Enter days"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="dueDate">Calculated Due Date</Label>
                <Input 
                  id="dueDate" 
                  value={calculateDueDate()}
                  disabled 
                  className="bg-slate-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auditor Notes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600" />
              Auditor Notes & Remarks
            </CardTitle>
            <CardDescription>Internal notes for audit trail</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auditorNotes">Notes</Label>
              <Textarea id="auditorNotes" placeholder="Enter any special notes, observations, or remarks for audit purposes..." rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <Button type="button" variant="outline" size="lg">
            Save as Draft
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Save className="w-4 h-4" />
            Submit for Authorization
          </Button>
        </div>
      </form>
    </div>
  );
}
