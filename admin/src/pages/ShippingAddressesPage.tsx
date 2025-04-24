import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { getShippingAddresses, createShippingAddress, updateShippingAddress, deleteShippingAddress, setDefaultShippingAddress } from '../services/api';

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  userId: number;
}

const ShippingAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    userId: '',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getShippingAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch shipping addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async () => {
    try {
      await createShippingAddress({
        ...formData,
        userId: parseInt(formData.userId),
      });
      setDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Failed to create address:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingAddress) return;
    try {
      await updateShippingAddress(editingAddress.id, {
        ...formData,
        userId: parseInt(formData.userId),
      });
      setDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteShippingAddress(id);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultShippingAddress(id);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      userId: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleOpenDialog = (address?: ShippingAddress) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        userId: address.userId.toString(),
        isDefault: address.isDefault,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 1 }} />
              Shipping Addresses Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              Add New Address
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Default</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell>{address.name}</TableCell>
                    <TableCell>{address.phone}</TableCell>
                    <TableCell>{address.address}</TableCell>
                    <TableCell>{address.userId}</TableCell>
                    <TableCell>
                      {address.isDefault && (
                        <Chip
                          icon={<HomeIcon />}
                          label="Default"
                          color="success"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(address)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(address.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        {!address.isDefault && (
                          <Tooltip title="Set as Default">
                            <IconButton
                              color="warning"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              <StarIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="User ID"
              type="number"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
              }
              label="Set as default address"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editingAddress ? handleUpdate : handleCreate}
          >
            {editingAddress ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingAddressesPage; 