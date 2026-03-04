import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';

const PLACEMENTS = [
  'Forearm', 'Upper arm', 'Leg', 'Back', 'Chest', 'Thigh',
  'Calf', 'Shoulder', 'Ribcage', 'Ankle', 'Collarbone', 'Other'
];

export default function DesignForm({ item, onClose, onSaved }) {
  const isEditing = !!item?.id;
  const [form, setForm] = useState({
    name: item?.name || '',
    price: item?.price || '',
    currency: item?.currency || 'USD',
    size_value: item?.size_value || '',
    size_unit: item?.size_unit || 'Cm',
    body_placement: item?.body_placement || [],
    image_url: item?.image_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setPlacementOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const togglePlacement = (p) => {
    setForm(prev => ({
      ...prev,
      body_placement: prev.body_placement.includes(p)
        ? prev.body_placement.filter(x => x !== p)
        : [...prev.body_placement, p]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form };
    if (data.price === '' || data.price === undefined) delete data.price;
    if (isEditing) {
      await base44.entities.DesignItem.update(item.id, data);
    } else {
      await base44.entities.DesignItem.create(data);
    }
    setSaving(false);
    onSaved();
  };

  const placementLabel = form.body_placement.length > 0
    ? form.body_placement.join(', ')
    : 'Select the placement';

  return (
    <div className="bg-blue-50/50 rounded-2xl p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-5">
        {/* Design name */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">{isEditing ? 'Name of the design' : 'Design name'}</p>
          <Input
            placeholder="Enter the name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-white rounded-xl border-gray-200"
          />
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Price</p>
            <Input
              placeholder="Enter the price"
              type="number"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
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

        {/* Size + Unit */}
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Size <span className="text-gray-400">(optional)</span></p>
            <Input
              placeholder="e.g. 20 or 9-13"
              value={form.size_value}
              onChange={e => setForm(p => ({ ...p, size_value: e.target.value }))}
              className="bg-white rounded-xl border-gray-200"
            />
            <p className="text-xs text-blue-400 mt-1">Height or range in selected units</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Unit</p>
            <Select value={form.size_unit} onValueChange={v => setForm(p => ({ ...p, size_unit: v }))}>
              <SelectTrigger className="bg-white rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cm">Cm</SelectItem>
                <SelectItem value="In">In</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Body placement - collapsible dropdown with checkboxes */}
        <div ref={dropdownRef} className="relative">
          <p className="text-sm text-gray-500 mb-1.5">Preferred body placement</p>
          <button
            type="button"
            onClick={() => setPlacementOpen(!placementOpen)}
            className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
          >
            <span className={form.body_placement.length > 0 ? 'text-gray-900 truncate pr-2' : 'text-gray-400'}>
              {placementLabel}
            </span>
            {placementOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          </button>

          {placementOpen && (
            <div className="mt-1 bg-white border border-gray-200 rounded-xl p-3 space-y-3 max-h-72 overflow-y-auto">
              {PLACEMENTS.map(p => (
                <label key={p} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.body_placement.includes(p)}
                    onCheckedChange={() => togglePlacement(p)}
                  />
                  <span className="text-sm text-gray-700">{p}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Photo */}
        <PhotoUploader imageUrl={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full px-8">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.image_url} className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}