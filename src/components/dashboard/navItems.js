import { LayoutDashboard, UserPlus, ListChecks, Users, UserCog } from 'lucide-react';

export const navItems = [
  { to: '/dashboard', label: 'Analytics', short: 'Home', icon: LayoutDashboard, end: true },
  { to: '/dashboard/admission', label: 'Admission', short: 'Admit', icon: UserPlus },
  { to: '/dashboard/plans', label: 'Plans', short: 'Plans', icon: ListChecks },
  { to: '/dashboard/members', label: 'Members', short: 'Members', icon: Users },
  { to: '/dashboard/profile', label: 'Profile', short: 'Profile', icon: UserCog },
];
