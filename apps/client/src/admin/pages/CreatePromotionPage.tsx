import { useState } from "react";
import { createPromotion } from "../../api/promotions";
import { UploadCloud } from "lucide-react"; // Імпортуємо іконку для файлів

type Props = {
  onCreated?: () => void;
};

export const CreatePromotionPage = ({ onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [position, setPosition] = useState<"main" | "side">("side");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Будь ласка, вкажіть заголовок акції");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("position", position);

    if (image) {
      formData.append("image", image);
    }

    try {
      await createPromotion(formData);
      onCreated?.();

      // Очищення форми після успішного створення
      setTitle("");
      setSubtitle("");
      setPosition("side");
      setImage(null);

      alert("Акцію успішно створено!");
    } catch (error) {
      console.error(error);
      alert("Помилка при створенні акції");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Створити нову акцію</h2>

      {/* Поле Заголовку */}
      <div className="form-group">
        <label htmlFor="promo-title">Заголовок *</label>
        <input
          id="promo-title"
          className="form-input"
          placeholder="Введіть назву акції (напр. Знижки до -50%)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Поле Підзаголовку */}
      <div className="form-group">
        <label htmlFor="promo-subtitle">Підзаголовок</label>
        <input
          id="promo-subtitle"
          className="form-input"
          placeholder="Короткий опис пропозиції"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>

      {/* Вибір позиції */}
      <div className="form-group">
        <label htmlFor="promo-position">Позиція банера</label>
        <select
          id="promo-position"
          className="form-select"
          value={position}
          onChange={(e) => setPosition(e.target.value as "main" | "side")}
        >
          <option value="main">Головний банер (Main banner)</option>
          <option value="side">Бічний банер (Side banner)</option>
        </select>
      </div>

      {/* Кастомне завантаження зображення */}
      <div className="form-group">
        <label>Зображення акції</label>
        <div className="file-upload-wrapper">
          <UploadCloud className="file-upload-icon" size={32} />
          <div className="file-upload-text">
            <span>Клацніть, щоб завантажити</span> або перетягніть файл
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          {image && (
            <div className="file-name-preview">
              Обрано файл: {image.name}
            </div>
          )}
        </div>
      </div>

      {/* Кнопка створення */}
      <button type="submit" className="btn-submit">
        Створити акцію
      </button>
    </form>
  );
};