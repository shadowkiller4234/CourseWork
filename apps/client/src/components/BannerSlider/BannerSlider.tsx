import { useEffect, useState } from "react";
import "./BannerSlider.css";
import { Link } from "react-router-dom";
import { getPromotions } from "../../api/promotions";

type Promotion = {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: "main" | "side";
};

export const BannerSlider = () => {
  const [slides, setSlides] = useState<Promotion[]>([]);
  const [index, setIndex] = useState(0);

  // load data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPromotions();

        const mainSlides = data.filter(
          (p: Promotion) => p.position === "main"
        );

        setSlides(mainSlides);
        setIndex(0);
      } catch (err) {
        console.error("Failed to load promotions", err);
      }
    };

    load();
  }, []);

  // auto slide
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) {
    return (
      <div className="slider slider--empty">
        Завантаження банерів...
      </div>
    );
  }

  const current = slides[index];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider">
      {/* SLIDE */}
      <div
        className="slide"
        style={{
          backgroundImage: `url(${current.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="slide__overlay" />

        <div className="slide__content">
          <h2>{current.title}</h2>
          <p>{current.subtitle}</p>

          {current.link && (
            <Link to={current.link} className="slide__btn">
              Перейти
            </Link>
          )}
        </div>
      </div>

      {/* arrows */}
      <button className="arrow left" onClick={prevSlide}>
        ‹
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ›
      </button>

      {/* dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};