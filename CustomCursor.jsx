import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingFormModal from "./BookingFormModal";

const DEFAULT_EVENTS = [
  { dates: "01/03 – 20/03", city: "Kyiv", studio: "6:19 Tattoo Studio", status: "closed", statusType: "closed", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/87e1bf788_blackbear-eindhoven-grote-berg-1-scaled.jpg" },
  { dates: "25/03 – 10/04", city: "Amsterdam", studio: "Tattoo Hysteria Amsterdam", status: "booking open", statusType: "open", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/b656a24d2_geheimtipp-hamburg-laeden-produkte-tattoostudio-edding-neustadt-stella-bruttini-9-1-1024x683.jpg" },
  { dates: "15/04 – 30/04", city: "Calgary", studio: "The Terrace Studio", status: "soon", statusType: "soon", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/2b38ec789_homeslider_01-1.jpg" },
];

const STATUS_MAP = {
  'Bookings open': 'open',
  'Soon': 'soon',
  'Waiting list': 'soon',
  'Closed': 'closed',
};

function HoverImage({ src, city, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-32 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:block shadow-2xl"
          style={{ width: "420px", height: "320px" }}
        >
          <img src={src} alt={city} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 border border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EventsSection({ events: eventsProp, ownerEmail, ownerName, siteSlug, contact }) {
  const [hovered, setHovered] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formCity, setFormCity] = useState("");

  const events = eventsProp ? eventsProp.map(e => ({
    dates: e.date_range || '',
    city: e.city,
    studio: e.location || '',
    status: e.status?.toLowerCase() || '',
    statusType: STATUS_MAP[e.status] || 'closed',
    image: e.image_url || '',
  })) : DEFAULT_EVENTS;

  const handleBook = (event) => {
    if (event.statusType !== "open") return;
    setFormCity(event.city);
    setFormOpen(true);
  };

  return (
    <>
      <section id="events" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-16">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9 }} viewport={{ once: true }}
              className="label-caps text-white/35"
            >
              Bookings / Events
            </motion.p>
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }} viewport={{ once: true }}
              className="label-caps text-white/20 mt-1"
            >
              {new Date().getFullYear()}
            </motion.span>
          </div>

          <div className="relative">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                viewport={{ once: true }}
                className="border-t border-white/[0.07] relative group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="py-8 md:py-10 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_auto] gap-4 md:gap-8 items-center">
                  <div>
                    <p className="label-caps text-white/20 mb-2.5">{event.dates}</p>
                    <p className="font-serif-display text-[32px] md:text-[42px] font-light text-white/80 group-hover:text-white transition-colors duration-500 leading-none tracking-tight">
                      {event.city}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="label-caps text-white/15 mb-1.5">Studio</p>
                    <p className="text-[12px] tracking-[0.08em] text-white/35 group-hover:text-white/55 font-light transition-colors duration-500">
                      {event.studio}
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    {event.statusType === "open" ? (
                      <button onClick={() => handleBook(event)} className="flex items-center justify-end gap-2 ml-auto group hover:scale-110 transition-transform duration-300">
                        <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0" />
                        <span className="label-caps text-white/80 whitespace-nowrap">{event.status}</span>
                      </button>
                    ) : (
                      <span className="label-caps text-white/20">{event.status}</span>
                    )}
                  </div>
                </div>
                {event.image && <HoverImage src={event.image} city={event.city} visible={hovered === i} />}
              </motion.div>
            ))}
            <div className="border-t border-white/[0.07]" />
          </div>
        </div>
      </section>
      <BookingFormModal open={formOpen} onClose={() => setFormOpen(false)} prefillCity={formCity} ownerEmail={ownerEmail} ownerName={ownerName} siteSlug={siteSlug} contact={contact} events={eventsProp} />
    </>
  );
}