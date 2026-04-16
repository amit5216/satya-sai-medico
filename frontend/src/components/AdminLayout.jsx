import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse, LayoutDashboard, Users, Stethoscope,
  Calendar, Pill, Settings, LogOut, ChevronLeft,
  ChevronRight, Bell, User, Search, Menu, X, ArrowLeft
} from 'lucide-react';

/**
 * Admin Layout — Collapsible Sidebar + Top Header + Content
 * Matches the shadcn/ui template design system.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/admin/patients', label: 'Patients', icon: Users },
    { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/medicines', label: 'Medicines', icon: Pill },
    { path: '/admin/services', label: 'Services', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // Get current page title
  const getPageTitle = () => {
    const current = navItems.find(item => isActive(item.path));
    return current?.label || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col ${
          collapsed ? 'w-[70px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-1.5 bg-sidebar-primary rounded-lg flex-shrink-0">
              <HeartPulse className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-sidebar-foreground text-lg">
                Satya Sai
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 rounded-md flex items-center justify-center transition-colors hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-muted hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-sidebar-border">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Back to Site</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[70px]' : 'lg:pl-64'}`}>
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Welcome back, {user?.username || 'Admin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="w-64 pl-9 pr-4 py-2 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-secondary rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 bg-popover border border-border rounded-lg shadow-lg py-1">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                      <p className="text-xs text-muted-foreground">{user?.role || 'ADMIN'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
