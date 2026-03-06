export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  sku?: string;
}

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  sortBy: keyof Product | null;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  searchQuery: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface NewProduct {
  title: string;
  price: number;
  brand: string;
  sku: string;
  rating?: number;
}