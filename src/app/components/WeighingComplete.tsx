import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Scale, CheckCircle2, AlertCircle, Plus, Trash2, Save, Shield,
  Building2, MapPin, Phone, Package, Calculator, Calendar, Mic, Brain
} from 'lucide-react';

interface WeighingCompleteProps {
  onComplete: (data: any) => void;
}

export function WeighingComplete({ onComplete }: WeighingCompleteProps) {
  const [contacts, setContacts] = useState([{ id: 1, name: '', mobile: '', email: '' }]);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [packagingMode, setPackagingMode] = useState<'fixed' | 'dynamic'>('fixed');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [packagingQty, setPackagingQty] = useState('');
  const [packagingRate, setPackagingRate] = useState('');

  const commodityMeasurements = {
    'wheat': { units: ['Quintal', '50kg Bag', 'Kg'], packaging: ['Jute Bag (₹5)', 'PP Bag (₹3)'] },
    'rice': { units: ['Quintal', '50kg Bag', 'Kg'], packaging: ['Jute Bag (₹5)', 'PP Bag (₹3)'] },
    'pulses': { units: ['Quintal', '50kg Bag', 'Kg'], packaging: ['Jute Bag (₹5)', 'PP Bag (₹3)'] },
    'spices': { units: ['Kg', '25kg Bag'], packaging: ['PP Bag (₹3)', 'Cardboard Box (₹8)'] },
    'mango': { units: ['Crate (20kg)', 'Box (10kg)', 'Nos'], packaging: ['Wooden Crate (₹15)', 'Plastic Crate (₹10)'] },
    'tomato': { units: ['Crate (15kg)', 'Box (10kg)', 'Kg'], packaging: ['Plastic Crate (₹10)'] },
    'coconut': { units: ['Nos', '100 Nos'], packaging: ['Gunny Bag (₹6)', 'Net Bag (₹4)'] },
    'mushroom': { units: ['Kg', 'Tray (5kg)'], packaging: ['Cardboard Box (₹8)', 'Plastic Tray (₹5)'] },
    'groundnut': { units: ['Quintal', '40kg Bag', 'Kg'], packaging: ['Gunny Bag (₹6)', 'PP Bag (₹3)'] },
  };

  const calculateAmount = () => {
    return parseFloat(quantity || '0') * parseFloat(unitPrice || '0');
  };

  const calculatePackaging = () => {
    if (packagingMode === 'fixed') {
      return parseFloat(packagingQty || '0') * parseFloat(packagingRate || '0');
    }
    return parseFloat(packagingQty || '0') * parseFloat(packagingRate || '0');
  };

  const calculateTotal = () => {
    const amount = calculateAmount();
    const packaging = calculatePackaging();
    const tax = (amount + packaging) * 0.01; // 1% tax
    return amount + packaging + tax;
  };

  const addContact = () => {
    setContacts([...contacts, { id: Date.now(), name: '', mobile: '', email: '' }]);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Scale className="w-8 h-8 text-blue-600" />
            Weighing Complete
          </h1>
          <p className="text-slate-600 mt-1">Lot: CHL-2025-001 • Auto-DB Entry</p>
        </div>
        <Badge className="bg-green-500 text-white gap-1">
          <CheckCircle2 className="w-4 h-4" />
          Weighing Done
        </Badge>
      </div>

      <Alert className="border-blue-500 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>AI Risk Assessment:</strong> Low Risk • Auto-creating buyer record with Pending Authorization status
        </AlertDescription>
      </Alert>

      {/* Auto-Fill Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle>Auto-Fill Buyer Details</CardTitle>
          <CardDescription>Complete the buyer record for authorization</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNo">Serial Number</Label>
              <Input id="serialNo" value="TRD-2025-B001" disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue="2025-10-27" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Timestamp</Label>
              <Input id="time" value={new Date().toLocaleTimeString()} disabled className="bg-slate-50" />
            </div>
          </div>

          <Separator />

          {/* Buyer Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <div className="relative">
                  <Input id="buyerName" placeholder="Enter buyer name" className="pr-10" />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-100 rounded">
                    <Mic className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand / Company *</Label>
                <Select>
                  <SelectTrigger id="brand" className="h-16">
                    <Building2 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select brand (multi-company)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jj-a">JJ&Co - Branch A</SelectItem>
                    <SelectItem value="jj-b">JJ&Co - Branch B</SelectItem>
                    <SelectItem value="kumar">Kumar Traders Ltd</SelectItem>
                    <SelectItem value="sharma">Sharma Exports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <div className="relative">
                <Textarea id="address" placeholder="Auto-filled from geo-location or manual entry" rows={2} className="pr-10" />
                <button className="absolute right-2 top-2 p-2 hover:bg-slate-100 rounded">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Authorized Contacts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Authorized Persons (Multi-Contact)</Label>
              <Button type="button" onClick={addContact} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </div>
            {contacts.map((contact, idx) => (
              <div key={contact.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">Contact {idx + 1}</Badge>
                  {contacts.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Commodity & Volume */}
          <div className="space-y-4">
            <Label>Commodity & Volume Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity *</Label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger id="commodity" className="h-16">
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat (Grains)</SelectItem>
                    <SelectItem value="rice">Rice (Grains)</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="mango">Mango (Fruits)</SelectItem>
                    <SelectItem value="tomato">Tomato (Vegetables)</SelectItem>
                    <SelectItem value="coconut">Coconut</SelectItem>
                    <SelectItem value="mushroom">Mushroom</SelectItem>
                    <SelectItem value="groundnut">Groundnut (Oilseeds)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Measurement Unit *</Label>
                <Select>
                  <SelectTrigger id="unit" className="h-16">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCommodity && commodityMeasurements[selectedCommodity as keyof typeof commodityMeasurements]?.units.map((unit) => (
                      <SelectItem key={unit} value={unit.toLowerCase()}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Packaging */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Packaging (One-Time Selection)</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={packagingMode === 'fixed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPackagingMode('fixed')}
                >
                  Fixed
                </Button>
                <Button 
                  type="button" 
                  variant={packagingMode === 'dynamic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPackagingMode('dynamic')}
                >
                  Dynamic
                </Button>
              </div>
            </div>

            {packagingMode === 'fixed' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Standard packaging" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCommodity && commodityMeasurements[selectedCommodity as keyof typeof commodityMeasurements]?.packaging.map((pkg) => (
                        <SelectItem key={pkg} value={pkg.toLowerCase()}>{pkg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    placeholder="10"
                    value={packagingQty}
                    onChange={(e) => setPackagingQty(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input 
                    value={`₹${calculatePackaging().toFixed(2)}`}
                    disabled 
                    className="bg-blue-50"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jute">Jute</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="pp">PP (Polypropylene)</SelectItem>
                      <SelectItem value="gunny">Gunny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    placeholder="10"
                    value={packagingQty}
                    onChange={(e) => setPackagingQty(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rate (₹)</Label>
                  <Input 
                    type="number" 
                    placeholder="5"
                    value={packagingRate}
                    onChange={(e) => setPackagingRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input 
                    value={`₹${calculatePackaging().toFixed(2)}`}
                    disabled 
                    className="bg-blue-50"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Amount Calculation */}
          <div className="space-y-4">
            <Label>Amount Calculation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="unitPrice" 
                    type="number" 
                    placeholder="22.00"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-100 rounded">
                    <Mic className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product Amount</Label>
                <Input 
                  value={`₹${calculateAmount().toFixed(2)}`}
                  disabled 
                  className="bg-green-50"
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-amber-700">Product Amount</p>
                  <p className="text-amber-900">₹{calculateAmount().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-amber-700">Packaging</p>
                  <p className="text-amber-900">₹{calculatePackaging().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-amber-700">Tax (1%)</p>
                  <p className="text-amber-900">₹{((calculateAmount() + calculatePackaging()) * 0.01).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-amber-700">Total Payable</p>
                  <p className="text-amber-900">₹{calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <Card className="border-l-4 border-l-amber-500 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-amber-500 text-white mb-2">Pending Authorization</Badge>
              <p className="text-sm text-slate-600">Record will be created with pending status until 2FA authorization</p>
            </div>
            <Alert className="border-green-500 bg-green-50 max-w-xs">
              <Brain className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-xs">
                <strong>AI Risk:</strong> Low
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <Button variant="outline" size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          Save Draft
        </Button>
        <Button 
          size="lg" 
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={() => onComplete({ status: 'pending' })}
        >
          <Shield className="w-4 h-4" />
          2FA Authorize Entry
        </Button>
      </div>
    </div>
  );
}
