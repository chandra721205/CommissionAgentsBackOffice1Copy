// TRADIE Tokens Wallet Component
// Display token balance, history, and sparkle burst animations

import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Gift, Calendar, X, Sparkles } from 'lucide-react';

interface TradieTokensWalletProps {
  tokens: {
    balance: number;
    history: Array<{
      type: string;
      amount: number;
      date: string;
    }>;
  };
  onClose: () => void;
}

export function TradieTokensWallet({ tokens, onClose }: TradieTokensWalletProps) {
  const [showBurst, setShowBurst] = useState(false);

  // Trigger burst animation on mount
  useEffect(() => {
    setShowBurst(true);
    const timer = setTimeout(() => setShowBurst(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return <Gift className="h-4 w-4" />;
      case 'daily':
        return <Calendar className="h-4 w-4" />;
      case 'trade':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bg-purple-100 text-purple-700 ring-purple-200';
      case 'daily':
        return 'bg-blue-100 text-blue-700 ring-blue-200';
      case 'trade':
        return 'bg-green-100 text-green-700 ring-green-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkle Burst Animation */}
        {showBurst && (
          <div className="pointer-events-none absolute inset-0 z-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${50 + Math.random() * 40 - 20}%`,
                  top: `${30 + Math.random() * 40 - 20}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: '2s',
                }}
              >
                <Sparkles
                  className="h-6 w-6 text-yellow-400"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.8))',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-0 top-0 rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Coins className="h-5 w-5" />
              <span className="text-sm font-medium">TRADIE Tokens</span>
            </div>
            <div className="mb-4 text-5xl font-bold text-white">{tokens.balance}</div>
            <div className="text-sm text-white/80">Your current balance</div>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700">
            Earn More Tokens
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-amber-200">
              <div className="mb-1 text-xl font-bold text-purple-600">+50</div>
              <div className="text-xs text-slate-600">Signup</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-blue-200">
              <div className="mb-1 text-xl font-bold text-blue-600">+5</div>
              <div className="text-xs text-slate-600">Daily Login</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-green-200">
              <div className="mb-1 text-xl font-bold text-green-600">+10</div>
              <div className="text-xs text-slate-600">Per Trade</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-4">
          <div className="mb-3 text-sm font-bold text-slate-900">Recent Activity</div>
          <div className="space-y-2">
            {tokens.history.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ring-1 ${getTypeColor(transaction.type)}`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium capitalize text-slate-900">
                      {transaction.type} Bonus
                    </div>
                    <div className="text-xs text-slate-500">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">+{transaction.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-xs text-slate-500">
            Tokens can be redeemed for platform credits, premium features, or discounts on transactions.
          </div>
          <button className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105">
            Redeem Tokens (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}

export default TradieTokensWallet;
