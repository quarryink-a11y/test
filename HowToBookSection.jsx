import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

const DEFAULT_WORKS = [
  { id: 1, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/9464458d1_SnapInstato_436300734_443254425061319_8536183498873805865_n.jpg", size: "full arm", price: "individual" },
  { id: 2, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/e49f358a6_SnapInstato_449866674_383675288071654_1897809134897014451_n.jpg", size: "full sleeve", price: "individual" },
  { id: 3, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/001af0104_SnapInstato_451861865_1232534377750508_1161815895949202272_n.jpg", size: "forearm", price: "from ₴ 15 000" },
  { id: 4, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/e082c8180_SnapInstato_460379488_985034726969089_2642570526659495514_n.jpg", size: "upper arm", price: "from ₴ 8 000" },
  { id: 5, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/505c9ae5c_SnapInstato_468886381_18252255886287835_2159634918170559723_n.jpg", size: "full sleeve", price: "individual" },
  { id: 6, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/1f71026fa_SnapInstato_470478498_1762186724534507_628523413098444218_n.jpg", size: "full side", price: "individual" },
  { id: 7, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/c153bdccf_SnapInstato_582079210_18296316355287835_6870443204710416584_n.jpg", size: "hip / thigh", price: "individual" },
  { id: 8, src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/8d0a3d2ef_SnapInstato_617046560_18302948767287835_7650660641235711834_n.jpg", size: "full sleeve", price: "individual" },
];

export default function PortfolioSection({ items }) {
  const [lightbox, setLightbox] = useState(null);

  const works = items ? items.map(item => ({
    id: item.id,
    src: item.image_url,
    size: item.size_description || (item.size_value ? `${item.size_value} ${item.size_unit?.toLowerCase() || 'cm'}` : ''),
    price: item.price ? `from ${CURRENCY_SYMBOLS[item.currency] || '$'} ${item.price.toLocaleString()}` : 'individual',
  })) : DEFAULT_WORKS;

  return (
    <section id="portfolio" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          Portfolio
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {works.map((w, i) => (
            <motion.div
              key={w.id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              viewport={{ once: true }}
              className="cursor-pointer group bg-[#050505] overflow-hidden"
              onClick={() => setLightbox(w)}
            >
              <div className="overflow-hidden relative">
                {w.src && (
                  <>
                    <img src={w.src} alt="tattoo" className="w-full h-[200px] md:h-[260px] object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                  </>
                )}
              </div>
              <div className="px-3 py-3 flex items-baseline justify-between bg-[#0a0a0a]">
                <span className="label-caps text-white/25">{w.size}</span>
                <span className="text-[10px] text-white/50 font-light">{w.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              src={lightbox.src}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors label-caps">
              close ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}