import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import { useUser, setToken } from "../services/userUtils";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Login = () => {
  const { checkAuth } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthentication = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (checkAuth()) {
      handleAuthentication();
    }
  }, [checkAuth]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (!password || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      const data = await loginUser({ email, password });
      const token = data.token;
      setToken(token);
      if (checkAuth()) {
        handleAuthentication();
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = "openid profile email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <main className="flex-center-screen">
      <div className="card-form">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="input-full"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input-full"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-blue">
            Ingresar
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            ¿No tienes cuenta? <a href="/signup" className="text-blue-600 underline">Regístrate aquí</a>
          </p>
        </div>
        <div className="mt-6 flex-center">
          <button
            onClick={handleGoogleLogin}
            className="btn-google"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
