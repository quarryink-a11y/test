import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function FaqQuestionForm({ categoryId, onSave, onCancel }) {
  const [form, setForm] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.question.trim()) return;
    setSaving(true);
    await onSave(categoryId, form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h3 className="font-semibold text-gray-900">Add question</h3>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Question</label>
          <Input
            placeholder="e.g. How long does a session last?"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            maxLength={200}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Answer (optional)</label>
          <Textarea
            placeholder="Write your answer..."
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            maxLength={2000}
            className="h-28 resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.question.trim()}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}