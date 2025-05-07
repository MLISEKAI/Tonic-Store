import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Space,
  Card,
  Typography,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { productService, Product, CreateProductData, UpdateProductData } from '../services/productService';

const { Title } = Typography;
const { TextArea } = Input;

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      console.log('Raw data from API:', data);
      const formattedProducts = Array.isArray(data) ? data.map(product => {
        console.log('Processing product:', product);
        return {
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          imageUrl: product.imageUrl || '',
          category: product.category || '',
          createdAt: product.createdAt || '',
          updatedAt: product.updatedAt || '',
          viewCount: product.viewCount || 0,
          soldCount: product.soldCount || 0,
        };
      }) : [];
      console.log('Formatted products:', formattedProducts);
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const showModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
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

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured: boolean) => isFeatured ? 'Yes' : 'No',
    },
    {
      title: 'New',
      dataIndex: 'isNew',
      key: 'isNew',
      render: (isNew: boolean) => isNew ? 'Yes' : 'No',
    },
    {
      title: 'Best Seller',
      dataIndex: 'isBestSeller',
      key: 'isBestSeller',
      render: (isBestSeller: boolean) => isBestSeller ? 'Yes' : 'No',
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Sold',
      dataIndex: 'soldCount',
      key: 'soldCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
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
          Product Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
      />

      <Modal
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
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
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category ID"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="barcode"
            label="Barcode"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (kg)"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="dimensions"
            label="Dimensions"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="material"
            label="Material"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="origin"
            label="Origin"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="warranty"
            label="Warranty"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
              <Select.Option value="OUT_OF_STOCK">Out of Stock</Select.Option>
              <Select.Option value="COMING_SOON">Coming Soon</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="seoTitle"
            label="SEO Title"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="seoDescription"
            label="SEO Description"
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="seoUrl"
            label="SEO URL"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isFeatured"
            valuePropName="checked"
          >
            <Checkbox>Featured Product</Checkbox>
          </Form.Item>

          <Form.Item
            name="isNew"
            valuePropName="checked"
          >
            <Checkbox>New Product</Checkbox>
          </Form.Item>

          <Form.Item
            name="isBestSeller"
            valuePropName="checked"
          >
            <Checkbox>Best Seller</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManagement; 