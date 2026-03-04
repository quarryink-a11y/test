import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay },
  viewport: { once: true },
});

const DEFAULT_PHOTO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/1a9075dfc_SnapInstato_463100941_527061070051603_7562357127851703459_n.jpg";
const DEFAULT_TITLE = "Tattooing since 2018, creating since childhood.";
const DEFAULT_PARAGRAPHS = [
  "My style blends abstract brushwork with Ukrainian folk motifs and bold graphic elements. I work freehand whenever possible, treating the body as a living canvas where movement and composition matter as much as the design itself.",
  "Based between Kyiv and Calgary, I travel regularly for guest spots across Europe and North America. Every piece is a collaboration — your story, my craft. Let's create something unique together.",
];

const MAX_CHARS = 300;

function TextBlock({ paragraphs }) {
  const fullText = paragraphs.join('\n');
  const isLong = fullText.length > MAX_CHARS;
  const [expanded, setExpanded] = useState(false);

  const visibleParagraphs = (!isLong || expanded)
    ? paragraphs
    : (() => {
        let charCount = 0;
        const result = [];
        for (const p of paragraphs) {
          if (charCount + p.length > MAX_CHARS) {
            const remaining = MAX_CHARS - charCount;
            if (remaining > 20) result.push(p.substring(0, remaining) + '…');
            break;
          }
          result.push(p);
          charCount += p.length;
        }
        return result.length > 0 ? result : [paragraphs[0].substring(0, MAX_CHARS) + '…'];
      })();

  return (
    <div>
      {visibleParagraphs.map((p, i) => (
        <p key={i} className="text-[13px] leading-[2.1] text-white/40 font-light mb-4">{p}</p>
      ))}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white/70 border-white/20 transition-colors mt-1 border-b pb-0.5"
        >
          {expanded ? '← Show less' : 'Read more →'}
        </button>
      )}
    </div>
  );
}

export default function AboutSection({ photoUrl, aboutText, aboutBlocks, title, paragraphs }) {
  // undefined = no prop passed (preview mode) → show default photo
  const isPreview = photoUrl === undefined && aboutText === undefined && aboutBlocks === undefined;
  const photo = isPreview ? DEFAULT_PHOTO : (photoUrl || null);
  const [activeTab, setActiveTab] = useState(0);

  // Build slides: first is always "About me" main text, then each block is a separate slide
  const slides = [];

  // Slide 0: main about text
  if (aboutText) {
    slides.push({ title: null, paragraphs: aboutText.split('\n').filter(p => p.trim()) });
  }

  // Each block becomes its own slide
  if (aboutBlocks && aboutBlocks.length > 0) {
    aboutBlocks.forEach((block) => {
      if (block.title || block.text) {
        const p = block.text ? block.text.split('\n').filter(s => s.trim()) : [];
        slides.push({ title: block.title || null, paragraphs: p });
      }
    });
  }

  // Fallback: no aboutText and no blocks
  if (slides.length === 0) {
    const displayParagraphs = paragraphs || DEFAULT_PARAGRAPHS;
    slides.push({ title: title || DEFAULT_TITLE, paragraphs: displayParagraphs });
  }

  const hasMultipleSlides = slides.length > 1;
  const currentSlide = slides[activeTab] || slides[0];

  const goNext = () => setActiveTab((prev) => Math.min(prev + 1, slides.length - 1));
  const goPrev = () => setActiveTab((prev) => Math.max(prev - 1, 0));

  return (
    <section id="about" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          About
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {photo && (
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              <img src={photo} alt="Artist" className="w-full h-auto object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          <div className="flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {currentSlide.title && (
                  <h3 className="text-[28px] md:text-[36px] font-light text-white leading-[1.2] mb-6 tracking-tight">
                    {currentSlide.title}
                  </h3>
                )}
                <TextBlock paragraphs={currentSlide.paragraphs} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {hasMultipleSlides && (
              <motion.div {...fadeUp(0.2)} className="flex items-center gap-4 mt-8">
                <button
                  onClick={goPrev}
                  disabled={activeTab === 0}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    activeTab === 0
                      ? 'border-white/5 text-white/15 cursor-default'
                      : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/30 font-light">
                  {activeTab + 1} / {slides.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeTab === slides.length - 1}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    activeTab === slides.length - 1
                      ? 'border-white/5 text-white/15 cursor-default'
                      : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}