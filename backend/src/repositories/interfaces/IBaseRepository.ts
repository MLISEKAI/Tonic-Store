export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<T>;
  findMany(where: any): Promise<T[]>;
  findFirst(where: any): Promise<T | null>;
} 