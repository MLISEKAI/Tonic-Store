import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Checkbox, Space, Card, Typography, notification } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { productService } from '../services/productService';
import { Product } from '../types/product';

const { Title } = Typography;
const { TextArea } = Input;

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [editSoldCount, setEditSoldCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      const formattedProducts = Array.isArray(data) ? data.map(product => {
        return {
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          promotionalPrice: product.promotionalPrice || 0,
          stock: product.stock || 0,
          imageUrl: product.imageUrl || '',
          category: product.category || '',
          createdAt: product.createdAt || '',
          updatedAt: product.updatedAt || '',
          viewCount: product.viewCount || 0,
          soldCount: product.soldCount || 0,
          sku: product.sku || '',
          barcode: product.barcode || '',
          weight: product.weight || 0,
          dimensions: product.dimensions || '',
          material: product.material || '',
          origin: product.origin || '',
          warranty: product.warranty || '',
          status: product.status || 'ACTIVE',
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          seoUrl: product.seoUrl || '',
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
        };
      }) : [];
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const showModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setEditSoldCount(product.soldCount || 0);
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        promotionalPrice: product.promotionalPrice,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: product.category.id,
        sku: product.sku || '',
        barcode: product.barcode || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || '',
        material: product.material || '',
        origin: product.origin || '',
        warranty: product.warranty || '',
        status: product.status || 'ACTIVE',
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        seoUrl: product.seoUrl || '',
        isFeatured: product.isFeatured || false,
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
      });
    } else {
      setSelectedProduct(null);
      setEditSoldCount(0);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, values);
      } else {
        await productService.createProduct(values);
      }
      fetchProducts();
      handleCancel();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // const handleDelete = async (id: number) => {
  //   Modal.confirm({
  //     title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
  //     content: 'Hành động này không thể hoàn tác.',
  //     okText: 'Có',
  //     okType: 'danger',
  //     cancelText: 'Không',
  //     onOk: async () => {
  //       try {
  //         await productService.deleteProduct(id);
  //         notification.success({
  //           message: 'Thành công',
  //           description: 'Đã xóa sản phẩm thành công',
  //           placement: 'topRight',
  //           duration: 2,
  //         });
  //         fetchProducts();
  //       } catch (error) {
  //         notification.error({
  //           message: 'Lỗi',
  //           description: error instanceof Error ? error.message : 'Không thể xóa sản phẩm',
  //           placement: 'topRight',
  //           duration: 2,
  //         });
  //       }
  //     },
  //   });
  // };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await productService.updateProduct(product.id, { status: newStatus });
      notification.success({
        message: 'Thành công',
        description: `Sản phẩm đã được ${newStatus === 'ACTIVE' ? 'hiển thị' : 'ẩn'}`,
        placement: 'topRight',
        duration: 2,
      });
      fetchProducts();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái sản phẩm',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number | undefined) => price ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price) : '-',
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'promotionalPrice',
      key: 'promotionalPrice',
      width: 120,
      render: (price: number | undefined) => price ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price) : '-',
    },
    {
      title: 'Kho hàng',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{
          color: status === 'ACTIVE' ? 'green' : 
                 status === 'INACTIVE' ? 'red' :
                 status === 'OUT_OF_STOCK' ? 'orange' : 'blue'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 150,
    },
    {
      title: 'Trọng lượng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight: number) => weight ? weight.toFixed(2) : '-',
    },
    {
      title: 'Kích thước',
      dataIndex: 'dimensions',
      key: 'dimensions',
      width: 120,
    },
    {
      title: 'Chất liệu',
      dataIndex: 'material',
      key: 'material',
      width: 120,
    },
    {
      title: 'Xuất xứ',
      dataIndex: 'origin',
      key: 'origin',
      width: 120,
    },
    {
      title: 'Sản phẩm nổi bật',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      width: 100,
      render: (isFeatured: boolean) => isFeatured ? 'Có' : 'Không',
    },
    {
      title: 'Sản phẩm mới',
      dataIndex: 'isNew',
      key: 'isNew',
      width: 80,
      render: (isNew: boolean) => isNew ? 'Có' : 'Không',
    },
    {
      title: 'Sản phẩm bán chạy',
      dataIndex: 'isBestSeller',
      key: 'isBestSeller',
      width: 100,
      render: (isBestSeller: boolean) => isBestSeller ? 'Có' : 'Không',
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
      width: 80,
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Button
            type={record.status === 'ACTIVE' ? 'default' : 'dashed'}
            danger={record.status === 'ACTIVE'}
            icon={null}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'ACTIVE' ? 'Ẩn' : 'Hiển thị'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Quản lý sản phẩm
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
      />

      <Modal
        title={selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true }]}
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <InputNumber
              min={0}
              step={1000}
              formatter={(value: number | undefined) => value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value: string | undefined) => value ? Number(value.replace(/₫\s?|(,*)/g, '')) : 0}
              style={{ width: '100%' }}
              disabled={editSoldCount > 0}
            />
          </Form.Item>

          <Form.Item
            name="promotionalPrice"
            label="Giá khuyến mãi"
          >
            <InputNumber
              min={0}
              step={1000}
              formatter={(value: number | undefined) => value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value: string | undefined) => value ? Number(value.replace(/₫\s?|(,*)/g, '')) : 0}
              style={{ width: '100%' }}
              disabled={editSoldCount > 0}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Kho hàng"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Ảnh sản phẩm"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              disabled={editSoldCount > 0}
            />
          </Form.Item>

          <Form.Item
            name="sku"
            label="Mã sản phẩm"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="barcode"
            label="Mã vạch"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Trọng lượng (kg)"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              disabled={editSoldCount > 0}
            />
          </Form.Item>

          <Form.Item
            name="dimensions"
            label="Kích thước"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="material"
            label="Chất liệu"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="origin"
            label="Xuất xứ"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="warranty"
            label="Bảo hành"
          >
            <Input disabled={editSoldCount > 0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
              <Select.Option value="OUT_OF_STOCK">Hết hàng</Select.Option>
              <Select.Option value="COMING_SOON">Sắp ra mắt</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="seoTitle"
            label="Tiêu đề SEO"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="seoDescription"
            label="Mô tả SEO"
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="seoUrl"
            label="URL SEO"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isFeatured"
            valuePropName="checked"
          >
            <Checkbox>Sản phẩm nổi bật</Checkbox>
          </Form.Item>

          <Form.Item
            name="isNew"
            valuePropName="checked"
          >
            <Checkbox>Sản phẩm mới</Checkbox>
          </Form.Item>

          <Form.Item
            name="isBestSeller"
            valuePropName="checked"
          >
            <Checkbox>Sản phẩm bán chạy</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManagement; 