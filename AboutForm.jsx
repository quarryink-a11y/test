import React from 'react';
import { useAuth } from '@/components/shared/AuthContext';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OPTIONAL_KEYS = ['designs', 'events', 'reviews', 'catalog', 'welcome'];

export default function ExploreModulesBanner({ onExplore }) {
  const { user } = useAuth();

  const completed = user?.completed_modules || [];
  const allDone = OPTIONAL_KEYS.every(k => completed.includes(k));
  const isOnboardingComplete = user?.onboarding_status === 'onboarding_complete';

  if (!isOnboardingComplete || allDone) return null;

  const remaining = OPTIONAL_KEYS.filter(k => !completed.includes(k)).length;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            You have {remaining} more feature{remaining > 1 ? 's' : ''} to explore
          </p>
          <p className="text-xs text-gray-500">
            Add more sections to your website — designs, events, reviews and more.
          </p>
        </div>
      </div>
      <Button
        onClick={onExplore}
        className="bg-blue-500 hover:bg-blue-600 rounded-full px-5 text-sm font-medium shrink-0"
      >
        Explore
      </Button>
    </div>
  );
}