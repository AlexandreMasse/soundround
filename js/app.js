'use strict';
(function() {

    /*****************************
     * Récupération mediatags
     * ****************************/

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
                    document.getElementById('artist').innerText = "";
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


    /******************************
     * Changement couleur au chargement de l'image
     * *****************************/

    var cover = document.getElementById("cover");

    cover.addEventListener("load", function () {

        this.style.display = 'block';

        //Récupération palette couleur avec ColorThief
        var colorThief = new ColorThief();
        var colors = colorThief.getPalette(cover, 2);
        console.log(colors);
        var accentColor1 = 'rgb(' + colors[0].join(',') + ')';
        var accentColor2 = 'rgb(' + colors[1].join(',') + ')';

        //Application des couleurs
        document.getElementById('show').style.backgroundColor = accentColor2;
        document.getElementById('panel').style.backgroundColor = accentColor1;

        var buttons = document.querySelectorAll('#panel > *');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.style.color = accentColor2;
        }
        var metas = document.querySelectorAll('#meta p');
        for (var j = 0; j < metas.length; j++) {
            var meta = metas[j];
            meta.style.color = accentColor1;
        }


        /*** Dessin du nouveau favicon ***/

        //Suprimme l'ancien favicon
        var rmlink = document.querySelector("head link[type='image/x-icon']");
        console.log(rmlink);
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


    /*******************************
     * IMPORT INPUT TYPE FILE
     * *****************************/

    var fileInput = document.getElementById("file-input");
    var fileButton = document.getElementById("file-button");

    fileInput.style.display = 'none';

    //Clique sur bouton qui déclanche le champ input
    fileButton.addEventListener("click", function(){
        fileInput.click();
    });

    //Récupération fichier et metatags
    fileInput.addEventListener("change", function(event) {
        var file = event.target.files[0];
        getMetatags(file);

    }, false);


    /******************************
     * IMPORT DRAG & DROP
     * *****************************/

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
        dropZone.classList.add('hidden');
    });



    /**************************
     * Gestion des buttons
     * *************************/

    var volume = document.querySelector("button[class^='icon-volume']");

    volume.addEventListener('click', function () {
        if (this.className == "icon-volume-on") {
            this.classList.remove('icon-volume-on');
            this.classList.add('icon-volume-off');
        } else {
            this.classList.remove('icon-volume-off');
            this.classList.add('icon-volume-on');
        }
    });

    var control = document.querySelector("button[class^='icon-control']");

    control.addEventListener('click', function () {
        if (this.className == "icon-control-play") {
            this.classList.remove('icon-control-play');
            this.classList.add('icon-control-pause');
        } else {
            this.classList.remove('icon-control-pause');
            this.classList.add('icon-control-play');
        }
    });


})();

