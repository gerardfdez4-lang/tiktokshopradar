// Página de la clase (vídeo) + oferta del curso. Funnel: registro -> aquí -> compra.
// 👉 SUSTITUYE CHECKOUT_URL por tu enlace de pago real (Hotmart / Stripe / etc.).
const CHECKOUT_URL = "#"; // TODO: poner el enlace de checkout ($697)

export const metadata = {
  title: "Tu clase gratis — First 100 Sales",
  description: "Cómo vender en TikTok Shop USA y conseguir tus primeras 100 ventas.",
};

const MODULES = [
  { t: "Fundamentos de TikTok Shop USA", d: "Por qué es el mercado más rentable del mundo y cómo funciona por dentro." },
  { t: "Entra al mercado US desde fuera", d: "El setup cross-border paso a paso: entidad, pagos, logística e impuestos." },
  { t: "Encuentra productos ganadores", d: "Usa la herramienta first100sales (incluida) para detectar lo que va a petar antes que nadie." },
  { t: "Contenido que vende", d: "Hooks, formatos virales y el guion que convierte visitas en ventas." },
  { t: "Afiliados y muestras", d: "Consigue creators y muestras para que otros vendan tu producto por ti." },
  { t: "Escala a tus primeras 100 ventas", d: "El plan de acción para llegar a 100 ventas y construir desde ahí." },
];

const FAQ = [
  { q: "¿Necesito experiencia previa?", a: "No. El curso empieza desde cero y te lleva paso a paso hasta tus primeras ventas." },
  { q: "¿Funciona si no vivo en USA?", a: "Sí. Justamente enseño cómo entrar al mercado de TikTok Shop USA desde fuera, que es como lo hago yo." },
  { q: "¿Qué es la herramienta incluida?", a: "first100sales: una herramienta que te muestra los productos que más venden en TikTok Shop por mercado, ordenados por GMV, para que encuentres ganadores rápido. Va incluida gratis con el curso." },
  { q: "¿Cómo accedo después de comprar?", a: "Acceso inmediato y de por vida a todo el curso, las actualizaciones y la herramienta." },
  { q: "¿Hay garantía?", a: "Sí, tienes 7 días de garantía. Si no es para ti, te devolvemos el dinero." },
];

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <svg viewBox="0 0 100 100" fill="none" aria-hidden style={{ width: 21, height: 21 }}>
          <rect x="24" y="52" width="13" height="24" rx="4" fill="#06120b" />
          <rect x="43" y="40" width="13" height="36" rx="4" fill="#06120b" />
          <rect x="62" y="26" width="13" height="50" rx="4" fill="#06120b" />
          <path d="M62 24 L68.5 14 L75 24 Z" fill="#06120b" />
        </svg>
      </span>
      <span className="wordmark"><span>first</span><span className="accent">100</span><span>sales</span></span>
    </div>
  );
}

