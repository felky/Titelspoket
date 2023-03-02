<script lang="ts">
  import lennarten from './assets/lennarten.png';
  import heyJude from './assets/heyDif.mp3';

  const lastVictory: number = Date.parse("2001-10-21");

 
  let days: number = 0;
  let years: number = 0;
  let seconds: number = 0;

  setInterval(() => {
    const dateSinceWin: number = Date.now() - lastVictory;
    days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
    years = Math.round(days / 365);
    seconds = Math.round(dateSinceWin / 1000);
  }, 1000);

</script>

<main>
      <img src={lennarten} alt='Lennarts Tröstpris' class="lennarten animated infinite tada delay-2s">
      <h1 class="main-text">{ days } </h1>
      <p>...dagar sedan bajen vann Allsvenskan.</p>
      <p>Det är alltså <b>{ years } år</b> sedan.</p>
      <p>Eller hela <b>{seconds}</b> sekunder sen. Illa!</p>

      <audio id="player" autoplay controls loop style="display: block;"><source src="{ heyJude }" type="audio/mp3"></audio>
</main>

<style>
    .lennarten {
      height: 20rem;
    }

    .main-text {
    user-select: none;
    width: 300px;
    margin: auto;
    margin-top: 23%;
    font-family: 'Anton';
    font-size: 130px;
    text-align: center;
    text-shadow: -1px -1px 0 rgb(255, 255, 255), 1px -1px 0 rgb(255, 255, 255), -1px 1px 0 rgb(255, 255, 255), 1px 1px 0 rgb(255, 255, 255);
    color: green;
}
</style>