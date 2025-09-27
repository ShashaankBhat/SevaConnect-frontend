import { Outlet } from 'react-router-dom';
import { DonorSidebar } from './DonorSidebar';

export function DonorDashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <DonorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}