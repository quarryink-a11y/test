import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ReviewsCard({ reviews }) {
  const review = reviews[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Reviews</h3>
        <Link
          to={createPageUrl('Reviews')}
          className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>
      {review ? (
        <div>
          <p className="text-xs text-gray-400 mb-2">
            {review.created_date ? new Date(review.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : ''}
          </p>
          <p className="font-semibold text-gray-800 text-sm mb-2">{review.client_name || 'User Name'}</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            "{review.text}"
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No reviews yet</p>
        </div>
      )}
    </div>
  );
}