const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack-stream");
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const del = require("del");
const fileInclude = require("gulp-file-include");

function clean() {
    return del(["dist/**", "!dist/img/**", "!dist/img"]);
}

function styles() {
    return src("src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}

function fonts() {
    return src("src/fonts/**/*.{ttf,woff,woff2}").pipe(dest("dist/fonts"));
}

function scripts() {
    return src("src/js/**/*.js")
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}

exports.scripts = scripts;

function html() {
    return src("src/html/**/*.html")
        .pipe(
            fileInclude({
                prefix: "@@",
                basepath: "@file", // важно!
            })
        )
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}

async function images() {
    return src("src/img/**/*.{jpg,jpeg,png,svg,gif}")
        .pipe(dest("dist/img"))
        .pipe(browserSync.stream());
}

function convertWebp() {
    return src("src/img/**/*.{jpg,jpeg,png}")
        .pipe(imagemin([() => imageminWebp({ quality: 85 })]))
        .pipe(rename({ extname: ".webp" }))
        .pipe(dest("dist/img/webp"))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
        port: 3000,
        open: true,
    });

    watch("src/scss/**/*.scss", styles);
    watch("src/**/*.html", html);
    watch("src/fonts/**/*", fonts);
    watch("src/img/**/*", series(images));
}

exports.default = series(
    clean,
    parallel(styles, scripts, html, fonts, images),
    serve
);
