import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

const DEFAULT_SKETCHES = [
  { id: 1, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/0072ca819_SnapInstato_609226644_18301455037287835_589122979662976758_n.jpg", title: "Horse №001", placement: "upper arm · leg · back · chest · thigh", price: "individual" },
  { id: 2, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/b532e6a19_SnapInstato_609518839_18301455010287835_7061004684896437765_n.jpg", title: "Horse №002", placement: "upper arm · leg · back · chest · thigh", price: "individual" },
  { id: 3, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/4354cd120_SnapInstato_610411061_18301455076287835_5437790193598155125_n.jpg", title: "Horse №003", placement: "upper arm · leg · back · chest · thigh", price: "individual" },
  { id: 4, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/2c4dce426_SnapInstato_610488538_18301455046287835_7958245739251370972_n.jpg", title: "Horse №004", placement: "upper arm · leg · back · chest · thigh", price: "individual" },
];

export default function DesignsSection({ items, onBookClick }) {
  const [expanded, setExpanded] = useState(null);

  const sketches = items ? items.map(item => ({
    id: item.id,
    src: item.image_url,
    title: item.name,
    placement: item.body_placement?.join(' · ') || '',
    price: item.price ? `${CURRENCY_SYMBOLS[item.currency] || '$'}${item.price}` : 'individual',
  })) : DEFAULT_SKETCHES;

  return (
    <section id="sketches" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          Available designs
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {sketches.map((s, i) => (
            <motion.div
              key={s.id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              viewport={{ once: true }}
              className="cursor-pointer group bg-[#050505]"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="overflow-hidden relative">
                {s.src && (
                  <>
                    <img src={s.src} alt={s.title} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                  </>
                )}
              </div>
              <div className="px-3 py-4 bg-[#0a0a0a]">
                <div className="flex items-baseline justify-between gap-2 mb-0">
                  <p className="font-serif-display text-[16px] font-light text-white/70">{s.title}</p>
                  <p className="label-caps text-white/25 shrink-0">{s.price}</p>
                </div>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      {s.placement && <p className="text-[10px] leading-[1.9] text-white/30 font-light mt-3 mb-4">{s.placement}</p>}
                      <button onClick={(e) => { e.stopPropagation(); onBookClick?.(); }} className="label-caps text-white/60 border-white/20 hover:text-white hover:border-white border-b pb-0.5 transition-all duration-300">
                        Book this flash ↗
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}