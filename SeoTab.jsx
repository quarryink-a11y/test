import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, MapPin, Phone, Globe, Plus, X, Check } from 'lucide-react';
import LocationSearch from '@/components/contacts/LocationSearch';
import PhoneInput, { COUNTRY_CODES } from '@/components/contacts/PhoneInput';
import PhotoUploader from '@/components/shared/PhotoUploader';

const COUNTRY_NAME_TO_PHONE = {
  'united states': 'us', 'usa': 'us', 'us': 'us',
  'canada': 'ca',
  'united kingdom': 'uk', 'uk': 'uk', 'great britain': 'uk', 'england': 'uk',
  'germany': 'de', 'france': 'fr', 'italy': 'it', 'spain': 'es',
  'ukraine': 'ua', 'україна': 'ua', 'poland': 'pl', 'austria': 'at',
  'czech republic': 'cz', 'czechia': 'cz', 'japan': 'jp',
  'south korea': 'kr', 'korea': 'kr', 'australia': 'au',
  'united arab emirates': 'ae', 'uae': 'ae', 'israel': 'il', 'turkey': 'tr', 'türkiye': 'tr',
};
function matchPhoneCountry(name) {
  if (!name) return null;
  const id = COUNTRY_NAME_TO_PHONE[name.toLowerCase().trim()];
  if (!id) return null;
  const m = COUNTRY_CODES.find(c => c.id === id);
  return m ? { code: m.code, id: m.id } : null;
}
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/shared/AuthContext';

// NOTE: Uses useAuth() for user state — single source of truth

const OPTIONAL_SOCIALS = [
  { key: 'telegram', label: 'Telegram', placeholder: '@Username' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'Phone number' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@name' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
];

export default function ContactsTab() {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const { data: contacts = [] } = useQuery({
    queryKey: ['contact-info', user?.email],
    queryFn: () => base44.entities.ContactInfo.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const existing = contacts[0] || null;

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
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { completeModule } = useCompleteModule();

  useEffect(() => {
    if (existing && !loaded) {
      setForm({
        artist_full_name: existing.artist_full_name || '',
        short_description: existing.short_description || '',
        profile_image_url: existing.profile_image_url || '',
        country: existing.country || '',
        city: existing.city || '',
        studio_name: existing.studio_name || existing.location || '',
        studio_address: existing.studio_address || '',
        email: existing.email || '',
        phone_code: existing.phone_code || '+1',
        phone_country_id: existing.phone_country_id || 'us',
        phone_number: existing.phone_number || '',
        instagram: existing.instagram || '',
        telegram: existing.telegram || '',
        whatsapp: existing.whatsapp || '',
        tiktok: existing.tiktok || '',
        facebook: existing.facebook || '',
        youtube: existing.youtube || '',
        image_url: existing.image_url || '',
      });
      setLoaded(true);
    }
  }, [existing, loaded]);

  const generateSlug = (text) => {
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 40);
  };

  const handleSave = async () => {
    if (!form.artist_full_name || form.artist_full_name.trim().length < 2) {
      alert('Please enter your artist name (at least 2 characters).');
      return;
    }
    setSaving(true);
    if (existing) {
      await base44.entities.ContactInfo.update(existing.id, form);
    } else {
      await base44.entities.ContactInfo.create(form);
    }
    // Sync headline and slug to user entity
    const slug = generateSlug(form.artist_full_name || '');
    await base44.auth.updateMe({
      headline: form.artist_full_name || '',
      site_slug: slug,
    });
    setSaving(false);
    setSaved(true);
    queryClient.invalidateQueries({ queryKey: ['contact-info'] });

    await completeModule('artist_profile');
    await refreshUser();

    setTimeout(() => {
      setSaved(false);
    }, 1200);
  };

  const handleCancel = () => {
    if (existing) {
      setForm({
        artist_full_name: existing.artist_full_name || '',
        short_description: existing.short_description || '',
        profile_image_url: existing.profile_image_url || '',
        country: existing.country || '',
        city: existing.city || '',
        studio_name: existing.studio_name || '',
        studio_address: existing.studio_address || '',
        email: existing.email || '',
        phone_code: existing.phone_code || '+1',
        phone_country_id: existing.phone_country_id || 'us',
        phone_number: existing.phone_number || '',
        instagram: existing.instagram || '',
        telegram: existing.telegram || '',
        whatsapp: existing.whatsapp || '',
        tiktok: existing.tiktok || '',
        facebook: existing.facebook || '',
        youtube: existing.youtube || '',
        image_url: existing.image_url || '',
      });
    }
  };

  const set = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val.target ? val.target.value : val }));

  return (
    <div>
      {/* ── Artist Profile ── */}
      <SectionHeader icon={User} title="Artist Profile" subtitle="Your name & bio — shown on your site and invoices" />

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Artist full name</p>
          <Input value={form.artist_full_name} onChange={set('artist_full_name')} placeholder="e.g. Anna Zelenska" className="bg-white rounded-xl border-gray-200" />
          <p className="text-xs text-gray-400 mt-1">Used as headline on your site & business name on invoices</p>
        </div>

        {/* Domain preview */}
        {form.artist_full_name && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Your free domain:</p>
            <p className="text-sm font-medium text-blue-700">quarry.ink/{generateSlug(form.artist_full_name)}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-1.5">Short description</p>
          <Textarea
            value={form.short_description}
            onChange={set('short_description')}
            placeholder='e.g. "Tattoo artist who creates small color tattoos inspired by fantasy, anime, and art."'
            maxLength={150}
            className="h-20 resize-none bg-white rounded-xl border-gray-200"
          />
          <p className="text-xs text-gray-400 mt-1">{(form.short_description || '').length}/150 · Shown under your name on the site</p>
        </div>


      </div>

      {/* ── Location & Studio ── */}
      <SectionHeader icon={MapPin} title="Location & Studio" subtitle="Where clients can find you" />

      <div className="space-y-4 mb-8">
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
            }} placeholder="Type or select your country" searchType="country" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">City</p>
            <LocationSearch value={form.city} onChange={set('city')} placeholder="Type or select your city" searchType="city" country={form.country} />
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
      </div>

      {/* ── Contact Details ── */}
      <SectionHeader icon={Phone} title="Contact Details" subtitle="How clients reach you" />

      <div className="space-y-4 mb-8">
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

      </div>

      {/* ── Social Media ── */}
      <SectionHeader icon={Globe} title="Social Media" subtitle="Instagram is primary — the rest is optional" />

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Instagram <span className="text-blue-500">★</span></p>
          <Input value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/yourname" className="bg-white rounded-xl border-gray-200" />
        </div>

        {/* Active optional socials */}
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

        {/* Add more socials */}
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
      </div>

      {/* Studio photo */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1.5">Studio photo</p>
        <PhotoUploader imageUrl={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={handleCancel} className="rounded-full px-8 border-blue-200 text-blue-600 hover:bg-blue-50">Cancel</Button>
        <Button onClick={handleSave} disabled={saving || saved} className={`rounded-full px-8 ${saved ? 'bg-green-500 hover:bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : saved ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}

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