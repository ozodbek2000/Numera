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

let imageminMozjpeg, imageminOptipng, imageminSvgo;
(async () => {
    imageminMozjpeg = await import("imagemin-mozjpeg").then((m) => m.default);
    imageminOptipng = await import("imagemin-optipng").then((m) => m.default);
    imageminSvgo = await import("imagemin-svgo").then((m) => m.default);
})();

let imageminWebp;
(async () => {
    imageminWebp = await import("imagemin-webp").then((m) => m.default);
})();

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
    return src("src/js/index.js")
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}

function html() {
    return src("src/html/**/*.html")
        .pipe(
            fileInclude({
                prefix: "<!--= ",
                suffix: " -->",
                basepath: "@file", // важно!
            })
        )
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}

async function images() {
    const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
    const imageminOptipng = (await import("imagemin-optipng")).default;
    const imageminSvgo = (await import("imagemin-svgo")).default;

    return src("src/img/**/*.{jpg,jpeg,png,svg,gif}")
        .pipe(
            imagemin([
                imageminMozjpeg({ quality: 80 }),
                imageminOptipng({ optimizationLevel: 5 }),
                imageminSvgo(),
            ])
        )
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
    watch("src/js/**/*.js", scripts);
    watch("src/**/*.html", html);
    watch("src/fonts/**/*", fonts);
    watch("src/img/**/*", series(images, convertWebp));
}

exports.default = series(clean, parallel(styles, scripts, html, fonts), serve);
