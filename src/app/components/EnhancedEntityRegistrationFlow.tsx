import React, { useState } from 'react';
import { EntityRolePermissionsPrototype } from './EntityRolePermissionsPrototype';
import { RegistrationConfirmationScreen } from './RegistrationConfirmationScreen';
import { RegistrationSuccessScreen } from './RegistrationSuccessScreen';
import { ShareBasedPermissionsScreen } from './ShareBasedPermissionsScreen';
import { ChangeRequestScreen } from './ChangeRequestScreen';

type FlowStep = 
  | 'entity-setup' // Screens 1-8 (existing prototype)
  | 'confirmation' // Screen 9: Registration Confirmation & Lock
  | 'success' // Screen 10: Registration Success & Status
  | 'permissions' // Screen 11: Share-Based Proportionate Permissions
  | 'change-request' // Screen 12: Change Request & Verification
  | 'operations'; // Final: Operations Dashboard

export function EnhancedEntityRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('entity-setup');
  const [entityData, setEntityData] = useState({
    id: 'ENT-2025-001234',
    type: 'Partnership',
    scale: 'MSME (₹50-250Cr)',
    name: 'PSR & CO Partnership',
    brands: ['PSR Premium', 'PSR Organic'],
    rolesCount: 4,
    registeredAt: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  });

  const [changeQuota] = useState({
    total: 3,
    used: 0,
    remaining: 3,
  });

  const [members] = useState([
    {
      id: 'M001',
      name: 'Rajesh Kumar',
      role: 'Managing Partner',
      share: 50,
      phone: '+91 98765 43210',
    },
    {
      id: 'M002',
      name: 'Priya Sharma',
      role: 'Partner',
      share: 50,
      phone: '+91 98765 43211',
    },
    {
      id: 'M003',
      name: 'Suresh Rao',
      role: 'Manager (Ops)',
      share: 0,
      phone: '+91 98765 43212',
    },
    {
      id: 'M004',
      name: 'Ramesh',
      role: 'Salesman',
      share: 0,
      phone: '+91 98765 43213',
    },
  ]);

  const handleEntitySetupComplete = () => {
    setCurrentStep('confirmation');
  };

  const handleConfirmRegistration = () => {
    setCurrentStep('success');
  };

  const handleProceedToPermissions = () => {
    setCurrentStep('permissions');
  };

  const handleRequestChange = () => {
    setCurrentStep('change-request');
  };

  const handlePermissionsSaved = () => {
    setCurrentStep('operations');
  };

  const handleChangeSubmitted = (data: any) => {
    console.log('Change request submitted:', data);
    // In real app, navigate to verification status screen
    setCurrentStep('success');
  };

  const handleCancelChange = () => {
    setCurrentStep('success');
  };

  const handleProceedWithoutChanges = () => {
    setCurrentStep('permissions');
  };

  const handleBackToSetup = () => {
    setCurrentStep('entity-setup');
  };

  // Render current step
  switch (currentStep) {
    case 'entity-setup':
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enhanced Business Entity Registration
              </h1>
              <p className="text-gray-600">
                Complete Steps 1-8 to proceed to Registration Lock
              </p>
            </div>
            <EntityRolePermissionsPrototype />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleEntitySetupComplete}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white rounded-lg shadow-lg font-semibold text-lg transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
                <span className="relative z-10">
                  Complete Setup & Proceed to Registration Lock →
                </span>
              </button>
            </div>
          </div>
        </div>
      );

    case 'confirmation':
      return (
        <RegistrationConfirmationScreen
          entityData={entityData}
          members={members}
          onConfirm={handleConfirmRegistration}
          onBack={handleBackToSetup}
        />
      );

    case 'success':
      return (
        <RegistrationSuccessScreen
          entityData={entityData}
          onProceed={handleProceedToPermissions}
          onRequestChange={handleRequestChange}
        />
      );

    case 'permissions':
      return (
        <ShareBasedPermissionsScreen
          entityData={entityData}
          members={members}
          onSave={handlePermissionsSaved}
          onProceed={handlePermissionsSaved}
        />
      );

    case 'change-request':
      return (
        <ChangeRequestScreen
          entityData={entityData}
          changeQuota={changeQuota}
          members={members}
          onSubmit={handleChangeSubmitted}
          onCancel={handleCancelChange}
          onProceedWithoutChanges={handleProceedWithoutChanges}
        />
      );

    case 'operations':
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              🎉 All Set! Entity is Active
            </h1>
            <p className="text-xl text-gray-600">
              Your business entity is now fully registered, locked, and operational.
            </p>
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-green-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {entityData.name}
              </h2>
              <div className="space-y-2 text-left">
                <p className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">ACTIVE & LOCKED</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-600">Entity ID:</span>
                  <span className="font-semibold text-gray-900">{entityData.id}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-600">Changes Remaining:</span>
                  <span className="font-semibold text-[#D4AF37]">{changeQuota.remaining}/3</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-600">Permissions:</span>
                  <span className="font-semibold text-gray-900">Proportionately Assigned</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentStep('permissions')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg font-semibold"
              >
                View Permissions Setup
              </button>
              <button
                onClick={() => setCurrentStep('change-request')}
                className="w-full px-6 py-3 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 rounded-lg font-semibold"
              >
                Request Entity Change
              </button>
              <button
                onClick={() => setCurrentStep('entity-setup')}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold"
              >
                Back to Entity Setup
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
