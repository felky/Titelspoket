<script lang="ts">
    import { onMount } from 'svelte';
    import lennarten from '../assets/lennarten.png';
    import bakgrund from '../assets/derbyvinst.jpg';

    const lastVictory: number = Date.parse("2001-10-21");
    const lastDerby: number = Date.parse("2026-10-11");
    const dayMs = 1000 * 60 * 60 * 24;

    let now: number = Date.now();
    let shown: number | null = null;
    let ready = false;

    $: dateSinceWin = now - lastVictory;
    $: days = Math.round(dateSinceWin / dayMs);
    $: years = Math.round(days / 365);
    $: seconds = Math.round(dateSinceWin / 1000).toLocaleString('sv-SE');
    $: derbyDays = Math.max(0, Math.floor((now - lastDerby) / dayMs));
    $: counter = shown ?? days;

    const sv = (n: number) => n.toLocaleString('sv-SE');
    const dec = (n: number) => n.toLocaleString('sv-SE', { maximumFractionDigits: 1 });

    // månen 27,32 d, Mars 687 d, Jupiter 4 333 d, ISS ca 92,9 min, naglar ca 3,5 mm/mån,
    // hår ca 1,25 cm/mån, Atlanten ca 2,5 cm/år, vilopuls ca 70 slag/min
    $: facts = [
      `Under tiden har månen hunnit runt jorden ${Math.floor(days / 27.32)} gånger.`,
      `Under tiden har Mars hunnit runt solen ${Math.floor(days / 687)} varv.`,
      `Under tiden har Jupiter hunnit runt solen ${Math.floor(days / 4333)} varv.`,
      `Under tiden har ISS hunnit runt jorden ${sv(Math.floor(days * 1440 / 92.9))} gånger.`,
      `Den som föddes när bajen vann guld fyller ${new Date(now).getFullYear() - 2001} år i år.`,
      `Hade du aldrig klippt naglarna hade de varit ${dec(days / 30.44 * 0.0035)} meter långa nu.`,
      `Hade du aldrig klippt dig hade håret varit ${dec(days / 30.44 * 0.0125)} meter långt nu.`,
      `Under tiden har Atlanten blivit ${Math.round(days / 365.25 * 2.5)} cm bredare.`,
      `Under tiden har ditt hjärta slagit ungefär ${sv(Math.round(days * 1440 * 70 / 1e6))} miljoner slag.`,
      `Det hade räckt till ${Math.floor(days / 280)} graviditeter i rad.`,
      `Det hade räckt till ${Math.floor(days / 650)} elefantgraviditeter i rad.`,
      `Under tiden har Djurgården vunnit Allsvenskan 4 gånger.`,
    ];
    const pick = Math.random();

    let heat = 0;
    let blam = false;
    let sparks: { x: number; y: number; r: number; c: string; d: number }[] = [];
    const colors = ['#f4c430', '#8ecdf2', '#ffffff', '#c8102e', '#08162b'];

    onMount(() => {
      const timer = setInterval(() => { now = Date.now(); }, 1000);
      requestAnimationFrame(() => { ready = true; });

      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const duration = 2400;
        const start = performance.now();
        const run = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          heat = p * p;
          shown = p < 1 ? Math.round(days * eased) : null;
          if (p < 1) {
            requestAnimationFrame(run);
          } else {
            heat = 0;
            boom();
          }
        };
        requestAnimationFrame(run);
      } else {
        shown = null;
      }

      return () => clearInterval(timer);
    });

    function boom() {
      sparks = Array.from({ length: 48 }, () => {
        const a = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 380;
        return {
          x: Math.cos(a) * dist,
          y: Math.sin(a) * dist - 80,
          r: Math.random() * 720 - 360,
          c: colors[Math.floor(Math.random() * colors.length)],
          d: Math.random() * 120,
        };
      });
      blam = true;
      navigator.vibrate?.([40, 30, 80]);
      setTimeout(() => { sparks = []; }, 1600);
    }

    $: jitter = heat > 0 ? {
      x: (Math.random() - 0.5) * 14 * heat,
      y: (Math.random() - 0.5) * 10 * heat,
      r: (Math.random() - 0.5) * 3 * heat,
    } : { x: 0, y: 0, r: 0 };
  </script>

  <main class:ready class:blam>
    <div class="flash" aria-hidden="true"></div>
    <img src={bakgrund} alt="" class="wall">
    <img src={lennarten} alt="Lennarts Tröstpris" class="lennarten">

    <div class="count">
      <div class="number">
        <h1
          aria-label="{days} dagar"
          style="--heat: {heat}; transform: translate({jitter.x}px, {jitter.y}px) rotate({jitter.r}deg) scale({1 + heat * 0.12});"
        >{ counter }</h1>
        {#each sparks as s}
          <span class="spark" aria-hidden="true" style="--x: {s.x}px; --y: {s.y}px; --r: {s.r}deg; background: {s.c}; animation-delay: {s.d}ms;"></span>
        {/each}
      </div>
      <p class="lead">...dagar sedan bajen vann Allsvenskan.</p>
      <p>Det är alltså <b>{ years } år</b> sedan.</p>
      <p>Eller hela <b class="num">{ seconds }</b> sekunder sen. Illa!</p>
      <p class="fact">{ facts[Math.floor(pick * facts.length)] }</p>
    </div>

    <article class="clipping">
      <h2>Senaste nytt från Södra Djurgårdsstaden</h2>
      <p class="score" aria-label="Hammarby 0, Djurgården 1">
        <span class="side lose"><span class="digit">0</span><span class="team">bajen</span></span>
        <span class="dash">-</span>
        <span class="side"><span class="digit">1</span><span class="team">DIF</span></span>
      </p>
      <p><b class="num">{ derbyDays }</b> {derbyDays === 1 ? 'dag' : 'dagar'} sedan. Gör det fortfarande ont?</p>
    </article>
  </main>

  <style>
    main {
      position: relative;
      height: 100svh;
      overflow: hidden;
      isolation: isolate;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: var(--gutter);
      padding: var(--gutter);
      padding-bottom: clamp(1.5rem, 5svh, 4rem);
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

    main::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(5, 12, 26, 0.4);
      z-index: -1;
    }

    .lennarten {
      position: absolute;
      top: var(--gutter);
      left: var(--gutter);
      height: clamp(4.5rem, 12svh, 7rem);
      width: auto;
      transform-origin: 50% 90%;
      animation: grumpy 1s var(--ease-out) 1.8s both;
    }

    h1 {
      font-family: var(--display);
      font-weight: 400;
      font-size: min(28vw, 52svh);
      line-height: 0.82;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--bajen);
      margin-left: -0.04em;
      margin-bottom: clamp(0.75rem, 2svh, 1.5rem);
      user-select: none;
    }

    p {
      font-size: clamp(1rem, 1.3vw, 1.2rem);
      max-width: 34em;
    }

    .lead {
      font-size: clamp(1.3rem, 2.4vw, 2rem);
      line-height: 1.2;
      font-style: italic;
      margin-bottom: 0.5rem;
    }

    b {
      color: var(--accent);
    }

    .fact {
      margin-top: 0.75rem;
      color: var(--muted);
      font-style: italic;
      min-height: 1.5em;
    }

    .num {
      font-variant-numeric: tabular-nums;
    }

    /* tidningsurklipp i djurgårdsfärger */
    .clipping {
      position: relative;
      width: min(26rem, 30vw);
      align-self: center;
      background: var(--field);
      color: var(--field-ink);
      padding: 2.25rem 1.75rem 2rem;
      transform: rotate(2.5deg);
      clip-path: polygon(
        0% 1%, 6% 0%, 12% 1.5%, 19% 0.2%, 27% 1.2%, 35% 0%, 44% 1.4%, 52% 0.3%, 61% 1.1%, 70% 0%, 78% 1.5%, 87% 0.4%, 94% 1.2%, 100% 0%,
        99.2% 20%, 100% 41%, 99.4% 63%, 100% 84%,
        100% 99%, 93% 100%, 85% 98.6%, 77% 99.8%, 68% 98.8%, 59% 100%, 50% 98.5%, 41% 99.7%, 32% 98.7%, 23% 100%, 14% 98.8%, 6% 99.9%, 0% 98.7%,
        0.7% 78%, 0% 56%, 0.6% 33%, 0% 12%
      );
    }

    .clipping::after {
      content: '';
      position: absolute;
      left: 1.75rem;
      right: 1.75rem;
      top: 1rem;
      height: 0.4rem;
      background: var(--accent);
    }

    h2 {
      font-family: var(--display);
      font-weight: 400;
      font-size: clamp(1.75rem, 2.6vw, 2.5rem);
      line-height: 1;
      letter-spacing: -0.01em;
      margin-bottom: 1rem;
    }

    .score {
      display: flex;
      align-items: flex-start;
      gap: 0.2em;
      font-family: var(--display);
      font-size: clamp(5rem, 14svh, 9rem);
      line-height: 0.85;
      margin-bottom: 1rem;
    }

    .side {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .lose, .dash {
      color: var(--field-muted);
    }

    .team {
      color: var(--field-ink);
      font-family: var(--text);
      font-size: 1rem;
      line-height: 1;
      margin-top: 0.5rem;
    }

    .clipping b {
      color: inherit;
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

    @keyframes slap {
      from { opacity: 0; transform: translate3d(0, -30%, 0) rotate(-8deg) scale(1.15); }
      to { opacity: 1; transform: rotate(2.5deg); }
    }

    .count > * {
      transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
    }

    main:not(.ready) .count > * {
      opacity: 0;
      transform: translate3d(0, 24px, 0);
    }

    .count > :nth-child(2) { transition-delay: 80ms; }
    .count > :nth-child(3) { transition-delay: 160ms; }

    .ready .clipping {
      animation: slap 0.6s var(--ease-out) 3s both;
    }

    .number {
      position: relative;
      width: max-content;
    }

    h1 {
      transform-origin: 30% 70%;
      will-change: transform;
      color: color-mix(in srgb, var(--bajen), #7dff8a calc(var(--heat, 0) * 70%));
    }

    .blam h1 {
      animation: punch 0.7s cubic-bezier(0.2, 1.6, 0.4, 1) both;
    }

    .blam {
      animation: quake 0.45s linear both;
    }

    .flash {
      position: absolute;
      inset: 0;
      background: #fff;
      opacity: 0;
      pointer-events: none;
      z-index: 5;
    }

    .blam .flash {
      animation: flash 0.5s ease-out both;
    }

    .spark {
      position: absolute;
      left: 45%;
      top: 45%;
      width: 0.9rem;
      height: 0.55rem;
      pointer-events: none;
      animation: spark 1.3s cubic-bezier(0.15, 0.8, 0.3, 1) both;
    }

    @keyframes punch {
      0% { transform: scale(1.35); }
      100% { transform: scale(1); }
    }

    @keyframes quake {
      0%, 100% { transform: translate(0, 0); }
      15% { transform: translate(-12px, 6px); }
      30% { transform: translate(10px, -8px); }
      45% { transform: translate(-8px, -4px); }
      60% { transform: translate(6px, 6px); }
      75% { transform: translate(-3px, 2px); }
    }

    @keyframes flash {
      0% { opacity: 0.55; }
      100% { opacity: 0; }
    }

    @keyframes spark {
      0% { transform: translate(0, 0) rotate(0) scale(1.4); opacity: 1; }
      70% { opacity: 1; }
      100% { transform: translate(var(--x), calc(var(--y) + 160px)) rotate(var(--r)) scale(0.6); opacity: 0; }
    }

    @media (max-width: 720px) {
      main {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        align-content: end;
        gap: 1.25rem;
      }

      h1 {
        font-size: min(44vw, 30svh);
      }

      p {
        font-size: 0.95rem;
      }

      .lead {
        font-size: 1.15rem;
      }

      .clipping {
        width: auto;
        padding: 1.75rem 1.25rem 1.25rem;
        transform: rotate(-1.5deg);
        display: grid;
        grid-template-columns: 1fr auto;
        column-gap: 1rem;
        align-items: center;
      }

      .clipping::after {
        left: 1.25rem;
        right: 1.25rem;
        top: 0.75rem;
      }

      h2 {
        font-size: 1.5rem;
        grid-column: 1 / -1;
        margin-bottom: 0.5rem;
      }

      .score {
        font-size: 4.5rem;
        margin-bottom: 0;
        order: 2;
      }

      .clipping p:last-child {
        font-size: 0.95rem;
      }

      @keyframes slap {
        from { opacity: 0; transform: translate3d(0, -30%, 0) rotate(-8deg) scale(1.1); }
        to { opacity: 1; transform: rotate(-1.5deg); }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .wall, .lennarten, .ready .clipping { animation: none; }
      .count > * { transition: none; }
      main:not(.ready) .count > * { opacity: 1; transform: none; }
    }
  </style>
