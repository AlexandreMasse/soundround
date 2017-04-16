'use strict';
(function() {

    // Fonction Récupération mediatags ID3

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


    //Changement couleur au chargement de l'image

    var cover = document.getElementById("cover");

    cover.addEventListener("load", function () {
        var colorThief = new ColorThief();
        var colors = colorThief.getPalette(cover, 2);
        console.log(colors);
        var accentColor1 = 'rgb(' + colors[0].join(',') + ')';
        var accentColor2 = 'rgb(' + colors[1].join(',') + ')';

        document.querySelector('body').style.backgroundColor = accentColor2;
        document.getElementById('footer').style.backgroundColor = accentColor1;

        var ps = document.querySelectorAll('p');
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            p.style.color = accentColor1;
        }


    });

    /****** IMPORT MUSIQUE LOCAL ******/

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



})();

