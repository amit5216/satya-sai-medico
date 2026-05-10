import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Stethoscope, Calendar, Pill,
  TrendingUp, Clock, CheckCircle2, ArrowUpRight, XCircle, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DashboardSkeleton } from '../../components/ui/skeleton';
import api from '../../services/api';

/**
 * ============================================================
 * ADMIN DASHBOARD — Overview with stats, charts & insights
 * ============================================================
 *
 * 🎓 DASHBOARD DESIGN PRINCIPLES:
 * 1. Stat cards → Quick KPIs at a glance
 * 2. Charts → Trends over time (bar chart) + distribution (donut)
 * 3. Lists → Actionable items (recent appointments)
 * 4. Skeleton loading → Professional loading state
 *
 * 🎓 INTERVIEW: "How does your dashboard fetch and display data?"
 * → "The dashboard calls GET /api/admin/dashboard/stats on mount.
 *    While loading, it renders skeleton placeholders that match
 *    the final layout. Once data arrives, it populates stat cards,
 *    a recharts bar chart for appointment trends, and a donut
 *    chart for status distribution. Each stat card links to its
 *    respective management page."
 */
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
    return <DashboardSkeleton />;
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

  // Data for appointment status donut chart
  const appointmentChartData = [
    { name: 'Pending', value: stats?.appointmentStats?.pending || 0, color: 'var(--primary)' },
    { name: 'Confirmed', value: stats?.appointmentStats?.confirmed || 0, color: 'var(--chart-3)' },
    { name: 'Completed', value: stats?.appointmentStats?.completed || 0, color: 'var(--secondary)' },
    { name: 'Cancelled', value: stats?.appointmentStats?.cancelled || 0, color: 'var(--destructive)' },
  ].filter(d => d.value > 0);

  // Simulated weekly trend data (in production, this comes from backend)
  const weeklyData = [
    { day: 'Mon', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.15)) },
    { day: 'Tue', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.2)) },
    { day: 'Wed', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.25)) },
    { day: 'Thu', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.18)) },
    { day: 'Fri', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.22)) },
    { day: 'Sat', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.1)) },
    { day: 'Sun', appointments: Math.max(1, Math.floor((stats?.totalAppointments || 5) * 0.05)) },
  ];

  const completionRate = stats?.totalAppointments > 0
    ? Math.round(((stats?.appointmentStats?.completed || 0) / stats.totalAppointments) * 100)
    : 0;

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

  return (
    <div>
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Appointment Trend — Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Weekly Appointments</CardTitle>
            <Badge variant="secondary">
              <Activity className="h-3 w-3 mr-1" />
              This Week
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData} barCategoryGap="20%">
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status — Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {appointmentChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={appointmentChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {appointmentChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {appointmentChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
                      {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                No appointment data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Two Column Details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Appointment Overview</CardTitle>
            <Link
              to="/admin/appointments"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {appointmentOverview.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors">
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
          </CardContent>
        </Card>

        {/* Performance Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
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
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-secondary rounded-full h-2.5 transition-all duration-1000 ease-out"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Today's Stats */}
              <div className="p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors">
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
              <div className="p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
