import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_CATEGORIES = [
  {
    title: "Session Preparation & Process",
    questions: [
      { q: "How long does a tattoo session last?", a: "Duration depends on idea and details, but usually it's about 2–4 hours including breaks and taking photos after the session." },
      { q: "How do I prepare for the session?", a: "Please make sure you've had a good meal before the session. Wear comfortable clothing that provides easy access to the area being tattooed." },
    ],
  },
  {
    title: "Healing, Touch-ups & Sterilization",
    questions: [
      { q: "How do I take care of my tattoo after the session?", a: "Keep the tattoo clean and moisturised. Avoid direct sunlight, swimming, and scratching during the healing period (2–4 weeks)." },
      { q: "Do you offer free touch-ups?", a: "Yes, one free touch-up is included within 3 months after the session if needed due to healing issues." },
    ],
  },
  {
    title: "Pricing & Booking",
    questions: [
      { q: "How much does a tattoo cost?", a: "Pricing depends on size, complexity, and placement. Please contact me for a custom quote." },
      { q: "How do I book an appointment?", a: "Fill out the contact form below or reach out via Instagram or Telegram." },
    ],
  },
];

export default function FaqSection({ categories: catProp, items: itemsProp }) {
  const [openCat, setOpenCat] = useState(null);
  const [openQ, setOpenQ] = useState(null);

  // If real data is passed, transform it
  const categories = catProp ? catProp.map(cat => ({
    title: cat.title,
    questions: (itemsProp || []).filter(q => q.category_id === cat.id && q.answer && q.answer.trim().length > 0).map(q => ({ q: q.question, a: q.answer })),
  })).filter(c => c.questions.length > 0) : DEFAULT_CATEGORIES;

  if (catProp && categories.length === 0) return null;

  return (
    <section id="faq" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="label-caps text-white/35 mb-16">FAQ</motion.p>

        <div>
          {categories.map((cat, ci) => (
            <motion.div key={ci}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: ci * 0.08 }}
              viewport={{ once: true }}
              className="border-t border-white/[0.07]">
              <button className="w-full flex items-center justify-between py-8 text-left group"
                onClick={() => { setOpenCat(openCat === ci ? -1 : ci); setOpenQ(null); }}>
                <span className="font-serif-display text-[22px] md:text-[28px] font-light text-white/60 group-hover:text-white/90 transition-colors duration-500 tracking-tight">
                  {cat.title}
                </span>
                <motion.span animate={{ rotate: openCat === ci ? 45 : 0 }} transition={{ duration: 0.35 }}
                  className="text-white/25 text-[24px] font-extralight shrink-0 ml-6">+</motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openCat === ci && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    <div className="pl-0 md:pl-10 pb-6">
                      {cat.questions.map((item, qi) => (
                        <div key={qi} className="border-t border-white/[0.05]">
                          <button className="w-full flex items-start justify-between py-5 text-left group"
                            onClick={() => setOpenQ(openQ === `${ci}-${qi}` ? null : `${ci}-${qi}`)}>
                            <span className="text-[13px] text-white/50 group-hover:text-white/80 font-light pr-8 leading-[1.8] transition-colors duration-300">{item.q}</span>
                            <span className="text-white/20 text-[18px] font-light shrink-0 mt-0.5">{openQ === `${ci}-${qi}` ? "×" : "+"}</span>
                          </button>
                          <AnimatePresence initial={false}>
                            {openQ === `${ci}-${qi}` && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                                <p className="text-[13px] leading-[2.1] text-white/30 font-light pb-6 whitespace-pre-line">{item.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.07]" />
        </div>
      </div>
    </section>
  );
}