import React, { useEffect, useState } from 'react';
import { ShipperService } from '../services/shipperService';
import { Shipper } from '../types/shiper'

const ShipperManagement: React.FC = () => {
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShippers();
  }, []);

  const loadShippers = async () => {
    try {
      setLoading(true);
      const data = await ShipperService.getAllShippers();
      setShippers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load shippers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý Shipper</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shippers.map((shipper) => (
              <tr key={shipper.id}>
                <td className="px-6 py-4 whitespace-nowrap">{shipper.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipper.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipper.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipper.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipper.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(shipper.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {}}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipperManagement; 