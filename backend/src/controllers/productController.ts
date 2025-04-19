import { Request, Response } from "express";
import * as productService from "../services/productService";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const products = await productService.getAllProducts(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;
    const product = await productService.createProduct(
      name,
      description,
      price,
      stock,
      imageUrl,
      category
    );
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, category } = req.body;
    const product = await productService.updateProduct(Number(id), {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
}; 