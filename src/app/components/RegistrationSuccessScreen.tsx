import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  CheckCircle2, 
  Lock, 
  Calendar, 
  Hash, 
  Users, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  FileEdit
} from 'lucide-react';

interface RegistrationSuccessScreenProps {
  entityData: {
    id: string;
    type: string;
    name: string;
    registeredAt: string;
    rolesCount: number;
  };
  onProceed: () => void;
  onRequestChange: () => void;
}

export function RegistrationSuccessScreen({
  entityData,
  onProceed,
  onRequestChange,
}: RegistrationSuccessScreenProps) {
  const changeQuota = {
    total: 3,
    used: 0,
    remaining: 3,
  };

  const quotaPercentage = (changeQuota.remaining / changeQuota.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Registration Successful
            </h1>
          </div>
          <p className="text-gray-600">
            Entity locked and activated. Monitor your change quota carefully.
          </p>
        </div>

        {/* Success Card */}
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-green-900">
                ✅ REGISTRATION COMPLETE
              </h2>
              <div className="space-y-2 text-green-800">
                <p className="flex items-center justify-center gap-2">
                  🏢 <span className="font-semibold">{entityData.name}</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Status: <strong>LOCKED & ACTIVE</strong></span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Registered: {entityData.registeredAt}</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>Entity ID: {entityData.id}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Quota Dashboard */}
        <Card className="border-2 border-[#D4AF37]/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-[#D4AF37]" />
              Change Management Quota
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Allowed</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">changes</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Used</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">changes</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-3xl font-bold text-[#D4AF37]">3</p>
                <p className="text-xs text-gray-500">changes</p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={quotaPercentage} className="h-3" />
              <p className="text-sm text-center text-gray-600">
                {quotaPercentage}% of change quota remaining
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Last Change:</span>
                <span className="font-semibold text-gray-900">Never</span>
              </p>
              <p className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Change History:</span>
                <span className="font-semibold text-gray-900">Empty</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Roles</p>
              <p className="text-2xl font-bold text-gray-900">{entityData.rolesCount}</p>
              <p className="text-xs text-gray-500">Assigned</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Security</p>
              <p className="text-lg font-bold text-gray-900">2-Member</p>
              <p className="text-xs text-gray-500">OTP Required</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-bold text-gray-900">ACTIVE</p>
              <p className="text-xs text-gray-500">& LIVE</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              📘 What's Next?
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Entity is now active for operations</span>
              </p>
              <p className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Configure business permissions (Next Step)</span>
              </p>
              <p className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Set share-based proportionate access</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600" />
                <span>Changes require verification (48-72 hrs)</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600" />
                <span>Use changes wisely - only 3 lifetime</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Warning Notice */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="font-bold text-yellow-900">
                  ⚠️ CHANGE POLICY REMINDER
                </h3>
                <div className="space-y-2 text-sm text-yellow-800">
                  <p>• 3 changes allowed (lifetime)</p>
                  <p>• Each change requires:</p>
                  <ul className="ml-6 space-y-1">
                    <li>✓ App verifier appointment (₹5,000 fee)</li>
                    <li>✓ Complete KYC re-verification</li>
                    <li>✓ 2-member OTP approval</li>
                    <li>✓ 48-72 hour processing</li>
                  </ul>
                  <p>• Zero changes = No fees, immediate operation</p>
                  <p className="font-semibold">• Plan changes carefully!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onProceed}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg py-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
            <span className="relative z-10 text-lg flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Proceed to Permissions Setup
              <span className="text-sm opacity-90">(No Changes - Continue Operations)</span>
            </span>
          </Button>

          <Button
            onClick={onRequestChange}
            variant="outline"
            className="w-full border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-6"
          >
            <FileEdit className="w-5 h-5 mr-2" />
            🔄 Request Change (3/3 Remaining)
            <span className="text-sm ml-2 opacity-75">(Requires Verification)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
