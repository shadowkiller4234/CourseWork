import { useEffect, useState } from "react";
import { updatePromotion } from "../../api/promotions";

type Promotion = {
  _id: string;
  title: string;
  subtitle?: string;
  position: "main" | "side";
  image: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  onUpdated: () => void;
};

export const EditPromotionModal = ({
  isOpen,
  onClose,
  promotion,
  onUpdated,
}: Props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [position, setPosition] = useState<"main" | "side">("side");

  useEffect(() => {
    if (promotion) {
      setTitle(promotion.title);
      setSubtitle(promotion.subtitle || "");
      setPosition(promotion.position);
    }
  }, [promotion]);

  if (!isOpen || !promotion) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updatePromotion(promotion._id, {
      title,
      subtitle,
      position,
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Promotion</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle"
          />

          <select
            value={position}
            onChange={(e) =>
              setPosition(e.target.value as "main" | "side")
            }
          >
            <option value="main">Main</option>
            <option value="side">Side</option>
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};