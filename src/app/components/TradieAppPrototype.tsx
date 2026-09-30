import React, { useState } from 'react';
import { 
  User, TrendingUp, Package, Scale, AlertTriangle, FileText, Warehouse, 
  Bell, BarChart3, Shield, DollarSign, Truck, Star, CheckCircle, XCircle,
  Mic, ChevronDown, QrCode, Globe, Home, Settings, LogOut, Camera,
  Upload, Download, Filter, Search, Plus, Edit, Trash2, Eye, Clock,
  Award, Target, ShoppingCart, Sparkles, Zap, Lock, Unlock, Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type UserRole = 'producer' | 'buyer' | 'agent' | 'admin' | null;
type Language = 'EN' | 'HI' | 'TE' | 'TM' | 'KN' | 'BN' | 'MR';
type Screen = string;

interface TokenWallet {
  balance: number;
  transactions: { type: string; amount: number; date: string }[];
}

const TradieAppPrototype = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [language, setLanguage] = useState<Language>('EN');
  const [tokenWallet, setTokenWallet] = useState<TokenWallet>({
    balance: 0,
    transactions: []
  });
  const [voiceActive, setVoiceActive] = useState<string | null>(null);
  const [showTokenBurst, setShowTokenBurst] = useState(false);

  // Sample data
  const [listings, setListings] = useState([
    { id: 'CHL-2025-001', commodity: 'Coconut West Coast Tall', quantity: 1000, price: 22, status: 'active', image: 'https://images.unsplash.com/photo-1589217157232-464b505b197f?w=400' },
    { id: 'CHL-2025-002', commodity: 'Mushroom Oyster', quantity: 500, price: 150, status: 'pending', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400' }
  ]);

  const [bills, setBills] = useState([
    {
      sno: 1,
      date: '2024-05-13',
      billNo: 'YT-7685',
      buyer: 'PSR',
      address: 'GGFFH',
      contact: '678785664',
      debit: 'IVDF-23145',
      units: 23,
      measurement: 'Quintal',
      unitPrice: 1200,
      amount: 27600,
      packing: 50,
      total: 27926,
      due: '2024-05-28',
      receipt: '2024-06-06',
      daysPast: 9,
      status: 'waiting' as const,
      aiInsight: 'Grok: 9 Days Past—Predict 75% Recovery if Notify Now'
    }
  ]);

  // Add tokens
  const addTokens = (amount: number, type: string) => {
    setTokenWallet(prev => ({
      balance: prev.balance + amount,
      transactions: [
        { type, amount, date: new Date().toISOString() },
        ...prev.transactions
      ]
    }));
    setShowTokenBurst(true);
    setTimeout(() => setShowTokenBurst(false), 2000);
  };

  // Voice input handler
  const handleVoiceInput = (fieldId: string) => {
    setVoiceActive(fieldId);
    setTimeout(() => setVoiceActive(null), 2000);
  };

  // Language flags
  const languageFlags: Record<Language, string> = {
    EN: '🇬🇧', HI: '🇮🇳', TE: '🇮🇳', TM: '🇮🇳', KN: '🇮🇳', BN: '🇮🇳', MR: '🇮🇳'
  };

  // Commodities dropdown (200+ options - sample)
  const commodities = [
    'Coconut West Coast Tall', 'Coconut East Coast Tall', 'Coconut Hybrid',
    'Mushroom Oyster', 'Mushroom Button', 'Mushroom Shiitake',
    'Rice Basmati', 'Rice IR-64', 'Rice Sona Masoori',
    'Wheat Hard', 'Wheat Soft', 'Wheat Durum',
    'Turmeric Finger', 'Turmeric Bulb', 'Turmeric Powder',
    'Cardamom Green', 'Cardamom Black',
    'Pepper Black', 'Pepper White',
    'Cashew W-320', 'Cashew W-240',
    // ... 180+ more options
  ];

  const measurements = {
    'Grains': ['Quintal', '50kg Bag', 'Kg', 'Metric Ton'],
    'Spices': ['25kg Bag', 'Kg', 'Gram'],
    'Fruits': ['Crate (20kg)', 'Box (10kg)', 'Nos'],
    'Coconut': ['Nos', '100 Nos', 'Kg'],
    'Mushroom': ['Kg', 'Tray (5kg)', 'Box (10kg)']
  };

  const paymentMethods = {
    'India': ['UPI', 'IMPS', 'NEFT', 'RTGS', 'Cheque', 'DD'],
    'USA': ['ACH', 'Wire Transfer', 'Zelle', 'Check', 'PayPal'],
    'UK': ['BACS', 'CHAPS', 'Faster Payments', 'Cheque'],
    'EU': ['SEPA', 'iDEAL', 'Sofort', 'Direct Debit'],
    'Global': ['SWIFT', 'Crypto (USDT)', 'PayPal']
  };

  const dueTypes = [
    { value: 'regulatory', label: 'Regulatory (15d)', icon: '🛡️' },
    { value: 'association', label: 'Association (30d)', icon: '🏢' },
    { value: 'agreed', label: 'Agreed (Custom OTP)', icon: '👤' },
    { value: 'net30', label: 'Net-30', icon: '📅' },
    { value: 'net60', label: 'Net-60', icon: '📅' },
    { value: 'net90', label: 'Net-90', icon: '📅' },
    { value: 'cod', label: 'COD', icon: '💵' }
  ];

  const kycTiers = [
    { tier: 'min', label: 'Minimum', color: '#4A4A4A', features: ['Basic ID', 'Phone'] },
    { tier: 'gold', label: 'Facial Verified', color: '#F4D03F', features: ['+ Facial Scan', 'Email'] },
    { tier: 'platinum', label: 'License Verified', color: '#27AE60', features: ['+ Gov ID', 'Address'] },
    { tier: 'physical', label: 'Physical Verified', color: '#3498DB', features: ['+ Site Visit', 'References'] }
  ];

  // Header Component
  const Header = () => (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF] border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">TRADIE</h1>
            <p className="text-xs text-gray-600">
              {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Commodity Trading'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger className="w-16 h-10 border-none bg-white/80">
              <span className="text-lg">{languageFlags[language]}</span>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageFlags).map(([lang, flag]) => (
                <SelectItem key={lang} value={lang}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{flag}</span>
                    <span>{lang}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Token Wallet */}
          {userRole && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F4D03F] to-[#D4AF37] rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-bold text-white">{tokenWallet.balance}</span>
              </div>
              {showTokenBurst && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-ping absolute h-full w-full rounded-lg bg-[#F4D03F] opacity-75" />
                  <Sparkles className="w-8 h-8 text-[#F4D03F] animate-bounce" />
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {userRole && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Voice Input Button
  const VoiceButton = ({ fieldId }: { fieldId: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-lg"
      onClick={() => handleVoiceInput(fieldId)}
    >
      <Mic className={`w-4 h-4 ${voiceActive === fieldId ? 'text-[#E74C3C] animate-pulse' : 'text-gray-400'}`} />
      {voiceActive === fieldId && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#E74C3C] text-white text-xs rounded whitespace-nowrap">
          Listening...
        </div>
      )}
    </Button>
  );

  // ==================== ONBOARDING SCREEN ====================
  const OnboardingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#D9F2FF] p-6">
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] rounded-3xl shadow-2xl">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="mb-3 text-gray-900">Welcome to TRADIE</h1>
          <p className="text-gray-600">Blockchain-Powered Commodity Trading Platform</p>
        </div>

        <Card className="mb-6 border-2 border-[#F4D03F]/20 shadow-xl">
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>Get +50 TRADIE tokens on signup!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { role: 'producer', label: 'Producer/Farmer', icon: Package, color: '#27AE60' },
              { role: 'buyer', label: 'Buyer/Trader', icon: ShoppingCart, color: '#3498DB' },
              { role: 'agent', label: 'Commission Agent', icon: Users, color: '#F4D03F' },
              { role: 'admin', label: 'Admin/Regulatory', icon: Shield, color: '#E74C3C' }
            ].map(({ role, label, icon: Icon, color }) => (
              <Button
                key={role}
                onClick={() => {
                  setUserRole(role as UserRole);
                  addTokens(50, 'Signup Bonus');
                  setCurrentScreen(`${role}-dashboard`);
                }}
                className="w-full h-14 justify-start gap-4 rounded-lg text-white"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold">{label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Secured by Polygon Blockchain</span>
        </div>
      </div>
    </div>
  );

  // ==================== PRODUCER SCREENS (8) ====================
  
  // Producer Dashboard
  const ProducerDashboard = () => (
    <div className="pb-20">
      {/* AI Insights Card */}
      <div className="p-4 bg-gradient-to-r from-[#F4D03F]/10 to-[#27AE60]/10 border-b">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow">
            <Sparkles className="w-5 h-5 text-[#F4D03F]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-700">GROK AI INSIGHT</span>
              <Badge className="bg-[#27AE60] text-white">Real-time</Badge>
            </div>
            <p className="text-sm text-gray-700">
              Market Trend: Coconut prices up 12% this week. Best time to list! 
              <span className="text-[#27AE60] font-semibold"> Expected ROI: +₹2,400</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-gradient-to-br from-[#27AE60] to-[#229954] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 opacity-80" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs opacity-90">Active Listings</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 opacity-80" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">₹2.4L</div>
            <div className="text-xs opacity-90">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'New Listing', icon: Plus, screen: 'producer-listing', color: '#F4D03F' },
            { label: 'My Listings', icon: Package, screen: 'producer-my-listings', color: '#27AE60' },
            { label: 'Weighing', icon: Scale, screen: 'producer-weighing', color: '#3498DB' },
            { label: 'Storage', icon: Warehouse, screen: 'producer-storage', color: '#9B59B6' }
          ].map(({ label, icon: Icon, screen, color }) => (
            <Button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              variant="outline"
              className="h-20 flex-col gap-2 rounded-lg border-2 hover:border-current"
              style={{ color }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Recent Activity</h3>
        <div className="space-y-3">
          {listings.slice(0, 2).map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  <img 
                    src={listing.image} 
                    alt={listing.commodity}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{listing.commodity}</div>
                        <div className="text-xs text-gray-500">{listing.id}</div>
                      </div>
                      <Badge className={listing.status === 'active' ? 'bg-[#27AE60]' : 'bg-[#F4D03F]'}>
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{listing.quantity} kg</span>
                      <span className="font-bold text-[#F4D03F]">₹{listing.price}/kg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Producer Listing Screen
  const ProducerListingScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Create New Listing</h2>
        <p className="text-sm text-gray-600">Tokenize your produce on blockchain</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          {/* Commodity Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Commodity Type *
            </label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="h-12 rounded-lg">
                  <SelectValue placeholder="Select commodity..." />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {commodities.map((commodity) => (
                    <SelectItem key={commodity} value={commodity}>
                      {commodity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <VoiceButton fieldId="commodity" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#F4D03F] transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Measurement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="1000"
                  className="h-12 rounded-lg"
                />
                <VoiceButton fieldId="quantity" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit *
              </label>
              <Select>
                <SelectTrigger className="h-12 rounded-lg">
                  <SelectValue placeholder="Kg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="quintal">Quintal</SelectItem>
                  <SelectItem value="ton">Metric Ton</SelectItem>
                  <SelectItem value="nos">Nos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price per Unit *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="22"
                  className="h-12 rounded-lg pl-8"
                />
              </div>
              <VoiceButton fieldId="price" />
            </div>
            <div className="mt-2 p-2 bg-[#27AE60]/10 rounded-lg">
              <div className="text-xs text-gray-600">Total Value</div>
              <div className="font-bold text-[#27AE60]">₹22,000</div>
            </div>
          </div>

          {/* Quality Attributes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quality Attributes
            </label>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="h-12 rounded-lg">
                  <SelectValue placeholder="Color Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Grade A - Premium</SelectItem>
                  <SelectItem value="b">Grade B - Standard</SelectItem>
                  <SelectItem value="c">Grade C - Economy</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-12 rounded-lg">
                  <SelectValue placeholder="Size Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large">Large (&gt;50mm)</SelectItem>
                  <SelectItem value="medium">Medium (30-50mm)</SelectItem>
                  <SelectItem value="small">Small (&lt;30mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stop Loss Protection */}
          <div className="p-3 bg-[#E74C3C]/10 rounded-lg border border-[#E74C3C]/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#E74C3C]" />
              <span className="text-sm font-semibold text-gray-700">Stop Loss Protection</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="Minimum price"
                  className="h-10 rounded-lg pl-8"
                />
              </div>
              <Badge className="bg-[#E74C3C] text-white">Auto-delist if below</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          className="w-full h-12 rounded-lg bg-[#F4D03F] hover:bg-[#D4AF37] text-white font-semibold"
          onClick={() => {
            addTokens(10, 'Listing Created');
            setCurrentScreen('producer-listing-confirmation');
          }}
        >
          <Package className="w-5 h-5 mr-2" />
          Create Listing (+10 Tokens)
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-lg"
          onClick={() => setCurrentScreen('producer-dashboard')}
        >
          Save as Draft
        </Button>
      </div>
    </div>
  );

  // Producer Listing Confirmation
  const ProducerListingConfirmation = () => (
    <div className="p-4 pb-20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#27AE60] rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="mb-2 text-gray-900">Listing Created!</h2>
        <p className="text-sm text-gray-600">Your produce is now tokenized on Polygon blockchain</p>
      </div>

      <Card className="mb-6 border-2 border-[#27AE60]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">Listing ID</span>
            <span className="font-mono text-sm text-[#F4D03F]">CHL-2025-003</span>
          </div>
          
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Blockchain</span>
              <span className="font-semibold text-gray-900">Polygon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NFT Token</span>
              <span className="font-mono text-xs text-[#3498DB]">0x7a3f...92e1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp</span>
              <span className="font-semibold text-gray-900">2025-10-27 10:45 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Schedule Inspection', icon: Eye, color: '#3498DB' },
            { label: 'Quality Sampling', icon: Target, color: '#9B59B6' },
            { label: 'View Bids', icon: ShoppingCart, color: '#F4D03F' }
          ].map(({ label, icon: Icon, color }) => (
            <Button
              key={label}
              variant="outline"
              className="w-full h-12 justify-start gap-3 rounded-lg"
              style={{ borderColor: color, color }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Button
        className="w-full h-12 rounded-lg"
        onClick={() => setCurrentScreen('producer-dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  );

  // Producer Weighing Screen
  const ProducerWeighingScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Weighing Entry</h2>
        <p className="text-sm text-gray-600">Authorized weighment for Lot CHL-2025-001</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          {/* Lot Details */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Commodity</span>
                <div className="font-semibold text-gray-900">Coconut WCT</div>
              </div>
              <div>
                <span className="text-gray-600">Expected</span>
                <div className="font-semibold text-gray-900">1000 kg</div>
              </div>
            </div>
          </div>

          {/* Weighing Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Actual Weight *
            </label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Enter weight"
                className="h-12 rounded-lg text-lg font-semibold"
                defaultValue="1000"
              />
              <VoiceButton fieldId="weight" />
            </div>
          </div>

          {/* Mismatch Alert */}
          <div className="p-3 bg-[#E74C3C]/10 rounded-lg border border-[#E74C3C]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E74C3C] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#E74C3C] mb-1">Mismatch Detected!</div>
                <div className="text-xs text-gray-700">
                  Variance: <span className="font-bold">-50 kg (-5%)</span>
                  <br />
                  Expected: 1000 kg | Actual: 950 kg
                </div>
              </div>
            </div>
          </div>

          {/* Reason for Mismatch */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Variance
            </label>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="h-12 rounded-lg">
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moisture">Moisture Loss</SelectItem>
                  <SelectItem value="grading">Grading/Quality Rejection</SelectItem>
                  <SelectItem value="damage">Transport Damage</SelectItem>
                  <SelectItem value="measurement">Measurement Error</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Additional notes..."
                  className="rounded-lg"
                  rows={3}
                />
                <VoiceButton fieldId="notes" />
              </div>
            </div>
          </div>

          {/* Both Party Confirmation */}
          <div className="space-y-3">
            <div className="p-3 bg-[#F4D03F]/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Producer Confirmation</span>
                <Badge className="bg-[#27AE60] text-white">Pending</Badge>
              </div>
              <Input 
                type="text"
                placeholder="Enter OTP (sent to +91-xxxxx567)"
                className="h-10 rounded-lg"
                maxLength={6}
              />
            </div>

            <div className="p-3 bg-[#3498DB]/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Buyer Confirmation</span>
                <Badge className="bg-[#F4D03F] text-white">Waiting</Badge>
              </div>
              <div className="text-xs text-gray-600">
                Buyer will be notified to verify weighment
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full h-12 rounded-lg bg-[#F4D03F] hover:bg-[#D4AF37] text-white font-semibold"
          onClick={() => setCurrentScreen('producer-weighing-confirmed')}
        >
          Submit Weighment
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  // Producer Storage Screen
  const ProducerStorageScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Storage Decision</h2>
        <p className="text-sm text-gray-600">Post-weighing storage options</p>
      </div>

      {/* Storage Type Selection */}
      <div className="space-y-4 mb-6">
        {[
          {
            type: 'private',
            label: 'Private Warehouse',
            icon: Warehouse,
            color: '#27AE60',
            desc: 'Own storage facility',
            features: ['No rental cost', 'Full control', 'Self-managed']
          },
          {
            type: 'lease',
            label: 'Lease Storage',
            icon: Warehouse,
            color: '#F4D03F',
            desc: 'Rent from facility',
            features: ['Upfront/Partial payment', 'Secured facility', 'Insurance included']
          },
          {
            type: 'chamber',
            label: 'Cold Chamber',
            icon: Warehouse,
            color: '#3498DB',
            desc: 'Temperature controlled',
            features: ['Premium rates', 'Extended shelf life', 'Quality preservation']
          }
        ].map(({ type, label, icon: Icon, color, desc, features }) => (
          <Card key={type} className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-current" style={{ borderColor: color }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                  <p className="text-sm text-gray-600 mb-2">{desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Type */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Storage Customer Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select>
            <SelectTrigger className="h-12 rounded-lg">
              <SelectValue placeholder="Select customer type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="producer">Producer (Self)</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="third-party">3rd Party/Agent</SelectItem>
            </SelectContent>
          </Select>

          {/* Rent Payment Terms */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rent Payment Terms
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="upfront" className="w-4 h-4" />
                <label htmlFor="upfront" className="text-sm text-gray-700">Upfront (Full payment)</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="partial" className="w-4 h-4" />
                <label htmlFor="partial" className="text-sm text-gray-700">Partial (50% now, 50% later)</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="payment" id="regulated" className="w-4 h-4" defaultChecked />
                <label htmlFor="regulated" className="text-sm text-gray-700">Regulated Low Rate</label>
              </div>
            </div>
          </div>

          {/* Rate Calculation */}
          <div className="p-3 bg-[#27AE60]/10 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Duration</span>
                <div className="font-semibold text-gray-900">30 days</div>
              </div>
              <div>
                <span className="text-gray-600">Rate</span>
                <div className="font-semibold text-gray-900">₹5/kg/month</div>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-300">
                <span className="text-gray-600">Total Cost</span>
                <div className="font-bold text-[#27AE60] text-lg">₹5,000</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Binding Agreement */}
      <Card className="mb-6 border-[#E74C3C]">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#E74C3C] flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Storage Binding</h4>
              <p className="text-sm text-gray-600">
                By confirming, you agree to storage terms. Early withdrawal may incur penalties.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="agree" className="mt-1" />
            <label htmlFor="agree" className="text-xs text-gray-700">
              I agree to the storage terms and conditions
            </label>
          </div>
        </CardContent>
      </Card>

      <Button 
        className="w-full h-12 rounded-lg bg-[#F4D03F] hover:bg-[#D4AF37] text-white font-semibold"
        onClick={() => setCurrentScreen('producer-dashboard')}
      >
        Confirm Storage Booking
      </Button>
    </div>
  );

  // Producer Reports Screen
  const ProducerReportsScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Reports & Analytics</h2>
        <p className="text-sm text-gray-600">Export and analyze your trading data</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">From Date</label>
              <Input type="date" className="h-10 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">To Date</label>
              <Input type="date" className="h-10 rounded-lg" />
            </div>
          </div>
          
          <Select>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Filter by commodity..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commodities</SelectItem>
              <SelectItem value="coconut">Coconut</SelectItem>
              <SelectItem value="mushroom">Mushroom</SelectItem>
              <SelectItem value="spices">Spices</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button className="w-full h-10 rounded-lg" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Export Options</h3>
        {[
          { format: 'PDF', icon: FileText, color: '#E74C3C', desc: 'Formatted report' },
          { format: 'Excel', icon: FileText, color: '#27AE60', desc: 'Spreadsheet data' },
          { format: 'CSV', icon: Download, color: '#3498DB', desc: 'Raw data export' }
        ].map(({ format, icon: Icon, color, desc }) => (
          <Button
            key={format}
            variant="outline"
            className="w-full h-14 justify-start gap-3 rounded-lg"
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">{format}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
            <Download className="w-4 h-4 ml-auto text-gray-400" />
          </Button>
        ))}
      </div>

      {/* Email Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Automated Email Summaries</CardTitle>
          <CardDescription>Schedule periodic reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Daily Summary</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Weekly Summary</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Monthly Summary</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== BUYER SCREENS (8) ====================
  
  const BuyerDashboardScreen = () => (
    <div className="pb-20">
      {/* AI Market Insights */}
      <div className="p-4 bg-gradient-to-r from-[#3498DB]/10 to-[#F4D03F]/10 border-b">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow">
            <Sparkles className="w-5 h-5 text-[#3498DB]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-700">GROK AI MARKET ALERT</span>
              <Badge className="bg-[#3498DB] text-white">Hot Deal</Badge>
            </div>
            <p className="text-sm text-gray-700">
              Premium Coconut WCT available 15% below market! 
              <span className="text-[#3498DB] font-semibold"> Act fast - 12 buyers viewing</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-5 h-5 opacity-80" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs opacity-90">Active Orders</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 opacity-80" />
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs opacity-90">Pending Inspections</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Browse', icon: Search, screen: 'buyer-browse', color: '#3498DB' },
            { label: 'My Orders', icon: ShoppingCart, screen: 'buyer-orders', color: '#F4D03F' },
            { label: 'Quality Check', icon: CheckCircle, screen: 'buyer-quality', color: '#27AE60' },
            { label: 'Payments', icon: DollarSign, screen: 'buyer-payment', color: '#9B59B6' }
          ].map(({ label, icon: Icon, screen, color }) => (
            <Button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              variant="outline"
              className="h-20 flex-col gap-2 rounded-lg border-2 hover:border-current"
              style={{ color }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Available Listings */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Available Listings</h3>
          <Button variant="ghost" size="sm" onClick={() => setCurrentScreen('buyer-browse')}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  <img 
                    src={listing.image} 
                    alt={listing.commodity}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{listing.commodity}</div>
                        <div className="text-xs text-gray-500">{listing.id}</div>
                      </div>
                      <Badge className="bg-[#27AE60] text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{listing.quantity} kg available</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3498DB] text-lg">₹{listing.price}/kg</span>
                      <Button size="sm" className="h-8 bg-[#3498DB] hover:bg-[#2980B9]">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Buyer Browse Screen
  const BuyerBrowseScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Browse Commodities</h2>
        <p className="text-sm text-gray-600">200+ varieties available</p>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search commodities..."
              className="h-12 rounded-lg pl-10"
            />
          </div>

          <Select>
            <SelectTrigger className="h-12 rounded-lg">
              <SelectValue placeholder="Select commodity type..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="all">All Commodities</SelectItem>
              {commodities.slice(0, 20).map((commodity) => (
                <SelectItem key={commodity} value={commodity}>
                  {commodity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preferences */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Quality Preferences</h4>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="Color preference..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium (Light/Uniform)</SelectItem>
                  <SelectItem value="standard">Standard (Mixed)</SelectItem>
                  <SelectItem value="economy">Economy (Any)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="Size preference..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large">Large (&gt;50mm)</SelectItem>
                  <SelectItem value="medium">Medium (30-50mm)</SelectItem>
                  <SelectItem value="small">Small (&lt;30mm)</SelectItem>
                  <SelectItem value="mixed">Mixed Sizes</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="Smell/Aroma..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh">Fresh/Strong</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buyer Class */}
          <Select>
            <SelectTrigger className="h-12 rounded-lg">
              <SelectValue placeholder="Your buyer class..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stationary">Stationary (Local)</SelectItem>
              <SelectItem value="non-local">Non-Local (Regional)</SelectItem>
              <SelectItem value="remote">Remote (Interstate)</SelectItem>
              <SelectItem value="third-party">3rd Party Agent</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">12 listings found</span>
          <Select defaultValue="recent">
            <SelectTrigger className="w-32 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={listing.image} 
                alt={listing.commodity}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{listing.commodity}</h3>
                    <p className="text-xs text-gray-500">{listing.id}</p>
                  </div>
                  <Badge className="bg-[#27AE60] text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Available</span>
                    <div className="font-semibold text-gray-900">{listing.quantity} kg</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade</span>
                    <div className="font-semibold text-gray-900">Premium A</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Price per kg</div>
                    <div className="font-bold text-[#3498DB] text-xl">₹{listing.price}</div>
                  </div>
                  <Button 
                    className="bg-[#3498DB] hover:bg-[#2980B9]"
                    onClick={() => setCurrentScreen('buyer-order-detail')}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Buyer Order Detail / Bidding Screen
  const BuyerOrderDetailScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Place Order</h2>
        <p className="text-sm text-gray-600">CHL-2025-001</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Quantity *
            </label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Enter quantity"
                className="h-12 rounded-lg"
                defaultValue="500"
              />
              <Select defaultValue="kg">
                <SelectTrigger className="w-24 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="quintal">Quintal</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Available: 1000 kg
            </p>
          </div>

          {/* Price & Bidding */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Listed Price</span>
              <span className="font-bold text-gray-900">₹22/kg</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">Your Order Value</span>
              <span className="font-bold text-[#3498DB] text-lg">₹11,000</span>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Your Bid (Optional)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input 
                    type="number" 
                    placeholder="20"
                    className="h-10 rounded-lg pl-8"
                  />
                </div>
                <span className="flex items-center text-sm text-gray-600">/kg</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum accepted: ₹20/kg
              </p>
            </div>
          </div>

          {/* Min Lock / Cascade Options */}
          <div className="p-3 bg-[#F4D03F]/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Type</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="radio" name="orderType" id="minLock" defaultChecked />
                <label htmlFor="minLock" className="text-sm text-gray-700">
                  <span className="font-semibold">Min-Lock:</span> Guarantee minimum quantity (if partial available)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="orderType" id="cascade" />
                <label htmlFor="cascade" className="text-sm text-gray-700">
                  <span className="font-semibold">Cascade:</span> Cancel if full quantity unavailable
                </label>
              </div>
            </div>
          </div>

          {/* Quality Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quality Verification Required
            </label>
            <Select defaultValue="self">
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self Inspection</SelectItem>
                <SelectItem value="labor">Labor/Staff Inspection</SelectItem>
                <SelectItem value="lab">Lab Testing (Premium)</SelectItem>
                <SelectItem value="third-party">3rd Party Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery & Transport */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transport Arrangement
            </label>
            <Select defaultValue="own">
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="own">Own Transport</SelectItem>
                <SelectItem value="seller">Seller Arranged</SelectItem>
                <SelectItem value="platform">Platform Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="mb-6 border-2 border-[#27AE60]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 mb-1">Grok AI Recommendation</div>
              <p className="text-sm text-gray-700">
                ✅ Good deal at current price
                <br />
                📊 Producer rating: 4.8/5 (92 completed trades)
                <br />
                🚀 Avg delivery: 3 days
                <br />
                💰 Estimated savings vs market: ₹1,200
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full h-12 rounded-lg bg-[#3498DB] hover:bg-[#2980B9] text-white font-semibold"
          onClick={() => {
            addTokens(10, 'Order Placed');
            setCurrentScreen('buyer-order-confirmation');
          }}
        >
          Confirm Order (+10 Tokens)
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-lg"
          onClick={() => setCurrentScreen('buyer-browse')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  // Buyer Payment Screen
  const BuyerPaymentScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Payment Details</h2>
        <p className="text-sm text-gray-600">Order #CHL-2025-001</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          {/* Order Summary */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Commodity</span>
                <span className="font-semibold text-gray-900">Coconut WCT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold text-gray-900">500 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per kg</span>
                <span className="font-semibold text-gray-900">₹22</span>
              </div>
              <div className="pt-2 border-t border-gray-300 flex justify-between">
                <span className="text-gray-900 font-semibold">Subtotal</span>
                <span className="font-bold text-gray-900">₹11,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport</span>
                <span className="font-semibold text-gray-900">₹500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (1%)</span>
                <span className="font-semibold text-gray-900">₹110</span>
              </div>
              <div className="pt-2 border-t border-gray-300 flex justify-between">
                <span className="text-gray-900 font-semibold">Total Payable</span>
                <span className="font-bold text-[#3498DB] text-lg">₹11,610</span>
              </div>
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country/Region *
            </label>
            <Select defaultValue="india">
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">🇮🇳 India</SelectItem>
                <SelectItem value="usa">🇺🇸 USA</SelectItem>
                <SelectItem value="uk">🇬🇧 UK</SelectItem>
                <SelectItem value="eu">🇪🇺 EU</SelectItem>
                <SelectItem value="global">🌍 Global</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method *
            </label>
            <Select defaultValue="upi">
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods['India'].map((method) => (
                  <SelectItem key={method} value={method.toLowerCase()}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Reference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Reference/UTR *
            </label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter UTR/Reference number"
                className="h-12 rounded-lg"
              />
              <VoiceButton fieldId="reference" />
            </div>
          </div>

          {/* Due Date Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Terms *
            </label>
            <div className="space-y-2">
              {dueTypes.map(({ value, label, icon }) => (
                <div 
                  key={value}
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:border-[#3498DB] transition-colors"
                >
                  <input 
                    type="radio" 
                    name="dueType" 
                    id={value}
                    className="w-4 h-4"
                    defaultChecked={value === 'net30'}
                  />
                  <label htmlFor={value} className="flex items-center gap-2 flex-1 cursor-pointer">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-gray-900">{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Assessment */}
          <div className="p-3 bg-[#27AE60]/10 rounded-lg border border-[#27AE60]/20">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#27AE60] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">GROK AI ASSESSMENT</div>
                <p className="text-xs text-gray-700">
                  ✅ <span className="font-semibold">Low Risk</span> - Net-30 recommended
                  <br />
                  📊 Your payment history: Excellent (100% on-time)
                  <br />
                  💡 Tip: Pay within 15 days to earn +5 bonus tokens
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full h-12 rounded-lg bg-[#27AE60] hover:bg-[#229954] text-white font-semibold"
          onClick={() => {
            addTokens(5, 'Payment Initiated');
            setCurrentScreen('buyer-dashboard');
          }}
        >
          Confirm Payment
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-lg"
        >
          Save for Later
        </Button>
      </div>
    </div>
  );

  // Buyer Quality Verification Screen
  const BuyerQualityScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Quality Verification</h2>
        <p className="text-sm text-gray-600">Order #CHL-2025-001</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          {/* Verification Tier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Verification Type *
            </label>
            <div className="space-y-3">
              {[
                { type: 'self', label: 'Self Inspection', cost: 'Free', color: '#4A4A4A' },
                { type: 'labor', label: 'Labor/Staff', cost: '₹200', color: '#F4D03F' },
                { type: 'lab', label: 'Lab Testing', cost: '₹1,500', color: '#3498DB' },
                { type: 'auditor', label: '3rd Party Auditor', cost: '₹3,000', color: '#27AE60' }
              ].map(({ type, label, cost, color }) => (
                <div 
                  key={type}
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:border-current transition-colors"
                  style={{ borderColor: color }}
                >
                  <input type="radio" name="verType" id={type} className="w-4 h-4" />
                  <label htmlFor={type} className="flex items-center justify-between flex-1 cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900">{label}</span>
                    <Badge style={{ backgroundColor: color, color: 'white' }}>{cost}</Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Parameters */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Inspection Checklist</h4>
            <div className="space-y-2">
              {[
                'Visual appearance & color',
                'Size & uniformity',
                'Moisture content',
                'Foreign matter',
                'Damage/defects',
                'Smell/aroma'
              ].map((param) => (
                <div key={param} className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{param}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Inspection Photos
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#3498DB]"
                >
                  <Camera className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Photo {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Inspection Notes
            </label>
            <div className="flex gap-2">
              <Textarea 
                placeholder="Enter detailed inspection notes..."
                className="rounded-lg"
                rows={4}
              />
              <VoiceButton fieldId="inspection-notes" />
            </div>
          </div>

          {/* Pass/Fail Decision */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quality Decision *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-14 bg-[#27AE60] hover:bg-[#229954]">
                <CheckCircle className="w-5 h-5 mr-2" />
                Pass
              </Button>
              <Button className="h-14 bg-[#E74C3C] hover:bg-[#C0392B]">
                <XCircle className="w-5 h-5 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        className="w-full h-12 rounded-lg bg-[#3498DB] hover:bg-[#2980B9] text-white font-semibold"
        onClick={() => setCurrentScreen('buyer-dashboard')}
      >
        Submit Verification Report
      </Button>
    </div>
  );

  // ==================== AGENT SCREENS (4) ====================

  const AgentDashboardScreen = () => (
    <div className="pb-20">
      {/* Multi-Producer Management */}
      <div className="p-4 bg-gradient-to-r from-[#F4D03F]/10 to-[#D4AF37]/10 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Managing Producers</h3>
          <Badge className="bg-[#F4D03F] text-white">12 Active</Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Farmer A', 'Farmer B', 'Farmer C', 'Farmer D'].map((farmer) => (
            <div 
              key={farmer}
              className="flex-shrink-0 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="text-xs text-gray-600">{farmer}</div>
              <div className="text-sm font-semibold text-gray-900">8 Lots</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 opacity-80" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs opacity-90">Active Producers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#27AE60] to-[#229954] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 opacity-80" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">₹8.5L</div>
            <div className="text-xs opacity-90">Commission Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Advances', icon: DollarSign, screen: 'agent-advances', color: '#F4D03F' },
            { label: 'Bill Ledger', icon: FileText, screen: 'agent-ledger', color: '#27AE60' },
            { label: 'OTP Approvals', icon: Lock, screen: 'agent-otp', color: '#3498DB' },
            { label: 'Scoring', icon: Star, screen: 'agent-scoring', color: '#9B59B6' }
          ].map(({ label, icon: Icon, screen, color }) => (
            <Button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              variant="outline"
              className="h-20 flex-col gap-2 rounded-lg border-2 hover:border-current"
              style={{ color }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Pending Actions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Pending Actions</h3>
          <Badge className="bg-[#E74C3C] text-white">3 Urgent</Badge>
        </div>
        <div className="space-y-3">
          {[
            { action: 'Bill YT-7685 - Buyer Auth Needed', type: 'OTP Required', color: '#E74C3C', urgent: true },
            { action: 'Advance for Farmer C', type: '₹50,000', color: '#F4D03F', urgent: false },
            { action: 'Quality Dispute - Lot CHL-003', type: 'Resolution Needed', color: '#E74C3C', urgent: true }
          ].map((item, i) => (
            <Card key={i} className={`border-l-4 ${item.urgent ? 'bg-red-50' : ''}`} style={{ borderLeftColor: item.color }}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{item.action}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.type}</div>
                  </div>
                  {item.urgent && (
                    <Badge className="bg-[#E74C3C] text-white">
                      Urgent
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Agent Bill Ledger Screen (Excel-like)
  const AgentLedgerScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Bill Ledger</h2>
        <p className="text-sm text-gray-600">Excel-style buyer database</p>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-3 flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-10 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Download className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Excel-like Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {bills.map((bill) => (
            <Card 
              key={bill.billNo}
              className={`mb-3 border-l-4 cursor-pointer hover:shadow-lg transition-shadow ${
                bill.status === 'pending' ? 'border-l-[#F4D03F]' :
                bill.status === 'waiting' ? 'border-l-[#E74C3C]' :
                'border-l-[#27AE60]'
              }`}
              onClick={() => setCurrentScreen('agent-bill-detail')}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-900">{bill.billNo}</span>
                      <Badge className={
                        bill.status === 'pending' ? 'bg-[#F4D03F]' :
                        bill.status === 'waiting' ? 'bg-[#E74C3C]' :
                        'bg-[#27AE60]'
                      }>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{bill.date}</div>
                  </div>
                  {bill.daysPast > 0 && (
                    <Badge className="bg-[#E74C3C] text-white">
                      {bill.daysPast} Days Past
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Buyer</span>
                    <div className="font-semibold text-gray-900">{bill.buyer}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact</span>
                    <div className="font-semibold text-gray-900">{bill.contact}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Units</span>
                    <div className="font-semibold text-gray-900">{bill.units} {bill.measurement}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit Price</span>
                    <div className="font-semibold text-gray-900">₹{bill.unitPrice}</div>
                  </div>
                </div>

                {/* Auto-calc formulas display */}
                <div className="p-2 bg-gray-50 rounded text-xs mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Amount ({bill.units} × ₹{bill.unitPrice})</span>
                    <span className="font-semibold">₹{bill.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Packaging</span>
                    <span className="font-semibold">₹{bill.packing}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-300">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-[#F4D03F]">₹{bill.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* AI Insight */}
                {bill.aiInsight && (
                  <div className="p-2 bg-[#E74C3C]/10 rounded-lg flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#E74C3C] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{bill.aiInsight}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 h-9">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1 h-9 bg-[#F4D03F] hover:bg-[#D4AF37]">
                    <Eye className="w-3 h-3 mr-1" />
                    View Full
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="mt-4 bg-gradient-to-r from-[#F4D03F]/10 to-[#27AE60]/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-600">Pending</div>
              <div className="font-bold text-[#F4D03F]">0</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Waiting</div>
              <div className="font-bold text-[#E74C3C]">1</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Confirmed</div>
              <div className="font-bold text-[#27AE60]">0</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Agent Scoring Screen
  const AgentScoringScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Scoring & Ratings</h2>
        <p className="text-sm text-gray-600">Performance metrics</p>
      </div>

      {/* Agent Score Card */}
      <Card className="mb-6 bg-gradient-to-br from-[#F4D03F] to-[#D4AF37] text-white">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold mb-2">4.6</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i}
                  className={`w-5 h-5 ${i <= 4 ? 'fill-current' : 'opacity-50'}`}
                />
              ))}
            </div>
            <div className="text-sm opacity-90">Overall Agent Rating</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-white/20">
            <div>
              <div className="font-bold text-lg">156</div>
              <div className="text-xs opacity-90">Total Trades</div>
            </div>
            <div>
              <div className="font-bold text-lg">92%</div>
              <div className="text-xs opacity-90">Success Rate</div>
            </div>
            <div>
              <div className="font-bold text-lg">3</div>
              <div className="text-xs opacity-90">Disputes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact of Cancellations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Cancellation Impact</CardTitle>
          <CardDescription>How cancellations affect your rating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-[#E74C3C]/10 rounded-lg border border-[#E74C3C]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">This Month</span>
              <Badge className="bg-[#E74C3C] text-white">2 Cancellations</Badge>
            </div>
            <div className="text-xs text-gray-600">
              Rating impact: <span className="font-bold text-[#E74C3C]">-0.3 points</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Buyer-initiated</span>
              <span className="font-semibold text-gray-900">1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Producer-initiated</span>
              <span className="font-semibold text-gray-900">1</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="text-gray-700 font-semibold">Recovery actions</span>
              <Button size="sm" variant="outline" className="h-8">
                View Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grok AI Recommendations */}
      <Card className="border-2 border-[#27AE60]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 mb-2">Grok AI Recommendations</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Maintain current response time (&lt;2 hrs)</li>
                <li>⚠️ Reduce cancellations by 50% to reach 4.8 rating</li>
                <li>💡 Complete 5 more trades for &quot;Gold Agent&quot; badge</li>
                <li>📊 Buyer satisfaction: 94% (Excellent)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== ADMIN/REGULATORY SCREENS (4) ====================

  const AdminDashboardScreen = () => (
    <div className="pb-20">
      {/* System Overview */}
      <div className="p-4 bg-gradient-to-r from-[#E74C3C]/10 to-[#9B59B6]/10 border-b">
        <h3 className="font-semibold text-gray-900 mb-3">System Overview</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Users', value: '1,247', color: '#3498DB' },
            { label: 'Trades', value: '856', color: '#27AE60' },
            { label: 'Disputes', value: '12', color: '#E74C3C' },
            { label: 'Revenue', value: '₹8.2L', color: '#F4D03F' }
          ].map(({ label, value, color }) => (
            <div key={label} className="p-2 bg-white rounded-lg shadow-sm text-center">
              <div className="text-xs text-gray-600">{label}</div>
              <div className="font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Administrative Actions</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'User Mgmt', icon: Users, screen: 'admin-users', color: '#3498DB' },
            { label: 'QR Oversight', icon: QrCode, screen: 'admin-oversight', color: '#27AE60' },
            { label: 'Disputes', icon: AlertTriangle, screen: 'admin-disputes', color: '#E74C3C' },
            { label: 'Analytics', icon: BarChart3, screen: 'admin-analytics', color: '#9B59B6' }
          ].map(({ label, icon: Icon, screen, color }) => (
            <Button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              variant="outline"
              className="h-20 flex-col gap-2 rounded-lg border-2 hover:border-current"
              style={{ color }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{label}</span>
            </Button>
          ))}
        </div>

        {/* Pending Reviews */}
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Pending Reviews</h3>
        <div className="space-y-3">
          {[
            { item: 'KYC Verification - Buyer #234', status: 'Pending', color: '#F4D03F' },
            { item: 'Quality Dispute - Lot CHL-089', status: 'Urgent', color: '#E74C3C' },
            { item: 'License Renewal - Agent #56', status: 'Due Soon', color: '#E74C3C' }
          ].map((item, i) => (
            <Card key={i} className="border-l-4" style={{ borderLeftColor: item.color }}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{item.item}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.status}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Admin QR Oversight Screen (Regulatory)
  const AdminOversightScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">QR Regulatory Oversight</h2>
        <p className="text-sm text-gray-600">4-tier verification system</p>
      </div>

      {/* Tier Selection */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-3">
          {[
            { tier: 'yard', label: 'Yard Level', icon: '🏭', desc: 'Local yard operations' },
            { tier: 'district', label: 'District Level', icon: '🏛️', desc: 'District monitoring' },
            { tier: 'state', label: 'State Level', icon: '🏢', desc: 'State compliance' },
            { tier: 'central', label: 'Central Level', icon: '🏛️', desc: 'National oversight' }
          ].map(({ tier, label, icon, desc }) => (
            <div 
              key={tier}
              className="p-3 border-2 rounded-lg cursor-pointer hover:border-[#27AE60] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{label}</div>
                  <div className="text-xs text-gray-600">{desc}</div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* QR Scanner */}
      <Card className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-2xl shadow-lg mb-4">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Scan Transaction QR</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify and append to blockchain ledger
            </p>
            <Button className="bg-[#27AE60] hover:bg-[#229954]">
              <Camera className="w-4 h-4 mr-2" />
              Open Scanner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Verifications */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Recent Verifications</h3>
        {[
          { txn: 'YT-7685', yard: 'Yard-Mumbai-01', tax: '₹276', status: 'Verified' },
          { txn: 'YT-7686', yard: 'Yard-Delhi-03', tax: '₹1,100', status: 'Verified' },
          { txn: 'YT-7687', yard: 'Yard-Chennai-02', tax: '₹450', status: 'Pending' }
        ].map((item) => (
          <Card key={item.txn} className={item.status === 'Verified' ? 'border-[#27AE60]' : 'border-[#F4D03F]'}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm font-bold text-gray-900">{item.txn}</div>
                  <div className="text-xs text-gray-600">{item.yard}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Tax: {item.tax}</div>
                  <Badge className={item.status === 'Verified' ? 'bg-[#27AE60]' : 'bg-[#F4D03F]'}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ledger Sync Status */}
      <Card className="mt-6 bg-[#27AE60]/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#27AE60]" />
            <div>
              <div className="font-semibold text-gray-900">Ledger Sync Active</div>
              <div className="text-xs text-gray-600">
                Auto-append to yard ledger + 1% tax calculation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Admin Analytics Screen
  const AdminAnalyticsScreen = () => (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="mb-2 text-gray-900">Analytics & Reports</h2>
        <p className="text-sm text-gray-600">System-wide insights</p>
      </div>

      {/* Report Type Selection */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-3">
          <Select defaultValue="daily">
            <SelectTrigger className="h-12 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="custom">Custom Date Range</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" className="h-10">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Trade Volume', value: '856', change: '+12%', color: '#27AE60' },
          { label: 'Revenue', value: '₹8.2L', change: '+8%', color: '#3498DB' },
          { label: 'Users', value: '1,247', change: '+15%', color: '#F4D03F' },
          { label: 'Disputes', value: '12', change: '-5%', color: '#E74C3C' }
        ].map(({ label, value, change, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="text-xs text-gray-600 mb-1">{label}</div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-gray-900">{value}</span>
                <span className="text-xs font-semibold" style={{ color }}>
                  {change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grok AI Trends */}
      <Card className="border-2 border-[#9B59B6]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#9B59B6]" />
            Grok AI Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-[#27AE60]/10 rounded-lg">
            <div className="font-semibold text-sm text-gray-900 mb-1">📈 Peak Trading Hours</div>
            <p className="text-xs text-gray-700">
              10 AM - 2 PM sees 60% of daily trades. Optimize support coverage.
            </p>
          </div>
          
          <div className="p-3 bg-[#3498DB]/10 rounded-lg">
            <div className="font-semibold text-sm text-gray-900 mb-1">🌾 Top Commodity</div>
            <p className="text-xs text-gray-700">
              Coconut accounts for 35% of volume. Consider adding more varieties.
            </p>
          </div>
          
          <div className="p-3 bg-[#E74C3C]/10 rounded-lg">
            <div className="font-semibold text-sm text-gray-900 mb-1">⚠️ Risk Alert</div>
            <p className="text-xs text-gray-700">
              Payment delays increased 8%. Recommend stricter Net-30 enforcement.
            </p>
          </div>
          
          <div className="p-3 bg-[#F4D03F]/10 rounded-lg">
            <div className="font-semibold text-sm text-gray-900 mb-1">🎯 Growth Opportunity</div>
            <p className="text-xs text-gray-700">
              Mushroom segment growing 25% MoM. Expand producer onboarding.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Automated Email Reports */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Automated Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Daily Summary (9 AM)</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Weekly Digest (Monday)</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Monthly Report (1st)</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== BOTTOM NAVIGATION ====================
  const BottomNav = () => {
    if (!userRole) return null;

    const navItems: Record<UserRole, Array<{ label: string; icon: any; screen: string }>> = {
      producer: [
        { label: 'Home', icon: Home, screen: 'producer-dashboard' },
        { label: 'Listings', icon: Package, screen: 'producer-my-listings' },
        { label: 'Reports', icon: BarChart3, screen: 'producer-reports' },
        { label: 'Settings', icon: Settings, screen: 'producer-settings' }
      ],
      buyer: [
        { label: 'Home', icon: Home, screen: 'buyer-dashboard' },
        { label: 'Browse', icon: Search, screen: 'buyer-browse' },
        { label: 'Orders', icon: ShoppingCart, screen: 'buyer-orders' },
        { label: 'Settings', icon: Settings, screen: 'buyer-settings' }
      ],
      agent: [
        { label: 'Home', icon: Home, screen: 'agent-dashboard' },
        { label: 'Ledger', icon: FileText, screen: 'agent-ledger' },
        { label: 'Scoring', icon: Star, screen: 'agent-scoring' },
        { label: 'Settings', icon: Settings, screen: 'agent-settings' }
      ],
      admin: [
        { label: 'Home', icon: Home, screen: 'admin-dashboard' },
        { label: 'Users', icon: Users, screen: 'admin-users' },
        { label: 'Oversight', icon: Shield, screen: 'admin-oversight' },
        { label: 'Analytics', icon: BarChart3, screen: 'admin-analytics' }
      ]
    };

    const items = navItems[userRole] || [];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 p-2">
          {items.map(({ label, icon: Icon, screen }) => (
            <button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentScreen === screen
                  ? 'bg-[#F4D03F]/10 text-[#F4D03F]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ==================== RENDER LOGIC ====================
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      
      // Producer Screens
      case 'producer-dashboard':
        return <ProducerDashboard />;
      case 'producer-listing':
        return <ProducerListingScreen />;
      case 'producer-listing-confirmation':
        return <ProducerListingConfirmation />;
      case 'producer-weighing':
        return <ProducerWeighingScreen />;
      case 'producer-storage':
        return <ProducerStorageScreen />;
      case 'producer-reports':
        return <ProducerReportsScreen />;
      
      // Buyer Screens
      case 'buyer-dashboard':
        return <BuyerDashboardScreen />;
      case 'buyer-browse':
        return <BuyerBrowseScreen />;
      case 'buyer-order-detail':
        return <BuyerOrderDetailScreen />;
      case 'buyer-payment':
        return <BuyerPaymentScreen />;
      case 'buyer-quality':
        return <BuyerQualityScreen />;
      
      // Agent Screens
      case 'agent-dashboard':
        return <AgentDashboardScreen />;
      case 'agent-ledger':
        return <AgentLedgerScreen />;
      case 'agent-scoring':
        return <AgentScoringScreen />;
      
      // Admin Screens
      case 'admin-dashboard':
        return <AdminDashboardScreen />;
      case 'admin-oversight':
        return <AdminOversightScreen />;
      case 'admin-analytics':
        return <AdminAnalyticsScreen />;
      
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <div className="max-w-[375px] mx-auto bg-white min-h-screen shadow-2xl relative">
      {currentScreen !== 'onboarding' && <Header />}
      <div className="min-h-screen">
        {renderScreen()}
      </div>
      <BottomNav />
    </div>
  );
};

export default TradieAppPrototype;
