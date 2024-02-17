const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const htmlmin = require("gulp-htmlmin")
const browserify = require("browserify")
const source = require("vinyl-source-stream")
const buffer = require("vinyl-buffer")
const connect = require("gulp-connect")
const tsify = require("tsify")
const fs = require("fs")
const through2 = require("through2")

function generateScssClasses() {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      through2.obj((file, _, cb) => {
        const className = file.stem.replace(/[^a-zA-Z0-9]/g, "_")
        const cssContent = file.contents.toString("utf-8")
        const tsContent = `export class ChatStyleVariables {
          static ${className} = \`${cssContent}\`;
        }`

        fs.writeFileSync(`src/styles/${className}.ts`, tsContent, "utf-8")

        cb(null, file)
      })
    )
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload())
}

function cleanupRemovedScss() {
  return through2.obj((file, _, cb) => {
    const className = file.stem.replace(/[^a-zA-Z0-9]/g, "_")
    const tsFilePath = `src/styles/${className}.ts`

    if (fs.existsSync(tsFilePath)) {
      fs.unlinkSync(tsFilePath)
    }

    cb(null, file)
  })
}

const compileScss = () =>
  gulp
    .src("src/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload())

const moveHtml = () =>
  gulp
    .src("src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())

const bundleJs = () =>
  browserify({
    entries: ["src/index.ts"],
    debug: true,
  })
    .plugin(tsify, { target: "es6" })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())

const watchFiles = () => {
  gulp.watch("src/**/*.ts", bundleJs)
  gulp.watch(
    "src/styles/**/*.scss",
    gulp.series(bundleJs)
  )
  gulp.watch("src/**/*.html", moveHtml)
}

const startServer = () =>
  connect.server({
    root: "dist",
    livereload: true,
    port: 5500,
  })

gulp.task("build", gulp.series(bundleJs, compileScss, moveHtml))

gulp.task(
  "start",
  gulp.parallel(startServer, bundleJs, compileScss, moveHtml, watchFiles)
)

gulp.task("default", gulp.task("start"))
