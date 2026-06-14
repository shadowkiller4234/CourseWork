import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from "../../api/cart";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

type CartItem = {
  _id: string; // 👈 ID елемента кошика
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
};

export const CartPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await getCart();
      setItems(cart?.items ?? []);
    } catch (error) {
      console.error("Cart load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ➕ збільшити
  const handleIncrease = async (id: string, quantity: number) => {
    try {
      await updateCartQty(id, quantity + 1);
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ➖ зменшити
  const handleDecrease = async (id: string, quantity: number) => {
    try {
      if (quantity <= 1) {
        await removeFromCart(id);
      } else {
        await updateCartQty(id, quantity - 1);
      }
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ видалити
  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🧹 очистити
  const handleClear = async () => {
    try {
      await clearCart();
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="cart-loading">
        <h2>Завантаження кошика...</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Кошик</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="icon">🛒</span>
            <h2>Ваш кошик порожній</h2>
            <p className="subtext">Додайте товари, щоб зробити замовлення.</p>
            <button className="shop-link" onClick={() => navigate("/")}>
              Перейти до покупок
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Ліва частина: Список доданих товарів */}
            <div className="cart-list">
              {items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img 
                    src={item.productId.images?.[0] || "https://placehold.co/150"} 
                    alt={item.productId.name} 
                  />

                  <div className="info">
                    <h3>{item.productId.name}</h3>
                    <p>{item.productId.price.toLocaleString()} грн</p>
                  </div>

                  <div className="qty">
                    <button onClick={() => handleDecrease(item.productId._id, item.quantity)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.productId._id, item.quantity)}>
                      +
                    </button>
                  </div>

                  <button
                    className="remove"
                    onClick={() => handleRemove(item.productId._id)}
                    aria-label="Видалити"
                  >
                    {/* Гарна SVG іконка хрестика замість звичайного тексту */}
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Права частина: Разом / Оплата (Фіксована при скролі) */}
            <div className="cart-summary">
              <h2>Підсумок</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Товари ({totalItemsCount})</span>
                  <span>{total.toLocaleString()} грн</span>
                </div>
                <div className="summary-row">
                  <span>Доставка</span>
                  <span className="free-delivery">Безкоштовно</span>
                </div>
              </div>

              <div className="summary-total">
                <span>До сплати:</span>
                <span className="total-price">{total.toLocaleString()} грн</span>
              </div>

              <button className="checkout" onClick={() => navigate("/checkout")}>
                Оформити замовлення
              </button>

              <button
                className="clear"
                onClick={handleClear}
                disabled={!items.length}
              >
                Очистити кошик
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};