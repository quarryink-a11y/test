import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Phone, MapPin, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function InquiriesList({ inquiries, isLoading, onDelete }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (inq) => {
    if (!confirm(`Delete inquiry from ${inq.first_name} ${inq.last_name}?`)) return;
    setDeletingId(inq.id);
    await base44.entities.Inquiry.delete(inq.id);
    toast.success('Inquiry deleted');
    setDeletingId(null);
    onDelete?.(inq.id);
  };

  const filtered = inquiries.filter(inq => {
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch = !term || 
      (inq.first_name || '').toLowerCase().includes(term) ||
      (inq.last_name || '').toLowerCase().includes(term) ||
      (inq.client_email || '').toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 border-gray-200 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-gray-200 rounded-xl">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <div className="bg-blue-50/60 rounded-xl px-4 py-2.5 mb-4">
        <p className="text-sm text-gray-500">{filtered.length} inquiries found</p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {inq.first_name} {inq.last_name}
                    </span>
                    <Badge className={`text-xs ${statusColors[inq.status] || 'bg-gray-100'}`}>
                      {statusLabels[inq.status] || inq.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {inq.client_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {inq.client_email}
                      </span>
                    )}
                    {inq.client_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {inq.client_phone}
                      </span>
                    )}
                    {inq.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {inq.city}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {inq.created_date ? format(new Date(inq.created_date), 'MMM d, yyyy') : ''}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-300 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(inq)}
                    disabled={deletingId === inq.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {(inq.idea_description || inq.placement) && (
                <div className="mt-2 pt-2 border-t border-gray-50 flex flex-wrap gap-2 text-xs text-gray-500">
                  {inq.placement && <span className="bg-gray-50 px-2 py-1 rounded-lg">{inq.placement}</span>}
                  {inq.size_value && inq.size_unit && (
                    <span className="bg-gray-50 px-2 py-1 rounded-lg">{inq.size_value} {inq.size_unit}</span>
                  )}
                  {inq.referral_source && (
                    <span className="bg-gray-50 px-2 py-1 rounded-lg">{inq.referral_source}</span>
                  )}
                </div>
              )}
              {inq.idea_description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{inq.idea_description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}