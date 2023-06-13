const gulp = require('gulp');// gulpプラグインの読み込み
const sass = require('gulp-sass')(require("sass"));// Sassをコンパイルするプラグインの読み込み
const notify = require('gulp-notify');// エラー通知
const newer = require('gulp-newer');//差分
const plumber = require('gulp-plumber');// エラー時のタスク停止防止
const debug = require('gulp-debug');// ログ表示 
const browserSync = require('browser-sync');// ローカルサーバー 
const connectSSI = require('connect-ssi');

const path = require('path');　//pipeで渡されたデータをファイルに書き込むための出力用フォルダのパスを指定
const named = require('vinyl-named');//エントリポイントとして読み取り、エントリポイントを共通の名前でグループ化
const filter = require('gulp-filter');// ファイルフィルター

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const paths = {
    js: {
        src: 'src/assets/js/**/*.js', // コンパイル対象
        dest: 'dist/assets/js' // 出力先
    },
    jsVendor: {
        src: 'src/assets/js/vendor/*.js', // コンパイル対象
        dest: 'dist/assets/js/vendor' // 出力先
    },
    css: {
        src: 'src/assets/scss/**/*.+(scss|css)', // コンパイル対象
        dest: 'dist/assets/css' // 出力先
    },
    html: {
        src: 'src/**/*.html', // コンパイル対象
        dest: 'dist' // 出力先
    },
    img: {
        src: 'src/assets/img/**/*', // コンパイル対象
        dest: 'dist/assets/img' // 出力先
    }
}

/**
 * jsタスクを実行する関数
 */
function js() {
    return gulp.src(paths.js.src, '!' + paths.jsVendor.src)　// タスクを実行するファイルを指定
        .pipe(plumber({　// 実行する処理をpipeでつないでいく
            errorHandler: notify.onError('Error: <%= error.message %>')// エラーをコンソールに反映
        }))
        .pipe(newer(paths.js.dest))
        .pipe(filter(function (file) { // _から始まるファイルを除外
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .pipe(named((file) => {
            const p = path.parse(file.relative); //対象のパスを実行できる形式に変換して
            return ((p.dir) ? p.dir + path.sep : '') + p.name;　//エントリーポイントにする
        })
        )
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(debug({ title: 'js dest:' }));

}
/**
 * jsプラグインタスクを実行する関数
 */
function jsPlugin() {
    return gulp.src(paths.jsVendor.src)
        .pipe(plumber())
        .pipe(newer(paths.jsVendor.dest))
        .pipe(gulp.dest(paths.jsVendor.dest))
};
/**
 * scssタスクを実行する関数
 */
function style() {//defaultにすると、タスク実行時のタスク名を省略// ★ style.scssファイルを監視
    // style.scssの更新があった場合の処理
    return gulp.src(paths.css.src)
        .pipe(plumber())
        .pipe(newer(paths.css.dest))
        // Sassのコンパイルを実行
        .pipe(
            sass({
                outputStyle: "expanded",
            })
                // Sassのコンパイルエラーを表示
                // (これがないと自動的に止まってしまう)
                .on("error", sass.logError)
        )
        // cssフォルダー以下に保存
        .pipe(gulp.dest(paths.css.dest))
};

/**
 * htmlタスクを実行する関数
 */
function html() {
    return gulp.src(paths.html.src)
        .pipe(plumber())
        .pipe(newer(paths.html.dest))
        .pipe(gulp.dest(paths.html.dest))
};

/**
 * htmlタスクを実行する関数
 */
function img() {
    return gulp.src(paths.img.src)
        .pipe(plumber())
        .pipe(newer(paths.img.dest))
        .pipe(gulp.dest(paths.img.dest))
};

/**
 * ローカルサーバー　browserSync({server: {baseDir: ルートフォルダ}})
 */
const localServer = browserSync.create();
function server(done) {
    localServer.init({
        server: {
            baseDir: 'dist/',
            middleware: [
                connectSSI({
                    baseDir: './dist/',
                    ext: '.html'
                })
            ]
        },
        startPath: "index.html",
    });
    done();
}
/**
 * リロード
 */
function reload(done) {
    localServer.reload();
    done();
}


/**
 * watchタスクを実行する関数
 */

function watch() {
    gulp.watch(paths.js.src, gulp.series(js, reload))//gulp.series jsを順番に実行
    gulp.watch(paths.jsVendor.src, gulp.series(jsPlugin, reload))
    gulp.watch(paths.css.src, gulp.series(style, reload))
    gulp.watch(paths.html.src, gulp.series(html, reload))
    gulp.watch(paths.img.src, gulp.series(img, reload))

}

/**
 * タスク化
 */

exports.watch = watch;// watchタスク
exports.default = gulp.series(gulp.parallel(js, jsPlugin, style, html, img),server,watch); // defaultタスク .parallel並列に実行をする



// gulp.task('プラグイン名',function(){});
// タスク作成　これで囲って中に色々書く

// gulp.src('ディレクトリ名')
// コピー元指定　実行ファイルの場所を指定

// gulp.dest('ディレクトリ名')
// コピー先指定

// .pipe(プラグイン名())
// で処理をつなげて動作。コンパイルなどでファイルが生成される場合

// .pipe(gulp.dest('ディレクトリ名'));
// では吐き出し先を指定

//watch ファイル監視