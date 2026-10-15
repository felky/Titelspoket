<script lang="ts">
  import lennarten from '../assets/lennarten.png';

  let state: 'standing' | 'falling' | 'broken' = 'standing';

  const shards = [
    { clip: '0 0, 55% 0, 45% 30%, 0 25%', x: -70, y: 68, r: -80 },
    { clip: '55% 0, 100% 0, 100% 35%, 45% 30%', x: 80, y: 62, r: 115 },
    { clip: '0 25%, 45% 30%, 35% 60%, 0 55%', x: -40, y: 42, r: 38 },
    { clip: '45% 30%, 100% 35%, 100% 60%, 35% 60%', x: 50, y: 40, r: -52 },
    { clip: '0 55%, 35% 60%, 50% 100%, 0 100%', x: -16, y: 3, r: -9 },
    { clip: '35% 60%, 100% 60%, 100% 100%, 50% 100%', x: 22, y: 3, r: 13 },
  ];

  // spindelnät i ett hörn: ekrar ut från hörnet och hängande trådar mellan dem
  function web(size: number, spokes = 7, rings = 6) {
    const angles = Array.from({ length: spokes }, (_, i) => (Math.PI / 2) * (i / (spokes - 1)));
    const lines = angles.map((a) => `M0 0 L${Math.cos(a) * size} ${Math.sin(a) * size}`);
    for (let r = 1; r <= rings; r++) {
      const rad = (size / (rings + 0.6)) * r;
      let d = '';
      angles.forEach((a, i) => {
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) {
          d += `M${x} ${y}`;
        } else {
          const mid = (angles[i - 1] + a) / 2;
          const sag = rad * 0.82;
          d += ` Q${Math.cos(mid) * sag} ${Math.sin(mid) * sag} ${x} ${y}`;
        }
      });
      lines.push(d);
    }
    return lines.join(' ');
  }

  const bigWeb = web(260);

  function knock() {
    if (state !== 'standing') return;
    state = 'falling';
    setTimeout(() => {
      state = 'broken';
      navigator.vibrate?.([60, 40, 30]);
    }, 820);
  }
</script>

