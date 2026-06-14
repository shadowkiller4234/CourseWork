import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { getAllCategories } from "../../api/categories";
import { getAllBrands } from "../../api/brands";
import "./CreateProductPage.css";

type Category = {
  _id: string;
  name: string;
  attributes?: {
    name: string;
    key: string;
    type: "string" | "number" | "boolean" | "select";
    options?: string[];
  }[];
};

type Brand = { _id: string; name: string };

type AttributeValue = {
  key: string;
  value: any;
};

export const CreateProductPage = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");

  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState("");

  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [brandsData, categoriesData] = await Promise.all([
        getAllBrands(),
        getAllCategories(),
      ]);

      setBrands(brandsData);
      setCategories(categoriesData);
    };

    loadData();
  }, []);

  // 👉 коли змінюємо категорію — генеруємо attributes
  const handleCategoryChange = (id: string) => {
    const selected = categories.find((c) => c._id === id) || null;
    setCategory(selected);

    if (selected?.attributes) {
      setAttributes(
        selected.attributes.map((a) => ({
          key: a.key,
          value: "",
        }))
      );
    } else {
      setAttributes([]);
    }
  };

  const updateAttribute = (key: string, value: any) => {
    setAttributes((prev) =>
      prev.map((a) => (a.key === key ? { ...a, value } : a))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !brand) {
      alert("Оберіть категорію і бренд");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category._id);
    formData.append("brand", brand);

    if (oldPrice) formData.append("oldPrice", oldPrice);

    // 👉 attributes (ВАЖЛИВО)
    formData.append("attributes", JSON.stringify(attributes));

    if (images.length === 0) {
      alert("Додай хоча б одне зображення");
      return;
    }

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await api.post("/admin/products", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Товар створено");
    } catch (err) {
      console.error(err);
      alert("Помилка створення товару");
    }
  };

  return (
    <div className="create-product-page">
      <h2>Створення товару</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          placeholder="Назва"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Ціна"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Стара ціна"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Склад"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          value={category?._id || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Оберіть категорію</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* BRAND */}
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Оберіть бренд</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* DYNAMIC ATTRIBUTES */}
        {category?.attributes?.map((attr) => (
          <div key={attr.key} className="attr-field">
            <label>{attr.name}</label>

            {attr.type === "select" ? (
              <select
                onChange={(e) => updateAttribute(attr.key, e.target.value)}
              >
                <option value="">Оберіть</option>
                {attr.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={attr.type === "number" ? "number" : "text"}
                onChange={(e) => updateAttribute(attr.key, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files) return;
            setImages((prev) => [...prev, ...Array.from(e.target.files)]);
          }}
        />

        <div className="preview-grid">
          {images.map((file, index) => (
            <div key={index} className="preview-item">
              <img src={URL.createObjectURL(file)} />
            </div>
          ))}
        </div>

        <button type="submit">Створити товар</button>
      </form>
    </div>
  );
};