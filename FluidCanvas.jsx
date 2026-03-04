import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingFormModal from "./BookingFormModal";

const DEFAULT_STEPS = [
  { num: "01", title: "Consultation", full: "Fill out the booking form. Describe your tattoo idea, preferred placement, size, style, and the dates that work best for you. I will get back to you within 2–3 business days." },
  { num: "02", title: "Deposit", full: "To confirm your appointment, a $100 deposit is required. You can send it via e-transfer, and the deposit goes towards the total cost of your tattoo session." },
  { num: "03", title: "Design Preparation", full: "Design preparation is free. Usually, I create a few designs 1 day before the session. I'll send them as Photoshop mockups so you can visualize the placement." },
  { num: "04", title: "Day of Session", full: "Bring a good mood, a favorite snack, lunch, water, or a book — whatever helps you feel comfortable during the session." },
];

export default function HowToBookSection({ steps, ownerEmail, ownerName, siteSlug, contact, events }) {
  const [open, setOpen] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const displaySteps = steps || DEFAULT_STEPS;

  return (
    <section id="how-to-book" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-16">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }} viewport={{ once: true }}
            className="label-caps text-white/35"
          >
            How to book
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }} viewport={{ once: true }}
            onClick={() => setFormOpen(true)}
            className="hidden lg:block label-caps text-white/35 border-white/35 hover:text-white/70 hover:border-white/70 border-b pb-1 transition-colors"
          >
            Book a consultation
          </motion.button>
        </div>

        <div className="w-full">
          {displaySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              viewport={{ once: true }}
              className="border-t border-white/[0.07]"
            >
              <button
                className="w-full py-8 grid grid-cols-[48px_1fr_24px] md:grid-cols-[80px_1fr_24px] gap-6 items-center text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="label-caps text-white/20 group-hover:text-white/40 transition-colors">
                  {step.num || String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif-display text-[26px] md:text-[34px] font-light text-white/80 group-hover:text-white transition-colors leading-none tracking-tight">
                  {step.title}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/30 text-[22px] font-extralight self-center justify-self-end"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (step.full || step.description) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pl-[72px] md:pl-[104px] pb-8 text-[13px] leading-[2.1] text-white/40 font-light">
                      {step.full || step.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }}
          onClick={() => setFormOpen(true)}
          className="lg:hidden mt-12 label-caps text-white/35 border-white/35 hover:text-white/70 hover:border-white/70 border-b pb-1 transition-colors"
        >
          Book a consultation
        </motion.button>

        <BookingFormModal open={formOpen} onClose={() => setFormOpen(false)} ownerEmail={ownerEmail} ownerName={ownerName} siteSlug={siteSlug} contact={contact} events={events} />
      </div>
    </section>
  );
}