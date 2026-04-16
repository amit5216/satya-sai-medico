import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Settings } from 'lucide-react';
import api from '../../services/api';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '' });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try { const res = await api.get('/admin/services'); setServices(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreateModal = () => { setEditService(null); setForm({ name: '', description: '', iconUrl: '' }); setShowModal(true); };
  const openEditModal = (s) => { setEditService(s); setForm({ name: s.name||'', description: s.description||'', iconUrl: s.iconUrl||'' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editService) await api.put(`/admin/services/${editService.id}`, form);
      else await api.post('/admin/services', form);
      setShowModal(false); fetchServices();
    } catch (err) { alert(err.response?.data?.name || err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    try { await api.delete(`/admin/services/${id}`); fetchServices(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">{services.length} total services</p>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEditModal(svc)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(svc.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{svc.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{svc.description || 'No description'}</p>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${svc.active ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}`}>
              {svc.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">No services found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{editService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">{editService ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
