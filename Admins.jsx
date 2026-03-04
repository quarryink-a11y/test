import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import SiteLiveCard from '@/components/dashboard/SiteLiveCard';
import PortfolioCard from '@/components/dashboard/PortfolioCard';
import DesignsCard from '@/components/dashboard/DesignsCard';
import EventsCard from '@/components/dashboard/EventsCard';
import ReviewsCard from '@/components/dashboard/ReviewsCard';
import GettingStartedChecklist from '@/components/dashboard/GettingStartedChecklist';
import OptionalModulesModal from '@/components/dashboard/OptionalModulesModal';
import ExploreModulesBanner from '@/components/dashboard/ExploreModulesBanner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const isOnboardingComplete = user?.onboarding_status === 'onboarding_complete';
  const [showModulesModal, setShowModulesModal] = useState(false);

  const { data: contactInfo } = useQuery({
    queryKey: ['contactInfo', user?.email],
    queryFn: () => base44.entities.ContactInfo.filter({ created_by: user.email }),
    enabled: !!user?.email
  });

  const { data: portfolioItems = [], isLoading: loadingPortfolio } = useQuery({
    queryKey: ['portfolio', user?.email],
    queryFn: () => base44.entities.PortfolioItem.filter({ created_by: user.email }, '-created_date', 4),
    enabled: !!user?.email && isOnboardingComplete
  });

  const { data: designItems = [], isLoading: loadingDesigns } = useQuery({
    queryKey: ['designs', user?.email],
    queryFn: () => base44.entities.DesignItem.filter({ created_by: user.email }, '-created_date', 6),
    enabled: !!user?.email && isOnboardingComplete
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['events', user?.email],
    queryFn: () => base44.entities.Event.filter({ created_by: user.email }, '-created_date', 4),
    enabled: !!user?.email && isOnboardingComplete
  });

  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ['reviews', user?.email],
    queryFn: () => base44.entities.Review.filter({ created_by: user.email }, '-created_date', 3),
    enabled: !!user?.email && isOnboardingComplete
  });

  const artistName = contactInfo?.[0]?.artist_full_name;
  const userName = artistName || user?.full_name?.split(' ')[0] || 'User';
  const isLoading = loadingPortfolio || loadingDesigns || loadingEvents || loadingReviews;

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Greeting */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Hi {userName}! 👋
        </h1>

        {!isOnboardingComplete ?
        <>
            <div className="mb-6">
              <WelcomeBanner />
            </div>
            <GettingStartedChecklist />
          </> :

        <>
            <SiteLiveCard />

            {/* Banner to explore optional modules */}
            <ExploreModulesBanner onExplore={() => setShowModulesModal(true)} />

            {/* Optional modules activation modal */}
            <OptionalModulesModal open={showModulesModal} onClose={() => setShowModulesModal(false)} />

            {/* Module Grid */}
            {isLoading ?
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) =>
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                  </div>
            )}
              </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <PortfolioCard items={portfolioItems} />
                {user?.site_sections?.designs && <DesignsCard items={designItems} />}
                {user?.site_sections?.events && <EventsCard events={events} />}
                {user?.site_sections?.reviews && <ReviewsCard reviews={reviews} />}
              </div>
          }
          </>
        }

        {/* Footer */}
        <div className="text-center mt-10 py-6">
          <p className="text-sm text-gray-500">Have ideas for improvement?</p>
          <p className="text-sm text-gray-500">Email us at Quarry.ink@gmail.com. We'd love to hear from you 🫶🏻




          </p>
        </div>
      </div>
    </div>);

}