import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Mail } from 'lucide-react';
import { format } from 'date-fns';

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrdersList({ orders, isLoading }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-gray-200 rounded-xl">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <div className="bg-blue-50/60 rounded-xl px-4 py-2.5 mb-4">
        <p className="text-sm text-gray-500">{filtered.length} orders found</p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const symbol = CURRENCY_SYMBOLS[order.currency] || '$';
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4">
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
                  <div className="mt-2 pt-2 border-t border-gray-50">
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