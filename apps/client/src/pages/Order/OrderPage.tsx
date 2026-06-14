import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, type Order } from "../../api/orders";
import "./Order.css";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const data = await getOrderById(id);
      setOrder(data);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Завантаження...</p>;
  if (!order) return <p>Замовлення не знайдено</p>;

  return (
    <div className="order-page">
      {/* HEADER */}
      <div className="order-header">
        <h1>Замовлення #{order._id.slice(-6)}</h1>

        <span className={`status ${order.status}`}>
          {order.status}
        </span>
      </div>

      {/* INFO */}
      <div className="order-info">
        <div>
          <b>Дата:</b>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </div>

        <div>
          <b>Телефон:</b> {order.phone}
        </div>

        <div>
          <b>Адреса:</b> {order.address}
        </div>

        <div>
          <b>Сума:</b> {order.total} грн
        </div>
      </div>

      {/* ITEMS */}
      <h2>Товари</h2>

      <div className="order-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <img src={item.image} />

            <div className="title">{item.title}</div>

            <div>{item.quantity} шт</div>

            <div>{item.price} грн</div>

            <div className="sum">
              {item.price * item.quantity} грн
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};