import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BookingStepCard from '@/components/howtobook/BookingStepCard';
import BookingStepForm from '@/components/howtobook/BookingStepForm';
import DeleteStepDialog from '@/components/howtobook/DeleteStepDialog';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import HowToBookHintTooltip from '@/components/howtobook/HowToBookHintTooltip';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function HowToBook() {
  const [showForm, setShowForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [deletingStep, setDeletingStep] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();

  const isOnboarding = user?.onboarding_status !== 'onboarding_complete';

  const { data: steps = [], isLoading } = useQuery({
    queryKey: ['bookingSteps', user?.email],
    queryFn: () => base44.entities.BookingStep.filter({ created_by: user.email }, 'step_number'),
    enabled: !!user?.email,
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['bookingSteps'] });
    setShowForm(false);
    setEditingStep(null);
    completeModule('how_to_book');
  };

  const handleEdit = (step) => {
    setEditingStep(step);
    setShowForm(true);
  };

  const handleDelete = async () => {
    await base44.entities.BookingStep.delete(deletingStep.id);
    queryClient.invalidateQueries({ queryKey: ['bookingSteps'] });
    setDeletingStep(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStep(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">How to Book</h1>
          {!showForm && (
            <Button
              onClick={() => { setEditingStep(null); setShowForm(true); }}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" /> Add step
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-gray-500">
            Describe the booking process step by step for your clients.
          </p>
          <HowToBookHintTooltip />
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6">
            <BookingStepForm
              editingStep={editingStep}
              totalSteps={steps.length}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Steps list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : steps.length === 0 && !showForm ? (
          <button
            onClick={() => { setEditingStep(null); setShowForm(true); }}
            className="w-full text-center py-14 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <ClipboardList className="w-8 h-8 text-gray-300 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
            <p className="text-gray-400 group-hover:text-blue-500 text-sm font-medium mb-1 transition-colors">No steps yet</p>
            <p className="text-gray-400 text-xs">Click here to add your first step</p>
          </button>
        ) : (
          <div className="space-y-3">
            {steps.map((step) => (
              <BookingStepCard
                key={step.id}
                step={step}
                onEdit={handleEdit}
                onDelete={setDeletingStep}
              />
            ))}
          </div>
        )}

        {/* Progress / encouragement + add more + next */}
        {steps.length > 0 && !showForm && (
          <div className="mt-6 space-y-3">
            {/* Progress bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {steps.length >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {steps.length >= 3 ? 'Great! Your clients will know exactly how to book' :
                     steps.length >= 2 ? 'Almost there! One more step for a clear booking flow' :
                     'Good start! Add 2–3 steps so clients understand how to book with you'}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400">{steps.length}/3</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    steps.length >= 3 ? 'bg-green-500' :
                    steps.length >= 2 ? 'bg-blue-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, (steps.length / 3) * 100)}%` }}
                />
              </div>
            </div>

            {/* Add more steps card */}
            {steps.length < 6 && (
              <button
                onClick={() => { setEditingStep(null); setShowForm(true); }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-blue-500 font-medium transition-colors">Add another step</span>
              </button>
            )}

            {/* Next / continue button */}
            {isOnboarding && (
              <div className="mt-2">
                {steps.length < 3 && (
                  <p className="text-xs text-gray-400 text-center mb-2">
                    Most artists fill in 2–3 steps — but you can always add more later
                  </p>
                )}
                <Link to={createPageUrl('Dashboard')}>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl gap-2 h-12 text-base"
                    onClick={() => completeModule('how_to_book')}
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete dialog */}
      {deletingStep && (
        <DeleteStepDialog
          onCancel={() => setDeletingStep(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}