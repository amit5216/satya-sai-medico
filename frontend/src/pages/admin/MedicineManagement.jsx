import { useState } from 'react';
import { Plus, Pencil, Trash2, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useDataFetch } from '../../hooks/useDataFetch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input, Textarea, Label } from '../../components/ui/input';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../../components/ui/dialog';
import { DataTable } from '../../components/admin/data-table';
import { AdminPageHeader } from '../../components/admin/admin-header';
import { TableSkeleton } from '../../components/ui/skeleton';

/**
 * ============================================================
 * MEDICINE MANAGEMENT — CRUD with DataTable + Dialog
 * ============================================================
 *
 * Same composable pattern as DoctorManagement.
 * Demonstrates the power of the reusable component system:
 * swapping column definitions and form fields is all that changes.
 */
const MedicineManagement = () => {
  const { data: medicines, loading, refetch } = useDataFetch('/admin/medicines');
  const [showModal, setShowModal] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', imageUrl: '' });

  const openCreateModal = () => {
    setEditMedicine(null);
    setForm({ name: '', description: '', category: '', imageUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (m) => {
    setEditMedicine(m);
    setForm({
      name: m.name || '', description: m.description || '',
      category: m.category || '', imageUrl: m.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMedicine) {
        await api.put(`/admin/medicines/${editMedicine.id}`, form);
        toast.success('Medicine updated successfully');
      } else {
        await api.post('/admin/medicines', form);
        toast.success('Medicine added successfully');
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
    if (!window.confirm('Deactivate this medicine?')) return;
    try {
      await api.delete(`/admin/medicines/${id}`);
      toast.success('Medicine deactivated');
      refetch();
    } catch (err) {
      toast.error('Failed to deactivate medicine');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Medicine',
      render: (med) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-chart-4/10 rounded-lg">
            <Pill className="h-4 w-4 text-chart-4" />
          </div>
          <span className="font-medium text-foreground">{med.name}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (med) => med.category
        ? <Badge variant="secondary">{med.category}</Badge>
        : <span className="text-muted-foreground">—</span>
    },
    {
      key: 'active',
      header: 'Status',
      render: (med) => (
        <Badge variant={med.active ? 'success' : 'destructive'}>
          {med.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  ];

  if (loading) return <TableSkeleton columns={4} rows={6} />;

  return (
    <div>
      <AdminPageHeader
        description={`${medicines.length} total medicines`}
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" /> Add Medicine
          </Button>
        }
      />

      <DataTable
        data={medicines}
        columns={columns}
        searchKeys={['name', 'category']}
        searchPlaceholder="Search medicines..."
        emptyTitle="No medicines found"
        emptyDescription="Add your first medicine to get started."
        emptyIcon={Pill}
        actions={(med) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEditModal(med)} className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(med.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogHeader onClose={() => setShowModal(false)}>
          <DialogTitle>{editMedicine ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Medicine name" />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="e.g. Antibiotics" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} placeholder="Brief description..." />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editMedicine ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default MedicineManagement;
