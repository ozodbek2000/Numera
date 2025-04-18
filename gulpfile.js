const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pug = require('gulp-pug');
const webpack = require('webpack-stream');
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

let imageminMozjpeg, imageminOptipng, imageminSvgo;

(async () => {
  imageminMozjpeg = await import('imagemin-mozjpeg').then(m => m.default);
  imageminOptipng = await import('imagemin-optipng').then(m => m.default);
  imageminSvgo = await import('imagemin-svgo').then(m => m.default);
})();


let imageminWebp;
(async () => {
  imageminWebp = await import('imagemin-webp').then(m => m.default);
})();

// const webp = require('gulp-webp');

const del = require('del');

// Очистка
function clean() {
  return del([
    'dist/**',            // всё в dist
    '!dist/img/**',       // кроме содержимого dist/img
    '!dist/img',          // и самой папки dist/img
  ]);
}
  
  // Стили
  function styles() {
    return src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream());
  }  

  function fonts() {
    return src('src/fonts/**/*.{ttf,woff,woff2}')
      .pipe(dest('dist/fonts'));
  }  
  
  
  // Скрипты
  // Определение задачи для компиляции JS
  function scripts() {
    return src('src/js/index.js') // Путь к файлу
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/preset-env'],
      }))
      .pipe(concat('main.js')) // Слияние файлов
      .pipe(uglify()) // Минификация
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/js')); // Вывод в папку dist/js
  }

  
  // HTML
  
  function html() {
    return src('src/pug/pages/**/*.pug')
      .pipe(pug({ pretty: true }))
      .pipe(dest('dist'))
      .pipe(browserSync.stream());
  }

  function scripts() {
    return src('src/js/index.js')
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(dest('dist/js'))
      .pipe(browserSync.stream());
  }

  exports.scripts = scripts;
  
  // Изображения (оптимизация и WebP)
  async function images() {
    const imageminMozjpeg = (await import('imagemin-mozjpeg')).default;
    const imageminOptipng = (await import('imagemin-optipng')).default;
    const imageminSvgo = (await import('imagemin-svgo')).default;
  
    return src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
      .pipe(imagemin([
        imageminMozjpeg({ quality: 80 }),
        imageminOptipng({ optimizationLevel: 5 }),
        imageminSvgo()
      ]))
      .pipe(dest('dist/img'))
      .pipe(browserSync.stream());
  }  
  
  
  function convertWebp() {
    return src('src/img/**/*.{jpg,jpeg,png}')
      .pipe(imagemin([
        () => imageminWebp({ quality: 85 })
      ]))
      .pipe(rename({ extname: '.webp' }))
      .pipe(dest('dist/img/webp'))
      .pipe(browserSync.stream());
  }  
  
  
  // Сервер
  function serve() {
    browserSync.init({
        server: {
          baseDir: 'dist'
        },
        port: 3000,
        open: true
      });
      
  
    watch('src/scss/**/*.scss', styles);
    // watch('src/js/**/*.js', scripts); // --> Запускаем скрипт отдельно на 2 ом терминале с командой npx gulp scripts !!!!!
    watch('src/pug/**/*.pug', html);
    watch('src/fonts/**/*', fonts);
    watch('src/img/**/*', series(images, convertWebp)); // выключен отслеживание скрипта для команды npx gulp scripts !!!   
  }
  
  // Экспорт задач
  exports.default = series(
    clean,
    parallel(styles, scripts, html, fonts),
    serve
  );