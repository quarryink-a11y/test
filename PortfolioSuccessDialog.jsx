import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, ArrowLeft, Rocket, Loader2 } from 'lucide-react';

const features = [
  'Full access to all admin features',
  'Custom domain support',
  'Unlimited portfolio uploads',
  'Analytics dashboard',
  'Booking form with email notifications',
  'Online shop & catalog',
];

export default function TrialStep({ onBack, onStartTrial }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await onStartTrial();
    } catch (e) {
      console.error('Trial start error:', e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to templates
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're almost there!</h1>
            <p className="text-gray-500">Start your 14-day free trial — no credit card required.</p>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">What's included:</p>
            <div className="space-y-2">
              {features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-base gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Starting...</>
            ) : (
              <><Rocket className="w-5 h-5" /> Start 14-Day Free Trial</>
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            No payment needed now. You can upgrade anytime later.
          </p>
        </div>
      </div>
    </div>
  );
}