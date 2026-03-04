import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';

export default function AboutBlockItem({ block, index, onChange, onRemove }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50 relative group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          {/* Block title */}
          <div>
            <Input
              placeholder='e.g. "Beyond tattooing", "What inspires me"'
              value={block.title || ''}
              onChange={(e) => onChange(index, { ...block, title: e.target.value })}
              maxLength={60}
              className="font-medium"
            />
            <p className="text-xs text-gray-400 mt-1">Title (optional) · {(block.title || '').length}/60</p>
          </div>

          {/* Block text */}
          <div>
            <Textarea
              placeholder="Write your text here..."
              value={block.text || ''}
              onChange={(e) => onChange(index, { ...block, text: e.target.value })}
              maxLength={600}
              className="h-28 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{(block.text || '').length}/600 characters</p>
          </div>
        </div>

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}