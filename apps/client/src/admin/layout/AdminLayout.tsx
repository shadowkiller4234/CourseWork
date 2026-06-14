import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./Admin.css";

export const  AdminLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // await api.post("/auth/logout");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="admin">
      <aside className="sidebar">
        <div>
          <h2>Admin Panel</h2>
          <nav>
            <NavLink to="/admin/users">Users</NavLink>
            <NavLink to="/admin/categories">Categories</NavLink>
            <NavLink to="/admin/brands">Brands</NavLink>
            <NavLink to="/admin/products">Products</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/promotions">Promotions</NavLink>
          </nav>
        </div>

        {/* Кнопка тепер тут — внизу сайдбару */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};