  import { Link, useNavigate } from "react-router-dom";
  import "./Header.css";
  import { useAuthStore } from "../../store/authStore";
  import { useState, useEffect, useRef } from "react";
  import { searchProducts } from "../../api/products";
  import type { Product } from "../../types/product";

  export const Header = () => {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
      logout();
      navigate("/");
    };

    // Дебаунс для пошуку
    useEffect(() => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      const timeout = setTimeout(async () => {
        try {
          const data = await searchProducts(query);
          setResults(data);
          setIsOpen(data.length > 0);
        } catch (error) {
          console.error("Помилка пошуку:", error);
        }
      }, 300);

      return () => clearTimeout(timeout);
    }, [query]);

    // Закриття дропдауну при кліку поза межами пошуку
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
      <header className="header">
        <div className="container">
          {/* LOGO */}
          <Link to="/" className="logo">
            TechStore
          </Link>

          {/* NAV */}
          <nav className="nav-links">
            <Link to="/">Головна</Link>
            <Link to="/catalog">Каталог</Link>
          </nav>

          {/* SEARCH */}
          <div className="search-container" ref={searchRef}>
            <input
              type="text"
              placeholder="Пошук товарів..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              className="search-input"
            />

            {/* Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="search-dropdown">
                {results.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.slug}`}
                    className="search-item"
                    onClick={() => {
                      setQuery(""); // Очищуємо пошук після кліку
                      setIsOpen(false);
                    }}
                  >
                    <span className="search-item-name">{item.name}</span>
                    <span className="search-item-price">{item.price} грн</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user && (
            <Link to="/cart" className="cart-btn">
              🛒 
            </Link>
          )}
          <div className="auth">
            {!user ? (
              <Link to="/login" className="login-btn">
                Увійти
              </Link>
            ) : (
              <div className="user-box">
                <Link to="/profile" className="username">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Вийти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };