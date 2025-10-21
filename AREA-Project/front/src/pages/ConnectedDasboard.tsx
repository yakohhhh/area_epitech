import React from 'react';
import LeftSidebar from '../features/ConnectedDashboard/components/LeftSidebar';
import CenterBoard from '../features/ConnectedDashboard/components/CenterBoard';
import RightSidebar from '../features/ConnectedDashboard/components/RightSidebar';
import SidebarNavigation from '../components/Navigation/SidebarNavigation';
import '../styles/ConnectedDashboard.css';

const ConnectedDashboard: React.FC = () => {
  return (
    <>
      <SidebarNavigation />
      <div className="cd-layout cd-under-topbar">
        <LeftSidebar />
        <CenterBoard />
        <RightSidebar />
      </div>
    </>
  );
};

export default ConnectedDashboard;
