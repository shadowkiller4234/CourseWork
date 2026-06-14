import { useAdminCrud } from "../hooks/useAdminCrud";
import { DataTable } from "../components/DataTable";
import { Link } from "react-router-dom";
import "./ProductsPage.css";

export const ProductsPage = () => {
  const { items, deleteItem } = useAdminCrud("products");

  return (
    <div className="products-page">
      <h1>Products</h1>
      
      <Link to="/admin/products/create" className="btn-create-link">
        <span>Створити товар</span>
      </Link>

      <DataTable
        data={items}
        onDelete={deleteItem}
        columns={[
          { key: "name", label: "Name" },
          { key: "price", label: "Price" },
          { key: "stock", label: "Stock" },
        ]}
      />
    </div>
  );
};