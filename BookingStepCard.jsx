import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, Pencil, HelpCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import debounce from 'lodash/debounce';

const ANSWER_HINTS = {
  'Is it possible to create an individual design?': 'E.g.: "Absolutely! I create custom designs based on your ideas, references, and style preferences. We\'ll discuss all the details before the session."',
  "What's tips for choosing placement for a tattoo?": 'E.g.: "Think about visibility, pain tolerance, and how the design flows with your body. I\'m happy to help you choose the best spot during our consultation."',
  'Is a deposit required? How to send it?': 'E.g.: "Yes, a deposit is required to reserve your slot. I\'ll send you payment details after we confirm the design and date."',
  'How long does the session last?': 'E.g.: "It depends on the size and complexity — small pieces take 1-3 hours, larger projects may need a full day or multiple sessions."',
  'What if I want to cancel or reschedule my appointment?': 'E.g.: "Please let me know at least 48 hours in advance. Late cancellations may result in losing the deposit."',
  'How to prepare for the session?': 'E.g.: "Get a good night\'s sleep, eat well before the session, stay hydrated, and avoid alcohol 24 hours before."',
  'How painful is the tattooing process?': 'E.g.: "Pain varies by placement and personal threshold. Most clients describe it as manageable — I\'ll make sure you\'re comfortable throughout."',
  'Are there any AGE restrictions?': 'E.g.: "You must be 18+ to get a tattoo. A valid ID is required at the session."',
  'What is the proper tattoo aftercare?': 'E.g.: "Keep the tattoo clean, moisturized, and out of direct sunlight. I\'ll give you detailed aftercare instructions after the session."',
  'How long does the aftercare process usually last?': 'E.g.: "Full healing takes about 2-4 weeks. The first week is the most important — follow the aftercare guide closely."',
  'Is it normal if the tattoo looks a bit different from the design?': 'E.g.: "Minor differences can happen due to skin type and placement. The final result is always discussed and approved before we start."',
  'Do I need a touch-up? How often?': 'E.g.: "Some tattoos may need a small touch-up after healing. I offer one free touch-up within 3 months of the session."',
  'Is the touch-up included in the price?': 'E.g.: "Yes, one touch-up is included within 3 months after the session if needed."',
  'What should I do if the tattoo peels, itches, or looks unusual?': 'E.g.: "Light peeling and itching are normal during healing. Don\'t scratch — apply moisturizer. If something looks off, send me a photo and I\'ll advise."',
  'Can I cover an old tattoo with a new one?': 'E.g.: "Yes, cover-ups are possible! Send me a photo of the existing tattoo so I can assess what\'s doable."',
  'Is it safe to get a tattoo after surgery, burns, or on scars?': 'E.g.: "It depends on the healing stage. Usually we wait at least 1 year after the skin has fully healed. Please consult your doctor first."',
  'How do you ensure everything is sterile and safe?': 'E.g.: "I use single-use needles, hospital-grade sterilization, and disposable supplies. Your safety is my top priority."',
  'What tools and materials do you use during the session?': 'E.g.: "I work with professional-grade machines and high-quality, certified inks. All needles and cartridges are single-use."',
  'Can I come with a friend?': 'E.g.: "One friend is welcome! But please keep the studio calm — it helps me focus on giving you the best result."',
  'How can I pay after the session?': 'E.g.: "I accept cash, card, and e-transfers. Payment details will be shared before the appointment."',
  'Can a large tattoo be split into multiple sessions?': 'E.g.: "Absolutely — large pieces are usually done in 2-4 sessions for comfort and best results."',
  'Do you offer gift certificates?': 'E.g.: "Yes! Gift certificates are available in any amount. Perfect for birthdays, holidays, or just because."',
  'Where is the studio located?': 'E.g.: "The studio is located at [your address]. I\'ll send you the exact location and parking info before your appointment."',
  'Is there parking near the studio?': 'E.g.: "Yes, there\'s free street parking and a paid lot nearby. I\'ll share details when we confirm your booking."',
};

export default function FaqQuestionItem({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [localAnswer, setLocalAnswer] = useState(item.answer || '');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const answerLen = localAnswer.length;
  const isValid = answerLen === 0 || answerLen >= 50;
  const hint = ANSWER_HINTS[item.question];

  const hasChanges = localAnswer !== (item.answer || '');

  // Sync local state when item changes externally
  useEffect(() => {
    setLocalAnswer(item.answer || '');
  }, [item.answer]);

  const handleChange = (e) => {
    setLocalAnswer(e.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    await onEdit(item.id, { answer: localAnswer });
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => {
      setExpanded(false);
      setTimeout(() => setJustSaved(false), 300);
    }, 600);
  };

  return (
    <div className="border border-gray-100 rounded-lg bg-gray-50/50">
      {/* Question row */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="mt-0.5 shrink-0 text-gray-400">
          {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{item.question}</p>
          {!item.answer && !justSaved ? (
            <p className="text-xs text-gray-400 mt-0.5">No answer yet</p>
          ) : (justSaved || item.answer) && !expanded ? (
            <p className="text-xs text-green-500 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {justSaved ? 'Saved!' : 'Answered'}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Answer area */}
      {expanded && (
        <div className="px-3 pb-3 pt-1">
          {hint && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-600">{hint}</p>
            </div>
          )}
          <Textarea
            value={localAnswer}
            onChange={handleChange}
            placeholder="Write your answer here..."
            className={`h-28 resize-none text-sm ${!isValid ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
            maxLength={2000}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {!isValid && (
                <p className="text-xs text-red-500">Minimum 50 characters required</p>
              )}
              <p className="text-xs text-gray-400">{answerLen}/2000</p>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges || !isValid}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg gap-1.5 h-8 px-4"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}