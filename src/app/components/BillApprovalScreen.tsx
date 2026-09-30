import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { 
  CheckCircle2, XCircle, Shield, Sparkles, Coins, QrCode,
  User, Package, DollarSign, CreditCard, Calendar, FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { motion } from 'motion/react';

interface BillApprovalScreenProps {
  onApprove?: () => void;
  onReject?: () => void;
}

export function BillApprovalScreen({ onApprove, onReject }: BillApprovalScreenProps) {
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const record = {
    serialNo: 'TRD-2025-B001',
    date: '2025-10-27',
    buyerName: 'Rajesh Kumar',
    company: 'Kumar Traders Ltd',
    commodity: 'Wheat',
    quantity: '50 Quintal',
    weight: '5000 kg',
    unitPrice: '₹22.00',
    productAmount: '₹1,100.00',
    packagingAmount: '₹50.00',
    tax: '₹11.50',
    totalPayable: '₹1,161.50',
    paymentMethod: 'Bank Wire (NEFT)',
    paymentDetails: 'A/C: 123456789, IFSC: HDFC0001234',
    dueDateType: 'Regulatory (15 days India Agri Act)',
    dueDate: '2025-11-11',
    tradieReward: 10,
  };

  const handleApprovalClick = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowOTPDialog(true);
  };

  const confirmApproval = () => {
    if (otp.length === 6) {
      setShowOTPDialog(false);
      if (approvalAction === 'approve') {
        setShowSuccess(true);
        setTimeout(() => {
          if (onApprove) onApprove();
        }, 2000);
      } else {
        if (onReject) onReject();
      }
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Bill Approval Screen
          </h1>
          <p className="text-slate-600 mt-1">Final review and 2FA authorization</p>
        </div>
        <Badge className="bg-blue-500 text-white gap-1 text-base px-4 py-2">
          <FileText className="w-4 h-4" />
          Ready for Approval
        </Badge>
      </div>

      {/* Full Bill Review */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle>Full Bill Review - Final Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Serial & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Serial Number</p>
              <p className="text-slate-900">{record.serialNo}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="text-slate-900">{record.date}</p>
            </div>
          </div>

          <Separator />

          {/* Buyer Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-slate-900">Buyer Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-slate-900">{record.buyerName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Company</p>
                <p className="text-slate-900">{record.company}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commodity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="text-slate-900">Commodity Details</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Commodity</p>
                <p className="text-slate-900">{record.commodity}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Quantity</p>
                <p className="text-slate-900">{record.quantity}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Weight</p>
                <p className="text-slate-900">{record.weight}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <h3 className="text-slate-900">Financial Details</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-green-700">Unit Price</p>
                  <p className="text-green-900">{record.unitPrice}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-green-700">Product Amount</p>
                  <p className="text-green-900">{record.productAmount}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-blue-700">Packaging</p>
                  <p className="text-blue-900">{record.packagingAmount}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-xs text-purple-700">Tax (1%)</p>
                  <p className="text-purple-900">{record.tax}</p>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-4 border-amber-300 text-center">
                <p className="text-sm text-amber-700 mb-1">Total Payable</p>
                <p className="text-amber-900">{record.totalPayable}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment & Debit Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-slate-900">Payment & Debit Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Payment Method</p>
                <p className="text-slate-900">{record.paymentMethod}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Account Details</p>
                <p className="text-slate-900 text-sm">{record.paymentDetails}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900">Due Date Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Due Date Type</p>
                <p className="text-slate-900">{record.dueDateType}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Payment Due</p>
                <p className="text-slate-900">{record.dueDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tradie Reward */}
      <Card className="border-l-4 border-l-[#F4D03F] bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-[#F4D03F]" />
              <div>
                <p className="text-sm text-slate-600">Tradie Tokens Reward</p>
                <p className="text-slate-900">+{record.tradieReward} tokens on approval</p>
              </div>
            </div>
            <Badge className="bg-[#F4D03F] text-[#4A4A4A] text-base px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              +{record.tradieReward}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1 gap-2 border-red-500 text-red-600 hover:bg-red-50"
          onClick={() => handleApprovalClick('reject')}
        >
          <XCircle className="w-5 h-5" />
          Reject Bill (Cascade Alert)
        </Button>
        <Button 
          size="lg" 
          className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          onClick={() => handleApprovalClick('approve')}
        >
          <Shield className="w-5 h-5" />
          Approve & Append with 2FA
        </Button>
      </div>

      {/* 2FA Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${approvalAction === 'approve' ? 'text-green-600' : 'text-red-600'}`} />
              2FA Authorization - {approvalAction === 'approve' ? 'Approve' : 'Reject'} Bill
            </DialogTitle>
            <DialogDescription>
              {record.serialNo} - {record.buyerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className={`${approvalAction === 'approve' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <Shield className={`h-4 w-4 ${approvalAction === 'approve' ? 'text-green-600' : 'text-red-600'}`} />
              <AlertDescription className={approvalAction === 'approve' ? 'text-green-800' : 'text-red-800'}>
                {approvalAction === 'approve' 
                  ? 'OTP sent to your registered mobile. This will append the bill to the confirmed ledger (immutable).'
                  : 'OTP sent to your registered mobile. This will reject the bill and trigger cascade alerts.'}
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

            {approvalAction === 'approve' && (
              <div className="p-4 bg-[#F4D03F] bg-opacity-20 rounded-lg text-center border-2 border-[#F4D03F]">
                <Coins className="w-8 h-8 text-[#F4D03F] mx-auto mb-2" />
                <p className="text-sm text-slate-600">You will receive</p>
                <p className="text-slate-900">+{record.tradieReward} Tradie Tokens</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowOTPDialog(false)}>
                Cancel
              </Button>
              <Button 
                disabled={otp.length !== 6}
                className={`gap-2 ${approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={confirmApproval}
              >
                {approvalAction === 'approve' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                Confirm {approvalAction === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Animation */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-slate-900 mb-2">Bill Approved!</h2>
            <p className="text-slate-600 mb-4">Appending to confirmed ledger...</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.5, repeat: Infinity, duration: 1 }}
            >
              <Badge className="bg-[#F4D03F] text-[#4A4A4A] text-xl px-6 py-3">
                <Sparkles className="w-6 h-6 mr-2" />
                +{record.tradieReward} Tokens
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
