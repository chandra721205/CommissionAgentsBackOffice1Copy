import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Scale, CheckCircle2, AlertTriangle, Brain } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Alert, AlertDescription } from '../ui/alert';

interface WeighmentResolutionProps {
  onNavigate: (screen: string) => void;
}

export function WeighmentResolution({ onNavigate }: WeighmentResolutionProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Weighment & Mismatch Resolution</h2>
        <p className="text-sm text-slate-600">Record weights and resolve discrepancies</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Record Weighment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Lot Information</Label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-900">Lot #WH-045</p>
                <p className="text-xs text-slate-600">Wheat • Sharma Traders</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="declared">Declared Weight (kg)</Label>
              <Input id="declared" value="5000" disabled className="bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual">Actual Weight (kg) *</Label>
              <Input id="actual" type="number" placeholder="Enter actual weight" />
            </div>
          </div>

          <Alert className="border-green-500 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              <strong>AI Summary:</strong> Deviation within tolerance 2.3%
            </AlertDescription>
          </Alert>

          <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600">
            Confirm with Dual OTP
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Recent Weighments</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {[
            { lot: 'WH-044', declared: 5000, actual: 4885, variance: -2.3, status: 'resolved' },
            { lot: 'RC-022', declared: 3500, actual: 3520, variance: +0.6, status: 'approved' },
          ].map((w, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-900">Lot #{w.lot}</h4>
                </div>
                <Badge className={w.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'}>
                  {w.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Declared</p>
                  <p className="text-slate-900">{w.declared} kg</p>
                </div>
                <div>
                  <p className="text-slate-500">Actual</p>
                  <p className="text-slate-900">{w.actual} kg</p>
                </div>
                <div>
                  <p className="text-slate-500">Variance</p>
                  <p className={w.variance > 0 ? 'text-green-600' : 'text-red-600'}>
                    {w.variance > 0 ? '+' : ''}{w.variance}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
