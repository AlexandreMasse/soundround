var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync').create();


// Tache de compilation des fichiers Sass

gulp.task('sass', function() {
    return gulp.src('css/**/*.scss') // Prend tous les fichiers .scss dans le dossier /css
        .pipe(plumber()) // Empeche le la tache de s'arreter s'il y a une erreur
        .pipe(sass({outputStyle: 'expanded'}))   //Compile en css
        .pipe(gulp.dest('css')) // Dossier de destination des css compilés
        .pipe(browserSync.stream());
});




// Tache browser sync avec injection CSS

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('css/**/*.scss', ['sass']);
});



// Tache watch

gulp.task('watch', function(){
    gulp.watch('css/**/*.scss', ['sass']); //Dès qu'une modification est faite dans les fichier scss il compile
});