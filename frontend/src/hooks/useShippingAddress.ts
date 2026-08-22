import { useState, useEffect } from 'react';
import {
  getShippingAddresses,
  addShippingAddress,
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

export function useShippingAddress(token: string) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getShippingAddresses(token);
      setAddresses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: any) => {
    await addShippingAddress(token, addressData);
    await fetchAddresses();
  };

  const updateAddress = async (id: number, addressData: any) => {
    await updateShippingAddress(token, id, addressData);
    await fetchAddresses();
  };

  const deleteAddress = async (id: number) => {
    await deleteShippingAddress(token, id);
    await fetchAddresses();
  };

  const setDefault = async (id: number) => {
    await setDefaultShippingAddress(token, id);
    await fetchAddresses();
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    refresh: fetchAddresses
  };
} 