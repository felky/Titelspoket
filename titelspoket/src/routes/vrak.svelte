<script lang="ts">
    import lennarten from '../assets/lennarten.png';
  
    const lastVictory: number = Date.parse("2001-10-21");
  
    let dateSinceWin: number = Date.now() - lastVictory;
    let days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
    let years = Math.round(days / 365);
    let seconds = Math.round(dateSinceWin / 1000);
  
  
    setInterval(() => {
      dateSinceWin = Date.now() - lastVictory;
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