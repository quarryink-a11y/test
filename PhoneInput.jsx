import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';

const CATEGORIES = ['Merch', 'Gift Certificate', 'Print', 'Sticker', 'Other'];

export default function CatalogForm({ item, onClose, onSaved }) {
  const isEditing = !!item?.id;
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    currency: item?.currency || 'USD',
    category: item?.category || 'Other',
    image_url: item?.image_url || '',
    is_active: item?.is_active !== undefined ? item.is_active : true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, price: Number(form.price) };
    if (isEditing) {
      await base44.entities.CatalogItem.update(item.id, data);
    } else {
      await base44.entities.CatalogItem.create(data);
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
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Product name</p>
          <Input
            placeholder="Enter product name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-white rounded-xl border-gray-200"
          />
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Description</p>
          <Textarea
            placeholder="Short product description"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="bg-white rounded-xl border-gray-200 h-20"
          />
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Price</p>
            <Input
              placeholder="0.00"
              type="number"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="bg-white rounded-xl border-gray-200"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Currency</p>
            <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
              <SelectTrigger className="bg-white rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="UAH">UAH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Category</p>
          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
            <SelectTrigger className="bg-white rounded-xl border-gray-200"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Photo */}
        <PhotoUploader imageUrl={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Visible on website</p>
          <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full px-8">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.name || !form.price} className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}