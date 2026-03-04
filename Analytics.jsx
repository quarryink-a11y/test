import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import CatalogForm from '@/components/catalog/CatalogForm';
import CatalogCard from '@/components/catalog/CatalogCard';
import DeleteCatalogDialog from '@/components/catalog/DeleteCatalogDialog';
import ModuleToggle from '@/components/shared/ModuleToggle';
import StripeConnectCard from '@/components/catalog/StripeConnectCard';
import { useCompleteModule } from '@/components/shared/useCompleteModule';
import ModuleActivationPrompt from '@/components/shared/ModuleActivationPrompt';
import OrdersSection from '@/components/catalog/OrdersSection';

export default function Catalog() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [activated, setActivated] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['catalog-items', user?.email],
    queryFn: () => base44.entities.CatalogItem.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleSaved = () => { setShowForm(false); setEditItem(null); queryClient.invalidateQueries({ queryKey: ['catalog-items'] }); completeModule('catalog'); };

  const handleDelete = async () => {
    await base44.entities.CatalogItem.delete(deleteItem.id);
    setDeleteItem(null);
    queryClient.invalidateQueries({ queryKey: ['catalog-items'] });
  };

  const isOnboarding = user?.onboarding_status !== 'onboarding_complete';
  const alreadyCompleted = (user?.completed_modules || []).includes('catalog');
  const showPrompt = isOnboarding && !alreadyCompleted && !activated && !isLoading && items.length === 0 && !showForm;

  if (showPrompt) {
    return <ModuleActivationPrompt moduleKey="catalog" onActivate={() => setActivated(true)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Catalog</h1>
        {!showForm && (
          <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold">
            + Add new
          </Button>
        )}
      </div>
      <div className="mb-4">
        <ModuleToggle moduleKey="catalog" label="Catalog" />
      </div>

      <StripeConnectCard />

      {showForm && (
        <div className="mb-6">
          <CatalogForm item={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} onSaved={handleSaved} />
        </div>
      )}

      {!showForm && (
        <>
          <div className="bg-blue-50/60 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-gray-500">You have {items.length} products in your catalog.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 flex flex-col items-center">
                  <Skeleton className="w-full aspect-square rounded-xl mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-16 mb-3" />
                  <div className="flex gap-2 w-full">
                    <Skeleton className="h-9 flex-1 rounded-full" />
                    <Skeleton className="h-9 flex-1 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {items.map(item => (
                <CatalogCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}
              <div onClick={handleAdd} className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors min-h-[280px]">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">Add new product</p>
              </div>
            </div>
          )}
        </>
      )}

      <OrdersSection />

      {deleteItem && (
        <DeleteCatalogDialog
          itemName={deleteItem.name}
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}