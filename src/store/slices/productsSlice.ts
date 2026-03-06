import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductsState, NewProduct } from '../../types/product.types';
import { productsService } from '../../services/productsService';

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
  sortBy: null,
  sortOrder: 'asc',
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  totalPages: 0,
  searchQuery: '',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({
   page,
   limit,
   sortBy,
   sortOrder,
   searchQuery
 }: {
    page: number;
    limit: number;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc';
    searchQuery?: string;
  }) => {
    if (searchQuery) {
      const response = await productsService.searchProducts(searchQuery, page, limit);
      return response;
    } else if (sortBy) {
      const response = await productsService.getSortedProducts(sortBy, sortOrder || 'asc', page, limit);
      return response;
    } else {
      const response = await productsService.getProducts(page, limit);
      return response;
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({
   query,
   page,
   limit
 }: {
    query: string;
    page: number;
    limit: number
  }) => {
    const response = await productsService.searchProducts(query, page, limit);
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      const key = action.payload;

      if (state.sortBy === key) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = key;
        state.sortOrder = 'asc';
      }

      state.currentPage = 1;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },

    addProduct: (state, action) => {
      const newProduct: Product = {
        ...action.payload,
        id: Math.floor(Math.random() * 10000) + 1000,
        description: '',
        discountPercentage: 0,
        stock: 0,
        category: 'new',
        thumbnail: 'https://via.placeholder.com/50',
        images: [],
        rating: action.payload.rating || 0,
      };

      state.items.unshift(newProduct);
      state.totalItems += 1;
      state.totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.totalItems = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / state.itemsPerPage);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки товаров';
      })

      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.totalItems = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / state.itemsPerPage);
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка поиска товаров';
      });
  },
});

export const { setSortBy, setCurrentPage, setSearchQuery, addProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;