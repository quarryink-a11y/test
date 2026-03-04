import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import TemplateCard from '@/components/onboarding/TemplateCard';
import TemplatePreviewModal from '@/components/onboarding/TemplatePreviewModal';
import TrialStep from '@/components/onboarding/TrialStep';
import ProfileStep from '@/components/onboarding/ProfileStep';
import CompletionStep from '@/components/onboarding/CompletionStep';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { Sparkles, Loader2 } from 'lucide-react';

const DEFAULT_SECTIONS = {
  hero: true,
  about: true,
  how_to_book: true,
  portfolio: true,
  designs: false,
  catalog: false,
  events: false,
  reviews: false,
  faq: true,
  booking_form: true,
};

export default function Onboarding() {
  const [step, setStep] = useState('templates'); // templates | trial | profile | done
  const [selectedId, setSelectedId] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [artistName, setArtistName] = useState('');

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['onboarding-templates'],
    queryFn: () => base44.entities.Template.filter({ is_active: true }, 'sort_order'),
  });

  const handleSelect = (id) => setSelectedId(id);
  const handleContinue = () => { if (selectedId) setStep('trial'); };

  const handleStartTrial = async () => {
    await base44.auth.updateMe({
      onboarding_status: 'trial_started',
      selected_template: selectedId,
      site_sections: DEFAULT_SECTIONS,
    });
    // Go to profile step instead of dashboard
    setStep('profile');
  };

  const [profileSaving, setProfileSaving] = useState(false);

  const handleProfileNext = async (formData, slug) => {
    if (profileSaving) return;
    setProfileSaving(true);
    // Check if ContactInfo already exists (prevent duplicates)
    const existing = await base44.entities.ContactInfo.filter({ created_by: formData.email || '' });
    if (existing.length === 0) {
      await base44.entities.ContactInfo.create(formData);
    } else {
      await base44.entities.ContactInfo.update(existing[0].id, formData);
    }
    // Sync to user — also populate About section with profile photo & description
    await base44.auth.updateMe({
      headline: formData.artist_full_name || '',
      site_slug: slug,
      completed_modules: ['artist_profile'],
      artist_photo_url: formData.profile_image_url || '',
    });
    setArtistName(formData.artist_full_name?.split(' ')[0] || '');
    setStep('done');
  };

  const handleGoToDashboard = () => {
    window.location.href = '/Dashboard';
  };

  // --- Render steps ---

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
        <div className="w-full">
          <OnboardingProgress currentStep="done" />
          <CompletionStep artistName={artistName} onGoToDashboard={handleGoToDashboard} />
        </div>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
        <div className="w-full">
          <OnboardingProgress currentStep="profile" />
          <ProfileStep onNext={handleProfileNext} />
        </div>
      </div>
    );
  }

  if (step === 'trial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <OnboardingProgress currentStep="trial" />
        </div>
        <TrialStep onBack={() => setStep('templates')} onStartTrial={handleStartTrial} />
      </div>
    );
  }

  // Templates step (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <OnboardingProgress currentStep="template" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose your website template</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Pick a design that fits your style. You can customize everything later.
          </p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-24">
          {templatesLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : (
            templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                isSelected={selectedId === t.id}
                onSelect={handleSelect}
                onPreview={setPreviewTemplate}
              />
            ))
          )}
          {[1, 2].map((i) => (
            <div
              key={`soon-${i}`}
              className="bg-white/50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center aspect-[4/5]"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">Coming soon</p>
                <p className="text-xs text-gray-300 mt-1">New templates on the way</p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue button */}
        {selectedId && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {templates.find((t) => t.id === selectedId)?.name} selected
                </p>
                <p className="text-xs text-gray-500">Next: Start your free trial</p>
              </div>
              <button
                onClick={handleContinue}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}