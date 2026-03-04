import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';
import CountrySearch from '@/components/events/CountrySearch';
import DateRangePicker from '@/components/events/DateRangePicker';

export default function EventForm({ item, onClose, onSaved }) {
  const isEditing = !!item?.id;
  const [form, setForm] = useState({
    city: item?.city || '',
    date_range: item?.date_range || '',
    end_date: item?.end_date || '',
    location: item?.location || '',
    status: item?.status || '',
    image_url: item?.image_url || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (isEditing) {
      await base44.entities.Event.update(item.id, form);
    } else {
      await base44.entities.Event.create(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="bg-blue-50/50 rounded-2xl p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-5">
        {/* Country / City */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Country / City</p>
          <CountrySearch value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Date</p>
          <DateRangePicker value={form.date_range} onChange={(v, endDate) => setForm(p => ({ ...p, date_range: v, end_date: endDate || '' }))} />
        </div>

        {/* Location */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Location</p>
          <Input
            placeholder="Enter the name of the studio or event location"
            value={form.location}
            onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
            className="bg-white rounded-xl border-gray-200"
          />
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Status</p>
          <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger className="bg-white rounded-xl border-gray-200">
              <SelectValue placeholder="Select event status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bookings open">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Bookings open
                </div>
              </SelectItem>
              <SelectItem value="Soon">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Soon
                </div>
              </SelectItem>
              <SelectItem value="Waiting list">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Waiting list
                </div>
              </SelectItem>
              <SelectItem value="Closed">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Photo */}
        <PhotoUploader imageUrl={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full px-8">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.city} className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}