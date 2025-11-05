import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../api/client';
import axios, { AxiosError } from 'axios';
import "../styles.css";

type LoginResponse = {
  token: string;
  user?: { id: string; nombre: string; email: string; rol: string };
};

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) {
      setErr('Ingresa email y contraseña');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      nav('/home');
    } catch (error: unknown) {
      let msg = 'Error al iniciar sesión';
      if (axios.isAxiosError(error)) {
        const ax = error as AxiosError<{ error?: string }>;
        msg = ax.response?.data?.error ?? error.message ?? msg;
      }
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión 👋</h1>
        <p className="login-subtitle">Bienvenido de nuevo</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {err && <p className="error-text">{err}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="footer-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
