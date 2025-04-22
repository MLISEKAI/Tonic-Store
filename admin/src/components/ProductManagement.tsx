import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { productService, Product, CreateProductData, UpdateProductData } from '../services/productService';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    categoryId: 0,
    sku: '',
    barcode: '',
    weight: 0,
    dimensions: '',
    material: '',
    origin: '',
    warranty: '',
    status: 'ACTIVE',
    seoTitle: '',
    seoDescription: '',
    seoUrl: '',
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      console.log('Raw data from API:', data);
      // Ensure data is an array and has the correct structure
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

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
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
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        categoryId: 0,
        sku: '',
        barcode: '',
        weight: 0,
        dimensions: '',
        material: '',
        origin: '',
        warranty: '',
        status: 'ACTIVE',
        seoTitle: '',
        seoDescription: '',
        seoUrl: '',
        isFeatured: false,
        isNew: false,
        isBestSeller: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      fetchProducts();
      handleCloseDialog();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>New</TableCell>
              <TableCell>Best Seller</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{String(product.name)}</TableCell>
                <TableCell>{String(product.sku || '-')}</TableCell>
                <TableCell>{String(Number(product.price))}</TableCell>
                <TableCell>{String(product.stock)}</TableCell>
                <TableCell>{String(product.status || 'ACTIVE')}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
                <TableCell>{product.isNew ? 'Yes' : 'No'}</TableCell>
                <TableCell>{product.isBestSeller ? 'Yes' : 'No'}</TableCell>
                <TableCell>{String(product.viewCount || 0)}</TableCell>
                <TableCell>{String(product.soldCount || 0)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category ID"
            type="number"
            fullWidth
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="SKU"
            fullWidth
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Barcode"
            fullWidth
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Weight (kg)"
            type="number"
            fullWidth
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Dimensions"
            fullWidth
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Material"
            fullWidth
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Origin"
            fullWidth
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Warranty"
            fullWidth
            value={formData.warranty}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
              <MenuItem value="COMING_SOON">Coming Soon</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="SEO Title"
            fullWidth
            value={formData.seoTitle}
            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
          />
          <TextField
            margin="dense"
            label="SEO Description"
            fullWidth
            multiline
            rows={2}
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
          />
          <TextField
            margin="dense"
            label="SEO URL"
            fullWidth
            value={formData.seoUrl}
            onChange={(e) => setFormData({ ...formData, seoUrl: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
            }
            label="Featured Product"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
              />
            }
            label="New Product"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              />
            }
            label="Best Seller"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 