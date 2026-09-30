import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Alert, AlertDescription } from '../ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BuyerVerificationProps {
  onNavigate: (screen: string) => void;
}

export function BuyerVerification({ onNavigate }: BuyerVerificationProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const buyers = [
    { name: 'Sharma Traders', visited: true, bidsPlaced: 12, currentBid: '₹2,650', special: false },
    { name: 'Kumar Exports', visited: false, bidsPlaced: 0, currentBid: '-', special: false },
    { name: 'Patel Foods', visited: true, bidsPlaced: 8, currentBid: '₹2,620', special: true },
  ];

  const bidData = [
    { time: '10:00', bid: 2500 },
    { time: '10:30', bid: 2550 },
    { time: '11:00', bid: 2600 },
    { time: '11:30', bid: 2620 },
    { time: '12:00', bid: 2650 },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Buyer Verification & Bidding</h2>
        <p className="text-sm text-slate-600">Manage buyer verification and track real-time bids</p>
      </div>

      <Alert className="border-blue-500 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Buyers must verify site visit via OTP before placing bids
        </AlertDescription>
      </Alert>

      {/* Buyer List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Registered Buyers - Lot #WH-045</CardTitle>
          <CardDescription>Wheat, 5000 kg</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {buyers.map((buyer, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm text-slate-900">{buyer.name}</h4>
                  {buyer.visited ? (
                    <Badge className="bg-green-500 gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Visited ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500 gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Visit
                    </Badge>
                  )}
                  {buyer.special && (
                    <Badge variant="outline" className="border-purple-500 text-purple-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin Override
                    </Badge>
                  )}
                </div>
                {!buyer.visited && (
                  <Button size="sm" variant="outline">Send OTP</Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Bids Placed</p>
                  <p className="text-slate-900">{buyer.bidsPlaced}</p>
                </div>
                <div>
                  <p className="text-slate-500">Current Bid</p>
                  <p className={buyer.currentBid !== '-' ? 'text-green-600' : 'text-slate-400'}>{buyer.currentBid}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Auction View */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Live Auction</CardTitle>
              <Badge className="bg-red-500 animate-pulse">18h left</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <p className="text-sm text-green-700 mb-1">Highest Bid</p>
              <p className="text-green-900">₹2,650/qtl</p>
              <p className="text-xs text-green-600 mt-1">by Sharma Traders</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600">Quick Bid</p>
              <div className="flex gap-2">
                <Input placeholder="Enter bid amount" />
                <Button className="bg-gradient-to-r from-[#D4AF37] to-amber-600">Place Bid</Button>
              </div>
            </div>

            <Alert className="border-purple-500 bg-purple-50">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800 text-xs">
                <strong>AI Tip:</strong> Sharma Traders is offering higher price (8% above market) elsewhere
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Bid Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bidData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bid" stroke="#D4AF37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
