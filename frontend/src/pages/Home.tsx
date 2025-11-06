// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom"; // 👈 import necesario
import "../styles.css";

export default function Home() {
  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 960 }}>
        {/* encabezado */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            className="login-title"
            style={{ color: "#0e693b", marginBottom: 8 }}
          >
            Eco Moda 🌿
          </h1>
          <p
            className="login-subtitle"
            style={{ marginBottom: 0, color: "#333" }}
          >
            Plataforma para vender, intercambiar y donar ropa de segunda mano.
          </p>
        </div>

        {/* fila principal */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
            color: "#222",
          }}
        >
          {/* columna izquierda */}
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <p style={{ fontWeight: 600, marginBottom: 6, color: "#0e693b" }}>
              Bienvenido 👋
            </p>
            <p style={{ marginBottom: 16 }}>
              Gracias por iniciar sesión. Desde aquí puedes ver prendas, trueques
              y donaciones activas.
            </p>

            {/* acciones */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <button
                style={{
                  background: "#15a856",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Explorar catálogo
              </button>
              <button
                style={{
                  background: "#ffffff",
                  color: "#0e693b",
                  border: "1px solid #15a856",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Donar ropa
              </button>
            </div>

            {/* cómo funciona */}
            <p
              style={{
                fontWeight: 600,
                marginBottom: 10,
                color: "#0e693b",
              }}
            >
              ¿Cómo funciona?
            </p>
            <ul style={{ paddingLeft: "1.1rem", lineHeight: 1.5 }}>
              <li>Sube una prenda con foto y descripción.</li>
              <li>Elige si la quieres vender, intercambiar o donar.</li>
              <li>Conecta con otros usuarios de Eco Moda.</li>
            </ul>
          </div>

          {/* columna derecha */}
          <div
            style={{
              flex: "0 0 250px",
              background: "#f6fff9",
              border: "1px solid rgba(0,0,0,0.03)",
              borderRadius: 14,
              padding: "1rem 1.1rem",
              color: "#333",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 6, color: "#0e693b" }}>
              Resumen de hoy
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["Prendas publicadas", "500+"],
                ["Usuarios activos", "200+"],
                ["Donado a ONGs", "$2.500"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "0.6rem 0.7rem",
                    border: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <p
                    style={{
                      marginBottom: 2,
                      fontSize: 13,
                      opacity: 0.7,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      color: "#15a856",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
              ¿Quieres ver las ONGs aliadas? Ve a la sección de donaciones.
            </p>
          </div>
        </div>

        {/* prendas destacadas */}
        <div style={{ marginTop: "2.5rem", color: "#222" }}>
          <p
            style={{
              fontWeight: 600,
              marginBottom: 14,
              color: "#0e693b",
            }}
          >
            Prendas destacadas
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: "1rem",
            }}
          >
            {[
              { nombre: "Chaqueta vintage", precio: "$25.000", tipo: "Chaquetas" },
              { nombre: "Vestido boho", precio: "Trueque", tipo: "Vestidos" },
              { nombre: "Camiseta retro", precio: "$15.000", tipo: "Camisetas" },
              { nombre: "Falda denim", precio: "Trueque", tipo: "Faldas" },
            ].map((item) => (
              <div
                key={item.nombre}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.02)",
                  borderRadius: 12,
                  padding: "0.7rem 0.8rem 0.9rem",
                  color: "#333",
                }}
              >
                <div
                  style={{
                    height: 70,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#05df72,#b0e6cc)",
                    marginBottom: 10,
                  }}
                ></div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.nombre}</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>{item.tipo}</p>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontWeight: 600,
                    color: "#0e693b",
                  }}
                >
                  {item.precio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div
          className="footer-text"
          style={{
            marginTop: "2rem",
            color: "#333",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <p style={{ margin: 0 }}>
            ¿Necesitas hacer login?{" "}
            <a href="/login" style={{ color: "#0e693b", fontWeight: 600 }}>
              Inicia sesión
            </a>
          </p>

          {/* 👇 NUEVO LINK */}
          <p style={{ margin: 0 }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "#0e693b", fontWeight: 600 }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
