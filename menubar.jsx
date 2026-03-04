import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload, Loader2 } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';

const ALL_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'how_to_book', label: 'How to Book' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'designs', label: 'Designs' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'events', label: 'Events' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'booking_form', label: 'Booking Form' },
];

export default function TemplateFormDialog({ template, onClose }) {
  const isEdit = !!template;
  const [form, setForm] = useState({
    name: template?.name || '',
    description: template?.description || '',
    preview_image: template?.preview_image || '',
    preview_screens: template?.preview_screens || [],
    is_popular: template?.is_popular || false,
    is_active: template?.is_active !== false,
    sections: template?.sections || ['hero', 'about', 'how_to_book', 'portfolio', 'faq', 'booking_form'],
    color_scheme: template?.color_scheme || 'dark',
    sort_order: template?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const toggleSection = (sectionId) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(s => s !== sectionId)
        : [...prev.sections, sectionId],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (isEdit) {
      await base44.entities.Template.update(template.id, form);
    } else {
      await base44.entities.Template.create(form);
    }
    setSaving(false);
    onClose();
  };

  const handlePreviewImageUpload = (url) => {
    setForm(prev => ({ ...prev, preview_image: url }));
  };

  const handleScreenUpload = (url) => {
    setForm(prev => ({ ...prev, preview_screens: [...prev.preview_screens, url] }));
  };

  const removeScreen = (idx) => {
    setForm(prev => ({ ...prev, preview_screens: prev.preview_screens.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Template' : 'New Template'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Dark Minimalism"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of the template..."
              rows={3}
            />
          </div>

          {/* Preview Image */}
          <div>
            <Label className="mb-2 block">Preview Image</Label>
            {form.preview_image ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={form.preview_image} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setForm(prev => ({ ...prev, preview_image: '' }))}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <PhotoUploader onChange={handlePreviewImageUpload} />
            )}
          </div>

          {/* Preview Screens */}
          <div>
            <Label className="mb-2 block">Preview Screenshots ({form.preview_screens.length})</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {form.preview_screens.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeScreen(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {form.preview_screens.length < 5 && (
              <PhotoUploader onChange={handleScreenUpload} />
            )}
          </div>

          {/* Color Scheme */}
          <div>
            <Label>Color Scheme</Label>
            <Select value={form.color_scheme} onValueChange={v => setForm(prev => ({ ...prev, color_scheme: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sections */}
          <div>
            <Label className="mb-2 block">Sections</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_SECTIONS.map(s => (
                <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={form.sections.includes(s.id)}
                    onCheckedChange={() => toggleSection(s.id)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between">
            <Label>Popular badge</Label>
            <Switch checked={form.is_popular} onCheckedChange={v => setForm(prev => ({ ...prev, is_popular: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active (visible to users)</Label>
            <Switch checked={form.is_active} onCheckedChange={v => setForm(prev => ({ ...prev, is_active: v }))} />
          </div>

          {/* Sort Order */}
          <div>
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={e => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.name} className="bg-blue-500 hover:bg-blue-600">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isEdit ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}