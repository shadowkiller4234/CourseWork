import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { getMyOrders } from "../../api/orders";
import { useToastStore } from "../../store/toastStore";
import "./Profile.css";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  totalPrice: number; 
  status: string;
  createdAt: string;
  phone: string;
  address: string;
  items: OrderItem[];
};

// Словник для гарного відображення статусів
const STATUS_LABELS: Record<string, { text: string; class: string }> = {
  pending: { text: "В обробці", class: "status--pending" },
  processing: { text: "Комплектується", class: "status--processing" },
  shipped: { text: "Відправлено", class: "status--shipped" },
  delivered: { text: "Доставлено", class: "status--delivered" },
  cancelled: { text: "Скасовано", class: "status--cancelled" },
};

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toast = useToastStore((s) => s.addToast);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch {
        toast("Помилка завантаження замовлень", "error");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="profile-container profile-container--unauthorized">
        <h2>Спочатку увійдіть в акаунт</h2>
        <p>Щоб переглянути профіль та історію замовлень, будь ласка, авторизуйтесь.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        
        {/* БЛОК КОРИСТУВАЧА */}
        <aside className="profile__card">
          <div className="profile__avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>
          <h2 className="profile__title">{user.name || "Користувач"}</h2>
          <p className="profile__email">{user.email}</p>
          
          <hr className="profile__divider" />

          <button
            className="logout-btn"
            onClick={async () => {
              await logout();
              setOrders([]);
              toast("Вихід виконано", "info");
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Вийти з акаунту
          </button>
        </aside>

        {/* БЛОК ЗАМОВЛЕНЬ */}
        <main className="profile__orders">
          <h2 className="orders-title">
            📦 Історія замовлень <span>({orders.length})</span>
          </h2>

          {loading && (
            <div className="orders-status-msg">
              <div className="spinner"></div>
              <p>Завантаження вашої історії замовлень...</p>
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="orders-status-msg empty-state">
              <p>У вас ще немає замовлень</p>
              <span className="subtext">Усі ваші майбутні покупки з'являться тут.</span>
            </div>
          )}

          {!loading && (
            <div className="orders-list">
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] || { text: order.status || "В обробці", class: "status--pending" };
                
                return (
                  <div key={order._id} className="order-card">
                    <div className="order-card__header">
                      <div className="order-card__meta">
                        <span className="order-id">№{order._id.slice(-6).toUpperCase()}</span>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="order-card__side">
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                        <span className="order-total">
                          {Number(order.totalPrice || 0).toLocaleString()} грн
                        </span>
                      </div>
                    </div>

                    <div className="order-card__items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">× {item.quantity}</span>
                          <span className="item-price">{(item.price * item.quantity).toLocaleString()} грн</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};