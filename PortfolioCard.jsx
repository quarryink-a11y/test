import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/shared/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutGrid, Users, UserCircle, FileText, ClipboardList,
  Briefcase, Palette, ShoppingBag, CalendarDays, Star,
  HelpCircle, Package, BarChart3, LayoutTemplate,
  Settings, LogOut, Lock
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid, page: 'Dashboard' },
  { key: 'artist_profile', label: 'Artist Profile', icon: UserCircle, page: 'Settings?tab=contacts', isArtistProfile: true },
  { key: 'welcome', label: 'Admins', icon: Users, page: 'Admins' },
  { key: 'about', label: 'About', icon: FileText, page: 'AboutMe' },
  { key: 'how_to_book', label: 'How to Book', icon: ClipboardList, page: 'HowToBook' },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase, page: 'Portfolio' },
  { key: 'designs', label: 'Designs', icon: Palette, page: 'Designs' },
  { key: 'catalog', label: 'Catalog', icon: ShoppingBag, page: 'Catalog' },
  { key: 'events', label: 'Events', icon: CalendarDays, page: 'Events' },
  { key: 'reviews', label: 'Reviews', icon: Star, page: 'Reviews' },
  { key: 'faq', label: 'FAQ', icon: HelpCircle, page: 'Faq' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, page: 'Analytics' },
  { key: 'templates', label: 'Templates', icon: LayoutTemplate, page: 'Templates', adminOnly: true },
];

// Essential modules unlock sequentially
const ESSENTIAL_ORDER = ['artist_profile', 'about', 'how_to_book', 'portfolio', 'faq'];
// Optional site modules — visible only when enabled in site_sections
const OPTIONAL_SITE_MODULES = ['designs', 'catalog', 'events', 'reviews'];
// Always visible after onboarding (admin tools)
const ALWAYS_AFTER_ONBOARDING = ['analytics'];

export default function Sidebar({ currentPage, onNavigate }) {
  const { user } = useAuth();

  const { data: settingsList = [] } = useQuery({
    queryKey: ['siteSettings-sidebar', user?.email],
    queryFn: () => base44.entities.SiteSettings.filter({ created_by: user.email }),
    enabled: !!user?.email,
  });
  const logoUrl = settingsList[0]?.logo_url;

  const handleLogout = () => base44.auth.logout();
  const handleNav = () => { if (onNavigate) onNavigate(); };

  const completed = user?.completed_modules || [];
  const isOnboardingComplete = user?.onboarding_status === 'onboarding_complete';
  const siteSections = user?.site_sections || {};

  // Find next essential step
  const nextEssentialIndex = ESSENTIAL_ORDER.findIndex(k => !completed.includes(k));

  const isNextStep = (key) => {
    if (isOnboardingComplete) return false;
    const idx = ESSENTIAL_ORDER.indexOf(key);
    if (idx === -1) return false;
    return idx === nextEssentialIndex && !completed.includes(key);
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
        )}
        <span className="font-semibold text-gray-800 text-lg">Quarry.ink</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.filter(item => {
          if (item.adminOnly && user?.role !== 'admin') return false;
          // Dashboard is always visible
          if (item.key === 'dashboard') return true;
          // Hide artist_profile and welcome from sidebar always (accessible via Settings)
          if (item.key === 'welcome' || item.key === 'artist_profile') return false;
          // Essential modules
          const essentialIdx = ESSENTIAL_ORDER.indexOf(item.key);
          if (essentialIdx !== -1) {
            if (isOnboardingComplete) return true;
            // During onboarding: show completed + next step
            return completed.includes(item.key) || essentialIdx === nextEssentialIndex;
          }
          // Optional site modules: show only if enabled in site_sections
          if (OPTIONAL_SITE_MODULES.includes(item.key)) {
            return !!siteSections[item.key];
          }
          // Admin tools: always visible after onboarding
          if (ALWAYS_AFTER_ONBOARDING.includes(item.key)) {
            return isOnboardingComplete;
          }
          // Other items (templates etc): show after onboarding
          if (isOnboardingComplete) return true;
          return false;
        }).map((item) => {
          const isNext = isNextStep(item.key);
          const urlParams = new URLSearchParams(window.location.search);
          const currentTab = urlParams.get('tab');
          const isActive = item.isArtistProfile
            ? currentPage === 'Settings' && currentTab === 'contacts'
            : currentPage === item.page;

          return (
            <Link
              key={item.key}
              to={createPageUrl(item.page)}
              onClick={handleNav}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
              {isNext && !isActive && (
                <span className="absolute right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="flex flex-col gap-1 pt-4 border-t border-gray-100 mt-2">
        <Link
          to={createPageUrl('Settings')}
          onClick={handleNav}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentPage === 'Settings'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4.5 h-4.5" strokeWidth={currentPage === 'Settings' ? 2.2 : 1.8} />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full"
        >
          <LogOut className="w-4.5 h-4.5" strokeWidth={1.8} />
          Log out
        </button>
      </div>
    </aside>
  );
}