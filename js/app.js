'use strict';
(function() {

    var audio = document.getElementById('audio'), // Element Audio
        cover = document.getElementById('cover'), // Illustration Musique
        cercles = document.querySelectorAll("[class^='cercle-']"), // Cercles animés
        sousCercles = document.querySelectorAll("[class^='sous-cercle-']"), // Fond cercles animés
        volume = 50, //Sur 100

        contexteAudio = new (window.AudioContext || window.webkitAudioContext)(),
        analyseur = contexteAudio.createAnalyser(),
        source = contexteAudio.createMediaElementSource(audio);

    source.connect(analyseur);
    analyseur.connect(contexteAudio.destination);
    analyseur.fftSize = 128  ;

    var tailleMemoireTampon = analyseur.frequencyBinCount,
        tableauDonnees = new Uint8Array(tailleMemoireTampon);

    console.log(tailleMemoireTampon);



    /*****************************************
     * AUDIO ANIMATION WITH WEB AUDIO API
     * *****************************************/


    /******* Animation 3 cercles ********/


    function animationTroisCercles() {
        requestAnimationFrame(animationTroisCercles);

        analyseur.getByteFrequencyData(tableauDonnees);
        
        var intervale = Math.floor(tableauDonnees.length / 3);

        // console.log(tableauDonnees);


        /*** Premier cercle ***/

        var total1 = 0;

        for (var i = 0; i < intervale ; i++) {
            total1 += tableauDonnees[i];
        }

        var moyenne1 = total1 / intervale;

        cercles[0].style.width = cover.offsetWidth + moyenne1  + 'px';
        cercles[0].style.height = cover.offsetHeight + moyenne1  + 'px';


        /*** Deuxième cercle ***/

        var total2 = 0;

        for (var i = intervale; i < 2 * intervale; i++) {
            total2 += tableauDonnees[i];

        }

        var moyenne2 = total2 / intervale;

        cercles[1].style.width = cover.offsetWidth + moyenne2 * 0.8 + 'px';
        cercles[1].style.height = cover.offsetHeight + moyenne2 * 0.8 + 'px';


        /*** Troisième cercle ***/

        var total3 = 0;

        for (var i = 2 * intervale; i < tableauDonnees.length; i++) {
            total3 += tableauDonnees[i];

        }

        var moyenne3 = total3 / intervale;

        cercles[2].style.width = cover.offsetWidth + moyenne3 * 2.3 + 'px';
        cercles[2].style.height = cover.offsetHeight + moyenne3 * 2.3 + 'px';

    }



    /****** Animation Canvas Bars ******/


    var canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas);
    canvas.width = 800;
    canvas.height = 200;
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    function animationCanvasBars() {
        requestAnimationFrame(animationCanvasBars);

        analyseur.getByteFrequencyData(tableauDonnees);

        ctx.fillStyle = 'rgb(0, 0, 0)';

        //Eface
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var largeurBarre = (canvas.width / tailleMemoireTampon) * 2.5;
        var hauteurBarre;
        var x = 0;


        /*var total = 0;

        for (var i = 0; i < tableauDonnees.length ; i++) {
            total += tableauDonnees[i];
        }*/

        console.log(tableauDonnees.length);


     /*   var moyenne = Math.floor(total / tableauDonnees.length);*/


        for(var i = 0; i < tailleMemoireTampon; i++) {

            hauteurBarre = Math.floor(tableauDonnees[i]);

            ctx.fillStyle = 'rgb(' + (hauteurBarre+100) + ',50,50)';
            ctx.fillRect(x,canvas.height-hauteurBarre/2,largeurBarre,hauteurBarre);

            x += largeurBarre + 1;
        }


    }


    // console.log(moyenne);
    //
    // document.getElementById('cover').style.width = moyenne + 'px';
    // document.getElementById('cover').style.height = moyenne + 'px';
    //
    // var animation = document.getElementById('animation');
    // // console.log(cercles);
    //
    //
    //
    // for (var c = 0; c < cercles.length; c++) {
    //     var cercle = cercles[c];
    //     // console.log(cercle.style.borderWidth);
    //
    //     cercle.style.width = cover.offsetWidth + moyenne * 1.5 + 'px';
    //     cercle.style.height = cover.offsetHeight + moyenne * 1.5 + 'px';
    //     // console.log(cercle.getPropertyValue('border-width'));
    // }
    //
    // animation.style.height = cover.offsetHeight + moyenne + 'px';
    // animation.style.width = cover.offsetWidth + moyenne + 'px';


    //animationCanvasBars();


    animationTroisCercles();





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
                var title = tags.title ? tags.title : "Titre inconnu";
                document.getElementById('title').innerText = title;

                //Artist
                var artist = tags.artist ? tags.artist : "Artiste inconnu";
                document.getElementById('artist').innerText = artist;

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


                /*Media Session API for Chrome mobile 57+*/

                if ('mediaSession' in navigator) {

                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: title,
                        artist: artist,
                        artwork: [
                            { src: base64, sizes: '512x512' }
                        ]
                    });
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
        audio.setAttribute('src', url);
    };






    /*************************************************
     * CHANGEMENT DE COULEUR
     * ***********************************************/



    //Dès que l'image charge
    cover.addEventListener("load", function () {

        this.style.display = 'block';

        document.getElementById('show-help').style.display = "none";
        document.getElementById('show-container').style.display = "flex";




        /***** Récupération palette couleur avec ColorThief *****/

        var colorThief = new ColorThief();
        var colors = colorThief.getPalette(cover, 2);

        var accentColor1 = 'rgb(' + colors[0].join(',') + ')';
        var accentColor2 = 'rgb(' + colors[1].join(',') + ')';



        /***** Application des couleurs *****/


        /*** Theme color Chrome Mobile ***/

        document.querySelector('meta[name="theme-color"]').setAttribute('content', accentColor1);

        /*** Font et paneau ***/

        document.getElementById('show').style.backgroundColor = accentColor2;
        document.getElementById('panel').style.backgroundColor = accentColor1;
        document.getElementById('panel').style.color = accentColor2;


        /*** Cercles animés ***/

        //Cercles
        for (var i = 0; i < cercles.length; i++) {
            var cercle = cercles[i];

            // cercle.style.backgroundColor = accentColor1;
            cercle.style.borderColor = accentColor1;
        }

        //Sous-cercles
       /* for (i = 0; i < sousCercles.length; i++) {
            var sousCercle = sousCercles[i];
            sousCercle.style.backgroundColor = accentColor2;
        }*/

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
        style.innerHTML += '#soundcloud-spotify div::after {background-color: ' + accentColor2+ '!important;}';

        style.innerHTML += '#soundcloud-spotify input::-webkit-input-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud-spotify input::-moz-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud-spotify input:-ms-input-placeholder {color: ' + accentColor2 + '!important;}';



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




    /*********************************************
     * IMPORT INPUT TYPE FILE
     * ********************************************/


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




    /************************************************
     * IMPORT SPOTIFY
     * ***********************************************/


    var spotify = new SpotifyWebApi();

    //Prevent the CORS access restriction for Spotify
    audio.crossOrigin = "anonymous";
    cover.crossOrigin = "anonymous";


    /*** Get ID of track from URL ***/

    var spotifyUrlToId = function(url) {
        //If 'spotify:' exist in url
        if (url.indexOf('spotify:') !== -1) {
            //If 'spotify:track:' exist in url
            if (url.indexOf('spotify:track:') !== -1) {
                //Return the end of the url (the id)
                return url.split('spotify:track:')[1];
            } else {
                throw new TypeError('The URI does not belong to a track.');
            }
            //If 'spotify.com/' exist in url
        } else if (url.indexOf('spotify.com/') !== -1) {
            //If 'spotify.com/track/' exist in url
            if (url.indexOf('spotify.com/track/') !== -1) {
                //Return the end of url (the id)
                return url.split('spotify.com/track/')[1];
            } else {
                throw new TypeError('The URI does not belong to a track.');
            }
        } else {
            return url;
        }
    };

    /*** Get data music from JSON ***/

    var getSpotifyData = function (json) {

        //30s of preview
        var url = json.preview_url;
        if (url === null ) {
            console.log('pas de prewiew pour cette musique');
        } else {
            audio.setAttribute('src', url);
        }

        //Song name
        document.getElementById('title').innerText = json.name;

        //Artist
        document.getElementById('artist').innerText = json.artists[0].name;

        //Album name
        document.getElementById('album').innerText = json.album.name;

        //Album cover image
        document.getElementById('cover').setAttribute('src', json.album.images[0].url);

    };

    /*** Text Input Submit ***/

    document.getElementById('input-text-submit').addEventListener('click', function () {

        //Text from input
        var textInput = document.getElementById('input-text').value;

        //URL to id
        var id = spotifyUrlToId(textInput);

        //Get track with ID
        spotify.getTrack(id, function (err, json) {
            if (err) {
                console.error(err);
            } else {
                console.log('Music', json);
                getSpotifyData(json);

                document.getElementById('input-text').blur();
                document.getElementById('input-text').value = "";

                audio.addEventListener('canplay', function () {
                    audio.play();
                });
            }
        });



    });





    /***********************************************
     * CONTROLS AND BUTTONS
     * ***********************************************/


    /***** Raccourci clavier *****/

    document.addEventListener("keydown", function (e) {
        console.log(e);


        //Si on est pas dans un champ input type text
        if (e.target.nodeName.toLowerCase() !== 'input' && e.target.type !== 'text') {

            // Espace : Play / Pause
            if(e.keyCode === 32) {
                //Empeche comportement par defaut
                e.preventDefault();
                e.stopPropagation();
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


            //f : toogle fullscreen

            if (e.keyCode === 70) {
                document.querySelector("button[class^='icon-window']").click();
            }


        //If we are in input type text
        } else {

            //Enter key : submit text of input
            if (e.keyCode === 13) {
                document.getElementById('input-text-submit').click();
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



    /***** Toggle Fullscreen *****/

    var fullscreen = document.querySelector("button[class^='icon-window']");

    fullscreen.addEventListener('click', function () {

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }

            fullscreen.classList.remove('icon-window-expand');
            fullscreen.classList.add('icon-window-minimize');

        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            fullscreen.classList.remove('icon-window-minimize');
            fullscreen.classList.add('icon-window-expand');
        }
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

        var root = location.href;

        var music1 = root + '/audio/music.mp3';

        getMetatags(music1);

        audio.setAttribute('src', 'audio/music.mp3');

        audio.play();
    });

})();

