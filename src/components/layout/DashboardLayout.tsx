import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

const DashboardLayout = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header sidebarHovered={sidebarHovered} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar onHoverChange={setSidebarHovered} />
        <main 
          className={`flex-1 p-6 overflow-x-hidden transition-all ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-16'}`}
          style={{ transitionDuration: '320ms' }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
