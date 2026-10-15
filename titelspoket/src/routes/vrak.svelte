<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import lennarten from '../assets/lennarten.png';
    import bluewall from '../assets/bluewall.jpg';

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

    // omloppstider: månen 27,32 dagar, Mars 687 dagar, ISS ca 92,9 minuter
    $: facts = [
      `Under tiden har månen hunnit runt jorden ${Math.floor(days / 27.32)} gånger.`,
      `Under tiden har Mars hunnit runt solen ${Math.floor(days / 687)} varv.`,
      `Under tiden har ISS hunnit runt jorden ${Math.floor(days * 1440 / 92.9).toLocaleString('sv-SE')} gånger.`,
      `Den som föddes när bajen vann guld fyller ${new Date(now).getFullYear() - 2001} år i år.`,
    ];
    let fact = 0;

    onMount(() => {
      const timer = setInterval(() => { now = Date.now(); }, 1000);
      const factTimer = setInterval(() => { fact = (fact + 1) % facts.length; }, 5000);
      requestAnimationFrame(() => { ready = true; });

      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const start = performance.now();
        const run = (t: number) => {
          const p = Math.min(1, (t - start) / 1600);
          shown = p < 1 ? Math.round(days * (1 - Math.pow(1 - p, 4))) : null;
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }

      return () => { clearInterval(timer); clearInterval(factTimer); };
    });
  </script>

  <main class:ready>
    <img src={bluewall} alt="" class="wall">
    <img src={lennarten} alt="Lennarts Tröstpris" class="lennarten">

    <div class="count">
      <h1 aria-label="{days} dagar">{ counter }</h1>
      <p class="lead">...dagar sedan bajen vann Allsvenskan.</p>
      <p>Det är alltså <b>{ years } år</b> sedan.</p>
      <p>Eller hela <b class="num">{ seconds }</b> sekunder sen. Illa!</p>
      {#key fact}
        <p class="fact" in:fade={{ duration: 400 }}>{ facts[fact] }</p>
      {/key}
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
      background: rgba(5, 12, 26, 0.62);
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
      animation: slap 0.6s var(--ease-out) 1.2s both;
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
