import { useForm } from "react-hook-form";
import { register as registerApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

export const RegisterPage = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await registerApi(data);
      console.log("REGISTER DATA:", data);

      // 👇 якщо бек повертає user + token
      setUser(res);
      localStorage.setItem("token", res.token);

      toast("Реєстрація успішна 🎉", "success");

      navigate("/"); // або /profile
    } catch {
      toast("Помилка реєстрації", "error");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Створити акаунт</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="auth-input"
            placeholder="Nickname"
            {...register("name")}
          />

          <input
            className="auth-input"
            placeholder="Email"
            {...register("email")}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Пароль"
            {...register("password")}
          />

          <button className="auth-btn">Зареєструватися</button>
        </form>

        <div className="auth-link">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
};