<main class:shake={state === 'broken'}>
  <a class="back" href="#/">Tillbaka</a>

  <svg class="web tl" viewBox="0 0 260 260" aria-hidden="true"><path d={bigWeb} /></svg>
  <svg class="web tr" viewBox="0 0 260 260" aria-hidden="true"><path d={bigWeb} /></svg>

  <div class="spider" aria-hidden="true">
    <svg viewBox="-20 -14 40 34">
      <g class="legs">
        <path d="M-3 0 Q-10 -9 -17 -4" />
        <path d="M-3 2 Q-12 -3 -19 3" />
        <path d="M-3 4 Q-12 4 -18 11" />
        <path d="M-3 5 Q-9 10 -13 17" />
        <path d="M3 0 Q10 -9 17 -4" />
        <path d="M3 2 Q12 -3 19 3" />
        <path d="M3 4 Q12 4 18 11" />
        <path d="M3 5 Q9 10 13 17" />
      </g>
      <circle cx="0" cy="-4" r="3" />
      <ellipse cx="0" cy="5" rx="5" ry="6.5" />
    </svg>
  </div>

  <div class="floor"></div>

  <div class="stage">
    <div class="pedestal"></div>

    <button
      class="trophy {state}"
      on:click={knock}
      aria-label="Lennarts Tröstpris. Knuffa till den."
      disabled={state !== 'standing'}
    >
      {#if state === 'broken'}
        {#each shards as s, i}
          <img
            src={lennarten}
            alt=""
            class="shard"
            style="clip-path: polygon({s.clip}); --x: {s.x}%; --y: {s.y}%; --r: {s.r}deg; animation-delay: {i * 15}ms;"
          >
        {/each}
        <span class="dust" aria-hidden="true"></span>
      {:else}
        <img src={lennarten} alt="" class="whole">
      {/if}
    </button>
  </div>
</main>

<style>
  main {
    position: relative;
    height: 100svh;
    overflow: hidden;
    background: #060708;
    color: var(--ink);
  }

  /* lampan i taket */
  main::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 34% 62% at 50% 58%, rgba(255, 236, 190, 0.16), transparent 70%);
    pointer-events: none;
    animation: flicker 7s steps(1) infinite;
  }

  .back {
    position: absolute;
    top: var(--gutter);
    left: var(--gutter);
    z-index: 5;
    font-family: var(--display);
    font-size: clamp(1.1rem, 1.6vw, 1.4rem);
    color: var(--muted);
    text-decoration: underline;
    text-decoration-thickness: 0.12em;
    text-underline-offset: 0.2em;
  }

  .back:hover,
  .back:focus-visible {
    color: var(--ink);
  }

  .web {
    position: absolute;
    top: 0;
    width: clamp(10rem, 24vw, 20rem);
    height: auto;
    fill: none;
    stroke: rgba(220, 225, 235, 0.22);
    stroke-width: 1.2;
    pointer-events: none;
  }

  .web.tl {
    left: 0;
  }

  .web.tr {
    right: 0;
    transform: scaleX(-1);
  }

  .spider {
    position: absolute;
    top: 0;
    left: 68%;
    width: 1px;
    height: 34svh;
    background: rgba(220, 225, 235, 0.28);
    transform-origin: top center;
    animation: dangle 6s ease-in-out infinite;
  }

  .spider svg {
    position: absolute;
    top: 100%;
    left: -1.75rem;
    width: 3.5rem;
    height: auto;
    translate: 0 -0.4rem;
    fill: #1c1f24;
    stroke: rgba(220, 225, 235, 0.35);
    stroke-width: 0.8;
  }

  .spider .legs {
    fill: none;
    stroke: rgba(200, 205, 215, 0.55);
    stroke-width: 1.4;
    stroke-linecap: round;
    transform-origin: 0 2px;
    animation: wiggle 1.4s ease-in-out infinite;
  }

  .floor {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22svh;
    background: #0d0e10;
  }

  .stage {
    position: absolute;
    left: 50%;
    bottom: 12svh;
    translate: -50% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pedestal {
    order: 2;
    width: clamp(8rem, 16svh, 12rem);
    height: 28svh;
    background: #1a1c20;
  }

  .trophy {
    order: 1;
    position: relative;
    z-index: 2;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    height: min(34svh, 56vw);
    aspect-ratio: 656 / 967;
    margin-bottom: -2.4svh;
    transform-origin: 50% 100%;
  }

  .trophy:disabled {
    cursor: default;
  }

  .trophy:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 6px;
  }

  .trophy img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .trophy.standing:hover .whole {
    animation: wobble 0.5s ease-in-out;
  }

  .trophy.falling,
  .trophy.broken {
    animation: fall 0.82s cubic-bezier(0.55, 0, 0.9, 0.5) forwards;
  }

  .shard {
    animation: scatter 0.7s cubic-bezier(0.2, 0.9, 0.3, 1) both;
  }

  .dust {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 140%;
    height: 30%;
    translate: -50% 40%;
    border-radius: 50%;
    background: rgba(200, 200, 200, 0.18);
    animation: dust 0.9s ease-out both;
  }

  .shake {
    animation: shake 0.35s linear;
  }

  @keyframes wobble {
    0%, 100% { transform: rotate(0); }
    30% { transform: rotate(-4deg); }
    70% { transform: rotate(3deg); }
  }

  @keyframes fall {
    0% { transform: none; }
    25% { transform: rotate(-9deg); }
    45% { transform: translateY(-4svh) rotate(6deg); }
    100% { transform: translateY(30svh) rotate(14deg); }
  }

  @keyframes scatter {
    0% { transform: none; }
    100% { transform: translate(calc(var(--x) * var(--spread, 1)), var(--y)) rotate(var(--r)); }
  }

  @keyframes dust {
    0% { opacity: 1; transform: scale(0.3); }
    100% { opacity: 0; transform: scale(1.4); }
  }

  @keyframes shake {
    0%, 100% { transform: none; }
    20% { transform: translate(-8px, 5px); }
    40% { transform: translate(7px, -6px); }
    60% { transform: translate(-5px, -3px); }
    80% { transform: translate(3px, 3px); }
  }

  @keyframes dangle {
    0%, 100% { transform: scaleY(0.82) rotate(1deg); }
    50% { transform: scaleY(1) rotate(-1.5deg); }
  }

  @keyframes wiggle {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.9); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    61% { opacity: 0.55; }
    62% { opacity: 1; }
    64% { opacity: 0.4; }
    65% { opacity: 1; }
  }

  @media (max-width: 600px) {
    .trophy {
      --spread: 0.55;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    main::before, .spider, .spider .legs { animation: none; }
    .trophy.falling, .trophy.broken { animation-duration: 0.01s; }
    .shard, .shake, .dust { animation-duration: 0.01s; }
  }
</style>
