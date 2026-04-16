import { useEffect, useState } from 'react';
import { Search, Phone, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      try { const res = await api.get('/admin/patients'); setPatients(res.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">{patients.length} registered patients</p>
      </div>

      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search by name or mobile..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((patient) => (
                <tr key={patient.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">#{patient.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{patient.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{patient.mobile}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.verified ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      {patient.verified ? <><CheckCircle2 className="h-3 w-3" /> Verified</> : 'Not Verified'}
                    </span>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-muted-foreground">No patients found</td></tr>}
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
    </div>
  );
};

export default PatientManagement;
