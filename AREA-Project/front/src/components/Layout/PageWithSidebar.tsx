import React from 'react';
import SidebarNavigation from '../Navigation/SidebarNavigation';

interface PageWithSidebarProps {
  children: React.ReactNode;
  className?: string;
}

const PageWithSidebar: React.FC<PageWithSidebarProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className="app-container">
      <SidebarNavigation />

      {/* Contenu principal */}
      <main className={`main-content ${className}`}>{children}</main>
    </div>
  );
};

export default PageWithSidebar;
