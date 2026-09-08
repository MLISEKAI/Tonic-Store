import { TopUpPackageRepository } from '../repositories/TopUpPackageRepository';

const topUpPackageRepository = new TopUpPackageRepository();

export const getAllTopUpPackages = async () => {
  return topUpPackageRepository.findAll();
};

export const getActiveTopUpPackages = async () => {
  return topUpPackageRepository.findActive();
};

export const getTopUpPackageById = async (id: number) => {
  return topUpPackageRepository.findById(id);
};

export const createTopUpPackage = async (data: {
  name: string;
  description?: string;
  amount: number;
  bonusAmount?: number;
  displayOrder?: number;
  icon?: string;
}) => {
  return topUpPackageRepository.create(data);
};

export const updateTopUpPackage = async (id: number, data: Partial<any>) => {
  return topUpPackageRepository.update(id, data);
};

export const deleteTopUpPackage = async (id: number) => {
  return topUpPackageRepository.delete(id);
};
