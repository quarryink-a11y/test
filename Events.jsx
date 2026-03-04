import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import DeleteReviewDialog from '@/components/reviews/DeleteReviewDialog';
import SuccessDialog from '@/components/reviews/SuccessDialog';
import ModuleToggle from '@/components/shared/ModuleToggle';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import ModuleActivationPrompt from '@/components/shared/ModuleActivationPrompt';

export default function Reviews() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activated, setActivated] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', user?.email],
    queryFn: () => base44.entities.Review.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleAdd = () => { setEditItem(null); setShowForm(true); };

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    setShowSuccess(true);
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    completeModule('reviews');
  };

  const handleDelete = async () => {
    await base44.entities.Review.delete(deleteItem.id);
    setDeleteItem(null);
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const isOnboarding = user?.onboarding_status !== 'onboarding_complete';
  const alreadyCompleted = (user?.completed_modules || []).includes('reviews');
  const showPrompt = isOnboarding && !alreadyCompleted && !activated && !isLoading && reviews.length === 0 && !showForm;

  if (showPrompt) {
    return <ModuleActivationPrompt moduleKey="reviews" onActivate={() => setActivated(true)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        {!showForm && (
          <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold">
            + Add reviews
          </Button>
        )}
      </div>
      <div className="mb-4">
        <ModuleToggle moduleKey="reviews" label="Reviews" />
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm
            item={editItem}
            onClose={() => { setShowForm(false); setEditItem(null); }}
            onSaved={handleSaved}
          />
        </div>
      )}

      {!showForm && (
        <>
          <div className="bg-blue-50/60 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-gray-500">You have {reviews.length} reviews.</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}
              {/* Add new card */}
              <div
                onClick={handleAdd}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors py-10"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">Add new review</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete dialog */}
      {deleteItem && (
        <DeleteReviewDialog
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Success dialog */}
      {showSuccess && (
        <SuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}