import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BookingStepForm({ editingStep, totalSteps, onSaved, onCancel }) {
  const [form, setForm] = useState({
    step_number: totalSteps + 1,
    title: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingStep) {
      setForm({
        step_number: editingStep.step_number,
        title: editingStep.title,
        description: editingStep.description || '',
      });
    } else {
      setForm({ step_number: totalSteps + 1, title: '', description: '' });
    }
  }, [editingStep, totalSteps]);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (editingStep) {
      await base44.entities.BookingStep.update(editingStep.id, form);
    } else {
      await base44.entities.BookingStep.create(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-semibold text-gray-900">
        {editingStep ? 'Edit step' : 'Add new step'}
      </h3>

      <div className="flex gap-3">
        <div className="w-20">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Step №</label>
          <Input
            type="number"
            min={1}
            value={form.step_number}
            onChange={(e) => setForm({ ...form, step_number: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
          <Input
            placeholder='e.g. "Consultation", "Deposit", "Drawing design"'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1">Examples: Consultation, Deposit, Drawing design, Day of session</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
        <Textarea
          placeholder={`Describe what happens at this step...\n\nFor example: "Fill out the booking form describing your tattoo idea, preferred placement, size, and dates. Please attach 1–3 reference images."`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          maxLength={500}
          className="h-28 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(form.description || '').length}/500 characters</p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={saving || !form.title.trim()}
          className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingStep ? 'Save changes' : 'Add step'}
        </Button>
      </div>
    </div>
  );
}