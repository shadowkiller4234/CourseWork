import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../api/products";
import { useToastStore } from "../../store/toastStore";
import { addToCart } from "../../api/cart";
import "./Product.css";

// 1. Обновляем интерфейс: brand теперь объект, а не строка
interface Brand {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  brand: Brand; // Изменено со string на Brand
  stock: number;
  images: string[];
  attributes: {
    memory?: string;
    memoryType?: string;
    boostClock?: string;
  };
}

export const ProductPage = () => {
  const { slug } = useParams();

  const toast = useToastStore((s) => s.addToast);

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast("Помилка завантаження товару", "error");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, toast]);

  if (loading) {
    return <h2>Завантаження...</h2>;
  }

  if (!product) {
    return <h2>Товар не знайдено</h2>;
  }

  const handleAdd = async () => {
  try {
    await addToCart(product._id);

    toast("Додано в кошик 🛒", "success");
  } catch (error) {
    console.error(error);

    toast("Помилка додавання в кошик", "error");
  }
};

  return (
    <div className="product-page">
      <div className="gallery">
        <img
          className="main-img"
          src={product.images[activeImg]}
          alt={product.name}
        />

        <div className="thumbs">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name}-${i}`}
              className={activeImg === i ? "active" : ""}
              onClick={() => setActiveImg(i)}
            />
          ))}
        </div>
      </div>

      <div className="info">
        <h1>{product.name}</h1>

        {/* 2. ИСПРАВЛЕНО: Обращаемся к product.brand.name */}
        <p className="brand">{product.brand?.name}</p>

        <p className="desc">{product.description}</p>

        <div className="attrs">
          {Array.isArray(product.attributes) &&
            product.attributes.map((attr, i) => (
              <div key={i}>
                <strong>{attr.key}:</strong> {String(attr.value)}
              </div>
            ))}
        </div>

        <div className={`stock ${product.stock > 0 ? "in" : "out"}`}>
          {product.stock > 0 ? "В наявності" : "Немає в наявності"}
        </div>

        <div className="price">
          <span className="new">
            {product.price.toLocaleString()} грн
          </span>

          {product.oldPrice && (
            <span className="old">
              {product.oldPrice.toLocaleString()} грн
            </span>
          )}
        </div>

        <button onClick={handleAdd}>
          Додати в кошик
        </button>
      </div>
    </div>
  );
};