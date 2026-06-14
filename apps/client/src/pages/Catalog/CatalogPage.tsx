import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { getAllProduct } from "../../api/products";
import { getAllCategories } from "../../api/categories";
import { getAllBrands } from "../../api/brands";
import type { Product } from "../../types/product";
import "./Catalog.css";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Brand = {
  _id: string;
  name: string;
};

export const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [price, setPrice] = useState(100000);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await getAllProduct(page);

        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error("Products error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cats, brs] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        setCategories(cats || []);
        setBrands(brs || []);
      } catch (err) {
        console.error("Filters error:", err);
      }
    };

    loadFilters();
  }, []);

  const toggle = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPrice(100000);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(String(p.category?._id));

      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(String(p.brand?._id));

      const priceMatch = p.price <= price;

      return categoryMatch && brandMatch && priceMatch;
    });
  }, [products, selectedCategories, selectedBrands, price]);


  useEffect(() => {
    setPage(1);
  }, [selectedCategories, selectedBrands, price]);

  if (loading) {
    return (
      <div className="catalog">
        <h2>Завантаження...</h2>
      </div>
    );
  }

  return (
    <div className="catalog">
      <aside className="filters">
        <h3>Фільтри</h3>

        <div className="block">
          <h4>Категорії</h4>
          {categories.map((cat) => (
            <label key={cat._id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() =>
                  toggle(cat._id, selectedCategories, setSelectedCategories)
                }
              />
              {cat.name}
            </label>
          ))}
        </div>

        <div className="block">
          <h4>Бренди</h4>
          {brands.map((brand) => (
            <label key={brand._id}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand._id)}
                onChange={() =>
                  toggle(brand._id, selectedBrands, setSelectedBrands)
                }
              />
              {brand.name}
            </label>
          ))}
        </div>

        <div className="block">
          <h4>Максимальна ціна</h4>
          <input
            type="range"
            min={0}
            max={300000 }
            step={1000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <div className="price-display">
            {price.toLocaleString()} грн
          </div>
        </div>

        <button className="reset" onClick={resetFilters}>
          Скинути фільтри
        </button>
      </aside>

      <main className="grid">
        {filtered.length === 0 ? (
          <div className="no-results">
            <h3>Товари не знайдені</h3>
          </div>
        ) : (
          <>
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={page === i + 1 ? "active" : ""}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};