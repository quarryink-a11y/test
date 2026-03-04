import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight, User, MapPin, Phone, Globe, X } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';
import LocationSearch from '@/components/contacts/LocationSearch';
import PhoneInput, { COUNTRY_CODES } from '@/components/contacts/PhoneInput';

// Map country names to phone country ids
const COUNTRY_NAME_TO_PHONE = {
  'united states': 'us', 'usa': 'us', 'us': 'us',
  'canada': 'ca',
  'united kingdom': 'uk', 'uk': 'uk', 'great britain': 'uk', 'england': 'uk',
  'germany': 'de', 'deutschland': 'de',
  'france': 'fr',
  'italy': 'it', 'italia': 'it',
  'spain': 'es', 'españa': 'es',
  'ukraine': 'ua', 'україна': 'ua',
  'poland': 'pl', 'polska': 'pl',
  'austria': 'at', 'österreich': 'at',
  'czech republic': 'cz', 'czechia': 'cz',
  'japan': 'jp',
  'south korea': 'kr', 'korea': 'kr',
  'australia': 'au',
  'united arab emirates': 'ae', 'uae': 'ae',
  'israel': 'il',
  'turkey': 'tr', 'türkiye': 'tr',
};

function matchPhoneCountry(countryName) {
  if (!countryName) return null;
  const lower = countryName.toLowerCase().trim();
  const id = COUNTRY_NAME_TO_PHONE[lower];
  if (!id) return null;
  const match = COUNTRY_CODES.find(c => c.id === id);
  return match ? { code: match.code, id: match.id } : null;
}

const OPTIONAL_SOCIALS = [
  { key: 'telegram', label: 'Telegram', placeholder: '@Username' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'Phone number' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@name' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
];

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ProfileStep({ onNext }) {
  const [form, setForm] = useState({
    artist_full_name: '', short_description: '', profile_image_url: '',
    country: '', city: '', studio_name: '', studio_address: '',
    email: '',
    phone_code: '+1', phone_country_id: 'us', phone_number: '',
    instagram: '',
    telegram: '', whatsapp: '', tiktok: '', facebook: '', youtube: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) =>
    setForm((p) => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 40);

  const canContinue = form.artist_full_name.trim().length >= 2;

  const handleNext = async () => {
    if (!canContinue) return;
    setSaving(true);
    await onNext(form, generateSlug(form.artist_full_name));
    setSaving(false);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set up your artist profile</h1>
        <p className="text-gray-500 text-sm">Fill in your details — this will be shown on your site. You can update everything later in Settings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

        {/* ── Artist Profile ── */}
        <SectionHeader icon={User} title="Artist Profile" subtitle="Your name & bio — shown on your site and invoices" />

        <div className="flex justify-center">
          <PhotoUploader
            imageUrl={form.profile_image_url}
            onChange={(url) => setForm((p) => ({ ...p, profile_image_url: url }))}
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1.5">Artist full name *</p>
          <Input value={form.artist_full_name} onChange={set('artist_full_name')} placeholder="e.g. Anna Zelenska" className="bg-white rounded-xl border-gray-200" />
          {form.artist_full_name.trim() && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 mt-2">
              <p className="text-xs text-gray-500">Your free domain:</p>
              <p className="text-sm font-medium text-blue-700">quarry.ink/{generateSlug(form.artist_full_name)}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1.5">Short description</p>
          <Textarea
            value={form.short_description}
            onChange={set('short_description')}
            placeholder='e.g. "Tattoo artist who creates small color tattoos inspired by fantasy, anime, and art."'
            maxLength={150}
            className="h-20 resize-none bg-white rounded-xl border-gray-200"
          />
          <p className="text-xs text-gray-400 mt-1">{form.short_description.length}/150</p>
        </div>

        {/* ── Location & Studio ── */}
        <SectionHeader icon={MapPin} title="Location & Studio" subtitle="Where clients can find you" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Country</p>
            <LocationSearch value={form.country} onChange={(val) => {
              const v = typeof val === 'object' && val?.target ? val.target.value : val;
              setForm(p => {
                const updated = { ...p, country: v };
                const phone = matchPhoneCountry(v);
                if (phone) { updated.phone_code = phone.code; updated.phone_country_id = phone.id; }
                return updated;
              });
            }} placeholder="Country" searchType="country" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">City</p>
            <LocationSearch value={form.city} onChange={set('city')} placeholder="City" searchType="city" country={form.country} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Studio name</p>
            <Input value={form.studio_name} onChange={set('studio_name')} placeholder="e.g. Black Ink Studio" className="bg-white rounded-xl border-gray-200" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Studio address</p>
            <Input value={form.studio_address} onChange={set('studio_address')} placeholder="e.g. 123 Main St, Suite 4" className="bg-white rounded-xl border-gray-200" />
          </div>
        </div>

        {/* ── Contact Details ── */}
        <SectionHeader icon={Phone} title="Contact Details" subtitle="How clients reach you" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Email</p>
            <Input value={form.email} onChange={set('email')} placeholder="your@email.com" className="bg-white rounded-xl border-gray-200" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Phone number</p>
            <PhoneInput
              code={form.phone_code}
              countryId={form.phone_country_id}
              number={form.phone_number}
              onCodeChange={(code, id) => setForm(p => ({ ...p, phone_code: code, phone_country_id: id }))}
              onNumberChange={v => setForm(p => ({ ...p, phone_number: v }))}
            />
          </div>
        </div>

        {/* ── Social Media ── */}
        <SectionHeader icon={Globe} title="Social Media" subtitle="Instagram is primary — the rest is optional" />

        <div>
          <p className="text-sm text-gray-500 mb-1.5">Instagram <span className="text-blue-500">★</span></p>
          <Input value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/yourname" className="bg-white rounded-xl border-gray-200" />
        </div>

        {OPTIONAL_SOCIALS.filter(s => form[s.key]).map(s => (
          <div key={s.key} className="flex items-end gap-2">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1.5">{s.label}</p>
              <Input value={form[s.key]} onChange={set(s.key)} placeholder={s.placeholder} className="bg-white rounded-xl border-gray-200" />
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-red-500" onClick={() => setForm(p => ({ ...p, [s.key]: '' }))}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {OPTIONAL_SOCIALS.filter(s => !form[s.key]).length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Add social network</p>
            <Select onValueChange={(key) => setForm(p => ({ ...p, [key]: ' ' }))}>
              <SelectTrigger className="bg-white rounded-xl border-gray-200 w-full">
                <SelectValue placeholder="Choose a network to add..." />
              </SelectTrigger>
              <SelectContent>
                {OPTIONAL_SOCIALS.filter(s => !form[s.key]).map(s => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Studio photo */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Studio photo</p>
          <PhotoUploader imageUrl={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!canContinue || saving}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-xl text-base gap-2"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            <>Save & Continue <ArrowRight className="w-5 h-5" /></>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          You can update all of this later in Settings.
        </p>
      </div>
    </div>
  );
}