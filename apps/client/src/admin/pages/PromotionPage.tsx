import { useEffect, useState } from "react";
import { getPromotions, deletePromotion } from "../../api/promotions";
import { CreatePromotionPage } from "./CreatePromotionPage";
import { EditPromotionModal } from "./EditPromotionModal";
// Імпортуємо іконки (за бажанням, або замініть на текст)
import { Edit2, Trash2, Tag } from "lucide-react"; 
// Імпорт вашого нового CSS файлу
import "./PromotionPage.css"

type Promotion = {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  position: "main" | "side";
};

export const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    const data = await getPromotions();
    setPromotions(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю акцію?")) {
      await deletePromotion(id);
      load();
    }
  };

  const handleEdit = (p: Promotion) => {
    setEditing(p);
    setIsModalOpen(true);
  };

  return (
    <div className="promotions-container">
      <div className="promotions-content">
        
        {/* Хедер */}
        <div className="promotions-header">
          <div className="header-icon-wrapper">
            <Tag size={24} />
          </div>
          <div>
            <h1>Акції та Пропозиції</h1>
            <p>Керування рекламними банерами та спеціальними пропозиціями</p>
          </div>
        </div>

        {/* Блок створення */}
        <div className="create-section-wrapper">
          <CreatePromotionPage onCreated={load} />
        </div>

        {/* Список */}
        <div>
          <h2 className="list-section-title">Активні акції ({promotions.length})</h2>
          
          {promotions.length === 0 ? (
            <div className="empty-state">
              <p>Акцій поки немає. Створіть першу акцію вище!</p>
            </div>
          ) : (
            <div className="promo-grid">
              {promotions.map((p) => (
                <div key={p._id} className="promo-card-admin">
                  
                  {/* Верхня частина з фото та тегом */}
                  <div className="promo-card-image-wrapper">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                    <span className={`position-badge ${p.position}`}>
                      {p.position} позиція
                    </span>
                  </div>

                  {/* Текстовий контент */}
                  <div className="promo-card-body">
                    <h3>{p.title}</h3>
                    <p title={p.subtitle}>{p.subtitle}</p>
                  </div>

                  {/* Кнопки керування */}
                  <div className="promo-card-footer">
                    <button onClick={() => handleEdit(p)} className="btn-edit">
                      <Edit2 size={16} />
                      Редагувати
                    </button>

                    <button 
                      onClick={() => handleDelete(p._id)} 
                      className="btn-delete"
                      title="Видалити акцію"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <EditPromotionModal
          isOpen={isModalOpen}
          promotion={editing}
          onClose={() => setIsModalOpen(false)}
          onUpdated={load}
        />
      </div>
    </div>
  );
};