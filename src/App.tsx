import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { MobileHeader } from './components/common/MobileHeader';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CMSPage } from './pages/CMSPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCMSPage } from './pages/admin/AdminCMSPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Shell layout that conditionally hides public header/footer on admin
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && (
        <>
          <AnnouncementBar />
          <Navbar />
          <MobileHeader />
        </>
      )}

      <main className="flex-1">
        {children}
      </main>

      {!isAdmin && <Footer />}
      <MobileBottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <StoreSettingsProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppLayout>
                  <Routes>
                    {/* Storefront Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/orders" element={<OrdersPage />} />
                    <Route path="/account/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/account/wishlist" element={<WishlistPage />} />
                    <Route path="/page/:slug" element={<CMSPage />} />

                    {/* Admin Management Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="cms" element={<AdminCMSPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                      <Route path="audit" element={<AdminAuditLogsPage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </AppLayout>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </StoreSettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
