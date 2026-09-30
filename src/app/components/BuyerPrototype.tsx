import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  Mic, ChevronDown, Search, AlertTriangle, CheckCircle2, Lock, 
  ArrowRight, Star, Brain, QrCode, Download, Share2, Clock,
  Globe, Shield, TrendingUp, DollarSign, Package, User, Building2,
  Phone, Mail, MapPin, Calendar, FileText, Zap, Info
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

type Language = 'EN' | 'HI' | 'TE' | 'TM' | 'KN' | 'BN' | 'MR';
type Screen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const translations: Record<Language, any> = {
  EN: {
    weighingComplete: 'Weighing Complete',
    pendingAuth: 'Pending Authorization',
    buyerWait: 'Buyer Approval Wait',
    billApproval: 'Bill Approval',
    confirmed: 'Confirmed & Synced',
    warnings: 'Warnings & Ratings',
    insights: 'Insights Dashboard',
    authorize: 'Authorize',
    approve: 'Approve',
    cancel: 'Cancel',
  },
  HI: {
    weighingComplete: 'तौल पूर्ण',
    pendingAuth: 'प्राधिकरण लंबित',
    buyerWait: 'खरीदार अनुमोदन प्रतीक्षा',
    billApproval: 'बिल अनुमोदन',
    confirmed: 'पुष्टि और समन्वयित',
    warnings: 'चेतावनी और रेटिंग',
    insights: 'अंतर्दृष्टि डैशबोर्ड',
    authorize: 'प्राधिकृत करें',
    approve: 'स्वीकृत करें',
    cancel: 'रद्द करें',
  },
  TE: {
    weighingComplete: 'తూకం పూర్తి',
    pendingAuth: 'అధికారం పెండింగ్',
    buyerWait: 'కొనుగోలుదారు ఆమోదం వేచి',
    billApproval: 'బిల్లు ఆమోదం',
    confirmed: 'నిర్ధారించబడింది & సమకాలీకరించబడింది',
    warnings: 'హెచ్చరికలు & రేటింగ్‌లు',
    insights: 'అంతర్దృష్టుల డాష్‌బోర్డ్',
    authorize: 'అధికారం ఇవ్వండి',
    approve: 'ఆమోదించండి',
    cancel: 'రద్దు చేయండి',
  },
  TM: {
    weighingComplete: 'எடை முடிந்தது',
    pendingAuth: 'அங்கீகாரம் நிலுவையில்',
    buyerWait: 'வாங்குபவர் ஒப்புதல் காத்திருப்பு',
    billApproval: 'பில் ஒப்புதல்',
    confirmed: 'உறுதி & ஒத்திசைக்கப்பட்டது',
    warnings: 'எச்சரிக்கைகள் & மதிப்பீடுகள்',
    insights: 'நுண்ணறிவு டாஷ்போர்டு',
    authorize: 'அங்கீகரிக்கவும்',
    approve: 'ஒப்புதல் அளிக்கவும்',
    cancel: 'ரத்து செய்யவும்',
  },
  KN: {
    weighingComplete: 'ತೂಕ ಪೂರ್ಣಗೊಂಡಿದೆ',
    pendingAuth: 'ಅಧಿಕಾರ ಬಾಕಿ',
    buyerWait: 'ಖರೀದಿದಾರರ ಅನುಮೋದನೆ ಕಾಯುತ್ತಿದೆ',
    billApproval: 'ಬಿಲ್ ಅನುಮೋದನೆ',
    confirmed: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ & ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    warnings: 'ಎಚ್ಚರಿಕೆಗಳು & ರೇಟಿಂಗ್‌ಗಳು',
    insights: 'ಒಳನೋಟಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    authorize: 'ಅಧಿಕಾರ ನೀಡಿ',
    approve: 'ಅನುಮೋದಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
  },
  BN: {
    weighingComplete: 'ওজন সম্পূর্ণ',
    pendingAuth: 'অনুমোদন মুলতুবি',
    buyerWait: 'ক্রেতা অনুমোদনের অপেক্ষা',
    billApproval: 'বিল অনুমোদন',
    confirmed: 'নিশ্চিত এবং সিঙ্ক',
    warnings: 'সতর্কতা এবং রেটিং',
    insights: 'অন্তর্দৃষ্টি ড্যাশবোর্ড',
    authorize: 'অনুমোদন করুন',
    approve: 'অনুমোদন করুন',
    cancel: 'বাতিল করুন',
  },
  MR: {
    weighingComplete: 'वजन पूर्ण',
    pendingAuth: 'प्राधिकरण प्रलंबित',
    buyerWait: 'खरेदीदार मंजुरी प्रतीक्षा',
    billApproval: 'बिल मंजूरी',
    confirmed: 'पुष्टी आणि समक्रमित',
    warnings: 'चेतावणी आणि रेटिंग',
    insights: 'अंतर्दृष्टी डॅशबोर्ड',
    authorize: 'अधिकृत करा',
    approve: 'मंजूर करा',
    cancel: 'रद्द करा',
  },
};

