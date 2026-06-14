import { Routes, Route } from "react-router-dom";

import { HomePage } from "../pages/Home/HomePage";
import { CatalogPage } from "../pages/Catalog/CatalogPage";
import { ProductPage } from "../pages/Product/ProductPage";
import { CartPage } from "../pages/Cart/CartPage";
import { CheckoutPage } from "../pages/Checkout/CheckoutPage";
import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfilePage } from "../pages/Profile/ProfilePages";
import { OrderPage } from "../pages/Order/OrderPage";
import { AdminLayout } from "../admin/layout/AdminLayout";
import { UsersPage } from "../admin/pages/UsersPage";
import { CategoriesPage } from "../admin/pages/CategoriesPage";
import { BrandsPage } from "../admin/pages/BrandsPage";
import { ProductsPage } from "../admin/pages/ProductsPage";
import { OrdersPage } from "../admin/pages/OrdersPage";
import { PromotionsPage } from "../admin/pages/PromotionPage";
import { CreateProductPage } from "../admin/pages/CreateProductPage";

import { MainLayout } from "../layouts/MainLayout";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/order/:id" element={<OrderPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<UsersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
      </Route>
    </Routes>
  );
};