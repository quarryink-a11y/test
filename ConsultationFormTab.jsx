import React from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing</h2>
        <p className="text-sm text-gray-500">Manage your subscription and payment details</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">Free Plan</h3>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
            </div>
            <p className="text-sm text-gray-500">Basic plan with core features</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Portfolio up to 20 works</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Core modules (Events, FAQ, Reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 text-gray-300" />
            <span className="text-gray-400">Custom domain (Pro)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 text-gray-300" />
            <span className="text-gray-400">Online shop (Pro)</span>
          </div>
        </div>

        <Button className="bg-blue-500 hover:bg-blue-600" disabled>
          Upgrade to Pro — Coming soon
        </Button>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Payment method</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">No payment method connected</span>
        </div>
        <Button variant="outline" className="mt-3" size="sm" disabled>
          Add card — Coming soon
        </Button>
      </div>
    </div>
  );
}