export default function VerClase() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner"><Brand /><span className="nav-tag">Tu clase gratis</span></div>
      </nav>

      <main className="wrap">
        <div className="c-hero" style={{ paddingBottom: 20 }}>
          <span className="c-eyebrow"><span className="dot" /> Estás dentro · clase gratis</span>
          <h1 className="c-h1" style={{ maxWidth: "20ch" }}>Tu clase: vender en <span className="grad">TikTok Shop USA</span></h1>
        </div>

        <div className="c-video">
          <span className="c-play">▶</span>
          <span className="c-vidnote">Aquí va tu vídeo de la clase (lo grabas y lo incrustas)</span>
        </div>

        <h2 className="c-section-title">¿Te ha gustado la clase?</h2>
        <p className="c-section-sub">Esto es solo la punta. Dentro del curso completo tienes el método entero, paso a paso, más la herramienta incluida para encontrar productos ganadores.</p>

        <div className="c-modules">
          {MODULES.map((m, i) => (
            <div className="c-mod" key={i}>
              <div className="num">{i + 1}</div>
              <h4>{m.t}</h4>
              <p>{m.d}</p>
            </div>
          ))}
        </div>

        <div className="c-bonus">
          <div className="ico">
            <svg viewBox="0 0 100 100" fill="none" style={{ width: 40, height: 40 }}>
              <rect x="24" y="52" width="13" height="24" rx="4" fill="#06120b" />
              <rect x="43" y="40" width="13" height="36" rx="4" fill="#06120b" />
              <rect x="62" y="26" width="13" height="50" rx="4" fill="#06120b" />
              <path d="M62 24 L68.5 14 L75 24 Z" fill="#06120b" />
            </svg>
          </div>
          <div>
            <h3>Herramienta first100sales — incluida gratis</h3>
            <p>El SaaS que te muestra los productos que más venden en TikTok Shop por mercado, ordenados por GMV, con vídeos de referencia y datos de la tienda para pedir muestras. Normalmente sería de pago; con el curso lo tienes incluido.</p>
            <span className="tag">Valor real: $49/mes · GRATIS contigo</span>
          </div>
        </div>

        <h2 className="c-section-title">Lo que dicen los alumnos</h2>
        <div className="c-tgrid3">
          {[
            { n: "María G.", r: "Empezó de cero", t: "En 3 semanas hice mis primeras ventas. La herramienta para encontrar productos es brutal, me ahorró muchísimo tiempo." },
            { n: "Carlos R.", r: "Creador", t: "Por fin alguien que vende de verdad en USA y lo explica claro. El módulo de cross-border vale el curso entero." },
            { n: "Andrea L.", r: "Desde México", t: "Pensaba que esto era solo para gente en USA. Me equivocaba. Ya estoy en camino a mis 100 ventas." },
          ].map((x, i) => (
            <div className="c-testi" key={i}>
              <div className="stars">★★★★★</div>
              <p>“{x.t}”</p>
              <div className="who"><span className="av">{x.n[0]}</span><span><b>{x.n}</b><small>{x.r}</small></span></div>
            </div>
          ))}
        </div>
        <div className="c-ph">Testimonios de ejemplo — sustitúyelos por reales antes de lanzar.</div>

        <h2 className="c-section-title" id="precio">Accede al curso completo</h2>
        <div className="c-offer">
          <div className="c-stack">
            <div className="c-stack-item"><span>Curso completo <b>First 100 Sales</b> (6 módulos)</span><span className="v">$997</span></div>
            <div className="c-stack-item free"><span>Herramienta <b>first100sales</b> (acceso de por vida)</span><span className="v">incluido</span></div>
            <div className="c-stack-item free"><span>Plantillas, guiones y recursos</span><span className="v">incluido</span></div>
            <div className="c-stack-item free"><span>Actualizaciones futuras</span><span className="v">incluido</span></div>
          </div>
          <div className="c-price-old">Valor total: $1.500+</div>
          <div className="c-price"><span className="cur">$697</span></div>
          <div className="c-price-note">Pago único · acceso de por vida · herramienta incluida</div>
          <a className="c-buy" href={CHECKOUT_URL}>Quiero el curso completo →</a>
        </div>

        <div className="c-guarantee">
          <span className="shield">🛡️</span>
          <div><b>Garantía de 7 días</b><p>Si entras, lo ves y no es para ti, te devolvemos el 100% del dinero. Sin preguntas.</p></div>
        </div>

        <h2 className="c-section-title">Preguntas frecuentes</h2>
        <div className="c-faq">
          {FAQ.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <div className="c-offer" style={{ marginTop: 30 }}>
          <h2 className="c-section-title" style={{ margin: "0 0 6px" }}>Empieza hoy</h2>
          <div className="c-price-note">Únete a First 100 Sales y consigue tus primeras 100 ventas.</div>
          <a className="c-buy" href={CHECKOUT_URL}>Acceder por $697 →</a>
        </div>

        <div className="footer"><span className="grad">first100sales</span> · tu atajo a las primeras 100 ventas en TikTok Shop</div>
      </main>
    </>
  );
}
