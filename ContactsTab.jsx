import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/shared/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Palette, ShoppingBag, CalendarDays, Star } from 'lucide-react';

const MODULES = [
  { key: 'designs', label: 'Designs', description: 'Show your available tattoo designs for clients to browse', icon: Palette },
  { key: 'catalog', label: 'Catalog / Shop', description: 'Sell merch, gift certificates, prints and more', icon: ShoppingBag },
  { key: 'events', label: 'Events', description: 'Display upcoming guest spots, conventions and events', icon: CalendarDays },
  { key: 'reviews', label: 'Reviews', description: 'Show client testimonials and reviews on your site', icon: Star },
];

export default function ModulesTab() {
  const { refreshUser } = useAuth();
  const [sections, setSections] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      const s = user.site_sections || {};
      setSections(s);
    });
  }, []);

  const handleToggle = async (key, checked) => {
    const updated = { ...sections, [key]: checked };
    setSections(updated);
    setSaving(true);
    await base44.auth.updateMe({ site_sections: updated });
    await refreshUser();
    setSaving(false);
  };

  if (!sections) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Site Modules</h2>
      <p className="text-sm text-gray-500 mb-6">
        Toggle which sections appear on your public website.
      </p>

      <div className="space-y-4">
        {MODULES.map(mod => (
          <div key={mod.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <mod.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{mod.label}</p>
                <p className="text-xs text-gray-500">{mod.description}</p>
              </div>
            </div>
            <Switch
              checked={!!sections[mod.key]}
              onCheckedChange={(checked) => handleToggle(mod.key, checked)}
              disabled={saving}
            />
          </div>
        ))}
      </div>
    </div>
  );
}