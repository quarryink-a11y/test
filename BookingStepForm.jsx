import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FaqQuestionItem from '@/components/faq/FaqQuestionItem';

export default function FaqCategorySection({ category, index, questions, onAddQuestion, onEditQuestion, onDeleteQuestion, onUpdateCategory, isOnboarding }) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(category.title);

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      onUpdateCategory(category.id, { title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Category header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !editingTitle && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
          
          {isOnboarding && (() => {
            const answered = questions.filter(q => q.answer && q.answer.trim().length > 0).length;
            return answered > 0 ? (
              <span className="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 font-medium shrink-0">
                {answered}/{questions.length}
              </span>
            ) : null;
          })()}
          {editingTitle ? (
            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                className="h-8 text-sm font-semibold"
                maxLength={80}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500" onClick={handleSaveTitle}>
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400" onClick={() => { setEditingTitle(false); setTitleValue(category.title); }}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <span className="font-semibold text-gray-900 text-sm">
              {index + 1}. {category.title}
            </span>
          )}
        </div>

        {!editingTitle && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500" onClick={() => setEditingTitle(true)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Questions */}
      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {questions.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No questions in this category yet.</p>
          )}
          {questions.map((q) => (
            <FaqQuestionItem
              key={q.id}
              item={q}
              onEdit={onEditQuestion}
              onDelete={onDeleteQuestion}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-300 rounded-lg gap-1 mt-2"
            onClick={() => onAddQuestion(category.id)}
          >
            <Plus className="w-3.5 h-3.5" /> Add question
          </Button>
        </div>
      )}
    </div>
  );
}