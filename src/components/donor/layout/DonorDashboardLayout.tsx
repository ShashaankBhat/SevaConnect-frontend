import { Outlet } from 'react-router-dom';
import { DonorSidebar } from './DonorSidebar';
import { AppNavbar } from '@/components/common/AppNavbar';

export function DonorDashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <DonorSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}