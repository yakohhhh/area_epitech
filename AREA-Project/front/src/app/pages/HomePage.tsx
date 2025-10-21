import React from 'react';
import { Layout } from '../layout/Layout';
import { DashboardHome } from '../../features/dashboard/components/DashboardHome';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <DashboardHome />
    </Layout>
  );
};
