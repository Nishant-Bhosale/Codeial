// const sass = require('gulp-sass')(require('node-sass'));
// //final code for css is this.
// gulp.task('css', (done) => {
//     console.log('Minifying CSS');
//     gulp.src('../assets/sass/**/*.scss')
//     .pipe(sass())
//     .pipe(cssnano())
//     .pipe(gulp.dest('../assets.css'));

//     console.log('Minified CSS');
//     gulp.src('../assets/**/*.css')
//     .pipe(rev())
//     .pipe(gulp.dest('../public/assets'))
//     .pipe(rev.manifest({
//         cwd:'public',
//         merge: true
//     })).pipe(
//     gulp.dest('../public/assets')
//     );
//     done();

// })

import gulp from "gulp";
import sass from "sass";
import gulpSass from "gulp-sass";
import cssnano from "gulp-cssnano";
import rev from "gulp-rev";
import gulpUglify from "gulp-uglify-es";
import imagemin from "gulp-imagemin";
import { deleteSync } from "del";

const uglify = gulpUglify.default;
const sassTemp = gulpSass(sass);
const css1 = async () => {
  return gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sassTemp())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets.css"));
};

const css2 = async () => {
  return gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
};

const js = async () => {
  return gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
};

const images = async () => {
  return gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
};

// empty the public/assets directory
const cleanAssets = async () => {
  return deleteSync("./public/assets");
};

export { js, images, cleanAssets };

const build = gulp.series(cleanAssets, css1, css2, js, images);

export default build;
