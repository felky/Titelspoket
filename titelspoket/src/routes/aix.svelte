<script lang="ts">
    import mange from '../assets/mjukglass.png';
  
    const lastVictory: number = Date.parse("2023-05-28");
  
    let dateSinceWin: number = Date.now() - lastVictory;
    let days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
    let seconds = Math.round(dateSinceWin / 1000);
  
  
    setInterval(() => {
      dateSinceWin = Date.now() - lastVictory;
      days = Math.round(dateSinceWin / (1000 * 60 * 60 * 24));
      seconds = Math.round(dateSinceWin / 1000);
    }, 1000);
  
  </script>
  
  <main>
        <img src={mange} alt='Mange Mjukglass' class="mange animated infinite tada delay-2s">
        <h1 class="main-text">{ days } </h1>
        <p>...dagar sedan ajx vann över Djurgårdens IF.</p>
        <p>Eller hela <b>{seconds}</b> sekunder sen.</p>
        <p>Superettan väntar!</p>
  </main>
  
  <style>
      .mange {
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
      text-shadow: -1px -1px 0 rgb(68, 134, 191), 1px -1px 0 rgb(68, 134, 191), -1px 1px 0 rgb(68, 134, 191), 1px 1px 0 rgb(68, 134, 191);
      color: #a0ddf2;
  }
  </style>