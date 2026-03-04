import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, MessageSquare, ShoppingBag, DollarSign, Users, ClipboardList, Package, ArrowLeft, Info } from 'lucide-react';
import StatCard from '@/components/analytics/StatCard';
import PeriodSelector from '@/components/analytics/PeriodSelector';
import InquiriesChart from '@/components/analytics/InquiriesChart';
import OrdersChart from '@/components/analytics/OrdersChart';
import InquiriesList from '@/components/analytics/InquiriesList';
import { subDays, isAfter } from 'date-fns';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'inquiries', label: 'Inquiries', icon: ClipboardList },
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodDays, setPeriodDays] = useState(30);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();
  const isOnboardingComplete = user?.onboarding_status === 'onboarding_complete';

  React.useEffect(() => { completeModule('analytics'); }, []);

  const { data: allInquiries = [], isLoading: loadingInq } = useQuery({
    queryKey: ['inquiries', user?.email],
    queryFn: () => base44.entities.Inquiry.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const { data: allOrders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['orders-analytics', user?.email],
    queryFn: () => base44.entities.Order.filter({ owner_email: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const filterByPeriod = (items) => {
    if (periodDays === 0) return items;
    const cutoff = subDays(new Date(), periodDays);
    return items.filter((item) => isAfter(new Date(item.created_date), cutoff));
  };

  const inquiries = useMemo(() => filterByPeriod(allInquiries), [allInquiries, periodDays]);
  const orders = useMemo(() => filterByPeriod(allOrders), [allOrders, periodDays]);
  const paidOrders = useMemo(() => orders.filter((o) => o.status === 'paid'), [orders]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const uniqueClients = new Set(inquiries.map((i) => i.client_email).filter(Boolean)).size;

  const isLoading = loadingInq || loadingOrders;

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {!isOnboardingComplete && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">Welcome to Analytics</p>
                <p className="text-sm text-gray-500">Here you can track the number of inquiries received on your site, orders, and earnings.</p>
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-xl gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          {activeTab === 'overview' && (
            <PeriodSelector selected={periodDays} onChange={setPeriodDays} />
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Inquiries" value={inquiries.length} icon={MessageSquare} color="blue" subtitle="Received inquiries" />
                  <StatCard label="Clients" value={uniqueClients} icon={Users} color="purple" subtitle="Unique emails" />
                  <StatCard label="Orders" value={paidOrders.length} icon={ShoppingBag} color="green" subtitle="Paid" />
                  <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="orange" subtitle="From sales" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InquiriesChart inquiries={inquiries} periodDays={periodDays} />
                  <OrdersChart orders={paidOrders} />
                </div>
              </>
            )}
          </>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <InquiriesList inquiries={allInquiries} isLoading={loadingInq} onDelete={() => queryClient.invalidateQueries({ queryKey: ['inquiries'] })} />
        )}


      </div>
    </div>
  );
}