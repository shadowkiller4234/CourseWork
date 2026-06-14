import { useState } from "react";
import { useCategoriesCrud } from "../hooks/useCategoriesCrud";
import "./CategoriesPage.css";

type Attribute = {
  name: string;
  key: string;
  type: "string" | "number" | "boolean" | "select";
  required?: boolean;
  options?: string[];
};

export const CategoriesPage = () => {
  const { items, createItem, deleteItem, updateItem } = useCategoriesCrud();

  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: "",
        key: "",
        type: "string",
        required: false,
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: any) => {
    const copy = [...attributes];
    (copy[index] as any)[field] = value;
    setAttributes(copy);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createItem({
      name,
      slug: name.toLowerCase().trim().replace(/\s+/g, "-"),
      attributes,
    });

    setName("");
    setAttributes([]);
  };

  const handleUpdate = async (item: any) => {
    const newName = prompt("New category name:", item.name);
    if (!newName || !newName.trim()) return;

    await updateItem(item._id, {
      name: newName,
      slug: newName.toLowerCase().trim().replace(/\s+/g, "-"),
      attributes: item.attributes || [],
    });
  };

  return (
    <div className="categories-container">
      <header className="page-header">
        <h1>Категорії</h1>
        <p>Створити або конфігурувати категорію, та додавати атрибути</p>
      </header>

      <div className="categories-grid">
        {/* ФОРМА СТВОРЕННЯ */}
        <form className="card form-card" onSubmit={handleCreate}>
          <h2>Створити категорію</h2>
          
          <div className="form-group">
            <label htmlFor="cat-name">Назва</label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Laptops, Smartphones"
              autoComplete="off"
            />
          </div>

          <div className="attributes-section">
            <div className="section-header">
              <h3>Атрибути</h3>
              <button type="button" className="btn-secondary btn-sm" onClick={addAttribute}>
                + Добавити поле
              </button>
            </div>

            {attributes.length === 0 ? (
              <p className="empty-text">Немає доданих атрибутів</p>
            ) : (
              <div className="attributes-list">
                {attributes.map((attr, i) => (
                  <div key={i} className="attr-row card">
                    <div className="attr-fields">
                      <input
                        placeholder="Label (e.g. RAM)"
                        value={attr.name}
                        onChange={(e) => updateAttribute(i, "name", e.target.value)}
                      />
                      <input
                        placeholder="Key (e.g. ready_ram)"
                        value={attr.key}
                        onChange={(e) => updateAttribute(i, "key", e.target.value)}
                      />
                      <select
                        value={attr.type}
                        onChange={(e) => updateAttribute(i, "type", e.target.value)}
                      >
                        <option value="string">Text (string)</option>
                        <option value="number">Number</option>
                        <option value="boolean">Toggle (boolean)</option>
                        <option value="select">Dropdown (select)</option>
                      </select>
                    </div>
                    
                    <div className="attr-actions">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={attr.required || false}
                          onChange={(e) => updateAttribute(i, "required", e.target.checked)}
                        />
                        <span>Required</span>
                      </label>
                      <button 
                        type="button" 
                        className="btn-icon-delete" 
                        onClick={() => removeAttribute(i)}
                        title="Delete attribute"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={!name.trim()}>
            Зберігти категорію
          </button>
        </form>

        {/* ТАБЛИЦЯ РЕЗУЛЬТАТІВ */}
        <div className="card table-card">
          <h2>Existing Categories</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Attributes</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="table-empty">
                      Немає знайдених категорій!
                    </td>
                  </tr>
                ) : (
                  items.map((c: any) => (
                    <tr key={c._id}>
                      <td className="fw-medium">{c.name}</td>
                      <td>
                        <span className="slug-badge">{c.slug}</span>
                      </td>
                      <td>
                        <div className="attributes-badges">
                          {c.attributes?.length ? (
                            c.attributes.map((a: any, idx: number) => (
                              <span key={idx} className="attr-badge" title={`Type: ${a.type}`}>
                                {a.name}
                                {a.required && <span className="req-dot">*</span>}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-table btn-edit" onClick={() => handleUpdate(c)}>
                            Edit
                          </button>
                          <button className="btn-table btn-delete" onClick={() => deleteItem(c._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};