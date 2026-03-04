import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import PortfolioItemCard from '@/components/portfolio/PortfolioItemCard';
import AddNewCard from '@/components/portfolio/AddNewCard';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import DeleteArtworkDialog from '@/components/portfolio/DeleteArtworkDialog';
import PortfolioSuccessDialog from '@/components/portfolio/PortfolioSuccessDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Check, Info } from 'lucide-react';

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();
  const navigate = useNavigate();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['portfolio-items', user?.email],
    queryFn: () => base44.entities.PortfolioItem.filter({ created_by: user.email }, 'sort_order'),
    enabled: !!user?.email,
  });

  const isOnboarding = user?.onboarding_status !== 'onboarding_complete';
  const minItems = 3;
  const canProceed = items.length >= minItems;

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    // Optimistic update
    queryClient.setQueryData(['portfolio-items', user?.email], reordered);
    // Persist sort_order
    const updates = reordered.map((item, i) =>
      base44.entities.PortfolioItem.update(item.id, { sort_order: i })
    );
    await Promise.all(updates);
  };

  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleSaved = async () => {
    setShowForm(false);
    setEditItem(null);
    await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
  };

  const handleDelete = async () => {
    await base44.entities.PortfolioItem.delete(deleteItem.id);
    setDeleteItem(null);
    setShowDeleteSuccess(true);
    queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        {!showForm && (
          <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold">
            + Add new
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <PortfolioForm item={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} onSaved={handleSaved} />
        </div>
      )}

      {!showForm && (
        <>
          <div className={`rounded-xl px-4 py-3 mb-6 flex items-center justify-between ${canProceed ? 'bg-green-50' : 'bg-blue-50/60'}`}>
            <div className="flex items-center gap-2">
              {canProceed ? <Check className="w-4 h-4 text-green-500" /> : <Info className="w-4 h-4 text-blue-400" />}
              <p className="text-sm text-gray-600">
                {canProceed
                  ? `You have ${items.length} works in your portfolio.`
                  : `Add at least ${minItems} works to continue (${items.length}/${minItems}).`
                }
              </p>
            </div>

          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <Skeleton className="aspect-[4/5] rounded-xl mb-3" />
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="portfolio" direction="horizontal">
                {(provided) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4" ref={provided.innerRef} {...provided.droppableProps}>
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'opacity-80 scale-[1.02] transition-transform' : ''}>
                            <PortfolioItemCard item={item} onEdit={handleEdit} onDelete={setDeleteItem} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <AddNewCard onClick={handleAdd} />
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {isOnboarding && canProceed && (
            <div className="flex justify-center mt-8">
              <Button
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-10 py-2.5 text-sm font-semibold"
                onClick={async () => {
                  await completeModule('portfolio');
                  navigate(createPageUrl('Dashboard'));
                }}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteArtworkDialog
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {showDeleteSuccess && (
        <PortfolioSuccessDialog onClose={() => setShowDeleteSuccess(false)} />
      )}
    </div>
  );
}