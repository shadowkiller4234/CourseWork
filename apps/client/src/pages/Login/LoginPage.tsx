import { useForm } from "react-hook-form";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastStore((s) => s.addToast);

  const { register, handleSubmit } = useForm();

  
  const onSubmit = async (data: any) => {
  try {
    const res = await login(data);

    setUser(res);

    localStorage.setItem("token", res.accessToken);

    toast("Вхід виконано ✅", "success");

    if (res.user.role === "admin") {
      navigate("/admin/users");
    } else {
      navigate("/");
    }
  } catch {
    toast("Помилка входу", "error");
  }
};

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Вхід в акаунт</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <button className="auth-btn">Увійти</button>
        </form>

        <div className="auth-link">
          Немає акаунта? <Link to="/register">Реєстрація</Link>
        </div>
      </div>
    </div>
  );
};