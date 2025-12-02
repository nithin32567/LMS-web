import { Outlet } from 'react-router-dom';
import InstructorNavbar from '@/components/header/InstructorNavbar';

const InstructorDashboardWrapper = () => {
  return (
    <div className="min-h-screen bg-background">
      <InstructorNavbar />
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorDashboardWrapper;


