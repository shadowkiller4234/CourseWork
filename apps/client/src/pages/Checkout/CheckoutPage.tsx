import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "../../api/axios";
import { getCart, clearCart } from "../../api/cart";
import { useToastStore } from "../../store/toastStore";
import "./CheckoutPage.css"; // Імпортуємо стилі

const schema = z.object({
  name: z.string().min(2, "Ім'я занадто коротке"),
  phone: z.string().min(9, "Невірний телефон"),
  address: z.string().min(5, "Вкажіть адресу"),
});

type FormData = z.infer<typeof schema>;

type CartItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
};

export const CheckoutPage = () => {
  const toast = useToastStore((s) => s.addToast);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart();
        setItems(cart.items || []);
      } catch (error) {
        console.error(error);
        toast("Не вдалося завантажити кошик", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [toast]);

  const total = items.reduce((sum, i) => {
    const price = Number(i.productId?.price || 0);
    const qty = Number(i.quantity || 0);
    return sum + price * qty;
  }, 0);

  const onSubmit = async (data: FormData) => {
    try {
      if (!items.length) {
        toast("Ваш кошик порожній", "error");
        return;
      }

      await api.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: Number(i.productId.price),
          quantity: Number(i.quantity),
        })),
        totalPrice: total,
        phone: data.phone,
        address: data.address,
      });

      await clearCart();
      setItems([]);

      toast("Замовлення оформлено 🎉", "success");
    } catch (err) {
      console.error(err);
      toast("Помилка оформлення", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="page-loader-wrapper">
        <div className="page-loader"></div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Оформлення замовлення</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Ваш кошик порожній 🛒</p>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* ФОРМА ДАНИХ */}
          <div className="checkout-card">
            <h2 className="card-title">Контактні дані</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="form-group">
                <label className="form-label">Ім'я</label>
                <input
                  placeholder="Олександр"
                  {...register("name")}
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Телефон</label>
                <input
                  placeholder="+380991234567"
                  {...register("phone")}
                  className={`form-input ${errors.phone ? "input-error" : ""}`}
                />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Адреса доставки</label>
                <input
                  placeholder="м. Київ, вул. Хрещатик, 1, кв. 5"
                  {...register("address")}
                  className={`form-input ${errors.address ? "input-error" : ""}`}
                />
                {errors.address && <p className="error-message">{errors.address.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? <div className="loader"></div> : "Підтвердити замовлення"}
              </button>
            </form>
          </div>

          {/* ЧЕК ЗАМОВЛЕННЯ */}
          <div className="checkout-card summary">
            <h2 className="card-title">Ваше замовлення</h2>
            
            <div className="products-list">
              {items.map((item) => (
                <div key={item.productId?._id} className="product-item">
                  <div className="product-info">
                    <span className="product-name">{item.productId?.name}</span>
                    <span className="product-meta">
                      {item.quantity} × {item.productId?.price} грн
                    </span>
                  </div>
                  <span className="product-price">
                    {(item.productId?.price || 0) * (item.quantity || 0)} грн
                  </span>
                </div>
              ))}
            </div>

            <hr className="total-divider" />

            <div className="total-row">
              <span className="total-label">Загальна сума</span>
              <span className="total-amount">{total} грн</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};