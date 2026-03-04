import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AuthProvider } from '@/components/shared/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPage = currentPageName === 'PublicSite' || currentPageName === 'TemplatePreview';

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false);
      return;
    }
    base44.auth.me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin();
      })
      .finally(() => setLoading(false));
  }, [isPublicPage]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const onboardingStatus = user?.onboarding_status || 'new';
  const needsOnboarding = onboardingStatus !== 'trial_started' && onboardingStatus !== 'onboarding_complete';

  if (needsOnboarding && currentPageName === 'Onboarding') {
    return <AuthProvider initialUser={user}>{children}</AuthProvider>;
  }

  if (needsOnboarding) {
    window.location.href = '/Onboarding';
    return null;
  }

  return (
    <AuthProvider initialUser={user}>
      <div className="flex min-h-screen bg-gray-50/80">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar currentPage={currentPageName} />
        </div>

        {/* Mobile header + sheet sidebar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-56">
              <Sidebar currentPage={currentPageName} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-gray-800">Quarry.ink</span>
        </div>

        <main className="flex-1 overflow-auto md:pt-0 pt-14">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}