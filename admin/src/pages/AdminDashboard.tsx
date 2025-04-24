import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Inventory2,
  People,
  Dashboard as DashboardIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement';
import UserManagement from '../components/UserManagement';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

const drawerWidth = 240;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const API_URL = import.meta.env.VITE_API_URL;

interface StatsData {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{
    status: string;
    _count: {
      status: number;
    };
  }>;
  topProducts: Array<{
    name: string;
    value: number;
  }>;
}

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6">🛒 Tonic Admin</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button selected={tabIndex === 'dashboard'} onClick={() => setTabIndex('dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={tabIndex === 'products'} onClick={() => setTabIndex('products')}>
          <ListItemIcon><Inventory2 /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button selected={tabIndex === 'users'} onClick={() => setTabIndex('users')}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button selected={tabIndex === 'shipping'} onClick={() => navigate('/shipping-addresses')}>
          <ListItemIcon><ShippingIcon /></ListItemIcon>
          <ListItemText primary="Shipping Addresses" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const Dashboard = () => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (!stats) {
      return <Typography>Error loading statistics</Typography>;
    }

    const statCards = [
      { title: 'Total Products', value: stats.totalProducts.toString(), change: '+0%', color: '#4caf50' },
      { title: 'Total Users', value: stats.totalUsers.toString(), change: '+0%', color: '#2196f3' },
      { title: 'Total Orders', value: stats.totalOrders.toString(), change: '+0%', color: '#f44336' },
      { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, change: '+0%', color: '#ff9800' },
    ];

    return (
      <Box>
        <Grid container spacing={2}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 2, backgroundColor: card.color, color: '#fff' }}>
                <Typography variant="subtitle2">{card.title}</Typography>
                <Typography variant="h5">{card.value}</Typography>
                <Typography variant="caption">{card.change}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="subtitle1">Orders by Status</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus.map(status => ({
                      name: status.status,
                      value: status._count.status
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="subtitle1">Top Selling Products</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={stats.topProducts}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <Avatar alt="Admin" src="/admin-avatar.png" />
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {tabIndex === 'dashboard' && <Dashboard />}
        {tabIndex === 'products' && <ProductManagement />}
        {tabIndex === 'users' && <UserManagement />}
      </Box>
    </Box>
  );
};

export default Layout;