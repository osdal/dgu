//Подключаем галп
const gulp = require('gulp');
//Объединение файлов
const concat = require('gulp-concat');
//Добапвление префиксов
const autoprefixer = require('gulp-autoprefixer');
//Оптимизация стилей
const cleanCSS = require('gulp-clean-css');
//Оптимизация скриптов
const uglify = require('gulp-uglify');
//Удаление файлов
const del = require('del');
//Синхронизация с браузером
const browserSync = require('browser-sync').create();
//Для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');
//Sass препроцессор
const sass = require('gulp-sass');
//Less препроцессор
// const less = require('gulp-less');
//Stylus препроцессор
// const stylus = require('gulp-stylus');
//Модуль для сжатия изображений
const imagemin = require('gulp-imagemin');
//Модуль переименовывания файлов
const rename = require('gulp-rename');
//Модуль для конвертации ES6 в ES5
const babel = require('gulp-babel');

//Порядок подключения файлов со стилями
const styleFiles = [
   './src/scss/lib.scss',
   './src/scss/main.scss',
   './src/scss/media.scss'
]
//Порядок подключения js файлов
const scriptFiles = [
   './src/js/jquery.js',
   './src/js/slick.min.js',
   './src/js/jquery.validate.js',
   './src/js/lib.js',
   './src/js/main.js'
]

//Компилировать scss
gulp.task('scssCompile', () => {
   return gulp.src('./src/scss/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass().on('error', sass.logError))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./src/css/'))
})  

//Таск для обработки стилей
gulp.task('styles', () => {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      //Указать stylus() , sass() или less()
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer())
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      
      .pipe(rename({
         suffix: '.min'
      }))
      .pipe(sourcemaps.write('./'))
      //Выходная папка для стилей
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
});

//Таск для обработки скриптов
gulp.task('scripts', () => {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(scriptFiles)
      //Объединение файлов в один
      .pipe(concat('main.js'))
      //Конвертация ES6 в ES5
      .pipe(babel({
         presets: ['@babel/env']
      }))
      //Минификация JS
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(rename({
         suffix: '.min'
      }))
      //Выходная папка для скриптов
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
   return del(['build/**', '!build', '!build/git/**'])
});

//Таск для сжатия изображений
gulp.task('img-compress', ()=> {
   return gulp.src('./src/img/**')
   .pipe(imagemin({
      progressive: true
   }))
   .pipe(gulp.dest('./build/img/'))
});

//Таск для копирования файлов шрифтов
gulp.task('fontsCopy', () => {
   return gulp.src('./src/fonts/**')
      .pipe(gulp.dest('./build/fonts/'))
});

//Таск для копирования файлов html
gulp.task('htmlCopy', () => {
   return gulp.src('./*.html')
      .pipe(gulp.dest('./build/'))
      .pipe(browserSync.stream())
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', function () {
   browserSync.init({
      server: {
         baseDir: "./build"
      }
   });


   //Следить за добавлением новых изображений
   gulp.watch('./src/img/**', gulp.series('img-compress'))
   //Следить за добавлением новых шрифтов
   gulp.watch('./src/fonts/**', gulp.series('fontsCopy'))
    //Следить за добавлением новых html
    gulp.watch('./src/*.html', gulp.series('htmlCopy'))
   //Следить за файлами со стилями с нужным расширением
   gulp.watch('./src/scss/**/*.scss', gulp.series('scssCompile'))
   gulp.watch('./src/css/**/*.css', gulp.series('styles'))
   //Следить за JS файлами
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   //При изменении HTML запустить синхронизацию
   // gulp.watch("./*.html").on('change',  browserSync.reload);
   gulp.watch('./*.html', gulp.series('htmlCopy'))
});

//Таск по умолчанию, Запускает del, styles, scripts, img-compress и watch
gulp.task('default', gulp.series('del', 'styles', 'scssCompile', 'scripts', 'img-compress', 'fontsCopy', 'htmlCopy', 'watch'));








