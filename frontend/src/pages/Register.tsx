import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthFacade } from "../services/auth/AuthFacade";
import "../styles.css";

type FormState = {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
};

const initial: FormState = { nombre: "", email: "", password: "", telefono: "" };

export default function Register() {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email no válido";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (form.telefono && !/^\+?[1-9]\d{1,14}$/.test(form.telefono))
      return "Teléfono en formato E.164 (+573001112233)";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  const msg = validate();
  if (msg) return setError(msg);
  setError(null);
  setLoading(true);

  try {
    const res = await AuthFacade.getInstancia().register({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      password: form.password,
      telefono: form.telefono.trim() || undefined,
    });

    if (res.ok) {
      // 🔹 Guarda token y usuario
      if (res.token) localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      // 🔹 Redirige al home
      navigate("/home", { replace: true });
    } else {
      setError(res.message ?? "No fue posible registrar la cuenta");
    }
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    const friendly =
      data?.message ||
      data?.error ||
      (status === 409 ? "El email ya está registrado" : undefined) ||
      "Error inesperado al registrar";

    setError(friendly);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="container-register center">
      <div className="card-register center">
        <h1 className="title-register">Crear cuenta</h1>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={onSubmit} className="form-register center">
          <div className="field">
            <label className="label" htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              className="input input--light"
              placeholder="Tu nombre"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="input input--light"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="input input--light"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="telefono">Teléfono (opcional)</label>
            <input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              className="input input--light"
              placeholder="+573001112233"
            />
          </div>

          <button disabled={loading} className="btn-primary full" type="submit">
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-muted text-center link-row">
          ¿Ya tienes cuenta?{" "}
          <Link className="link" to="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
