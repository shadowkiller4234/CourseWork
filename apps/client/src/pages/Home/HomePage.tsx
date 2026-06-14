import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Hero } from "../../components/Hero/Hero";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { getAllProduct } from "../../api/products";
import type { Product } from "../../types/product";
import "./Home.css";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProduct();
        // Проверка на случай, если данные приходят в обертке { products: [] }
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Помилка завантаження товарів:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Группировка товаров по ID категории
  const grouped = useMemo(() => {
    return products.reduce<Record<string, { name: string; items: Product[] }>>((acc, product) => {
      const categoryId = product.category?._id || "other";
      const categoryName = product.category?.name || "Інше";

      if (!acc[categoryId]) {
        acc[categoryId] = {
          name: categoryName,
          items: [],
        };
      }

      acc[categoryId].items.push(product);
      return acc;
    }, {});
  }, [products]);

  if (loading) {
    return (
      <>
        <Hero />
        <div className="home-container">
          <h2 className="loading-text">Завантаження товарів...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero />
      

      <div className="home-container">
        {Object.entries(grouped).map(([categoryId, group]) => (
          <section key={categoryId} className="category-section">
            <div className="section-header">
              <h2>{group.name}</h2>
              <Link to={`/catalog?category=${categoryId}`} className="more-link">
                Дивитися всі {group.name.toLowerCase()} →
              </Link>
            </div>

            <div className="products-grid">
              {group.items.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};