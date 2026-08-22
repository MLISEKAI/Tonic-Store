import type { Request, Response } from 'express';
import * as shippingAddressService from '../services/shippingAddressService';

export const getShippingAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Nếu là admin, lấy tất cả địa chỉ
    if (userRole === 'ADMIN') {
      const addresses = await shippingAddressService.getAllShippingAddresses();
      res.json(addresses);
      return;
    }

    // Nếu là user thường, chỉ lấy địa chỉ của họ
    const addresses = await shippingAddressService.getShippingAddresses(userId);
    res.json(addresses);
  } catch (error) {
    console.error('Error getting shipping addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid address ID' });
      return;
    }

    const address = await shippingAddressService.getShippingAddress(id, userId);
    if (!address) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    res.json(address);
  } catch (error) {
    console.error('Error getting shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, phone, address, isDefault } = req.body;
    if (!name || !phone || !address) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newAddress = await shippingAddressService.createShippingAddress(userId, {
      name,
      phone,
      address,
      isDefault
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid address ID' });
      return;
    }

    const { name, phone, address, isDefault } = req.body;
    const updatedAddress = await shippingAddressService.updateShippingAddress(id, userId, {
      name,
      phone,
      address,
      isDefault
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error('Error updating shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid address ID' });
      return;
    }

    await shippingAddressService.deleteShippingAddress(id, userId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setDefaultShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid address ID' });
      return;
    }

    const updatedAddress = await shippingAddressService.setDefaultShippingAddress(id, userId);
    res.json(updatedAddress);
  } catch (error) {
    console.error('Error setting default shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 