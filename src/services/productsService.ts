import axios from 'axios';
import { Product, ProductsResponse } from '../types/product.types';

const API_BASE_URL = 'https://dummyjson.com';

export const productsService = {
  async getProducts(page: number = 1, limit: number = 20): Promise<ProductsResponse> {
    try {
      const skip = (page - 1) * limit;
      const response = await axios.get<ProductsResponse>(
        `${API_BASE_URL}/products?limit=${limit}&skip=${skip}&select=title,price,brand,rating,category,sku,thumbnail,description`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Ошибка загрузки товаров');
    }
  },

  async getSortedProducts(
    key: string,
    order: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    try {
      const skip = (page - 1) * limit;
      const response = await axios.get<ProductsResponse>(
        `${API_BASE_URL}/products?sortBy=${key}&order=${order}&limit=${limit}&skip=${skip}&select=title,price,brand,rating,category,sku,thumbnail,description`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      throw new Error('Ошибка загрузки товаров');
    }
  },

  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    try {
      const skip = (page - 1) * limit;
      const response = await axios.get<ProductsResponse>(
        `${API_BASE_URL}/products/search?q=${query}&limit=${limit}&skip=${skip}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Ошибка поиска товаров');
    }
  },
};