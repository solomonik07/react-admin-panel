import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Provider} from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import LoginPage from './pages/LoginPage/LoginPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
