import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const metadata = {
  title: 'Admin',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
