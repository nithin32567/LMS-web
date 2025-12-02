import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/header/AdminNavbar';

const AdminDashboardWrapper = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardWrapper;





