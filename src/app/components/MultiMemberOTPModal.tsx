import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface MemberOTPData {
  memberId: string;
  memberName: string;
  memberRole: string;
  sharePercentage?: number;
  phoneNumber: string;
  otp: string;
  verified: boolean;
}

interface MultiMemberOTPModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: () => void;
  members: Array<{
    id: string;
    name: string;
    role: string;
    share?: number;
    phone: string;
  }>;
  requestType: string;
  requiredMembers?: number;
}

export function MultiMemberOTPModal({
  open,
  onClose,
  onVerify,
  members,
  requestType,
  requiredMembers = 2,
}: MultiMemberOTPModalProps) {
  const [memberOTPs, setMemberOTPs] = useState<MemberOTPData[]>([]);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (open) {
      // Initialize OTP data for each member
      setMemberOTPs(
        members.slice(0, requiredMembers).map((member) => ({
          memberId: member.id,
          memberName: member.name,
          memberRole: member.role,
          sharePercentage: member.share,
          phoneNumber: member.phone,
          otp: '',
          verified: false,
        }))
      );
      setCountdown(300);
      setResendDisabled(true);
      
      // Simulate sending OTPs
      toast.success(`OTPs sent to ${requiredMembers} members`, {
        description: 'Please check your registered mobile numbers',
      });
    }
  }, [open, members, requiredMembers]);

  useEffect(() => {
    if (!open || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (memberId: string, value: string) => {
    setMemberOTPs((prev) =>
      prev.map((m) => (m.memberId === memberId ? { ...m, otp: value } : m))
    );

    // Auto-verify when 6 digits entered (mock verification)
    if (value.length === 6) {
      setTimeout(() => {
        setMemberOTPs((prev) =>
          prev.map((m) =>
            m.memberId === memberId ? { ...m, verified: true } : m
          )
        );
        toast.success(`OTP verified for ${memberOTPs.find((m) => m.memberId === memberId)?.memberName}`);
      }, 500);
    }
  };

  const handleResendOTPs = () => {
    setCountdown(300);
    setResendDisabled(true);
    setMemberOTPs((prev) =>
      prev.map((m) => ({ ...m, otp: '', verified: false }))
    );
    toast.success('OTPs resent to all members');
  };

  const handleVerifyAll = () => {
    const allVerified = memberOTPs.every((m) => m.verified);
    
    if (!allVerified) {
      toast.error('All member OTPs must be verified', {
        description: 'Please ensure all members have entered their OTPs',
      });
      return;
    }

    toast.success('Multi-member verification successful!', {
      description: `${requiredMembers} members verified simultaneously`,
    });
    
    setTimeout(() => {
      onVerify();
      onClose();
    }, 1000);
  };

  const allVerified = memberOTPs.every((m) => m.verified);
  const anyEntered = memberOTPs.some((m) => m.otp.length > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-[#D4AF37]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            Multi-Member OTP Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Type */}
          <div className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF] p-4 rounded-lg">
            <p className="text-sm text-gray-600">Verification Required For:</p>
            <p className="font-semibold text-gray-900">{requestType}</p>
          </div>

          {/* Member OTP Inputs */}
          <div className="space-y-4">
            {memberOTPs.map((member, index) => (
              <div
                key={member.memberId}
                className={`p-4 rounded-lg border-2 transition-all ${
                  member.verified
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {member.memberName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.memberRole}
                      {member.sharePercentage !== undefined &&
                        ` • ${member.sharePercentage}% share`}
                    </p>
                  </div>
                  {member.verified && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <InputOTP
                    maxLength={6}
                    value={member.otp}
                    onChange={(value) => handleOTPChange(member.memberId, value)}
                    disabled={member.verified}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className={member.verified ? 'bg-green-100' : ''} />
                      <InputOTPSlot index={1} className={member.verified ? 'bg-green-100' : ''} />
                      <InputOTPSlot index={2} className={member.verified ? 'bg-green-100' : ''} />
                      <InputOTPSlot index={3} className={member.verified ? 'bg-green-100' : ''} />
                      <InputOTPSlot index={4} className={member.verified ? 'bg-green-100' : ''} />
                      <InputOTPSlot index={5} className={member.verified ? 'bg-green-100' : ''} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  OTP sent to {member.phoneNumber}
                </p>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Simultaneous Verification Required</p>
                <p className="text-xs text-blue-700 mt-1">
                  All {requiredMembers} member OTPs must be entered for approval.
                  This ensures mutual consent for {requestType.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Expires in: {formatTime(countdown)}</span>
            </div>
            {countdown === 0 && (
              <span className="text-red-600 font-semibold">OTPs Expired</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleResendOTPs}
              disabled={resendDisabled}
              className="flex-1 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
            >
              Resend OTPs
            </Button>
            <Button
              onClick={handleVerifyAll}
              disabled={!allVerified || countdown === 0}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white shadow-lg disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify All
            </Button>
          </div>

          {/* Verification Progress */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Verification Progress</span>
              <span className="font-semibold text-gray-900">
                {memberOTPs.filter((m) => m.verified).length}/{requiredMembers}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(memberOTPs.filter((m) => m.verified).length / requiredMembers) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
