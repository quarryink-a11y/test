import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewCard({ review, onEdit, onDelete }) {
  const dateStr = review.created_date
    ? format(new Date(review.created_date), 'dd/MM/yyyy HH:mm')
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {review.client_photo_url ? (
            <img src={review.client_photo_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-sm flex-shrink-0">
              {(review.client_name || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900">{review.client_name}</p>
            <p className="text-sm text-gray-400">
              {review.source && <span className="text-blue-500">{review.source}</span>}
              {review.source && dateStr && ' '}
              {dateStr}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(review)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(review)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
    </div>
  );
}