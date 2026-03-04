import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ArrowLeft } from 'lucide-react';
import HeroSection from '@/components/template-preview/HeroSection';
import AboutSection from '@/components/template-preview/AboutSection';
import HowToBookSection from '@/components/template-preview/HowToBookSection';
import PortfolioSection from '@/components/template-preview/PortfolioSection';
import DesignsSection from '@/components/template-preview/DesignsSection';
import ShopSection from '@/components/template-preview/ShopSection';
import EventsSection from '@/components/template-preview/EventsSection';
import ReviewsSection from '@/components/template-preview/ReviewsSection';
import FaqSection from '@/components/template-preview/FaqSection';
import ContactSection from '@/components/template-preview/ContactSection';
import CustomCursor from '@/components/template-preview/CustomCursor';

const SECTION_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  how_to_book: HowToBookSection,
  portfolio: PortfolioSection,
  designs: DesignsSection,
  catalog: ShopSection,
  events: EventsSection,
  reviews: ReviewsSection,
  faq: FaqSection,
};

export default function TemplatePreview() {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('templateId');

    if (!templateId) {
      setError('No template ID provided.');
      setLoading(false);
      return;
    }

    base44.functions.invoke('getTemplatePreview', { templateId })
      .then(res => {
        setTemplate(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Template not found.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50">
        <div className="text-center">
          <p className="mb-4">{error}</p>
          <button onClick={() => window.history.back()} className="text-white/70 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const sections = template.sections || [];

  return (
    <div className="bg-[#050505]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <CustomCursor />

      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs tracking-wider uppercase hover:bg-white/20 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs tracking-wider">
        {template.name}
      </div>

      {/* TemplatePreview uses no props — components use their default demo data */}
      {sections.map(sectionKey => {
        const Component = SECTION_COMPONENTS[sectionKey];
        if (!Component) return null;
        return <Component key={sectionKey} />;
      })}

      <ContactSection />
    </div>
  );
}