import { useState } from "react";
import { useAdminCrud } from "../hooks/useAdminCrud";
import "./BrandsPage.css";

export const BrandsPage = () => {
  const { items, createItem, deleteItem, updateItem, loading } =
    useAdminCrud("brands");

  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const payload = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    };

    if (editId) {
      await updateItem(editId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  const handleEdit = (brand: any) => {
    setEditId(brand._id);
    setName(brand.name);
  };

  return (
    <div className="brands-page">
      <h1>Brands</h1>

      {/* FORM */}
      <div className="form-container">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Brand name"
        />

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="btn-submit"
        >
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button onClick={resetForm} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((brand: any) => (
            <tr key={brand._id}>
              <td>{brand.name}</td>
              <td>
                <span className="slug-badge">{brand.slug}</span>
              </td>

              <td>
                <button 
                  onClick={() => handleEdit(brand)}
                  className="btn-edit"
                >
                  Edit
                </button>

                <button 
                  onClick={() => deleteItem(brand._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};