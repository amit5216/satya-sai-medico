import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Pill, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [form, setForm] = useState({ name: '', description: '', category: '', imageUrl: '' });

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try { const res = await api.get('/admin/medicines'); setMedicines(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreateModal = () => { setEditMedicine(null); setForm({ name: '', description: '', category: '', imageUrl: '' }); setShowModal(true); };
  const openEditModal = (m) => { setEditMedicine(m); setForm({ name: m.name||'', description: m.description||'', category: m.category||'', imageUrl: m.imageUrl||'' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMedicine) await api.put(`/admin/medicines/${editMedicine.id}`, form);
      else await api.post('/admin/medicines', form);
      setShowModal(false); fetchMedicines();
    } catch (err) { alert(err.response?.data?.name || err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this medicine?')) return;
    try { await api.delete(`/admin/medicines/${id}`); fetchMedicines(); } catch (err) { console.error(err); }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || (m.category||'').toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">{medicines.length} total medicines</p>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Medicine
        </button>
      </div>

      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search medicines..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((med) => (
                <tr key={med.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-4/10 rounded-lg"><Pill className="h-4 w-4 text-chart-4" /></div>
                      <span className="text-sm font-medium text-foreground">{med.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {med.category ? <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{med.category}</span> : <span className="text-muted-foreground text-sm">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${med.active ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}`}>{med.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEditModal(med)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors mr-1"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(med.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-muted-foreground">No medicines found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Showing {(currentPage-1)*itemsPerPage+1} to {Math.min(currentPage*itemsPerPage, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <span className="px-3 text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{editMedicine ? 'Edit Medicine' : 'Add Medicine'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                <input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="e.g. Antibiotics" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">{editMedicine ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManagement;
