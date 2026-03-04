import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import FaqCategorySection from '@/components/faq/FaqCategorySection';
import FaqQuestionForm from '@/components/faq/FaqQuestionForm';
import DeleteFaqDialog from '@/components/faq/DeleteFaqDialog';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageSquare } from 'lucide-react';


const DEFAULT_CATEGORIES = [
  { title: 'Reservation, Preparation & Session', sort_order: 1 },
  { title: 'Aftercare, Touch-Ups, Cover-Ups & Sterilization', sort_order: 2 },
  { title: 'Studio Location, Gift-Certificates & Payment', sort_order: 3 },
];

const DEFAULT_QUESTIONS = {
  0: [
    'Is it possible to create an individual design?',
    "What's tips for choosing placement for a tattoo?",
    'Is a deposit required? How to send it?',
    'How long does the session last?',
    'What if I want to cancel or reschedule my appointment?',
    'How to prepare for the session?',
    'How painful is the tattooing process?',
    'Are there any AGE restrictions?',
  ],
  1: [
    'What is the proper tattoo aftercare?',
    'How long does the aftercare process usually last?',
    'Is it normal if the tattoo looks a bit different from the design?',
    'Do I need a touch-up? How often?',
    'Is the touch-up included in the price?',
    'What should I do if the tattoo peels, itches, or looks unusual?',
    'Can I cover an old tattoo with a new one?',
    'Is it safe to get a tattoo after surgery, burns, or on scars?',
    'How do you ensure everything is sterile and safe?',
    'What tools and materials do you use during the session?',
  ],
  2: [
    'Can I come with a friend?',
    'How can I pay after the session?',
    'Can a large tattoo be split into multiple sessions?',
    'Do you offer gift certificates?',
    'Where is the studio located?',
    'Is there parking near the studio?',
  ],
};

