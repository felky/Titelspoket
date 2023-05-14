<script lang="ts">
  import lennarten from './assets/lennarten.png';
  import heyJude from './assets/heyDif.mp3';

  const lastVictory: number = Date.parse("2001-10-21");
  const lastDifVictory: number = Date.parse("2021-04-04")

  let dateSinceWin: number = Date.now() - lastVictory;
  let dateSinceDifWin: number = Date.now() - lastDifVictory;
  let daysDifWin: number = Math.round(dateSinceDifWin / (1000 * 60 * 60 * 24));
  let yearsDifWin: number = Math.round(daysDifWin / 365);
  let days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
  let years = Math.round(days / 365);
  let seconds = Math.round(dateSinceWin / 1000);


  setInterval(() => {
    dateSinceWin = Date.now() - lastVictory;
    dateSinceDifWin = Date.now() - lastDifVictory;
    daysDifWin = Math.round(dateSinceDifWin / (1000 * 60 * 60 * 24))
    days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
    years = Math.round(days / 365);
    yearsDifWin = Math.round(daysDifWin / 365);
    seconds = Math.round(dateSinceWin / 1000);
  }, 1000);

</script>

<main>
      <img src={lennarten} alt='Lennarts Tröstpris' class="lennarten animated infinite tada delay-2s">
      <h1 class="main-text">{ days } </h1>
      <p>...dagar sedan bajen vann Allsvenskan.</p>
      <p>Det är alltså <b>{ years } år</b> sedan.</p>
      <p>Eller hela <b>{seconds}</b> sekunder sen. Illa!</p>
</main>

<style>
    .lennarten {
      height: 16rem;
    }

    p {
      font-family: 'Georgia';
    }

    .main-text {
    user-select: none;
    width: 300px;
    margin: auto;
    margin-top: 10%;
    font-family: 'Anton';
    font-size: 130px;
    text-align: center;
    text-shadow: -1px -1px 0 rgb(255, 255, 255), 1px -1px 0 rgb(255, 255, 255), -1px 1px 0 rgb(255, 255, 255), 1px 1px 0 rgb(255, 255, 255);
    color: green;
}
</style>