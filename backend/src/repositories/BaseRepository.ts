import { prisma } from '../prisma';
import { IBaseRepository } from './interfaces/IBaseRepository';

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }
  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }
  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }
  async update(id: number, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }
  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
  async findMany(where: any): Promise<T[]> {
    return this.model.findMany({ where });
  }
  async findFirst(where: any): Promise<T | null> {
    return this.model.findFirst({ where });
  }
} 