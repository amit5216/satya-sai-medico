import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Stethoscope, Calendar, Pill,
  TrendingUp, Clock, CheckCircle2, ArrowUpRight, XCircle
} from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      change: '+12%',
      icon: Users,
      href: '/admin/patients',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Doctors',
      value: stats?.activeDoctors || 0,
      change: `${stats?.totalDoctors || 0} total`,
      icon: Stethoscope,
      href: '/admin/doctors',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Appointments',
      value: stats?.totalAppointments || 0,
      change: `${stats?.appointmentStats?.today || 0} today`,
      icon: Calendar,
      href: '/admin/appointments',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Medicines',
      value: stats?.totalMedicines || 0,
      change: `${stats?.totalServices || 0} services`,
      icon: Pill,
      href: '/admin/medicines',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  const appointmentOverview = [
    {
      label: 'Pending',
      sublabel: 'Awaiting confirmation',
      value: stats?.appointmentStats?.pending || 0,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Confirmed',
      sublabel: 'Ready for visit',
      value: stats?.appointmentStats?.confirmed || 0,
      icon: CheckCircle2,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      label: 'Completed',
      sublabel: 'Finished appointments',
      value: stats?.appointmentStats?.completed || 0,
      icon: CheckCircle2,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Cancelled',
      sublabel: 'Cancelled appointments',
      value: stats?.appointmentStats?.cancelled || 0,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  const completionRate = stats?.totalAppointments > 0
    ? Math.round(((stats?.appointmentStats?.completed || 0) / stats.totalAppointments) * 100)
    : 0;

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-sm font-medium text-secondary">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Overview */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-lg font-semibold text-foreground">Appointment Overview</h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-3">
            {appointmentOverview.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-6 pb-4">
            <h2 className="text-lg font-semibold text-foreground">Performance</h2>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-4">
            {/* Completion Rate */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Completion Rate</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-secondary">{completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Today's Stats */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Today's Appointments</p>
                  <p className="text-sm text-muted-foreground">Scheduled for today</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-chart-3 mt-3">{stats?.appointmentStats?.today || 0}</p>
            </div>

            {/* Services */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <Pill className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Active Catalog</p>
                  <p className="text-sm text-muted-foreground">{stats?.totalMedicines || 0} medicines · {stats?.totalServices || 0} services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
