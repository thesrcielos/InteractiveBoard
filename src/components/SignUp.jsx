import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser, setToken } from "../services/userUtils";
import { signup } from "../services/AuthService";

const SignUp = () => {
  const navigate = useNavigate();
  const { checkAuth } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!name) errors.name = "El nombre es requerido";
    if (!email) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Ingresa un correo válido";
    }
    if (!password) {
      errors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!passwordConfirmation) {
      errors.passwordConfirmation = "La confirmación de contraseña es requerida";
    }
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      errors.passwordConfirmation = "Las contraseñas no coinciden";
    }
    return errors;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const response = await signup({ name, email, password });
      const token = response.token;
      setToken(token);
      if (checkAuth()) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      setErrorMessage("Ocurrió un error al registrar el usuario");
    }
  };

  return (
    <main className="flex-center-screen">
      <div className="card-form">
        <h1 className="text-2xl font-bold text-center mb-6">Registrarse</h1>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="flex-col gap-1">
            <label htmlFor="name" className="font-medium">Nombre</label>
            <input
              id="name"
              type="text"
              className="input-full"
              placeholder="Escribe tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-500">{fieldErrors.name}</p>
            )}
          </div>
          <div className="flex-col gap-1">
            <label htmlFor="email" className="font-medium">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="input-full"
              placeholder="example@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div className="flex-col gap-1">
            <label htmlFor="password" className="font-medium">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input-full"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password}</p>
            )}
          </div>
          <div className="flex-col gap-1">
            <label htmlFor="passwordConfirmation" className="font-medium">Confirmar Contraseña</label>
            <input
              id="passwordConfirmation"
              type="password"
              className="input-full"
              placeholder="********"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              required
            />
            {fieldErrors.passwordConfirmation && (
              <p className="text-sm text-red-500">{fieldErrors.passwordConfirmation}</p>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <button type="submit" className="btn-blue">
            Registrarse
          </button>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
