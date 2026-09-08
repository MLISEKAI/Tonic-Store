import { TopUpPackage } from '@prisma/client';

export interface ITopUpPackageRepository {
  findAll(): Promise<TopUpPackage[]>;
  findById(id: number): Promise<TopUpPackage | null>;
  findActive(): Promise<TopUpPackage[]>;
  create(data: {
    name: string;
    description?: string;
    amount: number;
    bonusAmount?: number;
    displayOrder?: number;
    icon?: string;
  }): Promise<TopUpPackage>;
  update(id: number, data: Partial<TopUpPackage>): Promise<TopUpPackage>;
  delete(id: number): Promise<TopUpPackage>;
}
