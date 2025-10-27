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
    try {
      await addShippingAddress(token, addressData);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  };

  const updateAddress = async (id: number, addressData: any) => {
    try {
      await updateShippingAddress(token, id, addressData);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await deleteShippingAddress(token, id);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  };

  const setDefault = async (id: number) => {
    try {
      await setDefaultShippingAddress(token, id);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
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