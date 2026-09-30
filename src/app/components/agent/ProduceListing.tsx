import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingDown, AlertCircle, Warehouse } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Alert, AlertDescription } from '../ui/alert';

interface ProduceListingProps {
  onNavigate: (screen: string) => void;
}

export function ProduceListing({ onNavigate }: ProduceListingProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [basePrice, setBasePrice] = useState('2500');
  const [stopLoss, setStopLoss] = useState('2200');
  const [allowStorage, setAllowStorage] = useState(false);

  const priceData = [
    { day: 'Mon', market: 2450, stopLoss: 2200 },
    { day: 'Tue', market: 2480, stopLoss: 2200 },
    { day: 'Wed', market: 2520, stopLoss: 2200 },
    { day: 'Thu', market: 2500, stopLoss: 2200 },
    { day: 'Fri', market: 2540, stopLoss: 2200 },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Produce Listing & Stop-Loss</h2>
        <p className="text-sm text-slate-600">List produce for auction with price protection</p>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        {/* Listing Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Create Produce Listing</CardTitle>
            <CardDescription>Enter commodity details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity *</Label>
              <Select>
                <SelectTrigger id="commodity">
                  <SelectValue placeholder="Select commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="pulses">Pulses</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variety">Variety</Label>
                <Input id="variety" placeholder="e.g., Durum" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Grade A</SelectItem>
                    <SelectItem value="b">Grade B</SelectItem>
                    <SelectItem value="c">Grade C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input id="quantity" type="number" placeholder="5000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹/qtl) *</Label>
              <Input 
                id="basePrice" 
                type="number" 
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop-Loss Price (₹/qtl) *</Label>
              <Input 
                id="stopLoss" 
                type="number" 
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Buyers cannot bid below this price
              </p>
            </div>

            <Alert className="border-amber-500 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-xs">
                Current market price: ₹2,540/qtl
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <Label htmlFor="storage" className="cursor-pointer">Allow Storage Transfer if Unsold</Label>
                <p className="text-xs text-slate-500">Transfer to storage facility</p>
              </div>
              <Switch 
                id="storage" 
                checked={allowStorage}
                onCheckedChange={setAllowStorage}
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600">
              List for Auction
            </Button>
          </CardContent>
        </Card>

        {/* Price Trend Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              Price vs Stop-Loss Trend
            </CardTitle>
            <CardDescription>Last 5 days market analysis</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="market" stroke="#D4AF37" strokeWidth={2} name="Market Price" />
                <Line type="monotone" dataKey="stopLoss" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Stop-Loss" />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-900">Price Protection Active</p>
                </div>
                <p className="text-xs text-green-700">
                  Your stop-loss is ₹340 below current market price
                </p>
              </div>

              {allowStorage && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Warehouse className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900">Storage Transfer Enabled</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    Produce will be transferred to storage if unsold
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Listings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Your Active Listings</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {[
              { lot: 'WH-045', commodity: 'Wheat', qty: '5000 kg', base: '₹2,500', stopLoss: '₹2,200', currentBid: '₹2,650', bids: 8 },
              { lot: 'RC-023', commodity: 'Rice', qty: '3500 kg', base: '₹3,200', stopLoss: '₹2,900', currentBid: '₹3,150', bids: 5 },
            ].map((listing, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-slate-500" />
                      <h4 className="text-sm text-slate-900">Lot #{listing.lot}</h4>
                      <Badge className="bg-green-500">{listing.bids} bids</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{listing.commodity} • {listing.qty}</p>
                  </div>
                  <Button variant="outline" size="sm">View Auction</Button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">Base Price</p>
                    <p className="text-slate-900">{listing.base}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Stop-Loss</p>
                    <p className="text-red-600">{listing.stopLoss}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Current Bid</p>
                    <p className="text-green-600">{listing.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <Badge className="bg-blue-500">Live</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
