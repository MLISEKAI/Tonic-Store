import type { Request, Response } from 'express';
import * as statsService from '../services/statsService';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSalesByDateHandler = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }
    const result = await statsService.getSalesByDate(new Date(startDate as string), new Date(endDate as string));
    res.json(result);
  } catch (error) {
    console.error('Error fetching sales by date:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTopCustomersHandler = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const customers = await statsService.getTopCustomers(limit);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};