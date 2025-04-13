import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Products" />
          <Tab label="Users" />
        </Tabs>

        {activeTab === 0 && <ProductManagement />}
        {activeTab === 1 && <UserManagement />}
      </Paper>
    </Box>
  );
};

export default AdminDashboard; 