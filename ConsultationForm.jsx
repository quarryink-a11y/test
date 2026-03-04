import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Package, Mail } from 'lucide-react';
import { format } from 'date-fns';

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrdersSection() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ owner_email: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Orders</h2>
      <div className="bg-blue-50/60 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm text-gray-500">You have {orders.length} orders.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No orders yet.</p>
          <p className="text-xs mt-1">Orders will appear here once customers purchase from your site.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const symbol = CURRENCY_SYMBOLS[order.currency] || '$';
            return (
              <div key={order.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{symbol}{order.total_amount?.toFixed(2)}</span>
                      <Badge className={`text-xs ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      {order.customer_email || 'No email'}
                      {order.customer_name && <span>· {order.customer_name}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy HH:mm') : ''}
                  </span>
                </div>
                {order.items?.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}