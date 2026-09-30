import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { 
  Plus, Search, User, MapPin, Leaf, DollarSign, 
  Shield, AlertTriangle, CheckCircle, Phone
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ProducerManagementProps {
  onNavigate: (screen: string) => void;
}

export function ProducerManagement({ onNavigate }: ProducerManagementProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const producers = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      village: 'Kheda',
      crops: ['Wheat', 'Rice'],
      creditEnabled: true,
      advance: 50000,
      riskScore: 25,
      status: 'active',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      mobile: '+91 87654 32109',
      village: 'Anand',
      crops: ['Pulses', 'Wheat'],
      creditEnabled: true,
      advance: 35000,
      riskScore: 15,
      status: 'active',
    },
    {
      id: '3',
      name: 'Amit Patel',
      mobile: '+91 76543 21098',
      village: 'Nadiad',
      crops: ['Cotton'],
      creditEnabled: false,
      advance: 0,
      riskScore: 45,
      status: 'warning',
    },
  ];

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-500">Low Risk</Badge>;
    if (score < 60) return <Badge className="bg-amber-500">Medium Risk</Badge>;
    return <Badge className="bg-red-500">High Risk</Badge>;
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Producer Management</h2>
          <p className="text-sm text-slate-600">Manage linked producers and credit</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-[#D4AF37] to-amber-600">
              <Plus className="w-4 h-4" />
              {!isMobile && 'Add Producer'}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? 'w-[95vw]' : 'max-w-2xl'}`}>
            <DialogHeader>
              <DialogTitle>Add New Producer</DialogTitle>
              <DialogDescription>
                {otpStep ? 'Verify producer mobile number' : 'Enter producer details'}
              </DialogDescription>
            </DialogHeader>

            {!otpStep ? (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Producer Name *</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <div className="flex gap-2">
                      <Input id="mobile" type="tel" placeholder="+91 98765 43210" />
                      <Button variant="outline">Verify</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village</Label>
                    <Input id="village" placeholder="Enter village name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop">Primary Crop</Label>
                    <Select>
                      <SelectTrigger id="crop">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="pulses">Pulses</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="credit">Enable Credit</Label>
                      <input type="checkbox" id="credit" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="advance">Advance Amount (if any)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                      <Input id="advance" type="number" placeholder="0" className="pl-8" />
                    </div>
                  </div>
                </div>

                <Alert className="border-purple-500 bg-purple-50">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>AI Risk Score:</strong> Calculating based on credit history and market data...
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOtpStep(true)} className="bg-gradient-to-r from-[#D4AF37] to-amber-600">
                    Send OTP
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <Alert className="border-blue-500 bg-blue-50">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    OTP sent to +91 98765 43210
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Enter 6-Digit OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="link" onClick={() => setOtpStep(false)}>
                    ← Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="link" className="text-blue-600">
                      Resend OTP
                    </Button>
                    <Button 
                      disabled={otp.length !== 6}
                      className="bg-gradient-to-r from-[#D4AF37] to-amber-600"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setOtpStep(false);
                        setOtp('');
                      }}
                    >
                      Verify & Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search producers by name, mobile, or village..."
          className="pl-10"
        />
      </div>

      {/* Producers List */}
      <div className="space-y-4">
        {producers.map((producer) => (
          <Card key={producer.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className={`${isMobile ? 'p-4' : 'p-5'}`}>
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} justify-between gap-4`}>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900">{producer.name}</h3>
                        {producer.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {producer.mobile}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {producer.village}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {producer.crops.map((crop, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1">
                        <Leaf className="w-3 h-3" />
                        {crop}
                      </Badge>
                    ))}
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
                    <div>
                      <p className="text-xs text-slate-500">Credit Status</p>
                      <Badge className={producer.creditEnabled ? 'bg-green-500' : 'bg-slate-400'}>
                        {producer.creditEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Advance Given</p>
                      <p className="text-sm text-slate-900">₹{producer.advance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">AI Risk Score</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${getRiskColor(producer.riskScore)}`}>
                          {producer.riskScore}%
                        </p>
                        {getRiskBadge(producer.riskScore)}
                      </div>
                    </div>
                  </div>

                  {producer.riskScore > 40 && (
                    <Alert className="border-amber-500 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-xs">
                        <strong>Duplicate Advance Alert:</strong> Similar advance found in system
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className={`flex ${isMobile ? 'w-full' : 'flex-col'} gap-2`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
