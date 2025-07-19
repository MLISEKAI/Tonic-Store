import React, { useEffect, useRef } from 'react';
import { Input, DatePicker, Select, Pagination } from 'antd';
import dayjs from 'dayjs';

interface OrderFilterProps {
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  searchName: string;
  setSearchName: (v: string) => void;
  dateRange: [string, string] | null;
  setDateRange: (v: [string, string] | null) => void;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  totalOrders: number;
  statusOptions?: { value: string; label: string }[];
}

const { RangePicker } = DatePicker;

const OrderFilter: React.FC<OrderFilterProps> = ({
  selectedStatus, setSelectedStatus,
  searchName, setSearchName,
  dateRange, setDateRange,
  paymentMethod, setPaymentMethod,
  currentPage, setCurrentPage,
  pageSize, setPageSize,
  totalOrders,
  statusOptions
}) => {
  // Debounce searchName
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [internalSearch, setInternalSearch] = React.useState(searchName);

  useEffect(() => {
    setInternalSearch(searchName);
  }, [searchName]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchName(internalSearch);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [internalSearch]);

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <Select
        value={selectedStatus}
        onChange={setSelectedStatus}
        style={{ width: 160 }}
        placeholder="Trạng thái đơn"
      >
        {(statusOptions || [
          { value: '', label: 'Tất cả trạng thái' },
          { value: 'PROCESSING', label: 'Đang xử lý' },
          { value: 'SHIPPED', label: 'Đang giao hàng' },
          { value: 'DELIVERED', label: 'Đã giao hàng' },
          { value: 'CANCELLED', label: 'Đã huỷ' },
        ]).map(opt => (
          <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
        ))}
      </Select>
      <Input.Search
        placeholder="Tìm theo tên người nhận"
        value={internalSearch}
        onChange={e => setInternalSearch(e.target.value)}
        style={{ width: 200 }}
      />
      <RangePicker
        value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
        onChange={dates => {
          if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
          } else {
            setDateRange(null);
          }
        }}
        style={{ width: 260 }}
      />
      <Select
        value={paymentMethod}
        onChange={setPaymentMethod}
        style={{ width: 180 }}
        placeholder="Phương thức thanh toán"
      >
        <Select.Option value="">Tất cả</Select.Option>
        <Select.Option value="cod">COD</Select.Option>
        <Select.Option value="bank">Chuyển khoản</Select.Option>
      </Select>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalOrders}
        onChange={setCurrentPage}
        showSizeChanger
        onShowSizeChange={(_, size) => setPageSize(size)}
        style={{ marginLeft: 'auto' }}
      />
    </div>
  );
};

export default OrderFilter; 