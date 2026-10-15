<script lang="ts">
    import { onMount } from 'svelte';
    import lennarten from '../assets/lennarten.png';
    import bluewall from '../assets/bluewall.jpg';
    import difVinner from '../assets/difVinner2.jpg';
    import bajenTorsk from '../assets/bajenTorsk.jpg';

    const lastVictory: number = Date.parse("2001-10-21");
    const lastDerby: number = Date.parse("2026-10-11");
    const dayMs = 1000 * 60 * 60 * 24;

    let now: number = Date.now();
    let shown: number | null = null;

    $: dateSinceWin = now - lastVictory;
    $: days = Math.round(dateSinceWin / dayMs);
    $: years = Math.round(days / 365);
    $: seconds = Math.round(dateSinceWin / 1000).toLocaleString('sv-SE');
    $: derbyDays = Math.max(0, Math.floor((now - lastDerby) / dayMs));
    $: counter = shown ?? days;

    onMount(() => {
      const timer = setInterval(() => { now = Date.now(); }, 1000);

      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const start = performance.now();
        const run = (t: number) => {
          const p = Math.min(1, (t - start) / 1600);
          shown = p < 1 ? Math.round(days * (1 - Math.pow(1 - p, 4))) : null;
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }

      return () => clearInterval(timer);
    });

    function reveal(node: HTMLElement) {
      document.documentElement.classList.add('js');
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('in');
          io.disconnect();
        }
      }, { threshold: 0.25 });
      io.observe(node);
      return { destroy: () => io.disconnect() };
    }
  </script>

  <main>
    <section class="hero" use:reveal>
      <img src={bluewall} alt="" class="wall">
      <div class="hero-grid">
        <div class="count">
          <h1 aria-label="{days} dagar">{ counter }</h1>
          <p class="lead">...dagar sedan bajen vann Allsvenskan.</p>
          <p>Det är alltså <b>{ years } år</b> sedan.</p>
          <p>Eller hela <b class="num">{ seconds }</b> sekunder sen. Illa!</p>
        </div>
        <img src={lennarten} alt="Lennarts Tröstpris" class="lennarten">
      </div>
    </section>

    <section class="derby" use:reveal>
      <div class="derby-text">
        <h2>Derbyspöket? Det dog i Södra Djurgårdsstaden.</h2>
        <p>Hegland satte den. Bajen tittade på.</p>
        <p><b class="num">{ derbyDays }</b> {derbyDays === 1 ? 'dag' : 'dagar'} sedan. Gör det fortfarande ont?</p>
      </div>
      <p class="score" aria-label="Hammarby 0, Djurgården 1">
        <span class="side lose"><span class="digit">0</span><span class="team">Bajen</span></span>
        <span class="dash">-</span>
        <span class="side"><span class="digit">1</span><span class="team">DIF</span></span>
      </p>
    </section>

    <section class="band" use:reveal>
      <figure class="big"><img src={difVinner} alt="Djurgården firar mål mot Hammarby" loading="lazy"></figure>
      <figure><img src={bajenTorsk} alt="Ledsen Hammarbyspelare" loading="lazy"></figure>
    </section>
  </main>

  <style>
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      align-items: flex-end;
      padding: var(--gutter);
      padding-bottom: clamp(2rem, 6vw, 5rem);
      overflow: hidden;
      isolation: isolate;
    }

    .wall {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -2;
      animation: drift 40s ease-in-out infinite alternate;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(5, 12, 26, 0.62);
      z-index: -1;
    }

    .hero-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: end;
      gap: var(--gutter);
    }

    h1 {
      font-family: var(--display);
      font-weight: 400;
      font-size: clamp(9rem, 38vw, 36rem);
      line-height: 0.82;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--bajen);
      margin-left: -0.04em;
      margin-bottom: clamp(1rem, 2vw, 1.75rem);
      user-select: none;
    }

    p {
      font-size: clamp(1.05rem, 1.4vw, 1.25rem);
      max-width: 34em;
    }

    .lead {
      font-size: clamp(1.4rem, 2.6vw, 2.25rem);
      line-height: 1.2;
      font-style: italic;
      margin-bottom: 0.75rem;
    }

    b {
      color: var(--accent);
    }

    .num {
      font-variant-numeric: tabular-nums;
    }

    .lennarten {
      height: clamp(10rem, 58svh, 36rem);
      width: auto;
      transform-origin: 50% 90%;
      animation: grumpy 1s var(--ease-out) 1.8s both;
    }

    .derby {
      background: var(--field);
      color: var(--field-ink);
      padding: clamp(5rem, 12vw, 10rem) var(--gutter);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: clamp(2rem, 6vw, 6rem);
    }

    h2 {
      font-family: var(--display);
      font-weight: 400;
      font-size: clamp(2.25rem, 4.6vw, 4.5rem);
      line-height: 1;
      letter-spacing: -0.01em;
      max-width: 13em;
      margin-bottom: 1.5rem;
    }

    .derby p:not(.score) + p {
      margin-top: 0.4rem;
    }

    .derby b {
      color: inherit;
    }

    .score {
      display: flex;
      align-items: flex-start;
      gap: 0.15em;
      font-family: var(--display);
      font-size: clamp(9rem, 22vw, 20rem);
      line-height: 0.85;
      max-width: none;
    }

    .side {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .lose {
      color: var(--field-muted);
    }

    .dash {
      color: var(--field-muted);
    }

    .team {
      color: var(--field-ink);
      font-family: var(--text);
      font-size: 1.15rem;
      line-height: 1;
      margin-top: 0.6rem;
    }

    .band {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 0;
      background: var(--bg);
    }

    figure {
      margin: 0;
      overflow: hidden;
      height: clamp(20rem, 42vw, 40rem);
    }

    figure img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(1.55) contrast(1.05);
      transition: transform 1.2s var(--ease-out);
    }

    :global(.js) .band figure img {
      transform: scale(1.12);
    }

    :global(.js) .band figure:nth-child(2) img {
      transition-delay: 120ms;
    }

    :global(.in) figure img {
      transform: scale(1) !important;
    }

    @keyframes drift {
      from { transform: scale(1.04) translate3d(0, 0, 0); }
      to { transform: scale(1.12) translate3d(-2%, -1%, 0); }
    }

    @keyframes grumpy {
      0% { transform: rotate(0); }
      20% { transform: rotate(-7deg); }
      40% { transform: rotate(6deg); }
      60% { transform: rotate(-4deg); }
      80% { transform: rotate(2deg); }
      100% { transform: rotate(0); }
    }

    /* entrances, only when script runs */
    :global(.js) .hero .count > *,
    :global(.js) .derby .derby-text > *,
    :global(.js) .derby .score > * {
      opacity: 0;
      transform: translate3d(0, 24px, 0);
      transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
    }

    :global(.js) .derby .score > .side:last-child {
      transform: translate3d(0, -40%, 0);
      transition-duration: 0.9s;
    }

    :global(.in) .count > *,
    :global(.in) .derby-text > *,
    :global(.in) .score > * {
      opacity: 1 !important;
      transform: none !important;
    }

    .count > :nth-child(2), .derby-text > :nth-child(2), .score > :nth-child(2) { transition-delay: 80ms; }
    .count > :nth-child(3), .derby-text > :nth-child(3) { transition-delay: 160ms; }
    .count > :nth-child(4) { transition-delay: 240ms; }
    .score > :nth-child(3) { transition-delay: 380ms; }

    @media (max-width: 720px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }

      .lennarten {
        grid-row: 1;
        height: 13rem;
      }

      h1 {
        font-size: 44vw;
      }

      .derby {
        grid-template-columns: 1fr;
      }

      .score {
        order: -1;
      }

      .band {
        grid-template-columns: 1fr;
      }

      figure {
        height: auto;
        aspect-ratio: 4 / 3;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .wall, .lennarten { animation: none; }
      :global(.js) .hero .count > *,
      :global(.js) .derby .derby-text > *,
      :global(.js) .derby .score > * {
        transform: none !important;
        transition: opacity 0.3s linear;
      }
    }
  </style>
