const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')

const browser_sync = require('browser-sync')
const bs = browser_sync.create()

const load_plugins = require('gulp-load-plugins')
const plugins = load_plugins();

const data = {
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
}

const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
}

const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data }))
    .pipe(dest('temp'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const clean = () => {
  return del(['dist', 'temp'])
}

const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/.html$/, plugins.htmlmin(
      {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    )))
    .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)

  watch(
    [
      'src/assets/images/**',
      'src/assets/fonts/**',
      'public/**'
    ], bs.reload
  )

  bs.init(
    {
      server: {
        baseDir: ['temp', 'src', 'public'],
        notify: false,
        files: 'dist/**',
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    }
  )
}

const compile = parallel(style, script, page)

const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)

const develop = series(compile, serve)

module.exports = {
  clean,
  develop,
  build
}