import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { CreditCard, Users, UserCircle, LayoutGrid } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BillingTab from '@/components/settings/BillingTab';
import AdminsTab from '@/components/settings/AdminsTab';
import ContactsTab from '@/components/settings/ContactsTab';
import ModulesTab from '@/components/settings/ModulesTab';

import { useCompleteModule } from '@/components/shared/useCompleteModule';

const tabs = [
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'contacts', label: 'Artist Profile', icon: UserCircle },
  { id: 'modules', label: 'Modules', icon: LayoutGrid },
  { id: 'admins', label: 'Admins', icon: Users },
];

export default function Settings() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'billing';
  const [activeTab, setActiveTab] = useState(initialTab);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();

  React.useEffect(() => { completeModule('settings'); }, []);

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ['siteSettings', user?.email],
    queryFn: () => base44.entities.SiteSettings.filter({ created_by: user.email }),
    enabled: !!user?.email,
  });

  const settings = settingsList[0] || null;

  const handleSave = async (data) => {
    if (settings) {
      await base44.entities.SiteSettings.update(settings.id, data);
    } else {
      await base44.entities.SiteSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/80">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'contacts' && <ContactsTab />}
          {activeTab === 'modules' && <ModulesTab />}
          {activeTab === 'admins' && <AdminsTab />}
        </div>
      </div>
    </div>
  );
}