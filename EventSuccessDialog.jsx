import React from 'react';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  'Bookings open': { label: 'Open', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'Soon': { label: 'Soon', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  'Waiting list': { label: 'Waiting list', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  'Closed': { label: 'Closed', bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-400' },
};

export default function EventCard({ event, onEdit, onDelete }) {
  const sc = STATUS_CONFIG[event.status] || STATUS_CONFIG['Bookings open'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {/* Status badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text} mb-3`}>
            {sc.label}
          </span>

          {/* City */}
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
            <span className="font-bold text-gray-900 text-sm">{event.city}</span>
          </div>

          {/* Date */}
          <p className="text-sm text-gray-500 mb-0.5">{event.date_range}</p>

          {/* Location */}
          <p className="text-sm text-gray-500 mb-4">{event.location}</p>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl text-xs px-5" onClick={() => onEdit(event)}>
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl text-xs px-5" onClick={() => onDelete(event)}>
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* Image */}
        {event.image_url && (
          <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}