export function BuyerPrototype() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [language, setLanguage] = useState<Language>('EN');
  const [voiceActive, setVoiceActive] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [tokens, setTokens] = useState(1250);

  // Form state
  const [formData, setFormData] = useState({
    serialNo: 'TRD-2025-B001',
    buyer: 'Sunita Reddy',
    company: 'JJ&Co - Branch A',
    volume: '50',
    measurement: 'Quintal',
    unitPrice: '22',
    packagingType: 'Fixed',
    packagingQty: '10',
    packagingRate: '5',
    paymentMethod: 'UPI',
    dueType: 'Net-30',
    justification: '',
  });

  const t = translations[language];

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

  const LanguageToggle = () => (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {(['EN', 'HI', 'TE', 'TM', 'KN', 'BN', 'MR'] as Language[]).map((lang) => (
        <Button
          key={lang}
          size="sm"
          variant={language === lang ? 'default' : 'outline'}
          onClick={() => setLanguage(lang)}
          className={`min-w-[48px] h-8 text-xs ${
            language === lang 
              ? 'bg-[#F4D03F] text-[#4A4A4A] hover:bg-[#F4D03F]/90' 
              : 'bg-white text-[#4A4A4A] border-slate-300'
          }`}
        >
          {lang}
        </Button>
      ))}
    </div>
  );

  const TokenDisplay = () => (
    <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg shadow-lg ${
      showAnimation ? 'animate-pulse' : ''
    }`}>
      <Zap className="w-5 h-5 text-white" />
      <span className="text-white font-bold">{tokens}</span>
      <span className="text-xs text-white/90">TRADIE</span>
    </div>
  );

  const ScreenNavigation = () => (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((screen) => (
        <button
          key={screen}
          onClick={() => setCurrentScreen(screen as Screen)}
          className={`min-w-[40px] h-10 rounded-lg font-bold transition-all ${
            currentScreen === screen
              ? 'bg-[#F4D03F] text-[#4A4A4A] scale-110 shadow-lg'
              : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {screen}
        </button>
      ))}
    </div>
  );

  const calculateTotal = () => {
    const volume = parseFloat(formData.volume) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const packagingQty = parseFloat(formData.packagingQty) || 0;
    const packagingRate = parseFloat(formData.packagingRate) || 0;
    
    const productAmount = volume * unitPrice;
    const packagingAmount = packagingQty * packagingRate;
    const subtotal = productAmount + packagingAmount;
    const tax = subtotal * 0.01;
    const total = subtotal + tax;

    return { productAmount, packagingAmount, tax, total };
  };

  const { productAmount, packagingAmount, tax, total } = calculateTotal();

  // Screen 1: Weighing Complete
  const Screen1 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          {t.weighingComplete}
        </h2>
        <Badge className="bg-amber-500 text-white h-8 px-3">
          Lot: CHL-2025-001
        </Badge>
      </div>

      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Auto-Entry Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Serial Number */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-600 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Serial Number (Auto)
            </Label>
            <Input 
              value={formData.serialNo} 
              disabled 
              className="h-12 bg-slate-100 border-slate-300"
            />
          </div>

          {/* Buyer Name */}
          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600 flex items-center gap-2">
              <User className="w-3 h-3" />
              Buyer Name
            </Label>
            <Input 
              value={formData.buyer}
              onChange={(e) => setFormData({...formData, buyer: e.target.value})}
              className="h-12 pr-12 border-slate-300 focus:border-[#F4D03F] focus:ring-[#F4D03F]"
              placeholder="Enter buyer name"
            />
            <VoiceButton field="buyer" />
          </div>

          {/* Company/Brand */}
          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600 flex items-center gap-2">
              <Building2 className="w-3 h-3" />
              Company / Brand
            </Label>
            <Select value={formData.company} onValueChange={(v) => setFormData({...formData, company: v})}>
              <SelectTrigger className="h-16 border-slate-300 focus:border-[#F4D03F] focus:ring-[#F4D03F]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JJ&Co - Branch A">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    JJ&Co - Branch A
                  </div>
                </SelectItem>
                <SelectItem value="JJ&Co - Branch B">JJ&Co - Branch B</SelectItem>
                <SelectItem value="Kumar Traders">Kumar Traders</SelectItem>
                <SelectItem value="Reddy Enterprises">Reddy Enterprises</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volume & Measurement */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 relative">
              <Label className="text-xs text-slate-600">Volume</Label>
              <Input 
                type="number"
                value={formData.volume}
                onChange={(e) => setFormData({...formData, volume: e.target.value})}
                className="h-12 pr-12 border-slate-300"
                placeholder="50"
              />
              <VoiceButton field="volume" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Unit</Label>
              <Select value={formData.measurement} onValueChange={(v) => setFormData({...formData, measurement: v})}>
                <SelectTrigger className="h-12 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <div className="px-3 py-2 text-xs font-bold text-slate-500 sticky top-0 bg-white">
                    <Search className="w-3 h-3 inline mr-1" />
                    Grains/Pulses
                  </div>
                  <SelectItem value="Quintal">Quintal</SelectItem>
                  <SelectItem value="50kg Bag">50kg Bag</SelectItem>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Spices</div>
                  <SelectItem value="25kg Bag">25kg Bag</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Fruits/Vegetables</div>
                  <SelectItem value="Crate (20kg Mango)">Crate (20kg Mango)</SelectItem>
                  <SelectItem value="Box (10kg Tomato)">Box (10kg Tomato)</SelectItem>
                  <SelectItem value="Nos">Nos</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Coconut</div>
                  <SelectItem value="100 Nos">100 Nos</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Mushroom</div>
                  <SelectItem value="Tray (5kg)">Tray (5kg)</SelectItem>
                  <Separator />
                  <div className="px-3 py-2 text-xs font-bold text-slate-500">Oilseeds</div>
                  <SelectItem value="40kg Bag">40kg Bag</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Unit Price */}
          <div className="space-y-2 relative">
            <Label className="text-xs text-slate-600 flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              Unit Price (₹)
            </Label>
            <Input 
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
              className="h-12 pr-12 border-slate-300"
              placeholder="22"
            />
            <VoiceButton field="unitPrice" />
          </div>

          {/* Packaging Toggle */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Packaging Type
              </Label>
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
                  <SelectItem value="jute">Standard Jute - ₹5/bag</SelectItem>
                  <SelectItem value="pp">PP Bag - ₹3/bag</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <Select defaultValue="jute">
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jute">Jute</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="pp">PP</SelectItem>
                    <SelectItem value="gunny">Gunny</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number"
                  value={formData.packagingQty}
                  onChange={(e) => setFormData({...formData, packagingQty: e.target.value})}
                  className="h-12"
                  placeholder="Qty"
                />
                <Input 
                  type="number"
                  value={formData.packagingRate}
                  onChange={(e) => setFormData({...formData, packagingRate: e.target.value})}
                  className="h-12"
                  placeholder="Rate"
                />
              </div>
            )}
          </div>

          {/* Calculation Summary */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Product Amount:</span>
              <span className="text-slate-900 font-bold">₹{productAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Packaging:</span>
              <span className="text-slate-900 font-bold">₹{packagingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax (1%):</span>
              <span className="text-slate-900 font-bold">₹{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-slate-900 font-bold">Total Payable:</span>
              <span className="text-[#27AE60] font-bold text-lg">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* AI Risk */}
          <Alert className="border-green-500 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>AI Risk Assessment:</strong> Low Risk Transaction
            </AlertDescription>
          </Alert>

          {/* Status */}
          <Badge className="bg-amber-500 text-white w-full justify-center h-10 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Pending Authorization
          </Badge>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-slate-300"
              onClick={() => {}}
            >
              Save Draft
            </Button>
            <Button 
              className="h-12 bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A] font-bold"
              onClick={() => setCurrentScreen(2)}
            >
              2FA Authorize
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 2: Pending Authorization Table
  const Screen2 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <Clock className="w-6 h-6 text-amber-500" />
        {t.pendingAuth}
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button size="sm" variant="outline" className="gap-2 min-w-fit">
          <Calendar className="w-4 h-4" />
          Filter Date
        </Button>
        <Button size="sm" variant="outline" className="gap-2 min-w-fit">
          <User className="w-4 h-4" />
          Filter Buyer
        </Button>
        <Button size="sm" className="gap-2 min-w-fit bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A]">
          All Status
        </Button>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-900 font-bold">{formData.serialNo}</p>
              <p className="text-xs text-slate-600">{formData.buyer}</p>
            </div>
            <Badge className="bg-amber-500 text-white">
              Pending
            </Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Company</p>
              <p className="text-slate-900">{formData.company}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Volume</p>
              <p className="text-slate-900">{formData.volume} {formData.measurement}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Amount</p>
              <p className="text-[#27AE60] font-bold">₹{total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-amber-600 font-bold">1 Day Pending</p>
            </div>
          </div>

          <Alert className="border-amber-500 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Pre-due notification: Authorization required within 24 hours
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Zap className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm text-green-900 font-bold">Tradie Tokens</p>
              <p className="text-xs text-green-700">+5 for reviewing entry</p>
            </div>
            <Badge className="bg-green-600 text-white">+5</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                // Show edit modal
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit w/ Justify
            </Button>
            <Button 
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setCurrentScreen(3)}
            >
              Notify Buyer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Justification Modal Preview */}
      <Card className="border-2 border-dashed border-slate-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Edit with Justification (Modal)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Reason for Change</Label>
            <Select defaultValue="quality">
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quality">Quality Issue</SelectItem>
                <SelectItem value="measurement">Measurement Error</SelectItem>
                <SelectItem value="agreement">Agreement Change</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 relative">
            <Label className="text-xs">Detailed Notes</Label>
            <Textarea 
              placeholder="Enter detailed justification..."
              className="min-h-20 pr-12"
            />
            <VoiceButton field="justification" />
          </div>
          <Button className="w-full h-12 bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A]">
            Submit with 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 3: 2FA Auth Screen
  const Screen3 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-500" />
        2FA Authorization
      </h2>

      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <Shield className="w-16 h-16 text-blue-600 mx-auto" />
            <h3 className="text-slate-900">Authorize Bill Entry</h3>
            <p className="text-sm text-slate-600">
              Bill #{formData.serialNo}
            </p>
            <p className="text-[#27AE60] font-bold text-2xl">₹{total.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <Label className="text-sm text-slate-600 mb-3 block">Enter 6-Digit OTP</Label>
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
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Switch id="biometric" />
              <Label htmlFor="biometric" className="text-sm">Enable Biometric (₹50K+)</Label>
            </div>

            <Button 
              variant="link" 
              className="w-full text-blue-600"
              size="sm"
            >
              Resend OTP
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-slate-300"
              onClick={() => setCurrentScreen(2)}
            >
              Cancel
            </Button>
            <Button 
              className="h-12 bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
              onClick={() => {
                setShowWarning(true);
                setTimeout(() => {
                  setShowWarning(false);
                  setCurrentScreen(4);
                }, 3000);
              }}
            >
              Verify OTP
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning Popup */}
      {showWarning && (
        <Card className="border-4 border-red-500 bg-gradient-to-br from-red-50 to-pink-50 animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
              Precaution Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-red-500 bg-red-100">
              <Brain className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>AI Pattern Detected:</strong> Frequent changes detected (3+ this month)
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-300">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div className="flex-1">
                <p className="text-sm text-amber-900 font-bold">Rating Impact</p>
                <p className="text-xs text-amber-700">-0.5 stars (4.5 → 4.0)</p>
              </div>
            </div>

            <Alert className="border-purple-500 bg-purple-50">
              <Brain className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 text-sm">
                <strong>Cross-Warning:</strong> Agent X has 20% dispute rate. Consider alternatives for future transactions.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setShowWarning(false);
                setCurrentScreen(4);
              }}
            >
              Acknowledge & Continue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Screen 4: Buyer Approval Wait
  const Screen4 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
        {t.buyerWait}
      </h2>

      <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-orange-500 text-white animate-pulse h-10 px-4">
              Waiting Authorization
            </Badge>
            <div className="text-right">
              <p className="text-sm text-slate-600">Due in</p>
              <p className="text-2xl font-bold text-orange-600">3 Days</p>
            </div>
          </div>

          <Progress value={60} className="h-2" />

          <Alert className="border-orange-500 bg-orange-100">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-900 text-sm">
              <strong>Day 3 Alert:</strong> Pre-due notification sent to buyer
            </AlertDescription>
          </Alert>

          <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Bill Review</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Serial</p>
                <p className="text-slate-900 font-bold">{formData.serialNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Buyer</p>
                <p className="text-slate-900">{formData.buyer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Volume</p>
                <p className="text-slate-900">{formData.volume} {formData.measurement}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-[#27AE60] font-bold">₹{total.toFixed(2)}</p>
              </div>
            </div>
          </div>

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

          <Alert className="border-blue-500 bg-blue-50">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              <strong>AI Insight:</strong> Extend due date by 7 days? Risk increases to 5%
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-blue-500 text-blue-600"
            >
              Resend OTP
            </Button>
            <Button 
              className="h-12 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setCurrentScreen(5)}
            >
              Request Change
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 5: Bill Approval Screen
  const Screen5 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        {t.billApproval}
      </h2>

      <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Final Bill Review</span>
            <Badge className="bg-blue-500 text-white">Ready for Approval</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bill Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Serial</p>
              <p className="text-slate-900 font-bold">{formData.serialNo}</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="text-slate-900">27 Oct 2025</p>
            </div>
            <div className="p-3 bg-white rounded-lg col-span-2">
              <p className="text-xs text-slate-500 mb-1">Buyer / Company</p>
              <p className="text-slate-900 font-bold">{formData.buyer}</p>
              <p className="text-xs text-slate-600">{formData.company}</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 p-4 bg-white rounded-lg border border-green-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Financial Breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Product ({formData.volume} {formData.measurement} × ₹{formData.unitPrice}):</span>
              <span className="font-bold">₹{productAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Packaging ({formData.packagingQty} × ₹{formData.packagingRate}):</span>
              <span className="font-bold">₹{packagingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax (1%):</span>
              <span className="font-bold">₹{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-2">
              <span className="text-slate-900 font-bold">Total Payable:</span>
              <span className="text-[#27AE60] font-bold text-xl">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v})}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-3 py-2 text-xs font-bold text-slate-500">India</div>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="IMPS">IMPS</SelectItem>
                <SelectItem value="NEFT">NEFT</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="RTGS">RTGS</SelectItem>
                <Separator />
                <div className="px-3 py-2 text-xs font-bold text-slate-500">United States</div>
                <SelectItem value="ACH">ACH</SelectItem>
                <SelectItem value="Wire">Wire</SelectItem>
                <SelectItem value="Zelle">Zelle</SelectItem>
                <Separator />
                <div className="px-3 py-2 text-xs font-bold text-slate-500">Europe</div>
                <SelectItem value="SEPA">SEPA</SelectItem>
                <SelectItem value="iDEAL">iDEAL</SelectItem>
                <Separator />
                <div className="px-3 py-2 text-xs font-bold text-slate-500">Global</div>
                <SelectItem value="Crypto">Crypto (USDT)</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Due Date Type</Label>
            <Select value={formData.dueType} onValueChange={(v) => setFormData({...formData, dueType: v})}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regulatory">Regulatory (15 days - India Agri Act)</SelectItem>
                <SelectItem value="Association">Association (30 days - APEDA)</SelectItem>
                <SelectItem value="Agreed">Agreed (Custom - Mutual OTP)</SelectItem>
                <SelectItem value="Net-30">Net-30</SelectItem>
                <SelectItem value="Net-60">Net-60</SelectItem>
                <SelectItem value="Net-90">Net-90</SelectItem>
                <SelectItem value="COD">COD (Immediate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Token Reward */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border-2 border-amber-400">
            <Zap className="w-8 h-8 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 font-bold">Tradie Token Reward</p>
              <p className="text-xs text-amber-700">+10 tokens on approval</p>
            </div>
            <Badge className="bg-amber-600 text-white text-lg px-4 py-2">+10</Badge>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-red-500 text-red-600 hover:bg-red-50"
            >
              Reject
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

  // Screen 6: Confirmed Append - Ledger Sync
  const Screen6 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <Lock className="w-6 h-6 text-green-500" />
        {t.confirmed}
      </h2>

      <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-[#27AE60] text-white h-10 px-4 gap-2">
              <Lock className="w-4 h-4" />
              Confirmed & Immutable
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <QrCode className="w-4 h-4" />
              View QR
            </Button>
          </div>

          {/* Blockchain Info */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
            <div className="flex items-start gap-3">
              <Shield className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-sm text-purple-900 font-bold">Blockchain Verification</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Transaction Hash:</span>
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
                </div>
              </div>
              <QrCode className="w-16 h-16 text-purple-600" />
            </div>
          </div>

          {/* Locked Fields */}
          <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              Immutable Record
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Serial</p>
                  <p className="text-slate-900">{formData.serialNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Buyer</p>
                  <p className="text-slate-900">{formData.buyer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Volume</p>
                  <p className="text-slate-900">{formData.volume} {formData.measurement}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-[#27AE60] font-bold">₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ledger Sync Table */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Auto-Sync to Yard Ledger
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span className="text-slate-600">Product Amount</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">₹{productAmount.toFixed(2)}</span>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span className="text-slate-600">Tax (1%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">₹{tax.toFixed(2)}</span>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span className="text-slate-600">Agent Commission (1%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">₹{(total * 0.01).toFixed(2)}</span>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-100 rounded border border-green-300">
                <span className="text-green-900 font-bold">Bank Advance</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-900 font-bold">Reflected</span>
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Risk Score */}
          <Alert className="border-green-500 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>Transaction Secure:</strong> Risk Score 2% - All validations passed
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="w-3 h-3" />
              Excel
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="w-3 h-3" />
              Share
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => setCurrentScreen(7)}
            >
              View Warnings
            </Button>
            <Button 
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setCurrentScreen(8)}
            >
              View Insights
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Screen 7: Warnings & Rating System
  const Screen7 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        {t.warnings}
      </h2>

      {/* Buyer Pattern Warning */}
      <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Buyer Pattern Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-500 bg-red-100">
            <Brain className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900 text-sm">
              <strong>Multiple Changes Detected:</strong> {formData.buyer} has made 5 changes in the past month
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-300">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
              <Star className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-bold">Rating Drop</p>
              <p className="text-xs text-slate-600">4.5 → 4.0 (-0.5 stars)</p>
            </div>
            <Badge className="bg-amber-500 text-white">-0.5</Badge>
          </div>

          <div className="space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900 font-bold">Recommendation:</p>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>Review next transaction with increased scrutiny</li>
              <li>Verify measurement accuracy before weighing</li>
              <li>Consider requesting advance documentation</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Agent Cross-Warning */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Agent Performance Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-purple-500 bg-purple-100">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-900 text-sm">
              <strong>AI Cross-Warning:</strong> Agent X has 20% dispute rate across multiple buyers
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label className="text-sm text-slate-900">Dispute Rate</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">20% (High Risk)</span>
                <span className="text-red-600 font-bold">Critical</span>
              </div>
              <Progress value={20} className="h-2 bg-red-200" />
            </div>
          </div>

          <div className="space-y-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900 font-bold">Suggested Actions:</p>
            <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
              <li>Consider alternative agents for future transactions</li>
              <li>Request additional training for Agent X</li>
              <li>Increase supervision on Agent X's entries</li>
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 border-purple-500 text-purple-600"
          >
            View Agent History
          </Button>
        </CardContent>
      </Card>

      {/* Justification History */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Justification History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { date: '27 Oct 14:35', reason: 'Quality Issue', change: 'Weight: 5000kg → 5100kg' },
            { date: '26 Oct 10:20', reason: 'Agreement Change', change: 'Price: ₹22 → ₹21' },
            { date: '25 Oct 16:45', reason: 'Measurement Error', change: 'Bags: 48 → 50' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">{item.reason}</Badge>
                <span className="text-slate-500">{item.date}</span>
              </div>
              <p className="text-slate-900">{item.change}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12"
        >
          Acknowledge
        </Button>
        <Button 
          className="h-12 bg-red-600 hover:bg-red-700 text-white"
        >
          Escalate Dispute
        </Button>
      </div>

      <Button 
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setCurrentScreen(8)}
      >
        Continue to Insights
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  // Screen 8: Insights Dashboard
  const Screen8 = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <h2 className="text-slate-900 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        {t.insights}
      </h2>

      {/* AI Insights Card */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-amber-500 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900 text-sm">
              <strong>Buyer Patterns:</strong> 3 buyers with 3+ changes/month detected (Medium Risk)
            </AlertDescription>
          </Alert>

          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900 text-sm">
              <strong>Agent Patterns:</strong> Agent X shows 20% dispute rate (High Risk)
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-500 bg-blue-50">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              <strong>Suggestion:</strong> Lock buyer preferences for stability. Enable auto-validation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-xs text-slate-600">Total Payables</p>
            </div>
            <p className="text-slate-900 text-xl font-bold">₹12.45M</p>
            <p className="text-xs text-green-600">+12% this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-slate-600">Pending Amount</p>
            </div>
            <p className="text-slate-900 text-xl font-bold">₹234K</p>
            <p className="text-xs text-amber-600">3 due today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-slate-600">Avg Transaction</p>
            </div>
            <p className="text-slate-900 text-xl font-bold">₹85.8K</p>
            <p className="text-xs text-blue-600">Healthy</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-xs text-slate-600">Risk Alerts</p>
            </div>
            <p className="text-slate-900 text-xl font-bold">3</p>
            <p className="text-xs text-red-600">1 High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Tradie Wallet */}
      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Tradie Wallet Balance</p>
                <p className="text-slate-900 text-2xl font-bold">{tokens}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-bold">+45 today</p>
              <p className="text-xs text-slate-600">+380 this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Methods Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { method: 'UPI', count: 45, color: 'bg-green-500' },
            { method: 'NEFT', count: 28, color: 'bg-blue-500' },
            { method: 'Cheque', count: 15, color: 'bg-amber-500' },
            { method: 'RTGS', count: 12, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.method} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">{item.method}</span>
                <span className="text-slate-900 font-bold">{item.count} transactions</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color}`}
                  style={{ width: `${(item.count / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12 gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
        <Button 
          variant="outline" 
          className="h-12 gap-2"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Button 
        className="w-full h-12 bg-[#F4D03F] hover:bg-[#F4D03F]/90 text-[#4A4A4A] font-bold"
        onClick={() => setCurrentScreen(1)}
      >
        Back to Dashboard
      </Button>
    </div>
  );

  const screens = {
    1: <Screen1 />,
    2: <Screen2 />,
    3: <Screen3 />,
    4: <Screen4 />,
    5: <Screen5 />,
    6: <Screen6 />,
    7: <Screen7 />,
    8: <Screen8 />,
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
              <p className="text-xs text-slate-600">Buyer Authorization Flow</p>
            </div>
            <TokenDisplay />
          </div>
          <LanguageToggle />
          <ScreenNavigation />
        </div>

        {/* Content */}
        <div className="p-4">
          {screens[currentScreen]}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 p-4 text-center">
          <p className="text-white text-xs">
            Screen {currentScreen}/8 • Multi-Lang • Voice • Blockchain
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Audited: Immutable • 2FA • AI Warnings
          </p>
        </div>
      </div>

      {/* Documentation Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-xl border-2 border-blue-500">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-slate-900">Prototype Info</p>
            </div>
            <p className="text-xs text-slate-600">
              8 reactive screens with mobile-first design, multi-language support, voice input, and blockchain integration.
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="outline" className="text-xs">2FA Auth</Badge>
              <Badge variant="outline" className="text-xs">AI Risk</Badge>
              <Badge variant="outline" className="text-xs">NFT</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
