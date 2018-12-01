/*
 * @Author: guangwei.bao 
 * @Date: 2018-12-01 17:00:26 
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-01 18:19:09
 * @Describe: gulp打包配置
 */
'use strict';

var gulp = require('gulp');
//删除目标目录，目标文件
var del = require('del');
var clean = require('gulp-clean');
//打成一个zip包
var zip = require('gulp-zip');
//js压缩插件
var uglify = require('gulp-uglify');
//合并压缩插件
var concat = require('gulp-concat');
//html 处理
var htmlmin = require('gulp-htmlmin');
var processhtml = require('gulp-processhtml');
//css 处理
var cleanCSS = require('gulp-clean-css');
//css压缩
var cssmin = require('gulp-minify-css');
//文件更名
var rename = require('gulp-rename');
//一个串行方式跑gulp任务的插件
var runSequence = require('run-sequence');
// config json
var config = require('./config.json');
//webserver
var webserver = require('gulp-webserver');
//将管道连接在一起，如果其中一个关闭，就会破坏它们。
var pump = require('pump');
//Gulp plugin to run a webserver (with LiveReload)
//var connect = require('gulp-connect');
//File watcher that uses super-fast chokidar and emits vinyl objects.
// var watch = require('gulp-watch');
//refresh browser
var browserSync = require('browser-sync');
//检测错误
var plumber = require('gulp-plumber');
//图片压缩缓存
var cache = require('gulp-cache');
//图片压缩
var imagemin = require('gulp-imagemin');
//图片深入压缩
var pngquant = require('imagemin-pngquant');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminJpegtran = require('imagemin-jpegtran');

function errrHandler(e) {
	// 控制台发声,错误时beep一下
	gutil.beep();
	gutil.log(e);
	this.emit('end');
}

// 清除dist
gulp.task('clean', function() {
	gulp
		.src(config.output.dist, {
			read: false
		})
		.pipe(clean());
});

// 拷贝文件
gulp.task('copy', function() {
	return gulp.src([ config.input.src ]).pipe(gulp.dest(config.output.dist)).pipe(
		browserSync.reload({
			stream: true
		})
	);
});

// build-dev
gulp.task('build-dev', [ 'copy' ]);

//Streaming gulp plugin to run a local webserver with LiveReload
gulp.task('webserver', function() {
	gulp.src('./www').pipe(
		webserver({
			port: 4200, //端口
			liveload: true, //实时刷新代码。不用f5刷新
			fallback: 'index.html',
			open: true
		})
	);
});

//让浏览器实时、快速响应您的文件
// gulp.task('browserSync', function() {
// 	browserSync({
// 		port: 4200,
// 		server: {
// 			baseDir: './www'
// 		},
// 		ghostMode: {
// 			clicks: true,
// 			location: true,
// 			forms: true,
// 			scroll: true
// 		},
// 		injectChanges: true,
// 		logFileChanges: true,
// 		logLevel: 'info',
// 		notify: true,
// 		reloadDelay: 1000
// 	});
// });

//实时监听
// gulp.task('watch', function() {
// 	gulp.watch(config.input.src, [ 'copy' ]);
// });

// start-dev
gulp.task('start-dev', function(callback) {
	runSequence('build-dev', 'webserver', callback);
});

//压缩html
gulp.task('min-html', function() {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};
	return gulp
		.src([ config.input.html ])
		.pipe(plumber({ errorHandler: errrHandler }))
		.pipe(processhtml())
		.pipe(htmlmin(options))
		.pipe(gulp.dest(config.output.dist)); //gulp dest是输出
});

//压缩css
gulp.task('min-css', function() {
	return (gulp
			.src([ config.input.css ])
			.pipe(plumber({ errorHandler: errrHandler }))
			.pipe(
				cleanCSS({
					compatibility: 'ie8'
				})
			)
			//重命名
			.pipe(
				rename({
					extname: '.css'
				})
			)
			.pipe(
				cssmin({
					advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
					compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
					keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
					keepSpecialComments: '*'
					//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
				})
			)
			.pipe(gulp.dest(config.output.dist)) );
});

//压缩scripts
gulp.task('min-js', function() {
	pump([
		gulp.src([ config.input.scripts ]),
		uglify({
			mangle: { except: [ 'require', 'exports', 'module', '$' ] }, //类型：Boolean 默认：true 是否修改变量名
			compress: true, //类型：Boolean 默认：true 是否完全压缩
			preserveComments: 'false' //保留所有注释
		}),
		//重命名
		//        rename({extname: '.min.js'}),
		//        concat('index.min.js'),
		gulp.dest(config.output.dist)
	]);
});

//压缩图片
gulp.task('min-image', function() {
	gulp
		.src([ config.input.images ])
		.pipe(plumber({ errorHandler: errrHandler }))
		.pipe(
			cache(
				imagemin({
					progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
					svgoPlugins: [ { removeViewBox: false } ], //不要移除svg的viewbox属性
					use: [
						pngquant(),
						imageminJpegtran({ progressive: true }),
						imageminGifsicle({ interlaced: true }),
						imageminOptipng({ optimizationLevel: 3 }),
						imageminSvgo()
					] //使用pngquant深度压缩png图片的imagemin插件
				})
			)
		)
		.pipe(gulp.dest(config.output.dist));
});

// build-prod
gulp.task('build-prod', function(callback) {
	runSequence('copy', 'min-html', 'min-css', 'min-js', 'min-image', callback);
});
// start-prod
gulp.task('start-prod', function(callback) {
	runSequence('build-prod', 'webserver', callback);
});
