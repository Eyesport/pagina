var menubar = new Menubar(document.getElementById('menubar1'));
menubar.init();

//beisbol
function focusBeisbol(){
    var sonido = new Audio('../assets/sonidos/Beisbol.mp3');
    sonido.play();
    $(".pelota_beisbol").show();
}

function focusOutBeisbol(){
    $(".pelota_beisbol").hide();
}
//submenu
function focus(){
    var sonido = new Audio('../assets/sonidos/Beisbol.mp3');
    sonido.play();
    $(".pelota_").show();
}

function focusOut(){
    $(".pelota_").hide();
}
//copiar
//nacional
function focusNacional(){
    var sonido = new Audio('../pages/beisbol/audiobeisbol/beisbolnacional.mp3');
    sonido.play();
    $(".pelota_nacional").show();
}

function focusOutNacional(){
    $(".pelota_nacional").hide();
}
//internacional
function focusInternacional(){
    var sonido = new Audio('../pages/beisbol/audiobeisbol/beisbolinternacional.mp3');
    sonido.play();
    $(".pelota_internacional").show();
}

function focusOutInternacional(){
    $(".pelota_internacional").hide();
}
//mlb
function focusMlb(){
    var sonido = new Audio('../pages/beisbol/audiobeisbol/mlb.mp3');
    sonido.play();
    $(".pelota_MLB").show();
}

function focusOutMlb(){
    $(".pelota_MLB").hide();
}
//serie del caribe
function focusSerie(){
    var sonido = new Audio('../pages/beisbol/audiobeisbol/serie.mp3');
    sonido.play();
    $(".pelota_serie").show();
}

function focusOutSerie(){
    $(".pelota_serie").hide();
}
// futbol
function focusFutbol(){
    var sonido = new Audio('../assets/sonidos/Futbol.mp3');
    sonido.play();
    $(".pelota_futbol").show();
}

function focusOutFutbol(){
    $(".pelota_futbol").hide();
}
//nacional
function focusFnacional(){
    var sonido = new Audio('../pages/futbol/audiofutbol/anacional.mp3');
    sonido.play();
    $(".pelota_fnacional").show();
}

function focusOutFnacional(){
    $(".pelota_fnacional").hide();
}

function focusfinternacional(){
    var sonido = new Audio('../pages/futbol/audiofutbol/futbol-internacional.mp3');
    sonido.play();
    $(".pelota_finternacional").show();
}

function focusOutfinternacional(){
    $(".pelota_finternacional").hide();
}
//champions
function focuschampions(){
    var sonido = new Audio('../pages/futbol/audiofutbol/achampions.mp3');
    sonido.play();
    $(".pelota_champions").show();
}

function focusOutchampions(){
    $(".pelota_champions").hide();
}
//la liga
function focusespanola(){
    var sonido = new Audio('../pages/futbol/audiofutbol/aespanol.mp3');
    sonido.play();
    $(".pelota_espanola").show();
}

function focusOutespanola(){
    $(".pelota_espanola").hide();
}
//bundesliga
function focusalemana(){
    var sonido = new Audio('../pages/futbol/audiofutbol/aaleman.mp3');
    sonido.play();
    $(".pelota_alemana").show();
}

function focusOutalemana(){
    $(".pelota_alemana").hide();
}
//serie a
function focusitaliana(){
    var sonido = new Audio('../pages/futbol/audiofutbol/aitalia.mp3');
    sonido.play();
    $(".pelota_italiana").show();
}

function focusOutitaliana(){
    $(".pelota_italiana").hide();
}
//premier
function focuspremier(){
    var sonido = new Audio('../pages/futbol/audiofutbol/aingles.mp3');
    sonido.play();
    $(".pelota_premier").show();
}

function focusOutpremier(){
    $(".pelota_premier").hide();
}

//basket
function focusBasket(){
    var sonido = new Audio('../assets/sonidos/Baloncesto.mp3');
    sonido.play();
    $(".pelota_baloncesto").show();
}

function focusOutBasket(){
    $(".pelota_baloncesto").hide();
}
//basket nacional
function focusbnacional(){
    var sonido = new Audio('../pages/basquet/audiobasquet/baloncestonacional.mp3');
    sonido.play();
    $(".pelota_baloncestonacional").show();
}

function focusOutbnacional(){
    $(".pelota_baloncestonacional").hide();
}
// internacional
function focusnba(){
    var sonido = new Audio('../pages/basquet/audiobasquet/nba.mp3');
    sonido.play();
    $(".pelota_nba").show();
}

function focusOutnba(){
    $(".pelota_nba").hide();
}

function focusInicio(){
    var sonido = new Audio('../assets/sonidos/inicio.mp3');
    sonido.play();
}
document.addEventListener("keydown", function(event) {
    
    if (event.which==74) {
        $(inicio).focus();
    }
    if (event.which==70) {
        $(f1).focus();
    } 
  })
