// src/pages/Home.tsx
import "../styles.css"; // usa el mismo css del login

export default function Home() {
  return (
    <div className="login-page">
      {/* usamos la misma tarjeta del login */}
      <div className="login-card" style={{ maxWidth: 960 }}>
        {/* encabezado */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="login-title" style={{ color: "#15a856", marginBottom: 8 }}>
            Eco Moda 🌿
          </h1>
          <p className="login-subtitle" style={{ marginBottom: 0 }}>
            Plataforma para vender, intercambiar y donar ropa de segunda mano.
          </p>
        </div>

        {/* fila principal: texto + panel lateral */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* columna izquierda */}
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Bienvenido 👋</p>
            <p style={{ marginBottom: 16 }}>
              Gracias por iniciar sesión. Desde aquí puedes ver prendas, trueques
              y donaciones activas.
            </p>

            {/* acciones principales */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <button>Explorar catálogo</button>
              <button style={{ background: "#ffffff", color: "#15a856", border: "1px solid #15a856" }}>
                Donar ropa
              </button>
            </div>

            {/* “cómo funciona” aprovechando etiquetas normales */}
            <p style={{ fontWeight: 600, marginBottom: 10 }}>¿Cómo funciona?</p>
            <ul style={{ paddingLeft: "1.1rem", lineHeight: 1.5 }}>
              <li>Sube una prenda con foto y descripción.</li>
              <li>Elige si la quieres vender, intercambiar o donar.</li>
              <li>Conecta con otros usuarios de Eco Moda.</li>
            </ul>
          </div>

          {/* columna derecha: “cards” rápidas */}
          <div
            style={{
              flex: "0 0 250px",
              background: "#f6fff9",
              border: "1px solid rgba(0,0,0,0.03)",
              borderRadius: 14,
              padding: "1rem 1.1rem",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Resumen de hoy</p>
            <div style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "0.6rem 0.7rem",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <p style={{ marginBottom: 2, fontSize: 13, opacity: 0.7 }}>Prendas publicadas</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#15a856" }}>500+</p>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "0.6rem 0.7rem",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <p style={{ marginBottom: 2, fontSize: 13, opacity: 0.7 }}>Usuarios activos</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#15a856" }}>200+</p>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "0.6rem 0.7rem",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <p style={{ marginBottom: 2, fontSize: 13, opacity: 0.7 }}>Donado a ONGs</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#15a856" }}>$2.500</p>
              </div>
            </div>

            <p style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
              ¿Quieres ver las ONGs aliadas? ve a la sección de donaciones.
            </p>
          </div>
        </div>

        {/* “prendas destacadas” pero usando el mismo estilo de la tarjeta */}
        <div style={{ marginTop: "2.5rem" }}>
          <p style={{ fontWeight: 600, marginBottom: 14 }}>Prendas destacadas</p>
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
                }}
              >
                <div
                  style={{
                    height: 70,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#05df72,#c5ffe5)",
                    marginBottom: 10,
                  }}
                ></div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.nombre}</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>{item.tipo}</p>
                <p style={{ margin: "6px 0 0", fontWeight: 600, color: "#15a856" }}>{item.precio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* footer del card */}
        <p className="footer-text" style={{ marginTop: "2rem" }}>
          ¿Necesitas volver al login? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