export default function Faq() {
  const [addingToCategory, setAddingToCategory] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const seedingRef = React.useRef(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();
  const navigate = useNavigate();
  const isOnboarding = user?.onboarding_status !== 'onboarding_complete';

  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: ['faqCategories', user?.email],
    queryFn: () => base44.entities.FaqCategory.filter({ created_by: user.email }, 'sort_order'),
    enabled: !!user?.email,
  });

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['faqItems', user?.email],
    queryFn: () => base44.entities.FaqItem.filter({ created_by: user.email }, 'sort_order'),
    enabled: !!user?.email,
  });

  // Auto-complete module on visit
  React.useEffect(() => { 
    if (user && !loadingCats && !loadingItems) {
      completeModule('faq'); 
    }
  }, [user, loadingCats, loadingItems]);

  // Seed default data if empty (use ref to prevent double-run in StrictMode)
  useEffect(() => {
    if (user?.email && !loadingCats && categories.length === 0 && !seedingRef.current) {
      seedingRef.current = true;
      setSeeding(true);
      seedDefaults();
    }
  }, [loadingCats, categories.length, user?.email]);

  const seedDefaults = async () => {
    // Double-check: fetch categories again to prevent race condition duplicates
    const existingCats = await base44.entities.FaqCategory.filter({ created_by: user.email });
    if (existingCats.length > 0) {
      setSeeding(false);
      queryClient.invalidateQueries({ queryKey: ['faqCategories'] });
      queryClient.invalidateQueries({ queryKey: ['faqItems'] });
      return;
    }

    const createdCats = [];
    for (const cat of DEFAULT_CATEGORIES) {
      const created = await base44.entities.FaqCategory.create(cat);
      createdCats.push(created);
    }
    for (let i = 0; i < createdCats.length; i++) {
      const questions = DEFAULT_QUESTIONS[i] || [];
      if (questions.length > 0) {
        await base44.entities.FaqItem.bulkCreate(
          questions.map((q, idx) => ({
            category_id: createdCats[i].id,
            question: q,
            answer: '',
            sort_order: idx + 1,
          }))
        );
      }
    }
    queryClient.invalidateQueries({ queryKey: ['faqCategories'] });
    queryClient.invalidateQueries({ queryKey: ['faqItems'] });
    setSeeding(false);
  };

  const handleUpdateCategory = async (id, data) => {
    await base44.entities.FaqCategory.update(id, data);
    queryClient.invalidateQueries({ queryKey: ['faqCategories'] });
  };

  const handleAddQuestion = async (categoryId, formData) => {
    const catItems = items.filter(i => i.category_id === categoryId);
    await base44.entities.FaqItem.create({
      category_id: categoryId,
      question: formData.question,
      answer: formData.answer,
      sort_order: catItems.length + 1,
    });
    queryClient.invalidateQueries({ queryKey: ['faqItems'] });
    setAddingToCategory(null);
  };

  const handleEditQuestion = async (id, data) => {
    await base44.entities.FaqItem.update(id, data);
    queryClient.invalidateQueries({ queryKey: ['faqItems'] });
    completeModule('faq');
  };

  const handleDeleteQuestion = async () => {
    await base44.entities.FaqItem.delete(deletingItem.id);
    queryClient.invalidateQueries({ queryKey: ['faqItems'] });
    setDeletingItem(null);
  };

  const isLoading = loadingCats || loadingItems || seeding;

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ</h1>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-blue-700">
            We've put together basic questions that may be useful for your clients. You can edit category titles, delete questions you don't need, or add your own Q&As at any time.
          </p>
        </div>

        {!isLoading && (() => {
          const answeredCount = items.filter(i => i.answer && i.answer.trim().length > 0).length;
          const totalCount = items.length;
          const pct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
          return (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Answers filled</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">{answeredCount}/{totalCount}</span>
              </div>
              <Progress value={pct} className="h-2 [&>div]:bg-amber-400" />
              <p className="text-xs text-gray-500">
                {answeredCount === 0
                  ? "The more answers you add now, the fewer \"Hey, is this normal?\" DMs you'll get at 2 AM 😅"
                  : answeredCount < 10
                  ? "Good start! Every answer you add = one less DM in your inbox. Your future self will thank you 🙏"
                  : answeredCount < totalCount
                  ? "You're on fire! 🔥 Keep going — your clients will love having all the info upfront."
                  : "All done! Your clients will barely need to message you now. Legend status 🏆"
                }
              </p>
            </div>
          );
        })()}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-5">
                <Skeleton className="h-5 w-60 mb-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <FaqCategorySection
                key={cat.id}
                category={cat}
                index={idx}
                questions={items.filter(i => i.category_id === cat.id)}
                onAddQuestion={(catId) => setAddingToCategory(catId)}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={setDeletingItem}
                onUpdateCategory={handleUpdateCategory}
                isOnboarding={isOnboarding}
              />
            ))}
          </div>
        )}

        {/* Total + Next */}
        {!isLoading && (
          <>
            <p className="text-xs text-gray-400 mt-4">
              {categories.length} categories · {items.length} questions
            </p>
            <div className="flex flex-col items-center mt-6 gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-10 py-2.5 text-sm font-semibold"
                onClick={async () => {
                  await completeModule('faq');
                  navigate(createPageUrl('Dashboard'));
                }}
              >
                {isOnboarding ? 'Next →' : 'Back to Dashboard'}
              </Button>
              <p className="text-xs text-gray-400">You can always come back and add more answers later</p>
            </div>
          </>
        )}
      </div>

      {/* Add question modal */}
      {addingToCategory && (
        <FaqQuestionForm
          categoryId={addingToCategory}
          onSave={handleAddQuestion}
          onCancel={() => setAddingToCategory(null)}
        />
      )}

      {/* Delete dialog */}
      {deletingItem && (
        <DeleteFaqDialog
          onCancel={() => setDeletingItem(null)}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  );
}