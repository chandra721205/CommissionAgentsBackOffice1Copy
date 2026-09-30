import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { EntityRole } from '../types/business-entity';

interface OTPAuthorizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  userRole: EntityRole;
  userName: string;
  action: string;
  dataCategory?: string;
}

export function OTPAuthorizationDialog({
  isOpen,
  onClose,
  onVerify,
  userRole,
  userName,
  action,
  dataCategory
}: OTPAuthorizationDialogProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setError('');
      setSuccess(false);
      setTimeLeft(180);
    }
  }, [isOpen]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // In production, this would validate against the backend
    // For demo, we'll accept '123456' or generate a random validation
    if (otp === '123456' || Math.random() > 0.3) {
      setSuccess(true);
      setError('');
      setTimeout(() => {
        onVerify(otp);
        onClose();
      }, 1000);
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate OTP resend
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(180);
      setError('');
      setOtp('');
      alert('New OTP sent to your registered mobile number');
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">OTP Authorization Required</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Two-factor authentication for secure operations
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-600">User</p>
                <p>{userName}</p>
              </div>
              <div>
                <p className="text-slate-600">Role</p>
                <p className="text-blue-700">{userRole}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-600">Action</p>
                <p>{action}</p>
              </div>
              {dataCategory && (
                <div className="col-span-2">
                  <p className="text-slate-600">Data Category</p>
                  <p className="text-orange-700">{dataCategory}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>OTP expires in</span>
            </div>
            <div className={`${timeLeft < 30 ? 'text-red-600' : 'text-green-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp">Enter 6-Digit OTP</Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setOtp(value);
                setError('');
              }}
              placeholder="000000"
              className="text-center text-2xl tracking-widest"
              disabled={success || timeLeft === 0}
            />
            <p className="text-xs text-slate-500">
              OTP sent to your registered mobile number ending with ****56
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                OTP verified successfully! Processing...
              </AlertDescription>
            </Alert>
          )}

          {timeLeft === 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                OTP has expired. Please request a new one.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending || success || timeLeft > 150}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            Resend OTP
          </Button>
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || success || timeLeft === 0}
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Shield className="w-4 h-4" />
            Verify & Authorize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
