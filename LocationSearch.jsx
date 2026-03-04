import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StripeConnectCard() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ['stripe-connect-status'],
    queryFn: async () => {
      const res = await base44.functions.invoke('stripeConnectStatus', {});
      return res.data;
    },
  });

  const handleConnect = async () => {
    setLoading(true);
    try {
      const currentUrl = window.location.href.split('?')[0];
      const res = await base44.functions.invoke('stripeConnectOnboard', {
        return_url: currentUrl + '?stripe=connected',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      alert(res.data?.error || 'Failed to connect Stripe. Please try again.');
    } catch (err) {
      alert('Error connecting to Stripe: ' + (err?.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  // Check URL for stripe callback
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('stripe') === 'connected') {
    queryClient.invalidateQueries({ queryKey: ['stripe-connect-status'] });
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-400">Checking payment setup...</span>
      </div>
    );
  }

  const isActive = status?.connected && status?.charges_enabled;
  const isPending = status?.connected && !status?.charges_enabled;

  return (
    <div className={`rounded-2xl p-5 mb-6 shadow-sm border ${isActive ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-green-100' : 'bg-blue-50'}`}>
            <CreditCard className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-blue-500'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
              {isActive ? 'Stripe Connected' : 'Connect Stripe to accept payments'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isActive
                ? 'Your account is active. Payments from catalog go directly to you.'
                : isPending
                  ? 'Your account setup is incomplete. Please finish onboarding.'
                  : 'Connect your Stripe account so clients can buy products from your catalog and you receive payments directly.'
              }
            </p>
          </div>
        </div>

        {isActive ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="shrink-0 bg-blue-500 hover:bg-blue-600 rounded-full px-5 text-xs font-semibold"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                {isPending ? 'Continue Setup' : 'Connect Stripe'}
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </>
            )}
          </Button>
        )}
      </div>

      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Your Stripe account setup is not complete. Customers won't be able to buy until you finish.</span>
        </div>
      )}
    </div>
  );
}