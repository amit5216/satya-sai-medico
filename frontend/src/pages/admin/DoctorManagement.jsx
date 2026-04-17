import { useState } from 'react';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
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
 * DOCTOR MANAGEMENT — CRUD page using reusable components
 * ============================================================
 *
 * 🎓 REFACTORED FROM MONOLITHIC TO COMPOSABLE:
 * Before: 156 lines with inline table, modal, form, pagination.
 * After: Uses DataTable, Dialog, AdminPageHeader, Button, Badge.
 *
 * 🎓 INTERVIEW: "How did you structure your CRUD pages?"
 * → "Each CRUD page follows the same pattern: useDataFetch hook
 *    for data loading, DataTable for search + pagination + display,
 *    Dialog component for create/edit forms, and react-hot-toast
 *    for success/error notifications. This eliminated ~60% of
 *    duplicated code across 5 management pages."
 */
const DoctorManagement = () => {
  const { data: doctors, loading, refetch } = useDataFetch('/admin/doctors');
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', specialization: '', phone: '', email: '', bio: '', imageUrl: ''
  });

  const openCreateModal = () => {
    setEditDoctor(null);
    setForm({ name: '', specialization: '', phone: '', email: '', bio: '', imageUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setEditDoctor(d);
    setForm({
      name: d.name || '', specialization: d.specialization || '',
      phone: d.phone || '', email: d.email || '',
      bio: d.bio || '', imageUrl: d.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editDoctor) {
        await api.put(`/admin/doctors/${editDoctor.id}`, form);
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/admin/doctors', form);
        toast.success('Doctor added successfully');
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
    if (!window.confirm('Deactivate this doctor?')) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success('Doctor deactivated');
      refetch();
    } catch (err) {
      toast.error('Failed to deactivate doctor');
    }
  };

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      header: 'Doctor',
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Stethoscope className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{doc.name}</p>
            <p className="text-xs text-muted-foreground">{doc.email || '—'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'specialization',
      header: 'Specialization',
      render: (doc) => (
        <Badge variant="default">{doc.specialization}</Badge>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (doc) => (
        <span className="text-muted-foreground">{doc.phone || '—'}</span>
      )
    },
    {
      key: 'active',
      header: 'Status',
      render: (doc) => (
        <Badge variant={doc.active ? 'success' : 'destructive'}>
          {doc.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  ];

  if (loading) return <TableSkeleton columns={5} rows={6} />;

  return (
    <div>
      <AdminPageHeader
        description={`${doctors.length} total doctors`}
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" /> Add Doctor
          </Button>
        }
      />

      <DataTable
        data={doctors}
        columns={columns}
        searchKeys={['name', 'specialization']}
        searchPlaceholder="Search doctors..."
        emptyTitle="No doctors found"
        emptyDescription="Add your first doctor to get started."
        emptyIcon={Stethoscope}
        actions={(doc) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEditModal(doc)} className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogHeader onClose={() => setShowModal(false)}>
          <DialogTitle>{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Dr. Full Name" />
            </div>
            <div>
              <Label>Specialization *</Label>
              <Input value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})} required placeholder="e.g. Cardiologist" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" placeholder="doctor@email.com" />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={3} placeholder="Brief professional background..." />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editDoctor ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default DoctorManagement;
