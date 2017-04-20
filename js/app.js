'use strict';
(function() {

    var audio = document.getElementById('audio');
    var volume = 50; //Sur 100

    /************************************************
     * RECUPERATION DONNEES MUSIQUE
     * **********************************************/

    /***** Récupération metatags *****/

    var jsmediatags = window.jsmediatags;
    var getMetatags = function (file) {
        jsmediatags.read(file, {
            onSuccess: function(tag) {

                console.log(tag);

                var tags = tag.tags;
                console.log("Titre : " + tags.title + " Artiste : " + tags.artist + " Album : " + tags.album);

                //Titre
                if (tags.title) {
                    document.getElementById('title').innerText = tags.title;
                }
                else {
                    document.getElementById('title').innerText = "Titre inconnu";
                }

                //Artist
                if (tags.artist) {
                    document.getElementById('artist').innerText = tags.artist;
                }
                else {
                    document.getElementById('artist').innerText = "Artiste inconnu";
                }

                //Album
                if (tags.album) {
                    document.getElementById('album').innerText = tags.album;
                }
                else {
                    document.getElementById('album').style.display = 'none';
                }

                //Year
                if (tags.year) {
                    document.getElementById('year').innerText = tags.year;
                }
                else {
                    document.getElementById('year').style.display = 'none';
                }

                //Image
                var image = tags.picture;
                if (image) {
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    var base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                    document.getElementById('cover').setAttribute('src',base64);
                } else {
                    document.getElementById('cover').style.display = "none";
                }
            },

            onError: function(error) {
                console.log(error);
            }

        });
    };


    /***** Récupération temps *****/

    audio.addEventListener('timeupdate', function () {

        /*** Temps écoulé ***/

        var currentMinutes = Math.floor(audio.currentTime / 60 ).toString();

        var currentSeconds = Math.floor(audio.currentTime % 60);

        //Toujours 2 chiffres
        currentSeconds = currentSeconds < 10 ? '0' + currentSeconds.toString() : currentSeconds.toString();

        document.getElementById('current-time').innerHTML = currentMinutes + ":" + currentSeconds;

        /*** Temps total ***/

        var durationMinutes = Math.floor(audio.duration / 60 ).toString();

        var durationSeconds = Math.floor(audio.duration % 60);

        //Toujours 2 chiffres
        durationSeconds = durationSeconds < 10 ? '0' + durationSeconds.toString() : durationSeconds.toString();

        //Empeche affichage NaN pendant chargement
        if (isNaN(durationMinutes) && isNaN(durationSeconds)) {
            document.getElementById('duration').innerText = "0:00";
        }
        else {

            document.getElementById('duration').innerText = durationMinutes + ":" + durationSeconds;
        }

    });


    //Création de l'url pour la source audio

    var getURL = function (file) {
        var url = window.URL.createObjectURL(file);
        audio.setAttribute("src", url);
    };




    /*************************************************
     * CHANGEMENT DE COULEUR
     * ***********************************************/

    var cover = document.getElementById("cover");

    //Dès que l'image charge
    cover.addEventListener("load", function () {

        this.style.display = 'block';

        document.getElementById('show-help').style.display = "none";
        document.getElementById('show-container').style.display = "flex";




        /***** Récupération palette couleur avec ColorThief *****/

        var colorThief = new ColorThief();
        var colors = colorThief.getPalette(cover, 2);
        var accentColor1 = 'rgb(' + colors[0].join(',') + ')';
       /* var accentColor1t50 = 'rgb(' + colors[0].join(',') + ',0.5)';*/
        var accentColor2 = 'rgb(' + colors[1].join(',') + ')';
        /*var accentColor2t50 = 'rgb(' + colors[1].join(',') + ',0.5)';
        console.log(accentColor2t50);*/



        /***** Application des couleurs *****/


        /*** Theme color Chrome Mobile ***/

        document.querySelector('meta[name="theme-color"]').setAttribute('content', accentColor1);

        /*** Font et paneau ***/

        document.getElementById('show').style.backgroundColor = accentColor2;
        document.getElementById('panel').style.backgroundColor = accentColor1;
        document.getElementById('panel').style.color = accentColor2;


        /*** Metas ***/

        var metas = document.querySelectorAll('#meta p');
        for (var j = 0; j < metas.length; j++) {
            var meta = metas[j];
            meta.style.color = accentColor1;
        }

        /***** Timeline *****/

        var timeline = document.getElementById('timeline');
        var timelineProgress = document.getElementById('timeline-progress');

        timeline.style.backgroundColor = accentColor2;
        timelineProgress.style.backgroundColor = accentColor1;


        /*** Volume Slider ***/

        document.getElementById('volume-slider').style.backgroundColor = accentColor2;



        /*** Ajout style perso dans header ****/

        var style = document.createElement("style");

        document.head.appendChild(style);

        //Volume slider
        style.innerHTML = 'input[type=\'range\']::-webkit-slider-thumb{ background-color: ' + accentColor2 + '!important; }';

        style.innerHTML += 'input[type=\'range\']::-moz-range-thumb{ background-color: ' + accentColor2 + '!important; }';

        style.innerHTML += 'input[type=\'range\']::-ms-thumb{ background-color: ' + accentColor1 + '!important;}';

        //Soundcloud input
        style.innerHTML += '#soundcloud div::after {background-color: ' + accentColor2+ '!important;}';

        style.innerHTML += '#soundcloud input::-webkit-input-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud input::-moz-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud input:-ms-input-placeholder {color: ' + accentColor2 + '!important;}';



        /***** Dessin du nouveau favicon *****/

        //Suprimme l'ancien favicon
        var rmlink = document.querySelector("head link[type='image/x-icon']");
        rmlink.parentNode.removeChild(rmlink);

        //Dessin du favicon
        var favicon = document.createElement('canvas');
        favicon.width = 50;
        favicon.height = 50;
        var ctx = favicon.getContext('2d');
        var centerX = favicon.width / 2;
        var centerY = favicon.height / 2;
        var radius = 19;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = accentColor2;
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = accentColor1;
        ctx.stroke();

        //Remplacement du lien
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = favicon.toDataURL("image/x-icon");
        document.getElementsByTagName('head')[0].appendChild(link);

    });




    /******************************************
     * IMPORT INPUT TYPE FILE
     * *****************************************/

    var fileInput = document.getElementById("file-input");
    var fileButton = document.getElementById("file-button");

    fileInput.style.display = 'none';

    //Clique sur bouton qui déclanche le champ input
    fileButton.addEventListener("click", function(){
        fileInput.click();
        fileInput.blur();
    });

    //Récupération fichier et metatags
    fileInput.addEventListener("change", function(event) {
        var file = event.target.files[0];
        getMetatags(file);
        getURL(file);

        this.blur();

    }, false);




    /**********************************************
     * IMPORT DRAG & DROP
     * ********************************************/

    var dropZone = document.getElementById('drop-zone');

    document.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropZone.classList.remove('hidden');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropZone.classList.add('hidden');
    });

    dropZone.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        //Recupère un seule fichier
        var file = e.dataTransfer.files[0];
        getMetatags(file);
        getURL(file);
        dropZone.classList.add('hidden');
    });




    /***********************************************
     * Gestion controle et buttons
     * ***********************************************/


    /***** Raccourci clavier *****/

    document.addEventListener("keydown", function (e) {
        console.log(e);

        // Espace : Play / Pause
        if(e.keyCode === 32) {
            audio.paused ? audio.play() : audio.pause();
        }

        //M : Mute / Unmute
        if (e.keyCode === 77) {
            audio.muted ? audio.muted = false : audio.muted = true;

        }

        //U : Upload file
        if (e.keyCode === 85) {
            document.getElementById("file-input").click();
        }


        //Haut : monter le son
        if (e.keyCode === 38) {
            if (audio.volume < 0.9) {
                audio.volume += 0.1
            } else {
                audio.volume = 1;
            }
        }

        //Bas : baisser le son
        if (e.keyCode === 40) {
            if (audio.volume > 0.1) {
                audio.volume -= 0.1
            } else {
                audio.volume = 0;
            }
        }

        //Gauche : reculer de 10 secondes
        if (e.keyCode === 37) {
            audio.currentTime -= 10;
        }

        //Droite : avancer de 10 secondes
        if (e.keyCode === 39) {
            audio.currentTime += 10;
        }


        //f : fullscreen

        if (e.keyCode === 70) {
            toggleFullScreen();
        }

        function toggleFullScreen() {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }

    });


    /***** Timeline *****/

    var timeline = document.getElementById('timeline');
    var timelineProgress = document.getElementById('timeline-progress');

    audio.addEventListener('timeupdate', function () {
        var progression = (audio.currentTime / audio.duration) * 100;
        timelineProgress.style.width = progression + '%';
    });

    timeline.addEventListener('click', function (e) {
        var progressionPourcent = this.clientWidth / e.pageX;
        audio.currentTime = audio.duration / progressionPourcent;

    });



    /***** Volume *****/

    //Bouton Mute

    var son = document.querySelector("button[class^='icon-volume']");

    son.addEventListener('click', function () {

       if(audio.muted) {
           audio.muted = false;
           son.classList.remove('icon-volume-off');
           son.classList.add('icon-volume-on');
       } else {
           audio.muted = true;
           son.classList.remove('icon-volume-on');
           son.classList.add('icon-volume-off');
       }


    });

    //Verifier état mute quand touche appuyé
    audio.addEventListener('volumechange', function (e) {
        console.log(e);
        if (audio.muted || e.path[0].volume === 0) {
            console.log ("son coupé");
            son.classList.remove('icon-volume-on');
            son.classList.add('icon-volume-off');
        } else {
            console.log("son marche");
            son.classList.remove('icon-volume-off');
            son.classList.add('icon-volume-on');
        }
    });



    //Slider

    var volumeSlider = document.getElementById('volume-slider');

    volumeSlider.value = volume;
    audio.volume = volume / 100;

    volumeSlider.addEventListener('change', function () {
       audio.volume = this.value / 100;
       this.blur();
    });

    audio.addEventListener('volumechange', function (e) {

        volumeSlider.value =  e.path[0].volume * 100;

    });


    /***** Play et pause *****/

    var control = document.querySelector("button[class^='icon-control']");

    control.addEventListener('click', function () {

        audio.paused ? audio.play() : audio.pause();

    });

    audio.addEventListener('play', function () {
        control.classList.remove('icon-control-play');
        control.classList.add('icon-control-pause');
        document.getElementById('cover').style.animationPlayState = "running";

    });

    audio.addEventListener('pause', function () {
        control.classList.remove('icon-control-pause');
        control.classList.add('icon-control-play');
        document.getElementById('cover').style.animationPlayState = "paused";
    });



    /***** Jouer sample *****/

    document.getElementById('show-help').addEventListener('click', function () {

        var root = location.protocol + '//' + location.host;

        var music1 = root + '/audio/music.mp3';

        getMetatags(music1);
        audio.setAttribute('src', 'audio/music.mp3');
    });

})();

