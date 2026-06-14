import { useState } from "react";
import { useAdminCrud } from "../hooks/useAdminCrud";
import { DataTable } from "../components/DataTable";
import "./UserPage.css";

export const UsersPage = () => {
  const { items, deleteItem, createItem, updateItem } =
    useAdminCrud("users");

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // CREATE
  const handleCreate = async () => {
    if (!form.email || !form.password) return;

    await createItem(form);

    setForm({
      email: "",
      name: "",
      password: "",
      role: "user",
    });
  };

  // EDIT START
  const handleEdit = (user: any) => {
    setEditingId(user._id);
    setForm({
      email: user.email,
      name: user.name,
      password: "",
      role: user.role,
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!editingId) return;

    await updateItem(editingId, {
      email: form.email,
      name: form.name,
      role: form.role,
      ...(form.password ? { password: form.password } : {}),
    });

    setEditingId(null);
    setForm({
      email: "",
      name: "",
      password: "",
      role: "user",
    });
  };

  return (
    <div className="users-page">
      <h1>Users</h1>

      {/* CREATE / EDIT FORM */}
      <div className="form-container">
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {editingId ? (
          <button onClick={handleUpdate} className="btn-submit">
            Update User
          </button>
        ) : (
          <button onClick={handleCreate} className="btn-submit">
            Create User
          </button>
        )}

        {editingId && (
          <button onClick={() => setEditingId(null)} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}
      <DataTable
        data={items}
        onDelete={deleteItem}
        columns={[
          { key: "email", label: "Email" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
        ]}
        actions={(row: any) => (
          <button onClick={() => handleEdit(row)}>
            Edit
          </button>
        )}
      />
    </div>
  );
};