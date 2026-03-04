import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, GripVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TemplateFormDialog from '@/components/templates/TemplateFormDialog';
import DeleteTemplateDialog from '@/components/templates/DeleteTemplateDialog';

export default function Templates() {
  const [editTemplate, setEditTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list('sort_order'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.Template.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Template.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setDeleteTemplate(null);
    },
  });

  const handleEdit = (t) => {
    setEditTemplate(t);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditTemplate(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditTemplate(null);
    queryClient.invalidateQueries({ queryKey: ['templates'] });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage website templates shown during onboarding</p>
        </div>
        <Button onClick={handleNew} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-4">No templates yet</p>
          <Button onClick={handleNew} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Create First Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              t.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
            }`}>
              {/* Preview */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {t.preview_image ? (
                  <img src={t.preview_image} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                )}
                {!t.is_active && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-gray-800/80 text-white text-xs">Hidden</Badge>
                  </div>
                )}
                {t.is_popular && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{t.description}</p>
                
                {/* Sections */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(t.sections || []).map(s => (
                    <span key={s} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(t)}>
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Link to={createPageUrl('TemplatePreview') + `?templateId=${t.id}`} target="_blank">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleMutation.mutate({ id: t.id, is_active: !t.is_active })}
                  >
                    {t.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:border-red-200"
                    onClick={() => setDeleteTemplate(t)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TemplateFormDialog
          template={editTemplate}
          onClose={handleFormClose}
        />
      )}

      {deleteTemplate && (
        <DeleteTemplateDialog
          template={deleteTemplate}
          onClose={() => setDeleteTemplate(null)}
          onConfirm={() => deleteMutation.mutate(deleteTemplate.id)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}