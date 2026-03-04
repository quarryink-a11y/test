import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/shared/AuthContext';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Palette, ShoppingBag, CalendarDays, Star, Users,
  CheckCircle2, SkipForward
} from 'lucide-react';

const OPTIONAL_FLOW = [
  {
    key: 'designs',
    title: 'Designs',
    description: 'Showcase your available tattoo designs that clients can pick and book directly.',
    icon: Palette,
    page: 'Designs',
  },
  {
    key: 'events',
    title: 'Events',
    description: 'Share your upcoming guest spots, conventions, and travel dates with clients.',
    icon: CalendarDays,
    page: 'Events',
  },
  {
    key: 'reviews',
    title: 'Reviews',
    description: 'Display client testimonials and reviews to build trust with potential clients.',
    icon: Star,
    page: 'Reviews',
  },
  {
    key: 'catalog',
    title: 'Catalog',
    description: 'Sell merch, gift certificates, prints, stickers and other products from your store.',
    icon: ShoppingBag,
    page: 'Catalog',
  },
  {
    key: 'welcome',
    title: 'Team & Admins',
    description: 'Add your assistant or manager so they can help you manage the site.',
    icon: Users,
    page: 'Admins',
  },
];

export default function OptionalModulesModal({ open, onClose }) {
  const { user, refreshUser } = useAuth();
  const { completeModule } = useCompleteModule();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const completed = user?.completed_modules || [];

  // Find first uncompleted optional module in the flow
  const currentModule = useMemo(() => {
    return OPTIONAL_FLOW.find(m => !completed.includes(m.key));
  }, [completed]);

  if (!open || !currentModule) return null;

  // Progress: how many of the 5 are already done
  const doneCount = OPTIONAL_FLOW.filter(m => completed.includes(m.key)).length;
  const currentIndex = OPTIONAL_FLOW.findIndex(m => m.key === currentModule.key);

  const handleActivate = async () => {
    setLoading(true);
    // Enable the section
    const currentSections = user?.site_sections || {};
    await base44.auth.updateMe({ site_sections: { ...currentSections, [currentModule.key]: true } });
    await refreshUser();
    setLoading(false);
    // Navigate to the module page to set it up
    navigate(createPageUrl(currentModule.page));
  };

  const handleSkip = async () => {
    setLoading(true);
    // Mark as completed without enabling
    await completeModule(currentModule.key);
    const currentSections = user?.site_sections || {};
    if (currentSections[currentModule.key]) {
      await base44.auth.updateMe({ site_sections: { ...currentSections, [currentModule.key]: false } });
    }
    await refreshUser();
    setLoading(false);
  };

  const Icon = currentModule.icon;

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {OPTIONAL_FLOW.map((m, i) => (
            <div
              key={m.key}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                completed.includes(m.key)
                  ? 'w-6 bg-green-400'
                  : i === currentIndex
                  ? 'w-6 bg-blue-500'
                  : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="px-8 pb-8 pt-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <Icon className="w-7 h-7 text-blue-500" />
          </div>

          <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
            {currentIndex + 1} of {OPTIONAL_FLOW.length}
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Add {currentModule.title} to your site?
          </h2>

          <p className="text-sm text-gray-500 mb-2 leading-relaxed">
            {currentModule.description}
          </p>

          <p className="text-xs text-gray-400 mb-8">
            You can always enable this later in Settings → Modules
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleActivate}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 rounded-full px-8 text-sm font-semibold gap-2 w-full"
            >
              <CheckCircle2 className="w-4 h-4" />
              Yes, set it up
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="rounded-full px-8 text-sm font-medium text-gray-400 gap-2 w-full"
            >
              <SkipForward className="w-4 h-4" />
              {loading ? 'Skipping...' : 'Skip'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}