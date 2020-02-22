window.onload = function() {
    var context = new AudioContext();
}


var date = new Date();
var dateSinceVictory = new Date("2001-10-21");
var diffHby = date.valueOf() - dateSinceVictory.valueOf();
var millisecondInDay = 86400000;

function CalculateDateInDays(milliseconds){
    var value = Math.round(milliseconds / millisecondInDay);
    return value
}

function RefreshValueOnPage(){
    var hbyText = document.getElementById("mainText");
    hbyText.textContent = CalculateDateInDays(diffHby);
}



RefreshValueOnPage();
