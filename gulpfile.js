const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const htmlmin = require("gulp-htmlmin")
const browserify = require("browserify")
const source = require("vinyl-source-stream")
const buffer = require("vinyl-buffer")
const connect = require("gulp-connect")
const tsify = require("tsify") // Import tsify for TypeScript transpilation
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

    // Check if the corresponding TypeScript class file exists
    if (fs.existsSync(tsFilePath)) {
      // Delete the TypeScript class file if it exists
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
    entries: ["src/index.ts"], // Entry point for your TypeScript code
    debug: true, // Enable source maps for debugging
  })
    .plugin(tsify, { target: "es6" }) // Use tsify to transpile TypeScript
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())

const watchFiles = () => {
  // gulp.watch("src/**/*.ts", bundleJs)
  // gulp.watch("src/styles/**/*.scss", compileScss)
  // gulp.watch("src/**/*.html", moveHtml)
  gulp.watch("src/**/*.ts", bundleJs)
  gulp.watch(
    "src/styles/**/*.scss",
    gulp.series(bundleJs)
    // gulp.series(generateScssClasses, bundleJs)
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

// Task to start the development server with live-reloading
gulp.task(
  "start",
  gulp.parallel(startServer, bundleJs, compileScss, moveHtml, watchFiles)
)

// Default task (equivalent to "gulp start")
gulp.task("default", gulp.task("start"))
