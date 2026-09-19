export const marketingCss = `
  :root{
    --ink:#0b0a08;
    --coffee:#1b140f;
    --coffee-2:#241b14;
    --cream:#f3ead9;
    --cream-dim:#cabfa9;
    --gold:#c9a35f;
    --gold-bright:#e2c07f;
    --gold-dim:#8a723f;
    --line: rgba(201,163,95,.28);
    --line-soft: rgba(243,234,217,.14);
    --fs-display: clamp(2.6rem, 5.4vw + 1rem, 6.2rem);
    --fs-h2: clamp(1.9rem, 3vw + 1rem, 3.4rem);
    --fs-h3: clamp(1.25rem, 1.1vw + 1rem, 1.6rem);
    --fs-lead: clamp(1.05rem, .5vw + .95rem, 1.25rem);
    --space-1:.5rem; --space-2:1rem; --space-3:1.5rem; --space-4:2rem;
    --space-5:3rem; --space-6:4.5rem; --space-7:6.5rem;
    --maxw: 1340px;
    --gutter: clamp(20px, 5vw, 64px);
    color-scheme: dark;
  }

  .db-page{ }
  .db-page *,.db-page *::before,.db-page *::after{ box-sizing:border-box; }
  .db-page{
    background:var(--ink);
    color:var(--cream);
    font-family:'Archivo',ui-sans-serif,system-ui,-apple-system,sans-serif;
    font-size:16px;
    line-height:1.6;
    padding-inline:var(--gutter);
    overflow-x:hidden;
    background-image:
      radial-gradient(ellipse 900px 500px at 85% -5%, rgba(201,163,95,.10), transparent 60%),
      radial-gradient(ellipse 700px 500px at 8% 15%, rgba(138,114,63,.08), transparent 55%);
  }
  .db-page img{ max-width:100%; display:block; }
  .db-page a{ color:inherit; }
  .db-page h1,.db-page h2,.db-page h3,.db-page h4{ margin:0; font-family:'Bodoni Moda',ui-serif,Georgia,serif; font-weight:600; text-wrap:balance; }
  .db-page p{ margin:0; }
  .db-page ul{ margin:0; padding:0; list-style:none; }
  .db-page button{ font-family:inherit; }

  .db-page .container{ max-width:var(--maxw); margin-inline:auto; }
  .db-page section{ padding-block: clamp(4rem, 8vw, 7rem); border-top:1px solid var(--line-soft); }
  .db-page section:first-of-type{ border-top:none; }

  .db-page .eyebrow{
    display:flex; align-items:center; gap:.7em;
    font-family:'IBM Plex Mono',ui-monospace,monospace;
    font-size:.72rem; letter-spacing:.22em; text-transform:uppercase;
    color:var(--gold); margin-bottom:var(--space-2);
  }
  .db-page .eyebrow::before{ content:""; width:28px; height:1px; background:var(--gold-dim); }

  .db-page .btn{
    display:inline-flex; align-items:center; justify-content:center; gap:.55em;
    padding:.95em 1.7em; border-radius:2px; border:1px solid transparent;
    font:600 .82rem/1 'Archivo',sans-serif; letter-spacing:.05em; text-transform:uppercase;
    cursor:pointer; text-decoration:none; transition:transform .25s ease, background .25s ease, color .25s ease, border-color .25s ease;
  }
  .db-page .btn:focus-visible{ outline:2px solid var(--gold-bright); outline-offset:3px; }
  .db-page .btn-gold{ background:var(--gold); color:var(--ink); }
  .db-page .btn-gold:hover{ background:var(--gold-bright); transform:translateY(-2px); }
  .db-page .btn-ghost{ background:transparent; color:var(--cream); border-color:var(--line-soft); }
  .db-page .btn-ghost:hover{ border-color:var(--gold); color:var(--gold-bright); transform:translateY(-2px); }
  .db-page .btn-line{ background:transparent; color:var(--gold); border:none; padding:.3em 0; border-radius:0; text-transform:none; letter-spacing:.01em; font-size:.85rem; position:relative; }
  .db-page .btn-line::after{ content:""; position:absolute; left:0; right:0; bottom:-2px; height:1px; background:var(--gold-dim); transform:scaleX(1); transform-origin:left; transition:background .25s ease; }
  .db-page .btn-line:hover::after{ background:var(--gold-bright); }
  .db-page .btn[disabled]{ opacity:.4; cursor:not-allowed; transform:none !important; }

  .db-page .icon{ width:1.1em; height:1.1em; flex:none; }

  /* ---------- header ---------- */
  .db-page header.site{
    position:sticky; top:env(safe-area-inset-top,0px); z-index:60;
    margin-inline:calc(var(--gutter) * -1); padding-inline:var(--gutter);
    display:flex; align-items:center; justify-content:space-between;
    padding-block:1.1rem; transition:background .3s ease, border-color .3s ease, backdrop-filter .3s ease, padding-block .3s ease;
    border-bottom:1px solid transparent;
  }
  .db-page header.site.scrolled{
    background:rgba(11,10,8,.78); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
    border-bottom-color:var(--line); padding-block:.8rem;
  }
  .db-page .logo{ display:flex; align-items:baseline; gap:.5em; text-decoration:none; }
  .db-page .logo-mark{ font-family:'Bodoni Moda',serif; font-weight:700; font-size:1.5rem; color:var(--gold-bright); letter-spacing:.02em; }
  .db-page .logo-word{ font-family:'IBM Plex Mono',monospace; font-size:.66rem; letter-spacing:.24em; text-transform:uppercase; color:var(--cream-dim); }

  .db-page nav.primary{ display:flex; align-items:center; gap:var(--space-5); }
  .db-page nav.primary ul{ display:flex; gap:var(--space-4); }
  .db-page nav.primary a{
    text-decoration:none; font-size:.82rem; letter-spacing:.03em; color:var(--cream-dim);
    position:relative; padding-block:.3em; transition:color .2s ease;
  }
  .db-page nav.primary a::after{ content:""; position:absolute; left:0; right:100%; bottom:0; height:1px; background:var(--gold); transition:right .25s ease; }
  .db-page nav.primary a:hover{ color:var(--cream); }
  .db-page nav.primary a:hover::after{ right:0; }
  .db-page .nav-cta{ display:none; }
  @media (min-width:960px){ .db-page .nav-cta{ display:inline-flex; } }

  .db-page .menu-toggle{
    display:inline-flex; background:none; border:1px solid var(--line-soft); border-radius:2px;
    padding:.55em; color:var(--cream); cursor:pointer;
  }
  @media (min-width:960px){ .db-page .menu-toggle{ display:none; } .db-page nav.primary ul{ display:flex; } }
  @media (max-width:959px){ .db-page nav.primary ul{ display:none; } }

  .db-page .mobile-sheet{
    position:fixed; inset:0; z-index:80; background:var(--ink);
    display:flex; flex-direction:column; padding:var(--space-4) var(--gutter);
    padding-top:calc(env(safe-area-inset-top,0px) + var(--space-3));
    transform:translateY(-100%); transition:transform .35s ease;
  }
  .db-page .mobile-sheet.open{ transform:translateY(0); }
  .db-page .mobile-sheet .sheet-top{ display:flex; justify-content:space-between; align-items:center; }
  .db-page .mobile-sheet ul{ display:flex; flex-direction:column; gap:var(--space-3); margin-top:var(--space-6); }
  .db-page .mobile-sheet a{ text-decoration:none; font-family:'Bodoni Moda',serif; font-size:2rem; color:var(--cream); }
  .db-page .mobile-sheet .btn{ margin-top:var(--space-5); align-self:flex-start; }

  /* ---------- hero ---------- */
  .db-page .hero{ padding-top:clamp(2.5rem,5vw,4.5rem); position:relative; }
  .db-page .hero-grid{ display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(2rem,5vw,4.5rem); align-items:center; }
  @media (max-width:900px){ .db-page .hero-grid{ grid-template-columns:1fr; } }

  .db-page .hero-rail{ display:flex; gap:var(--space-3); }
  .db-page .hero-rail .vert{
    writing-mode:vertical-rl; transform:rotate(180deg); font-family:'IBM Plex Mono',monospace;
    font-size:.68rem; letter-spacing:.3em; text-transform:uppercase; color:var(--gold-dim);
    padding-block:.2em; border-right:1px solid var(--line); padding-right:var(--space-2);
    white-space:nowrap;
  }
  .db-page .hero-copy h1{ font-size:var(--fs-display); line-height:.98; font-weight:600; }
  .db-page .hero-copy h1 em{ font-style:italic; font-weight:400; color:var(--gold-bright); }
  .db-page .hero-lead{ font-size:var(--fs-lead); color:var(--cream-dim); max-width:38ch; margin-top:var(--space-3); }
  .db-page .hero-cta{ display:flex; flex-wrap:wrap; gap:var(--space-3); margin-top:var(--space-4); }
  .db-page .hero-stats{ display:flex; gap:var(--space-5); margin-top:var(--space-6); }
  .db-page .hero-stats .stat b{ display:block; font-family:'Bodoni Moda',serif; font-size:1.9rem; color:var(--gold-bright); }
  .db-page .hero-stats .stat span{ font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; color:var(--cream-dim); }

  .db-page .hero-media{ position:relative; }
  .db-page .ph{
    position:relative; overflow:hidden; border:1px solid var(--line-soft);
    background:
      linear-gradient(160deg, var(--coffee-2), var(--coffee) 60%, #0e0b08);
    display:flex; align-items:flex-end; color:var(--gold-dim);
    min-height:120px;
  }
  .db-page .ph::before{
    content:""; position:absolute; inset:0;
    background-image: repeating-linear-gradient(135deg, rgba(201,163,95,.05) 0 2px, transparent 2px 26px);
  }
  .db-page .ph .ph-tag{
    position:relative; z-index:1; display:flex; align-items:center; gap:.6em;
    padding:var(--space-2); font-family:'IBM Plex Mono',monospace; font-size:.68rem;
    letter-spacing:.05em; color:var(--cream-dim); background:linear-gradient(0deg, rgba(11,10,8,.75), transparent);
    width:100%;
  }
  .db-page .ph .ph-tag svg{ color:var(--gold); flex:none; }
  .db-page .hero-media .ph{ aspect-ratio:4/5; }
  .db-page .hero-media .ph-tag-compact{ justify-content:flex-end; text-align:right; }
  .db-page .hero-media .ph-caption{
    margin-top:var(--space-2); display:flex; justify-content:space-between; gap:var(--space-2);
    font-family:'IBM Plex Mono',monospace; font-size:.68rem; letter-spacing:.06em; color:var(--cream-dim);
  }
  .db-page .hero-media .float-card{
    position:absolute; left:-1px; bottom:var(--space-4); z-index:2;
    background:rgba(11,10,8,.86); backdrop-filter:blur(10px); border:1px solid var(--line);
    padding:.9em 1.2em; display:flex; align-items:center; gap:.6em;
  }
  .db-page .float-card b{ font-family:'Bodoni Moda',serif; color:var(--gold-bright); font-size:1.1rem; }
  .db-page .float-card span{ font-size:.72rem; color:var(--cream-dim); }

  /* ticker */
  .db-page .ticker-wrap{ overflow:hidden; border-block:1px solid var(--line-soft); margin-top:var(--space-7); }
  .db-page .ticker{ display:flex; gap:var(--space-4); padding-block:.9rem; white-space:nowrap; width:max-content; animation:ticker 24s linear infinite; }
  .db-page .ticker-wrap:hover .ticker, .db-page .ticker-wrap:focus-within .ticker{ animation-play-state:paused; }
  .db-page .ticker a{
    font-family:'IBM Plex Mono',monospace; font-size:.74rem; letter-spacing:.12em; text-transform:uppercase;
    color:var(--cream-dim); text-decoration:none; display:flex; align-items:center; gap:var(--space-4);
    padding-block:.2em; transition:color .25s ease, transform .25s ease;
  }
  .db-page .ticker a::after{ content:"•"; color:var(--gold-dim); margin-left:var(--space-4); }
  .db-page .ticker a:hover, .db-page .ticker a:focus-visible{ color:var(--gold-bright); transform:scale(1.06); }
  .db-page .ticker a:focus-visible{ outline:2px solid var(--gold-bright); outline-offset:3px; }
  @keyframes ticker{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

  /* antes / despues comparador */
  .db-page .compare{
    position:relative; aspect-ratio:16/8; overflow:hidden; border:1px solid var(--line-soft);
    cursor:ew-resize; touch-action:none; -webkit-user-select:none; user-select:none;
  }
  .db-page .compare-panel{ position:absolute; inset:0; }
  .db-page .compare-before{ clip-path: inset(0 calc(100% - var(--pos, 50%)) 0 0); }
  .db-page .compare-label{
    position:absolute; top:var(--space-3); z-index:3; font-family:'IBM Plex Mono',monospace; font-size:.68rem;
    letter-spacing:.14em; text-transform:uppercase; color:var(--cream); background:rgba(11,10,8,.55);
    padding:.4em .8em; border:1px solid var(--line); pointer-events:none;
  }
  .db-page .compare-label.label-before{ left:var(--space-3); }
  .db-page .compare-label.label-after{ right:var(--space-3); }
  .db-page .compare-handle{
    position:absolute; top:0; bottom:0; left:var(--pos, 50%); transform:translateX(-50%);
    width:2px; background:var(--gold); z-index:4; display:flex; align-items:center; justify-content:center;
  }
  .db-page .compare-handle::before{
    content:""; position:absolute; width:2.8rem; height:2.8rem; border-radius:50%; background:var(--gold);
    left:50%; top:50%; transform:translate(-50%,-50%); transition:transform .2s ease;
  }
  .db-page .compare-handle:hover::before, .db-page .compare-handle:focus-visible::before{ transform:translate(-50%,-50%) scale(1.1); }
  .db-page .compare-handle svg{ position:relative; z-index:1; color:var(--ink); }
  .db-page .compare-handle:focus-visible{ outline:2px solid var(--gold-bright); outline-offset:6px; }

  /* ---------- reveal ---------- */
  .db-page [data-reveal]{ opacity:1; transform:none; transition:opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
  @media (prefers-reduced-motion: no-preference){
    .db-page [data-reveal]{ opacity:0; transform:translateY(26px); }
    .db-page [data-reveal].is-visible{ opacity:1; transform:none; }
  }

  /* ---------- preloader ---------- */
  .db-page .preloader{
    position:fixed; inset:0; z-index:300; background:var(--ink);
    display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1rem;
    transition:opacity .7s ease, visibility .7s ease;
  }
  .db-page .preloader-mark{ font-family:'Bodoni Moda',serif; font-size:2.6rem; color:var(--gold-bright); letter-spacing:.4em; opacity:0; animation:preloaderIn 1.1s cubic-bezier(.16,1,.3,1) forwards .1s; }
  .db-page .preloader-line{ width:120px; height:1px; background:var(--line-soft); position:relative; overflow:hidden; }
  .db-page .preloader-line::after{ content:""; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; animation:preloaderBar 1.1s cubic-bezier(.16,1,.3,1) forwards .2s; }
  @keyframes preloaderIn{ from{ opacity:0; letter-spacing:.9em; } to{ opacity:1; letter-spacing:.4em; } }
  @keyframes preloaderBar{ to{ transform:scaleX(1); } }
  .db-page .preloader.done{ opacity:0; visibility:hidden; pointer-events:none; }
  @media (prefers-reduced-motion: reduce){ .db-page .preloader-mark{ animation:none; opacity:1; } .db-page .preloader-line::after{ animation:none; transform:scaleX(1); } }

  /* ---------- scroll progress ---------- */
  .db-page .scroll-progress{ position:fixed; top:0; left:0; height:2px; width:0%; background:linear-gradient(90deg, var(--gold-dim), var(--gold-bright)); z-index:90; }

  /* ---------- custom cursor ---------- */
  .db-page .cursor-dot, .db-page .cursor-ring{ position:fixed; top:0; left:0; pointer-events:none; z-index:250; border-radius:50%; transform:translate(-50%,-50%); opacity:0; }
  .db-page .cursor-dot{ width:6px; height:6px; background:var(--gold-bright); transition:opacity .3s ease; }
  .db-page .cursor-ring{ width:34px; height:34px; border:1px solid var(--line); transition:opacity .3s ease, width .3s cubic-bezier(.16,1,.3,1), height .3s cubic-bezier(.16,1,.3,1), border-color .3s ease, background .3s ease; }
  body.has-fine-pointer .db-page .cursor-dot, body.has-fine-pointer .db-page .cursor-ring{ opacity:1; }
  body.has-fine-pointer .db-page, body.has-fine-pointer .db-page a, body.has-fine-pointer .db-page button, body.has-fine-pointer .db-page label{ cursor:none; }
  .db-page .cursor-ring.hovering{ width:56px; height:56px; border-color:var(--gold-bright); background:rgba(201,163,95,.08); }
  @media (hover:none), (pointer:coarse){ .db-page .cursor-dot, .db-page .cursor-ring{ display:none !important; } body.has-fine-pointer .db-page{ cursor:auto; } }

  /* ---------- hero motion ---------- */
  @media (prefers-reduced-motion: no-preference){ html{ scroll-behavior:smooth; } }
  .db-page .hero-copy > *{ opacity:0; transform:translateY(20px); transition:opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
  .db-page .hero-copy > *:nth-child(1){ transition-delay:.55s; }
  .db-page .hero-copy > *:nth-child(2){ transition-delay:.72s; }
  .db-page .hero-copy > *:nth-child(3){ transition-delay:.86s; }
  .db-page .hero-copy > *:nth-child(4){ transition-delay:1s; }
  .db-page .hero-rail .vert{ opacity:0; transform:translateY(20px); transition:opacity .9s cubic-bezier(.16,1,.3,1) .4s, transform .9s cubic-bezier(.16,1,.3,1) .4s; }
  body.loaded .db-page .hero-copy > *, body.loaded .db-page .hero-rail .vert{ opacity:1; transform:none; }
  @media (prefers-reduced-motion: reduce){
    .db-page .hero-copy > *, .db-page .hero-rail .vert{ opacity:1; transform:none; transition:none; }
  }

  .db-page .hero-media{ perspective:1200px; }
  .db-page .hero-media .ph{ transition:transform .5s cubic-bezier(.16,1,.3,1); transform-style:preserve-3d; will-change:transform; }

  .db-page .eyebrow::before{ width:0; transition:width .7s cubic-bezier(.16,1,.3,1) .15s; }
  .db-page [data-reveal].is-visible .eyebrow::before,
  .db-page .eyebrow[data-reveal].is-visible::before{ width:28px; }

  /* ---------- text reveal (headlines) ---------- */
  .db-page .mask{ overflow:hidden; }
  .db-page .mask .mask-inner{ display:block; transform:translateY(112%); transition:transform 1s cubic-bezier(.16,1,.3,1); }
  .db-page .mask.is-visible .mask-inner{ transform:translateY(0); }
  body.loaded .db-page .hero-copy .mask .mask-inner{ transform:translateY(0); }
  @media (prefers-reduced-motion: reduce){ .db-page .mask .mask-inner{ transform:none; transition:none; } }

  /* magnetic / shimmer buttons */
  .db-page .btn-gold{ position:relative; overflow:hidden; will-change:transform; transition:transform .35s cubic-bezier(.16,1,.3,1), background .25s ease; }
  .db-page .btn-gold::before{
    content:""; position:absolute; top:0; left:-60%; width:40%; height:100%;
    background:linear-gradient(115deg, transparent, rgba(255,255,255,.4), transparent);
    transform:skewX(-18deg); transition:left .65s ease; pointer-events:none;
  }
  .db-page .btn-gold:hover::before{ left:130%; }

  /* barber hover lift */
  .db-page .barber-card .ph{ transition:transform .6s cubic-bezier(.16,1,.3,1), border-color .3s ease; }
  .db-page .barber-card .ph:hover{ transform:scale(1.035); border-color:var(--gold); }
  .db-page .ph .ph-tag{ transition:transform .45s cubic-bezier(.16,1,.3,1); }
  .db-page .barber-card .ph:hover .ph-tag{ transform:translateY(-4px); }
  .db-page .barber-card{ transition:transform .45s cubic-bezier(.16,1,.3,1); }
  .db-page .barber-card:hover{ transform:translateY(-6px); }

  /* animated stat counters */
  .db-page .count{ font-variant-numeric:tabular-nums; }

  /* ---------- section heads ---------- */
  .db-page .section-head{ display:flex; justify-content:space-between; align-items:flex-end; gap:var(--space-3); flex-wrap:wrap; margin-bottom:var(--space-6); }
  .db-page .section-head p{ max-width:34ch; color:var(--cream-dim); }

  /* ---------- services ---------- */
  .db-page .service-row{
    display:grid; grid-template-columns:2.5rem 1.4fr 1fr auto auto; gap:var(--space-4);
    align-items:center; padding-block:var(--space-4); border-top:1px solid var(--line-soft);
  }
  .db-page .service-row:last-child{ border-bottom:1px solid var(--line-soft); }
  .db-page .service-num{ font-family:'IBM Plex Mono',monospace; color:var(--gold-dim); font-size:.85rem; }
  .db-page .service-name{ font-family:'Bodoni Moda',serif; font-size:var(--fs-h3); }
  .db-page .service-desc{ color:var(--cream-dim); font-size:.92rem; max-width:46ch; margin-top:.35em; }
  .db-page .service-meta{ font-family:'IBM Plex Mono',monospace; font-size:.78rem; color:var(--cream-dim); display:flex; align-items:center; gap:.5em; }
  .db-page .service-price{ font-family:'IBM Plex Mono',monospace; font-size:1.15rem; color:var(--gold-bright); font-variant-numeric:tabular-nums; }
  @media (max-width:820px){
    .db-page .service-row{ grid-template-columns:2rem 1fr; grid-template-areas:"num name" ". desc" "meta meta" "cta cta"; row-gap:.6em; }
    .db-page .service-num{ grid-area:num; } .db-page .service-name{ grid-area:name; } .db-page .service-desc{ grid-area:desc; }
    .db-page .service-meta{ grid-area:meta; justify-content:space-between; } .db-page .service-price{ order:1; }
    .db-page .service-row .btn{ grid-area:cta; width:100%; }
  }

  /* ---------- barbers ---------- */
  .db-page .barber-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:var(--space-4); }
  .db-page .barber-grid > *:nth-child(2){ margin-top:var(--space-6); }
  .db-page .barber-grid > *:nth-child(4){ margin-top:var(--space-3); }
  @media (max-width:980px){ .db-page .barber-grid{ grid-template-columns:repeat(2,1fr); } .db-page .barber-grid > *{ margin-top:0 !important; } }
  @media (max-width:560px){ .db-page .barber-grid{ grid-template-columns:1fr; } }
  .db-page .barber-card .ph{ aspect-ratio:3/4; }
  .db-page .barber-card h3{ margin-top:var(--space-3); font-size:var(--fs-h3); }
  .db-page .barber-card .spec{ font-family:'IBM Plex Mono',monospace; font-size:.68rem; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin-top:.3em; display:block; }
  .db-page .barber-card p.bio{ color:var(--cream-dim); font-size:.9rem; margin-top:.6em; }
  .db-page .barber-card .btn-line{ margin-top:.8em; }

  /* ---------- por qué destiny ---------- */
  .db-page .why-list{ display:grid; grid-template-columns:1fr 1fr; gap:0 var(--space-6); }
  @media (max-width:820px){ .db-page .why-list{ grid-template-columns:1fr; } }
  .db-page .why-list li{ display:flex; gap:var(--space-3); padding-block:var(--space-4); border-top:1px solid var(--line-soft); }
  .db-page .why-list li:nth-last-child(-n+2){ border-bottom:1px solid var(--line-soft); }
  @media (max-width:820px){ .db-page .why-list li:nth-last-child(-n+2){ border-bottom:none; } .db-page .why-list li:last-child{ border-bottom:1px solid var(--line-soft); } }
  .db-page .why-list .n{ font-family:'IBM Plex Mono',monospace; color:var(--gold-dim); font-size:.8rem; padding-top:.2em; }
  .db-page .why-list h4{ font-size:1.05rem; font-family:'Archivo',sans-serif; font-weight:700; }
  .db-page .why-list p{ color:var(--cream-dim); font-size:.9rem; margin-top:.35em; }

  /* ---------- reservar / puente al sistema real ---------- */
  .db-page .live-bridge{ display:grid; grid-template-columns:1.3fr .7fr; gap:var(--space-6); align-items:center; }
  @media (max-width:820px){ .db-page .live-bridge{ grid-template-columns:1fr; } }
  .db-page .live-points{ display:flex; flex-direction:column; gap:var(--space-3); margin-bottom:var(--space-4); }
  .db-page .live-points li{ display:flex; gap:var(--space-3); font-size:.95rem; color:var(--cream-dim); }
  .db-page .live-points .n{ font-family:'IBM Plex Mono',monospace; color:var(--gold-dim); font-size:.8rem; flex:none; padding-top:.15em; }
  .db-page .live-bridge-panel{
    border:1px solid var(--line-soft); background:linear-gradient(160deg, var(--coffee-2), var(--coffee) 60%, #0e0b08);
    padding:var(--space-4); display:flex; align-items:center; gap:.6em; aspect-ratio:16/6;
    font-family:'IBM Plex Mono',monospace; font-size:.78rem; color:var(--cream-dim);
  }
  .db-page .live-dot{ width:8px; height:8px; border-radius:50%; background:var(--gold-bright); flex:none; animation:liveDotPulse 1.8s ease-in-out infinite; }
  @keyframes liveDotPulse{ 0%,100%{ opacity:1; box-shadow:0 0 0 0 rgba(226,192,127,.5); } 50%{ opacity:.6; box-shadow:0 0 0 6px rgba(226,192,127,0); } }
  @media (prefers-reduced-motion: reduce){ .db-page .live-dot{ animation:none; } }

  /* ---------- final CTA ---------- */
  .db-page .final-cta{ text-align:left; display:flex; flex-direction:column; align-items:flex-start; gap:var(--space-4); }
  .db-page .final-cta h2{ font-size:var(--fs-display); line-height:1; }
  .db-page .final-cta .em{ font-style:italic; color:var(--gold-bright); }

  /* ---------- contact ---------- */
  .db-page .contact-grid{ display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); }
  @media (max-width:900px){ .db-page .contact-grid{ grid-template-columns:1fr; } }
  .db-page .info-list li{ display:flex; gap:var(--space-3); padding-block:var(--space-3); border-top:1px solid var(--line-soft); align-items:flex-start; }
  .db-page .info-list li:last-child{ border-bottom:1px solid var(--line-soft); }
  .db-page .info-list svg{ color:var(--gold); margin-top:.2em; flex:none; }
  .db-page .info-list h4{ font-family:'Archivo',sans-serif; font-weight:700; font-size:.95rem; }
  .db-page .info-list p, .db-page .info-list a{ color:var(--cream-dim); font-size:.9rem; text-decoration:none; }
  .db-page .info-list a:hover{ color:var(--gold-bright); }
  .db-page .hours-table{ width:100%; border-collapse:collapse; font-size:.92rem; }
  .db-page .hours-table td{ padding-block:.5em; border-top:1px solid var(--line-soft); }
  .db-page .hours-table td:last-child{ text-align:right; font-family:'IBM Plex Mono',monospace; color:var(--cream-dim); }
  .db-page .map-ph{ aspect-ratio:16/10; margin-top:var(--space-4); }
  .db-page .social-row{ display:flex; gap:.8em; margin-top:var(--space-4); }
  .db-page .social-row a{ width:2.6em; height:2.6em; border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; text-decoration:none; transition:border-color .2s ease, color .2s ease; }
  .db-page .social-row a:hover{ border-color:var(--gold); color:var(--gold-bright); }

  /* ---------- footer ---------- */
  .db-page footer.site{ padding-block:var(--space-6); border-top:1px solid var(--line-soft); }
  .db-page .footer-grid{ display:grid; grid-template-columns:1.3fr 1fr 1fr 1fr; gap:var(--space-5); }
  @media (max-width:820px){ .db-page .footer-grid{ grid-template-columns:1fr 1fr; } }
  @media (max-width:520px){ .db-page .footer-grid{ grid-template-columns:1fr; } }
  .db-page .footer-grid h5{ font-family:'IBM Plex Mono',monospace; font-size:.68rem; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:var(--space-3); }
  .db-page .footer-grid ul{ display:flex; flex-direction:column; gap:.6em; }
  .db-page .footer-grid a{ text-decoration:none; color:var(--cream-dim); font-size:.88rem; }
  .db-page .footer-grid a:hover{ color:var(--gold-bright); }
  .db-page .footer-bottom{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-top:var(--space-6); padding-top:var(--space-4); border-top:1px solid var(--line-soft); font-size:.78rem; color:var(--cream-dim); }

  /* ---------- mobile sticky cta ---------- */
  .db-page .mobile-cta{
    position:fixed; left:0; right:0; bottom:0; z-index:70; display:none;
    padding:.7rem var(--gutter); padding-bottom:calc(.7rem + env(safe-area-inset-bottom,0px));
    background:rgba(11,10,8,.92); backdrop-filter:blur(14px); border-top:1px solid var(--line);
    align-items:center; gap:.6rem;
  }
  @media (max-width:720px){ .db-page .mobile-cta{ display:flex; } .db-page{ padding-bottom:5.2rem; } }
  .db-page .mobile-cta a.icon-btn{ width:2.8rem; height:2.8rem; flex:none; border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; text-decoration:none; }
  .db-page .mobile-cta .btn{ flex:1; }

  .db-page .sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
`;
