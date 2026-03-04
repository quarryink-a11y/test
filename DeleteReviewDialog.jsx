import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Trash2 } from 'lucide-react';

const SOURCES = ['Instagram', 'Google review', 'Facebook', 'Other(Email, Reddit, etc...)'];

export default function ReviewForm({ item, onClose, onSaved }) {
  const isEditing = !!item?.id;
  const [form, setForm] = useState({
    client_name: item?.client_name || '',
    source: item?.source || '',
    profile_link: item?.profile_link || '',
    client_photo_url: item?.client_photo_url || '',
    text: item?.text || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const photoRef = React.useRef();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(p => ({ ...p, client_photo_url: file_url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (isEditing) {
      await base44.entities.Review.update(item.id, form);
    } else {
      await base44.entities.Review.create(form);
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
        {/* Name + Source */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Client's name</p>
            <Input
              placeholder="Enter name"
              value={form.client_name}
              onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
              className="bg-white rounded-xl border-gray-200"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Review source</p>
            <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v }))}>
              <SelectTrigger className="bg-white rounded-xl border-gray-200">
                <SelectValue placeholder="Select review source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Profile link */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Client profile link</p>
          <Input
            placeholder="Paste the link"
            value={form.profile_link}
            onChange={e => setForm(p => ({ ...p, profile_link: e.target.value }))}
            className="bg-white rounded-xl border-gray-200"
          />
        </div>

        {/* Client photo */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Client photo</p>
          {form.client_photo_url ? (
            <div className="flex items-center gap-3">
              <img src={form.client_photo_url} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
              <Button variant="outline" size="sm" onClick={() => photoRef.current?.click()} className="rounded-lg text-xs">
                Replace
              </Button>
              <Button variant="outline" size="sm" onClick={() => setForm(p => ({ ...p, client_photo_url: '' }))} className="rounded-lg text-xs text-red-500 hover:text-red-600">
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              disabled={uploading}
              className="w-full border border-dashed border-gray-300 bg-white rounded-xl py-4 flex flex-col items-center gap-1 text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-xs">{uploading ? 'Uploading...' : 'Upload client photo'}</span>
            </button>
          )}
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>

        {/* Review text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm text-gray-500">Review</p>
            <p className="text-sm text-gray-400">{form.text.length} / 500</p>
          </div>
          <Textarea
            placeholder="Write a review here"
            value={form.text}
            onChange={e => {
              if (e.target.value.length <= 500) {
                setForm(p => ({ ...p, text: e.target.value }));
              }
            }}
            className="bg-white rounded-xl border-gray-200 min-h-[180px] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full px-8">Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.client_name || !form.text}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}