export type MarketingImages = {
  hero?: string | null;
  compareBefore?: string | null;
  compareAfter?: string | null;
  barbers?: (string | null | undefined)[];
};

function photoOrPlaceholder(url: string | null | undefined, placeholderInner: string): string {
  return url ? `<img src="${url}" alt="" loading="lazy" />` : placeholderInner;
}

function phClass(url: string | null | undefined): string {
  return url ? "ph ph-has-image" : "ph";
}

export function buildMarketingHtml(images: MarketingImages = {}): string {
  const barberPhotos = images.barbers ?? [];
  return `
<div class="preloader" id="preloader" aria-hidden="true">
  <span class="preloader-mark">DB</span>
  <span class="preloader-line"></span>
</div>
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<a class="sr-only" href="#main">Saltar al contenido principal</a>

<header class="site" id="siteHeader">
  <a href="#inicio" class="logo" aria-label="Destiny Barber — inicio">
    <span class="logo-mark">DB</span>
    <span class="logo-word">Destiny&nbsp;Barber</span>
  </a>
  <nav class="primary" aria-label="Navegación principal">
    <ul>
      <li><a href="#inicio">Inicio</a></li>
      <li><a href="#servicios">Servicios</a></li>
      <li><a href="#barberos">Barberos</a></li>
      <li><a href="#nosotros">Nosotros</a></li>
      <li><a href="/mis-citas">Mis citas</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
    <a href="/reservar" class="btn btn-gold nav-cta">Reservar cita</a>
    <button class="menu-toggle" id="menuOpen" aria-haspopup="true" aria-expanded="false" aria-controls="mobileSheet" aria-label="Abrir menú">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </nav>
</header>

<div class="mobile-sheet" id="mobileSheet">
  <div class="sheet-top">
    <span class="logo-word" style="color:var(--gold)">Destiny&nbsp;Barber</span>
    <button class="menu-toggle" id="menuClose" aria-label="Cerrar menú">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <ul>
    <li><a href="#inicio">Inicio</a></li>
    <li><a href="#servicios">Servicios</a></li>
    <li><a href="#barberos">Barberos</a></li>
    <li><a href="#nosotros">Nosotros</a></li>
    <li><a href="/mis-citas">Mis citas</a></li>
    <li><a href="#contacto">Contacto</a></li>
  </ul>
  <a href="/reservar" class="btn btn-gold">Reservar cita</a>
</div>

<main id="main">

<!-- HERO -->
<section class="hero" id="inicio" style="border-top:none;">
  <div class="container">
    <div class="hero-grid">
      <div style="display:flex; gap:var(--space-4);">
        <div class="hero-rail">
          <span class="vert">EST. 2016 — BARBERÍA DE AUTOR — N.º 01</span>
        </div>
        <div class="hero-copy">
          <h1 class="mask"><span class="mask-inner">Tu imagen,<br>ejecutada<br><em>con precisión.</em></span></h1>
          <p class="hero-lead">Barbería de autor en el corazón de la ciudad. Cortes clásicos, fades de precisión y ritual de barba a navaja, para hombres que no dejan nada al azar.</p>
          <div class="hero-cta">
            <a href="/reservar" class="btn btn-gold">Reservar cita</a>
            <a href="#servicios" class="btn btn-ghost">Ver servicios</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><b><span class="count" data-target="9">0</span>&nbsp;años</b><span>De oficio</span></div>
            <div class="stat"><b><span class="count" data-target="4.9" data-decimals="1">0.0</span>&nbsp;★</b><span>1.240 reseñas</span></div>
            <div class="stat"><b><span class="count" data-target="4" data-pad="2">00</span></b><span>Barberos de autor</span></div>
          </div>
        </div>
      </div>

      <div class="hero-media" data-reveal>
        <div class="${phClass(images.hero)}">
          ${photoOrPlaceholder(images.hero, `<div class="ph-tag ph-tag-compact">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg>
            <span>Retrato de sillón — luz cálida</span>
          </div>`)}
        </div>
        <div class="float-card">
          <b>4.9</b>
          <span>★★★★★<br>1.240 reseñas verificadas</span>
        </div>
        <p class="ph-caption"><span>N.º 01 — Sillón principal</span><span>Sala Destiny, planta baja</span></p>
      </div>
    </div>

    <div class="ticker-wrap">
      <div class="ticker">
        <a href="#servicios">Corte clásico</a><a href="#servicios">Fade de precisión</a><a href="#barberos">Barba a navaja</a><a href="#servicios">Toalla caliente</a><a href="/reservar">Experiencia premium</a>
        <a href="#servicios" aria-hidden="true" tabindex="-1">Corte clásico</a><a href="#servicios" aria-hidden="true" tabindex="-1">Fade de precisión</a><a href="#barberos" aria-hidden="true" tabindex="-1">Barba a navaja</a><a href="#servicios" aria-hidden="true" tabindex="-1">Toalla caliente</a><a href="/reservar" aria-hidden="true" tabindex="-1">Experiencia premium</a>
      </div>
    </div>
  </div>
</section>

<!-- ANTES / DESPUES -->
<section id="resultados">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Resultados</p>
        <h2 class="mask" data-reveal><span class="mask-inner">Arrastra y compara.</span></h2>
      </div>
      <p>Desliza el control para ver la diferencia de un corte Destiny — próximamente, con fotografía real de nuestros clientes.</p>
    </div>

    <div class="compare" id="compareSlider" data-reveal style="--pos:50%;">
      <div class="compare-panel compare-after ph${images.compareAfter ? " ph-has-image" : ""}">
        ${photoOrPlaceholder(images.compareAfter, `<div class="ph-tag">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg>
        </div>`)}
      </div>
      <div class="compare-panel compare-before ph${images.compareBefore ? " ph-has-image" : ""}">
        ${photoOrPlaceholder(images.compareBefore, `<div class="ph-tag">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg>
        </div>`)}
      </div>
      <span class="compare-label label-before">Antes</span>
      <span class="compare-label label-after">Después</span>
      <div class="compare-handle" id="compareHandle" role="slider" tabindex="0" aria-label="Comparar antes y después" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg>
      </div>
    </div>
  </div>
</section>

<!-- SERVICIOS -->
<section id="servicios">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Menú de servicios</p>
        <h2 class="mask" data-reveal><span class="mask-inner">El ritual, a tu medida.</span></h2>
      </div>
      <p>Cinco servicios, un mismo estándar: herramientas esterilizadas, tiempo dedicado y acabado impecable.</p>
    </div>

    <div id="serviceList">
      <div class="service-row" data-reveal>
        <span class="service-num">01</span>
        <div><span class="service-name">Corte Clásico</span><p class="service-desc">Tijera y navaja sobre un corte atemporal, acabado con toalla caliente.</p></div>
        <span class="service-meta"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>45 min</span>
        <span class="service-price">$18.000</span>
        <a href="/reservar" class="btn btn-ghost">Reservar</a>
      </div>
      <div class="service-row" data-reveal>
        <span class="service-num">02</span>
        <div><span class="service-name">Fade / Degradado</span><p class="service-desc">Degradado preciso a máquina, de piel a textura, ajustado a tu estilo.</p></div>
        <span class="service-meta"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>40 min</span>
        <span class="service-price">$20.000</span>
        <a href="/reservar" class="btn btn-ghost">Reservar</a>
      </div>
      <div class="service-row" data-reveal>
        <span class="service-num">03</span>
        <div><span class="service-name">Corte + Barba</span><p class="service-desc">El clásico completo: corte de autor y barba perfilada a navaja.</p></div>
        <span class="service-meta"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>60 min</span>
        <span class="service-price">$28.000</span>
        <a href="/reservar" class="btn btn-ghost">Reservar</a>
      </div>
      <div class="service-row" data-reveal>
        <span class="service-num">04</span>
        <div><span class="service-name">Perfilado de Barba</span><p class="service-desc">Diseño y perfilado a navaja con toalla caliente y aceites esenciales.</p></div>
        <span class="service-meta"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>30 min</span>
        <span class="service-price">$15.000</span>
        <a href="/reservar" class="btn btn-ghost">Reservar</a>
      </div>
      <div class="service-row" data-reveal>
        <span class="service-num">05</span>
        <div><span class="service-name">Servicio Premium</span><p class="service-desc">Corte, barba, tratamiento capilar y ritual de navaja completo — la experiencia Destiny.</p></div>
        <span class="service-meta"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>90 min</span>
        <span class="service-price">$42.000</span>
        <a href="/reservar" class="btn btn-ghost">Reservar</a>
      </div>
    </div>
  </div>
</section>

<!-- BARBEROS -->
<section id="barberos">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">El equipo</p>
        <h2 class="mask" data-reveal><span class="mask-inner">Manos que conocen el oficio.</span></h2>
      </div>
      <p>Cada barbero de Destiny se forma en técnica clásica y se especializa en un terreno propio.</p>
    </div>

    <div class="barber-grid">
      <div class="barber-card" data-reveal>
        <div class="ph${barberPhotos[0] ? " ph-has-image" : ""}">${photoOrPlaceholder(barberPhotos[0], `<div class="ph-tag"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg><span>Retrato — luz de estudio</span></div>`)}</div>
        <h3>Mateo Rivas</h3>
        <span class="spec">Especialista en fades</span>
        <p class="bio">Diez años definiendo líneas limpias y degradados de precisión milimétrica.</p>
        <a href="/reservar" class="btn-line">Reservar con Mateo →</a>
      </div>
      <div class="barber-card" data-reveal>
        <div class="ph${barberPhotos[1] ? " ph-has-image" : ""}">${photoOrPlaceholder(barberPhotos[1], `<div class="ph-tag"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg><span>Retrato — luz de estudio</span></div>`)}</div>
        <h3>Julián Torres</h3>
        <span class="spec">Barba y navaja</span>
        <p class="bio">Formado en barbería clásica; maestro de la toalla caliente y el afeitado tradicional.</p>
        <a href="/reservar" class="btn-line">Reservar con Julián →</a>
      </div>
      <div class="barber-card" data-reveal>
        <div class="ph${barberPhotos[2] ? " ph-has-image" : ""}">${photoOrPlaceholder(barberPhotos[2], `<div class="ph-tag"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg><span>Retrato — luz de estudio</span></div>`)}</div>
        <h3>Simón Vega</h3>
        <span class="spec">Cortes de autor</span>
        <p class="bio">Cortes a medida para rostros y estilos de vida distintos, sin recetas genéricas.</p>
        <a href="/reservar" class="btn-line">Reservar con Simón →</a>
      </div>
      <div class="barber-card" data-reveal>
        <div class="ph${barberPhotos[3] ? " ph-has-image" : ""}">${photoOrPlaceholder(barberPhotos[3], `<div class="ph-tag"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7l2-3h12l2 3M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7h16M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg><span>Retrato — luz de estudio</span></div>`)}</div>
        <h3>Noah Dumas</h3>
        <span class="spec">Color y textura</span>
        <p class="bio">Especialista en canas, textura y acabados mate para un look sin esfuerzo.</p>
        <a href="/reservar" class="btn-line">Reservar con Noah →</a>
      </div>
    </div>
  </div>
</section>

<!-- NOSOTROS / WHY -->
<section id="nosotros">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Por qué Destiny</p>
        <h2 class="mask" data-reveal><span class="mask-inner">Cuatro razones para confiar tu imagen a nosotros.</span></h2>
      </div>
    </div>
    <ul class="why-list">
      <li data-reveal><span class="n">01</span><div><h4>Higiene sin excepciones</h4><p>Herramientas esterilizadas y protocolos verificados en cada estación de trabajo.</p></div></li>
      <li data-reveal><span class="n">02</span><div><h4>Barberos certificados</h4><p>Formación internacional en técnica clásica y tendencias contemporáneas.</p></div></li>
      <li data-reveal><span class="n">03</span><div><h4>Producto premium importado</h4><p>Líneas de cuidado capilar y facial seleccionadas por su calidad, no por precio.</p></div></li>
      <li data-reveal><span class="n">04</span><div><h4>Tiempo, no producción en cadena</h4><p>Un cliente a la vez. Sin apuros, sin atajos, sin cortes en serie.</p></div></li>
    </ul>
  </div>
</section>

<!-- RESERVAR / PUENTE AL SISTEMA REAL -->
<section id="reservar-info">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Sistema en vivo</p>
        <h2 class="mask" data-reveal><span class="mask-inner">La reserva ya no es una maqueta.</span></h2>
      </div>
      <p>Disponibilidad real por barbero, sin choques de horario, y tu cita queda al instante en el panel del local.</p>
    </div>

    <div class="live-bridge" data-reveal>
      <div class="live-bridge-copy">
        <ul class="live-points">
          <li><span class="n">01</span>Calendario que solo muestra los días y horas realmente libres.</li>
          <li><span class="n">02</span>Un cliente a la vez por barbero — nunca se pisan dos citas.</li>
          <li><span class="n">03</span>Confirmación al instante, visible de inmediato en el panel del dueño.</li>
        </ul>
        <a href="/reservar" class="btn btn-gold">Probar la reserva real</a>
      </div>
      <div class="live-bridge-panel">
        <span class="live-dot" aria-hidden="true"></span>
        <span>reservar.destinybarber</span>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section>
  <div class="container final-cta" data-reveal>
    <p class="eyebrow">Última llamada</p>
    <h2 class="mask" data-reveal><span class="mask-inner">Tu próximo corte<br><span class="em">empieza aquí.</span></span></h2>
    <a href="/reservar" class="btn btn-gold">Reservar cita ahora</a>
  </div>
</section>

<!-- CONTACTO -->
<section id="contacto">
  <div class="container">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Visítanos</p>
        <h2 class="mask" data-reveal><span class="mask-inner">Horario, ubicación y contacto directo.</span></h2>
      </div>
    </div>

    <div class="contact-grid" data-reveal>
      <div>
        <table class="hours-table" aria-label="Horario de atención">
          <tr><td>Lunes — Viernes</td><td>10:00 – 20:00</td></tr>
          <tr><td>Sábados</td><td>09:00 – 18:00</td></tr>
          <tr><td>Domingos</td><td>Cerrado</td></tr>
        </table>

        <ul class="info-list" style="margin-top:var(--space-4);">
          <li>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <div><h4>Dirección</h4><p>Av. Providencia 1234, Local 3 — Santiago</p></div>
          </li>
          <li>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg>
            <div><h4>Teléfono / WhatsApp</h4><a href="https://wa.me/000000000">+00 0000 0000</a></div>
          </li>
          <li>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></svg>
            <div><h4>Correo</h4><a href="mailto:hola@destinybarber.com">hola@destinybarber.com</a></div>
          </li>
        </ul>

        <div class="social-row">
          <a href="#" aria-label="Instagram de Destiny Barber"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" stroke="none"/></svg></a>
          <a href="https://wa.me/000000000" aria-label="WhatsApp de Destiny Barber"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5c.3 2.5 2.5 4.7 5 5"/></svg></a>
          <a href="tel:+000000000" aria-label="Llamar a Destiny Barber"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg></a>
        </div>
      </div>

      <div class="ph map-ph" role="img" aria-label="Mapa de ubicación — se integrará Google Maps con la dirección real">
        <div class="ph-tag">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span>Mapa — se integrará Google Maps con la ubicación real</span>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="site">
  <div class="container">
    <div class="footer-grid">
      <div>
        <span class="logo-mark" style="font-size:1.7rem;">DB</span>
        <p style="color:var(--cream-dim); font-size:.88rem; margin-top:.8em; max-width:32ch;">Barbería de autor. Cortes de precisión, barba a navaja y una experiencia sin prisa, para hombres que cuidan cada detalle.</p>
      </div>
      <div>
        <h5>Navegación</h5>
        <ul>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#barberos">Barberos</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="/mis-citas">Mis citas</a></li>
        </ul>
      </div>
      <div>
        <h5>Horario</h5>
        <ul>
          <li style="color:var(--cream-dim); font-size:.88rem;">Lun—Vie 10:00–20:00</li>
          <li style="color:var(--cream-dim); font-size:.88rem;">Sáb 09:00–18:00</li>
          <li style="color:var(--cream-dim); font-size:.88rem;">Dom cerrado</li>
        </ul>
      </div>
      <div>
        <h5>Contacto</h5>
        <ul>
          <li><a href="https://wa.me/000000000">WhatsApp</a></li>
          <li><a href="mailto:hola@destinybarber.com">hola@destinybarber.com</a></li>
          <li><a href="#">Instagram @destinybarber</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Destiny Barber. Todos los derechos reservados.</span>
      <span>Av. Providencia 1234, Santiago</span>
    </div>
  </div>
</footer>

<div class="mobile-cta">
  <a class="icon-btn" href="https://wa.me/000000000" aria-label="Escribir por WhatsApp"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5c.3 2.5 2.5 4.7 5 5"/></svg></a>
  <a href="/reservar" class="btn btn-gold">Reservar cita</a>
</div>
`;
}
