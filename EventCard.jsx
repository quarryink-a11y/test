import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export default function DesignCard({ item, onEdit, onDelete }) {
  const placements = item.body_placement?.length > 0
    ? item.body_placement.join(', ')
    : '';
  
  const truncatedPlacements = placements.length > 20
    ? placements.substring(0, 20) + '...'
    : placements;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
      {/* Oval image */}
      <div className="w-40 h-48 rounded-[50%] overflow-hidden bg-gray-100 mb-4 flex-shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
        )}
      </div>

      {/* Name */}
      <p className="font-bold text-gray-900 text-sm mb-2 text-center">{item.name}</p>

      {/* Info row */}
      <div className="w-full flex justify-between text-xs text-gray-500 mb-1 px-1">
        <div>
          <p>Size - {item.size_type || '—'}</p>
          <p>Price - {item.currency || 'USD'} {item.price || '—'}</p>
        </div>
        {truncatedPlacements && (
          <div className="text-right">
            <p>Preferred - {truncatedPlacements}</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full mt-3">
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs h-9" onClick={() => onEdit(item)}>
          <Pencil className="w-3 h-3 mr-1.5" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs h-9" onClick={() => onDelete(item)}>
          <Trash2 className="w-3 h-3 mr-1.5" /> Delete
        </Button>
      </div>
    </div>
  );
}