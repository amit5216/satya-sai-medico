import { useState } from 'react';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useDataFetch } from '../../hooks/useDataFetch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input, Textarea, Label } from '../../components/ui/input';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../../components/ui/dialog';
import { AdminPageHeader } from '../../components/admin/admin-header';
import { Card, CardContent } from '../../components/ui/card';
import { EmptyState } from '../../components/ui/empty-state';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * ============================================================
 * SERVICE MANAGEMENT — Card grid layout with CRUD
 * ============================================================
 *
 * 🎓 WHY CARD GRID INSTEAD OF TABLE?
 * Services have fewer fields (name + description) and benefit
 * from a visual card layout that shows more content at once.
 * Tables work better for high-density data (doctors, medicines).
 */
const ServiceManagement = () => {
  const { data: services, loading, refetch } = useDataFetch('/admin/services');
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '' });

  const openCreateModal = () => {
    setEditService(null);
    setForm({ name: '', description: '', iconUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setEditService(s);
    setForm({ name: s.name || '', description: s.description || '', iconUrl: s.iconUrl || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editService) {
        await api.put(`/admin/services/${editService.id}`, form);
        toast.success('Service updated successfully');
      } else {
        await api.post('/admin/services', form);
        toast.success('Service added successfully');
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.name || err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success('Service deactivated');
      refetch();
    } catch (err) {
      toast.error('Failed to deactivate service');
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-10 w-full max-w-xs mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        description={`${services.length} total services`}
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        }
      />

      {/* Card Grid */}
      {services.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card key={svc.id} className="hover:shadow-md hover:border-primary/20 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(svc)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(svc.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{svc.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{svc.description || 'No description'}</p>
                <Badge variant={svc.active ? 'success' : 'destructive'}>
                  {svc.active ? 'Active' : 'Inactive'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Settings}
            title="No services found"
            description="Add your first service to get started."
            action={
              <Button onClick={openCreateModal} size="sm">
                <Plus className="h-4 w-4" /> Add Service
              </Button>
            }
          />
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogHeader onClose={() => setShowModal(false)}>
          <DialogTitle>{editService ? 'Edit Service' : 'Add Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Service name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} placeholder="What this service provides..." />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editService ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
