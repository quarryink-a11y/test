import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const EXAMPLE_TEXT = `I've been tattooing since 2016, but drawing has been a part of my life for as long as I can remember. My passion is small color tattoos inspired by anime, fantasy, and the kind of stories that live inside people.

For me, tattooing is more than art. It's a personal and meaningful connection between two people, a quiet collaboration that turns an idea into something lasting for a very long time, or even forever.`;

const PREVIEW_IMAGE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/ad6404039_2026-03-0285501.png';

export default function AboutHintTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all"
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 animate-ping" />
          <HelpCircle className="relative w-3.5 h-3.5 text-blue-500" />
        </span>
        <span className="text-[11px] font-medium text-blue-600">See example</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">Example of "About me"</p>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview image */}
            <img
              src={PREVIEW_IMAGE}
              alt="About section preview"
              className="w-full rounded-xl mb-4 border border-gray-100"
            />

            {/* Example text */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Example text:</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{EXAMPLE_TEXT}</p>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              This is how the "About me" section will look on your website
            </p>
          </div>
        </div>
      )}
    </div>
  );
}