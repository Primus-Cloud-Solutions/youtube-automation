import React from 'react';

// Define the props interface for DashboardHeader
interface DashboardHeaderProps {
  activeTab: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab }) => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex space-x-4">
        {/* Your existing header content */}
        <span className="text-sm text-gray-500">Active Tab: {activeTab}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
