import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import PhotoUploader from '@/components/shared/PhotoUploader';
import AboutBlockItem from '@/components/aboutme/AboutBlockItem';
import AboutHintTooltip from '@/components/aboutme/AboutHintTooltip.jsx';

export default function AboutForm({ data, onChange }) {
  // Parse blocks from JSON string
  const blocks = React.useMemo(() => {
    if (!data.about_blocks) return [];
    try {
      return JSON.parse(data.about_blocks);
    } catch {
      return [];
    }
  }, [data.about_blocks]);

  const updateBlocks = (newBlocks) => {
    onChange({ ...data, about_blocks: JSON.stringify(newBlocks) });
  };

  const handleBlockChange = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    updateBlocks(newBlocks);
  };

  const handleAddBlock = () => {
    updateBlocks([...blocks, { title: '', text: '' }]);
  };

  const handleRemoveBlock = (index) => {
    updateBlocks(blocks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* Artist photo */}
      <PhotoUploader
        imageUrl={data.artist_photo_url}
        onChange={(url) => onChange({ ...data, artist_photo_url: url })}
      />

      {/* About text */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-sm font-medium text-gray-700">About me</label>
          <AboutHintTooltip />
        </div>
        <Textarea
          placeholder="Share your experience, philosophy, and what drives your art..."
          value={data.about_me_text || ''}
          onChange={(e) => onChange({ ...data, about_me_text: e.target.value })}
          maxLength={1200}
          className="h-36 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(data.about_me_text || '').length}/1200 characters</p>
      </div>

      {/* Dynamic blocks */}
      {blocks.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Additional blocks</label>
          {blocks.map((block, index) => (
            <AboutBlockItem
              key={index}
              block={block}
              index={index}
              onChange={handleBlockChange}
              onRemove={handleRemoveBlock}
            />
          ))}
        </div>
      )}

      {/* Add block button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddBlock}
        className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500 rounded-xl gap-2"
      >
        <Plus className="w-4 h-4" />
        Add block
      </Button>
    </div>
  );
}