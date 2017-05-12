'use strict';
(function() {

    const audio = document.getElementById('audio'), // Element Audio
        cover = document.getElementById('cover'), // Illustration Musique
        cercles = document.querySelectorAll("[class^='cercle-']"), // Cercles animés
        sousCercles = document.querySelectorAll("[class^='sous-cercle-']"), // Fond cercles animés
        textInput = document.getElementById('input-text'),
        volume = 50; //Sur 100


    /***********************************************
     * WEB AUDIO API SETTINGS
     * *********************************************/

    const contexteAudio = new (window.AudioContext || window.webkitAudioContext)(),
        analyseur = contexteAudio.createAnalyser(),
        source = contexteAudio.createMediaElementSource(audio);

    source.connect(analyseur);
    analyseur.connect(contexteAudio.destination);
    analyseur.fftSize = 128;

    const tailleMemoireTampon = analyseur.frequencyBinCount,
        tableauDonnees = new Uint8Array(tailleMemoireTampon);

    console.log(tailleMemoireTampon);



    /***** Microphone test feature : it works but not relevant *****/

    const microphoneRecord = document.getElementById('microphone-record');

    /*navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.getUserMedia (
            //only audio needed
            {
                audio: true
            },

            //Success
            function(micophoneStream) {

                microphoneRecord.onclick = function() {
                    contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
                    source = contexteAudio.createMediaStreamSource(micophoneStream);
                    analyseur = contexteAudio.createAnalyser();
                    source.connect(analyseur);

                    audio.pause();

                    microphoneRecord.style.background = "red";
                    microphoneRecord.style.color = "green";
                }

            },

            //Error
            function(err) {
                console.log('getUserMedia error : ' + err);
            }
        );
    } else {
        alert('getUserMedia not supported !');
    }*/




    /****************************************************
     * AUDIO ANIMATION WITH WEB AUDIO API
     * ***************************************************/


    /******* Animation 2 circles ********/

    function animationTwoCircles() {
        requestAnimationFrame(animationTwoCircles);

        analyseur.getByteFrequencyData(tableauDonnees);

        const intervale = Math.floor(tableauDonnees.length /2);

        // console.log(tableauDonnees);

        /*** First circle ***/

        let total1 = 0;

        for (let i = 0; i < intervale ; i++) {
            total1 += tableauDonnees[i];
        }

        const moyenne1 = total1 / intervale;

        cercles[0].style.width = cover.offsetWidth + moyenne1 + 'px';
        cercles[0].style.height = cover.offsetHeight + moyenne1 + 'px';

        cercles[0].style.borderWidth = 3 + Math.floor(moyenne1 /12) + 'px';


        /*** Second circle ***/

        let total2 = 0;

        for (let i = intervale; i < tableauDonnees.length; i++) {
            total2 += tableauDonnees[i];

        }

        const moyenne2 = total2 / intervale;

        cercles[1].style.width = cover.offsetWidth + moyenne2 * 1.3 + 'px';
        cercles[1].style.height = cover.offsetHeight + moyenne2  * 1.3 + 'px';

        cercles[1].style.borderWidth = 3 + Math.floor(moyenne2 / 8) + 'px';


    }


    /******* Animation 3 circles ********/

    function animationTroisCercles() {
        requestAnimationFrame(animationTroisCercles);

        analyseur.getByteFrequencyData(tableauDonnees);

        const intervale = Math.floor(tableauDonnees.length / 3);

        // console.log(tableauDonnees);

        /*** Premier cercle ***/

        let total1 = 0;

        for (let i = 0; i < intervale ; i++) {
            total1 += tableauDonnees[i];
        }

        const moyenne1 = total1 / intervale;

        cercles[0].style.width = cover.offsetWidth + moyenne1  + 'px';
        cercles[0].style.height = cover.offsetHeight + moyenne1  + 'px';



        /*** Deuxième cercle ***/

        let total2 = 0;

        for (let i = intervale; i < 2 * intervale; i++) {
            total2 += tableauDonnees[i];

        }

        const moyenne2 = total2 / intervale;

        cercles[1].style.width = cover.offsetWidth + moyenne2 * 0.8 + 'px';
        cercles[1].style.height = cover.offsetHeight + moyenne2 * 0.8 + 'px';


        /*** Troisième cercle ***/

        let total3 = 0;

        for (let i = 2 * intervale; i < tableauDonnees.length; i++) {
            total3 += tableauDonnees[i];

        }

        const moyenne3 = total3 / intervale;

        cercles[2].style.width = cover.offsetWidth + moyenne3 * 2.3 + 'px';
        cercles[2].style.height = cover.offsetHeight + moyenne3 * 2.3 + 'px';

    }



    /****** Animation Canvas Bars ******/


    const canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas);
    canvas.width = 800;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    function animationCanvasBars() {
        requestAnimationFrame(animationCanvasBars);

        analyseur.getByteFrequencyData(tableauDonnees);

        ctx.fillStyle = 'rgb(0, 0, 0)';

        //Eface
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const largeurBarre = (canvas.width / tailleMemoireTampon) * 2.5;
        let hauteurBarre;
        let x = 0;


        /*var total = 0;

        for (var i = 0; i < tableauDonnees.length ; i++) {
            total += tableauDonnees[i];
        }*/

        console.log(tableauDonnees.length);


     /*   var moyenne = Math.floor(total / tableauDonnees.length);*/


        for(let i = 0; i < tailleMemoireTampon; i++) {

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


    // animationTroisCercles();
    animationTwoCircles();






    /*************************************************
     * INTRO PAGE
     * ***********************************************/



    /***** Local source *****/

    const localSource = document.getElementById('source-local');

    localSource.addEventListener('click', function () {
        fileButton.click();
    });


    /***** External sources *****/

    const sourceExternal = document.getElementById('source-external');

    const introInputText = document.getElementById('intro-input-text');


    sourceExternal.addEventListener('click', function () {
        introInputText.focus();
    });


    document.getElementById('intro-input-text-submit').addEventListener('click', function () {

        //Spotify
        if (introInputText.value.indexOf('spotify') !== -1) {
            getSpotifyTrack(introInputText.value);

        }
        //Soundcloud
        else if (introInputText.value.indexOf('soundcloud') !== -1) {
            soundcloudSearch(introInputText.value);
        }

        else {
            console.log('cccccccccccccccccccccccccccc');
            introInputText.value = '';
            introInputText.setAttribute('placeholder', 'URL invalide')
        }

    });




    /**** Animation when cover image is loaded ****/

    cover.addEventListener('load', function () {

        //Hide intro
        const intro = document.getElementById('intro');
        intro.classList.add('hide');

        setTimeout(function () {
            intro.style.display = 'none';
        },2000)

    });



    /************************************************
     * RECUPERATION DONNEES MUSIQUE
     * **********************************************/


    /***** Récupération metatags *****/

    const jsmediatags = window.jsmediatags;
    const getMetatags = function (file) {
        jsmediatags.read(file, {
            onSuccess: function(tag) {

                console.log(tag);

                const tags = tag.tags;
                console.log("Titre : " + tags.title + " Artiste : " + tags.artist + " Album : " + tags.album);

                //Titre
                const title = tags.title ? tags.title : "Titre inconnu";
                document.getElementById('title').innerText = title;

                //Artist
                const artist = tags.artist ? tags.artist : "Artiste inconnu";
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
                const image = tags.picture;
                if (image) {
                    let base64String = "";
                    for (let i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    const base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                    document.getElementById('cover').setAttribute('src',base64);
                } else {

                    //Cover Color Random

                    const coverColorNumber = Math.floor(Math.random() * 18) + 1;

                    const root = window.location.href;

                    document.getElementById('cover').setAttribute('src', root + '/img/cover/cover' + coverColorNumber+'.jpg');
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

        const currentMinutes = Math.floor(audio.currentTime / 60 ).toString();

        let currentSeconds = Math.floor(audio.currentTime % 60);

        //Toujours 2 chiffres
        currentSeconds = currentSeconds < 10 ? '0' + currentSeconds.toString() : currentSeconds.toString();

        document.getElementById('current-time').innerHTML = currentMinutes + ":" + currentSeconds;

        /*** Temps total ***/

        const durationMinutes = Math.floor(audio.duration / 60 ).toString();

        let durationSeconds = Math.floor(audio.duration % 60);

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


    /**** Create the url  for audio source with local import ****/

    const getURL = function (file) {
        const url = window.URL.createObjectURL(file);
        audio.setAttribute('src', url);
    };



    /**** Media Session API for Chrome mobile 57+ ****/


    //When image load
    cover.addEventListener('load', function () {

        if ('mediaSession' in navigator) {

            navigator.mediaSession.metadata = new MediaMetadata({
                title: document.getElementById('title').innerText,
                artist: document.getElementById('artist').innerText,
                artwork: [
                    { src: document.getElementById('cover').getAttribute('src'), sizes: '512x512' }
                ]
            });
        }
    });






    /*************************************************
     * COLORS CHANGE
     * ***********************************************/


    //When cover load
    cover.addEventListener("load", function () {


        /***** Récupération palette couleur avec ColorThief *****/

        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(cover, 2);

        const accentColor1 = 'rgb(' + colors[0].join(',') + ')';
        const accentColor2 = 'rgb(' + colors[1].join(',') + ')';



        /***** Application des couleurs *****/


        /*** Theme color Chrome Mobile ***/

        document.querySelector('meta[name="theme-color"]').setAttribute('content', accentColor1);

        /*** Font et paneau ***/

        document.getElementById('show').style.backgroundColor = accentColor2;
        document.getElementById('panel').style.backgroundColor = accentColor1;
        document.getElementById('panel').style.color = accentColor2;

        /*** Help / About ***/


        const helpAbout = document.getElementById('help-about');
        const helpAboutClose = document.getElementById('help-about-close');
        const helpAboutIcones = document.querySelectorAll("#help-about [class^='icon-']");

        helpAbout.style.color = accentColor1;
        helpAbout.style.backgroundColor = accentColor2;

        helpAboutClose.style.color = accentColor2;
        helpAboutClose.style.backgroundColor = accentColor1;


        for (let i = 0; i < helpAboutIcones.length; i++) {
            const icone = helpAboutIcones[i];
            icone.style.color = accentColor1
        }


        /*** Cercles animés ***/

        //Cercles
        for (let i = 0; i < cercles.length; i++) {
            const cercle = cercles[i];

            // cercle.style.backgroundColor = accentColor1;
            cercle.style.borderColor = accentColor1;
        }

        //Sous-cercles
       /* for (i = 0; i < sousCercles.length; i++) {
            var sousCercle = sousCercles[i];
            sousCercle.style.backgroundColor = accentColor2;
        }*/

        /*** Metas ***/

        const metas = document.querySelectorAll('#meta p');
        for (let j = 0; j < metas.length; j++) {
            const meta = metas[j];
            meta.style.color = accentColor1;
        }

        const time = document.getElementById('time').style.color = accentColor1;

        /***** Timeline *****/

        const timeline = document.getElementById('timeline');
        const timelineProgress = document.getElementById('timeline-progress');

        timeline.style.backgroundColor = accentColor2;
        timelineProgress.style.backgroundColor = accentColor1;


        /*** Volume Slider ***/

        document.getElementById('volume-slider').style.backgroundColor = accentColor2;



        /*** Ajout style perso dans header ****/

        const style = document.createElement("style");

        document.head.appendChild(style);

        //Help About
        style.innerHTML = '#help-about p a::after {background-color: ' + accentColor1+ '!important;}';

        //Volume slider
        style.innerHTML += 'input[type=\'range\']::-webkit-slider-thumb{ background-color: ' + accentColor2 + '!important; }';

        style.innerHTML += 'input[type=\'range\']::-moz-range-thumb{ background-color: ' + accentColor2 + '!important; }';

        style.innerHTML += 'input[type=\'range\']::-ms-thumb{ background-color: ' + accentColor1 + '!important;}';

        //URL input
        style.innerHTML += '#soundcloud-spotify div::after {background-color: ' + accentColor2+ '!important;}';

        style.innerHTML += '#soundcloud-spotify input::-webkit-input-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud-spotify input::-moz-placeholder {color: ' + accentColor2 + '!important;}';

        style.innerHTML += '#soundcloud-spotify input:-ms-input-placeholder {color: ' + accentColor2 + '!important;}';



        /* Todo: Faire un favicon plus grand */


        /***** Dessin du nouveau favicon *****/

        //Suprimme l'ancien favicon
        const rmlink = document.querySelector("head link[type='image/x-icon']");
        rmlink.parentNode.removeChild(rmlink);

        //Dessin du favicon
        const favicon = document.createElement('canvas');
        favicon.width = 50;
        favicon.height = 50;
        const ctx = favicon.getContext('2d');
        const centerX = favicon.width / 2;
        const centerY = favicon.height / 2;
        const radius = 19;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = accentColor2;
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = accentColor1;
        ctx.stroke();

        //Remplacement du lien
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = favicon.toDataURL("image/x-icon");
        document.getElementsByTagName('head')[0].appendChild(link);

    });




    /*********************************************
     * IMPORT INPUT TYPE FILE
     * ********************************************/


    const fileInput = document.getElementById("file-input");
    const fileButton = document.getElementById("file-button");

    fileInput.style.display = 'none';

    //Clique sur bouton qui déclanche le champ input
    fileButton.addEventListener("click", function(){
        fileInput.click();
        fileInput.blur();
    });

    //Récupération fichier et metatags
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        getMetatags(file);
        getURL(file);
        this.blur();

    }, false);




    /**********************************************
     * IMPORT DRAG & DROP
     * ********************************************/

    const dropZone = document.getElementById('drop-zone');


    /* Fix display bug on first load */
    setTimeout(function () {
        dropZone.style.display = 'flex';
    }, 1500);



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
        const file = e.dataTransfer.files[0];
        getMetatags(file);
        getURL(file);
        dropZone.classList.add('hidden');
    });




    /************************************************
     * IMPORT SPOTIFY
     * ***********************************************/


    const spotify = new SpotifyWebApi();

    //Prevent the CORS access restriction for Spotify
    audio.crossOrigin = "anonymous";
    cover.crossOrigin = "anonymous";


    /*** Get ID of track from URL ***/

    const spotifyUrlToId = function(url) {
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

    const getSpotifyData = function (json) {

        //30s of preview
        const url = json.preview_url;

        if (url === null ) {
            console.log('pas de prewiew pour cette musique');

            return false;

        } else {
            audio.setAttribute('src', url);

            //Song name
            document.getElementById('title').innerText = json.name;

            //Artist
            document.getElementById('artist').innerText = json.artists[0].name;

            //Album name
            document.getElementById('album').innerText = json.album.name;

            //Album cover image
            document.getElementById('cover').setAttribute('src', json.album.images[0].url);
        }


    };


    /*** Get Spotify track with url or id */

    const getSpotifyTrack = function (url) {

        //Convert URL to ID
        const id = spotifyUrlToId(url);

        //Todo : gérer les erreurs d'url

        //Get track with ID
        spotify.getTrack(id, function (err, json) {
            if (err) {
                console.error(err);
            } else {
                console.log('Music', json);
                getSpotifyData(json);

                audio.addEventListener('canplay', function () {
                    textInput.value = "";
                    textInput.blur();
                    textInput.setAttribute("placeholder", "Spotify / Souncloud URL");

                    introInputText.value = "";
                    introInputText.blur();
                    introInputText.setAttribute("placeholder", "Spotify / Souncloud URL");

                    audio.play();
                });
            }
        });
    };


    /*** Text Input Submit ***/


    // document.getElementById('input-text-submit').addEventListener('click', function () {
    //
    //     //Text from input
    //     const textInputValue = document.getElementById('input-text').value;
    //
    //     getSpotifyTrack(textInputValue);
    //
    //
    //     textInput.value = "";
    //     textInput.blur();
    //
    //
    // });



    /************************************************
     * IMPORT SOUNCLOUD
     * ***********************************************/


    const scID = 'nK6XQJ9KyRHKZf7sE6UVLxGpHFbqCJjP';


    SC.initialize({
        client_id: scID
    });


    const soundcloudSearch = function(scUrl){
        SC.resolve(scUrl).then(soundcloudStreamTrack);
    };


    const soundcloudStreamTrack = function(track){
        return SC.stream('/tracks/' + track.id).then(function(player){

            console.log(track);

            audio.setAttribute('src', track.stream_url + '?client_id=' + scID);

            //Song name
            document.getElementById('title').innerText = track.title;

            //Artist
            document.getElementById('artist').innerText = track.user.username;

            //Album name : not provided
            document.getElementById('album').style.display = 'none';

            //Album cover image
            const scDeafaultCover = track.artwork_url;

            const scLargeCover = scDeafaultCover.replace('large', 't500x500');

            document.getElementById('cover').setAttribute('src', scLargeCover);

            //Play audio when ready
            audio.addEventListener('canplay', function () {
                textInput.value = "";
                textInput.blur();
                textInput.setAttribute("placeholder", "Spotify / Souncloud URL");

                introInputText.value = "";
                introInputText.blur();
                introInputText.setAttribute("placeholder", "Spotify / Souncloud URL");

                audio.play();
            });


        }).catch(function(){
            console.log(arguments);
        });
    };



    /************************************************
     * IMPORT SOUNCLOUD / SPOTIFY
     * ***********************************************/


    document.getElementById('input-text-submit').addEventListener('click', function () {

        //Spotify
        if (textInput.value.indexOf('spotify') !== -1) {
            getSpotifyTrack(textInput.value);

        }
        //Soundcloud
        else if (textInput.value.indexOf('soundcloud') !== -1) {
            soundcloudSearch(textInput.value);
        }

        else {
            console.log('eeeeeeeeeeeeeeeeeeeeeeeee');
            textInput.value = '';
            textInput.setAttribute('placeholder', 'URL invalide')
        }

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


        }


        //Input type text player
        if (e.target.id = "input-text"){

            //Enter key : submit text of input
            if (e.keyCode === 13) {
                document.getElementById('input-text-submit').click();
            }

        }

        //Input type text intro
        if (e.target.id = "intro-input-text"){

            //Enter key : submit text of input
            if (e.keyCode === 13) {
                document.getElementById('intro-input-text-submit').click();
            }
        }

    });


    /***** Timeline *****/

    const timeline = document.getElementById('timeline');
    const timelineProgress = document.getElementById('timeline-progress');

    audio.addEventListener('timeupdate', function () {
        const progression = (audio.currentTime / audio.duration) * 100;
        timelineProgress.style.width = progression + '%';
    });

    timeline.addEventListener('click', function (e) {
        const progressionPourcent = this.clientWidth / e.pageX;
        audio.currentTime = audio.duration / progressionPourcent;

    });



    /***** Toggle Fullscreen *****/

    const fullscreen = document.querySelector("button[class^='icon-window']");

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


    /***** Help / About *****/

    const helpAbout = document.getElementById('help-about');
    const helpAboutOpen = document.getElementById('help-about-open');
    const helpAboutClose = document.getElementById('help-about-close');


    //Open

    helpAboutOpen.addEventListener('click', function () {

        helpAbout.classList.remove('hidden');
        helpAbout.classList.add('show');

    });

    //Close

    helpAboutClose.addEventListener('click', function () {

        helpAbout.classList.remove('show');
        helpAbout.classList.add('hidden');

    });



    /***** Volume *****/

    //Bouton Mute

    const son = document.querySelector("button[class^='icon-volume']");

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

    const volumeSlider = document.getElementById('volume-slider');

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

    const control = document.querySelector("button[class^='icon-control']");

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

    document.getElementById('source-sample').addEventListener('click', function () {

        const root = window.location.href;

        const musicSample = '/audio/strobotone-kites.mp3';

        const musicSamplePath = root + musicSample;

        getMetatags(musicSamplePath);

        audio.setAttribute('src', musicSamplePath);

        audio.play();
    });

})();

