import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  MessageSquare,
  Star,
  Settings,
  TrendingUp,
  FileText,
  Users,
  PlusCircle,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface DashboardSidebarProps {
  userType: 'worker' | 'customer' | 'admin';
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ userType, isOpen = true, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  const workerLinks = [
    { to: '/worker-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Search, label: 'Find Jobs' },
    { to: '/my-jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/ai-recommendations', icon: TrendingUp, label: 'AI Recommendations' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const customerLinks = [
    { to: '/customer-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/post-job', icon: PlusCircle, label: 'Post a Job' },
    { to: '/my-postings', icon: FileText, label: 'My Postings' },
    { to: '/find-workers', icon: Search, label: 'Find Workers' },
    { to: '/ai-recommendations', icon: TrendingUp, label: 'AI Recommendations' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = userType === 'worker' ? workerLinks : userType === 'customer' ? customerLinks : adminLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-card border-r transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full overflow-y-auto p-4">
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
