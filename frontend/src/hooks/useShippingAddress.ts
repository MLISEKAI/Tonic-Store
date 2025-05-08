import { useState, useEffect } from 'react';
import { message } from 'antd';
import { 
  getShippingAddresses, 
  createShippingAddress, 
  updateShippingAddress, 
  deleteShippingAddress,
  setDefaultShippingAddress
} from '../services/api';

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export function useShippingAddress(token: string | null) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getShippingAddresses(token);
      setAddresses(data);
    } catch (error) {
      message.error('Failed to fetch shipping addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const addAddress = async (values: Omit<ShippingAddress, 'id' | 'isDefault'>) => {
    if (!token) return;
    try {
      await createShippingAddress(token, values);
      message.success('Address created successfully');
      await fetchAddresses();
    } catch (error) {
      message.error('Failed to create address');
    }
  };

  const updateAddress = async (id: number, values: Omit<ShippingAddress, 'id' | 'isDefault'>) => {
    if (!token) return;
    try {
      await updateShippingAddress(token, id, values);
      message.success('Address updated successfully');
      await fetchAddresses();
    } catch (error) {
      message.error('Failed to update address');
    }
  };

  const deleteAddress = async (id: number) => {
    if (!token) return;
    try {
      await deleteShippingAddress(token, id);
      message.success('Address deleted successfully');
      await fetchAddresses();
    } catch (error) {
      message.error('Failed to delete address');
    }
  };

  const setDefaultAddress = async (id: number) => {
    if (!token) return;
    try {
      await setDefaultShippingAddress(token, id);
      message.success('Default address updated successfully');
      await fetchAddresses();
    } catch (error) {
      message.error('Failed to set default address');
    }
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses
  };
} 