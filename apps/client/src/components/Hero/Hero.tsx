import "./Hero.css";
import { BannerSlider } from "../BannerSlider/BannerSlider";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories";
import { getPromotions } from "../../api/promotions";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Promotion = {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  position: "main" | "side";
  link?: string;
};

export const Hero = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  console.log("PROMOTIONS:", promotions);
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, promos] = await Promise.all([
          getAllCategories(),
          getPromotions(),
        ]);

        setCategories(cats);
        setPromotions(promos);
      } catch (err) {
        console.error("Ошибка загрузки данных Hero", err);
      }
    };

    load();
  }, []);

  // беремо тільки side промо
  const sidePromotions = promotions.filter(
    (p) => p.position === "side"
  );

  return (
    <section className="hero">
      <div className="hero__container">

        {/* LEFT: categories */}
        <aside className="hero__categories">
          <h3>Категорії</h3>

          {categories.map((cat) => (
            <Link key={cat._id} to={`/catalog?cat=${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
        </aside>

        {/* CENTER */}
        <div className="hero__main">
          <BannerSlider />

          <div className="hero__small-banners">
            <div className="mini">🔥 Розпродаж</div>
            <div className="mini">⚡ Новинки</div>
            <div className="mini">🚚 Безкоштовна доставка</div>
          </div>
        </div>

        {/* RIGHT (DYNAMIC) */}
        <aside className="hero__promo">
          {sidePromotions.length === 0 ? (
            <>
              <div className="promo-card">Loading...</div>
            </>
          ) : (
            sidePromotions.map((promo) => (
              <div
                key={promo._id}
                className="promo-card"
                style={{
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h4>{promo.title}</h4>
                <p>{promo.subtitle}</p>
              </div>
            ))
          )}
        </aside>

      </div>
    </section>
  );
};