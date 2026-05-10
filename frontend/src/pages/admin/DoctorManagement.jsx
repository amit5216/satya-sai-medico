import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Stethoscope, Camera } from 'lucide-react';
import axios from 'axios';
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

const BACKEND = 'http://localhost:8080';

const DoctorManagement = () => {
  const { data: doctors, loading, refetch } = useDataFetch('/admin/doctors');
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', specialization: '', phone: '', email: '', bio: '', imageUrl: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const openCreateModal = () => {
    setEditDoctor(null);
    setForm({ name: '', specialization: '', phone: '', email: '', bio: '', imageUrl: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setEditDoctor(d);
    setForm({
      name: d.name || '', specialization: d.specialization || '',
      phone: d.phone || '', email: d.email || '',
      bio: d.bio || '', imageUrl: d.imageUrl || ''
    });
    setPhotoFile(null);
    setPhotoPreview(d.imageUrl ? `${BACKEND}${d.imageUrl}` : null);
    setShowModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let savedDoctor;
      if (editDoctor) {
        const res = await api.put(`/admin/doctors/${editDoctor.id}`, form);
        savedDoctor = res.data;
        toast.success('Doctor updated successfully');
      } else {
        const res = await api.post('/admin/doctors', form);
        savedDoctor = res.data;
        toast.success('Doctor added successfully');
      }

      setShowModal(false);
      refetch();

      // Upload photo async in background with loading toast
      if (photoFile) {
        const toastId = toast.loading('Uploading photo...');
        try {
          const formData = new FormData();
          formData.append('file', photoFile);
          const token = localStorage.getItem('token');
          await axios.post(
            `http://localhost:8080/api/admin/doctors/${savedDoctor.id}/photo`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Photo uploaded!', { id: toastId });
          refetch();
        } catch {
          toast.error('Photo upload failed. Re-upload via Edit.', { id: toastId });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
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
    } catch {
      toast.error('Failed to deactivate doctor');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Doctor',
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {doc.imageUrl ? (
              <img src={`${BACKEND}${doc.imageUrl}`} alt={doc.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <Stethoscope className="h-4 w-4 text-secondary" />
            )}
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
      render: (doc) => <Badge variant="default">{doc.specialization}</Badge>
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (doc) => <span className="text-muted-foreground">{doc.phone || '—'}</span>
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

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogHeader onClose={() => setShowModal(false)}>
          <DialogTitle>{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">

            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>

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
