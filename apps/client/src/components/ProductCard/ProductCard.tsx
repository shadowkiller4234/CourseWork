import { Link } from "react-router-dom";
import { useToastStore } from "../../store/toastStore";
import { addToCart } from "../../api/cart";
import type { Product } from "../../types/product";
import "./ProductCard.css";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const addToast = useToastStore((state) => state.addToast);
  const isOutOfStock = product.stock <= 0;

  // Розрахунок знижки
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  // Безпечне додавання в кошик
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Захист від спрацьовування кліку по лінках, якщо кнопка всередині них
    if (isOutOfStock) return;

    try {
      await addToCart(product._id);
      addToast("Товар додано в кошик 🛒", "success");
    } catch (error) {
      console.error(error);
      addToast("Не вдалося додати товар у кошик", "error");
    }
  };

  // Визначення бренду
  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.name || "";

  // Нормалізація характеристик (працює і з масивом об'єктів, і зі звичайним об'єктом)
  const renderAttributes = () => {
    if (Array.isArray(product.attributes)) {
      return product.attributes.slice(0, 7);
    } else if (product.attributes && typeof product.attributes === "object") {
      return Object.entries(product.attributes)
        .slice(0, 3)
        .map(([key, value]) => ({ key, value }));
    }
    return [];
  };

  const visibleAttributes = renderAttributes();

  return (
    <div className={`product-card ${isOutOfStock ? "product-card--muted" : ""}`}>
      {/* Бейдж знижки */}
      {discount > 0 && <div className="product-badge">-{discount}%</div>}

      {/* Зображення товару */}
      <Link to={`/product/${product.slug}`} className="product-image-wrapper">
        <img
          className="product-image"
          src={product.images?.[0] || "/images/no-image.png"}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      {/* Контентна частина */}
      <div className="product-info">
        <div className="product-meta">
          {brandName && <span className="product-brand">{brandName}</span>}
          <span className={`product-status ${isOutOfStock ? "out" : "in"}`}>
            {isOutOfStock ? "Немає в наявності" : "В наявності"}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} className="product-title">
          {product.name}
        </Link>

        {/* Характеристики (компактні та акуратні) */}
        {visibleAttributes.length > 0 && (
          <div className="product-attributes">
            {visibleAttributes.map((attr, i) => (
              <div key={i} className="attr-item">
                <span className="attr-key">{attr.key}:</span>
                <span className="attr-value">{String(attr.value)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Нижня частина: Ціна + Кнопка */}
        <div className="product-footer">
          <div className="product-price-block">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="old-price">
                {product.oldPrice.toLocaleString()} ₴
              </span>
            )}
            <span className="current-price">
              {product.price.toLocaleString()} <span className="currency">₴</span>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Очікується" : "Купити"}
          </button>
        </div>
      </div>
    </div>
  );
};