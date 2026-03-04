import React, { useState } from "react";
import { motion } from "framer-motion";
import BookingFormModal from "./BookingFormModal";

const DEFAULT_DATA = {
  location: "Calgary — The Terrace Studio",
  studioImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/7e8a22839_photo_2026-02-23_10-20-24.jpg",
  email: "contact@email.com",
  telegram: "@artist",
  whatsapp: "+1 000 000 0000",
  locations: ["Kyiv, Ukraine", "Calgary, Canada"],
  socials: [{ name: "Instagram", href: "#" }, { name: "Facebook", href: "#" }],
  copyright: "Kazakevich Andriy",
};

export default function ContactSection({ contact, ownerName, ownerEmail, siteSlug, events }) {
  const [formOpen, setFormOpen] = useState(false);

  // undefined = no prop passed (preview mode) → show defaults
  // null/object = real site → use actual data only
  const isPreview = contact === undefined;

  const locationCity = isPreview
    ? "Calgary, Alberta"
    : contact ? `${contact.city || ''}${contact.country ? `, ${contact.country}` : ''}`.trim() : null;
  const studioName = isPreview ? "The Terrace Studio" : (contact?.studio_name || contact?.location || null);
  const googleMapsQuery = isPreview
    ? "The Terrace Studio, Calgary, Alberta"
    : ([contact?.studio_name, contact?.studio_address, contact?.city].filter(Boolean).join(', ') || null);
  const googleMapsUrl = googleMapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}` : null;
  const studioImage = isPreview ? DEFAULT_DATA.studioImage : (contact?.image_url || null);
  const email = isPreview ? DEFAULT_DATA.email : (contact?.email || null);
  const telegram = isPreview ? DEFAULT_DATA.telegram : (contact?.telegram || null);
  const whatsapp = isPreview ? DEFAULT_DATA.whatsapp : (contact?.whatsapp || null);
  const phone = isPreview ? null : (contact?.phone_number ? `${contact.phone_code || ''} ${contact.phone_number}` : null);
  const copyright = isPreview ? DEFAULT_DATA.copyright : (ownerName || '');

  const locations = isPreview
    ? DEFAULT_DATA.locations
    : contact?.city ? [`${contact.city}${contact.country ? `, ${contact.country}` : ''}`] : [];
  const footerStudioName = isPreview ? "The Terrace Studio" : (contact?.studio_name || contact?.location || null);
  const footerMapsUrl = googleMapsUrl;

  const socials = isPreview
    ? DEFAULT_DATA.socials
    : contact ? [
        contact.instagram ? { name: "Instagram", href: contact.instagram } : null,
        contact.facebook ? { name: "Facebook", href: contact.facebook } : null,
        contact.tiktok ? { name: "TikTok", href: contact.tiktok } : null,
        contact.telegram ? { name: "Telegram", href: contact.telegram.startsWith('http') ? contact.telegram : `https://t.me/${contact.telegram.replace('@', '')}` } : null,
        contact.whatsapp ? { name: "WhatsApp", href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` } : null,
        contact.youtube ? { name: "YouTube", href: contact.youtube } : null,
      ].filter(Boolean) : [];

  return (
    <React.Fragment>
      <section id="contact" className="bg-[#050505]">
        <div className="px-6 md:px-16 pt-28 md:pt-40 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
              <p className="label-caps text-white/35 mb-2">Current location</p>
              <p className="text-[13px] tracking-[0.12em] uppercase text-white/70 font-light">
                {locationCity}
                {studioName && (
                  <>
                    {' — '}
                    {googleMapsUrl ? (
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white/50 transition-colors">
                        {studioName}
                      </a>
                    ) : studioName}
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </div>

        {studioImage && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.4 }} viewport={{ once: true }}
            className="group relative w-full overflow-hidden" style={{ height: "620px" }}>
            <img
              src={studioImage} alt="Studio"
              style={{ transition: "filter 3s ease-out" }}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />
            <motion.button initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}
              onClick={() => setFormOpen(true)}
              className="absolute bottom-10 right-8 md:right-16 px-10 py-3.5 label-caps text-black bg-white hover:bg-white hover:scale-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 active:scale-100">
              Book now
            </motion.button>
          </motion.div>
        )}

        <div className="px-6 md:px-16 py-16 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Navigate</p>
              {["About", "Portfolio", "Events", "FAQ"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Contact</p>
              {email && <a href={`mailto:${email}`} className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors">{email}</a>}
              {phone && <p className="text-[12px] font-light text-white/35">{phone}</p>}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Location</p>
              {locations.map((l, i) => <p key={i} className="text-[12px] font-light text-white/35">{l}</p>)}
              {footerMapsUrl && (
                <a href={footerMapsUrl} target="_blank" rel="noopener noreferrer" className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors">Google Maps ↗</a>
              )}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Social</p>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors">{s.name}</a>
              ))}
            </div>
          </div>
          <div className="max-w-5xl mx-auto mt-14 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <p className="label-caps text-white/15">© {new Date().getFullYear()} {copyright}</p>
            <p className="label-caps text-white/10">Powered by quarry.ink</p>
          </div>
        </div>
      </section>
      <BookingFormModal open={formOpen} onClose={() => setFormOpen(false)} ownerEmail={ownerEmail} ownerName={ownerName} siteSlug={siteSlug} contact={contact} events={events} />
    </React.Fragment>
  );
}