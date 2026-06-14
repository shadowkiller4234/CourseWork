import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
import { useEffect } from "react";
import { ToastContainer } from "./components/Toast/ToastContainer";
import { useAuthStore } from "./store/authStore";



function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;