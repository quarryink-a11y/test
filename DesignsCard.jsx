import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/shared/AuthContext';
import { ESSENTIAL_MODULES, OPTIONAL_MODULES } from '@/components/shared/useCompleteModule';
import { Progress } from '@/components/ui/progress';
import {
  UserCircle, FileText, ClipboardList, Briefcase, Palette,
  ShoppingBag, CalendarDays, Star, HelpCircle, Package,
  BarChart3, Check, ChevronRight, Users, Sparkles, Lock
} from 'lucide-react';

const STEP_META = {
  artist_profile: { label: 'Artist Profile', desc: 'Your name, contacts & socials', icon: UserCircle, page: 'Settings', pageTab: 'contacts' },
  about: { label: 'About', desc: 'Tell your story', icon: FileText, page: 'AboutMe' },
  how_to_book: { label: 'How to Book', desc: 'Booking steps for clients', icon: ClipboardList, page: 'HowToBook' },
  portfolio: { label: 'Portfolio', desc: 'Showcase your best works', icon: Briefcase, page: 'Portfolio' },
  faq: { label: 'FAQ', desc: 'Frequently asked questions', icon: HelpCircle, page: 'Faq' },
  welcome: { label: 'Team & Admins', desc: 'Add your assistant or manager', icon: Users, page: 'Admins' },
  designs: { label: 'Designs', desc: 'Flash designs & sketches', icon: Palette, page: 'Designs' },
  catalog: { label: 'Catalog', desc: 'Merch, gift cards & prints', icon: ShoppingBag, page: 'Catalog' },
  events: { label: 'Events', desc: 'Guest spots & conventions', icon: CalendarDays, page: 'Events' },
  reviews: { label: 'Reviews', desc: 'Client testimonials', icon: Star, page: 'Reviews' },
  orders: { label: 'Orders', desc: 'View & manage orders', icon: Package, page: 'Orders' },
  analytics: { label: 'Analytics', desc: 'Track your performance', icon: BarChart3, page: 'Analytics' },
};

export default function GettingStartedChecklist() {
  const { user } = useAuth();
  const completed = user?.completed_modules || [];
  const isOnboardingComplete = user?.onboarding_status === 'onboarding_complete';

  // Essential steps progress
  const essentialSteps = ESSENTIAL_MODULES.map((key) => ({ key, ...STEP_META[key] }));
  const essentialCompleted = essentialSteps.filter((s) => completed.includes(s.key)).length;
  const essentialProgress = Math.round((essentialCompleted / essentialSteps.length) * 100);

  // Optional steps
  const optionalSteps = OPTIONAL_MODULES.map((key) => ({ key, ...STEP_META[key] }));

  // Find next uncompleted essential step
  const nextEssentialIndex = essentialSteps.findIndex((s) => !completed.includes(s.key));

  return (
    <div className="space-y-6">
      {/* Essential section */}
      {!isOnboardingComplete && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-semibold text-gray-900">Essential Setup</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {essentialCompleted} of {essentialSteps.length} — complete these to publish your site
                </p>
              </div>
              <span className="text-lg font-bold text-blue-500">{essentialProgress}%</span>
            </div>
            <Progress value={essentialProgress} className="h-2" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {essentialSteps.map((step, i) => {
              const isCompleted = completed.includes(step.key);
              const isNext = i === nextEssentialIndex;
              const isLocked = !isCompleted && i > nextEssentialIndex && nextEssentialIndex !== -1;
              return (
                <StepRow key={step.key} step={step} isCompleted={isCompleted} isNext={isNext} isLocked={isLocked} />
              );
            })}
          </div>
        </>
      )}


    </div>
  );
}

function StepRow({ step, isCompleted, isNext, isLocked }) {
  const Icon = step.icon;

  const content = (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-all duration-200 ${
        isLocked ? 'opacity-40 cursor-default' : 'hover:bg-blue-50/40 cursor-pointer'
      } ${isNext ? 'bg-blue-50/60' : ''}`}
    >
      <div
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted ? 'bg-green-100' : isNext ? 'bg-blue-100' : 'bg-gray-100'
        }`}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : isLocked ? (
          <Lock className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <Icon className="w-4 h-4 text-blue-500" />
        )}
        {isNext && !isCompleted && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {step.label}
        </p>
        <p className="text-xs text-gray-400 truncate">{step.desc}</p>
      </div>

      {isNext && !isCompleted && (
        <span className="shrink-0 bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          Continue →
        </span>
      )}
      {!isLocked && !isCompleted && !isNext && (
        <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />
      )}
      {isCompleted && <span className="text-xs text-green-500 font-medium shrink-0">Done</span>}
    </div>
  );

  if (isLocked) return <div>{content}</div>;

  const url = step.pageTab
    ? createPageUrl(`${step.page}?tab=${step.pageTab}`)
    : createPageUrl(step.page);

  return (
    <Link to={url} className="block">
      {content}
    </Link>
  );
}