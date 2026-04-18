import { Users, Phone, CheckCircle2 } from 'lucide-react';
import { useDataFetch } from '../../hooks/useDataFetch';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/admin/data-table';
import { AdminPageHeader } from '../../components/admin/admin-header';
import { TableSkeleton } from '../../components/ui/skeleton';

/**
 * ============================================================
 * PATIENT MANAGEMENT — Read-only patient list
 * ============================================================
 *
 * 🎓 WHY READ-ONLY?
 * Patients are created through the public appointment booking flow.
 * Admins can view and search, but patient records are created
 * via the REST API when a patient books an appointment.
 */
const PatientManagement = () => {
  const { data: patients, loading } = useDataFetch('/admin/patients');

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (p) => <span className="text-muted-foreground font-mono text-xs">#{p.id}</span>
    },
    {
      key: 'name',
      header: 'Patient',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">{p.name}</span>
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Mobile',
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Phone className="h-3 w-3" />{p.mobile}
        </span>
      )
    },
    {
      key: 'verified',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.verified ? 'success' : 'outline'}>
          {p.verified ? <><CheckCircle2 className="h-3 w-3" /> Verified</> : 'Not Verified'}
        </Badge>
      )
    },
  ];

  if (loading) return <TableSkeleton columns={4} rows={6} />;

  return (
    <div>
      <AdminPageHeader
        description={`${patients.length} registered patients`}
      />

      <DataTable
        data={patients}
        columns={columns}
        searchKeys={['name', 'mobile']}
        searchPlaceholder="Search by name or mobile..."
        emptyTitle="No patients found"
        emptyDescription="Patients will appear here after they book appointments."
        emptyIcon={Users}
      />
    </div>
  );
};

export default PatientManagement;
