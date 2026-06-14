import { useAdminCrud } from "../hooks/useAdminCrud";
import "./OrderPage.css";

export const OrdersPage = () => {
  const { items, updateItem } = useAdminCrud("orders");
  
  return (
    <div className="orders-page">
      <h1>Orders</h1>

      <div className="orders-list">
        {items.map((o) => (
          <div key={o._id} className="order-card">
            
            {/* USER INFO */}
            <div className="order-info">
              <p><b>ID:</b> {o._id}</p>
              <p><b>Email:</b> {o.user?.email || "—"}</p>
              <p><b>Name:</b> {o.user?.name || "—"}</p>
              <p><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
              <p><b>Total:</b> {o.totalPrice} ₴</p>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {o.items?.map((item) => (
                <div key={item._id} className="order-item">
                  <p>
                    {item.product?.name || item.name}
                  </p>

                  <p>
                    {item.quantity} × {item.price} ₴
                  </p>

                  <p>
                    = {item.quantity * item.price} ₴
                  </p>
                </div>
              ))}
            </div>

            {/* STATUS */}
            <select
              className="status-select"
              value={o.status}
              onChange={(e) =>
                updateItem(o._id, { status: e.target.value })
              }
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};