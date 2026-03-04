import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminCard from '@/components/admins/AdminCard';
import AdminForm from '@/components/admins/AdminForm';
import DeleteAdminDialog from '@/components/admins/DeleteAdminDialog';
import AdminSuccessDialog from '@/components/admins/AdminSuccessDialog';
import { useCompleteModule } from '@/components/shared/useCompleteModule';

export default function Admins() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const { completeModule } = useCompleteModule();

  // Mark welcome/admins step as complete when visiting
  React.useEffect(() => { completeModule('welcome'); }, []);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admin-profiles', user?.email],
    queryFn: () => base44.entities.AdminProfile.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (admin) => {
    setEditing(admin);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    const { password, repeat_password, ...data } = formData;
    if (editing) {
      await base44.entities.AdminProfile.update(editing.id, data);
    } else {
      await base44.entities.AdminProfile.create({ ...data, role: 'Admin' });
      // Invite user with role "user" (admin in our app context)
      if (formData.email) {
        await base44.users.inviteUser(formData.email, "admin");
      }
    }
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (deleting) {
      await base44.entities.AdminProfile.delete(deleting.id);
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      setDeleting(null);
      setShowSuccess(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6">
          <Plus className="w-4 h-4 mr-1" /> Add admin
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Users className="w-4 h-4 text-blue-500" />
          <p className="font-semibold text-sm text-gray-900">Manage your team</p>
        </div>
        <p className="text-xs text-gray-500">
          Invite your assistant, manager, or anyone on your side.<br />
          Pick the sections they can edit and let everything run smoothly 😎
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <AdminForm
            admin={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Admin list */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map(admin => (
            <AdminCard
              key={admin.id}
              admin={admin}
              isOwner={admin.role === 'Owner'}
              onEdit={handleEdit}
              onDelete={setDeleting}
            />
          ))}

          {/* Add new card */}
          {!showForm && (
            <button onClick={handleAdd}
              className="w-full bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl py-12 flex flex-col items-center gap-2 hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">Add a new admin</p>
            </button>
          )}
        </div>
      )}

      {/* Dialogs */}
      {deleting && (
        <DeleteAdminDialog
          onCancel={() => setDeleting(null)}
          onDelete={handleDelete}
        />
      )}
      {showSuccess && (
        <AdminSuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}