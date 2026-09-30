import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FlaskConical, Upload, QrCode, Shield, CheckCircle2 } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Alert, AlertDescription } from '../ui/alert';

interface SamplingVerificationProps {
  onNavigate: (screen: string) => void;
}

export function SamplingVerification({ onNavigate }: SamplingVerificationProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const samples = [
    { id: '1', lot: 'WH-045', type: 'AI-Recommended', status: 'pending', buyer: 'Sharma Traders', slot: '2:00 PM' },
    { id: '2', lot: 'RC-023', type: 'Random', status: 'verified', buyer: 'Kumar Exports', slot: '3:30 PM' },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Sampling & Quality Verification</h2>
        <p className="text-sm text-slate-600">Manage quality checks and verification</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Schedule New Sampling</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="lot">Select Lot *</Label>
              <Select>
                <SelectTrigger id="lot">
                  <SelectValue placeholder="Choose lot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wh045">Lot #WH-045 - Wheat</SelectItem>
                  <SelectItem value="rc023">Lot #RC-023 - Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Sampling Type *</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="representative">Representative</SelectItem>
                  <SelectItem value="ai">AI-Recommended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot">Time Slot *</Label>
              <Input id="slot" type="time" />
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600">
            Schedule Sampling
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {samples.map((sample) => (
            <Card key={sample.id} className={`border-l-4 ${sample.status === 'verified' ? 'border-l-green-500' : 'border-l-amber-500'}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FlaskConical className="w-4 h-4 text-slate-500" />
                        <h4 className="text-sm text-slate-900">Lot #{sample.lot}</h4>
                        <Badge className={sample.status === 'verified' ? 'bg-green-500' : 'bg-amber-500'}>
                          {sample.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{sample.buyer} • {sample.slot}</p>
                    </div>
                  </div>

                  {sample.status === 'pending' ? (
                    <div className="space-y-2">
                      <Alert className="border-blue-500 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-xs">
                          Requires dual OTP verification from Buyer & Agent
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Report
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-[#D4AF37] to-amber-600">
                          Verify OTP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-xs text-green-800">Verified & Blockchain Recorded</p>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                          <QrCode className="w-3 h-3" />
                          <span>QR: BLK-2025-{sample.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
