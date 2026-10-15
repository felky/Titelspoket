<script lang="ts">
    import lennarten from '../assets/lennarten.png';

    const lastVictory: number = Date.parse("2001-10-21");
    const lastDerby: number = Date.parse("2026-10-11");
    const dayMs = 1000 * 60 * 60 * 24;

    let now: number = Date.now();

    $: dateSinceWin = now - lastVictory;
    $: days = Math.round(dateSinceWin / dayMs);
    $: years = Math.round(days / 365);
    $: seconds = Math.round(dateSinceWin / 1000).toLocaleString('sv-SE');
    $: derbyDays = Math.max(0, Math.floor((now - lastDerby) / dayMs));

    setInterval(() => {
      now = Date.now();
    }, 1000);

    const ticker = Array(8).fill("HAMMARBY 0 - 1 DJURGÅR'N");
  </script>

  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      {#each [...ticker, ...ticker] as t}
        <span>{t}</span><span class="star">★</span>
      {/each}
    </div>
  </div>

  <main>
    <img src={lennarten} alt='Lennarts Tröstpris' class="lennarten animated infinite tada delay-2s">

    <h1 class="main-text">{ days }</h1>
    <p class="lead">...dagar sedan bajen vann Allsvenskan.</p>
    <p>Det är alltså <b>{ years } år</b> sedan.</p>
    <p>Eller hela <b class="secs">{ seconds }</b> sekunder sen. Illa!</p>

    <section class="derby">
      <p class="kicker">Derbyspöket? Det dog på Söder.</p>
      <div class="score">
        <span class="team">Bajen</span>
        <span class="goals">0</span>
        <span class="sep">-</span>
        <span class="goals win">1</span>
        <span class="team win">DIF</span>
      </div>
      <p>Hegland satte den. Bajen tittade på.</p>
      <p class="since"><b>{ derbyDays }</b> {derbyDays === 1 ? 'dag' : 'dagar'} sedan. Gör det fortfarande ont?</p>
    </section>
  </main>

  <style>
    .ticker {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      background: #f4c430;
      color: #0b1d3a;
      font-family: 'Anton', sans-serif;
      font-size: 1.1rem;
      letter-spacing: 0.08em;
      padding: 0.35rem 0;
      z-index: 10;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
    }

    .ticker-track {
      display: inline-flex;
      gap: 1.5rem;
      white-space: nowrap;
      animation: scroll 30s linear infinite;
    }

    .star {
      color: #c8102e;
    }

    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    main {
      padding-top: 3rem;
    }

    .lennarten {
      height: 13rem;
      filter: drop-shadow(0 0 30px rgba(244, 196, 48, 0.45));
    }

    p {
      font-family: 'Georgia', serif;
      font-size: 1.15rem;
      margin: 0.4rem 0;
      color: #e8f1ff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    b {
      color: #f4c430;
    }

    .lead {
      font-size: 1.35rem;
      font-style: italic;
    }

    .secs {
      font-variant-numeric: tabular-nums;
    }

    .main-text {
      user-select: none;
      margin: 0.5rem auto 0;
      font-family: 'Anton', sans-serif;
      font-size: clamp(6rem, 22vw, 11rem);
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: #2bb24c;
      -webkit-text-stroke: 3px #fff;
      text-shadow: 0 0 40px rgba(43, 178, 76, 0.6), 0 8px 0 #0b1d3a;
      animation: throb 2.4s ease-in-out infinite;
    }

    @keyframes throb {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    .derby {
      margin: 2.5rem auto 0;
      max-width: 30rem;
      padding: 1.5rem 1.25rem;
      background: linear-gradient(160deg, rgba(11, 29, 58, 0.92), rgba(0, 61, 130, 0.85));
      border: 3px solid #4fa3e0;
      border-radius: 14px;
      box-shadow: 0 0 0 4px #0b1d3a, 0 20px 60px rgba(0, 0, 0, 0.6);
      transform: rotate(-1.5deg);
    }

    .kicker {
      font-family: 'Anton', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 1.3rem;
      color: #f4c430;
    }

    .score {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      margin: 0.75rem 0;
      font-family: 'Anton', sans-serif;
      text-transform: uppercase;
    }

    .team {
      font-size: 1.6rem;
      color: #8fa3bf;
    }

    .team.win {
      color: #fff;
    }

    .goals {
      font-size: 4.5rem;
      line-height: 1;
      color: #8fa3bf;
    }

    .goals.win {
      color: #f4c430;
      text-shadow: 0 0 24px rgba(244, 196, 48, 0.7);
    }

    .sep {
      font-size: 3rem;
      color: #4fa3e0;
    }

    .since {
      margin-top: 0.75rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .ticker-track, .main-text { animation: none; }
    }
  </style>
